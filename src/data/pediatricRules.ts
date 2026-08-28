import { ChildAgeBracket, ChildConfig, ChildSummary } from '../types';

export interface PediatricAgeInfo {
  id: ChildAgeBracket;
  label: string;
  shortLabel: string;
  badgeColor: string;
  stageTitle: string;
  ageRangeDesc: string;
  mainFocus: string;
  forbiddenFoods: { food: string; reason: string }[];
  chokingHazards: { food: string; safeForm: string }[];
  textureGuidance: string;
  soyDirectives: string;
  clinicalSafetyNotes: string[];
  recommendedNutrients: string[];
  portionAdvice: string;
}

export const PEDIATRIC_AGE_RULES: Record<ChildAgeBracket, PediatricAgeInfo> = {
  '6_12m': {
    id: '6_12m',
    label: '6 a 12 meses (Inicio de sólidos / BLW / Papillas)',
    shortLabel: '6-12 meses',
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-200',
    stageTitle: 'Alimentación Complementaria Temprana',
    ageRangeDesc: 'Transición de leche a sólidos. La leche (materna o fórmula) sigue siendo la fuente nutricional principal.',
    mainFocus: 'Introducción de sabores naturales, texturas seguras y alimentos ricos en hierro biodisponible.',
    forbiddenFoods: [
      { food: 'Miel de abeja (cruda o cocida)', reason: 'Riesgo estricto de botulismo infantil por esporas de Clostridium botulinum.' },
      { food: 'Sal añadida / Caldos concentrados', reason: 'Inmadurez de la función glomerular renal.' },
      { food: 'Azúcar refinado, panela, siropes y edulcorantes', reason: 'Altera el umbral de sabor, riesgo de caries y dismetabolismo.' },
      { food: 'Leche de vaca entera como bebida', reason: 'Sobrecarga proteica y de solutos renales, riesgo de microhemorragias digestivas.' },
      { food: 'Soja y bebidas/derivados de soja', reason: 'Fitoestrógenos / isoflavonas no recomendados en primera infancia (< 7 años).' },
      { food: 'Frutos secos enteros y semillas duras', reason: 'Principal causa de atragantamiento y asfixia mecánica en lactantes.' },
      { food: 'Pescados grandes (pez espada, atún rojo, emperador, cazón)', reason: 'Bioacumulación tóxica de metilmercurio para el cerebro en desarrollo.' },
      { food: 'Espinacas, acelgas y remolacha en exceso', reason: 'Contenido en nitratos con riesgo de metahemoglobinemia (síndrome del bebé azul).' },
      { food: 'Carnes, pescados o huevos crudos/poco hechos', reason: 'Riesgo de Salmonella, Campylobacter y Síndrome Urémico Hemolítico (SUH).' },
      { food: 'Lácteos no pasteurizados', reason: 'Riesgo de Listeria monocytogenes y Brucella.' }
    ],
    chokingHazards: [
      { food: 'Frutos secos (nueces, almendras, cacahuetes)', safeForm: 'Solo 100% triturados en crema fina untada o polvo mezclado en puré.' },
      { food: 'Uvas y tomates cherry', safeForm: 'Cortados siempre a lo largo en cuatro partes longitudinales (cuartos).' },
      { food: 'Zanahoria y manzana crudas', safeForm: 'Cocidas al vapor hasta que se aplasten con dos dedos o ralladas finamente.' },
      { food: 'Salchichas o trozos cilíndricos', safeForm: 'Nunca en rodajas redondas; cortar longitudinalmente en tiras finas.' }
    ],
    textureGuidance: 'BLW: Alimentos en bastones alargados del tamaño del puño del bebé, suaves (que se aplasten fácilmente entre índice y pulgar). Papillas: purés con textura progresiva sin triturar al extremo para favorecer masticación.',
    soyDirectives: 'Prohibida la soja, bebidas de soja, concentrados y tofu. Las proteínas deben provenir de legumbres locales (lentejas peladas, garbanzos cocidos suaves), pollo, huevo bien cocido y pescado blanco.',
    clinicalSafetyNotes: [
      'Alimentación con supervisión visual constante del adulto.',
      'El bebé debe mantenerse sentado erguido a 90 grados en su trona con soporte.',
      'Respetar las señales de saciedad: nunca forzar ni obligar a comer.'
    ],
    recommendedNutrients: ['Hierro biodisponible (pollo, yema bien cocida, lentejas)', 'Grasas saludables (Aceite de oliva virgen extra, palta/aguacate)', 'Vitamina C con comidas para absorber hierro'],
    portionAdvice: 'Porciones pequeñas de cata (1 a 3 cucharadas o 2-3 bastones). El bebé decide la cantidad.'
  },

  '1_2y': {
    id: '1_2y',
    label: '1 a 2 años (Primera infancia)',
    shortLabel: '1-2 años',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    stageTitle: 'Transición a la Mesa Familiar',
    ageRangeDesc: 'El niño se integra progresivamente a la comida del hogar con adaptaciones de textura y sazón.',
    mainFocus: 'Consolidación de hábitos saludables, textura picada fina y descubrimiento sensorial variado.',
    forbiddenFoods: [
      { food: 'Azúcares añadidos, zumos industriales y refrescos', reason: 'Preferencia precoz por lo ultra-dulce y riesgo de caries/obesidad.' },
      { food: 'Sal en exceso (máximo 2g/día en total)', reason: 'Cuidado de presión arterial y función renal infantil.' },
      { food: 'Soja y derivados procesados', reason: 'Restringido antes de los 7 años por fitoestrógenos e interferencia endocrina.' },
      { food: 'Frutos secos enteros y caramelos duros', reason: 'Riesgo grave de asfixia hasta los 4-5 años.' },
      { food: 'Pescados grandes depredadores con alto mercurio', reason: 'Toxicidad sobre el sistema nervioso central.' },
      { food: 'Embutidos procesados, carnes curadas con nitritos', reason: 'Exceso de sodio, grasas saturadas proinflamatorias y conservantes.' },
      { food: 'Alimentos con cafeína, teobromina o estimulantes', reason: 'Irritabilidad, taquicardia y alteración del sueño infantil.' }
    ],
    chokingHazards: [
      { food: 'Frutos secos', safeForm: 'Solo molidos o en crema 100% natural.' },
      { food: 'Uvas, aceitunas con o sin hueso, cerezas', safeForm: 'Deshuesadas y partidas en cuartos a lo largo.' },
      { food: 'Carnes fibrosas', safeForm: 'Picadas o deshilachadas muy suaves.' }
    ],
    textureGuidance: 'Comida cortada en trocitos pequeños o picada. Fomentar el uso de cubiertos adaptados y la autonomía motriz.',
    soyDirectives: 'Evitar bebidas de soja, brotes de soja, salsas de soja y tofu. Priorizar legumbres cocidas locales y carnes magras.',
    clinicalSafetyNotes: [
      'Sin pantallas durante la comida para fomentar la conciencia sensorial y evitar atragantamientos.',
      'Ofrecer agua como única bebida principal además de leche entera pasteurizada o materna.'
    ],
    recommendedNutrients: ['Calcio y Vitamina D', 'Ácidos grasos Omega-3 (pescado azul pequeño como sardinillas o salmón)', 'Zinc y Hierro'],
    portionAdvice: 'Aproximadamente 1/4 a 1/3 de la porción de un adulto. Servir poco y permitir repetir si lo solicita.'
  },

  '2_3y': {
    id: '2_3y',
    label: '2 a 3 años (Niños pequeños / Toddler)',
    shortLabel: '2-3 años',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    stageTitle: 'Autonomía y Preferencias Tempranas',
    ageRangeDesc: 'Etapa de afianzamiento motor, posible neofobia alimentaria normal y desarrollo del gusto.',
    mainFocus: 'Presentación atractiva de verduras y legumbres, platos coloridos sin presión.',
    forbiddenFoods: [
      { food: 'Soja y derivados concentrados', reason: 'Pauta pediátrica de restricción antes de los 7 años.' },
      { food: 'Frutos secos enteros', reason: 'Mantener la restricción hasta los 4-5 años por vía aérea estrecha.' },
      { food: 'Pescados con alto contenido de mercurio (pez espada, atún rojo)', reason: 'Recomendación de la Agencia de Seguridad Alimentaria.' },
      { food: 'Comida ultraprocesada, frituras comerciales y bollería', reason: 'Grasas trans y azúcares ocultos.' },
      { food: 'Picantes intensos o condimentos agresivos', reason: 'Sensibilidad en la mucosa gástrica e intestinal.' }
    ],
    chokingHazards: [
      { food: 'Frutos secos enteros', safeForm: 'Integrados en harina, molidos o en crema 100%.' },
      { food: 'Uvas y tomates cherry', safeForm: 'Siempre cortados longitudinalmente en 2 o 4 partes.' }
    ],
    textureGuidance: 'Textura sólida familiar estándar, con alimentos duros troceados en bocados manejables.',
    soyDirectives: 'Sin soja ni alimentos ultraprocesados veganos basados en aislados de soja. Usar huevos, lácteos pasteurizados y legumbres.',
    clinicalSafetyNotes: [
      'No utilizar la comida como premio o castigo.',
      'Modelado de conducta: los niños comen lo que ven comer a sus padres en la mesa.'
    ],
    recommendedNutrients: ['Fibra prebiótica (avena, frutas con piel lavada, legumbres)', 'Proteínas de alto valor biológico', 'Calcio'],
    portionAdvice: 'Aproximadamente 1/3 de la porción de un adulto.'
  },

  '3_5y': {
    id: '3_5y',
    label: '3 a 5 años (Etapa Preescolar)',
    shortLabel: '3-5 años',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    stageTitle: 'Alimentación Preescolar Activa',
    ageRangeDesc: 'Alto gasto energético por actividad física y socialización en guardería o colegio.',
    mainFocus: 'Energía de liberación lenta, desayunos saciantes y meriendas frescas sin azúcares libres.',
    forbiddenFoods: [
      { food: 'Soja y bebidas de soja', reason: 'Mantener exclusión preventiva de fitoestrógenos hasta los 7 años.' },
      { food: 'Frutos secos enteros sin triturar (hasta los 5 años cumplidos)', reason: 'Riesgo de aspiración bronquial.' },
      { food: 'Pescados azules de gran tamaño', reason: 'Mercurio y metales pesados acumulativos.' },
      { food: 'Bebidas energéticas, refrescos y zumos envasados', reason: 'Impacto metabólico y neuroconductual.' }
    ],
    chokingHazards: [
      { food: 'Caramelos duros y frutos secos enteros', safeForm: 'Evitar caramelos; frutos secos en crema o harina.' }
    ],
    textureGuidance: 'Comida familiar completa. Se puede promover el corte con cubiertos infantiles de punta redonda.',
    soyDirectives: 'Cero soja ni bebidas de soja. Variedad proteica con carnes blancas, pescado blanco y azul pequeño, garbanzos y lentejas.',
    clinicalSafetyNotes: [
      'Fomentar la hidratación con agua en la mochila escolar.',
      'Involucrar al niño en la preparación de ensaladas o lavado de frutas.'
    ],
    recommendedNutrients: ['Hidratos de carbono complejos (arroz integral, patatas, avena)', 'Vitamina A y C', 'Hierro'],
    portionAdvice: 'Aproximadamente 1/2 de la porción de un adulto.'
  },

  '5_7y': {
    id: '5_7y',
    label: '5 a 7 años (Infantil Temprano / Sin Soja)',
    shortLabel: '5-7 años',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    stageTitle: 'Consolidación Escolar Temprana',
    ageRangeDesc: 'Crecimiento lineal sostenido y desarrollo cognitivo en ciclo escolar primario.',
    mainFocus: 'Nutrientes para la concentración cerebral, salud ósea y consolidación de la microbiota.',
    forbiddenFoods: [
      { food: 'Soja, bebidas de soja, salsa de soja y tofu concentrado', reason: 'Finalización de la ventana de protección hormonal y digestiva (< 7 años).' },
      { food: 'Pescados con alto mercurio (pez espada, atún rojo)', reason: 'Mantener restricción pediátrica hasta los 10 años según AESAN / EFSA.' },
      { food: 'Ultraprocesados y embutidos industriales', reason: 'Prevención de síndrome metabólico precoz.' }
    ],
    chokingHazards: [
      { food: 'Frutos secos enteros', safeForm: 'Se pueden introducir enteros con masticación consciente y sentados tranquilos.' }
    ],
    textureGuidance: 'Textura adulta estándar completa.',
    soyDirectives: 'Exclusión estricta de soja y derivados directos. Foco en fuentes naturales de calcio (lácteos, sésamo triturado, legumbres, brócoli).',
    clinicalSafetyNotes: [
      'Evitar el exceso de bollería en recreos; sustituir por fruta entera y frutos secos o bocadillos de pan integral.',
      'Mantener el pescado azul pequeño 2 veces por semana (salmón, sardina, boquerón).'
    ],
    recommendedNutrients: ['DHA / Omega-3 para desarrollo neuronal', 'Calcio y Magnesio', 'Hierro'],
    portionAdvice: 'Aproximadamente 60% de la porción de un adulto.'
  },

  '7_12y': {
    id: '7_12y',
    label: '7 a 12 años (Etapa Escolar)',
    shortLabel: '7-12 años',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    stageTitle: 'Etapa Escolar y Deportiva',
    ageRangeDesc: 'Etapa de rápido estirón prepuberal y demandas deportivas extracurriculares.',
    mainFocus: 'Recuperación muscular, salud ósea y densidad de micronutrientes.',
    forbiddenFoods: [
      { food: 'Pescados gigantes con mercurio (pez espada, cazón)', reason: 'Restricción aconsejada hasta los 10-12 años.' },
      { food: 'Bebidas con cafeína / energizantes', reason: 'Efecto excitatorio cardiovascular y neurotóxico.' },
      { food: 'Comida rápida ultraprocesada frecuente', reason: 'Grasas de baja calidad y exceso de sodio.' }
    ],
    chokingHazards: [],
    textureGuidance: 'Alimentación estándar familiar completa.',
    soyDirectives: 'A partir de los 7 años la soja fermentada tradicional (miso, tempeh) o legumbre de soja puede introducirse de forma moderada si la familia lo desea, priorizando siempre la variedad de legumbres locales.',
    clinicalSafetyNotes: [
      'Garantizar desayunos completos con proteína y fibra antes de la jornada escolar.',
      'Snacks deportivos con fruta fresca, frutos secos y lácteos de calidad.'
    ],
    recommendedNutrients: ['Calcio (1000-1200 mg/día)', 'Hierro para expansión de masa eritrocitaria', 'Proteína de calidad'],
    portionAdvice: 'Aproximadamente 70-80% de la porción de un adulto (igual a un adulto en días de alta actividad deportiva).'
  },

  '12_plus': {
    id: '12_plus',
    label: '12+ años (Adolescente / Familiar General)',
    shortLabel: '12+ años',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    stageTitle: 'Adolescencia y Menú Familiar Completo',
    ageRangeDesc: 'Máximo pico de velocidad de crecimiento y maduración puberal.',
    mainFocus: 'Suministro calórico y proteico óptimo, balance hormonal y rendimiento académico.',
    forbiddenFoods: [
      { food: 'Bebidas energéticas / estimulantes comerciales', reason: 'Elevado riesgo de arritmias, insomnio y adicción a estimulantes.' },
      { food: 'Dietas restrictivas no supervisadas', reason: 'Riesgo de trastornos de la conducta alimentaria (TCA).' }
    ],
    chokingHazards: [],
    textureGuidance: 'Alimentación completa para adultos.',
    soyDirectives: 'Consumo libre dentro de una dieta variada y equilibrada.',
    clinicalSafetyNotes: [
      'Promover una relación saludable con la comida y la imagen corporal.',
      'Mantener comidas familiares compartidas al menos una vez al día.'
    ],
    recommendedNutrients: ['Hierro (especial atención en mujeres jóvenes)', 'Calcio (pico de masa ósea)', 'Proteínas completas'],
    portionAdvice: 'Porción completa equivalente a adulto activo.'
  }
};

export function getPediatricSafetyDirectives(childConfig?: ChildConfig): {
  promptDirectives: string;
  summary: ChildSummary;
  systemExclusions: string[];
} {
  if (!childConfig || !childConfig.enabled) {
    return {
      promptDirectives: '',
      summary: {
        ageLabel: 'Adultos / General',
        keySafetyDirectives: [],
        chokingHazardAlerts: [],
        prohibitedIngredients: [],
        pediatricTips: [],
        textureGuidance: ''
      },
      systemExclusions: []
    };
  }

  const ageRule = PEDIATRIC_AGE_RULES[childConfig.ageBracket] || PEDIATRIC_AGE_RULES['3_5y'];
  const feedingStyleLabel = childConfig.feedingStyle 
    ? (childConfig.feedingStyle === 'blw' ? 'Baby-Led Weaning (BLW)' : childConfig.feedingStyle === 'triturado' ? 'Papillas / Purés' : childConfig.feedingStyle === 'mixto' ? 'Alimentación Mixta' : 'Mesa Familiar')
    : undefined;

  // Build list of system exclusions
  const exclusions: string[] = [];
  
  // Under 7 years: Strict Soy ban
  const isUnder7 = ['6_12m', '1_2y', '2_3y', '3_5y', '5_7y'].includes(childConfig.ageBracket);
  if (isUnder7) {
    exclusions.push('soja', 'tofu', 'salsa de soja', 'bebida de soja', 'edamame', 'proteina de soja', 'tempeh');
  }

  // Under 1 year: Strict Salt, Honey, Whole Cow Milk, Raw Egg/Meat, High Nitrate greens
  if (childConfig.ageBracket === '6_12m') {
    exclusions.push('miel', 'sal añadida', 'azucar', 'leche de vaca', 'pez espada', 'atun rojo', 'emperador', 'frutos secos enteros');
  }

  // Under 5 years: High mercury fish & whole nuts
  if (['6_12m', '1_2y', '2_3y', '3_5y'].includes(childConfig.ageBracket)) {
    exclusions.push('pez espada', 'emperador', 'atun rojo', 'cazon', 'lucio');
  }

  const promptDirectives = `
=== REGLAS CLÍNICAS DE SEGURIDAD PEDIÁTRICA OBLIGATORIAS (EDAD DEL HIJO: ${ageRule.label}) ===
- RANGO DE EDAD: ${ageRule.label}
- ESTILO DE ALIMENTACIÓN: ${feedingStyleLabel || 'Adaptación infantil segura'}
- ALIMENTOS ESTRICTAMENTE PROHIBIDOS PARA ESTA EDAD:
${ageRule.forbiddenFoods.map(f => `  * PROHIBIDO: ${f.food} (Causa clínica: ${f.reason})`).join('\n')}
${isUnder7 ? '- RESTRICCIÓN DE SOJA (< 7 AÑOS): NO incluir soja, brotes de soja, salsa de soja ni derivados en ninguna comida (directiva pediátrica por fitoestrógenos).' : ''}
- PREVENCIÓN DE ASFIXIA Y CORTE SEGURO:
${ageRule.chokingHazards.map(c => `  * ${c.food}: ${c.safeForm}`).join('\n')}
- GUÍA DE TEXTURA: ${ageRule.textureGuidance}
- GUÍA DE PORCIÓN INFANTIL: ${ageRule.portionAdvice}
- COSAS BÁSICAS QUE NUNCA SE LE DAN A UN NIÑO:
  * NADA de huevos o carnes poco cocidas / crudas (prevención de Salmonella y Síndrome Urémico Hemolítico SUH).
  * NADA de picantes intensos, chiles irritantes ni alcohol en cocción.
  * Lácteos siempre 100% pasteurizados.
  * Si hay frutos secos en la receta para niños pequeños, DEBEN especificarse como "molidos", "en crema 100%" o "en harina fina".
  * Las uvas y tomates cherry deben indicarse siempre como "cortados a lo largo en cuartos".
=== FIN REGLAS PEDIÁTRICAS ===
`;

  const summary: ChildSummary = {
    ageLabel: ageRule.label,
    feedingStyleLabel,
    keySafetyDirectives: [
      ageRule.mainFocus,
      ageRule.soyDirectives,
      ...ageRule.clinicalSafetyNotes
    ],
    chokingHazardAlerts: ageRule.chokingHazards.map(c => `${c.food}: ${c.safeForm}`),
    prohibitedIngredients: ageRule.forbiddenFoods.map(f => `${f.food} (${f.reason})`),
    pediatricTips: [
      ageRule.portionAdvice,
      ...ageRule.recommendedNutrients.map(n => `Nutriente clave: ${n}`)
    ],
    textureGuidance: ageRule.textureGuidance
  };

  return {
    promptDirectives,
    summary,
    systemExclusions: exclusions
  };
}
