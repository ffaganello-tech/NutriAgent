export type ChildAgeBracket = 
  | '6_12m'   // 6 a 12 meses (Inicio de sólidos / BLW / Papillas)
  | '1_2y'    // 1 a 2 años (Primera infancia)
  | '2_3y'    // 2 a 3 años (Niños pequeños / Toddlers)
  | '3_5y'    // 3 a 5 años (Preescolar)
  | '5_7y'    // 5 a 7 años (Infantil temprano / Sin soja)
  | '7_12y'   // 7 a 12 años (Escolar)
  | '12_plus';// Más de 12 años (Adolescente / Familiar)

export type ChildFeedingStyle = 'blw' | 'triturado' | 'mixto' | 'familiar';

export interface ChildConfig {
  enabled: boolean;
  ageBracket: ChildAgeBracket;
  feedingStyle?: ChildFeedingStyle;
  notes?: string;
}

export interface ChildSummary {
  ageLabel: string;
  feedingStyleLabel?: string;
  keySafetyDirectives: string[];
  chokingHazardAlerts: string[];
  prohibitedIngredients: string[];
  pediatricTips: string[];
  textureGuidance: string;
}

export interface FitConfig {
  enabled: boolean;
  targetCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  mealsPerDay: number; // 3, 4, 5
  fitnessGoal: 'perder_grasa' | 'mantener' | 'ganar_musculo';
}

export interface PlannerInput {
  servings: number; // Número de personas
  daysCount: number; // Días de planificación (1-7)
  approxBudget: number; // Presupuesto aproximado
  currency: string; // €, $, etc.
  excludedFoods: string[]; // Alimentos que no quiero usar
  supermarket: string; // Supermercado habitual
  userLocationName?: string;
  maxCookingMinutes: number; // Tiempo máximo para cocinar
  dietaryPreference: string; // Mediterránea, Equilibrada, Vegetariana, Vegana, Sin Gluten, etc.
  fitMode: FitConfig;
  childConfig?: ChildConfig; // Configuración pediátrica infantil
  nutritionistDocText?: string;
  nutritionistDocName?: string;
}

export interface MealItem {
  id: string;
  mealType: string; // "Desayuno" | "Almuerzo" | "Comida" | "Merienda" | "Cena" | "Snack / Post-entreno"
  name: string;
  description: string;
  prepTimeMinutes: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  approxCost: number;
  ingredients: string[];
  instructions: string[];
  tips?: string;
}

export interface DayPlan {
  dayNumber: number;
  dayName: string; // "Lunes", "Martes", etc.
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  meals: MealItem[];
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  estimatedPrice: number;
  category: string;
  checked?: boolean;
  notes?: string;
  isEcommercePrice?: boolean;
}

export interface ShoppingCategory {
  name: string;
  iconName?: string;
  items: ShoppingItem[];
}

export interface CostEstimate {
  totalEstimatedCost: number;
  currency: string;
  costPerPerson: number;
  costPerDay: number;
  supermarketTips: string[];
  savingsAdvice: string;
  isEcommercePricing?: boolean;
  supermarketChain?: string;
}

export interface FitSummary {
  adherenceGoal: string;
  macroBalanceAnalysis: string;
  fitnessTips: string[];
}

export interface WeeklyMenuPlan {
  id: string;
  createdAt: string;
  title: string;
  summary: string;
  inputConfig: PlannerInput;
  days: DayPlan[];
  shoppingList: ShoppingCategory[];
  costEstimate: CostEstimate;
  fitSummary?: FitSummary;
  childSummary?: ChildSummary;
}

export interface NutritionDocAnalysis {
  detectedCalories?: number;
  detectedProtein?: number;
  detectedCarbs?: number;
  detectedFat?: number;
  detectedMealsPerDay?: number;
  allergiesAndExclusions: string[];
  keyRecommendations: string[];
  summary: string;
  clinicalNotes?: string;
}

export interface SupermarketOption {
  name: string;
  country: string;
  category: 'popular' | 'descuento' | 'premium' | 'hipermercado' | 'local';
  tierLevel: 1 | 2 | 3;
  priceTier?: string;
  isEcommerce: boolean;
  brandName?: string;
  savingsTips: string[];
  logoColor?: string;
}
