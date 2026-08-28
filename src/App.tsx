import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { MenuForm } from './components/MenuForm';
import { MenuViewer } from './components/MenuViewer';
import { ShoppingListViewer } from './components/ShoppingListViewer';
import { CostBreakdown } from './components/CostBreakdown';
import { DietDocUploadModal } from './components/DietDocUploadModal';
import { FitCalculatorModal } from './components/FitCalculatorModal';
import { PlannerInput, WeeklyMenuPlan, MealItem, ShoppingCategory, NutritionDocAnalysis } from './types';
import { AlertCircle } from 'lucide-react';

const DEFAULT_CONFIG: PlannerInput = {
  servings: 2,
  daysCount: 7,
  approxBudget: 60,
  currency: '€',
  excludedFoods: [],
  supermarket: 'Mercadona',
  userLocationName: 'España',
  maxCookingMinutes: 30,
  dietaryPreference: 'Dieta Mediterránea',
  fitMode: {
    enabled: false,
    targetCalories: 2000,
    proteinGrams: 140,
    carbsGrams: 200,
    fatGrams: 65,
    mealsPerDay: 4,
    fitnessGoal: 'perder_grasa',
  },
  childConfig: {
    enabled: false,
    ageBracket: '3_5y',
    feedingStyle: 'familiar',
    notes: '',
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'menu' | 'shopping' | 'cost'>('generator');
  const [config, setConfig] = useState<PlannerInput>(DEFAULT_CONFIG);
  const [currentPlan, setCurrentPlan] = useState<WeeklyMenuPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState<boolean>(false);
  const [isCalcModalOpen, setIsCalcModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load any previously saved plan from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ai_weekly_menu_saved_plan');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCurrentPlan(parsed);
        if (parsed.inputConfig) {
          setConfig(parsed.inputConfig);
        }
      }
    } catch (e) {
      console.warn('Could not load plan from localStorage', e);
    }
  }, []);

  const handleGenerateMenu = async (inputConfig: PlannerInput) => {
    setIsGenerating(true);
    setErrorMessage(null);
    setConfig(inputConfig);

    try {
      const response = await fetch('/api/generate-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputConfig),
      });

      if (!response.ok) {
        throw new Error('Error en el servidor al generar el menú');
      }

      const newPlan: WeeklyMenuPlan = await response.json();
      setCurrentPlan(newPlan);
      setActiveTab('menu');

      // Save to localStorage for quick restore
      try {
        localStorage.setItem('ai_weekly_menu_saved_plan', JSON.stringify(newPlan));
      } catch (err) {}

      // Friendly confetti celebration
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {}

    } catch (err: any) {
      console.error(err);
      setErrorMessage('Hubo un problema al contactar con el generador. Por favor intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateFullMenu = () => {
    if (currentPlan) {
      handleGenerateMenu(currentPlan.inputConfig);
    } else {
      handleGenerateMenu(config);
    }
  };

  const handleUpdateMeal = (dayIdx: number, mealIdx: number, newMeal: MealItem) => {
    if (!currentPlan) return;
    const updatedDays = [...currentPlan.days];
    const targetDay = updatedDays[dayIdx];
    if (!targetDay) return;

    targetDay.meals[mealIdx] = newMeal;

    // Recalculate day totals
    let cal = 0, p = 0, c = 0, f = 0;
    targetDay.meals.forEach(m => {
      cal += m.calories;
      p += m.protein;
      c += m.carbs;
      f += m.fat;
    });
    targetDay.totalCalories = cal;
    targetDay.totalProtein = p;
    targetDay.totalCarbs = c;
    targetDay.totalFat = f;

    const updatedPlan = {
      ...currentPlan,
      days: updatedDays,
    };
    setCurrentPlan(updatedPlan);

    try {
      localStorage.setItem('ai_weekly_menu_saved_plan', JSON.stringify(updatedPlan));
    } catch (err) {}
  };

  const handleUpdateShoppingList = (newCategories: ShoppingCategory[]) => {
    if (!currentPlan) return;
    const updatedPlan = {
      ...currentPlan,
      shoppingList: newCategories,
    };
    setCurrentPlan(updatedPlan);
    try {
      localStorage.setItem('ai_weekly_menu_saved_plan', JSON.stringify(updatedPlan));
    } catch (err) {}
  };

  const handleApplyDocAnalysis = (analysis: NutritionDocAnalysis, rawText: string, fileName: string) => {
    setConfig(prev => {
      const isFit = !!(analysis.detectedCalories || analysis.detectedProtein);
      const newExclusions = Array.from(new Set([...prev.excludedFoods, ...analysis.allergiesAndExclusions]));

      return {
        ...prev,
        excludedFoods: newExclusions,
        nutritionistDocName: fileName,
        nutritionistDocText: rawText,
        fitMode: {
          ...prev.fitMode,
          enabled: isFit ? true : prev.fitMode.enabled,
          targetCalories: analysis.detectedCalories || prev.fitMode.targetCalories,
          proteinGrams: analysis.detectedProtein || prev.fitMode.proteinGrams,
          carbsGrams: analysis.detectedCarbs || prev.fitMode.carbsGrams,
          fatGrams: analysis.detectedFat || prev.fitMode.fatGrams,
          mealsPerDay: analysis.detectedMealsPerDay || prev.fitMode.mealsPerDay,
        }
      };
    });
    setActiveTab('generator');
  };

  const handleApplyFitTargets = (targets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    goal: 'perder_grasa' | 'mantener' | 'ganar_musculo';
  }) => {
    setConfig(prev => ({
      ...prev,
      fitMode: {
        ...prev.fitMode,
        enabled: true,
        targetCalories: targets.calories,
        proteinGrams: targets.protein,
        carbsGrams: targets.carbs,
        fatGrams: targets.fat,
        fitnessGoal: targets.goal,
      }
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasPlan={!!currentPlan}
        onOpenDocModal={() => setIsDocModalOpen(true)}
        isFitMode={config.fitMode.enabled}
        isPediatricMode={config.childConfig?.enabled}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-semibold text-rose-700 hover:text-rose-900"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Tab views */}
        {activeTab === 'generator' && (
          <MenuForm
            initialConfig={config}
            onGenerate={handleGenerateMenu}
            isLoading={isGenerating}
            onOpenDocModal={() => setIsDocModalOpen(true)}
            onOpenCalcModal={() => setIsCalcModalOpen(true)}
          />
        )}

        {activeTab === 'menu' && currentPlan && (
          <MenuViewer
            plan={currentPlan}
            onRegenerateFullMenu={handleRegenerateFullMenu}
            onUpdateMeal={handleUpdateMeal}
            onViewShoppingList={() => setActiveTab('shopping')}
            onViewCostBreakdown={() => setActiveTab('cost')}
            isRegenerating={isGenerating}
          />
        )}

        {activeTab === 'shopping' && currentPlan && (
          <ShoppingListViewer
            plan={currentPlan}
            onUpdateShoppingList={handleUpdateShoppingList}
            onBackToMenu={() => setActiveTab('menu')}
          />
        )}

        {activeTab === 'cost' && currentPlan && (
          <CostBreakdown
            plan={currentPlan}
            onBack={() => setActiveTab('menu')}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>
            <strong>Nutriagente Semanal</strong> · Planificación inteligente de menús con ingredientes regionalizados, nutrición clínica pediátrica, inventario de supermercado y optimización de compras.
          </p>
        </div>
      </footer>

      {/* Nutritionist / Doctor Document Upload Modal */}
      <DietDocUploadModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        onApplyDocAnalysis={handleApplyDocAnalysis}
      />

      {/* Fitness & Macro Calculator Helper Modal */}
      <FitCalculatorModal
        isOpen={isCalcModalOpen}
        onClose={() => setIsCalcModalOpen(false)}
        onApplyTargets={handleApplyFitTargets}
      />

    </div>
  );
}
