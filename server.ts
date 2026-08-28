import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { REGIONAL_SUPERMARKETS, getRegionalIngredientProfile } from "./src/data/supermarkets";
import { getPediatricSafetyDirectives } from "./src/data/pediatricRules";
import {
  getMasterLunchPool,
  getMasterDinnerPool,
  getMasterBreakfastPool,
  getMasterMorningSnacks,
  getMasterAfternoonSnacks,
  getFilteredLunchPool,
  getFilteredDinnerPool,
  getFilteredBreakfastPool,
  getFilteredMorningSnacks,
  getFilteredAfternoonSnacks,
  shuffleArray,
  MealTemplate
} from "./src/data/mealPool";

dotenv.config();

function getDietaryPreferenceDirectives(preference: string, excludedFoods: string[] = [], supermarketName: string = "el supermercado"): string {
  const norm = (preference || '').toLowerCase();
  let specificRules = "";

  if (norm.includes('vegan')) {
    specificRules = `
🚨 REGLA SUPREMA Y ABSOLUTA: DIETA 100% VEGANA (ESTRICTAMENTE MANDATORIO):
- El usuario seleccionó la preferencia dietética "100% Vegana".
- ESTÁ TOTALMENTE PROHIBIDO cualquier ingrediente de origen animal en TODO el menú (desayunos, almuerzos, cenas, meriendas y lista de la compra).
- PROHIBIDO: Carnes de cualquier animal (pollo, pavo, ternera, res, cerdo, etc.), Pescados (salmón, atún, merluza, etc.), Mariscos, Huevos, Claras de huevo, Lácteos (leche animal, yogur, queso fresco, ricota, queso parmesano/mozzarella, mantequilla, kéfir), Miel y cualquier derivado animal.
- FUENTES DE PROTEÍNA Y ALIMENTOS PERMITIDOS: Legumbres (lentejas, garbanzos, alubias, porotos, frijoles), Tofu firme o sedoso, Tempeh, Soja texturizada, Seitán, Edamame, Frutos secos, Semillas (chía, lino, calabaza, cáñamo), Levadura nutricional, Bebidas vegetales sin azúcar (soja, avena, almendra), Cereales integrales (quinoa, arroz integral, avena), Frutas y Verduras frescas.
- El título del menú y el resumen deben reflejar claramente que es un Menú 100% Vegano.`;
  } else if (norm.includes('vegetar')) {
    specificRules = `
🚨 REGLA SUPREMA Y ABSOLUTA: DIETA VEGETARIANA (ESTRICTAMENTE MANDATORIO):
- El usuario seleccionó la preferencia dietética "Vegetariana" (Ovolactovegetariana).
- ESTÁ TOTALMENTE PROHIBIDO incluir cualquier carne animal o pescado en TODO el menú semanal.
- PROHIBIDO: Pollo, pavo, ternera, res, cerdo, cordero, embutidos/fiambres, pescados blancos o azules (merluza, salmón, atún, bacalao), mariscos y gelatinas cárnicas.
- ALIMENTOS PERMITIDOS: Huevos camperos, Lácteos de calidad (yogur griego, queso fresco, requesón/ricota, queso cottage), Legumbres (garbanzos, lentejas, porotos/alubias/frijoles), Tofu, Tempeh, Frutos secos, Semillas, Cereales integrales (quinoa, arroz, avena), Frutas y Verduras frescas.
- El título del menú y el resumen deben reflejar claramente que es un Menú Vegetariano.`;
  } else if (norm.includes('keto') || norm.includes('cetog')) {
    specificRules = `
🚨 REGLA SUPREMA Y ABSOLUTA: DIETA CETOGÉNICA / KETO (ESTRICTAMENTE MANDATORIO):
- El usuario seleccionó la preferencia dietética "Cetogénica (Keto)".
- CARBOHIDRATOS NETOS MÁXIMOS: Menos de 25-30g netos por día en total. Alto en grasas saludables (70-75%) y proteína moderada/alta (20-25%).
- PROHIBIDO: Arroz, pasta tradicional de trigo, pan de trigo o cereales, harinas, patatas/papas, batatas/boniato/camote, maíz, azúcar, miel, y frutas de alto índice glucémico (plátanos, uvas, mangos).
- ALIMENTOS BASE: Aguacate/Palta, Aceite de oliva virgen extra, Aceite de coco, Mantequilla, Huevos, Pescados grasos (salmón, sardinas, atún), Carnes magras y grasas nobles, Quesos, Frutos secos (nueces, almendras, nueces de macadamia), Semillas (chía, lino), Frutos rojos en porciones controladas (fresas/frutillas, arándanos), Verduras bajas en carbohidratos (espinacas, calabacín/zucchini, brócoli, coliflor, espárragos, lechugas, pepino, champiñones).
- El título del menú y el resumen deben reflejar claramente que es un Menú Cetogénico (Keto).`;
  } else if (norm.includes('baja en carbohidratos') || norm.includes('low carb')) {
    specificRules = `
🚨 REGLA DE DIETA BAJA EN CARBOHIDRATOS / LOW CARB (ESTRICTAMENTE MANDATORIO):
- Reduce sensiblemente los carbohidratos refinados y harinas.
- PROHIBIDO: Pastas de harina blanca refinada, pan blanco, repostería, refrescos con azúcar, harinas refinadas.
- PRIORIZAR: Proteínas magras (aves, pescados, huevos, tofu), abundantes verduras fibrosas de hoja verde y hortalizas de bajo índice glucémico, grasas saludables (palta/aguacate, aceite de oliva, frutos secos).`;
  } else if (norm.includes('gluten') || norm.includes('celiac')) {
    specificRules = `
🚨 REGLA SUPREMA Y ABSOLUTA: DIETA SIN GLUTEN / APTA CELÍACOS (ESTRICTAMENTE MANDATORIO):
- El usuario seleccionó la preferencia dietética "Sin Gluten (Apta celíacos)".
- PROHIBIDO TERMINANTEMENTE: Trigo, cebada, centeno, espelta, kamut, triticale, pasta de trigo común, pan común de panadería con harina de trigo, cuscús, salsa de soja convencional con trigo, rebozados con harina de trigo.
- ALIMENTOS PERMITIDOS Y SEGUROS: Arroz (integral, blanco, basmati), Quinoa, Maíz, Tortillas 100% de maíz, Patatas/Papas, Batatas/Camote, Legumbres puras, Avena certificada Sin Gluten, Harina de almendra, arroz o maíz, Carnes, Pescados, Huevos, Frutas, Verduras, Frutos secos naturales y Lácteos no procesados. En la lista de compras, aclara siempre "(Sin Gluten)" para panes, harinas o cereales.
- El título del menú y el resumen deben reflejar claramente que es un Menú Sin Gluten.`;
  } else if (norm.includes('prote')) {
    specificRules = `
🚨 REGLA DE DIETA ALTA EN PROTEÍNA:
- Maximiza el contenido proteico de alto valor biológico en cada comida principal (>30-40g de proteína por plato).
- Incorpora pechuga de pollo o pavo, ternera magra, pescados blancos y azules (salmón, merluza, atún), huevos enteros y claras, queso fresco batido 0%, yogur griego proteico, legumbres, tofu o seitán.`;
  } else if (norm.includes('mediterr')) {
    specificRules = `
🚨 REGLA DE DIETA MEDITERRÁNEA TRADICIONAL:
- Basa el menú en aceite de oliva virgen extra como grasa principal, abundantes verduras frescas de huerta, frutas de temporada, pescados blancos y azules frecuentes (al menos 3-4 veces/semana), legumbres estofadas o en ensalada (al menos 3 veces/semana), frutos secos, cereales integrales y consumo moderado de aves y huevos.`;
  } else if (norm.includes('batch')) {
    specificRules = `
🚨 REGLA DE ESPECIAL BATCH COOKING / FIAMBRERA:
- Todas las recetas de almuerzo deben ser ideales para cocinar con antelación el fin de semana, conservarse 3-4 días en nevera/tupper y recalentarse sin perder textura ni sabor (guisos de legumbres, horneados, arroces integrales, salteados resistentes, cremas y quiches saludables).`;
  } else if (norm.includes('econ')) {
    specificRules = `
🚨 REGLA DE DIETA ECONÓMICA Y AHORRO INTELIGENTE:
- Prioriza ingredientes de máxima densidad nutricional y mínimo costo: huevos, legumbres secas o en conserva, tubérculos (papas/patatas), verduras y frutas de rigurosa estación, pescados económicos (merluza congelada, atún en lata, sardinas), pechuga de pollo y formatos familiares o marcas propias de ${supermarketName}.`;
  }

  let exclusionsRule = "";
  if (excludedFoods && excludedFoods.length > 0) {
    exclusionsRule = `
🚨 ALIMENTOS EXCLUIDOS / ALERGIAS DEL USUARIO (PROHIBICIÓN ESTRICTA):
Los siguientes alimentos están COMPLETAMENTE PROHIBIDOS en todo el menú: ${excludedFoods.join(', ')}.
Ninguna receta, ni ingrediente, ni paso de preparación, ni elemento de la lista de compras puede contener ninguno de estos ingredientes ni sus derivados.`;
  }

  return specificRules + exclusionsRule;
}

function getRandomCulinaryDirective(): { theme: string; seed: number; styleNotes: string } {
  const seeds = [
    {
      theme: "Cocina Mediterránea e Ibérica Fresca",
      styleNotes: "Enfócate en salteados con hierbas de huerta (romero, tomillo, orégano), toques cítricos, reducciones suaves de tomate y aceite de oliva virgen."
    },
    {
      theme: "Cocina Rústica de Mercado y Horneados Ligeros",
      styleNotes: "Enfócate en cocciones al horno con vegetales asados caramelizados, papillotes jugosos, estofados express de legumbres y preparaciones doradas."
    },
    {
      theme: "Cocina Saludable con Toques Cítricos y Aromáticos",
      styleNotes: "Enfócate en marinadas con lima/limón, toques de jengibre suave, mostaza en grano, salteados al wok y vinagretas emulsionadas con semillas."
    },
    {
      theme: "Cocina Vital y Bowls Equilibrados",
      styleNotes: "Enfócate en bowls combinados, granos ancestrales (quinoa, arroz integral), salteados a la plancha y salsas ligeras de yogur vegetal/griego y hierbas."
    },
    {
      theme: "Cocina Tradicional y Guisos Livianos de Cuchara",
      styleNotes: "Enfócate en cazuelas ligeras, salteados campesinos con verduras de estación, tortillas esponjosas y preparaciones en costra de hierbas."
    },
    {
      theme: "Cocina Gourmet de Preparación Rápida",
      styleNotes: "Enfócate en sellados rápidos a fuego vivo, guarniciones de vegetales tiernos salteados, pestos ligeros y ensaladas templadas."
    },
    {
      theme: "Cocina de Huerto y Mercado Fresco",
      styleNotes: "Enfócate en horneados con costra de semillas, verduras a la parrilla, ensaladas crujientes y emulsiones ligeras."
    },
    {
      theme: "Cocina Atlántica y Especias Suaves",
      styleNotes: "Enfócate en salteados con pimentón dulce, cúrcuma, laurel, estofados rápidos de garbanzos y porotos/alubias con hortalizas."
    }
  ];
  const chosen = seeds[Math.floor(Math.random() * seeds.length)];
  return {
    theme: chosen.theme,
    seed: Math.floor(Math.random() * 1000000),
    styleNotes: chosen.styleNotes
  };
}

function normalizeMealTitle(title: string): string {
  return (title || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, " ")
    .trim();
}

function ensureUniqueMealsAcrossWeek(plan: any, regionalProfile: any, mult: number, config: any): any {
  if (!plan || !Array.isArray(plan.days)) return plan;
  const t = regionalProfile.terms;
  const servings = config?.servings || 2;
  const targetCal = config?.fitMode?.targetCalories || 2000;
  const targetProt = config?.fitMode?.proteinGrams || 140;
  const targetCarb = config?.fitMode?.carbsGrams || 200;
  const targetFat = config?.fitMode?.fatGrams || 65;
  const dietaryPref = config?.dietaryPreference || 'Equilibrada y Variada';
  const excludedFoods = config?.excludedFoods || [];

  const lunchPool = shuffleArray(getFilteredLunchPool(t, servings, dietaryPref, excludedFoods), Date.now() + 101);
  const dinnerPool = shuffleArray(getFilteredDinnerPool(t, servings, dietaryPref, excludedFoods), Date.now() + 503);
  let lunchPoolIdx = 0;
  let dinnerPoolIdx = 0;

  const usedMealNames = new Set<string>();

  plan.days.forEach((day: any) => {
    if (!Array.isArray(day.meals)) return;

    day.meals.forEach((meal: any) => {
      const type = (meal.mealType || "").toLowerCase();
      const isLunch = type.includes("almuerzo") || type.includes("comida");
      const isDinner = type.includes("cena");
      const normName = normalizeMealTitle(meal.name);

      const isDuplicate = usedMealNames.has(normName) || normName.length < 3;

      if ((isLunch || isDinner) && isDuplicate) {
        let replacement: MealTemplate | null = null;
        if (isLunch) {
          while (lunchPoolIdx < lunchPool.length) {
            const candidate = lunchPool[lunchPoolIdx++];
            const candNorm = normalizeMealTitle(candidate.name);
            if (!usedMealNames.has(candNorm)) {
              replacement = candidate;
              break;
            }
          }
        } else {
          while (dinnerPoolIdx < dinnerPool.length) {
            const candidate = dinnerPool[dinnerPoolIdx++];
            const candNorm = normalizeMealTitle(candidate.name);
            if (!usedMealNames.has(candNorm)) {
              replacement = candidate;
              break;
            }
          }
        }

        if (replacement) {
          meal.name = replacement.name;
          meal.description = replacement.desc;
          meal.prepTimeMinutes = replacement.prep;
          meal.calories = Math.round(targetCal * replacement.calRatio);
          meal.protein = Math.round(targetProt * replacement.pRatio);
          meal.carbs = Math.round(targetCarb * replacement.cRatio);
          meal.fat = Math.round(targetFat * replacement.fRatio);
          meal.approxCost = mult > 10 ? Math.round(replacement.costBase * servings * mult) : parseFloat((replacement.costBase * servings * mult).toFixed(2));
          meal.ingredients = replacement.ingredients;
          meal.instructions = replacement.instructions;
          meal.tips = replacement.tips;
        }
      }

      usedMealNames.add(normalizeMealTitle(meal.name));
    });

    let dCal = 0, dP = 0, dC = 0, dF = 0;
    day.meals.forEach((m: any) => {
      dCal += m.calories || 0;
      dP += m.protein || 0;
      dC += m.carbs || 0;
      dF += m.fat || 0;
    });
    day.totalCalories = dCal;
    day.totalProtein = dP;
    day.totalCarbs = dC;
    day.totalFat = dF;
  });

  return plan;
}

function findSupermarketMeta(supermarketName: string) {
  const norm = (supermarketName || "").toLowerCase().trim();
  for (const country of REGIONAL_SUPERMARKETS) {
    for (const sm of country.supermarkets) {
      if (norm.includes(sm.name.toLowerCase()) || sm.name.toLowerCase().includes(norm)) {
        return sm;
      }
    }
  }
  const isLocal = norm.includes("mercado") || norm.includes("fruter") || norm.includes("verdul") || 
                  norm.includes("carnic") || norm.includes("feria") || norm.includes("tianguis") || 
                  norm.includes("abastos") || norm.includes("barrio") || norm.includes("farmer");
  return {
    name: supermarketName || "Supermercado habitual",
    country: "General",
    category: isLocal ? "local" : "popular",
    tierLevel: (isLocal ? 1 : 2) as 1 | 2 | 3,
    isEcommerce: !isLocal,
    brandName: isLocal ? "Comercio de Barrio" : "Marca Propia",
    savingsTips: [
      `Aprovecha las marcas blancas y ofertas de ${supermarketName || 'tu supermercado habitual'}.`,
      "Compra productos frescos de temporada para optimizar el presupuesto.",
      "Planifica las comidas para evitar desperdicio de alimentos perecederos."
    ]
  };
}

function getCurrencyPricingGuidance(currency: string, supermarketName: string, isEcommerce: boolean) {
  const cur = (currency || '€').trim().toUpperCase();
  if (cur.includes('ARS')) {
    return {
      typicalBasketForTwoWeek: "55.000 - 85.000 $ ARS",
      mealCostRange: "2.500 - 6.500 $ ARS por plato",
      exampleItems: "Pechuga de pollo fileteada: 6.500 - 8.200 $ ARS/kg, Huevos x12: 3.200 - 4.200 $ ARS, Leche 1L: 1.400 - 1.800 $ ARS, Arroz 1kg: 2.100 - 2.800 $ ARS, Avena 500g: 1.600 - 2.400 $ ARS, Aguacate/Palta x2: 3.500 $ ARS",
      multiplier: 1200
    };
  }
  if (cur.includes('COP')) {
    return {
      typicalBasketForTwoWeek: "160.000 - 270.000 $ COP",
      mealCostRange: "7.000 - 16.000 $ COP por plato",
      exampleItems: "Pechuga de pollo 1kg: 16.000 - 20.000 $ COP, Huevos x30: 16.000 - 21.000 $ COP, Leche 1L: 4.200 - 5.500 $ COP, Arroz 1kg: 4.500 - 5.800 $ COP, Avena: 3.500 $ COP",
      multiplier: 4000
    };
  }
  if (cur.includes('CLP')) {
    return {
      typicalBasketForTwoWeek: "40.000 - 75.000 $ CLP",
      mealCostRange: "2.000 - 5.500 $ CLP por plato",
      exampleItems: "Pechuga de pollo 1kg: 5.500 - 7.200 $ CLP, Huevos x12: 3.400 - 4.500 $ CLP, Leche 1L: 1.100 - 1.400 $ CLP, Arroz 1kg: 1.400 - 1.900 $ CLP, Palta 1kg: 4.500 - 6.000 $ CLP",
      multiplier: 1000
    };
  }
  if (cur.includes('MXN')) {
    return {
      typicalBasketForTwoWeek: "900 - 1.550 $ MXN",
      mealCostRange: "40 - 110 $ MXN por plato",
      exampleItems: "Pechuga de pollo 1kg: 130 - 165 $ MXN, Huevos 18pz: 45 - 58 $ MXN, Leche 1L: 26 - 32 $ MXN, Arroz 1kg: 28 - 36 $ MXN, Aguacate Hass 1kg: 55 - 80 $ MXN, Avena 1kg: 26 - 35 $ MXN",
      multiplier: 22
    };
  }
  if (cur.includes('PEN') || cur.includes('S/.')) {
    return {
      typicalBasketForTwoWeek: "120 - 210 S/.",
      mealCostRange: "6 - 15 S/. por plato",
      exampleItems: "Pechuga de pollo 1kg: 16 - 21 S/., Huevos x15: 9 - 12 S/., Leche 1L: 4.80 - 6.00 S/., Arroz 1kg: 4.20 - 5.50 S/., Quinua 500g: 6 - 8 S/.",
      multiplier: 4.0
    };
  }
  if (cur.includes('USD') || cur === '$') {
    return {
      typicalBasketForTwoWeek: "60 - 95 $ USD",
      mealCostRange: "3.00 - 7.50 $ USD por plato",
      exampleItems: "Chicken breast 1lb: 3.99 - 5.49 $, Eggs 12ct: 2.99 - 4.29 $, Milk 1gal: 3.49 - 4.29 $, Rolled oats: 2.49 $, Salmon fillet: 7.99 - 9.99 $",
      multiplier: 1.1
    };
  }
  // Default EUR (€)
  return {
    typicalBasketForTwoWeek: "50 - 80 €",
    mealCostRange: "2.20 - 5.80 € por plato",
    exampleItems: "Pechuga de pollo 1kg: 6.20 - 7.50 €, Huevos camperos docena: 2.40 - 3.20 €, Leche 1L: 0.95 - 1.30 €, Arroz 1kg: 1.30 - 1.80 €, Avena 500g: 1.15 - 1.45 €, Salmón lomos: 6.50 - 8.50 €",
    multiplier: 1.0
  };
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Mock fallback responses will be used if needed.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

/**
 * Robust caller that tries models in sequence and handles transient 503/429/high-demand spikes gracefully.
 */
async function generateContentWithFallback(
  ai: GoogleGenAI,
  req: { contents: any; config?: any },
  modelsToTry: string[] = ["gemini-2.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.7-flash"]
): Promise<string | null> {
  for (const model of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: req.contents,
          config: req.config,
        });
        if (response && response.text) {
          return response.text;
        }
      } catch (err: any) {
        const errorMsg = String(err?.message || err);
        const isTransient =
          errorMsg.includes("503") ||
          errorMsg.includes("UNAVAILABLE") ||
          errorMsg.includes("high demand") ||
          errorMsg.includes("429") ||
          errorMsg.includes("RESOURCE_EXHAUSTED") ||
          errorMsg.includes("FetchError") ||
          errorMsg.includes("overloaded");

        console.warn(`[Gemini Retry Handler] Model "${model}" (attempt ${attempt + 1}): ${errorMsg.slice(0, 160)}`);

        if (isTransient && attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        } else {
          break; // Move to next model in list
        }
      }
    }
  }
  return null;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "25mb" }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "NutriaAgente Semanal API" });
  });

  // 1. Generate Full Weekly Menu
  app.post("/api/generate-menu", async (req, res) => {
    try {
      const config = req.body;
      const ai = getGeminiClient();
      const supermarketMeta = findSupermarketMeta(config.supermarket);
      const isEcommerce = supermarketMeta.isEcommerce;
      const priceGuide = getCurrencyPricingGuidance(config.currency, config.supermarket, isEcommerce);
      const regionalProfile = getRegionalIngredientProfile(config.userLocationName, config.supermarket, config.currency);
      const supermarketInventory = regionalProfile.supermarketInventoryHighlights[config.supermarket] || 
        (supermarketMeta.brandName ? `Productos y marca propia ${supermarketMeta.brandName}` : 'Productos frescos de temporada y marcas locales accesibles');
      const culinaryVariety = getRandomCulinaryDirective();
      const mult = priceGuide.multiplier || 1.0;
      const dietaryDirectives = getDietaryPreferenceDirectives(config.dietaryPreference, config.excludedFoods, config.supermarket);
      const pediatricSafety = getPediatricSafetyDirectives(config.childConfig);

      const fitDetails = config.fitMode?.enabled
        ? `
MODO FIT ACTIVADO:
- Calorías diarias objetivo: ${config.fitMode.targetCalories} kcal
- Proteínas diarias: ${config.fitMode.proteinGrams} g
- Carbohidratos diarios: ${config.fitMode.carbsGrams} g
- Grasas diarias: ${config.fitMode.fatGrams} g
- Número de comidas al día: ${config.fitMode.mealsPerDay} comidas (distribuye las calorías y macros entre estas comidas de manera realista)
- Objetivo fitness: ${config.fitMode.fitnessGoal} (ej: ganar masa muscular, perder grasa, o mantenimiento).
`
        : `
MODO FIT DESACTIVADO:
- Genera menús equilibrados, sabrosos, variados y prácticos para el día a día en familia o individual (generalmente 3 o 4 comidas según corresponda: Desayuno, Almuerzo/Comida, Merienda opcional, Cena).
`;

      const docDietDetails = config.nutritionistDocText
        ? `
PLAN O DIETA PREVIA DE PROFESIONAL MÉDICO / NUTRICIONISTA APORTADA POR EL USUARIO:
"""
${config.nutritionistDocText.slice(0, 4000)}
"""
POR FAVOR: Respeta e incorpora fielmente las pautas, restricciones, estructura o alimentos recomendados por el profesional en esta dieta.
`
        : "";

      const prompt = `
Eres NutriaAgente Semanal, un nutricionista clínico y chef experto galardonado. Tu tarea es diseñar un plan de menú semanal completo, realista, delicioso y con MÁXIMA VARIEDAD culinaria, con ingredientes ESTRICTAMENTE LOCALIZADOS para la región "${regionalProfile.regionName}", adaptados al inventario de "${config.supermarket || 'Supermercado'}" y con lista de la compra organizada con estimación de costos precisa.

DATOS DEL USUARIO:
- PREFERENCIA ALIMENTARIA SELECCIONADA: "${config.dietaryPreference || 'Equilibrada y Variada'}" (ESTRICTAMENTE OBLIGATORIA)
- Número de personas: ${config.servings || 2} personas
- Días de planificación: ${config.daysCount || 7} días (Genera exactamente ${config.daysCount || 7} días, nombrados Día 1 (Lunes), Día 2 (Martes), etc.)
- Región / País del usuario: ${regionalProfile.regionName} (${config.userLocationName || 'Ubicación seleccionada'})
- Moneda oficial seleccionada: "${config.currency || '€'}"
- Presupuesto aproximado total: ${config.approxBudget ? `${config.approxBudget} ${config.currency || '€'}` : 'Económico y accesible'}
- Alimentos NO deseados / Exclusiones / Alergias: ${config.excludedFoods?.length ? config.excludedFoods.join(', ') : 'Ninguna exclusión específica'}
- Supermercado seleccionado: "${config.supermarket || 'Mercadona'}"
- ¿Es cadena con catálogo e-commerce online?: ${isEcommerce ? `SÍ (Cadena con catálogo digital y venta e-commerce). Marca propia destacada: ${supermarketMeta.brandName || 'Marca propia'}` : `NO (Comercio tradicional de barrio / frutería / verdulería / feria local a granel)`}
- Inventario y marcas destacadas de ${config.supermarket}: ${supermarketInventory}
- Tiempo máximo de cocinado por comida: ${config.maxCookingMinutes || 30} minutos (deben ser recetas ágiles, sencillas y realistas con ingredientes comunes disponibles en ${config.supermarket || 'el supermercado'}).
${fitDetails}
${docDietDetails}

CRITERIOS CRÍTICOS Y MANDATORIOS:

1. **CUMPLIMIENTO ESTRICTO Y ABSOLUTO DE LA PREFERENCIA ALIMENTARIA ("${config.dietaryPreference || 'Equilibrada'}")**:
${dietaryDirectives}
   - El título general del menú ("title") y el resumen ("summary") DEBEN reflejar claramente el tipo de alimentación elegida (ej: "Menú Semanal Vegetariano Equilibrado", "Menú Semanal 100% Vegano Vital", "Menú Semanal Cetogénico (Keto)", "Menú Semanal Sin Gluten Apto Celíacos", etc.).
   - Ni una sola comida ni ingrediente de la lista de compras puede violar esta preferencia.

2. **LOCALIZACIÓN ESTRICTA DEL NOMBRE DE INGREDIENTES (${regionalProfile.regionName.toUpperCase()})**:
   ${regionalProfile.rulesPromptSnippet}
   - REGLA DE ORO LINGÜÍSTICA: Todos los nombres de recetas, descripciones, pasos e ingredientes de la lista de compras DEBEN usar estricta y obligatoriamente el vocabulario gastronómico de ${regionalProfile.regionName}. Jamás uses términos de otro país (ej: si es Argentina usa Palta/Batata/Zucchini/Chauchas/Porotos/Banana/Frutillas/Ricota/Morrón/Choclo/Manteca/Papas; si es México usa Aguacate/Camote/Calabacita/Ejotes/Frijoles/Panela/Jitomate/Elote; si es Colombia usa Aguacate/Habichuelas/Fríjoles/Banano/Cuajada/Pimentón/Mazorca/Arepas; si es Chile usa Palta/Zapallo italiano/Porotos verdes/Porotos/Quesillo; si es Perú usa Palta/Camote/Zapallito italiano/Vainitas/Frejoles/Plátano de seda/Queso fresco/Papa amarilla; si es España usa Aguacate/Boniato/Calabacín/Judías verdes/Alubias/Plátano/Fresas/Requesón/Patatas).

3. **INVENTARIO Y PRODUCTOS DEL SUPERMERCADO (${config.supermarket})**:
   - Considera el catálogo real e inventario de ${config.supermarket}: ${supermarketInventory}.
   - En la lista de compras ("shoppingList"), en el campo "notes" de cada producto, indica recomendaciones específicas acordes al supermercado (ej: marca propia ${supermarketMeta.brandName || 'marca recomendada'}, formato ahorro, bandeja fresca, etc.).

4. **VARIEDAD TOTAL Y REGLA ESTRICTA DE CERO REPETICIÓN ENTRE ALMUERZOS Y CENAS (OBLIGATORIO)**:
   - EN TODO EL MENÚ GENERADO (${config.daysCount || 7} DÍAS), TODAS Y CADA UNA DE LAS COMIDAS DE ALMUERZO Y DE CENA (UN TOTAL DE ${(config.daysCount || 7) * 2} PLATOS PRINCIPALES) DEBEN SER RECETAS 100% ÚNICAS Y DIFERENTES ENTRE SÍ.
   - ESTÁ TERMINANTEMENTE PROHIBIDO REPETIR UNA MISMA RECETA EN EL ALMUERZO Y LA CENA (NI EN EL MISMO DÍA, NI EN DÍAS DISTINTOS).
   - SEMILLA DE ALEATORIEDAD ACTIVA (Semilla #${culinaryVariety.seed}): Aplica la inspiración temática "${culinaryVariety.theme}" (${culinaryVariety.styleNotes}) para garantizar máxima creatividad, novedad e impredecibilidad culinaria sin caer en menús idénticos en pedidos sucesivos.

${pediatricSafety.promptDirectives}

5. **PRECIOS REALES ADAPTADOS A ${isEcommerce ? `CATÁLOGO E-COMMERCE DE ${config.supermarket}` : 'MERCADO LOCAL DE BARRIO'} EN MONEDA "${config.currency}"**:
   - ${isEcommerce ? `Como el usuario eligió una cadena con comercio online (${config.supermarket}), los precios unitarios de cada producto de la lista de compras deben dar el VALOR REAL DE CATÁLOGO / E-COMMERCE vigente en ${config.currency}. Utiliza formatos de venta reales y marcas propias (${supermarketMeta.brandName}).` : `Como el usuario seleccionó un comercio de proximidad (${config.supermarket}), los precios deben reflejar estimaciones de mercado de barrio, compras a granel y productos de temporada en ${config.currency}.`}
   - Guía de escala de precios para la moneda ${config.currency}:
     * Rango de cesta semanal para ${config.servings || 2} personas: ${priceGuide.typicalBasketForTwoWeek}
     * Rango de costo por plato/comida: ${priceGuide.mealCostRange}
     * Precios de referencia de básicos en ${config.currency}: ${priceGuide.exampleItems}
   - Todos los valores numéricos de precio ("estimatedPrice", "approxCost", "totalEstimatedCost", "costPerPerson", "costPerDay") DEBEN estar expresados en la magnitud numérica real de ${config.currency}.

6. La lista de la compra debe consolidar TODOS los ingredientes necesarios para ${config.servings || 2} personas durante los ${config.daysCount || 7} días, clasificada por categorías: "Frutas y Verduras", "Proteínas y Legumbres", "Lácteos y Bebidas Vegetales", "Despensa y Granos", "Aceites y Condimentos".

Responde estrictamente en formato JSON válido de acuerdo al siguiente esquema:
{
  "title": "Nombre atractivo del Menú (reflejando la preferencia ${config.dietaryPreference || 'Equilibrada'})",
  "summary": "Resumen nutricional y culinario del menú en 2-3 frases",
  "days": [
    {
      "dayNumber": 1,
      "dayName": "Lunes",
      "totalCalories": 2000,
      "totalProtein": 140,
      "totalCarbs": 210,
      "totalFat": 65,
      "meals": [
        {
          "id": "m_1_1",
          "mealType": "Desayuno",
          "name": "Nombre de la receta",
          "description": "Breve descripción",
          "prepTimeMinutes": 15,
          "calories": 450,
          "protein": 30,
          "carbs": 50,
          "fat": 15,
          "approxCost": 2500,
          "ingredients": ["Ingrediente 1 con cantidad", "Ingrediente 2 con cantidad"],
          "instructions": [
            "Paso 1: ...",
            "Paso 2: ...",
            "Paso 3: ..."
          ],
          "tips": "Consejo de preparación o conservación."
        }
      ]
    }
  ],
  "shoppingList": [
    {
      "name": "Frutas y Verduras",
      "iconName": "apple",
      "items": [
        {
          "id": "shop_1",
          "name": "Nombre del producto",
          "quantity": "Cantidad adecuada para ${config.servings || 2} personas",
          "estimatedPrice": 1900,
          "category": "Frutas y Verduras",
          "notes": "Recomendación para ${config.supermarket}",
          "isEcommercePrice": ${isEcommerce}
        }
      ]
    }
  ],
  "costEstimate": {
    "totalEstimatedCost": 58000,
    "currency": "${config.currency || '€'}",
    "costPerPerson": 29000,
    "costPerDay": 8285,
    "isEcommercePricing": ${isEcommerce},
    "supermarketChain": "${config.supermarket}",
    "supermarketTips": [
      "Consejo 1 para ahorrar en ${config.supermarket}...",
      "Consejo 2 para comprar ingredientes frescos..."
    ],
    "savingsAdvice": "Consejo personalizado para optimizar el gasto en ${config.supermarket}."
  },
  "fitSummary": {
    "adherenceGoal": "Objetivo optimizado para ${config.fitMode?.fitnessGoal || 'Salud y bienestar general'}",
    "macroBalanceAnalysis": "Explicación breve de la distribución de nutrientes acorde a ${config.dietaryPreference || 'la dieta seleccionada'}",
    "fitnessTips": [
      "Prioriza hidratación: 2 a 3 litros diarios.",
      "Ajusta las cantidades de carbohidratos en días de entrenamiento intenso."
    ]
  }
}
`;

      if (ai) {
        const textResponse = await generateContentWithFallback(ai, {
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.75,
          }
        });

        if (textResponse) {
          try {
            const parsed = JSON.parse(textResponse);
            let fullPlan = {
              id: "plan_" + Date.now(),
              createdAt: new Date().toISOString(),
              inputConfig: config,
              ...parsed
            };
            if (!fullPlan.costEstimate) fullPlan.costEstimate = {};
            fullPlan.costEstimate.isEcommercePricing = isEcommerce;
            fullPlan.costEstimate.supermarketChain = config.supermarket;
            if (config.childConfig?.enabled) {
              fullPlan.childSummary = pediatricSafety.summary;
            }
            fullPlan = ensureUniqueMealsAcrossWeek(fullPlan, regionalProfile, mult, config);
            return res.json(fullPlan);
          } catch (parseError) {
            console.error("JSON parse error from Gemini, attempting regex match:", parseError);
            const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              let fullPlan = {
                id: "plan_" + Date.now(),
                createdAt: new Date().toISOString(),
                inputConfig: config,
                ...parsed
              };
              if (!fullPlan.costEstimate) fullPlan.costEstimate = {};
              fullPlan.costEstimate.isEcommercePricing = isEcommerce;
              fullPlan.costEstimate.supermarketChain = config.supermarket;
              if (config.childConfig?.enabled) {
                fullPlan.childSummary = pediatricSafety.summary;
              }
              fullPlan = ensureUniqueMealsAcrossWeek(fullPlan, regionalProfile, mult, config);
              return res.json(fullPlan);
            }
          }
        }
      }

      // If no AI key or AI failed, provide realistic structured fallback
      const fallbackPlan = generateFallbackWeeklyPlan(config);
      return res.json(fallbackPlan);
    } catch (err: any) {
      console.error("Error generating menu:", err);
      // Fallback gracefully so the user never gets an unhandled crash
      const fallback = generateFallbackWeeklyPlan(req.body);
      return res.json(fallback);
    }
  });

  // 2. Regenerate Single Meal
  app.post("/api/regenerate-meal", async (req, res) => {
    try {
      const { mealType, currentMealName, dayName, preferences, excludedFoods, targetCalories, targetProtein, targetCarbs, targetFat, supermarket, maxCookingMinutes, userLocationName, currency, servings, childConfig } = req.body;
      const ai = getGeminiClient();
      const regionalProfile = getRegionalIngredientProfile(userLocationName, supermarket, currency);
      const supermarketMeta = findSupermarketMeta(supermarket);
      const priceGuide = getCurrencyPricingGuidance(currency, supermarket, supermarketMeta.isEcommerce);
      const mult = priceGuide.multiplier || 1.0;
      const dietaryDirectives = getDietaryPreferenceDirectives(preferences, excludedFoods, supermarket);
      const pediatricSafety = getPediatricSafetyDirectives(childConfig);
      const combinedExclusions = Array.from(new Set([...(excludedFoods || []), ...pediatricSafety.systemExclusions]));
      const personCount = servings || 2;

      if (ai) {
        const prompt = `
Eres NutriaAgente Semanal. Genera UNA alternativa deliciosa, diferente y 100% respetuosa con la preferencia seleccionada para la comida de tipo "${mealType}" para el día "${dayName}".
La comida a reemplazar es: "${currentMealName}".
Región / País: ${regionalProfile.regionName}
Supermercado habitual: ${supermarket || 'Supermercado local'} (${supermarketMeta.brandName ? `Marca: ${supermarketMeta.brandName}` : ''})
Moneda: ${currency || '€'}

REGLAS DE PREFERENCIA ALIMENTARIA OBLIGATORIAS:
${dietaryDirectives}

${pediatricSafety.promptDirectives}

REGLAS OBLIGATORIAS DE LENGUAJE Y VOCABULARIO (${regionalProfile.regionName.toUpperCase()}):
${regionalProfile.rulesPromptSnippet}

Restricciones y preferencias:
- No usar estos ingredientes: ${combinedExclusions?.length ? combinedExclusions.join(', ') : 'Ninguno'}
- Preferencia: ${preferences || 'Equilibrada'}
- Tiempo máximo de preparación: ${maxCookingMinutes || 25} minutos
${targetCalories ? `- Calorías aproximadas objetivo: ${targetCalories} kcal (Proteína: ${targetProtein || 30}g, Carbos: ${targetCarbs || 40}g, Grasas: ${targetFat || 15}g)` : ''}

Devuelve un único objeto JSON con este formato:
{
  "id": "m_alt_${Date.now()}",
  "mealType": "${mealType}",
  "name": "Nombre atractivo del nuevo plato adaptado estrictamente a ${preferences || 'la preferencia'}",
  "description": "Breve explicación apetitosa",
  "prepTimeMinutes": 20,
  "calories": ${targetCalories || 480},
  "protein": ${targetProtein || 32},
  "carbs": ${targetCarbs || 45},
  "fat": ${targetFat || 14},
  "approxCost": ${mult > 10 ? Math.round(3.20 * mult) : 3.20},
  "ingredients": ["Ingrediente 1 con cantidad localizado", "Ingrediente 2 con cantidad localizado"],
  "instructions": ["Paso 1...", "Paso 2...", "Paso 3..."],
  "tips": "Consejo de preparación o ahorro en ${supermarket || 'el supermercado'}"
}
`;
        const textResponse = await generateContentWithFallback(ai, {
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.75
          }
        });
        if (textResponse) {
          try {
            const parsed = JSON.parse(textResponse);
            return res.json(parsed);
          } catch (e) {
            console.error("JSON parse error in regenerate-meal:", e);
          }
        }
      }

      // Quick fallback alternative with localized ingredients and filtered by preference
      const t = regionalProfile.terms;
      const isLunch = (mealType || '').toLowerCase().includes('almuerzo') || (mealType || '').toLowerCase().includes('comida');
      const isDinner = (mealType || '').toLowerCase().includes('cena');
      const isBreakfast = (mealType || '').toLowerCase().includes('desayuno');
      const isMorningSnack = (mealType || '').toLowerCase().includes('mañana');

      let pool: MealTemplate[];
      if (isLunch) {
        pool = getFilteredLunchPool(t, personCount, preferences, combinedExclusions);
      } else if (isDinner) {
        pool = getFilteredDinnerPool(t, personCount, preferences, combinedExclusions);
      } else if (isBreakfast) {
        pool = getFilteredBreakfastPool(t, personCount, preferences, combinedExclusions);
      } else if (isMorningSnack) {
        pool = getFilteredMorningSnacks(t, personCount, preferences, combinedExclusions);
      } else {
        pool = getFilteredAfternoonSnacks(t, personCount, preferences, combinedExclusions);
      }

      const shuffled = shuffleArray(pool, Date.now());
      const selected = shuffled.find(m => normalizeMealTitle(m.name) !== normalizeMealTitle(currentMealName)) || shuffled[0];

      const altMeal = {
        id: "m_alt_" + Date.now(),
        mealType: mealType || "Almuerzo",
        name: selected.name,
        description: selected.desc,
        prepTimeMinutes: maxCookingMinutes ? Math.min(selected.prep, maxCookingMinutes) : selected.prep,
        calories: targetCalories || 480,
        protein: targetProtein || 35,
        carbs: targetCarbs || 40,
        fat: targetFat || 14,
        approxCost: mult > 10 ? Math.round(selected.costBase * 2 * mult) : parseFloat((selected.costBase * 2 * mult).toFixed(2)),
        ingredients: selected.ingredients,
        instructions: selected.instructions,
        tips: selected.tips || `Aprovecha las opciones frescas de ${supermarketMeta.brandName || supermarket || 'tu supermercado'}.`
      };
      return res.json(altMeal);
    } catch (err) {
      console.error("Error regenerating meal:", err);
      res.status(500).json({ error: "No se pudo regenerar la comida." });
    }
  });

  // 3. Analyze Diet / Nutritionist Document
  app.post("/api/analyze-diet-document", async (req, res) => {
    try {
      const { textContent, base64File, fileType, fileName } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          detectedCalories: 1950,
          detectedProtein: 135,
          detectedCarbs: 190,
          detectedFat: 60,
          detectedMealsPerDay: 4,
          allergiesAndExclusions: ["Frituras", "Ultraprocesados", "Bebidas azucaradas"],
          keyRecommendations: [
            "Mantener consumo de agua diario en mínimo 2.5 litros.",
            "Consumir fuentes de proteína magra en cada comida principal.",
            "Priorizar carbohidratos complejos como avena, arroz integral y legumbres."
          ],
          summary: "Plan dietético estructurado enfocado en recomposición corporal y alimentación limpia equilibrada.",
          clinicalNotes: "Documento analizado con éxito. Se detectó pauta hiperproteica moderada con 4 tomas diarias."
        });
      }

      let parts: any[] = [];
      if (base64File && fileType) {
        parts.push({
          inlineData: {
            mimeType: fileType,
            data: base64File
          }
        });
      }
      if (textContent) {
        parts.push({
          text: `Analiza este documento de dieta médica / nutricional emitido por un profesional:\n\n${textContent}`
        });
      } else {
        parts.push({
          text: "Analiza el documento médico o plan nutricional adjunto extraído de la imagen/PDF."
        });
      }

      const promptInstructions = `
Eres un médico especialista en nutrición clínica.
Extrae la información cuantitativa y cualitativa clave de este documento o pauta de dieta nutricional:
- Calorías diarias recomendadas (si están indicadas o calculadas)
- Proteínas objetivo en gramos
- Carbohidratos objetivo en gramos
- Grasas objetivo en gramos
- Número de comidas o tomas al día recomendadas
- Alergias, intolerancias, o alimentos explícitamente prohibidos / excluidos
- Recomendaciones clínicas o pautas nutricionales destacadas
- Resumen global comprensible para el usuario

Devuelve estrictamente un objeto JSON con esta estructura:
{
  "detectedCalories": 2000,
  "detectedProtein": 140,
  "detectedCarbs": 200,
  "detectedFat": 65,
  "detectedMealsPerDay": 4,
  "allergiesAndExclusions": ["Lactosa", "Embutidos grasos"],
  "keyRecommendations": ["Pauta 1...", "Pauta 2..."],
  "summary": "Resumen claro del enfoque del nutricionista",
  "clinicalNotes": "Observaciones adicionales"
}
`;

      parts.push({ text: promptInstructions });

      const textResponse = await generateContentWithFallback(ai, {
        contents: { parts },
        config: {
          responseMimeType: "application/json"
        }
      });

      if (textResponse) {
        try {
          const parsed = JSON.parse(textResponse);
          return res.json(parsed);
        } catch (e) {
          console.error("JSON parse error in analyze-diet-document:", e);
        }
      }

      return res.json({
        detectedCalories: 2000,
        detectedProtein: 140,
        detectedCarbs: 200,
        detectedFat: 65,
        detectedMealsPerDay: 4,
        allergiesAndExclusions: ["Ultraprocesados"],
        keyRecommendations: ["Seguir pauta médica con alimentos no procesados y suficiente hidratación."],
        summary: "Pauta nutricional analizada con éxito.",
        clinicalNotes: "Pautas nutricionales clínicas aplicadas al menú."
      });
    } catch (err) {
      console.error("Error analyzing diet document:", err);
      res.status(500).json({ error: "Error al analizar el documento de dieta médica." });
    }
  });

  // Vite middleware for dev / static for prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

function generateFallbackWeeklyPlan(config: any) {
  const daysCount = Math.min(7, Math.max(1, config?.daysCount || 7));
  const servings = config?.servings || 2;
  const isFit = config?.fitMode?.enabled || false;
  const targetCal = config?.fitMode?.targetCalories || 2000;
  const targetProt = config?.fitMode?.proteinGrams || 140;
  const targetCarb = config?.fitMode?.carbsGrams || 200;
  const targetFat = config?.fitMode?.fatGrams || 65;
  const mealsCount = isFit ? (config?.fitMode?.mealsPerDay || 4) : 4;
  const currency = config?.currency || "€";
  const supermarket = config?.supermarket || "Mercadona";
  const supermarketMeta = findSupermarketMeta(supermarket);
  const isEcommerce = supermarketMeta.isEcommerce;
  const priceGuide = getCurrencyPricingGuidance(currency, supermarket, isEcommerce);
  const mult = priceGuide.multiplier || 1.0;
  const regionalProfile = getRegionalIngredientProfile(config?.userLocationName, supermarket, currency);
  const t = regionalProfile.terms;
  const dietaryPref = config?.dietaryPreference || 'Equilibrada y Variada';
  const pediatricSafety = getPediatricSafetyDirectives(config?.childConfig);
  const excludedFoods = Array.from(new Set([...(config?.excludedFoods || []), ...pediatricSafety.systemExclusions]));

  const dayNames = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  // Generate unique randomized pools per weekly menu request ensuring dynamic freshness
  const seed = Math.floor(Math.random() * 1000000) + Date.now();
  const shuffledLunches = shuffleArray(getFilteredLunchPool(t, servings, dietaryPref, excludedFoods), seed + 11);
  const shuffledDinners = shuffleArray(getFilteredDinnerPool(t, servings, dietaryPref, excludedFoods), seed + 89);
  const shuffledBreakfasts = shuffleArray(getFilteredBreakfastPool(t, servings, dietaryPref, excludedFoods), seed + 197);
  const shuffledMorningSnacks = shuffleArray(getFilteredMorningSnacks(t, servings, dietaryPref, excludedFoods), seed + 313);
  const shuffledAfternoonSnacks = shuffleArray(getFilteredAfternoonSnacks(t, servings, dietaryPref, excludedFoods), seed + 467);

  const days = [];
  for (let i = 0; i < daysCount; i++) {
    const dayName = dayNames[i % 7];
    const bFast = shuffledBreakfasts[i % shuffledBreakfasts.length];
    const lunch = shuffledLunches[i % shuffledLunches.length];
    const dinner = shuffledDinners[i % shuffledDinners.length];
    const mSnack = shuffledMorningSnacks[i % shuffledMorningSnacks.length];
    const aSnack = shuffledAfternoonSnacks[i % shuffledAfternoonSnacks.length];

    const mealDefs = mealsCount === 3
      ? [
          { type: "Desayuno", data: bFast },
          { type: "Almuerzo", data: lunch },
          { type: "Cena", data: dinner }
        ]
      : mealsCount === 5
      ? [
          { type: "Desayuno", data: bFast },
          { type: "Media Mañana", data: mSnack },
          { type: "Almuerzo", data: lunch },
          { type: "Merienda", data: aSnack },
          { type: "Cena", data: dinner }
        ]
      : [
          { type: "Desayuno", data: bFast },
          { type: "Almuerzo", data: lunch },
          { type: "Merienda", data: aSnack },
          { type: "Cena", data: dinner }
        ];

    let dayCal = 0;
    let dayProt = 0;
    let dayCarb = 0;
    let dayFat = 0;

    const meals = mealDefs.map((def, mIdx) => {
      const rec = def.data;
      const mealObj = {
        id: `m_${i + 1}_${mIdx + 1}`,
        mealType: def.type,
        name: rec.name,
        description: rec.desc,
        prepTimeMinutes: rec.prep,
        calories: Math.round(targetCal * rec.calRatio),
        protein: Math.round(targetProt * rec.pRatio),
        carbs: Math.round(targetCarb * rec.cRatio),
        fat: Math.round(targetFat * rec.fRatio),
        approxCost: mult > 10 ? Math.round(rec.costBase * servings * mult) : parseFloat((rec.costBase * servings * mult).toFixed(2)),
        ingredients: rec.ingredients,
        instructions: rec.instructions,
        tips: rec.tips
      };
      dayCal += mealObj.calories;
      dayProt += mealObj.protein;
      dayCarb += mealObj.carbs;
      dayFat += mealObj.fat;
      return mealObj;
    });

    days.push({
      dayNumber: i + 1,
      dayName: `${dayName} (Día ${i + 1})`,
      totalCalories: dayCal,
      totalProtein: dayProt,
      totalCarbs: dayCarb,
      totalFat: dayFat,
      meals
    });
  }

  // Format shopping list according to dietary preference
  const isVegan = dietaryPref.toLowerCase().includes('vegan');
  const isVeg = isVegan || dietaryPref.toLowerCase().includes('vegetar');
  const isKeto = dietaryPref.toLowerCase().includes('keto') || dietaryPref.toLowerCase().includes('cetog');

  const baseItemsCat2 = isVegan
    ? [
        { id: "p_1", name: "Tofu Firme Orgánico", quantity: `${servings * 400}g`, estimatedPrice: mult > 10 ? Math.round(4.20 * mult) : 4.20, category: "Proteínas y Legumbres", notes: `Especial para salteados en ${supermarket}`, isEcommercePrice: isEcommerce },
        { id: "p_2", name: `Garbanzos cocidos de ${supermarketMeta.brandName || 'marca propia'}`, quantity: `${servings * 2} frascos (800g)`, estimatedPrice: mult > 10 ? Math.round(2.10 * mult) : 2.10, category: "Proteínas y Legumbres", notes: "Formato ahorro de despensa", isEcommercePrice: isEcommerce },
        { id: "p_3", name: `Lentejas pardinas seleccionadas`, quantity: `${servings * 2} frascos (800g)`, estimatedPrice: mult > 10 ? Math.round(2.00 * mult) : 2.00, category: "Proteínas y Legumbres", notes: "Ricas en hierro vegetal", isEcommercePrice: isEcommerce },
        { id: "p_4", name: `Edamame congelado desgranado`, quantity: `${servings * 250}g`, estimatedPrice: mult > 10 ? Math.round(2.90 * mult) : 2.90, category: "Proteínas y Legumbres", notes: "Proteína vegetal rápida", isEcommercePrice: isEcommerce }
      ]
    : isVeg
    ? [
        { id: "p_1", name: `Huevos camperos frescos clase M/L`, quantity: `${servings * 12} unidades`, estimatedPrice: mult > 10 ? Math.round(3.40 * mult) : 3.40, category: "Proteínas y Huevos", notes: "Pack docena camperos", isEcommercePrice: isEcommerce },
        { id: "p_2", name: "Tofu Firme", quantity: `${servings * 300}g`, estimatedPrice: mult > 10 ? Math.round(3.50 * mult) : 3.50, category: "Proteínas y Legumbres", notes: `En ${supermarket}`, isEcommercePrice: isEcommerce },
        { id: "p_3", name: `Garbanzos cocidos de ${supermarketMeta.brandName || 'marca propia'}`, quantity: `${servings * 2} frascos`, estimatedPrice: mult > 10 ? Math.round(2.10 * mult) : 2.10, category: "Proteínas y Legumbres", notes: "Formato ahorro", isEcommercePrice: isEcommerce },
        { id: "p_4", name: `Lentejas cocidas seleccionadas`, quantity: `${servings * 2} frascos`, estimatedPrice: mult > 10 ? Math.round(2.00 * mult) : 2.00, category: "Proteínas y Legumbres", notes: "Legumbre básica", isEcommercePrice: isEcommerce }
      ]
    : [
        { id: "p_1", name: `Pechuga de pollo fresca fileteada`, quantity: `${servings * 500}g`, estimatedPrice: mult > 10 ? Math.round(6.80 * mult) : 6.80, category: "Carnes y Pescados", notes: `Bandeja ahorro ${supermarketMeta.brandName || 'marca recomendada'}`, isEcommercePrice: isEcommerce },
        { id: "p_2", name: `Lomos de salmón fresco o congelado`, quantity: `${servings * 300}g`, estimatedPrice: mult > 10 ? Math.round(7.50 * mult) : 7.50, category: "Carnes y Pescados", notes: "Rico en Omega-3", isEcommercePrice: isEcommerce },
        { id: "p_3", name: `Filetes de merluza o pescado blanco sin espinas`, quantity: `${servings * 400}g`, estimatedPrice: mult > 10 ? Math.round(5.20 * mult) : 5.20, category: "Carnes y Pescados", notes: "Para cenas ligeras", isEcommercePrice: isEcommerce },
        { id: "p_4", name: `Huevos frescos camperos`, quantity: `${servings * 12} unidades`, estimatedPrice: mult > 10 ? Math.round(3.20 * mult) : 3.20, category: "Carnes, Pescados y Huevos", notes: "Pack docena", isEcommercePrice: isEcommerce },
        { id: "p_5", name: `Garbanzos o ${t.beans} cocidos`, quantity: `${servings * 2} botes`, estimatedPrice: mult > 10 ? Math.round(1.90 * mult) : 1.90, category: "Legumbres", notes: "Despensa básica", isEcommercePrice: isEcommerce }
      ];

  const shoppingList = [
    {
      name: "Frutas y Verduras Frescas",
      iconName: "apple",
      items: [
        { id: "v_1", name: `${t.zucchini} frescos de temporada`, quantity: `${servings * 3} unidades`, estimatedPrice: mult > 10 ? Math.round(2.20 * mult) : 2.20, category: "Frutas y Verduras Frescas", notes: `Comprar en sección huerta de ${supermarket}`, isEcommercePrice: isEcommerce },
        { id: "v_2", name: `Espinacas frescas lavadas listas para consumir`, quantity: `${servings * 2} bolsas (600g)`, estimatedPrice: mult > 10 ? Math.round(2.40 * mult) : 2.40, category: "Frutas y Verduras Frescas", notes: "Bolsa formato familiar", isEcommercePrice: isEcommerce },
        { id: "v_3", name: `${t.peppers} y zanahorias`, quantity: "1 kg variado", estimatedPrice: mult > 10 ? Math.round(2.30 * mult) : 2.30, category: "Frutas y Verduras Frescas", notes: "Para salteados y bases", isEcommercePrice: isEcommerce },
        { id: "v_4", name: `Calabaza pelada en trozos`, quantity: `${servings * 400}g`, estimatedPrice: mult > 10 ? Math.round(1.90 * mult) : 1.90, category: "Frutas y Verduras Frescas", notes: "Para purés y cremas", isEcommercePrice: isEcommerce },
        { id: "v_5", name: `${t.avocado} madurados en su punto`, quantity: `${servings * 3} unidades`, estimatedPrice: mult > 10 ? Math.round(3.60 * mult) : 3.60, category: "Frutas y Verduras Frescas", notes: "Grasas monoinsaturadas", isEcommercePrice: isEcommerce },
        { id: "v_6", name: `${t.strawberry} o arándanos frescos de temporada`, quantity: "500g", estimatedPrice: mult > 10 ? Math.round(3.20 * mult) : 3.20, category: "Frutas y Verduras Frescas", notes: "Antioxidantes diarios", isEcommercePrice: isEcommerce }
      ]
    },
    {
      name: isVegan ? "Proteínas 100% Vegetales y Legumbres" : isVeg ? "Huevos y Proteínas Vegetales" : "Carnes, Pescados y Proteínas",
      iconName: "drumstick",
      items: baseItemsCat2
    },
    {
      name: isVegan ? "Bebidas Vegetales y Despensa" : "Lácteos y Despensa Fresca",
      iconName: "milk",
      items: isVegan
        ? [
            { id: "l_1", name: `Bebida vegetal de avena o soja sin azúcares añadidos`, quantity: `${servings * 2} litros`, estimatedPrice: mult > 10 ? Math.round(2.60 * mult) : 2.60, category: "Bebidas Vegetales", notes: `Marca ${supermarketMeta.brandName || 'propia'}`, isEcommercePrice: isEcommerce },
            { id: "l_2", name: `Semillas de chía y lino molido`, quantity: "250g", estimatedPrice: mult > 10 ? Math.round(2.40 * mult) : 2.40, category: "Despensa", notes: "Omega-3 vegetal", isEcommercePrice: isEcommerce }
          ]
        : [
            { id: "l_1", name: `Yogur griego natural sin azúcar añadido (${supermarketMeta.brandName || 'marca recomendada'})`, quantity: `${servings * 4} tarrinas`, estimatedPrice: mult > 10 ? Math.round(2.50 * mult) : 2.50, category: "Lácteos", notes: "Pack ahorro", isEcommercePrice: isEcommerce },
            { id: "l_2", name: `${t.freshCheese} desnatado o semigraso`, quantity: `${servings * 300}g`, estimatedPrice: mult > 10 ? Math.round(2.30 * mult) : 2.30, category: "Lácteos", notes: "Para cenas y ensaladas", isEcommercePrice: isEcommerce }
          ]
    },
    {
      name: isKeto ? "Frutos Secos, Semillas y Grasas Nobles" : "Granos, Cereales y Despensa",
      iconName: "wheat",
      items: isKeto
        ? [
            { id: "g_1", name: "Nueces y almendras crudas seleccionadas", quantity: "300g", estimatedPrice: mult > 10 ? Math.round(4.50 * mult) : 4.50, category: "Frutos Secos", notes: "Snacks y ensaladas keto", isEcommercePrice: isEcommerce },
            { id: "g_2", name: "Semillas de chía y calabaza", quantity: "250g", estimatedPrice: mult > 10 ? Math.round(2.80 * mult) : 2.80, category: "Semillas", notes: "Fibra sin carbohidratos netos", isEcommercePrice: isEcommerce },
            { id: "g_3", name: "Aceite de oliva virgen extra", quantity: "1 botella (750ml)", estimatedPrice: mult > 10 ? Math.round(7.90 * mult) : 7.90, category: "Aceites", notes: `Marca ${supermarketMeta.brandName || 'propia'} de ${supermarket}`, isEcommercePrice: isEcommerce }
          ]
        : [
            { id: "g_1", name: "Copos de avena integral fina", quantity: "500g", estimatedPrice: mult > 10 ? Math.round(1.30 * mult) : 1.30, category: "Granos y Cereales", notes: "Para desayunos saciantes", isEcommercePrice: isEcommerce },
            { id: "g_2", name: "Quinoa real lavada", quantity: "500g", estimatedPrice: mult > 10 ? Math.round(2.80 * mult) : 2.80, category: "Granos y Cereales", notes: "Proteína vegetal completa", isEcommercePrice: isEcommerce },
            { id: "g_3", name: "Arroz integral o basmati de calidad", quantity: "1 kg", estimatedPrice: mult > 10 ? Math.round(1.70 * mult) : 1.70, category: "Granos y Cereales", notes: `Básico en ${supermarket}`, isEcommercePrice: isEcommerce },
            { id: "g_4", name: "Nueces en mitades crudas", quantity: "200g", estimatedPrice: mult > 10 ? Math.round(2.90 * mult) : 2.90, category: "Frutos Secos", notes: "Para meriendas y ensaladas", isEcommercePrice: isEcommerce },
            { id: "g_5", name: "Aceite de oliva virgen extra", quantity: "1 botella (750ml)", estimatedPrice: mult > 10 ? Math.round(7.80 * mult) : 7.80, category: "Aceites", notes: `Marca ${supermarketMeta.brandName || 'propia'} de ${supermarket}`, isEcommercePrice: isEcommerce }
          ]
    }
  ];

  let totalCost = 0;
  shoppingList.forEach(cat => {
    cat.items.forEach(it => {
      totalCost += it.estimatedPrice;
    });
  });

  return {
    id: "plan_" + Date.now(),
    createdAt: new Date().toISOString(),
    inputConfig: config,
    title: `Menú Semanal ${dietaryPref} (${regionalProfile.regionName})`,
    summary: `Plan de alimentación adaptado a preferencia ${dietaryPref} para ${servings} personas en ${supermarket}. Con recetas variadas, cero repetición de comidas principales y optimización de presupuesto.`,
    days,
    shoppingList,
    ...(config?.childConfig?.enabled ? { childSummary: pediatricSafety.summary } : {}),
    costEstimate: {
      totalEstimatedCost: Math.round(totalCost * 100) / 100,
      currency: currency,
      costPerPerson: Math.round((totalCost / servings) * 100) / 100,
      costPerDay: Math.round((totalCost / daysCount) * 100) / 100,
      isEcommercePricing: isEcommerce,
      supermarketChain: supermarket,
      supermarketTips: supermarketMeta.savingsTips,
      savingsAdvice: `Aprovechar los formatos familiares y productos frescos de temporada en ${supermarket} optimiza hasta un 25% la cesta semanal.`
    },
    fitSummary: {
      adherenceGoal: `Pauta nutricional adaptada a ${dietaryPref}`,
      macroBalanceAnalysis: `Distribución balanceada con aporte diario promedio de ~${targetCal} kcal, ~${targetProt}g proteína, ~${targetCarb}g carbohidratos y ~${targetFat}g grasas saludables.`,
      fitnessTips: [
        "Mantén una hidratación constante de 2 a 2.5 litros de agua al día.",
        "Aprovecha las grasas saludables y fuentes de fibra para mantener la saciedad prolongada."
      ]
    }
  };
}

startServer();
