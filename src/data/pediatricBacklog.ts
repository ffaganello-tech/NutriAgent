export interface BacklogUserStory {
  id: string;
  epicId: string;
  epicName: string;
  title: string;
  userRole: string;
  action: string;
  benefit: string;
  acceptanceCriteria: string[];
  priority: 'MUST' | 'SHOULD' | 'COULD' | 'WONT';
  storyPoints: number;
  status: 'IMPLEMENTADO' | 'EN_CURSO' | 'BACKLOG_PRIORIZADO';
  ageBracketTarget: string;
  notes: string;
}

export interface BacklogEpic {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

export const BACKLOG_EPICS: BacklogEpic[] = [
  {
    id: 'EPIC-01',
    title: 'Gestión de Perfiles y Segmentación por Edad Infantil',
    description: 'Selector granular de etapas pediátricas desde los 6 meses (inicio de sólidos) hasta los 12+ años con adaptación de porciones y estilo alimentario.',
    color: 'emerald',
    icon: 'Baby'
  },
  {
    id: 'EPIC-02',
    title: 'Matriz de Seguridad Clínica y Exclusiones Toxicológicas',
    description: 'Reglas automáticas de exclusión para botulismo (miel <1 año), metales pesados (pescados grandes <10 años), exceso de nitratos y sobrecarga renal.',
    color: 'rose',
    icon: 'ShieldAlert'
  },
  {
    id: 'EPIC-03',
    title: 'Restricción Temprana de Soja y Fitoestrógenos (< 7 años)',
    description: 'Protocolo estricto para excluir soja, bebidas de soja, salsas y derivados no fermentados en menores de 7 años según directivas pediátricas.',
    color: 'amber',
    icon: 'Ban'
  },
  {
    id: 'EPIC-04',
    title: 'Adaptación de Texturas y Prevención de Asfixia Mecánica',
    description: 'Directivas de corte seguro (corte longitudinal en 4 de uvas y tomates cherry) y transformación de frutos secos a cremas/harinas para < 5 años.',
    color: 'blue',
    icon: 'Utensils'
  },
  {
    id: 'EPIC-05',
    title: 'Lista de Compras Pediátrica y Etiquetado Preventivo',
    description: 'Generación de lista de ingredientes aptos por supermercado con notas de seguridad (p. ej. lácteos 100% pasteurizados, sin sal agregada).',
    color: 'purple',
    icon: 'ShoppingCart'
  },
  {
    id: 'EPIC-06',
    title: 'Asistente de Consulta y Validación Pediátrica en Tiempo Real',
    description: 'Explicaciones claras en el visor del menú sobre por qué ciertos ingredientes fueron adaptados y sugerencias de acompañamiento familiar.',
    color: 'teal',
    icon: 'HeartHandshake'
  }
];

export const PEDIATRIC_BACKLOG_STORIES: BacklogUserStory[] = [
  {
    id: 'US-PED-001',
    epicId: 'EPIC-01',
    epicName: 'Gestión de Perfiles y Segmentación por Edad Infantil',
    title: 'Selector de Edad Infantil Granular desde los 6 meses',
    userRole: 'Madre / Padre planificando el menú del hogar',
    action: 'Seleccionar en el formulario la edad exacta de mi hijo (6-12m, 1-2a, 2-3a, 3-5a, 5-7a, 7-12a, 12+a)',
    benefit: 'Para que el menú generado aplique automáticamente los requerimientos nutricionales y restricciones clínicas de su edad.',
    acceptanceCriteria: [
      'GIVEN el usuario activa la opción de nutrición infantil en el formulario',
      'WHEN selecciona el rango de edad deseado (p. ej. "6 a 12 meses" o "5 a 7 años")',
      'THEN el sistema carga dinámicamente las directivas clínicas y advertencias de seguridad correspondientes.',
      'AND permite seleccionar el estilo de alimentación (BLW / Papillas / Mixto) para lactantes y primera infancia.'
    ],
    priority: 'MUST',
    storyPoints: 5,
    status: 'IMPLEMENTADO',
    ageBracketTarget: 'Todos (6m - 12+ años)',
    notes: 'Base estructural para disparar las reglas pediátricas en el backend y frontend.'
  },
  {
    id: 'US-PED-002',
    epicId: 'EPIC-03',
    epicName: 'Restricción Temprana de Soja y Fitoestrógenos (< 7 años)',
    title: 'Exclusión Automática de Soja y Derivados en Menores de 7 Años',
    userRole: 'NutriChef IA y Profesional de la Salud',
    action: 'Bloquear automáticamente la inclusión de soja, tofu, bebidas de soja, salsa de soja y edamame en planes para niños < 7 años',
    benefit: 'Para proteger el equilibrio endocrinológico infantil y evitar sobreexposición a isoflavonas y fitatos en etapas de maduración.',
    acceptanceCriteria: [
      'GIVEN un perfil infantil configurado con edad menor a 7 años (6-12m, 1-2a, 2-3a, 3-5a, 5-7a)',
      'WHEN se genera el menú semanal o se sustituye una comida individual',
      'THEN ninguna receta incluirá soja, harina de soja, bebida vegetal de soja, tofu ni salsa de soja',
      'AND las fuentes proteicas se derivarán de legumbres locales (lentejas, garbanzos), huevos, pollo, pescados blancos o lácteos pasteurizados.'
    ],
    priority: 'MUST',
    storyPoints: 5,
    status: 'IMPLEMENTADO',
    ageBracketTarget: '6m a 7 años',
    notes: 'Requisito explícito del usuario y directiva clínica respaldada por comités de nutrición pediátrica.'
  },
  {
    id: 'US-PED-003',
    epicId: 'EPIC-02',
    epicName: 'Matriz de Seguridad Clínica y Exclusiones Toxicológicas',
    title: 'Bloqueo Estricto de Miel en Menores de 1 Año (Prevención de Botulismo)',
    userRole: 'Sistema de Seguridad Alimentaria',
    action: 'Verificar que ninguna receta, postre o snack para lactantes de 6-12 meses contenga miel cruda, cocida ni procesada',
    benefit: 'Para prevenir la colonización intestinal por esporas de Clostridium botulinum y el botulismo del lactante potencialmente fatal.',
    acceptanceCriteria: [
      'GIVEN un bebé de 6 a 12 meses',
      'WHEN se evalúan los ingredientes de las recetas y meriendas',
      'THEN el sistema prohíbe de forma absoluta cualquier tipo de miel o endulzante derivado',
      'AND muestra una alerta explícita de seguridad toxicológica en el resumen pediátrico.'
    ],
    priority: 'MUST',
    storyPoints: 3,
    status: 'IMPLEMENTADO',
    ageBracketTarget: '6 a 12 meses',
    notes: 'Protocolo de seguridad universal de la OMS / AAP / ESPGHAN.'
  },
  {
    id: 'US-PED-004',
    epicId: 'EPIC-02',
    epicName: 'Matriz de Seguridad Clínica y Exclusiones Toxicológicas',
    title: 'Exclusión de Sal Añadida y Azúcar en Lactantes (0 Sal / 0 Azúcar)',
    userRole: 'Padre / Madre de un lactante',
    action: 'Asegurar que todas las recetas de 6 a 12 meses se preparen con 0 sal añadida y 0 azúcares refinados/edulcorantes',
    benefit: 'Para proteger los riñones inmaduros del lactante y desarrollar un umbral de sabor natural.',
    acceptanceCriteria: [
      'GIVEN un lactante de 6-12 meses',
      'WHEN se redactan las instrucciones de preparación',
      'THEN se especifica expresamente cocinar sin sal agregada',
      'AND se potencian los sabores mediante hierbas aromáticas suaves (orégano, albahaca, laurel).'
    ],
    priority: 'MUST',
    storyPoints: 3,
    status: 'IMPLEMENTADO',
    ageBracketTarget: '6 a 12 meses',
    notes: 'Esencial para evitar sobrecarga de solutos renales.'
  },
  {
    id: 'US-PED-005',
    epicId: 'EPIC-04',
    epicName: 'Adaptación de Texturas y Prevención de Asfixia Mecánica',
    title: 'Protocolo Anti-Atragantamiento para Frutos Secos y Alimentos Esféricos (< 5 años)',
    userRole: 'Cuidador de niños pequeños',
    action: 'Instruir el consumo de frutos secos exclusivamente molidos o en crema 100%, y corte longitudinal en 4 de uvas/tomates cherry',
    benefit: 'Para eliminar el riesgo número 1 de asfixia mecánica y aspiración bronquial en niños menores de 5 años.',
    acceptanceCriteria: [
      'GIVEN un niño menor de 5 años (6-12m, 1-2a, 2-3a, 3-5a)',
      'WHEN la receta incluye frutos secos (nueces, almendras, cacahuetes)',
      'THEN el ingrediente se nombra expresamente como "crema 100% de fruto seco" o "harina/polvo de fruto seco molido"',
      'AND en caso de uvas o tomates cherry, se indica en el paso "cortar longitudinalmente en cuatro trozos a lo largo".'
    ],
    priority: 'MUST',
    storyPoints: 5,
    status: 'IMPLEMENTADO',
    ageBracketTarget: '6m a 5 años',
    notes: 'Norma pediátrica crucial para seguridad doméstica.'
  },
  {
    id: 'US-PED-006',
    epicId: 'EPIC-02',
    epicName: 'Matriz de Seguridad Clínica y Exclusiones Toxicológicas',
    title: 'Restricción de Pescados con Alto Contenido de Metilmercurio (< 10 años)',
    userRole: 'Planificador nutricional',
    action: 'Excluir automáticamente pez espada (emperador), atún rojo, tiburón (cazón, marrajo, tintorera) y lucio en niños',
    benefit: 'Para salvaguardar el desarrollo neurocognitivo infantil contra el bioacumulable metilmercurio.',
    acceptanceCriteria: [
      'GIVEN un niño en rango de 6 meses a 7/10 años',
      'WHEN se seleccionan recetas con pescado',
      'THEN solo se asignan pescados blancos (merluza, bacalao, dorada, lubina) o azules pequeños con bajo mercurio (salmón, sardina, boquerón, caballa)',
      'AND los grandes depredadores quedan excluidos de la lista de compras y menús.'
    ],
    priority: 'MUST',
    storyPoints: 3,
    status: 'IMPLEMENTADO',
    ageBracketTarget: '6m a 10 años',
    notes: 'Recomendación de la Agencia Española de Seguridad Alimentaria y Nutrición (AESAN) y FDA.'
  },
  {
    id: 'US-PED-007',
    epicId: 'EPIC-02',
    epicName: 'Matriz de Seguridad Clínica y Exclusiones Toxicológicas',
    title: 'Cocción Completa 100% de Carnes y Huevos (Prevención de SUH y Salmonella)',
    userRole: 'Padre / Madre cocinando para la familia',
    action: 'Garantizar que todas las instrucciones indiquen cocción completa hasta el centro del alimento (sin carnes crudas/poco hechas ni huevo crudo)',
    benefit: 'Para evitar el Síndrome Urémico Hemolítico (SUH causado por E. coli enterohemorrágico) y salmonelosis.',
    acceptanceCriteria: [
      'GIVEN cualquier menú con perfil infantil activo',
      'WHEN se preparan carnes picadas, hamburguesas caseras, pollo o tortillas',
      'THEN las instrucciones enfatizan "cocinar completamente hasta el centro hasta que no quede líquido rosado ni huevo líquido",',
      'AND no se sugieren mayonesas caseras con huevo crudo ni carpaccios.'
    ],
    priority: 'MUST',
    storyPoints: 3,
    status: 'IMPLEMENTADO',
    ageBracketTarget: 'Todos los niños',
    notes: '"Cosas básicas que nunca le harías a un niño".'
  },
  {
    id: 'US-PED-008',
    epicId: 'EPIC-04',
    epicName: 'Adaptación de Texturas y Prevención de Asfixia Mecánica',
    title: 'Soporte Especial para Métodos BLW (Baby-Led Weaning) y Papillas Mixtas',
    userRole: 'Familia iniciando alimentación complementaria a los 6 meses',
    action: 'Seleccionar entre Baby-Led Weaning (sólidos autorregulados) o Papillas tradicionales con texturas evolutivas',
    benefit: 'Para adaptar las instrucciones del menú a la técnica de alimentación elegida por la familia.',
    acceptanceCriteria: [
      'GIVEN la selección de edad 6 a 12 meses',
      'WHEN el usuario escoge la modalidad "BLW (Baby-Led Weaning)"',
      'THEN los alimentos se estructuran en bastones suaves cocidos al vapor (que se deshagan al presionarlos entre los dedos)',
      'AND cuando escoge "Papillas", se indican purés densos con trocitos muy suaves para estimular la deglución.'
    ],
    priority: 'SHOULD',
    storyPoints: 5,
    status: 'IMPLEMENTADO',
    ageBracketTarget: '6 a 12 meses y 1 a 2 años',
    notes: 'Facilita la transición respetuosa y autónoma del bebé.'
  },
  {
    id: 'US-PED-009',
    epicId: 'EPIC-05',
    epicName: 'Lista de Compras Pediátrica y Etiquetado Preventivo',
    title: 'Notas Pediátricas en la Lista de Compras por Supermercado',
    userRole: 'Persona que hace las compras en el supermercado',
    action: 'Visualizar recordatorios de seguridad infantil en la lista de compras (p. ej. lácteos 100% pasteurizados, cereales sin azúcar añadido)',
    benefit: 'Para no comprar por error productos con alérgenos o presentaciones de riesgo.',
    acceptanceCriteria: [
      'GIVEN una lista de compras generada con perfil infantil',
      'WHEN el usuario revisa las categorías de lácteos, carnes y frutos secos',
      'THEN se agregan notas explícitas ("Asegurar leche/queso pasteurizado", "Comprar crema 100% frutos secos sin trozos")',
      'AND los productos de soja quedan excluidos del carrito.'
    ],
    priority: 'SHOULD',
    storyPoints: 3,
    status: 'IMPLEMENTADO',
    ageBracketTarget: 'Todos los rangos pediátricos',
    notes: 'Alineación perfecta entre cocina y supermercado.'
  },
  {
    id: 'US-PED-010',
    epicId: 'EPIC-06',
    epicName: 'Asistente de Consulta y Validación Pediátrica en Tiempo Real',
    title: 'Visor Interactivo del Backlog Funcional y Matriz de Reglas Pediátricas',
    userRole: 'Usuario, Pediatra o Product Manager',
    action: 'Acceder a una pantalla/modal interactiva con el backlog funcional completo, especificaciones técnicas y matriz clínica de seguridad',
    benefit: 'Para tener transparencia total del roadmap pediátrico, descargar el backlog en formato Markdown y auditar las directivas implementadas.',
    acceptanceCriteria: [
      'GIVEN el usuario hace clic en "Ver Backlog Pediátrico & Guía Funcional"',
      'WHEN se abre el modal',
      'THEN puede explorar las Historias de Usuario con Criterios de Aceptación, filtrar por Épica o Grupo de Edad, y exportar las notas como Backlog formal.',
      'AND visualizar la matriz clínica de seguridad por cada franja etaria.'
    ],
    priority: 'MUST',
    storyPoints: 5,
    status: 'IMPLEMENTADO',
    ageBracketTarget: 'Visión de Plataforma',
    notes: 'Cumple el requerimiento de guardar las notas y transformarlas en backlog funcional.'
  }
];

export function generateBacklogMarkdown(): string {
  return `# BACKLOG FUNCIONAL DE NUTRICIÓN PEDIÁTRICA & SEGURIDAD INFANTIL
**Proyecto:** NutriaAgente Semanal
**Módulo:** NutriChef Pediátrico & Dieta Familiar con Niños
**Fecha de Publicación:** 2026-08-16
**Versión:** 1.2.0 - Core Pediatric Guidelines

---

## 1. Visión y Objetivos del Módulo Pediátrico

El objetivo del **Módulo Pediátrico de NutriaAgente** es capacitar a las familias para planificar menús semanales seguros, equilibrados y sabrosos que integren las necesidades de los niños según su edad cronológica exacta (desde los 6 meses de vida hasta la adolescencia).

### Principios Fundamentales ("Cosas básicas que nunca le harías a un niño"):
1. **Seguridad Absoluta contra la Asfixia (Atragantamiento):** Cero frutos secos enteros antes de los 5 años (solo en cremas 100% o molidos en harina fina). Corte longitudinal en cuatro cuartos para uvas, tomates cherry y salchichas.
2. **Exclusión de Soja y Derivados (< 7 años):** Siguiendo las directivas pediátricas y endocrinológicas, se evita la soja concentrada, bebidas de soja, salsa de soja y tofu antes de los 7 años para respetar la maduración hormonal.
3. **Cero Miel en Menores de 1 Año:** Prevención del botulismo del lactante causado por esporas de *Clostridium botulinum*.
4. **Cero Sal y Azúcar Añadidos (< 1 año):** Protección de la función renal inmadura y preservación del umbral natural del sabor.
5. **Cocción 100% Completa:** Cero carnes, pescados ni huevos crudos o poco hechos (prevención de Salmonella y Síndrome Urémico Hemolítico SUH por *E. coli*).
6. **Lácteos 100% Pasteurizados:** Cero leche cruda o quesos no pasteurizados (prevención de Listeriosis y Brucelosis).
7. **Pescados con Cero Mercurio:** Exclusión de pez espada, atún rojo, emperador y cazón en niños pequeños.

---

## 2. Épicas del Proyecto

${BACKLOG_EPICS.map(epic => `### [${epic.id}] ${epic.title}
*${epic.description}*
`).join('\n')}

---

## 3. Matriz de Historias de Usuario (User Stories & Acceptance Criteria)

${PEDIATRIC_BACKLOG_STORIES.map(us => `
### [${us.id}] ${us.title}
- **Épica:** ${us.epicName} (${us.epicId})
- **Prioridad:** ${us.priority} | **Story Points:** ${us.storyPoints} | **Estado:** ${us.status}
- **Público Objetivo:** ${us.ageBracketTarget}
- **Historia:** Como **${us.userRole}**, quiero **${us.action}**, para **${us.benefit}**.

#### Criterios de Aceptación (Gherkin):
\`\`\`gherkin
${us.acceptanceCriteria.join('\n')}
\`\`\`

- **Notas de Ingeniería & Pediatría:** ${us.notes}
`).join('\n---\n')}

---

## 4. Matriz Clínica de Seguridad por Grupo de Edad

| Rango de Edad | Etapa | Alimentos Prohibidos | Directiva de Soja | Riesgos de Asfixia / Textura |
| :--- | :--- | :--- | :--- | :--- |
| **6 a 12 meses** | Lactante / Inicio Sólidos | Miel, Sal, Azúcar, Leche de vaca entera, Pescados grandes, Espinacas/acelgas en exceso | **PROHIBIDA** | Frutos secos enteros prohibidos (solo crema fina). Bastones suaves BLW o purés evolutivos. |
| **1 a 2 años** | Primera Infancia | Azúcares añadidos, Exceso de sal, Pescados grandes con mercurio, Embutidos grasos | **PROHIBIDA** | Frutos secos solo molidos. Uvas cortadas en 4 a lo largo. |
| **2 a 3 años** | Toddler / Niños Pequeños | Frutos secos enteros, Pescados altos en mercurio, Picantes, Ultraprocesados | **PROHIBIDA** | Frutos secos en crema/harina. Cortar alimentos cilíndricos. |
| **3 a 5 años** | Preescolar | Frutos secos enteros sin supervisión/triturar, Bebidas azucaradas/energéticas | **PROHIBIDA** | Evitar caramelos duros. |
| **5 a 7 años** | Infantil Temprano | Pescados grandes con mercurio, Ultraprocesados industriales | **PROHIBIDA** (Hasta los 7 años) | Introducción progresiva de frutos secos con masticación consciente. |
| **7 a 12 años** | Escolar | Bebidas con cafeína, Pescados gigantes con mercurio | Consumo moderado permitido | Alimentación familiar completa. |
| **12+ años** | Adolescencia / General | Estimulantes, Bebidas energéticas comerciales | Consumo libre equilibrado | Ración adulta estándar. |

---

## 5. Roadmap de Implementación

- **Sprint 1 (Completado):** Modelo de datos en TypeScript, Matriz clínica de exclusiones, Integración en backend AI y Fallback generator.
- **Sprint 2 (Completado):** UI interactiva con selector visual de edad, alertas de seguridad en tiempo real y soporte BLW/Papillas.
- **Sprint 3 (Completado):** Visor del menú con insignias pediátricas, adaptación de lista de compras y explorador del backlog funcional.
- **Sprint 4 (Futuro):** Registro multi-hijo con diferentes edades en la misma mesa familiar y cálculo calórico pediátrico personalizado por percentiles de la OMS.
`;
}
