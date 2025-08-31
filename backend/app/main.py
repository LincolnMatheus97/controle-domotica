from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import comodo_router, dispositivo_router, cena_router, acao_router
from app.database.database import init_db
import uvicorn
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os

async def lifespan(app: FastAPI):
    init_db()  
    yield  # Startup concluído
    

# Criar a aplicação FastAPI
app = FastAPI(
    title="Sistema de Controle Domótico",
    docs_url="/docs",  # Swagger 
    redoc_url="/redoc",
    lifespan=lifespan
)
# Resolução de problemas de conexão de diferentes aplicações
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluindo as rotas
app.include_router(comodo_router, prefix="/api", tags=["comodos"])
app.include_router(dispositivo_router, prefix="/api", tags=["dispositivos"])
app.include_router(cena_router, prefix="/api", tags=["cenas"])
app.include_router(acao_router, prefix="/api", tags=["acoes"])

# Montar arquivos estáticos
app.mount("/assets", StaticFiles(directory="/app/frontend/assets"), name="assets")

# Endpoint básico
@app.get("/")
def root():
    return FileResponse("/app/frontend/index.html")

# Endpoint de saúde da API
@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Para executar diretamente: python main.py
if __name__ == "__main__":
    
    is_docker = os.environ.get('DOCKER_ENV', False)
    
    if is_docker:
        uvicorn.run("app.main:app", host="0.0.0.0", port=8000)
    else:
        uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)