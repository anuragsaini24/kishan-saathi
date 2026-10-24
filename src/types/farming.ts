export type Language = 'en' | 'hi';

export type PathogenType = 'Fungal' | 'Bacterial' | 'Viral' | 'Pest' | 'Nutrient Deficiency' | 'Healthy' | 'Environmental';

export type UrgencyLevel = 'Immediate (1-2 days)' | 'Moderate (3-5 days)' | 'Monitoring' | 'None';

export type ConfidenceLevel = 'HIGH' | 'MODERATE' | 'LOW';

export interface CropDiagnosis {
  id: string;
  cropName: string;
  cropNameHindi: string;
  diseaseName: string;
  diseaseNameHindi: string;
  isHealthy: boolean;
  confidenceScore: number; // 0 to 100
  confidenceLevel: ConfidenceLevel;
  pathogenType: PathogenType;
  symptomsSummary: string;
  symptomsSummaryHindi: string;
  affectedLeafArea: string; // e.g., "15% - 25%"
  urgency: UrgencyLevel;
  immediateSafeSteps: string[];
  immediateSafeStepsHindi: string[];
  chemicalRemedies: {
    name: string;
    dosage: string;
    safetyPrecaution: string;
    phiDays?: number; // Pre-Harvest Interval
  }[];
  preventionChecklist: string[];
  preventionChecklistHindi: string[];
  uncertaintyNote: string;
  uncertaintyNoteHindi: string;
  kvkRecommendation: string;
  imageUrl?: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  language?: Language;
  suggestions?: string[];
}

export interface WeatherAdvisory {
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  current: {
    temperature: number;
    relativeHumidity: number;
    windSpeed: number;
    weatherCode: number;
    weatherDescription: string;
    isDay: boolean;
    precipitation: number;
  };
  daily: {
    date: string;
    tempMax: number;
    tempMin: number;
    rainProbability: number;
    precipitationSum: number;
    weatherCode: number;
    weatherDescription: string;
  }[];
  agroIndices: {
    sprayingWindow: {
      status: 'OPTIMAL' | 'MODERATE' | 'NOT_RECOMMENDED';
      message: string;
      messageHindi: string;
      reason: string;
    };
    fungalDiseaseRisk: {
      level: 'LOW' | 'MEDIUM' | 'HIGH';
      score: number; // 0-100
      message: string;
      messageHindi: string;
    };
    irrigationAdvice: {
      action: 'POSTPONE' | 'RECOMMENDED' | 'NORMAL';
      message: string;
      messageHindi: string;
    };
    extremeAlert?: {
      type: 'HEAT' | 'COLD' | 'STORM' | 'RAIN';
      title: string;
      titleHindi: string;
      description: string;
      descriptionHindi: string;
    };
  };
}

export interface CropGuide {
  id: string;
  name: string;
  nameHindi: string;
  scientificName: string;
  category: 'Cereal' | 'Vegetable' | 'Cash Crop' | 'Pulse' | 'Oilseed';
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'All Season';
  durationDays: string;
  idealSoil: string;
  idealSoilHindi: string;
  idealTemp: string;
  wateringGuide: {
    frequency: string;
    criticalStages: string[];
    criticalStagesHindi: string[];
    tips: string;
    tipsHindi: string;
  };
  nutrientManagement: {
    npkRatio: string;
    organicRecommendation: string;
    organicRecommendationHindi: string;
    deficiencySigns: string;
    deficiencySignsHindi: string;
  };
  commonPestsAndDiseases: {
    name: string;
    nameHindi: string;
    type: string;
    organicControl: string;
    organicControlHindi: string;
  }[];
  harvestTips: string;
  harvestTipsHindi: string;
  imageUrl: string;
}

export interface DemoSample {
  id: string;
  title: string;
  titleHindi: string;
  crop: string;
  previewUrl: string;
  svgDataUri?: string;
  diagnosis: CropDiagnosis;
}
