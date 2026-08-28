# 🥗 Nutriagente Semanal - AI-Powered Weekly Meal & Grocery Planner (Python / FastAPI)

**Nutriagente Semanal** is a production-grade full-stack nutrition and grocery planning application powered by **Python (FastAPI)** and the official **Google GenAI SDK (Gemini Flash / Pro)**, coupled with a high-performance **React & Tailwind CSS** frontend.

The application generates comprehensive, culturally localized 7-day nutritional meal plans tailored to specific regional supermarket chains, exact dietary requirements (Fit macros, Vegan, Keto, Celiac, Mediterranean), clinical pediatric nutrition protocols, and medical dietary documents.

---

## 🏛️ System Architecture

The application is architected around a modern decoupled client-server pattern optimized for high availability, AI fallback resilience, and fast latency:

```
┌─────────────────────────────────────────────────────────────┐
│                    React Client (SPA)                       │
│  - Interactive 7-day meal schedule & meal swap engine       │
│  - Dynamic smart grocery checklist & budget visualizer      │
│  - Medical diet document uploader & Fit macro calculator    │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON REST API
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               Python Backend (FastAPI / Uvicorn)            │
│  - Request validation & Pydantic schema enforcement         │
│  - Multi-tier Gemini model failover (Flash 2.5 / 3.1 Lite)  │
│  - Pediatric safety compliance & Choking prevention rules   │
│  - Supermarket inventory & regional pricing engine          │
└──────────────────────────────┬──────────────────────────────┘
                               │ Official GenAI SDK
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Google Gemini AI Models                   │
│   (Structured JSON Output with schema & fallback safety)    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Source Code & Directory Structure

```plaintext
├── main.py                     # Primary Python FastAPI application & REST endpoints
├── requirements.txt            # Python dependencies (FastAPI, Google GenAI SDK, Pydantic)
├── Dockerfile                  # Container build file for Python backend + React static build
├── .env.example                # Environment variable configuration template
├── README.md                   # Project documentation & architectural guide
│
├── src/                        # React Frontend Source Code
│   ├── App.tsx                 # Core application controller & layout
│   ├── components/             # Reusable UI components
│   │   ├── Header.tsx          # Navigation, brand bar, and action triggers
│   │   ├── MenuForm.tsx        # Planner configuration & preference settings
│   │   ├── MenuViewer.tsx      # Weekly meal grid, meal card details, and swaps
│   │   ├── ShoppingListViewer.tsx # Interactive categorised grocery list
│   │   ├── CostBreakdown.tsx   # Budget optimization and supermarket pricing
│   │   ├── FitCalculatorModal.tsx # Macronutrient & caloric target calculator
│   │   └── DietDocUploadModal.tsx # Clinical diet analysis uploader
│   ├── data/                   # Supermarket catalogs & localized currency presets
│   ├── types.ts                # Shared TypeScript data interfaces
│   └── utils/                  # PDF export and formatting utilities
│
├── index.html                  # HTML entry point
├── package.json                # Frontend build tooling configuration
├── tsconfig.json               # TypeScript compiler rules
└── vite.config.ts              # Vite bundling configuration
```

---

## ⚙️ Backend Implementation Highlights (`main.py`)

### 1. Robust AI Resilience & Model Fallback
The Python backend uses a multi-tier fallback pipeline with automatic retries and exponential backoff to handle transient API demand surges (e.g., `503 Service Unavailable`, `429 Resource Exhausted`):

```python
def generate_gemini_content(prompt: str, models: List[str] = None) -> Optional[str]:
    if models is None:
        models = ["gemini-2.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.7-flash"]
    
    for model in models:
        for attempt in range(2):
            try:
                response = genai_client.models.generate_content(
                    model=model,
                    contents=prompt,
                    config=dict(response_mime_type="application/json")
                )
                if response and response.text:
                    return response.text
            except Exception as e:
                # Automatic transient retry with latency backoff
                ...
```

### 2. Clinical Pediatric & Dietary Guardrails
- **Pediatric Safety**: Automatically injects age-based consistency rules (BLW finger-food safety vs. smooth purees), enforces zero added sugar/salt under 2 years, prevents high-mercury fish, and ensures strict circular food cuts (e.g., grapes, cherry tomatoes).
- **Macro Precision**: Tailors daily protein, carbohydrate, and lipid balances to exact target goals (Bulking, Cutting, Maintenance) with per-meal splits.

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** (for building the React frontend bundle)
- A **Google Gemini API Key** (obtainable from [Google AI Studio](https://aistudio.google.com/))

### 1. Clone & Set Environment Variables
```bash
git clone https://github.com/your-username/nutriagente-semanal.git
cd nutriagente-semanal

cp .env.example .env
# Open .env and insert your GEMINI_API_KEY:
# GEMINI_API_KEY=your_actual_gemini_api_key
```

### 2. Set Up the Python Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install required Python packages
pip install -r requirements.txt
```

### 3. Build the Frontend Assets
```bash
npm install
npm run build
```

### 4. Run the FastAPI Server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- Access the web application: [http://localhost:8000](http://localhost:8000)
- Interactive OpenAPI Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Alternative ReDoc documentation: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 📡 REST API Reference

### `GET /api/health`
Health check and Gemini SDK readiness probe.

### `POST /api/generate-plan`
Generates a complete 7-day personalized meal plan, categorized shopping checklist, and localized cost breakdown.
- **Payload (`PlannerInput`)**: People count, country, supermarket chain, dietary preferences, fit macros, pediatric configuration.

### `POST /api/regenerate-meal`
Generates an alternative single dish respecting the user's macronutrient targets and dietary exclusions without modifying the rest of the week.

### `POST /api/analyze-diet-document`
Extracts calorie/macro requirements and clinical restrictions from uploaded PDF or text nutrition guidelines.

---

## 🐳 Docker Deployment

To build and run the complete application inside a self-contained container:

```bash
# Build the Docker image
docker build -t nutriagente-semanal .

# Run the container
docker run -p 8000:8000 -e GEMINI_API_KEY="your_api_key_here" nutriagente-semanal
```

---

## 📄 License

This project is licensed under the MIT License.
