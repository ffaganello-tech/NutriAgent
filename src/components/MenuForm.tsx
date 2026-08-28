import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Euro, 
  Coins,
  Clock, 
  Ban, 
  MapPin, 
  Store, 
  Utensils, 
  Dumbbell, 
  Flame, 
  Sparkles, 
  Plus, 
  X, 
  LocateFixed, 
  FileText, 
  Calculator, 
  Check, 
  Loader2,
  ChevronDown,
  Globe,
  Baby,
  ShieldAlert,
  AlertTriangle,
  Heart
} from 'lucide-react';
import { PlannerInput, FitConfig, ChildAgeBracket, ChildFeedingStyle, ChildConfig } from '../types';
import { 
  REGIONAL_SUPERMARKETS, 
  DEFAULT_EXCLUDED_FOOD_TAGS, 
  DIETARY_PREFERENCES,
  getSupermarketDisplayLabel,
  getSupermarketTierIndicator
} from '../data/supermarkets';
import { PEDIATRIC_AGE_RULES } from '../data/pediatricRules';
import { detectLocalCurrency, getCurrencyFromCoordinates, COMMON_CURRENCIES } from '../utils/currencyDetector';

interface MenuFormProps {
  initialConfig: PlannerInput;
  onGenerate: (config: PlannerInput) => void;
  isLoading: boolean;
  onOpenDocModal: () => void;
  onOpenCalcModal: () => void;
}

export const MenuForm: React.FC<MenuFormProps> = ({
  initialConfig,
  onGenerate,
  isLoading,
  onOpenDocModal,
  onOpenCalcModal,
}) => {
  const [config, setConfig] = useState<PlannerInput>(initialConfig);
  const [customExcludedFood, setCustomExcludedFood] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('ES');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [detectedCurrencyBadge, setDetectedCurrencyBadge] = useState<string | null>(null);
  const [isCustomSupermarket, setIsCustomSupermarket] = useState(false);
  const [customSupermarketName, setCustomSupermarketName] = useState('');
  const [isCustomCurrency, setIsCustomCurrency] = useState(false);
  const [customCurrencySymbol, setCustomCurrencySymbol] = useState('');

  // Auto-detect local currency and region on initial load
  useEffect(() => {
    try {
      const detected = detectLocalCurrency();
      const matchedCountry = REGIONAL_SUPERMARKETS.find(c => c.countryCode === detected.countryCode);
      
      if (matchedCountry) {
        setSelectedCountryCode(matchedCountry.countryCode);
        setDetectedCurrencyBadge(`Detectado: ${detected.currencySymbol} (${detected.detectedSource})`);
        
        setConfig(prev => {
          // Only update if using defaults
          if (prev.currency === '€' && prev.userLocationName === 'España' && detected.countryCode !== 'ES') {
            return {
              ...prev,
              currency: detected.currencySymbol,
              supermarket: matchedCountry.supermarkets[0]?.name || prev.supermarket,
              userLocationName: `${matchedCountry.countryName}`
            };
          }
          return prev;
        });
      }
    } catch (e) {
      console.warn('Auto currency detection error:', e);
    }
  }, []);

  // Sync if initialConfig updates externally (e.g. from doc upload or calc)
  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  const currentCountry = REGIONAL_SUPERMARKETS.find(c => c.countryCode === selectedCountryCode) || REGIONAL_SUPERMARKETS[0];

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      // Fallback to timezone detection
      const detected = detectLocalCurrency();
      setLocationStatus(`Geolocalización no soportada. Detectado por navegador: ${detected.currencySymbol} (${detected.detectedSource})`);
      return;
    }

    setIsDetectingLocation(true);
    setLocationStatus('Detectando ubicación real y moneda local...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsDetectingLocation(false);
        const { latitude, longitude } = position.coords;
        
        const locInfo = getCurrencyFromCoordinates(latitude, longitude);
        setSelectedCountryCode(locInfo.countryCode);
        setLocationStatus(`📍 Ubicación detectada en ${locInfo.countryName} (Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}) — Moneda: ${locInfo.currencySymbol}`);
        setDetectedCurrencyBadge(`Moneda local GPS: ${locInfo.currencySymbol} (${locInfo.countryName})`);
        
        setConfig(prev => ({
          ...prev,
          currency: locInfo.currencySymbol,
          supermarket: locInfo.supermarket,
          userLocationName: `${locInfo.countryName} (GPS)`
        }));
      },
      (error) => {
        setIsDetectingLocation(false);
        const detected = detectLocalCurrency();
        setLocationStatus(`No se obtuvo permiso GPS. Moneda detectada por zona horaria: ${detected.currencySymbol} (${detected.detectedSource})`);
        setDetectedCurrencyBadge(`Zona horaria: ${detected.currencySymbol}`);
      },
      { timeout: 8000 }
    );
  };

  const handleAddExcludedFood = (food: string) => {
    if (!food.trim()) return;
    const clean = food.trim();
    if (!config.excludedFoods.includes(clean)) {
      setConfig(prev => ({
        ...prev,
        excludedFoods: [...prev.excludedFoods, clean]
      }));
    }
    setCustomExcludedFood('');
  };

  const handleRemoveExcludedFood = (food: string) => {
    setConfig(prev => ({
      ...prev,
      excludedFoods: prev.excludedFoods.filter(f => f !== food)
    }));
  };

  const handleCountryChange = (cCode: string) => {
    setSelectedCountryCode(cCode);
    const countryObj = REGIONAL_SUPERMARKETS.find(c => c.countryCode === cCode);
    if (countryObj) {
      setConfig(prev => ({
        ...prev,
        currency: countryObj.currency,
        supermarket: countryObj.supermarkets[0]?.name || 'Supermercado habitual',
        userLocationName: countryObj.countryName
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSupermarket = isCustomSupermarket && customSupermarketName.trim() 
      ? customSupermarketName.trim() 
      : config.supermarket;
    
    onGenerate({
      ...config,
      supermarket: finalSupermarket
    });
  };

  // Fit macros ratio visualizer
  const fitTotalGramsCal = config.fitMode.proteinGrams * 4 + config.fitMode.carbsGrams * 4 + config.fitMode.fatGrams * 9;
  const proteinPct = fitTotalGramsCal > 0 ? Math.round((config.fitMode.proteinGrams * 4 / fitTotalGramsCal) * 100) : 30;
  const carbsPct = fitTotalGramsCal > 0 ? Math.round((config.fitMode.carbsGrams * 4 / fitTotalGramsCal) * 100) : 40;
  const fatPct = fitTotalGramsCal > 0 ? Math.max(0, 100 - proteinPct - carbsPct) : 30;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* Top Banner with Quick Actions */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/10 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-xs text-emerald-200 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generador Inteligente de Menús</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif tracking-tight">
                Planifica tu semana en segundos
              </h1>
              <p className="text-sm sm:text-base text-emerald-100/90 mt-1 max-w-xl">
                Recetas realistas, lista de compra organizada por pasillo y estimación de presupuesto adaptada a tu supermercado habitual.
              </p>
            </div>

            {/* Document upload trigger button */}
            <div className="shrink-0">
              <button
                type="button"
                onClick={onOpenDocModal}
                className="w-full sm:w-auto px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 backdrop-blur-xs transition-all hover:scale-102"
              >
                <FileText className="w-4 h-4 text-emerald-300" />
                <span>{config.nutritionistDocName ? '✓ Dieta cargada' : 'Cargar pauta nutricional'}</span>
              </button>
            </div>
          </div>

          {config.nutritionistDocName && (
            <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-emerald-200">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                Plan del profesional activo: <strong>{config.nutritionistDocName}</strong>
              </span>
              <button
                type="button"
                onClick={() => setConfig(prev => ({ ...prev, nutritionistDocName: undefined, nutritionistDocText: undefined }))}
                className="text-emerald-300 hover:text-white underline text-[11px]"
              >
                Quitar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Parameters Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-serif flex items-center gap-2.5">
            <Utensils className="w-5 h-5 text-emerald-600" />
            Configuración Básica del Menú
          </h2>
          <span className="text-xs text-slate-400">Paso 1 de 2</span>
        </div>

        {/* 1. Servings & Days & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Servings */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-600" />
              Número de personas
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, servings: num }))}
                  className={`flex-1 py-2 text-sm font-semibold rounded-xl border transition-all ${
                    config.servings === num
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {num} {num === 1 ? 'pers.' : 'pers.'}
                </button>
              ))}
            </div>
          </div>

          {/* Planning Days */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Días de planificación
            </label>
            <div className="flex items-center gap-2">
              {[3, 5, 7].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, daysCount: d }))}
                  className={`flex-1 py-2 text-sm font-semibold rounded-xl border transition-all ${
                    config.daysCount === d
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {d} días
                </button>
              ))}
            </div>
          </div>

          {/* Max Cooking Time */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              Tiempo máx. por plato
            </label>
            <select
              value={config.maxCookingMinutes}
              onChange={(e) => setConfig(prev => ({ ...prev, maxCookingMinutes: Number(e.target.value) }))}
              className="w-full py-2.5 px-3 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white font-medium text-slate-800"
            >
              <option value={15}>⚡ 15 min (Express / Rápido)</option>
              <option value={30}>⏱️ 30 min (Estándar equilibrado)</option>
              <option value={45}>🍲 45 min (Guisos y elaborados)</option>
              <option value={60}>🍳 60+ min (Sin prisa / Gourmet)</option>
            </select>
          </div>

        </div>

        {/* 2. Supermarket & Location Selection */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Store className="w-4 h-4 text-emerald-600" />
              Supermercado habitual o cercano
            </label>

            <button
              type="button"
              onClick={handleGeolocation}
              disabled={isDetectingLocation}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              {isDetectingLocation ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Obteniendo GPS...</span>
                </>
              ) : (
                <>
                  <LocateFixed className="w-3.5 h-3.5" />
                  <span>Autodetectar por mi ubicación</span>
                </>
              )}
            </button>
          </div>

          {locationStatus && (
            <p className="text-xs text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-200/60">
              {locationStatus}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Country selector */}
            <div>
              <label className="text-[11px] font-medium text-slate-500 block mb-1">País / Región</label>
              <select
                value={selectedCountryCode}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
              >
                {REGIONAL_SUPERMARKETS.map((country) => (
                  <option key={country.countryCode} value={country.countryCode}>
                    {country.countryName} ({country.currency})
                  </option>
                ))}
              </select>
            </div>

            {/* Supermarket selector dropdown */}
            <div className="sm:col-span-2">
              <label className="text-[11px] font-medium text-slate-500 block mb-1">Cadena de Supermercado</label>
              <div className="flex gap-2">
                {!isCustomSupermarket ? (
                  <select
                    value={config.supermarket}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setIsCustomSupermarket(true);
                      } else {
                        setConfig(prev => ({ ...prev, supermarket: e.target.value }));
                      }
                    }}
                    className="flex-1 py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white font-medium text-slate-800"
                  >
                    {currentCountry.supermarkets.map((sm) => (
                      <option key={sm.name} value={sm.name}>
                        {getSupermarketDisplayLabel(sm, config.currency)}
                      </option>
                    ))}
                    <option value="__custom__">➕ Otro supermercado (Escribir nombre)...</option>
                  </select>
                ) : (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      placeholder="Escribe el nombre de tu supermercado o frutería..."
                      value={customSupermarketName}
                      onChange={(e) => setCustomSupermarketName(e.target.value)}
                      className="flex-1 py-2 px-3 text-xs sm:text-sm rounded-xl border border-emerald-400 focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomSupermarket(false)}
                      className="px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                    >
                      Volver
                    </button>
                  </div>
                )}
              </div>

              {/* Supermarket detail preview card */}
              {(() => {
                const selectedSm = currentCountry.supermarkets.find(s => s.name === config.supermarket);
                if (!selectedSm) return null;
                return (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800">{selectedSm.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {getSupermarketTierIndicator(selectedSm, config.currency)}
                        </span>
                      </div>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                        selectedSm.isEcommerce 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {selectedSm.isEcommerce ? '🛒 Catálogo E-Commerce Oficial' : '🏪 Comercio Local / Barrio'}
                      </span>
                    </div>

                    {selectedSm.brandName && (
                      <p className="text-[11px] text-slate-600">
                        <span className="font-medium text-slate-700">Marca propia recomendada:</span> {selectedSm.brandName}
                      </p>
                    )}

                    {selectedSm.savingsTips && selectedSm.savingsTips.length > 0 && (
                      <div className="pt-1 border-t border-slate-200/60">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 block mb-0.5">
                          💡 Tips de ahorro en {selectedSm.name}:
                        </span>
                        <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                          {selectedSm.savingsTips.slice(0, 2).map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* 3. Currency & Budget Section with Auto-detection */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-emerald-600" />
              Moneda Local y Presupuesto
            </label>

            {detectedCurrencyBadge && (
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80 flex items-center gap-1">
                <Globe className="w-3 h-3 text-emerald-600" />
                {detectedCurrencyBadge}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Currency selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-medium text-slate-600 block">
                  Moneda para cálculo de precios
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const detected = detectLocalCurrency();
                    setConfig(prev => ({ ...prev, currency: detected.currencySymbol }));
                    setDetectedCurrencyBadge(`Detectado: ${detected.currencySymbol} (${detected.detectedSource})`);
                  }}
                  className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold underline flex items-center gap-1 cursor-pointer"
                  title="Detectar automáticamente según tu navegador"
                >
                  <span>Re-detectar</span>
                </button>
              </div>

              {!isCustomCurrency ? (
                <div className="flex gap-2">
                  <select
                    value={config.currency}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setIsCustomCurrency(true);
                      } else {
                        setConfig(prev => ({ ...prev, currency: e.target.value }));
                      }
                    }}
                    className="flex-1 py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white font-medium text-slate-800"
                  >
                    {COMMON_CURRENCIES.map(curr => (
                      <option key={curr.code} value={curr.symbol}>
                        {curr.name} — {curr.countryName}
                      </option>
                    ))}
                    <option value="__custom__">➕ Otra moneda o símbolo...</option>
                  </select>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Símbolo o código (ej: CHF, ¥, kr)"
                    value={customCurrencySymbol}
                    onChange={(e) => {
                      setCustomCurrencySymbol(e.target.value);
                      setConfig(prev => ({ ...prev, currency: e.target.value }));
                    }}
                    className="flex-1 py-2 px-3 text-xs sm:text-sm rounded-xl border border-emerald-400 focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomCurrency(false)}
                    className="px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                  >
                    Lista
                  </button>
                </div>
              )}
            </div>

            {/* Approx Budget */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-600 block">
                Presupuesto aproximado (Opcional)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="5"
                  placeholder="Ej: 50 (o dejar en blanco para económico)"
                  value={config.approxBudget || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, approxBudget: Number(e.target.value) }))}
                  className="w-full py-2 pl-3 pr-16 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                />
                <span className="absolute right-3 top-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  {config.currency || '€'}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* 4. Dietary Preference */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
              Preferencia Alimentaria Principal
            </label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              {config.dietaryPreference}
            </span>
          </div>
          <select
            value={config.dietaryPreference}
            onChange={(e) => setConfig(prev => ({ ...prev, dietaryPreference: e.target.value }))}
            className="w-full py-2.5 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white font-medium text-slate-800"
          >
            {DIETARY_PREFERENCES.map(pref => (
              <option key={pref.id} value={pref.name}>
                {pref.name} — {pref.desc}
              </option>
            ))}
          </select>

          {/* Quick preset chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {DIETARY_PREFERENCES.map(pref => {
              const isSelected = config.dietaryPreference === pref.name;
              return (
                <button
                  key={pref.id}
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, dietaryPreference: pref.name }))}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-700 text-white border-emerald-700 font-semibold shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {pref.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Excluded Foods / Allergies */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Ban className="w-4 h-4 text-rose-600" />
              Alimentos que no quiero usar / Alergias
            </label>
            <span className="text-[11px] text-slate-400">
              {config.excludedFoods.length} excluidos
            </span>
          </div>

          {/* Active chips */}
          <div className="flex flex-wrap gap-1.5 min-h-8">
            {config.excludedFoods.map((food) => (
              <span
                key={food}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200"
              >
                <span>{food}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveExcludedFood(food)}
                  className="hover:text-rose-950 p-0.5 rounded-full hover:bg-rose-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {config.excludedFoods.length === 0 && (
              <span className="text-xs text-slate-400 italic">
                Sin exclusiones. Incluiremos variedad completa de alimentos frescos.
              </span>
            )}
          </div>

          {/* Quick preset chips + input */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {DEFAULT_EXCLUDED_FOOD_TAGS.filter(t => !config.excludedFoods.includes(t)).slice(0, 8).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddExcludedFood(tag)}
                className="px-2.5 py-1 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3 text-slate-400" />
                <span>{tag}</span>
              </button>
            ))}
          </div>

          {/* Custom excluded food input */}
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={customExcludedFood}
              onChange={(e) => setCustomExcludedFood(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddExcludedFood(customExcludedFood);
                }
              }}
              placeholder="Añadir otro ingrediente a evitar (ej: champiñones, apio...)"
              className="flex-1 py-1.5 px-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={() => handleAddExcludedFood(customExcludedFood)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Añadir
            </button>
          </div>
        </div>

      </div>

      {/* Pediatric Nutrition Card */}
      {(() => {
        const isPediatric = config.childConfig?.enabled ?? false;
        const currentBracket: ChildAgeBracket = config.childConfig?.ageBracket || '3_5y';
        const currentStyle: ChildFeedingStyle = config.childConfig?.feedingStyle || 'familiar';
        const activeRule = PEDIATRIC_AGE_RULES[currentBracket];

        return (
          <div className={`rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${
            isPediatric 
              ? 'bg-gradient-to-b from-sky-50/60 via-white to-teal-50/30 border-sky-300 shadow-md shadow-sky-500/5' 
              : 'bg-white border-slate-200/80 shadow-xs'
          }`}>
            
            {/* Toggle Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  isPediatric ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Baby className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 font-serif">
                      Nutrición Infantil y Pediátrica (NutriBaby & Kids)
                    </h3>
                    {isPediatric ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-900 border border-sky-200">
                        PROTECCIÓN ACTIVA
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        OPCIONAL
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isPediatric 
                      ? `Adaptando el menú para tu hijo/a (${activeRule.stageTitle} · ${activeRule.shortLabel}) con exclusión estricta de riesgos clínicos.` 
                      : 'Activa esta opción si cocinas para niños pequeños o bebés para aplicar reglas clínicas de seguridad según su edad.'}
                  </p>
                </div>
              </div>

              {/* Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPediatric}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setConfig(prev => ({
                      ...prev,
                      childConfig: {
                        enabled: isChecked,
                        ageBracket: prev.childConfig?.ageBracket || '3_5y',
                        feedingStyle: prev.childConfig?.feedingStyle || 'familiar',
                        notes: prev.childConfig?.notes || ''
                      }
                    }));
                  }}
                  className="sr-only peer"
                />
                <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-sky-600 shadow-inner"></div>
              </label>
            </div>

            {/* Pediatric Detail Settings */}
            {isPediatric && (
              <div className="mt-6 pt-6 border-t border-sky-200/60 space-y-6 animate-in fade-in">
                
                {/* Age Bracket Selector */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Baby className="w-4 h-4 text-sky-600" />
                      1. ¿Qué edad tiene tu hijo/a?
                    </label>
                    <span className="text-xs font-bold text-sky-800 bg-sky-100/80 px-2.5 py-0.5 rounded-full">
                      {activeRule.stageTitle} ({activeRule.shortLabel})
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                    {(Object.keys(PEDIATRIC_AGE_RULES) as ChildAgeBracket[]).map((bracketKey) => {
                      const rule = PEDIATRIC_AGE_RULES[bracketKey];
                      const isSelected = currentBracket === bracketKey;
                      const hasSpecialSoyRule = ['6_12m', '1_2y', '2_3y', '3_5y', '5_7y'].includes(bracketKey);

                      return (
                        <button
                          key={bracketKey}
                          type="button"
                          onClick={() => setConfig(prev => ({
                            ...prev,
                            childConfig: {
                              ...prev.childConfig,
                              enabled: true,
                              ageBracket: bracketKey,
                              feedingStyle: prev.childConfig?.feedingStyle || 'familiar'
                            }
                          }))}
                          className={`p-2.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                            isSelected
                              ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                              : 'bg-white hover:bg-sky-50/50 text-slate-700 border-slate-200'
                          }`}
                        >
                          <div>
                            <span className={`text-xs font-bold block ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                              {rule.shortLabel}
                            </span>
                            <span className={`text-[10px] leading-tight block mt-0.5 line-clamp-2 ${isSelected ? 'text-sky-100' : 'text-slate-500'}`}>
                              {rule.stageTitle}
                            </span>
                          </div>
                          {hasSpecialSoyRule && (
                            <span className={`mt-1.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-md inline-block w-fit ${
                              isSelected ? 'bg-sky-800 text-sky-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                            }`}>
                              🚫 Sin Soja
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Feeding Style Selector */}
                <div className="space-y-2.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-teal-600" />
                    2. Método de Alimentación y Textura
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {[
                      { 
                        id: 'blw' as ChildFeedingStyle, 
                        title: 'BLW (Baby-Led Weaning)', 
                        desc: 'Sólidos autorregulados en tiras suaves, bastones y flores fáciles de prensar.',
                        badge: 'Autorregulado'
                      },
                      { 
                        id: 'triturado' as ChildFeedingStyle, 
                        title: 'Papillas / Triturados', 
                        desc: 'Purés suaves y homogéneos de verduras, cereales y proteínas cocidas.',
                        badge: 'Cuchara'
                      },
                      { 
                        id: 'mixto' as ChildFeedingStyle, 
                        title: 'Mixto (BLW + Purés)', 
                        desc: 'Combina alimentos en puré con sólidos blandos para explorar masticación.',
                        badge: 'Combinado'
                      },
                      { 
                        id: 'familiar' as ChildFeedingStyle, 
                        title: 'Comida Familiar Adaptada', 
                        desc: 'Mismo plato que los adultos pero con corte seguro y sin exceso de sodio.',
                        badge: 'Mesa Familiar'
                      }
                    ].map(style => {
                      const isSelected = currentStyle === style.id;
                      return (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => setConfig(prev => ({
                            ...prev,
                            childConfig: {
                              ...prev.childConfig,
                              enabled: true,
                              ageBracket: prev.childConfig?.ageBracket || '3_5y',
                              feedingStyle: style.id
                            }
                          }))}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                              : 'bg-white hover:bg-teal-50/40 text-slate-700 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                              {style.title}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                              isSelected ? 'bg-teal-900 text-teal-100' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {style.badge}
                            </span>
                          </div>
                          <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                            {style.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dynamic Clinical Rules Box */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-sky-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <ShieldAlert className="w-5 h-5 text-sky-600 shrink-0" />
                    <h4 className="text-sm font-bold text-slate-900">
                      Protocolo de Seguridad Clínica para {activeRule.stageTitle} ({activeRule.shortLabel})
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Prohibited Foods */}
                    <div className="bg-rose-50/70 p-3.5 rounded-xl border border-rose-200/80">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900 mb-2">
                        <Ban className="w-4 h-4 text-rose-600" />
                        <span>Alimentos Excluidos Automáticamente (Prohibidos Clínicamente):</span>
                      </div>
                      <ul className="space-y-1 text-xs text-rose-800">
                        {activeRule.forbiddenFoods.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-rose-500 font-bold">•</span>
                            <span><strong>{item.food}:</strong> <span className="text-rose-700 text-[11px]">{item.reason}</span></span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Choking Hazards & Textures */}
                    <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/80">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Prevención de Atragantamiento y Textura Exigida:</span>
                      </div>
                      <p className="text-xs text-amber-900 leading-relaxed mb-2 font-medium">
                        {activeRule.textureGuidance}
                      </p>
                      <div className="space-y-1">
                        {activeRule.chokingHazards.slice(0, 4).map((hazard, hIdx) => (
                          <div key={hIdx} className="text-[10px] bg-amber-100/90 text-amber-950 px-2 py-1 rounded-md font-medium">
                            <span className="font-bold">⚠️ {hazard.food}:</span> {hazard.safeForm}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Notes / Special indications */}
                  <div className="pt-2">
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Notas particulares para tu pediatra o alergias adicionales del niño/a:
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: APLV (Alergia a proteína leche vaca), prefiere texturas muy suaves, intolerancia al huevo..."
                      value={config.childConfig?.notes || ''}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        childConfig: {
                          ...prev.childConfig,
                          enabled: true,
                          ageBracket: prev.childConfig?.ageBracket || '3_5y',
                          feedingStyle: prev.childConfig?.feedingStyle || 'familiar',
                          notes: e.target.value
                        }
                      }))}
                      className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white"
                    />
                  </div>
                </div>

              </div>
            )}

          </div>
        );
      })()}

      {/* Mode Fit Card */}
      <div className={`rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${
        config.fitMode.enabled 
          ? 'bg-gradient-to-b from-amber-50/50 to-white border-amber-300 shadow-md shadow-amber-500/5' 
          : 'bg-white border-slate-200/80 shadow-xs'
      }`}>
        
        {/* Toggle Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              config.fitMode.enabled ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 font-serif">
                  Interruptor “Modo Fit”
                </h3>
                {config.fitMode.enabled ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                    ACTIVADO
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                    DESACTIVADO (Menú Familiar / Estándar)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {config.fitMode.enabled 
                  ? 'Planificación con control milimétrico de macros, calorías exactas y comidas por objetivo deportivo.' 
                  : 'Genera menús equilibrados, variados, sabrosos y prácticos para el día a día.'}
              </p>
            </div>
          </div>

          {/* Switch */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.fitMode.enabled}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                fitMode: { ...prev.fitMode, enabled: e.target.checked }
              }))}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-500 shadow-inner"></div>
          </label>
        </div>

        {/* Fit Mode Detail Settings */}
        {config.fitMode.enabled && (
          <div className="mt-6 pt-6 border-t border-amber-200/60 space-y-6 animate-in fade-in">
            
            {/* Fitness Goal Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-600" />
                  Objetivo Fitness Principal
                </label>
                
                <button
                  type="button"
                  onClick={onOpenCalcModal}
                  className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline flex items-center gap-1"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Abrir calculadora TDEE</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setConfig(prev => ({
                    ...prev,
                    fitMode: { ...prev.fitMode, fitnessGoal: 'perder_grasa' }
                  }))}
                  className={`py-3 px-3 rounded-2xl text-xs font-semibold border flex flex-col items-center gap-1 transition-all ${
                    config.fitMode.fitnessGoal === 'perder_grasa'
                      ? 'bg-amber-500 border-amber-600 text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Flame className="w-4 h-4" />
                  <span>Perder Grasa (Definición)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setConfig(prev => ({
                    ...prev,
                    fitMode: { ...prev.fitMode, fitnessGoal: 'mantener' }
                  }))}
                  className={`py-3 px-3 rounded-2xl text-xs font-semibold border flex flex-col items-center gap-1 transition-all ${
                    config.fitMode.fitnessGoal === 'mantener'
                      ? 'bg-amber-500 border-amber-600 text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>Mantenimiento / Recomposición</span>
                </button>

                <button
                  type="button"
                  onClick={() => setConfig(prev => ({
                    ...prev,
                    fitMode: { ...prev.fitMode, fitnessGoal: 'ganar_musculo' }
                  }))}
                  className={`py-3 px-3 rounded-2xl text-xs font-semibold border flex flex-col items-center gap-1 transition-all ${
                    config.fitMode.fitnessGoal === 'ganar_musculo'
                      ? 'bg-amber-500 border-amber-600 text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Dumbbell className="w-4 h-4" />
                  <span>Ganar Músculo (Volumen)</span>
                </button>
              </div>
            </div>

            {/* Target Calories & Number of Meals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Calorías Diarias Objetivo
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1000"
                    max="5000"
                    step="50"
                    value={config.fitMode.targetCalories}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      fitMode: { ...prev.fitMode, targetCalories: Number(e.target.value) }
                    }))}
                    className="w-full py-2.5 pl-3 pr-14 text-sm font-bold text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400">
                    kcal/día
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Número de comidas al día
                </label>
                <div className="flex gap-2">
                  {[3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setConfig(prev => ({
                        ...prev,
                        fitMode: { ...prev.fitMode, mealsPerDay: num }
                      }))}
                      className={`flex-1 py-2 text-sm font-semibold rounded-xl border transition-all ${
                        config.fitMode.mealsPerDay === num
                          ? 'bg-amber-500 border-amber-600 text-white shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {num} tomas
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Target Macros (Protein, Carbs, Fats) */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                Distribución de Macronutrientes Diarios
              </label>

              {/* Visual Macro Bar */}
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 shadow-inner">
                <div style={{ width: `${proteinPct}%` }} className="bg-blue-500" title={`Proteína ${proteinPct}%`}></div>
                <div style={{ width: `${carbsPct}%` }} className="bg-amber-500" title={`Carbohidratos ${carbsPct}%`}></div>
                <div style={{ width: `${fatPct}%` }} className="bg-emerald-500" title={`Grasas ${fatPct}%`}></div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                
                {/* Protein */}
                <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-200">
                  <div className="flex items-center justify-between text-xs text-blue-900 font-bold mb-1">
                    <span>Proteínas</span>
                    <span>{proteinPct}%</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="20"
                      max="400"
                      value={config.fitMode.proteinGrams}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        fitMode: { ...prev.fitMode, proteinGrams: Number(e.target.value) }
                      }))}
                      className="w-full py-1.5 px-2 text-sm font-bold text-blue-950 rounded-lg border border-blue-300 bg-white"
                    />
                    <span className="absolute right-2 top-1.5 text-xs text-blue-500 font-semibold">g</span>
                  </div>
                </div>

                {/* Carbs */}
                <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200">
                  <div className="flex items-center justify-between text-xs text-amber-900 font-bold mb-1">
                    <span>Carbohidratos</span>
                    <span>{carbsPct}%</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="10"
                      max="600"
                      value={config.fitMode.carbsGrams}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        fitMode: { ...prev.fitMode, carbsGrams: Number(e.target.value) }
                      }))}
                      className="w-full py-1.5 px-2 text-sm font-bold text-amber-950 rounded-lg border border-amber-300 bg-white"
                    />
                    <span className="absolute right-2 top-1.5 text-xs text-amber-500 font-semibold">g</span>
                  </div>
                </div>

                {/* Fats */}
                <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200">
                  <div className="flex items-center justify-between text-xs text-emerald-900 font-bold mb-1">
                    <span>Grasas</span>
                    <span>{fatPct}%</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="10"
                      max="200"
                      value={config.fitMode.fatGrams}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        fitMode: { ...prev.fitMode, fatGrams: Number(e.target.value) }
                      }))}
                      className="w-full py-1.5 px-2 text-sm font-bold text-emerald-950 rounded-lg border border-emerald-300 bg-white"
                    />
                    <span className="absolute right-2 top-1.5 text-xs text-emerald-500 font-semibold">g</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>

      {/* Big Action Button */}
      <button
        type="submit"
        id="btn-generate-menu-main"
        disabled={isLoading}
        className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold text-base sm:text-lg rounded-2xl shadow-lg shadow-emerald-700/25 transition-all transform active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin text-emerald-200" />
            <span>Generando menú inteligente con IA y optimizando lista...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 text-emerald-200" />
            <span>Generar Menú Semanal y Lista de la Compra</span>
          </>
        )}
      </button>

    </form>
  );
};
