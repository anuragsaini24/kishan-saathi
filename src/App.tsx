import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { CropDoctor } from './components/CropDoctor';
import { VoiceAssistant } from './components/VoiceAssistant';
import { WeatherAlerts } from './components/WeatherAlerts';
import { CropAdvisoryView } from './components/CropAdvisoryView';
import { Footer } from './components/Footer';
import { Language } from './types/farming';

export default function App() {
  const [activeTab, setActiveTab] = useState<'doctor' | 'assistant' | 'weather' | 'advisory'>('doctor');
  const [language, setLanguage] = useState<Language>('hi');
  const [chatInitialQuestion, setChatInitialQuestion] = useState<string>('');

  const handleAskInChat = (question: string) => {
    setChatInitialQuestion(question);
    setActiveTab('assistant');
  };

  return (
    <div className="min-h-screen flex flex-col agri-bg-pattern font-sans antialiased text-stone-900 selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'doctor' && (
          <CropDoctor language={language} onAskInChat={handleAskInChat} />
        )}

        {activeTab === 'assistant' && (
          <VoiceAssistant
            language={language}
            initialQuestion={chatInitialQuestion}
            onClearInitialQuestion={() => setChatInitialQuestion('')}
          />
        )}

        {activeTab === 'weather' && <WeatherAlerts language={language} />}

        {activeTab === 'advisory' && (
          <CropAdvisoryView language={language} onAskInChat={handleAskInChat} />
        )}
      </main>

      {/* Footer */}
      <Footer language={language} />
    </div>
  );
}
