# 🥗 Nutriagente Semanal - Python (FastAPI) + React (TypeScript)

Planificador inteligente de menús semanales adaptado a la localización geográfica, catálogo de supermercados, nutrición pediátrica, modo fit y análisis de documentos clínicos con **Google Gemini AI**.

---

## 🚀 Arquitectura Dual (Python FastAPI + Node/TypeScript)

El repositorio incluye soporte nativo para ejecutarse tanto en **Python (FastAPI)** como en **Node.js (Express + Vite)**:

- **Backend Python**: `main.py` (FastAPI + Google GenAI SDK).
- **Frontend**: `src/` (React + Tailwind CSS + Lucide Icons + Vite).
- **Dependencias Python**: `requirements.txt`.
- **Contenedor**: `Dockerfile`.

---

## 🛠️ Ejecución Local con Python (FastAPI)

### 1. Requisitos Previos
- Python 3.10+
- Node.js 18+ (para compilar la interfaz de React)

### 2. Configuración de Variables de Entorno
Crea o edita tu archivo `.env` en la raíz:

```env
GEMINI_API_KEY=tu_api_key_de_gemini
PORT=8000
```

### 3. Instalar Dependencias de Python
```bash
# Crear y activar entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar librerías
pip install -r requirements.txt
```

### 4. Compilar el Frontend React
```bash
npm install
npm run build
```

### 5. Iniciar el Servidor FastAPI
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Abre tu navegador en: `http://localhost:8000` (o consulta la documentación interactiva Swagger en `http://localhost:8000/docs`).

---

## 🐳 Ejecución con Docker

Puedes construir y desplegar la aplicación completa en un solo comando:

```bash
docker build -t nutriagente-semanal .
docker run -p 8000:8000 -e GEMINI_API_KEY=tu_api_key nutriagente-semanal
```

---

## 📌 Endpoints de la API FastAPI

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/health` | Estado del servidor y conexión con Gemini |
| `POST` | `/api/generate-plan` | Genera el menú de 7 días, lista de compras y desglose |
| `POST` | `/api/regenerate-meal` | Regenera una receta individual manteniendo macronutrientes |
| `POST` | `/api/analyze-diet-document` | Analiza pautas médicas/dietas en PDF o texto |
