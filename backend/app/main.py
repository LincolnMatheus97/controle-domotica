from fastapi import FastAPI
from app.api.endpoints import comodo_router, dispositivo_router, cena_router, acao_router
from app.database.database import init_db
import uvicorn

# Criar a aplicação FastAPI
app = FastAPI(
    title="Sistema de Controle Domótico",
    docs_url="/docs",  # Swagger 
    redoc_url="/redoc"  
)

# Incluindo as rotas
app.include_router(comodo_router, prefix="/api", tags=["comodos"])
app.include_router(dispositivo_router, prefix="/api", tags=["dispositivos"])
app.include_router(cena_router, prefix="/api", tags=["cenas"])
app.include_router(acao_router, prefix="/api", tags=["acoes"])

# Criar as tabelas no startup
@app.on_event("startup")
def startup_event():
    init_db()

# Endpoint básico
@app.get("/")
def root():
    return {"message": "API Domótica funcionando!"}

# Endpoint de saúde da API
@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Para executar diretamente: python main.py
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
