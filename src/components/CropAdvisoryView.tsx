import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Droplets,
  Layers,
  Bug,
  Sparkles,
  Volume2,
  VolumeX,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Filter,
  Calendar,
  Thermometer,
  Compass,
} from 'lucide-react';
import { CropGuide, Language } from '../types/farming';
import { CROP_GUIDES } from '../data/mockData';
import { VoiceService } from '../utils/speech';

interface CropAdvisoryViewProps {
  language: Language;
  onAskInChat: (question: string) => void;
}

export const CropAdvisoryView: React.FC<CropAdvisoryViewProps> = ({
  language,
  onAskInChat,
}) => {
  const isHi = language === 'hi';

  const [selectedCrop, setSelectedCrop] = useState<CropGuide>(CROP_GUIDES[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSeason, setSelectedSeason] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const seasons = ['All', 'Kharif', 'Rabi', 'Zaid', 'All Season'];
  const categories = ['All', 'Cereal', 'Vegetable', 'Cash Crop', 'Oilseed'];

  const filteredCrops = CROP_GUIDES.filter((crop) => {
    const matchesSearch =
      crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.nameHindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.scientificName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeason =
      selectedSeason === 'All' ||
      crop.season === selectedSeason ||
      crop.season === 'All Season';

    const matchesCategory =
      selectedCategory === 'All' || crop.category === selectedCategory;

    return matchesSearch && matchesSeason && matchesCategory;
  });

  const toggleSpeech = () => {
    if (isSpeaking) {
      VoiceService.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    if (!selectedCrop) return;

    let text = '';
    if (isHi) {
      text = `${selectedCrop.nameHindi} की फसल सलाह: उपयुक्त मिट्टी: ${selectedCrop.idealSoilHindi}। मुख्य सिंचाई: ${selectedCrop.wateringGuide.tipsHindi}। खाद व पोषण: ${selectedCrop.nutrientManagement.organicRecommendationHindi}।`;
    } else {
      text = `${selectedCrop.name} crop advisory: Ideal soil: ${selectedCrop.idealSoil}. Irrigation tip: ${selectedCrop.wateringGuide.tips}. Nutrient management: ${selectedCrop.nutrientManagement.organicRecommendation}.`;
    }

    setIsSpeaking(true);
    VoiceService.speak(text, language, () => setIsSpeaking(false));
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-green-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>ICAR & Agronomy Field Protocols</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isHi ? 'फसल मार्गदर्शिका एवं सलाह' : 'Crop Advisory & Field Guides'}
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            {isHi
              ? 'बुवाई से लेकर कटाई तक - महत्वपूर्ण सिंचाई अवस्थाएं, संतुलित एनपीके खाद, जैविक कीट नियंत्रण और सुरक्षित भंडारण।'
              : 'Complete agronomic playbook: critical irrigation milestones, balanced soil fertilization, organic IPM bio-controls, and harvesting.'}
          </p>
        </div>

        {/* Audio Listen */}
        <button
          onClick={toggleSpeech}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer ${
            isSpeaking
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
          }`}
        >
          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
          <span>{isHi ? 'मार्गदर्शिका सुनें' : 'Listen Guide'}</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/80 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                isHi ? 'फसल खोजें (गेहूं, धान, टमाटर, कपास...)' : 'Search crop (Wheat, Rice, Tomato, Cotton...)'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors"
            />
          </div>

          {/* Season Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
              {isHi ? 'मौसम:' : 'Season:'}
            </span>
            {seasons.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSeason(s)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedSeason === s
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {s === 'All' ? (isHi ? 'सभी मौसम' : 'All') : s}
              </button>
            ))}
          </div>
        </div>

        {/* Crops Horizontal Thumbnails */}
        <div className="flex items-center gap-3 overflow-x-auto pt-1 pb-2 scrollbar-none">
          {filteredCrops.map((crop) => {
            const isSelected = selectedCrop.id === crop.id;
            return (
              <button
                key={crop.id}
                onClick={() => setSelectedCrop(crop)}
                className={`flex items-center gap-3 p-2.5 rounded-2xl border shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                    : 'border-stone-200 hover:border-emerald-300 bg-stone-50/50'
                }`}
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-stone-200">
                  <img
                    src={crop.imageUrl}
                    alt={crop.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left pr-2">
                  <p className="text-xs font-extrabold text-stone-900">
                    {isHi ? crop.nameHindi : crop.name}
                  </p>
                  <p className="text-[10px] text-stone-500">{crop.season} • {crop.category}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Crop Detail View */}
      {selectedCrop && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Crop Quick Summary & Hero (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-5">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-inner">
                <img
                  src={selectedCrop.imageUrl}
                  alt={selectedCrop.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                  <span className="text-xs font-semibold bg-emerald-600/90 px-2 py-0.5 rounded-md inline-block w-max mb-1">
                    {selectedCrop.category}
                  </span>
                  <h2 className="text-xl font-black">
                    {isHi ? selectedCrop.nameHindi : selectedCrop.name}
                  </h2>
                  <p className="text-xs text-stone-300 italic">{selectedCrop.scientificName}</p>
                </div>
              </div>

              {/* Quick Agronomic Parameters */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                  <span className="text-stone-500 font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    {isHi ? 'फसल अवधि:' : 'Duration:'}
                  </span>
                  <span className="font-bold text-stone-900">{selectedCrop.durationDays}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                  <span className="text-stone-500 font-medium flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                    {isHi ? 'उपयुक्त तापमान:' : 'Ideal Temp:'}
                  </span>
                  <span className="font-bold text-stone-900">{selectedCrop.idealTemp}</span>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 space-y-1">
                  <span className="text-stone-500 font-medium flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-teal-600" />
                    {isHi ? 'उपयुक्त मिट्टी:' : 'Ideal Soil:'}
                  </span>
                  <p className="font-bold text-stone-900 text-xs">
                    {isHi ? selectedCrop.idealSoilHindi : selectedCrop.idealSoil}
                  </p>
                </div>
              </div>

              {/* Ask Assistant CTA */}
              <button
                onClick={() =>
                  onAskInChat(
                    isHi
                      ? `${selectedCrop.nameHindi} की उन्नत खेती और रोग नियंत्रण की पूरी जानकारी दें।`
                      : `Give me detailed guidance on high-yield cultivation of ${selectedCrop.name}.`
                  )
                }
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>{isHi ? 'इस फसल पर चैट में पूछें' : 'Ask Gemma About This Crop'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: In-Depth Agronomic Sections (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Irrigation & Critical Watering Stages */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-600" />
                  <span>{isHi ? 'सिंचाई प्रबंधन एवं क्रांतिक अवस्थाएं' : 'Watering & Critical Irrigation Milestones'}</span>
                </h3>
                <span className="text-xs bg-blue-50 text-blue-800 font-semibold px-2.5 py-1 rounded-full border border-blue-200">
                  {selectedCrop.wateringGuide.frequency}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 font-medium bg-blue-50/50 p-3.5 rounded-2xl border border-blue-100">
                💡 <strong>{isHi ? 'मुख्य सलाह:' : 'Key Note:'}</strong>{' '}
                {isHi ? selectedCrop.wateringGuide.tipsHindi : selectedCrop.wateringGuide.tips}
              </p>

              <div className="space-y-2">
                <p className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  {isHi ? 'नाज़ुक अवस्थाएं (पानी न छूटने दें):' : 'Critical Stages (Do Not Stress Water):'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(isHi
                    ? selectedCrop.wateringGuide.criticalStagesHindi
                    : selectedCrop.wateringGuide.criticalStages
                  ).map((stage, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 text-xs text-stone-800"
                    >
                      <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{stage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Soil Health & Nutrient (NPK) Management */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-stone-100">
                <Layers className="w-5 h-5 text-emerald-600" />
                <span>{isHi ? 'मृदा स्वास्थ्य एवं संतुलित खाद (NPK)' : 'Soil Health & Fertilizer Management'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 space-y-1">
                  <p className="text-xs font-bold text-emerald-900">
                    {isHi ? 'अनुशंसित NPK अनुपात:' : 'Recommended NPK Dosage:'}
                  </p>
                  <p className="text-xs text-stone-800 font-semibold">
                    {selectedCrop.nutrientManagement.npkRatio}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 space-y-1">
                  <p className="text-xs font-bold text-stone-800">
                    {isHi ? 'जैविक खाद अनुशंसा:' : 'Organic Compost Advice:'}
                  </p>
                  <p className="text-xs text-stone-700">
                    {isHi
                      ? selectedCrop.nutrientManagement.organicRecommendationHindi
                      : selectedCrop.nutrientManagement.organicRecommendation}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs text-stone-800">
                <strong className="text-amber-900">{isHi ? 'पोषक तत्व कमी के संकेत:' : 'Deficiency Symptoms:'} </strong>
                {isHi
                  ? selectedCrop.nutrientManagement.deficiencySignsHindi
                  : selectedCrop.nutrientManagement.deficiencySigns}
              </div>
            </div>

            {/* 3. Common Pests & Integrated Pest Management (IPM) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-stone-100">
                <Bug className="w-5 h-5 text-amber-600" />
                <span>{isHi ? 'प्रमुख कीट, रोग एवं जैविक रोकथाम (IPM)' : 'Integrated Pest Management (IPM)'}</span>
              </h3>

              <div className="space-y-3">
                {selectedCrop.commonPestsAndDiseases.map((pest, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl border border-stone-200/80 bg-stone-50/50 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-stone-900 text-sm">
                        {isHi ? pest.nameHindi : pest.name}
                      </span>
                      <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                        {pest.type}
                      </span>
                    </div>
                    <p className="text-stone-700">
                      <strong>{isHi ? 'जैविक नियंत्रण:' : 'Biological / Cultural Control:'} </strong>
                      {isHi ? pest.organicControlHindi : pest.organicControl}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Harvesting & Post-Harvest Storage */}
            <div className="bg-gradient-to-r from-emerald-950 to-teal-900 text-white rounded-3xl p-6 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isHi ? 'कटाई एवं सुरक्षित भंडारण' : 'Harvesting & Safe Grain Storage'}</span>
              </h4>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                {isHi ? selectedCrop.harvestTipsHindi : selectedCrop.harvestTips}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
