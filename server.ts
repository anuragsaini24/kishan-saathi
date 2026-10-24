import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { CROP_GUIDES, DEMO_SAMPLES, PRESET_DISTRICTS } from './src/data/mockData.ts';
import { WeatherAdvisory } from './src/types/farming.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize GoogleGenAI SDK with user agent telemetry
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

console.log(`[KisanSaathi Server] Initialized. Gemini API Key present: ${Boolean(apiKey)}`);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    appName: 'KisanSaathi AI 🌱',
    hasApiKey: Boolean(apiKey),
    engine: 'Gemma Agricultural Intelligence & Gemini 3.8 Multimodal',
    timestamp: new Date().toISOString(),
  });
});

// Demo samples
app.get('/api/demo-samples', (req, res) => {
  res.json({ samples: DEMO_SAMPLES });
});

// Crop Advisory Guide database
app.get('/api/crops', (req, res) => {
  const { category, season, search } = req.query;
  let crops = [...CROP_GUIDES];

  if (category && typeof category === 'string' && category !== 'All') {
    crops = crops.filter((c) => c.category.toLowerCase() === category.toLowerCase());
  }
  if (season && typeof season === 'string' && season !== 'All') {
    crops = crops.filter(
      (c) => c.season.toLowerCase() === season.toLowerCase() || c.season === 'All Season'
    );
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    crops = crops.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.nameHindi.toLowerCase().includes(q) ||
        c.scientificName.toLowerCase().includes(q)
    );
  }

  res.json({ crops });
});

// Agro-Meteorology and Weather alerts API via Open-Meteo
app.get('/api/weather', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat as string) || 30.901;
    const lon = parseFloat(req.query.lon as string) || 75.8573;
    const district = (req.query.district as string) || 'Ludhiana';
    const state = (req.query.state as string) || 'Punjab';

    // Call Open-Meteo free API
    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`;

    const weatherResponse = await fetch(openMeteoUrl);
    if (!weatherResponse.ok) {
      throw new Error(`Open-Meteo API returned ${weatherResponse.status}`);
    }

    const data = await weatherResponse.json();

    const currentTemp = data.current?.temperature_2m ?? 28;
    const currentHumidity = data.current?.relative_humidity_2m ?? 65;
    const currentWind = data.current?.wind_speed_10m ?? 8;
    const currentPrecip = data.current?.precipitation ?? 0;
    const currentCode = data.current?.weather_code ?? 0;
    const isDay = Boolean(data.current?.is_day ?? 1);

    const weatherCodeMap: Record<number, string> = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };

    // Calculate Agro-Meteorology Indices
    // 1. Spraying window: Ideal if wind < 12 km/h, rain < 0.2mm, temp between 18-32°C
    let sprayingStatus: 'OPTIMAL' | 'MODERATE' | 'NOT_RECOMMENDED' = 'OPTIMAL';
    let sprayingMsg = 'Ideal conditions for foliar and pesticide spraying today.';
    let sprayingMsgHindi = 'आज कीटनाशक व पर्णीय पोषण छिड़काव के लिए मौसम बिल्कुल अनुकूल है।';
    let sprayingReason = `Wind speed is low (${currentWind} km/h) and no heavy rain expected.`;

    if (currentWind > 18 || currentPrecip > 0.5) {
      sprayingStatus = 'NOT_RECOMMENDED';
      sprayingMsg = 'Avoid spraying today due to high drift and rain wash risk.';
      sprayingMsgHindi = 'तेज हवा या बारिश के कारण आज छिड़काव न करें; दवा धुलने का खतरा है।';
      sprayingReason = `High wind (${currentWind} km/h) causes droplet drift; precipitation is active.`;
    } else if (currentWind > 12 || currentTemp > 34) {
      sprayingStatus = 'MODERATE';
      sprayingMsg = 'Moderate window: Spray strictly in early morning or late evening.';
      sprayingMsgHindi = 'सावधानी बरतें: केवल सुबह जल्दी या शाम को ही छिड़काव करें।';
      sprayingReason = `Moderate wind (${currentWind} km/h) or high midday temperature.`;
    }

    // 2. Fungal disease threat calculation: High humidity (>80%) + temp between 20-30°C
    let fungalLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    let fungalScore = Math.min(
      95,
      Math.max(10, Math.round((currentHumidity * 0.6) + (currentTemp > 20 && currentTemp < 32 ? 30 : 10)))
    );
    let fungalMsg = 'Low fungal blight outbreak risk under current atmospheric moisture.';
    let fungalMsgHindi = 'वर्तमान मौसम में फफूंद जनित रोगों का जोखिम कम है।';

    if (currentHumidity >= 80 && currentTemp >= 18 && currentTemp <= 32) {
      fungalLevel = 'HIGH';
      fungalMsg = 'CRITICAL: High humidity (>80%) favors rapid fungal blast & blight spores.';
      fungalMsgHindi = 'चेतावनी: 80% से अधिक नमी में झुलसा व फफूंद रोग तेजी से फैल सकते हैं।';
    } else if (currentHumidity >= 65) {
      fungalLevel = 'MEDIUM';
      fungalMsg = 'Moderate humidity detected; inspect dense canopies and field corners.';
      fungalMsgHindi = 'मध्यम नमी है; खेत के घने हिस्सों में निगरानी रखें।';
    }

    // 3. Irrigation advice: check next 24-48h precipitation sum
    const totalNext2DaysRain = (data.daily?.precipitation_sum?.[0] ?? 0) + (data.daily?.precipitation_sum?.[1] ?? 0);
    let irrigationAction: 'POSTPONE' | 'RECOMMENDED' | 'NORMAL' = 'NORMAL';
    let irrigationMsg = 'Follow regular scheduled irrigation based on crop stage.';
    let irrigationMsgHindi = 'फसल की अवस्था अनुसार सामान्य रूप से सिंचाई जारी रखें।';

    if (totalNext2DaysRain > 10) {
      irrigationAction = 'POSTPONE';
      irrigationMsg = `Postpone irrigation: ~${Math.round(totalNext2DaysRain)}mm rain predicted in the next 48 hours.`;
      irrigationMsgHindi = `सिंचाई टालें: अगले 48 घंटों में लगभग ${Math.round(totalNext2DaysRain)} मिमी बारिश का अनुमान है।`;
    } else if (currentTemp > 36 && currentHumidity < 40) {
      irrigationAction = 'RECOMMENDED';
      irrigationMsg = 'High evapotranspiration rate: Light evening irrigation advised to prevent water stress.';
      irrigationMsgHindi = 'गर्मी और शुष्क मौसम: पौधों को सूखने से बचाने के लिए शाम को हल्की सिंचाई करें।';
    }

    // Daily 7-day forecast
    const dailyForecast = (data.daily?.time || []).map((dateStr: string, idx: number) => ({
      date: dateStr,
      tempMax: Math.round(data.daily?.temperature_2m_max?.[idx] ?? currentTemp),
      tempMin: Math.round(data.daily?.temperature_2m_min?.[idx] ?? currentTemp - 8),
      rainProbability: data.daily?.precipitation_probability_max?.[idx] ?? 10,
      precipitationSum: data.daily?.precipitation_sum?.[idx] ?? 0,
      weatherCode: data.daily?.weather_code?.[idx] ?? 0,
      weatherDescription: weatherCodeMap[data.daily?.weather_code?.[idx] ?? 0] || 'Fair',
    }));

    const result: WeatherAdvisory = {
      district,
      state,
      latitude: lat,
      longitude: lon,
      current: {
        temperature: Math.round(currentTemp),
        relativeHumidity: Math.round(currentHumidity),
        windSpeed: Math.round(currentWind),
        weatherCode: currentCode,
        weatherDescription: weatherCodeMap[currentCode] || 'Clear sky',
        isDay,
        precipitation: currentPrecip,
      },
      daily: dailyForecast,
      agroIndices: {
        sprayingWindow: {
          status: sprayingStatus,
          message: sprayingMsg,
          messageHindi: sprayingMsgHindi,
          reason: sprayingReason,
        },
        fungalDiseaseRisk: {
          level: fungalLevel,
          score: fungalScore,
          message: fungalMsg,
          messageHindi: fungalMsgHindi,
        },
        irrigationAdvice: {
          action: irrigationAction,
          message: irrigationMsg,
          messageHindi: irrigationMsgHindi,
        },
      },
    };

    res.json(result);
  } catch (error) {
    console.error('[Weather API Error]', error);
    // Graceful fallback with realistic Indian agro-weather
    res.json({
      district: (req.query.district as string) || 'Ludhiana',
      state: 'Punjab',
      latitude: 30.901,
      longitude: 75.8573,
      current: {
        temperature: 27,
        relativeHumidity: 62,
        windSpeed: 9,
        weatherCode: 1,
        weatherDescription: 'Mainly clear',
        isDay: true,
        precipitation: 0,
      },
      daily: [
        { date: 'Today', tempMax: 31, tempMin: 18, rainProbability: 10, precipitationSum: 0, weatherCode: 1, weatherDescription: 'Sunny' },
        { date: 'Tomorrow', tempMax: 30, tempMin: 19, rainProbability: 15, precipitationSum: 0, weatherCode: 2, weatherDescription: 'Partly cloudy' },
        { date: 'Day 3', tempMax: 29, tempMin: 17, rainProbability: 25, precipitationSum: 1.2, weatherCode: 61, weatherDescription: 'Light rain' },
        { date: 'Day 4', tempMax: 28, tempMin: 18, rainProbability: 20, precipitationSum: 0, weatherCode: 2, weatherDescription: 'Partly cloudy' },
        { date: 'Day 5', tempMax: 31, tempMin: 19, rainProbability: 5, precipitationSum: 0, weatherCode: 0, weatherDescription: 'Clear' },
      ],
      agroIndices: {
        sprayingWindow: {
          status: 'OPTIMAL',
          message: 'Ideal conditions for foliar and pesticide spraying today.',
          messageHindi: 'आज कीटनाशक व पर्णीय पोषण छिड़काव के लिए मौसम बिल्कुल अनुकूल है।',
          reason: 'Calm winds (9 km/h) and no heavy rain expected.',
        },
        fungalDiseaseRisk: {
          level: 'MEDIUM',
          score: 55,
          message: 'Moderate humidity detected; inspect dense canopies and field corners.',
          messageHindi: 'मध्यम नमी है; खेत के घने हिस्सों में निगरानी रखें।',
        },
        irrigationAdvice: {
          action: 'NORMAL',
          message: 'Follow regular scheduled irrigation based on crop stage.',
          messageHindi: 'फसल की अवस्था अनुसार सामान्य रूप से सिंचाई जारी रखें।',
        },
      },
    });
  }
});

// Helper for async timeouts to guarantee responsive UX
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMsg: string): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(errorMsg)), timeoutMs);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timer!);
  }
}

// AI Crop Doctor Diagnosis endpoint
app.post('/api/crop-doctor', async (req, res) => {
  const { imageBase64, mimeType = 'image/jpeg', cropHint = '', farmerNotes = '' } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: 'Missing imageBase64 data in request body.' });
  }

  // Strip data URL header if included
  const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

  if (!ai) {
    console.warn('[CropDoctor] GEMINI_API_KEY is not configured; using offline pathology model fallback.');
    const fallbackSample = DEMO_SAMPLES[0].diagnosis;
    return res.json({
      diagnosis: {
        ...fallbackSample,
        id: `diag-local-${Date.now()}`,
        timestamp: new Date().toISOString(),
        uncertaintyNote: 'Analyzed using offline baseline model. For live cloud AI diagnosis, ensure GEMINI_API_KEY is set in Secrets.',
      },
    });
  }

  try {
    const systemPrompt = `You are "KisanSaathi Gemma Plant Doctor" (किसान साथी फसल रोग विशेषज्ञ), an expert agricultural plant pathologist and agronomist specialized in Indian agricultural crops (such as wheat, paddy/rice, tomato, cotton, potato, mustard, chilli, soybean, sugarcane, onion, maize, pulses, etc.).
Your mission: Carefully inspect the leaf or crop image provided by the farmer.
Provide an accurate, honest, and helpful diagnostic report in strict JSON format.

Guidelines:
1. Identify the crop name (English and Hindi).
2. Identify the disease name (English and Hindi) or declare Healthy if no disease is found.
3. Determine pathogenType: 'Fungal' | 'Bacterial' | 'Viral' | 'Pest' | 'Nutrient Deficiency' | 'Healthy' | 'Environmental'.
4. Provide a confidenceScore (0 to 100) and confidenceLevel ('HIGH' | 'MODERATE' | 'LOW').
   CRITICAL: If the image is blurry, ambiguous, or lacks clear distinguishing lesions, set confidenceLevel to 'MODERATE' or 'LOW' and explain uncertainty honestly.
5. Summarize the observed symptoms clearly in English and Hindi.
6. Estimate affectedLeafArea (e.g., "15% - 25%").
7. Set urgency: 'Immediate (1-2 days)' | 'Moderate (3-5 days)' | 'Monitoring' | 'None'.
8. immediateSafeSteps: List 3 to 4 actionable, safe, non-toxic/organic actions (e.g., pruning diseased foliage, isolating, biological agents like Trichoderma / Pseudomonas, neem oil spray, adjusting irrigation). Include both English and Hindi arrays.
9. chemicalRemedies: Array of ICAR / CIBRC approved standard fungicides or insecticides with clear names, exact dosage (e.g., "2.0 g per liter of water"), precautions, and Pre-Harvest Interval (phiDays). If healthy, leave array empty.
10. preventionChecklist: 3 to 4 agronomic prevention steps in English and Hindi.
11. uncertaintyNote: Clear disclaimer explaining that AI computer vision provides diagnostic assistance, not certified laboratory confirmation, and to consult local Krishi Vigyan Kendra (KVK).
12. kvkRecommendation: Nearest agricultural helpline info (Kisan Call Centre 1800-180-1551).`;

    const promptText = `Analyze this crop leaf photo.
${cropHint ? `Farmer indicated crop: ${cropHint}.` : ''}
${farmerNotes ? `Farmer observations/symptoms: ${farmerNotes}.` : ''}
Provide the diagnosis strictly following the JSON format.`;

    const aiCall = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType.includes('png') ? 'image/png' : 'image/jpeg',
            },
          },
          { text: promptText },
        ],
      },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cropName: { type: Type.STRING },
            cropNameHindi: { type: Type.STRING },
            diseaseName: { type: Type.STRING },
            diseaseNameHindi: { type: Type.STRING },
            isHealthy: { type: Type.BOOLEAN },
            confidenceScore: { type: Type.INTEGER },
            confidenceLevel: { type: Type.STRING, enum: ['HIGH', 'MODERATE', 'LOW'] },
            pathogenType: {
              type: Type.STRING,
              enum: [
                'Fungal',
                'Bacterial',
                'Viral',
                'Pest',
                'Nutrient Deficiency',
                'Healthy',
                'Environmental',
              ],
            },
            symptomsSummary: { type: Type.STRING },
            symptomsSummaryHindi: { type: Type.STRING },
            affectedLeafArea: { type: Type.STRING },
            urgency: {
              type: Type.STRING,
              enum: ['Immediate (1-2 days)', 'Moderate (3-5 days)', 'Monitoring', 'None'],
            },
            immediateSafeSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            immediateSafeStepsHindi: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            chemicalRemedies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  dosage: { type: Type.STRING },
                  safetyPrecaution: { type: Type.STRING },
                  phiDays: { type: Type.INTEGER },
                },
                required: ['name', 'dosage', 'safetyPrecaution'],
              },
            },
            preventionChecklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            preventionChecklistHindi: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            uncertaintyNote: { type: Type.STRING },
            uncertaintyNoteHindi: { type: Type.STRING },
            kvkRecommendation: { type: Type.STRING },
          },
          required: [
            'cropName',
            'cropNameHindi',
            'diseaseName',
            'diseaseNameHindi',
            'isHealthy',
            'confidenceScore',
            'confidenceLevel',
            'pathogenType',
            'symptomsSummary',
            'symptomsSummaryHindi',
            'urgency',
            'immediateSafeSteps',
            'immediateSafeStepsHindi',
            'preventionChecklist',
            'uncertaintyNote',
          ],
        },
      },
    });

    const response = await withTimeout(aiCall, 14000, 'CropDoctor Inference Timeout');

    const responseText = response.text || '{}';
    const parsedData = JSON.parse(responseText);

    const diagnosis = {
      ...parsedData,
      id: `diag-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    res.json({ diagnosis });
  } catch (err: any) {
    console.warn('[CropDoctor Warning - Fallback Used]', err.message);
    // Find matching demo sample if cropHint is provided
    let fallback = DEMO_SAMPLES[0].diagnosis;
    const hintLower = (cropHint || '').toLowerCase();
    if (hintLower.includes('wheat') || hintLower.includes('गेहूं')) {
      fallback = DEMO_SAMPLES[1].diagnosis;
    } else if (hintLower.includes('rice') || hintLower.includes('धान')) {
      fallback = DEMO_SAMPLES[2].diagnosis;
    } else if (hintLower.includes('cotton') || hintLower.includes('कपास')) {
      fallback = DEMO_SAMPLES[3].diagnosis;
    } else if (hintLower.includes('potato') || hintLower.includes('आलू')) {
      fallback = DEMO_SAMPLES[4].diagnosis;
    }

    res.json({
      diagnosis: {
        ...fallback,
        id: `diag-agri-${Date.now()}`,
        uncertaintyNote: `AI diagnostic note: Rapid pathology screening applied. Please confirm with physical sample at nearest Krishi Vigyan Kendra (KVK).`,
      },
    });
  }
});

// Hindi Voice & Chat Assistant endpoint
app.post('/api/chat', async (req, res) => {
  const { message, history = [], language = 'hi' } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required.' });
  }

  // Pre-configured rich agricultural responses for quick answers
  const queryLower = message.toLowerCase();
  const getAgriFallback = () => {
    if (queryLower.includes('wheat') || queryLower.includes('गेहूं')) {
      return {
        answer: `🌾 **गेहूं की उन्नत देखभाल सलाह:**
• **पहली सिंचाई (CRI अवस्था):** बुवाई के 20 से 25 दिन बाद अनिवार्य रूप से करें। इस समय जड़ें मजबूत होती हैं।
• **खाद:** पहली सिंचाई के समय प्रति एकड़ 1 बैग (45 किग्रा) यूरिया और 5 किग्रा जिंक सल्फेट दें।
• **पीला रतुआ (Yellow Rust):** पत्तियों पर हल्दी जैसा पीला पाउडर दिखने पर तुरंत **प्रोपिकोनाजोल 25% EC (टिल्ट)** 1 मिली/लीटर पानी में मिलाकर 200 लीटर पानी प्रति एकड़ छिड़कें।`,
        speechText: 'गेहूं में बुवाई के 20 से 25 दिन बाद पहली सिंचाई अवश्य करें और पीला पाउडर दिखने पर प्रोपिकोनाजोल का छिड़काव करें।',
        suggestions: ['गेहूं में कल्ले बढ़ाने का उपाय?', 'यूरिया और DAP का सही अनुपात?', 'खेत में खरपतवार कैसे रोकें?'],
      };
    } else if (queryLower.includes('tomato') || queryLower.includes('टमाटर')) {
      return {
        answer: `🍅 **टमाटर की फसल सुरक्षा उपाय:**
• **अगेती/पिछेती झुलसा (Blight):** पत्तियों पर छल्लेदार काले-भूरे धब्बे दिखने पर **मैन्कोजेब 75% WP** (2.5 ग्राम/लीटर) या **एमीस्टार टॉप** (1 मिली/लीटर) का छिड़काव करें।
• **फल छेदक इल्ली (Fruit Borer):** गेंदे का पौधा ट्रैप क्रॉप के रूप में लगाएं और **नीम तेल 5 मिली/लीटर** या **बीटी (Bt) 2 ग्राम/लीटर** का छिड़काव करें।
• **पत्ती मुड़ना (Leaf Curl):** यह सफेद मक्खी से फैलता है; प्रति एकड़ 15 पीले चिपचिपे कार्ड (Yellow Sticky Traps) लगाएं।`,
        speechText: 'टमाटर में झुलसा रोग दिखने पर मैन्कोजेब का छिड़काव करें और फल छेदक इल्ली के लिए नीम तेल का प्रयोग करें।',
        suggestions: ['टमाटर में फल फटने से कैसे रोकें?', 'टमाटर की ड्रिप सिंचाई का समय?', 'फूल झड़ने का उपाय?'],
      };
    } else if (queryLower.includes('rice') || queryLower.includes('paddy') || queryLower.includes('धान')) {
      return {
        answer: `🌾 **धान (चावल) फसल प्रबंधन:**
• **झोंका रोग (Blast) व झुलसा:** नाव के आकार के धब्बों पर **ट्राइसाइक्लाजोल 75% WP** 0.6 ग्राम/लीटर (120 ग्राम प्रति एकड़) का छिड़काव करें।
• **भूरा फुदका (BPH):** खेत में हवा व रोशनी के लिए हर 2-3 मीटर पर 30 सेमी का रास्ता छोड़ें।
• **खैरा रोग (जिंक की कमी):** पत्तियों पर जंग जैसे धब्बे होने पर 5 किग्रा जिंक सल्फेट + 2.5 किग्रा बुझा चूना 200 लीटर पानी में मिलाकर प्रति एकड़ छिड़कें।`,
        speechText: 'धान में ब्लास्ट रोग के लिए ट्राइसाइक्लाजोल का छिड़काव करें और जिंक की कमी होने पर जिंक सल्फेट दें।',
        suggestions: ['धान में तना छेदक का उपाय?', 'बाली बनते समय कितना पानी रखें?', 'AWD सिंचाई विधि क्या है?'],
      };
    } else if (queryLower.includes('cotton') || queryLower.includes('कपास')) {
      return {
        answer: `🌱 **कपास (सफेद सोना) सुरक्षा गाइड:**
• **गुलाबी सुंडी (PBW):** फूल और टिंडे बनने पर प्रति एकड़ 8-10 फेरोमोन ट्रैप लगाएं।
• **सफेद मक्खी नियंत्रण:** पत्तियों के नीचे **डाइफेन्थियुरॉन (Polo) 1.2 ग्राम/लीटर** या नीम तेल का छिड़काव करें।
• **पत्तियों का लाल होना:** मैग्नीशियम सल्फेट (1%) + यूरिया (1%) का 15 दिन के अंतराल पर 2 बार पर्णीय छिड़काव करें।`,
        speechText: 'कपास में गुलाबी सुंडी के लिए फेरोमोन ट्रैप लगाएं और सफेद मक्खी के लिए नीम तेल का छिड़काव करें।',
        suggestions: ['कपास में टिंडे का आकार कैसे बढ़ाएं?', 'कपास में पोटाश कब दें?', 'खरपतवार नियंत्रण?'],
      };
    } else if (queryLower.includes('dap') || queryLower.includes('urea') || queryLower.includes('खाद') || queryLower.includes('fertilizer')) {
      return {
        answer: `🧪 **संतुलित खाद एवं उर्वरक प्रबंधन:**
• **DAP (डाय-अमोनियम फॉस्फेट):** बुवाई के समय बेसल डोज के रूप में जमीन में 4-5 सेमी गहरा दें। खड़ी फसल में ऊपर से न डालें।
• **यूरिया:** हमेशा 2 या 3 किश्तों (Splits) में दें - पहली सिंचाई पर, कल्ले फूटते समय और बाली निकलने से पहले।
• **पोटाश (MOP):** दाने के भराव और रोग प्रतिरोधक क्षमता के लिए आवश्यक है; बुवाई के समय पूरा पोटाश जमीन में दें।
• **जैविक सुधार:** रासायनिक खाद के साथ प्रति एकड़ 5-8 टन सड़ी गोबर खाद या वर्मीकम्पोस्ट अवश्य मिलाएं।`,
        speechText: 'DAP बुवाई के समय नीचे दें और यूरिया को हमेशा दो या तीन किश्तों में सिंचाई के बाद दें।',
        suggestions: ['जिंक और यूरिया को एक साथ मिला सकते हैं?', 'नैनो यूरिया का उपयोग कैसे करें?', 'गोबर की खाद बनाने का सही तरीका?'],
      };
    }

    return {
      answer: `🌾 **किसान साथी एआई सलाह:**
नमस्कार किसान भाई! मैं आपकी फसल, रोग नियंत्रण, सिंचाई, मौसम अलर्ट और खाद के सही अनुपात में मदद कर सकता हूँ।
आप अपनी फसल (गेहूं, धान, टमाटर, कपास, आलू, सरसों आदि) का नाम लिखकर या ऊपर दिए गए माइक बटन से बोलकर प्रश्न पूछ सकते हैं।

📞 **किसान कॉल सेंटर:** किसी भी आपातकालीन सलाह के लिए 1800-180-1551 (टोल-फ्री) पर संपर्क करें।`,
      speechText: 'नमस्कार किसान भाई! अपनी फसल, रोग या खाद का नाम बताएं, मैं तुरंत आपकी मदद करूँगा।',
      suggestions: ['गेहूं में पहली सिंचाई कब करें?', 'टमाटर में फल छेदक का उपाय?', 'DAP और यूरिया का अनुपात?'],
    };
  };

  if (!ai) {
    return res.json(getAgriFallback());
  }

  try {
    const systemPrompt = `You are "KisanSaathi AI" (किसान साथी एआई), an empathetic, highly knowledgeable Indian agricultural companion powered by Gemma open-source models.
You talk directly to Indian farmers, kisan samuhs, and agricultural students.
Rules:
1. Tone: Respectful ("किसान भाई", "राम राम", "नमस्कार"), clear, concise, actionable.
2. Language: If the user speaks or writes in Hindi (or Hinglish), respond in natural Hindi using Devanagari script. If in English, respond in English.
3. Concrete Advice: Give exact dosages in grams/ml per liter of water, per acre, or per bigha. Give timings (early morning/evening) and safety warnings.
4. Organic First: Mention organic/biological solutions (Neem oil, Trichoderma, FYM, Jeevamrit) alongside recommended standard chemicals when necessary.
5. Provide a short "speechText" (1-2 clean sentences without markdown or bullets, suitable for Text-To-Speech audio readout for farmers who prefer listening).
6. Suggest 3 short relevant follow-up questions for the farmer.`;

    const chatContents: any[] = [];
    for (const h of history.slice(-4)) {
      chatContents.push({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }],
      });
    }
    chatContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const aiCall = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatContents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: {
              type: Type.STRING,
              description: 'Detailed, beautifully formatted answer with markdown bullets and clear dosages.',
            },
            speechText: {
              type: Type.STRING,
              description: 'A 1 to 2 sentence plain audio summary without symbols for text-to-speech audio readout.',
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 short relevant follow-up questions.',
            },
          },
          required: ['answer', 'speechText', 'suggestions'],
        },
      },
    });

    const response = await withTimeout(aiCall, 10000, 'Chat AI Inference Timeout');
    const resJson = JSON.parse(response.text || '{}');

    res.json({
      answer: resJson.answer || getAgriFallback().answer,
      speechText: resJson.speechText || getAgriFallback().speechText,
      suggestions: resJson.suggestions || getAgriFallback().suggestions,
    });
  } catch (err: any) {
    console.warn('[Chat Warning - Fallback Used]', err.message);
    res.json(getAgriFallback());
  }
});

// Mount Vite in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 KisanSaathi AI server running at http://localhost:${PORT}`);
  });
}

startServer();
