from fastapi import FastAPI
from app.database import create_tables
from app.api.endpoints import comodo_router, dispositivo_router, cena_router, acao_router

# Criar a aplicação FastAPI
app = FastAPI()

# Incluindo as rotas
app.include_router(comodo_router, prefix="/api", tags=["comodos"])
app.include_router(dispositivo_router, prefix="/api", tags=["dispositivos"])
app.include_router(cena_router, prefix="/api", tags=["cenas"])
app.include_router(acao_router, prefix="/api", tags=["acoes"])

# Criar as tabelas no startup
@app.on_event("startup")
def startup():
    create_tables()

# Endpoint básico
@app.get("/")
def root():
    return {"message": "API Domótica funcionando!"}
