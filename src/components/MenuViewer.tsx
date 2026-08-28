import React, { useState } from 'react';
import { 
  WeeklyMenuPlan, 
  DayPlan, 
  MealItem 
} from '../types';
import { 
  Clock, 
  Flame, 
  ChefHat, 
  Sparkles, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  FileDown, 
  ShoppingBag, 
  Check, 
  Lightbulb, 
  AlertCircle,
  Dumbbell,
  Share2,
  Euro,
  Baby,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { exportMenuToPDF, copyShoppingListToClipboard } from '../utils/pdfExport';

interface MenuViewerProps {
  plan: WeeklyMenuPlan;
  onRegenerateFullMenu: () => void;
  onUpdateMeal: (dayIndex: number, mealIndex: number, newMeal: MealItem) => void;
  onViewShoppingList: () => void;
  onViewCostBreakdown: () => void;
  isRegenerating: boolean;
}

export const MenuViewer: React.FC<MenuViewerProps> = ({
  plan,
  onRegenerateFullMenu,
  onUpdateMeal,
  onViewShoppingList,
  onViewCostBreakdown,
  isRegenerating,
}) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [expandedMealIds, setExpandedMealIds] = useState<string[]>([]);
  const [swappingMealKey, setSwappingMealKey] = useState<string | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const currentDay: DayPlan | undefined = plan.days[selectedDayIdx] || plan.days[0];

  const toggleExpand = (mealId: string) => {
    setExpandedMealIds(prev => 
      prev.includes(mealId) ? prev.filter(id => id !== mealId) : [...prev, mealId]
    );
  };

  const handleSwapSingleMeal = async (dayIdx: number, mealIdx: number, currentMeal: MealItem) => {
    const key = `${dayIdx}_${mealIdx}`;
    setSwappingMealKey(key);

    try {
      const res = await fetch('/api/regenerate-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealType: currentMeal.mealType,
          currentMealName: currentMeal.name,
          dayName: plan.days[dayIdx]?.dayName || 'Día',
          preferences: plan.inputConfig.dietaryPreference,
          excludedFoods: plan.inputConfig.excludedFoods,
          targetCalories: currentMeal.calories,
          targetProtein: currentMeal.protein,
          targetCarbs: currentMeal.carbs,
          targetFat: currentMeal.fat,
          supermarket: plan.inputConfig.supermarket,
          maxCookingMinutes: plan.inputConfig.maxCookingMinutes,
          userLocationName: plan.inputConfig.userLocationName,
          currency: plan.inputConfig.currency,
          servings: plan.inputConfig.servings,
        }),
      });

      if (!res.ok) throw new Error('Error al regenerar el plato');
      const newMeal: MealItem = await res.json();
      onUpdateMeal(dayIdx, mealIdx, newMeal);
      
      // Auto expand to show new recipe
      if (!expandedMealIds.includes(newMeal.id)) {
        setExpandedMealIds(prev => [...prev, newMeal.id]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSwappingMealKey(null);
    }
  };

  const handleCopyList = () => {
    const success = copyShoppingListToClipboard(plan);
    if (success) {
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 3000);
    }
  };

  const handleExportPDF = () => {
    exportMenuToPDF(plan);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Top Banner with Title, Cost & Main Actions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                {plan.days.length} Días · {plan.inputConfig.servings} {plan.inputConfig.servings === 1 ? 'Persona' : 'Personas'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                Supermercado: {plan.inputConfig.supermarket}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-200">
                🥗 {plan.inputConfig.dietaryPreference || 'Equilibrada y Variada'}
              </span>
              {plan.inputConfig.excludedFoods && plan.inputConfig.excludedFoods.length > 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                  🚫 Sin: {plan.inputConfig.excludedFoods.join(', ')}
                </span>
              )}
              {plan.childSummary && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-900 border border-sky-200 flex items-center gap-1">
                  <Baby className="w-3.5 h-3.5 text-sky-600" />
                  NutriBaby: {plan.childSummary.ageLabel}
                </span>
              )}
              {plan.fitSummary && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 flex items-center gap-1">
                  <Dumbbell className="w-3 h-3" />
                  Modo Fit
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
              {plan.title}
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              {plan.summary}
            </p>
          </div>

          {/* Quick Actions Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportPDF}
              id="btn-export-pdf-menu"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              title="Descargar menú completo en PDF con recetas y lista de compra"
            >
              <FileDown className="w-4 h-4" />
              <span>Exportar PDF</span>
            </button>

            <button
              onClick={onViewShoppingList}
              id="btn-view-shopping-list"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>Ver Lista Compra</span>
            </button>

            <button
              onClick={onRegenerateFullMenu}
              disabled={isRegenerating}
              id="btn-regenerate-full-menu"
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Volver a generar toda la semana con nuevas ideas"
            >
              <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin text-emerald-600' : ''}`} />
              <span>Regenerar Todo</span>
            </button>
          </div>
        </div>

        {/* Cost & Savings Mini Bar */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <span className="text-slate-500 font-medium block text-[11px]">Costo Estimado Total</span>
              <span className="text-base font-bold text-slate-900 font-serif">
                {plan.costEstimate.totalEstimatedCost >= 100 
                  ? Math.round(plan.costEstimate.totalEstimatedCost).toLocaleString('es-ES') 
                  : plan.costEstimate.totalEstimatedCost.toFixed(2)} {plan.costEstimate.currency}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            <div>
              <span className="text-slate-500 font-medium block text-[11px]">Por persona / semana</span>
              <span className="text-sm font-bold text-emerald-700">
                ~{plan.costEstimate.costPerPerson >= 100 
                  ? Math.round(plan.costEstimate.costPerPerson).toLocaleString('es-ES') 
                  : plan.costEstimate.costPerPerson.toFixed(2)} {plan.costEstimate.currency}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            <div>
              <span className="text-slate-500 font-medium block text-[11px]">Por día</span>
              <span className="text-sm font-bold text-slate-700">
                ~{plan.costEstimate.costPerDay >= 100 
                  ? Math.round(plan.costEstimate.costPerDay).toLocaleString('es-ES') 
                  : plan.costEstimate.costPerDay.toFixed(2)} {plan.costEstimate.currency}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyList}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-slate-700 font-medium transition-colors flex items-center gap-1.5"
            >
              {copiedNotification ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">¡Lista Copiada!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copiar Lista (WhatsApp)</span>
                </>
              )}
            </button>

            <button
              onClick={onViewCostBreakdown}
              className="text-emerald-700 hover:text-emerald-800 font-semibold underline text-xs"
            >
              Ver tips de ahorro en {plan.inputConfig.supermarket} →
            </button>
          </div>
        </div>

        {/* Fit Mode Summary Notice */}
        {plan.fitSummary && (
          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
            <Dumbbell className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">{plan.fitSummary.adherenceGoal}</span> — {plan.fitSummary.macroBalanceAnalysis}
            </div>
          </div>
        )}

        {/* Pediatric Clinical Safety Summary */}
        {plan.childSummary && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-50/90 via-teal-50/70 to-emerald-50/40 border border-sky-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-sky-200/60 pb-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
                <Baby className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Adaptación Pediátrica Activa: {plan.childSummary.ageLabel}
                  {plan.childSummary.feedingStyleLabel && ` · ${plan.childSummary.feedingStyleLabel}`}
                </h4>
                <p className="text-[11px] text-slate-600">
                  Recetas verificadas contra el protocolo de seguridad clínica infantil y prevención de atragantamientos.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Prohibitions */}
              {plan.childSummary.prohibitedIngredients && plan.childSummary.prohibitedIngredients.length > 0 && (
                <div className="bg-white/80 p-3 rounded-xl border border-rose-200">
                  <span className="font-bold text-rose-900 block mb-1 text-[11px]">
                    🚫 Exclusiones de Seguridad Clínica Aplicadas:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {plan.childSummary.prohibitedIngredients.map((item, idx) => (
                      <span key={idx} className="bg-rose-50 text-rose-800 px-2 py-0.5 rounded-md text-[10px] font-semibold border border-rose-100">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Texture & Choking Alerts */}
              <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-900 block mb-1 text-[11px]">
                  ⚠️ Texturas y Cortes de Seguridad para los Platos:
                </span>
                <p className="text-[11px] text-amber-950 font-medium leading-relaxed">
                  {plan.childSummary.textureGuidance}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Days Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {plan.days.map((day, idx) => {
          const isSelected = idx === selectedDayIdx;
          return (
            <button
              key={day.dayNumber}
              onClick={() => setSelectedDayIdx(idx)}
              className={`px-4 py-3 rounded-2xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all border shrink-0 flex flex-col items-center gap-0.5 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-700 border-emerald-700 text-white shadow-md shadow-emerald-800/15'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="font-bold">
                {day.dayName}
              </span>
              <span className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                {day.totalCalories} kcal
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Day Header & Macro Breakdown */}
      {currentDay && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
          
          {/* Day Title & Day Macros Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
                Día {currentDay.dayNumber} de {plan.days.length}
              </span>
              <h2 className="text-2xl font-bold text-slate-900 font-serif">
                {currentDay.dayName}
              </h2>
            </div>

            {/* Daily Macros Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="px-3 py-1.5 bg-slate-100 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 font-semibold block">Calorías</span>
                <span className="text-sm font-extrabold text-slate-900">{currentDay.totalCalories} kcal</span>
              </div>
              <div className="px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-xl text-center">
                <span className="text-[10px] text-blue-700 font-semibold block">Proteína</span>
                <span className="text-sm font-extrabold text-blue-900">{currentDay.totalProtein}g</span>
              </div>
              <div className="px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-xl text-center">
                <span className="text-[10px] text-amber-700 font-semibold block">Carbohidratos</span>
                <span className="text-sm font-extrabold text-amber-900">{currentDay.totalCarbs}g</span>
              </div>
              <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                <span className="text-[10px] text-emerald-700 font-semibold block">Grasas</span>
                <span className="text-sm font-extrabold text-emerald-900">{currentDay.totalFat}g</span>
              </div>
            </div>
          </div>

          {/* List of Meals in this Day */}
          <div className="space-y-4">
            {currentDay.meals.map((meal, mealIdx) => {
              const isExpanded = expandedMealIds.includes(meal.id);
              const isSwapping = swappingMealKey === `${selectedDayIdx}_${mealIdx}`;

              return (
                <div
                  key={meal.id || mealIdx}
                  className={`rounded-2xl border transition-all ${
                    isExpanded 
                      ? 'bg-slate-50/50 border-emerald-300 shadow-xs' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Meal Header Card */}
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800">
                            {meal.mealType}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {meal.prepTimeMinutes} min
                          </span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-xs text-slate-500 font-medium">
                            ~{meal.approxCost >= 100 
                              ? Math.round(meal.approxCost).toLocaleString('es-ES') 
                              : meal.approxCost.toFixed(2)} {plan.costEstimate.currency}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 font-serif">
                          {meal.name}
                        </h3>
                        
                        <p className="text-xs sm:text-sm text-slate-600">
                          {meal.description}
                        </p>
                      </div>

                      {/* Macros pills & Action buttons */}
                      <div className="flex items-center gap-3 shrink-0 pt-1 sm:pt-0">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100/80 px-2.5 py-1.5 rounded-xl">
                          <span className="font-bold text-slate-900">{meal.calories}</span>
                          <span className="text-slate-400">kcal</span>
                          <span className="text-slate-300">|</span>
                          <span className="text-blue-700 font-semibold">{meal.protein}g P</span>
                          <span className="text-slate-300">|</span>
                          <span className="text-amber-700 font-semibold">{meal.carbs}g C</span>
                          <span className="text-slate-300">|</span>
                          <span className="text-emerald-700 font-semibold">{meal.fat}g G</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSwapSingleMeal(selectedDayIdx, mealIdx, meal)}
                          disabled={isSwapping}
                          className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition-colors"
                          title="Cambiar este plato por otra alternativa con IA"
                        >
                          <RefreshCw className={`w-4 h-4 ${isSwapping ? 'animate-spin text-emerald-600' : ''}`} />
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleExpand(meal.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>{isExpanded ? 'Ocultar' : 'Ver Receta'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                    </div>

                    {/* Expandable Recipe Details */}
                    {isExpanded && (
                      <div className="mt-5 pt-5 border-t border-slate-200/80 space-y-4 animate-in fade-in">
                        
                        {/* Ingredients */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                            <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                            Ingredientes ({plan.inputConfig.servings} {plan.inputConfig.servings === 1 ? 'persona' : 'personas'})
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {meal.ingredients.map((ing, iIdx) => (
                              <div key={iIdx} className="text-xs text-slate-700 flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-200/60">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5"></span>
                                <span>{ing}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Step-by-Step Instructions */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                            <ChefHat className="w-3.5 h-3.5 text-emerald-600" />
                            Preparación Paso a Paso (≤ {meal.prepTimeMinutes} min)
                          </h4>
                          <div className="space-y-2">
                            {meal.instructions.map((step, sIdx) => (
                              <div key={sIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-200/60">
                                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                                  {sIdx + 1}
                                </span>
                                <p className="flex-1 leading-relaxed">
                                  {step}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Culinary Tip */}
                        {meal.tips && (
                          <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl flex items-start gap-2 text-xs text-amber-900">
                            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold">Consejo de cocina / Conservación: </span>
                              <span>{meal.tips}</span>
                            </div>
                          </div>
                        )}

                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
