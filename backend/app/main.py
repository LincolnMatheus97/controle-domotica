# Importações necessárias para a aplicação FastAPI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Importa os roteadores de API para diferentes entidades
from app.api.endpoints import comodo_router, dispositivo_router, cena_router, acao_router
# Importa a função de inicialização do banco de dados
from app.database.database import init_db
# Importa uvicorn para rodar o servidor web
import uvicorn
# Importa FileResponse para servir arquivos estáticos
from fastapi.responses import FileResponse
# Importa StaticFiles para montar diretórios de arquivos estáticos
from fastapi.staticfiles import StaticFiles
# Importa os para interagir com o sistema operacional
import os

# Função de ciclo de vida da aplicação FastAPI
# Executada ao iniciar e ao desligar a aplicação
async def lifespan(app: FastAPI):
    # Inicializa o banco de dados ao iniciar a aplicação
    init_db()  
    yield  # Startup concluído
    

# Criar a aplicação FastAPI
app = FastAPI(
    title="Sistema de Controle Domótico", # Título da documentação da API
    docs_url="/docs",  # URL para a documentação interativa (Swagger UI)
    redoc_url="/redoc", # URL para a documentação alternativa (ReDoc)
    lifespan=lifespan # Define a função de ciclo de vida para a aplicação
)
# Configuração do middleware CORS (Cross-Origin Resource Sharing)
# Resolução de problemas de conexão de diferentes aplicações
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permite todas as origens
    allow_credentials=False, # Não permite credenciais (cookies, cabeçalhos de autorização)
    allow_methods=["*"], # Permite todos os métodos HTTP (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"], # Permite todos os cabeçalhos HTTP
)

# Incluindo as rotas da API para cada recurso
# As rotas são prefixadas com "/api" e tagueadas para organização na documentação
app.include_router(comodo_router, prefix="/api", tags=["comodos"])
app.include_router(dispositivo_router, prefix="/api", tags=["dispositivos"])
app.include_router(cena_router, prefix="/api", tags=["cenas"])
app.include_router(acao_router, prefix="/api", tags=["acoes"])

# Montar arquivos estáticos do frontend
app.mount("/assets", StaticFiles(directory="../frontend/assets"), name="assets")

# Endpoint básico para a raiz da aplicação
# Retorna o arquivo index.html do frontend
@app.get("/")
def root():
    return FileResponse("../frontend/index.html")

# Endpoint de saúde da API
# Usado para verificar se a API está funcionando corretamente
@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Bloco de execução principal
# Para executar diretamente: python main.py
if __name__ == "__main__":
    
    # Verifica se a aplicação está rodando em um ambiente Docker
    is_docker = os.environ.get('DOCKER_ENV', False)
    
    # Configura o servidor Uvicorn com base no ambiente
    if is_docker:
        # Em ambiente Docker, o host é 0.0.0.0 e o reload é desativado
        uvicorn.run("app.main:app", host="0.0.0.0", port=80)
    else:
        # Fora do Docker, o host é 0.0.0.0, a porta é 8000 e o reload é ativado para desenvolvimento
        uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
