import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Wind,
  Droplets,
  Thermometer,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  RefreshCw,
  Sparkles,
  Calendar,
  Volume2,
  VolumeX,
  Compass,
  ArrowUpRight,
  Sun,
  CloudRain,
  Eye,
} from 'lucide-react';
import { Language, WeatherAdvisory } from '../types/farming';
import { PRESET_DISTRICTS } from '../data/mockData';
import { VoiceService } from '../utils/speech';

interface WeatherAlertsProps {
  language: Language;
}

export const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ language }) => {
  const isHi = language === 'hi';

  const [selectedDistrict, setSelectedDistrict] = useState(PRESET_DISTRICTS[0]);
  const [weatherData, setWeatherData] = useState<WeatherAdvisory | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const fetchWeather = async (lat: number, lon: number, districtName: string, stateName: string) => {
    setIsLoading(true);
    setGeoError(null);
    try {
      const res = await fetch(
        `/api/weather?lat=${lat}&lon=${lon}&district=${encodeURIComponent(
          districtName
        )}&state=${encodeURIComponent(stateName)}`
      );
      if (!res.ok) throw new Error('Weather fetch failed');
      const data = await res.json();
      setWeatherData(data);
    } catch (err) {
      console.warn('Weather fetch error, using local fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(
      selectedDistrict.lat,
      selectedDistrict.lon,
      selectedDistrict.name,
      selectedDistrict.state
    );
  }, [selectedDistrict]);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setGeoError(isHi ? 'आपके डिवाइस में जीपीएस समर्थित नहीं है।' : 'Geolocation not supported.');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeather(pos.coords.latitude, pos.coords.longitude, 'My Farm GPS', 'Local');
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setGeoError(
          isHi
            ? 'स्थान अनुमति अस्वीकृत हुई। कृपया सूची से अपना जिला चुनें।'
            : 'Location permission denied. Please select your nearest agricultural district.'
        );
        setIsLoading(false);
      }
    );
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      VoiceService.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    if (!weatherData) return;

    let text = '';
    if (isHi) {
      text = `${weatherData.district} में वर्तमान तापमान ${weatherData.current.temperature} डिग्री सेल्सियस और आर्द्रता ${weatherData.current.relativeHumidity} प्रतिशत है। कीटनाशक छिड़काव सलाह: ${weatherData.agroIndices.sprayingWindow.messageHindi}। सिंचाई सलाह: ${weatherData.agroIndices.irrigationAdvice.messageHindi}।`;
    } else {
      text = `Current temperature in ${weatherData.district} is ${weatherData.current.temperature} degrees Celsius with ${weatherData.current.relativeHumidity}% humidity. Spraying advisory: ${weatherData.agroIndices.sprayingWindow.message}. Irrigation advisory: ${weatherData.agroIndices.irrigationAdvice.message}.`;
    }

    setIsSpeaking(true);
    VoiceService.speak(text, language, () => setIsSpeaking(false));
  };

  const getSprayingBadge = (status: 'OPTIMAL' | 'MODERATE' | 'NOT_RECOMMENDED') => {
    switch (status) {
      case 'OPTIMAL':
        return {
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          title: isHi ? 'उत्तम समय (Safe Window)' : 'Optimal Spraying Window',
          icon: ShieldCheck,
        };
      case 'MODERATE':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          title: isHi ? 'सावधानीपूर्वक छिड़कें' : 'Moderate Window (Caution)',
          icon: AlertTriangle,
        };
      case 'NOT_RECOMMENDED':
        return {
          bg: 'bg-rose-100 text-rose-900 border-rose-300',
          title: isHi ? 'छिड़काव न करें (Do Not Spray)' : 'Risky (Avoid Spraying)',
          icon: ShieldAlert,
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-green-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Open-Meteo Real-Time Agro-Meteorology API</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isHi ? 'कृषि मौसम सलाह एवं अलर्ट' : 'Smart Agro-Weather Alerts'}
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            {isHi
              ? 'कीटनाशक छिड़काव, फफूंद रोग जोखिम और सिंचाई योजना के लिए वास्तविक मौसम आधारित निर्णय लें।'
              : 'Real-time weather guidance calculated specifically for pesticide drift prevention, fungal spore outbreaks, and optimal irrigation windows.'}
          </p>
        </div>

        {/* Action button & Audio */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={toggleSpeech}
            disabled={!weatherData || isLoading}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer ${
              isSpeaking
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
            <span>{isHi ? 'सलाह सुनें' : 'Listen Report'}</span>
          </button>

          <button
            onClick={handleUseLocation}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-stone-900 transition-all shadow-md cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            <span>{isHi ? 'मेरा खेत GPS' : 'My Location GPS'}</span>
          </button>
        </div>
      </div>

      {/* District Selector Tabs */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/80 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-500">
          <span className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-emerald-600" />
            {isHi ? 'प्रमुख कृषि जिले (Select District):' : 'Major Agricultural Districts:'}
          </span>
          <span className="text-emerald-700 font-semibold">{weatherData?.district}</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {PRESET_DISTRICTS.map((dist) => {
            const isSelected = selectedDistrict.name === dist.name;
            return (
              <button
                key={dist.name}
                onClick={() => setSelectedDistrict(dist)}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/20'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <span>{dist.name}</span>
                <span className="text-[10px] ml-1 opacity-80">({dist.state})</span>
              </button>
            );
          })}
        </div>

        {geoError && (
          <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
            {geoError}
          </p>
        )}
      </div>

      {isLoading || !weatherData ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-stone-200/80 space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
          <p className="text-sm font-semibold text-stone-700">
            {isHi ? 'मौसम डेटा प्राप्त हो रहा है...' : 'Fetching Live Open-Meteo Weather Data...'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Thermometer className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-stone-500 font-medium">{isHi ? 'तापमान' : 'Temperature'}</p>
                <p className="text-2xl font-black text-stone-900">{weatherData.current.temperature}°C</p>
                <p className="text-[11px] text-stone-400">{weatherData.current.weatherDescription}</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-stone-500 font-medium">{isHi ? 'हवा में नमी' : 'Relative Humidity'}</p>
                <p className="text-2xl font-black text-stone-900">{weatherData.current.relativeHumidity}%</p>
                <p className="text-[11px] text-blue-600 font-medium">
                  {weatherData.current.relativeHumidity > 75 ? (isHi ? 'उच्च नमी' : 'High moisture') : (isHi ? 'सामान्य' : 'Normal')}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Wind className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-stone-500 font-medium">{isHi ? 'हवा की गति' : 'Wind Speed'}</p>
                <p className="text-2xl font-black text-stone-900">{weatherData.current.windSpeed} km/h</p>
                <p className="text-[11px] text-stone-400">
                  {weatherData.current.windSpeed < 12 ? (isHi ? 'शांत हवा' : 'Gentle breeze') : (isHi ? 'तेज हवा' : 'Breezy')}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CloudSun className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-stone-500 font-medium">{isHi ? 'बारिश (वर्तमान)' : 'Precipitation'}</p>
                <p className="text-2xl font-black text-stone-900">{weatherData.current.precipitation} mm</p>
                <p className="text-[11px] text-stone-400">{isHi ? 'पिछले 1 घंटे' : 'Past hour'}</p>
              </div>
            </div>
          </div>

          {/* Key Agro-Meteorology Decision Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Spraying Window */}
            {(() => {
              const badge = getSprayingBadge(weatherData.agroIndices.sprayingWindow.status);
              const Icon = badge.icon;
              return (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        {isHi ? 'छिड़काव अनुकूलता' : 'Spraying Window'}
                      </span>
                      <Icon className="w-5 h-5 text-emerald-600" />
                    </div>

                    <div className={`p-2.5 rounded-xl border text-xs font-bold inline-block ${badge.bg}`}>
                      {badge.title}
                    </div>

                    <p className="text-sm font-bold text-stone-800">
                      {isHi
                        ? weatherData.agroIndices.sprayingWindow.messageHindi
                        : weatherData.agroIndices.sprayingWindow.message}
                    </p>

                    <p className="text-xs text-stone-500 leading-relaxed">
                      <strong>{isHi ? 'कारण:' : 'Reason:'}</strong> {weatherData.agroIndices.sprayingWindow.reason}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-400">
                    {isHi ? 'हवा की गति 12 किमी/घंटा से कम होने पर ही छिड़काव करें।' : 'Safe spray threshold: Wind < 12 km/h, No rain.'}
                  </div>
                </div>
              );
            })()}

            {/* Card 2: Fungal Threat Risk */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    {isHi ? 'फफूंद रोग जोखिम' : 'Fungal Spore Risk'}
                  </span>
                  <ShieldAlert className="w-5 h-5 text-amber-500" />
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${
                      weatherData.agroIndices.fungalDiseaseRisk.level === 'HIGH'
                        ? 'bg-rose-100 text-rose-900 border-rose-300'
                        : weatherData.agroIndices.fungalDiseaseRisk.level === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    }`}
                  >
                    {weatherData.agroIndices.fungalDiseaseRisk.level} RISK ({weatherData.agroIndices.fungalDiseaseRisk.score}%)
                  </span>
                </div>

                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      weatherData.agroIndices.fungalDiseaseRisk.score > 70
                        ? 'bg-rose-500'
                        : weatherData.agroIndices.fungalDiseaseRisk.score > 40
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${weatherData.agroIndices.fungalDiseaseRisk.score}%` }}
                  />
                </div>

                <p className="text-sm font-bold text-stone-800">
                  {isHi
                    ? weatherData.agroIndices.fungalDiseaseRisk.messageHindi
                    : weatherData.agroIndices.fungalDiseaseRisk.message}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-400">
                {isHi ? '80% से अधिक नमी में ट्राइकोडर्मा का छिड़काव उपयोगी है।' : 'Spore germination spikes when RH > 80%.'}
              </div>
            </div>

            {/* Card 3: Irrigation Advice */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    {isHi ? 'सिंचाई योजना' : 'Irrigation Advisory'}
                  </span>
                  <Droplets className="w-5 h-5 text-blue-600" />
                </div>

                <div
                  className={`p-2.5 rounded-xl border text-xs font-bold inline-block ${
                    weatherData.agroIndices.irrigationAdvice.action === 'POSTPONE'
                      ? 'bg-blue-100 text-blue-900 border-blue-300'
                      : weatherData.agroIndices.irrigationAdvice.action === 'RECOMMENDED'
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  }`}
                >
                  {weatherData.agroIndices.irrigationAdvice.action === 'POSTPONE'
                    ? isHi ? 'सिंचाई टालें (Rain Coming)' : 'Postpone Irrigation'
                    : isHi ? 'सामान्य सिंचाई' : 'Regular Schedule'}
                </div>

                <p className="text-sm font-bold text-stone-800">
                  {isHi
                    ? weatherData.agroIndices.irrigationAdvice.messageHindi
                    : weatherData.agroIndices.irrigationAdvice.message}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-400">
                {isHi ? 'पानी और बिजली की बचत के लिए वर्षा पूर्वानुमान अवश्य देखें।' : 'Prevents root rot and saves groundwater pumping cost.'}
              </div>
            </div>
          </div>

          {/* 7-Day Agricultural Forecast */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-4">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span>{isHi ? 'अगले 7 दिनों का कृषि मौसम पूर्वानुमान' : '7-Day Agro-Weather Outlook'}</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {weatherData.daily.map((day, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl text-center space-y-2 border transition-all ${
                    idx === 0
                      ? 'bg-emerald-50/50 border-emerald-300'
                      : 'bg-stone-50/60 border-stone-200/70 hover:bg-stone-100/60'
                  }`}
                >
                  <p className="text-xs font-bold text-stone-700">
                    {idx === 0
                      ? isHi ? 'आज' : 'Today'
                      : new Date(day.date).toLocaleDateString(isHi ? 'hi-IN' : 'en-US', {
                          weekday: 'short',
                          day: 'numeric',
                        })}
                  </p>

                  <div className="w-8 h-8 mx-auto flex items-center justify-center text-emerald-700">
                    {day.precipitationSum > 1 || day.rainProbability > 40 ? (
                      <CloudRain className="w-6 h-6 text-blue-500" />
                    ) : (
                      <Sun className="w-6 h-6 text-amber-500" />
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-sm font-black text-stone-900">{day.tempMax}°</p>
                    <p className="text-xs text-stone-400">{day.tempMin}°</p>
                  </div>

                  <div className="pt-1 border-t border-stone-200/60 text-[11px] font-semibold text-blue-700">
                    {day.rainProbability}% {isHi ? 'बारिश' : 'rain'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
