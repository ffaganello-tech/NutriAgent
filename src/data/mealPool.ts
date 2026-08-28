import { RegionalIngredientProfile } from './supermarkets';

export type DietaryType = 
  | 'mediterranea' 
  | 'equilibrada' 
  | 'vegetariana' 
  | 'vegana' 
  | 'alta_proteina' 
  | 'baja_carbohidratos' 
  | 'keto' 
  | 'sin_gluten' 
  | 'batch_cooking' 
  | 'economica';

export interface MealTemplate {
  name: string;
  desc: string;
  prep: number;
  calRatio: number;
  pRatio: number;
  cRatio: number;
  fRatio: number;
  costBase: number;
  ingredients: string[];
  instructions: string[];
  tips: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isKeto?: boolean;
  isLowCarb?: boolean;
  isGlutenFree?: boolean;
  isHighProtein?: boolean;
  isBatchCooking?: boolean;
  isBudget?: boolean;
  categoryTag?: 'chicken' | 'turkey' | 'beef' | 'white_fish' | 'salmon' | 'seafood' | 'legumes' | 'eggs' | 'pasta' | 'rice_quinoa' | 'veggie' | 'tofu';
}

// Master pool of distinct Lunch recipes
export function getMasterLunchPool(t: RegionalIngredientProfile['terms'], servings: number): MealTemplate[] {
  return [
    // --- 1. Omnivore / Mediterranean / Balanced ---
    {
      name: `Pechuga de Pollo Salteada con Quinoa, ${t.zucchini} y Zanahoria`,
      desc: "Proteína magra dorada en tiras acompañada de grano ancestral y vegetales al dente.",
      prep: 25,
      calRatio: 0.35, pRatio: 0.40, cRatio: 0.35, fRatio: 0.30, costBase: 3.20,
      categoryTag: 'chicken',
      isGlutenFree: true, isHighProtein: true, isBatchCooking: true,
      ingredients: [`${160 * servings}g de pechuga de pollo`, `${70 * servings}g de quinoa real`, `${1 * servings} ${t.zucchini} en dados`, `${1 * servings} zanahoria`, `${10 * servings}ml de aceite de oliva`, "Hierbas provenzales"],
      instructions: ["Cocer la quinoa 12 min en agua con sal.", `Saltear el ${t.zucchini} y la zanahoria con aceite a fuego medio.`, "Marcar la pechuga a la plancha dorándola por ambos lados.", "Mezclar y servir caliente."],
      tips: "Cocina ración extra de quinoa para optimizar tiempo."
    },
    {
      name: `Guiso Nutritivo de ${t.beans} con ${t.potatoes} y Sofrito Campesino`,
      desc: "Plato de cuchara cardiosaludable cargado de hierro, fibra vegetal y energía duradera.",
      prep: 30,
      calRatio: 0.35, pRatio: 0.38, cRatio: 0.40, fRatio: 0.25, costBase: 2.10,
      categoryTag: 'legumes',
      isVegetarian: true, isVegan: true, isGlutenFree: true, isBatchCooking: true, isBudget: true,
      ingredients: [`${130 * servings}g de ${t.beans} cocidos`, `${1 * servings} ${t.potatoes} mediana`, `${1 * servings} puerro picado`, `${1 * servings} zanahoria`, "Pimentón dulce, laurel y aceite"],
      instructions: ["Sofreír el puerro y zanahoria 5 min.", `Añadir las ${t.potatoes} en dados, el pimentón y el laurel.`, "Cubrir con caldo o agua y cocer 15 min.", `Incorporar los ${t.beans} y cocinar 5 min juntos.`],
      tips: "Acompaña con cítricos para potenciar la absorción de hierro vegetal."
    },
    {
      name: "Medallones de Pavo a la Plancha con Arroz Integral y Champiñones",
      desc: "Almuerzo limpio y proteico con champiñones al ajillo y arroz de absorción lenta.",
      prep: 25,
      calRatio: 0.35, pRatio: 0.40, cRatio: 0.35, fRatio: 0.25, costBase: 3.10,
      categoryTag: 'turkey',
      isGlutenFree: true, isHighProtein: true, isBatchCooking: true,
      ingredients: [`${160 * servings}g de pechuga o solomillo de pavo`, `${70 * servings}g de arroz integral`, `${100 * servings}g de champiñones laminados`, "1 diente de ajo, perejil y aceite"],
      instructions: ["Cocer el arroz integral en agua abundante 20 min.", "Dorar el ajo con los champiñones en sartén hasta evaporar el agua.", "Marcar los medallones de pavo con sal y pimienta 3 min por lado.", "Servir todo junto con perejil fresco."],
      tips: "El pavo es una de las carnes más magras y de fácil digestión."
    },
    {
      name: "Salteado Rápido de Garbanzos con Bacalao Desmigado, Espinacas y Pimentón",
      desc: "Versión moderna y exprés del potaje marinero con proteína de alto valor biológico.",
      prep: 20,
      calRatio: 0.35, pRatio: 0.38, cRatio: 0.35, fRatio: 0.25, costBase: 3.30,
      categoryTag: 'white_fish',
      isGlutenFree: true, isHighProtein: true,
      ingredients: [`${130 * servings}g de garbanzos cocidos`, `${120 * servings}g de bacalao desalado o merluza`, `${80 * servings}g de espinacas tiernas`, "1 diente de ajo, pimentón y aceite"],
      instructions: ["Dorar el ajo laminado con aceite en una sartén grande.", "Añadir el bacalao y saltear 3 min.", "Agregar las espinacas y cuando reduzcan, verter los garbanzos escurridos con el pimentón.", "Saltear 4 min juntos."],
      tips: "Aporta legumbre y pescado blanco en una sola preparación rápida."
    },
    {
      name: "Pasta Integral al Pomodoro con Atún, Aceitunas Negras y Albahaca",
      desc: "Comida de estilo italiano equilibrada con carbohidratos complejos y proteína marina.",
      prep: 20,
      calRatio: 0.35, pRatio: 0.36, cRatio: 0.40, fRatio: 0.25, costBase: 2.80,
      categoryTag: 'pasta',
      isHighProtein: true, isBudget: true,
      ingredients: [`${80 * servings}g de pasta integral (hélices o macarrones)`, `${1 * servings} lata de atún al natural`, `${100 * servings}g de tomate triturado natural`, `${20 * servings}g de aceitunas negras`, "Orégano y albahaca"],
      instructions: ["Cocer la pasta al dente siguiendo las instrucciones.", "Reducir el tomate con sal, orégano y un chorrito de aceite 6 min.", "Añadir el atún escurrido y las aceitunas a la salsa.", "Mezclar la pasta con la salsa caliente."],
      tips: "La pasta al dente tiene un menor impacto en la glucosa."
    },
    {
      name: `Hamburguesa Artesanal de ${t.beef} con Rúcula y Gajos de ${t.potatoes} Asadas`,
      desc: "Versión limpia y casera de carne magra sin aditivos con papas al horno aromáticas.",
      prep: 25,
      calRatio: 0.35, pRatio: 0.42, cRatio: 0.35, fRatio: 0.30, costBase: 3.90,
      categoryTag: 'beef',
      isHighProtein: true,
      ingredients: [`${150 * servings}g de ${t.beef} molida/picada magra`, `${1 * servings} pan integral`, `${1 * servings} ${t.potatoes} mediana en gajos`, `${30 * servings}g de rúcula y rodajas de tomate`, "Sal, orégano y aceite"],
      instructions: [`Hornear los gajos de ${t.potatoes} con sal, pimentón y 1 cdta de aceite a 200°C 20 min.`, "Formar la hamburguesa y sellar en sartén 3 min por lado.", "Montar en el pan tostado con rúcula y tomate.", "Acompañar con las papas asadas."],
      tips: "Mucho más proteica y saludable que cualquier comida rápida comercial."
    },
    {
      name: "Arroz Meloso Marinero con Merluza, Calamar y Sofrito de Verduras",
      desc: "Arroz sabroso cocinado con caldo casero, trozos tiernos de calamar y pescado blanco.",
      prep: 30,
      calRatio: 0.35, pRatio: 0.38, cRatio: 0.42, fRatio: 0.22, costBase: 3.70,
      categoryTag: 'seafood',
      isGlutenFree: true, isHighProtein: true,
      ingredients: [`${70 * servings}g de arroz`, `${100 * servings}g de merluza fresca`, `${70 * servings}g de anillas de calamar`, `${0.5 * servings} ${t.peppers} y tomate rallado`, "Caldo de pescado, azafrán y aceite"],
      instructions: [`Hacer un sofrito con ${t.peppers} y tomate con aceite.`, "Añadir el calamar y dorar 3 min.", "Verter el arroz, el azafrán y el triple de caldo caliente.", "Cocer 15 min, añadir la merluza los últimos 4 min y reposar."],
      tips: "Excelente aporte de fósforo, minerales y sabor tradicional."
    },
    {
      name: `Suprema de Pollo al Limón y Romero con Rodajas de ${t.sweetPotato} Asado`,
      desc: "Pechuga jugosa marinada con limón y finas hierbas acompañada de batata caramelizada al horno.",
      prep: 25,
      calRatio: 0.35, pRatio: 0.41, cRatio: 0.36, fRatio: 0.23, costBase: 3.30,
      categoryTag: 'chicken',
      isGlutenFree: true, isHighProtein: true, isBatchCooking: true,
      ingredients: [`${160 * servings}g de pechuga de pollo`, `${120 * servings}g de ${t.sweetPotato}`, "Jugo de 1 limón, romero fresco, ajo y aceite de oliva"],
      instructions: [`Cortar el ${t.sweetPotato} en rodajas y asar a 190°C 15 min.`, "Marinar el pollo con limón, ajo y romero 5 min.", "Dorar la pechuga en plancha caliente 4 min por lado.", "Servir con las rodajas de batata."],
      tips: "El limón aporta frescura y ablanda las fibras de la pechuga."
    },
    {
      name: "Lomo de Salmón Dorado con Arroz Integral y Arbolitos de Brócoli al Vapor",
      desc: "Combinación de grasas Omega-3 antiinflamatorias, carbohidrato complejo y sulforafano.",
      prep: 22,
      calRatio: 0.36, pRatio: 0.38, cRatio: 0.32, fRatio: 0.30, costBase: 4.30,
      categoryTag: 'salmon',
      isGlutenFree: true, isHighProtein: true,
      ingredients: [`${150 * servings}g de lomo de salmón`, `${60 * servings}g de arroz integral cocido`, `${120 * servings}g de brócoli`, "Limón, eneldo y aceite de oliva"],
      instructions: ["Cocer el brócoli al vapor 5 min.", "Marcar el salmón en sartén caliente 3-4 min por la piel, voltear 2 min.", "Servir sobre el arroz con el brócoli y limón."],
      tips: "No sobrecocines el salmón para que el interior quede jugoso."
    },

    // --- 2. Vegetarian & Vegan Exclusives ---
    {
      name: `Curry Cremoso de Garbanzos con ${t.zucchini}, Espinacas y Arroz Basmati`,
      desc: "Plato 100% vegetal aromático con especias digestivas, hierro y fibra de alto valor.",
      prep: 22,
      calRatio: 0.35, pRatio: 0.30, cRatio: 0.45, fRatio: 0.25, costBase: 2.10,
      categoryTag: 'legumes',
      isVegetarian: true, isVegan: true, isGlutenFree: true, isBatchCooking: true, isBudget: true,
      ingredients: [`${140 * servings}g de garbanzos cocidos`, `${1 * servings} ${t.zucchini} en dados`, `${80 * servings}g de espinacas tiernas`, `${60 * servings}g de arroz basmati o integral`, `${60 * servings}ml de leche de coco ligera`, "Curry en polvo, jengibre y aceite"],
      instructions: [`Saltear el ${t.zucchini} con jengibre y curry 3 min.`, "Añadir los garbanzos, espinacas y la leche de coco.", "Cocinar a fuego suave 6 min hasta espesar suavemente.", "Servir acompañado del arroz caliente."],
      tips: "La cúrcuma y el jengibre facilitan la digestión y aportan gran sabor."
    },
    {
      name: `Salteado de Tofu Dorado al Wok con Brócoli, ${t.peppers} y Quinoa`,
      desc: "Tofu firme crujiente marinado en soja con verduras frescas y grano proteico andino.",
      prep: 20,
      calRatio: 0.35, pRatio: 0.35, cRatio: 0.35, fRatio: 0.30, costBase: 2.60,
      categoryTag: 'tofu',
      isVegetarian: true, isVegan: true, isGlutenFree: true, isHighProtein: true, isBatchCooking: true,
      ingredients: [`${160 * servings}g de tofu firme en dados`, `${120 * servings}g de brócoli`, `${0.5 * servings} ${t.peppers} en tiras`, `${60 * servings}g de quinoa cocida`, "1 cda de salsa de soja sin gluten (Tamari), ajo y aceite"],
      instructions: ["Dorar los dados de tofu en sartén con aceite hasta que queden crocantes por fuera.", `Añadir el brócoli y ${t.peppers}, salteando a fuego vivo 4 min.`, "Verter la salsa de soja y mezclar con la quinoa tibia.", "Servir recién hecho."],
      tips: "Seca bien el tofu con papel absorbente antes de dorarlo para máxima textura."
    },
    {
      name: `Lentejas Estofadas con Calabaza, ${t.zucchini} y Pimentón Dulce`,
      desc: "Guiso ligero 100% vegetal con alto contenido en fibra prebiótica y minerales.",
      prep: 30,
      calRatio: 0.35, pRatio: 0.32, cRatio: 0.45, fRatio: 0.23, costBase: 1.95,
      categoryTag: 'legumes',
      isVegetarian: true, isVegan: true, isGlutenFree: true, isBatchCooking: true, isBudget: true,
      ingredients: [`${120 * servings}g de lentejas cocidas o secas`, `${100 * servings}g de calabaza en cubos`, `${0.5 * servings} ${t.zucchini}`, "1 zanahoria, laurel, pimentón y aceite"],
      instructions: ["Rehogar la zanahoria y calabaza con un hilo de aceite.", `Añadir el ${t.zucchini}, pimentón y laurel.`, "Cubrir con caldo de verduras y cocinar 15 min.", "Añadir las lentejas y cocinar 5 min más."],
      tips: "Plato muy digestivo y saciante ideal para el mediodía."
    },
    {
      name: `Bowl Energético de Quinoa con ${t.beans}, Huevo Poché y ${t.avocado}`,
      desc: "Bowl vegetariano completo con todos los aminoácidos esenciales y grasas nobles.",
      prep: 18,
      calRatio: 0.35, pRatio: 0.30, cRatio: 0.38, fRatio: 0.32, costBase: 2.30,
      categoryTag: 'eggs',
      isVegetarian: true, isGlutenFree: true, isHighProtein: true,
      ingredients: [`${60 * servings}g de quinoa cocida`, `${80 * servings}g de ${t.beans} escurridos`, `${1 * servings} huevo poché/escalfado`, `${0.5 * servings} ${t.avocado}`, `${40 * servings}g de espinacas tiernas`, "Semillas y aceite de oliva"],
      instructions: ["Colocar la quinoa tibia y las espinacas en la base de un bowl.", `Añadir los ${t.beans} y láminas de ${t.avocado}.`, "Coronar con el huevo recién escalfado con la yema líquida.", "Aliñar con sal marina y aceite."],
      tips: "Romper la yema sobre la quinoa crea una salsa natural cremosa."
    },
    {
      name: `Hamburguesas Caseras de ${t.beans} y Avena con Ensalada de Rúcula y ${t.avocado}`,
      desc: "Medallones vegetales caseros ricos en proteína vegetal y saciedad sin procesados.",
      prep: 25,
      calRatio: 0.35, pRatio: 0.28, cRatio: 0.42, fRatio: 0.30, costBase: 1.90,
      categoryTag: 'legumes',
      isVegetarian: true, isVegan: true, isBatchCooking: true, isBudget: true,
      ingredients: [`${150 * servings}g de ${t.beans} cocidos aplastados`, `${35 * servings}g de harina de avena`, `${0.5 * servings} cebolla picada`, `${0.5 * servings} ${t.avocado}`, `${40 * servings}g de rúcula`, "Comino, orégano y aceite"],
      instructions: [`Mezclar los ${t.beans} con la avena, cebolla y especias hasta formar masa firme.`, "Formar medallones y dorar en sartén 3 min por lado.", `Acompañar con ensalada de rúcula y láminas de ${t.avocado}.`],
      tips: "Puedes hacer raciones de más y congelar los medallones crudos."
    },
    {
      name: `Pasta con Boloñesa Vegetal de Lentejas, Tomate Casero y Albahaca`,
      desc: "Salsa boloñesa 100% basada en plantas, cargada de hierro vegetal y antioxidantes.",
      prep: 22,
      calRatio: 0.35, pRatio: 0.28, cRatio: 0.48, fRatio: 0.24, costBase: 1.95,
      categoryTag: 'pasta',
      isVegetarian: true, isVegan: true, isBatchCooking: true, isBudget: true,
      ingredients: [`${80 * servings}g de pasta integral o de maíz`, `${120 * servings}g de lentejas cocidas`, `${120 * servings}g de tomate triturado natural`, `${0.5 * servings} zanahoria rallada`, "Orégano, albahaca y aceite de oliva"],
      instructions: ["Saltear la zanahoria rallada con aceite 3 min.", "Añadir el tomate y las lentejas, cocinando a fuego suave 8 min.", "Cocer la pasta al dente y mezclar con la boloñesa caliente."],
      tips: "La textura de las lentejas emula perfectamente una boloñesa clásica."
    },

    // --- 3. Keto & Low Carb Exclusives ---
    {
      name: `Salteado Keto de Ternera/Res con ${t.zucchini}, Champiñones y ${t.avocado}`,
      desc: "Almuerzo ultra bajo en carbohidratos, saciante y lleno de micronutrientes nobles.",
      prep: 18,
      calRatio: 0.35, pRatio: 0.40, cRatio: 0.08, fRatio: 0.52, costBase: 3.90,
      categoryTag: 'beef',
      isKeto: true, isLowCarb: true, isGlutenFree: true, isHighProtein: true,
      ingredients: [`${160 * servings}g de ${t.beef} magra en tiras`, `${1 * servings} ${t.zucchini} en espirales o dados`, `${100 * servings}g de champiñones laminados`, `${0.5 * servings} ${t.avocado}`, `${15 * servings}ml de aceite de oliva virgen extra`, "Ajo en polvo y sal marina"],
      instructions: ["Dorar las tiras de carne a fuego vivo con aceite 2-3 min y reservar.", `Saltear el ${t.zucchini} y champiñones en la misma sartén 4 min.`, `Reincorporar la carne, mezclar 1 min y servir con ${t.avocado} en cubos.`],
      tips: "Menos de 6g de carbohidratos netos por ración."
    },
    {
      name: `Pechuga Rellena de Espinacas y ${t.freshCheese} con Ensalada Verde y Nueces`,
      desc: "Plato keto gourmet jugoso con grasas cardiosaludables y proteína pura.",
      prep: 25,
      calRatio: 0.35, pRatio: 0.45, cRatio: 0.06, fRatio: 0.49, costBase: 3.50,
      categoryTag: 'chicken',
      isKeto: true, isLowCarb: true, isGlutenFree: true, isHighProtein: true,
      ingredients: [`${170 * servings}g de pechuga de pollo`, `${60 * servings}g de espinacas cocidas`, `${40 * servings}g de ${t.freshCheese}`, `${20 * servings}g de nueces troceadas`, `${50 * servings}g de hojas verdes`, "Aceite de oliva virgen extra y sal"],
      instructions: [`Abrir la pechuga en mariposa y rellenar con las espinacas y ${t.freshCheese}.`, "Sellar en sartén o freidora de aire a 180°C durante 15 min.", "Servir con la ensalada verde aderezada con aceite y nueces."],
      tips: "Excelente aporte de saciedad sin elevar la insulina."
    },
    {
      name: `Lomo de Salmón con Espárragos Verdes a la Mantequilla y ${t.avocado}`,
      desc: "Máxima densidad de Omega-3 y grasas esenciales keto.",
      prep: 20,
      calRatio: 0.36, pRatio: 0.35, cRatio: 0.05, fRatio: 0.60, costBase: 4.40,
      categoryTag: 'salmon',
      isKeto: true, isLowCarb: true, isGlutenFree: true, isHighProtein: true,
      ingredients: [`${160 * servings}g de salmón`, `${140 * servings}g de espárragos verdes`, `${0.5 * servings} ${t.avocado}`, `${15 * servings}g de mantequilla o aceite de oliva`, "Eneldo, sal y limón"],
      instructions: ["Saltear los espárragos en sartén con mantequilla o aceite 6 min.", "Cocinar el salmón 3 min por lado hasta dorar.", `Servir con gajos de ${t.avocado} fresco.`],
      tips: "Cena o almuerzo keto por excelencia."
    }
  ];
}

// Master pool of distinct Dinner recipes
export function getMasterDinnerPool(t: RegionalIngredientProfile['terms'], servings: number): MealTemplate[] {
  return [
    // --- 1. Omnivore / Mediterranean / Balanced ---
    {
      name: `Salmón al Horno con Espárragos Verdes y Rodajas de ${t.sweetPotato}`,
      desc: "Cena rica en Omega-3 antiinflamatorio y digestión suave.",
      prep: 25,
      calRatio: 0.25, pRatio: 0.23, cRatio: 0.18, fRatio: 0.30, costBase: 4.10,
      categoryTag: 'salmon',
      isGlutenFree: true, isHighProtein: true,
      ingredients: [`${150 * servings}g de lomo de salmón`, `${120 * servings}g de espárragos verdes`, `${120 * servings}g de ${t.sweetPotato}`, "Eneldo, limón y aceite de oliva"],
      instructions: [`Cortar el ${t.sweetPotato} en rodajas finas y hornear 12 min.`, "Añadir el salmón y los espárragos y hornear 10 min más.", "Terminar con unas gotas de limón fresco."],
      tips: "En freidora de aire se prepara en 14 min a 185°C."
    },
    {
      name: `Merluza al Papillote con ${t.zucchini}, Tomates Cherry y Orégano`,
      desc: "Pescado blanco jugoso cocinado en sus propios jugos sin grasas añadidas.",
      prep: 20,
      calRatio: 0.25, pRatio: 0.27, cRatio: 0.15, fRatio: 0.25, costBase: 3.40,
      categoryTag: 'white_fish',
      isGlutenFree: true, isHighProtein: true, isLowCarb: true,
      ingredients: [`${180 * servings}g de filete de merluza`, `${1 * servings} ${t.zucchini} en rodajas`, `${6 * servings} tomates cherry`, `${8 * servings}ml de aceite`, "Orégano y sal marina"],
      instructions: [`Sobre papel de cocina o aluminio, colocar una base de ${t.zucchini} y tomates.`, "Disponer la merluza con sal, orégano y un hilo de aceite.", "Cerrar el paquete y hornear a 200°C 15 minutos."],
      tips: "El pescado queda tierno y no ensucia la bandeja del horno."
    },
    {
      name: `Tortilla Francesa Jugosa de ${t.zucchini} con Ensalada Verde y Nueces`,
      desc: "Cena liviana, hipocalórica y reconfortante antes de dormir.",
      prep: 15,
      calRatio: 0.25, pRatio: 0.22, cRatio: 0.12, fRatio: 0.30, costBase: 2.30,
      categoryTag: 'eggs',
      isVegetarian: true, isGlutenFree: true, isLowCarb: true, isKeto: true, isBudget: true,
      ingredients: [`${2 * servings} huevos`, `${0.5 * servings} ${t.zucchini} rallado`, `${50 * servings}g de hojas verdes`, `${15 * servings}g de nueces`, "Vinagre y aceite"],
      instructions: [`Saltear el ${t.zucchini} rallado 4 min hasta perder el agua.`, `Batir los huevos, mezclar con el ${t.zucchini} y cuajar la tortilla en sartén.`, "Acompañar con las hojas verdes aderezadas con nueces picadas."],
      tips: "Cena baja en carbohidratos que promueve un descanso profundo."
    },
    {
      name: "Crema de Calabaza y Zanahoria con Tiras de Pollo Crujiente y Semillas",
      desc: "Sopa densa aterciopelada antioxidante rematada con proteína magra crujiente.",
      prep: 25,
      calRatio: 0.25, pRatio: 0.28, cRatio: 0.20, fRatio: 0.22, costBase: 2.60,
      categoryTag: 'chicken',
      isGlutenFree: true, isHighProtein: true, isBatchCooking: true,
      ingredients: [`${150 * servings}g de calabaza en dados`, `${1 * servings} zanahoria`, `${120 * servings}g de pechuga de pollo en tiras`, `${10 * servings}g de semillas de calabaza`, "Aceite y sal"],
      instructions: ["Hervir la calabaza y zanahoria con sal 15 min y triturar hasta tener crema fina.", "Saltear las tiras de pollo a fuego vivo con pimienta hasta doradas.", "Servir la crema caliente con el pollo y semillas por encima."],
      tips: "Puedes congelar porciones individuales de crema para emergencias."
    },
    {
      name: `Wok Ligero de ${t.shrimp} con Brócoli, Champiñones y Soja`,
      desc: "Cena asiática rápida, crujiente, saciante y muy baja en carbohidratos.",
      prep: 18,
      calRatio: 0.25, pRatio: 0.30, cRatio: 0.15, fRatio: 0.20, costBase: 3.80,
      categoryTag: 'seafood',
      isGlutenFree: true, isHighProtein: true, isLowCarb: true,
      ingredients: [`${150 * servings}g de ${t.shrimp} pelados`, `${120 * servings}g de brócoli`, `${80 * servings}g de champiñones`, "1 cda de salsa de soja, jengibre y aceite"],
      instructions: ["Saltear el brócoli y champiñones a fuego vivo 5 min.", `Añadir los ${t.shrimp} y saltear 3 min más.`, "Terminar con salsa de soja y jengibre rallado 1 min."],
      tips: "Mantén el fuego alto para que las verduras queden crujientes."
    },
    {
      name: `Fajita Saludable de Pollo y ${t.peppers} en Tortilla Integral`,
      desc: "Cena divertida, sabrosa y fácil de armar con vegetales salteados.",
      prep: 20,
      calRatio: 0.25, pRatio: 0.28, cRatio: 0.28, fRatio: 0.20, costBase: 2.70,
      categoryTag: 'chicken',
      isHighProtein: true,
      ingredients: [`${130 * servings}g de pechuga de pollo en tiras`, `${1 * servings} tortilla integral`, `${0.5 * servings} ${t.peppers}`, `${0.5 * servings} cebolla`, "Comino, pimentón y limón"],
      instructions: [`Cortar cebolla y ${t.peppers} en juliana y saltear 5 min.`, "Añadir las tiras de pollo y especias, cocinando hasta dorar.", "Calentar la tortilla y rellenar con el salteado jugoso."],
      tips: "Añade un poco de yogur griego como aderezo suave estilo crema agria."
    },
    {
      name: `Ensalada Templada de Quinoa con Pavo a la Plancha, Espinacas y ${t.freshCheese}`,
      desc: "Cena completa, templada y depurativa para finalizar el día.",
      prep: 15,
      calRatio: 0.25, pRatio: 0.28, cRatio: 0.22, fRatio: 0.25, costBase: 2.90,
      categoryTag: 'turkey',
      isGlutenFree: true, isHighProtein: true,
      ingredients: [`${50 * servings}g de quinoa cocida`, `${120 * servings}g de pechuga de pavo en dados`, `${50 * servings}g de espinacas tiernas`, `${30 * servings}g de ${t.freshCheese} en dados`, "Vinagre y aceite"],
      instructions: ["Dorar los dados de pavo en sartén 4 min.", `En un cuenco colocar espinacas y quinoa templada con el ${t.freshCheese}.`, "Añadir el pavo caliente y aliñar con aceite y vinagre."],
      tips: "Digestión óptima para un descanso reparador."
    },
    {
      name: `Filete de Pescado Blanco a la Plancha con Puré Suave de Calabaza y Ajo`,
      desc: "Cena ligera de fácil asimilación con puré dulce y aromático.",
      prep: 20,
      calRatio: 0.24, pRatio: 0.28, cRatio: 0.16, fRatio: 0.22, costBase: 3.20,
      categoryTag: 'white_fish',
      isGlutenFree: true, isHighProtein: true, isLowCarb: true,
      ingredients: [`${170 * servings}g de filete de pescado blanco`, `${180 * servings}g de calabaza cocida`, "Ajo asado, perejil, limón y aceite de oliva"],
      instructions: ["Triturar la calabaza cocida con ajo y una cucharadita de aceite hasta que quede suave.", "Dorar el pescado a la plancha 2-3 min por lado con sal marina y perejil.", "Servir el pescado sobre la cama de puré de calabaza caliente."],
      tips: "Ideal para cenar temprano sin sensación de pesadez."
    },

    // --- 2. Vegetarian & Vegan Exclusives for Dinner ---
    {
      name: `Salteado de Tofu con Brócoli, Champiñones y Sésamo Tostado`,
      desc: "Cena 100% vegetal digestiva, hiperproteica y libre de pesadez nocturna.",
      prep: 18,
      calRatio: 0.25, pRatio: 0.32, cRatio: 0.14, fRatio: 0.28, costBase: 2.30,
      categoryTag: 'tofu',
      isVegetarian: true, isVegan: true, isGlutenFree: true, isHighProtein: true, isLowCarb: true, isKeto: true,
      ingredients: [`${150 * servings}g de tofu firme en dados`, `${120 * servings}g de brócoli`, `${80 * servings}g de champiñones`, "1 cda de salsa de soja sin gluten, aceite y sésamo"],
      instructions: ["Saltear el tofu en dados con un chorrito de aceite hasta dorar.", "Añadir el brócoli y champiñones, cocinando 4 min a fuego medio.", "Rociar con la salsa de soja y servir espolvoreado con sésamo."],
      tips: "El tofu absorbe todo el aroma de las setas y el sésamo."
    },
    {
      name: `Crema Sedosa de Calabaza y Puerro con Semillas de Cáñamo y ${t.avocado}`,
      desc: "Sopa depurativa 100% vegetal rematada con grasas saludables y proteína vegetal.",
      prep: 22,
      calRatio: 0.25, pRatio: 0.18, cRatio: 0.22, fRatio: 0.32, costBase: 1.80,
      categoryTag: 'veggie',
      isVegetarian: true, isVegan: true, isGlutenFree: true, isBatchCooking: true, isBudget: true,
      ingredients: [`${180 * servings}g de calabaza`, `${1 * servings} puerro en rodajas`, `${0.5 * servings} ${t.avocado} en cubos`, `${15 * servings}g de semillas de calabaza o chía`, "Aceite de oliva y sal"],
      instructions: ["Hervir la calabaza y puerro en agua con sal 15 min y triturar hasta que quede sedosa.", `Servir caliente en cuenco con cubos de ${t.avocado} y semillas por encima.`],
      tips: "Confort digestivo absoluto antes de dormir."
    },
    {
      name: `Shakshuka de Huevos con Tomate Casero, ${t.peppers} y ${t.freshCheese}`,
      desc: "Plato mediterráneo con huevos escalfados en salsa de tomate aromática y queso tierno.",
      prep: 18,
      calRatio: 0.25, pRatio: 0.26, cRatio: 0.18, fRatio: 0.28, costBase: 2.20,
      categoryTag: 'eggs',
      isVegetarian: true, isGlutenFree: true, isLowCarb: true, isBudget: true,
      ingredients: [`${2 * servings} huevos frescos`, `${120 * servings}g de tomate triturado`, `${0.5 * servings} ${t.peppers} en dados`, `${30 * servings}g de ${t.freshCheese}`, "Comino, pimentón dulce y aceite de oliva"],
      instructions: [`Sofreír el ${t.peppers} con aceite 4 min.`, "Añadir el tomate y especias, cocinando 5 min hasta reducir.", `Hacer dos huecos, cascar los huevos dentro, tapar 4 min y esparcir el ${t.freshCheese}.`],
      tips: "Deja la yema tierna para disfrutar mojando."
    },
    {
      name: `Bowl de Edamame, Espinacas, ${t.avocado} y Pepino con Aliño de Limón`,
      desc: "Cena vegana ligera y crujiente de alta densidad proteica y mineral.",
      prep: 10,
      calRatio: 0.25, pRatio: 0.24, cRatio: 0.15, fRatio: 0.32, costBase: 2.40,
      categoryTag: 'legumes',
      isVegetarian: true, isVegan: true, isGlutenFree: true, isHighProtein: true, isLowCarb: true, isKeto: true,
      ingredients: [`${130 * servings}g de edamame desgranado cocido`, `${60 * servings}g de espinacas baby`, `${0.5 * servings} ${t.avocado}`, `${1 * servings} pepino en rodajas`, "Limón, aceite de oliva virgen extra y sal marina"],
      instructions: [`Mezclar en un bol las espinacas, el edamame templado, el pepino y el ${t.avocado}.`, "Emulsionar el zumo de limón con aceite y sal, y aderezar."],
      tips: "El edamame aporta 18g de proteína completa 100% vegetal."
    },

    // --- 3. Keto & Low Carb Exclusives for Dinner ---
    {
      name: `Tortilla Francesa de Espinacas con ${t.freshCheese} y Ensalada de ${t.avocado}`,
      desc: "Cena keto limpia que estimula la producción de melatonina y descanso profundo.",
      prep: 12,
      calRatio: 0.25, pRatio: 0.26, cRatio: 0.06, fRatio: 0.48, costBase: 2.10,
      categoryTag: 'eggs',
      isVegetarian: true, isKeto: true, isLowCarb: true, isGlutenFree: true, isHighProtein: true, isBudget: true,
      ingredients: [`${2 * servings} huevos camperos`, `${60 * servings}g de espinacas tiernas`, `${40 * servings}g de ${t.freshCheese}`, `${0.5 * servings} ${t.avocado}`, "Aceite de oliva virgen extra y sal"],
      instructions: ["Saltear las espinacas 2 min hasta reducir.", `Batir los huevos, cuajar la tortilla rellenando con las espinacas y ${t.freshCheese}.`, `Acompañar con láminas de ${t.avocado}.`],
      tips: "Carbohidratos netos prácticamente nulos (<3g)."
    },
    {
      name: `Lomo de Merluza a la Plancha con Espárragos Verdes al Ajillo`,
      desc: "Pescado blanco magro con fibra verde y aceite de oliva virgen extra.",
      prep: 15,
      calRatio: 0.25, pRatio: 0.32, cRatio: 0.05, fRatio: 0.35, costBase: 3.40,
      categoryTag: 'white_fish',
      isKeto: true, isLowCarb: true, isGlutenFree: true, isHighProtein: true,
      ingredients: [`${180 * servings}g de filete de merluza`, `${140 * servings}g de espárragos verdes`, "2 dientes de ajo laminados, perejil, limón y aceite de oliva"],
      instructions: ["Dorar el ajo con los espárragos en sartén con aceite 6 min.", "Marcar la merluza a la plancha 3 min por lado con sal marina y perejil.", "Servir recién salido con gotas de limón."],
      tips: "Muy digestivo para conciliar el sueño rápidamente."
    }
  ];
}

// Master pool of Breakfasts
export function getMasterBreakfastPool(t: RegionalIngredientProfile['terms'], servings: number): MealTemplate[] {
  return [
    {
      name: `Bowl de Avena con ${t.strawberry} y Arándanos, Chía y Yogur Griego`,
      desc: "Desayuno energético alto en fibra, antioxidantes y proteína láctea.",
      prep: 10,
      calRatio: 0.25, pRatio: 0.25, cRatio: 0.30, fRatio: 0.20, costBase: 1.80,
      isVegetarian: true, isHighProtein: true,
      ingredients: [`${50 * servings}g de copos de avena`, `${150 * servings}g de yogur griego`, `${80 * servings}g de ${t.strawberry} y arándanos`, `${10 * servings}g de chía`, "Canela"],
      instructions: ["Mezclar la avena con el yogur y un chorrito de agua o leche.", "Añadir las semillas de chía y canela.", `Coronar con ${t.strawberry} frescas.`],
      tips: "Deja reposar 5 min para que la chía absorba humedad y quede cremoso."
    },
    {
      name: `Panqueques / Tortitas de Avena y ${t.banana} con ${t.freshCheese}`,
      desc: "Tortitas esponjosas sin azúcar añadido y ricas en carbohidratos complejos.",
      prep: 15,
      calRatio: 0.25, pRatio: 0.25, cRatio: 0.30, fRatio: 0.20, costBase: 1.60,
      isVegetarian: true, isHighProtein: true,
      ingredients: [`${1 * servings} ${t.banana} maduro`, `${1 * servings} huevo`, `${40 * servings}g de harina de avena`, `${60 * servings}g de ${t.freshCheese}`, "Canela"],
      instructions: ["Triturar los ingredientes hasta tener masa homogénea.", "Cuajar en sartén antiadherente 2 min por lado.", `Servir con ${t.freshCheese} por encima.`],
      tips: `Usa ${t.banana} bien maduros para evitar endulzantes artificiales.`
    },
    {
      name: "Revuelto de Huevos Camperos con Espinacas y Tostada Integral",
      desc: "Desayuno proteico salado con hierro, colina y carbohidrato de fermentación lenta.",
      prep: 12,
      calRatio: 0.25, pRatio: 0.28, cRatio: 0.25, fRatio: 0.25, costBase: 1.70,
      isVegetarian: true, isHighProtein: true,
      ingredients: [`${2 * servings} huevos camperos`, `${60 * servings}g de espinacas frescas`, `${1 * servings} rebanada de pan integral`, "Pimienta y aceite"],
      instructions: ["Saltear las espinacas con aceite durante 2 min.", "Añadir los huevos batidos con sal y remover a fuego suave hasta cuajar cremoso.", "Servir sobre la tostada caliente."],
      tips: "No pases los huevos de cocción para mantener la textura sedosa."
    },
    {
      name: `Porridge Vegano Cremoso de Avena con Bebida Vegetal, Manzana Asada y Canela`,
      desc: "Avena 100% vegetal caliente con trocitos de manzana tierna que recuerdan a una tarta casera.",
      prep: 12,
      calRatio: 0.25, pRatio: 0.18, cRatio: 0.40, fRatio: 0.16, costBase: 1.30,
      isVegetarian: true, isVegan: true, isBudget: true,
      ingredients: [`${55 * servings}g de avena`, `${1 * servings} manzana en dados pequeños`, `${200 * servings}ml de bebida vegetal (avena o soja)`, "Canela y nuez moscada"],
      instructions: ["Poner en un cazo la avena, la manzana y la bebida vegetal a fuego medio.", "Cocinar removiendo 5-7 min hasta que la manzana esté tierna y la avena cremosa.", "Servir con abundante canela."],
      tips: "Sensación reconfortante en mañanas frías."
    },
    {
      name: `Tostadas con ${t.freshCheese}, ${t.strawberry} y Nueces`,
      desc: "Desayuno gourmet fresco y crujiente de contrastes dulce-salado.",
      prep: 8,
      calRatio: 0.25, pRatio: 0.22, cRatio: 0.28, fRatio: 0.25, costBase: 1.75,
      isVegetarian: true,
      ingredients: [`${2 * servings} rebanadas de pan integral`, `${60 * servings}g de ${t.freshCheese}`, `${60 * servings}g de ${t.strawberry} laminadas`, `${15 * servings}g de nueces`],
      instructions: ["Tostar las rebanadas de pan.", `Untar generosamente con ${t.freshCheese}.`, `Disponer las ${t.strawberry} y las nueces por encima.`],
      tips: "Rico en calcio y vitamina C para empezar el día con energía."
    },
    {
      name: `Tostada de ${t.avocado} con Salmón Ahumado y Semillas de Sésamo`,
      desc: "Desayuno especial rico en ácidos grasos nobles y minerales.",
      prep: 10,
      calRatio: 0.25, pRatio: 0.26, cRatio: 0.22, fRatio: 0.30, costBase: 2.90,
      isHighProtein: true,
      ingredients: [`${1 * servings} rebanada gruesa de pan integral`, `${0.5 * servings} ${t.avocado}`, `${50 * servings}g de salmón ahumado`, "Semillas de sésamo y limón"],
      instructions: [`Tostar el pan, colocar el ${t.avocado} en láminas finas.`, "Cubrir con el salmón ahumado y espolvorear sésamo tostado con un toque de limón."],
      tips: "Plato estrella digno de brunch saludable."
    },
    {
      name: `Omelette / Tortilla Francesa Keto de Espinacas y ${t.avocado}`,
      desc: "Desayuno keto/low-carb con proteína de alto valor biológico y grasas saciantes.",
      prep: 10,
      calRatio: 0.25, pRatio: 0.28, cRatio: 0.05, fRatio: 0.45, costBase: 1.80,
      isVegetarian: true, isKeto: true, isLowCarb: true, isGlutenFree: true, isHighProtein: true,
      ingredients: [`${2 * servings} huevos frescos`, `${50 * servings}g de espinacas tiernas`, `${0.5 * servings} ${t.avocado}`, "Aceite de oliva y sal marina"],
      instructions: ["Saltear las espinacas 1 min.", "Batir los huevos, verter en sartén y cuajar la tortilla jugosa.", `Servir acompañada del ${t.avocado} en láminas.`],
      tips: "Aporta saciedad prolongada hasta la comida principal."
    },
    {
      name: `Pudding Vegano de Chía con Bebida de Almendras, ${t.strawberry} y Almendras`,
      desc: "Desayuno vegano/keto rico en Omega-3 vegetal, fibra y frescor.",
      prep: 5,
      calRatio: 0.25, pRatio: 0.16, cRatio: 0.15, fRatio: 0.40, costBase: 1.60,
      isVegetarian: true, isVegan: true, isGlutenFree: true, isKeto: true, isLowCarb: true,
      ingredients: [`${30 * servings}g de semillas de chía`, `${180 * servings}ml de bebida de almendras sin azúcar`, `${60 * servings}g de ${t.strawberry}`, `${15 * servings}g de almendras laminadas`],
      instructions: ["Mezclar la chía con la bebida de almendras y dejar reposar 15 min (o toda la noche).", `Coronar con ${t.strawberry} frescas y almendras crujientes.`],
      tips: "Súper práctico para dejar listo la noche anterior."
    }
  ];
}

// Master pool of Morning Snacks
export function getMasterMorningSnacks(t: RegionalIngredientProfile['terms'], servings: number): MealTemplate[] {
  return [
    {
      name: "Manzana Crujiente con Nueces y Almendras Crudas",
      desc: "Snack saciante rico en grasas saludables y fibra.",
      prep: 5,
      calRatio: 0.10, pRatio: 0.08, cRatio: 0.12, fRatio: 0.15, costBase: 0.90,
      isVegetarian: true, isVegan: true, isGlutenFree: true, isBudget: true,
      ingredients: [`${1 * servings} manzana crujiente`, `${20 * servings}g de nueces o almendras crudas`],
      instructions: ["Lavar la manzana, cortarla en gajos y acompañar con los frutos secos."],
      tips: "Consumir con piel para maximizar la fibra y saciedad."
    },
    {
      name: "Kéfir o Yogur Natural con Semillas de Calabaza",
      desc: "Probióticos naturales para la salud digestiva.",
      prep: 3,
      calRatio: 0.10, pRatio: 0.12, cRatio: 0.10, fRatio: 0.12, costBase: 1.05,
      isVegetarian: true, isGlutenFree: true, isLowCarb: true,
      ingredients: [`${150 * servings}g de kéfir o yogur natural`, `${15 * servings}g de semillas de calabaza`],
      instructions: ["Servir el kéfir en vaso y añadir las semillas por encima."],
      tips: "Aporta magnesio y zinc para la recuperación muscular."
    },
    {
      name: `Yogur Proteico o Griego con ${t.strawberry} y Arándanos Frescos`,
      desc: "Bocado proteico ligero que mantiene la energía estable.",
      prep: 3,
      calRatio: 0.10, pRatio: 0.10, cRatio: 0.10, fRatio: 0.10, costBase: 1.10,
      isVegetarian: true, isGlutenFree: true, isHighProtein: true,
      ingredients: [`${125 * servings}g de yogur proteico o griego`, `${50 * servings}g de ${t.strawberry} y arándanos`],
      instructions: ["Mezclar en un bol y disfrutar fresco."],
      tips: "Aporta proteína pura con mínimos azúcares."
    },
    {
      name: `${t.freshCheese} con Toque de Canela y Semillas de Chía`,
      desc: "Proteína de caseína de liberación progresiva y digestión limpia.",
      prep: 3,
      calRatio: 0.10, pRatio: 0.12, cRatio: 0.08, fRatio: 0.12, costBase: 1.15,
      isVegetarian: true, isGlutenFree: true, isHighProtein: true, isLowCarb: true,
      ingredients: [`${100 * servings}g de ${t.freshCheese}`, "Canela en polvo", `${10 * servings}g de chía`],
      instructions: [`Colocar el ${t.freshCheese} en un plato, espolvorear canela y añadir las semillas.`],
      tips: "Sabor dulce natural y altamente proteico."
    },
    {
      name: "Puñado de Frutos Secos Variados y Té Verde",
      desc: "Polifenoles y energía sostenida libre de picos de glucosa.",
      prep: 2,
      calRatio: 0.10, pRatio: 0.08, cRatio: 0.08, fRatio: 0.20, costBase: 0.90,
      isVegetarian: true, isVegan: true, isGlutenFree: true, isKeto: true, isLowCarb: true,
      ingredients: [`${25 * servings}g de mezcla de almendras y nueces crudas`, "1 taza de té verde"],
      instructions: ["Disfrutar de los frutos secos junto a la infusión."],
      tips: "El té verde acelera el metabolismo basal de forma natural."
    },
    {
      name: "Kiwi y Rodajas de Naranja con Canela",
      desc: "Dosis masiva de antioxidantes, bioflavonoides y vitamina C.",
      prep: 4,
      calRatio: 0.10, pRatio: 0.05, cRatio: 0.15, fRatio: 0.05, costBase: 0.80,
      isVegetarian: true, isVegan: true, isGlutenFree: true, isBudget: true,
      ingredients: [`${1 * servings} kiwi maduro`, `${1 * servings} naranja en rodajas`],
      instructions: ["Pelar y cortar las frutas en rodajas, servir con canela."],
      tips: "Favorece la motilidad intestinal gracias a las enzimas del kiwi."
    },
    {
      name: `Bol de ${t.strawberry} y Frutos Rojos con Limón y Menta`,
      desc: "Puro refresco vitamínico bajo en calorías.",
      prep: 4,
      calRatio: 0.10, pRatio: 0.04, cRatio: 0.15, fRatio: 0.05, costBase: 1.10,
      isVegetarian: true, isVegan: true, isGlutenFree: true, isKeto: true, isLowCarb: true,
      ingredients: [`${100 * servings}g de ${t.strawberry} y frutos rojos`, "Gotas de limón y menta"],
      instructions: ["Lavar la fruta, rociar con el limón y dejar macerar 5 min."],
      tips: "El limón potencia el dulzor natural de las frutas."
    }
  ];
}

// Master pool of Afternoon Snacks / Merienda
export function getMasterAfternoonSnacks(t: RegionalIngredientProfile['terms'], servings: number): MealTemplate[] {
  return [
    {
      name: `Tostada Integral con ${t.avocado}, Huevo Cocido y Semillas`,
      desc: "Merienda equilibrada con grasas monoinsaturadas y proteína de alto valor biológico.",
      prep: 10,
      calRatio: 0.15, pRatio: 0.12, cRatio: 0.15, fRatio: 0.20, costBase: 1.40,
      isVegetarian: true, isHighProtein: true,
      ingredients: [`${1 * servings} rebanada de pan integral`, `${0.5 * servings} ${t.avocado}`, `${1 * servings} huevo cocido`, "Sal y pimentón"],
      instructions: ["Tostar el pan, untar con el tenedor.", "Colocar el huevo en rodajas y espolvorear pimentón."],
      tips: "Puedes tener los huevos cocidos listos en la nevera."
    },
    {
      name: "Hummus Tradicional con Bastones de Zanahoria y Pepino",
      desc: "Snack vegetal crujiente y prebiótico a base de garbanzos.",
      prep: 8,
      calRatio: 0.15, pRatio: 0.10, cRatio: 0.18, fRatio: 0.18, costBase: 1.20,
      isVegetarian: true, isVegan: true, isGlutenFree: true, isBudget: true,
      ingredients: [`${70 * servings}g de hummus`, `${1 * servings} zanahoria`, `${1 * servings} pepino`],
      instructions: ["Cortar las verduras en bastones y servir con el hummus."],
      tips: "Ideal para llevar en un recipiente hermético al trabajo o estudio."
    },
    {
      name: `Rodajas de ${t.banana} con Crema de Cacahuete / Maní 100%`,
      desc: "Combinación clásica deportiva de potasio, carbohidrato natural y grasas buenas.",
      prep: 3,
      calRatio: 0.15, pRatio: 0.08, cRatio: 0.18, fRatio: 0.25, costBase: 0.95,
      isVegetarian: true, isVegan: true, isGlutenFree: true,
      ingredients: [`${1 * servings} ${t.banana}`, `${15 * servings}g de crema de maní 100%`],
      instructions: [`Cortar el ${t.banana} en rodajas y untar con la crema de maní.`],
      tips: "Energía inmediata ideal 45 min antes de entrenar."
    },
    {
      name: "Tostada Integral con Tomate Rallado y Jamón Magro / Pavo",
      desc: "La merienda mediterránea por excelencia, sencilla y sabrosa.",
      prep: 5,
      calRatio: 0.15, pRatio: 0.14, cRatio: 0.15, fRatio: 0.18, costBase: 1.45,
      isHighProtein: true,
      ingredients: [`${1 * servings} rebanada de pan integral`, `${1 * servings} tomate maduro rallado`, `${40 * servings}g de jamón magro o pavo`, "Aceite de oliva"],
      instructions: ["Tostar el pan, frotar o untar el tomate fresco rallado.", "Rociar con aceite y colocar las lonchas de jamón o pavo."],
      tips: "Ralla el tomate con la parte gruesa del rallador para mejor textura."
    },
    {
      name: `Smoothie de ${t.banana}, Espinacas y Bebida de Avena o Soja`,
      desc: "Batido verde energizante y altamente biodisponible 100% vegetal.",
      prep: 5,
      calRatio: 0.15, pRatio: 0.15, cRatio: 0.20, fRatio: 0.10, costBase: 1.35,
      isVegetarian: true, isVegan: true, isGlutenFree: true,
      ingredients: [`${1 * servings} ${t.banana}`, `${30 * servings}g de espinacas tiernas`, `${200 * servings}ml de bebida vegetal`],
      instructions: ["Batir todos los ingredientes en licuadora 45 segundos hasta tener textura aterciopelada."],
      tips: "Añade 2 cubitos de hielo para un resultado tipo frappé."
    },
    {
      name: "Yogur Griego con Nueces y Onza de Chocolate Negro ≥70%",
      desc: "Capricho antioxidante rico en magnesio y placer culinario.",
      prep: 3,
      calRatio: 0.15, pRatio: 0.12, cRatio: 0.12, fRatio: 0.25, costBase: 1.30,
      isVegetarian: true, isGlutenFree: true, isLowCarb: true,
      ingredients: [`${150 * servings}g de yogur griego`, `${15 * servings}g de nueces troceadas`, `${15 * servings}g de chocolate negro ≥70% picado`],
      instructions: ["Servir el yogur en copa, coronar con las nueces y el chocolate picado."],
      tips: "El cacao puro disminuye el cortisol y calma la ansiedad por dulce."
    },
    {
      name: `Biscotes Integrales con ${t.freshCheese} y Semillas de Lino`,
      desc: "Crujiente ligero y proteico para la tarde.",
      prep: 4,
      calRatio: 0.15, pRatio: 0.12, cRatio: 0.15, fRatio: 0.15, costBase: 1.00,
      isVegetarian: true, isHighProtein: true,
      ingredients: [`${2 * servings} biscotes integrales`, `${70 * servings}g de ${t.freshCheese}`, `${10 * servings}g de semillas de lino`],
      instructions: [`Untar el ${t.freshCheese} sobre los biscotes y espolvorear el lino molido.`],
      tips: "El lino molido se absorbe mucho mejor que entero."
    },
    {
      name: `Bastones de Pepino y Apio con ${t.avocado} y Aceite de Oliva`,
      desc: "Snack keto crujiente, hidratante y saciante con grasas nobles.",
      prep: 5,
      calRatio: 0.15, pRatio: 0.05, cRatio: 0.05, fRatio: 0.40, costBase: 1.20,
      isVegetarian: true, isVegan: true, isGlutenFree: true, isKeto: true, isLowCarb: true,
      ingredients: [`1 pepino fresco`, `2 ramas de apio`, `${0.5 * servings} ${t.avocado}`, "Sal marina y aceite de oliva"],
      instructions: [`Cortar pepino y apio en bastones y dipear en el ${t.avocado} machacado con sal.`],
      tips: "Menos de 2g de carbohidratos netos."
    }
  ];
}

// Filter meals strictly based on dietary preference and excluded foods
export function filterMealsByPreference(
  pool: MealTemplate[],
  dietaryPreference?: string,
  excludedFoods: string[] = []
): MealTemplate[] {
  const normPref = (dietaryPreference || '').toLowerCase();
  const lowerExclusions = excludedFoods.map(f => f.toLowerCase().trim()).filter(Boolean);

  const isVegetarianReq = normPref.includes('vegetar');
  const isVeganReq = normPref.includes('vegan');
  const isKetoReq = normPref.includes('keto') || normPref.includes('cetog');
  const isLowCarbReq = isKetoReq || normPref.includes('low carb') || normPref.includes('baja en carb');
  const isGlutenFreeReq = normPref.includes('gluten') || normPref.includes('celiac');
  const isHighProteinReq = normPref.includes('prote');
  const isBudgetReq = normPref.includes('econ') || normPref.includes('ahorro');
  const isBatchCookingReq = normPref.includes('batch') || normPref.includes('fiambrera');

  const filtered = pool.filter(meal => {
    // 1. Strict Exclusion Filter
    if (lowerExclusions.length > 0) {
      const allText = `${meal.name} ${meal.desc} ${meal.ingredients.join(' ')}`.toLowerCase();
      const containsExcluded = lowerExclusions.some(ex => allText.includes(ex));
      if (containsExcluded) return false;
    }

    // 2. Strict Vegan Filter
    if (isVeganReq) {
      return meal.isVegan === true;
    }

    // 3. Strict Vegetarian Filter
    if (isVegetarianReq) {
      return meal.isVegetarian === true || meal.isVegan === true;
    }

    // 4. Strict Keto Filter
    if (isKetoReq) {
      return meal.isKeto === true;
    }

    // 5. Low Carb Filter
    if (isLowCarbReq) {
      return meal.isLowCarb === true || meal.isKeto === true;
    }

    // 6. Gluten Free Filter
    if (isGlutenFreeReq) {
      return meal.isGlutenFree === true;
    }

    // 7. High Protein Filter (prefer high protein, but don't strictly discard if pool gets too small)
    if (isHighProteinReq && meal.isHighProtein) {
      return true;
    }

    // 8. Budget / Batch Cooking (prefer match if available)
    if (isBudgetReq && meal.isBudget) {
      return true;
    }
    if (isBatchCookingReq && meal.isBatchCooking) {
      return true;
    }

    return true;
  });

  // If filter is too restrictive and returns 0, fallback gracefully to non-violating base
  if (filtered.length === 0) {
    if (isVeganReq) {
      return pool.filter(m => m.isVegan === true);
    }
    if (isVegetarianReq) {
      return pool.filter(m => m.isVegetarian === true || m.isVegan === true);
    }
    if (isKetoReq) {
      return pool.filter(m => m.isKeto === true || m.isLowCarb === true);
    }
    if (isGlutenFreeReq) {
      return pool.filter(m => m.isGlutenFree === true);
    }
    return pool;
  }

  return filtered;
}

// Helpers returning filtered pools
export function getFilteredLunchPool(
  t: RegionalIngredientProfile['terms'],
  servings: number,
  dietaryPreference?: string,
  excludedFoods: string[] = []
): MealTemplate[] {
  const basePool = getMasterLunchPool(t, servings);
  return filterMealsByPreference(basePool, dietaryPreference, excludedFoods);
}

export function getFilteredDinnerPool(
  t: RegionalIngredientProfile['terms'],
  servings: number,
  dietaryPreference?: string,
  excludedFoods: string[] = []
): MealTemplate[] {
  const basePool = getMasterDinnerPool(t, servings);
  return filterMealsByPreference(basePool, dietaryPreference, excludedFoods);
}

export function getFilteredBreakfastPool(
  t: RegionalIngredientProfile['terms'],
  servings: number,
  dietaryPreference?: string,
  excludedFoods: string[] = []
): MealTemplate[] {
  const basePool = getMasterBreakfastPool(t, servings);
  return filterMealsByPreference(basePool, dietaryPreference, excludedFoods);
}

export function getFilteredMorningSnacks(
  t: RegionalIngredientProfile['terms'],
  servings: number,
  dietaryPreference?: string,
  excludedFoods: string[] = []
): MealTemplate[] {
  const basePool = getMasterMorningSnacks(t, servings);
  return filterMealsByPreference(basePool, dietaryPreference, excludedFoods);
}

export function getFilteredAfternoonSnacks(
  t: RegionalIngredientProfile['terms'],
  servings: number,
  dietaryPreference?: string,
  excludedFoods: string[] = []
): MealTemplate[] {
  const basePool = getMasterAfternoonSnacks(t, servings);
  return filterMealsByPreference(basePool, dietaryPreference, excludedFoods);
}

// Fisher-Yates shuffle algorithm with seed/random offset
export function shuffleArray<T>(array: T[], seedOffset?: number): T[] {
  const arr = [...array];
  let seed = typeof seedOffset === 'number' ? seedOffset : Math.floor(Math.random() * 100000);
  
  function nextRand() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(nextRand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
