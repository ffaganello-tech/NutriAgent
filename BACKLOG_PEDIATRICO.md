# BACKLOG FUNCIONAL DE NUTRICIÓN PEDIÁTRICA & SEGURIDAD INFANTIL
**Proyecto:** NutriaAgente Semanal
**Módulo:** NutriChef Pediátrico & Dieta Familiar con Niños
**Fecha de Creación:** 2026-08-16
**Versión:** 1.2.0 - Core Pediatric Guidelines

---

## 1. Visión y Definición Funcional

El **Módulo Pediátrico de NutriaAgente** permite a familias planificar menús semanales equilibrados, seguros y sabrosos adaptados con rigor clínico a la edad de sus hijos (desde los 6 meses de vida hasta la adolescencia).

### Principios Fundamentales ("Cosas básicas que nunca se le hacen a un niño"):
1. **Seguridad Absoluta contra la Asfixia (Atragantamiento):**
   - Cero frutos secos enteros antes de los 5 años (solo en crema 100% o molidos en harina fina).
   - Corte longitudinal en cuatro partes (cuartos) para uvas, tomates cherry y salchichas.
2. **Exclusión de Soja y Derivados (< 7 años):**
   - Siguiendo las directivas pediátricas y endocrinológicas, se evita la soja concentrada, bebidas de soja, salsa de soja y tofu antes de los 7 años para respetar la maduración hormonal.
3. **Cero Miel en Menores de 1 Año:**
   - Prevención estricta del botulismo del lactante causado por esporas de *Clostridium botulinum*.
4. **Cero Sal y Azúcar Añadidos (< 1 año):**
   - Protección de la función renal glomerular inmadura y preservación del umbral natural del sabor.
5. **Cocción 100% Completa:**
   - Cero carnes, pescados ni huevos crudos o poco hechos (prevención de Salmonella y Síndrome Urémico Hemolítico SUH por *E. coli*).
6. **Lácteos 100% Pasteurizados:**
   - Cero leche cruda o quesos de leche no pasteurizada (prevención de Listeriosis y Brucelosis).
7. **Pescados sin Metilmercurio:**
   - Exclusión de pez espada (emperador), atún rojo, tiburón/cazón y lucio en niños pequeños.

---

## 2. Épicas del Backlog

- **[EPIC-01] Gestión de Perfiles y Segmentación por Edad Infantil:** Selector granular de etapas pediátricas desde los 6 meses (inicio de sólidos) hasta los 12+ años con adaptación de porciones y estilo alimentario (BLW, papillas o familiar).
- **[EPIC-02] Matriz de Seguridad Clínica y Exclusiones Toxicológicas:** Reglas automáticas de exclusión para botulismo (miel <1 año), metales pesados (pescados grandes <10 años), exceso de nitratos y sobrecarga renal.
- **[EPIC-03] Restricción Temprana de Soja y Fitoestrógenos (< 7 años):** Protocolo estricto para excluir soja, bebidas de soja, salsas y derivados no fermentados en menores de 7 años.
- **[EPIC-04] Adaptación de Texturas y Prevención de Asfixia Mecánica:** Directivas de corte seguro y transformación de frutos secos a cremas/harinas para < 5 años.
- **[EPIC-05] Lista de Compras Pediátrica y Etiquetado Preventivo:** Generación de lista de ingredientes aptos por supermercado con notas de seguridad.
- **[EPIC-06] Asistente de Consulta y Validación Pediátrica en Tiempo Real:** Explicaciones claras en el visor del menú sobre por qué ciertos ingredientes fueron adaptados.

---

## 3. Historias de Usuario (User Stories & Gherkin Acceptance Criteria)

### [US-PED-001] Selector de Edad Infantil Granular desde los 6 meses
- **Épica:** EPIC-01
- **Prioridad:** MUST | **Story Points:** 5 | **Estado:** IMPLEMENTADO
- **Historia:** Como madre/padre planificando el menú del hogar, quiero seleccionar en el formulario la edad exacta de mi hijo (6-12m, 1-2a, 2-3a, 3-5a, 5-7a, 7-12a, 12+a), para que el menú generado aplique automáticamente los requerimientos nutricionales y restricciones clínicas de su edad.
- **Criterios de Aceptación:**
  ```gherkin
  GIVEN el usuario activa la opción de nutrición infantil en el formulario
  WHEN selecciona el rango de edad deseado (p. ej. "6 a 12 meses" o "5 a 7 años")
  THEN el sistema carga dinámicamente las directivas clínicas y advertencias de seguridad correspondientes.
  AND permite seleccionar el estilo de alimentación (BLW / Papillas / Mixto) para lactantes y primera infancia.
  ```

### [US-PED-002] Exclusión Automática de Soja y Derivados en Menores de 7 Años
- **Épica:** EPIC-03
- **Prioridad:** MUST | **Story Points:** 5 | **Estado:** IMPLEMENTADO
- **Historia:** Como NutriChef IA y Profesional de la Salud, quiero bloquear automáticamente la inclusión de soja, tofu, bebidas de soja, salsa de soja y edamame en planes para niños < 7 años, para proteger el equilibrio endocrinológico infantil y evitar sobreexposición a isoflavonas y fitatos.
- **Criterios de Aceptación:**
  ```gherkin
  GIVEN un perfil infantil configurado con edad menor a 7 años (6-12m, 1-2a, 2-3a, 3-5a, 5-7a)
  WHEN se genera el menú semanal o se sustituye una comida individual
  THEN ninguna receta incluirá soja, harina de soja, bebida vegetal de soja, tofu ni salsa de soja
  AND las fuentes proteicas se derivarán de legumbres locales (lentejas, garbanzos), huevos, pollo, pescados blancos o lácteos pasteurizados.
  ```

### [US-PED-003] Bloqueo Estricto de Miel en Menores de 1 Año (Prevención de Botulismo)
- **Épica:** EPIC-02
- **Prioridad:** MUST | **Story Points:** 3 | **Estado:** IMPLEMENTADO
- **Historia:** Como Sistema de Seguridad Alimentaria, quiero verificar que ninguna receta, postre o snack para lactantes de 6-12 meses contenga miel cruda, cocida ni procesada, para prevenir el botulismo del lactante por esporas de Clostridium botulinum.
- **Criterios de Aceptación:**
  ```gherkin
  GIVEN un bebé de 6 a 12 meses
  WHEN se evalúan los ingredientes de las recetas y meriendas
  THEN el sistema prohíbe de forma absoluta cualquier tipo de miel o endulzante derivado
  AND muestra una alerta explícita de seguridad toxicológica en el resumen pediátrico.
  ```

### [US-PED-004] Exclusión de Sal Añadida y Azúcar en Lactantes (0 Sal / 0 Azúcar)
- **Épica:** EPIC-02
- **Prioridad:** MUST | **Story Points:** 3 | **Estado:** IMPLEMENTADO
- **Historia:** Como padre/madre de un lactante, quiero asegurar que todas las recetas de 6 a 12 meses se preparen con 0 sal añadida y 0 azúcares refinados/edulcorantes, para proteger los riñones inmaduros y desarrollar un paladar saludable.
- **Criterios de Aceptación:**
  ```gherkin
  GIVEN un lactante de 6-12 meses
  WHEN se redactan las instrucciones de preparación
  THEN se especifica expresamente cocinar sin sal agregada
  AND se potencian los sabores mediante hierbas aromáticas suaves (orégano, albahaca, laurel).
  ```

### [US-PED-005] Protocolo Anti-Atragantamiento para Frutos Secos y Alimentos Esféricos (< 5 años)
- **Épica:** EPIC-04
- **Prioridad:** MUST | **Story Points:** 5 | **Estado:** IMPLEMENTADO
- **Historia:** Como cuidador de niños pequeños, quiero instruir el consumo de frutos secos exclusivamente molidos o en crema 100%, y corte longitudinal en 4 de uvas/tomates cherry, para eliminar el riesgo de asfixia mecánica.
- **Criterios de Aceptación:**
  ```gherkin
  GIVEN un niño menor de 5 años (6-12m, 1-2a, 2-3a, 3-5a)
  WHEN la receta incluye frutos secos (nueces, almendras, cacahuetes)
  THEN el ingrediente se nombra expresamente como "crema 100% de fruto seco" o "harina/polvo de fruto seco molido"
  AND en caso de uvas o tomates cherry, se indica en el paso "cortar longitudinalmente en cuatro trozos a lo largo".
  ```

### [US-PED-006] Restricción de Pescados con Alto Contenido de Metilmercurio (< 10 años)
- **Épica:** EPIC-02
- **Prioridad:** MUST | **Story Points:** 3 | **Estado:** IMPLEMENTADO
- **Historia:** Como planificador nutricional, quiero excluir automáticamente pez espada (emperador), atún rojo, tiburón (cazón) y lucio en niños, para salvaguardar el desarrollo neurocognitivo contra el metilmercurio.
- **Criterios de Aceptación:**
  ```gherkin
  GIVEN un niño en rango de 6 meses a 10 años
  WHEN se seleccionan recetas con pescado
  THEN solo se asignan pescados blancos o azules pequeños (salmón, sardina, boquerón, caballa)
  AND los grandes depredadores quedan excluidos de la lista de compras y menús.
  ```

### [US-PED-007] Cocción Completa 100% de Carnes y Huevos (Prevención de SUH y Salmonella)
- **Épica:** EPIC-02
- **Prioridad:** MUST | **Story Points:** 3 | **Estado:** IMPLEMENTADO
- **Historia:** Como familia con niños, quiero que todas las recetas indiquen cocción completa hasta el centro del alimento, para evitar el Síndrome Urémico Hemolítico y salmonelosis.
- **Criterios de Aceptación:**
  ```gherkin
  GIVEN cualquier menú con perfil infantil activo
  WHEN se preparan carnes picadas, pollo o tortillas
  THEN las instrucciones enfatizan cocinar completamente hasta el centro
  AND no se sugieren mayonesas caseras con huevo crudo ni carpaccios.
  ```

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
