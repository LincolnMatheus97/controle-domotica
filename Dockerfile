FROM python:3.12-slim

WORKDIR /app

# Copiar e instalar dependências  
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

# Copiar código
COPY backend/ backend/
COPY frontend/ frontend/

# Criar pasta dados
RUN mkdir -p backend/data

# Variáveis ambiente
ENV PYTHONPATH=/app/backend
ENV DOCKER_ENV=true

WORKDIR /app/backend

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
