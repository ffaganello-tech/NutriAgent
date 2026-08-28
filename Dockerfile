# Nutriagente Semanal - Python Backend + React Frontend Dockerfile
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Copy package files and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy package.json and build the React SPA frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Expose port
EXPOSE 8000

# Environment settings
ENV PORT=8000
ENV PYTHONUNBUFFERED=1

# Run FastAPI server serving both API and compiled React frontend
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
