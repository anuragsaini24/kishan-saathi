import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  RefreshCw,
  HelpCircle,
  CornerDownLeft,
  Volume,
  Lightbulb,
} from 'lucide-react';
import { ChatMessage, Language } from '../types/farming';
import { VoiceService } from '../utils/speech';

interface VoiceAssistantProps {
  language: Language;
  initialQuestion?: string;
  onClearInitialQuestion?: () => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  language,
  initialQuestion,
  onClearInitialQuestion,
}) => {
  const isHi = language === 'hi';
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const [inputMessage, setInputMessage] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-01',
      role: 'assistant',
      content: isHi
        ? `राम-राम किसान भाई! 🙏 मैं आपका **किसान साथी एआई (KisanSaathi)** हूँ।
आप मुझसे खेती, फसल रोग, खाद (यूरिया/DAP) का सही समय, सिंचाई और कीट नियंत्रण के बारे में हिन्दी या अंग्रेजी में बोलकर या लिखकर पूछ सकते हैं।

नीचे दिए गए माइक्रोफोन बटन को दबाकर सीधे बोलें, या प्रश्न टाइप करें।`
        : `Greetings farmer! 🙏 I am your **KisanSaathi AI**, powered by Gemma open-source models.
You can ask me questions regarding crop health, pest control (IPM), fertilizer schedules (NPK/DAP/Urea), watering, or government schemes in Hindi or English using voice or text.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        isHi ? 'गेहूं में पहली सिंचाई (CRI) कब करें?' : 'When to do first irrigation in wheat?',
        isHi ? 'टमाटर में फल छेदक इल्ली का जैविक उपाय?' : 'Organic control for tomato fruit borer?',
        isHi ? 'DAP और यूरिया का सही अनुपात क्या है?' : 'Balanced NPK ratio for paddy?',
      ],
    },
  ]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechActiveId, setSpeechActiveId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // If initialQuestion is provided from another tab, trigger it
  useEffect(() => {
    if (initialQuestion) {
      sendMessage(initialQuestion);
      if (onClearInitialQuestion) {
        onClearInitialQuestion();
      }
    }
  }, [initialQuestion]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const startVoiceInput = () => {
    setMicError(null);

    if (!VoiceService.isSpeechRecognitionSupported()) {
      setMicError(
        isHi
          ? 'आपके ब्राउज़र में वॉइस रिकॉग्निशन सपोर्ट नहीं है। कृपया टाइप करके पूछें।'
          : 'Voice recognition not supported in this browser. Please type your question.'
      );
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const rec = VoiceService.createRecognition(
        language,
        (text, isFinal) => {
          setInputMessage(text);
          if (isFinal && text.trim().length > 2) {
            setIsListening(false);
            sendMessage(text);
          }
        },
        (err) => {
          console.warn('Speech error:', err);
          setIsListening(false);
          setMicError(
            isHi
              ? 'आवाज नहीं सुनी जा सकी। कृपया माइक्रोफोन की अनुमति जांचें या दोबारा बोलें।'
              : 'Could not hear audio. Please check microphone permission and try again.'
          );
        },
        () => {
          setIsListening(false);
        }
      );

      if (rec) {
        recognitionRef.current = rec;
        rec.start();
        setIsListening(true);
      }
    } catch (err: any) {
      console.error('Error starting recognition:', err);
      setIsListening(false);
      setMicError(err.message || 'Microphone error');
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setInputMessage('');
    setMicError(null);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          language,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `assist-${Date.now()}`,
        role: 'assistant',
        content: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: data.suggestions || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Automatically speak short summary if speechText is available and user used voice
      if (data.speechText && isListening) {
        VoiceService.speak(data.speechText, language);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `assist-fallback-${Date.now()}`,
        role: 'assistant',
        content: isHi
          ? `🌾 **किसान साथी सलाह:**
आपके सवाल के लिए धन्यवाद। कृपया संतुलित खाद व उचित जल निकास का ध्यान रखें। विस्तृत जानकारी के लिए किसान कॉल सेंटर टोल-फ्री **1800-180-1551** पर संपर्क करें।`
          : `🌾 **KisanSaathi Advice:**
Thank you for your query. Maintain balanced NPK fertilizers and adequate drainage. For immediate local assistance, dial the Kisan Call Centre Toll-Free: **1800-180-1551**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          isHi ? 'गेहूं में पहली सिंचाई' : 'Wheat irrigation schedule',
          isHi ? 'कीट नियंत्रण उपाय' : 'Pest control remedies',
        ],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakMessage = (msgId: string, content: string) => {
    if (speechActiveId === msgId) {
      VoiceService.stopSpeaking();
      setSpeechActiveId(null);
      return;
    }

    setSpeechActiveId(msgId);
    VoiceService.speak(content, language, () => {
      setSpeechActiveId(null);
    });
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 rounded-3xl p-6 text-white shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Gemma 2 Open Models • Multilingual Agri Chat</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">
            {isHi ? 'किसान साथी बोल (आवाज व चैट)' : 'KisanSaathi Hindi & English Voice Assistant'}
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm">
            {isHi
              ? 'खेती-किसानी का कोई भी सवाल हिन्दी या अंग्रेजी में पूछें।'
              : 'Ask any farming, pesticide, fertilizer or irrigation query with voice or text.'}
          </p>
        </div>

        {/* Quick Voice Mode Indicator */}
        <div className="flex items-center gap-2">
          <button
            onClick={isListening ? stopVoiceInput : startVoiceInput}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30 ring-4 ring-rose-400/30'
                : 'bg-amber-400 hover:bg-amber-300 text-stone-900'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4" />
                <span>{isHi ? 'सुन रहा हूँ... (रोकें)' : 'Listening... (Stop)'}</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>{isHi ? 'बोलकर पूछें' : 'Speak Now'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200/80 overflow-hidden flex flex-col h-[600px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isSpeakingThis = speechActiveId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 items-start ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-xs ${
                    isUser
                      ? 'bg-stone-700'
                      : 'bg-gradient-to-tr from-emerald-600 to-lime-500'
                  }`}
                >
                  {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm shadow-xs ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-stone-50 border border-stone-200/80 text-stone-800 rounded-tl-none space-y-2'
                  }`}
                >
                  {/* Content with simple formatted line breaks */}
                  <div className="leading-relaxed whitespace-pre-line font-sans">
                    {msg.content}
                  </div>

                  {/* Assistant Footer: Audio & Copy Buttons */}
                  {!isUser && (
                    <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-[11px] text-stone-500">
                      <span>{msg.timestamp}</span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleSpeakMessage(msg.id, msg.content)}
                          className={`p-1.5 rounded-lg hover:bg-stone-200/70 transition-colors cursor-pointer ${
                            isSpeakingThis ? 'text-emerald-700 bg-emerald-100' : 'text-stone-600'
                          }`}
                          title="Listen aloud / आवाज में सुनें"
                        >
                          {isSpeakingThis ? (
                            <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="p-1.5 rounded-lg hover:bg-stone-200/70 transition-colors cursor-pointer text-stone-600"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {isUser && (
                    <div className="text-[10px] text-emerald-100 text-right pt-1">
                      {msg.timestamp}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-lime-500 flex items-center justify-center text-white shrink-0">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="bg-stone-50 border border-stone-200/80 rounded-2xl rounded-tl-none p-3.5 text-xs text-stone-600 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>{isHi ? 'किसान साथी सोच रहा है...' : 'KisanSaathi is formulating advice...'}</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Quick Questions Chips */}
        {messages[messages.length - 1]?.suggestions &&
          messages[messages.length - 1].suggestions!.length > 0 &&
          !isLoading && (
            <div className="px-4 py-2 bg-stone-50/70 border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-amber-500" />
                {isHi ? 'सुझाव:' : 'Suggested:'}
              </span>
              {messages[messages.length - 1].suggestions!.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(sug)}
                  className="shrink-0 text-xs bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:border-emerald-400 px-3 py-1 rounded-full font-medium transition-colors cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

        {/* Voice Listening Wave Indicator */}
        {isListening && (
          <div className="bg-rose-50 border-t border-rose-200 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-bold text-rose-800">
                {isHi ? 'सुन रहा हूँ... अपनी भाषा में बोलें' : 'Listening... Speak in Hindi or English'}
              </span>
            </div>
            <button
              onClick={stopVoiceInput}
              className="text-xs font-semibold text-rose-700 hover:text-rose-900 underline cursor-pointer"
            >
              {isHi ? 'रोकें' : 'Done'}
            </button>
          </div>
        )}

        {micError && (
          <div className="bg-amber-50 border-t border-amber-200 px-4 py-2 text-xs text-amber-800">
            {micError}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-stone-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Mic Button */}
            <button
              type="button"
              onClick={isListening ? stopVoiceInput : startVoiceInput}
              className={`p-3 rounded-2xl transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
              title={isListening ? 'Stop listening' : 'Speak using microphone'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Input field */}
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                isHi
                  ? 'अपना सवाल लिखें या माइक दबाकर बोलें...'
                  : 'Type your farming question or tap mic...'
              }
              className="flex-1 text-sm bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className={`p-3 rounded-2xl transition-all cursor-pointer ${
                isLoading || !inputMessage.trim()
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              }`}
              title="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
