# app/database/database.py

# Importa as classes necessárias do SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
# Importa Generator para tipagem
from typing import Generator
# Importa a URL do banco de dados da configuração da aplicação
from app.config import DATABASE_URL
# Importa a Base declarativa dos modelos
from app.models import Base
# Importa os para interagir com o sistema operacional
import os

# Cria o motor do banco de dados usando a URL configurada
# O argumento connect_args é para compatibilidade com SQLite em múltiplos threads
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)
# Cria uma SessionLocal para gerenciar sessões do banco
# Configura para não fazer commit ou flush automaticamente e vincula ao motor
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Função para obter uma sessão de banco de dados
# Usada como uma dependência no FastAPI para gerenciar sessões por requisição
def get_db() -> Generator:
    # Cria uma nova sessão
    db = SessionLocal()
    try:
        # Fornece a sessão para o chamador
        yield db
    finally:
        # Garante que a sessão seja fechada após o uso
        db.close()

# Função para criar todas as tabelas no banco de dados
# Baseado nos metadados dos modelos definidos
def create_tables():
    Base.metadata.create_all(bind=engine)

# Função para dropar (excluir) todas as tabelas do banco de dados
# Cuidado: isso apaga todos os dados!
def drop_tables():
    Base.metadata.drop_all(bind=engine)

# Função para inicializar o banco de dados
# Cria o diretório 'data' se for SQLite e as tabelas não existirem
def init_db():
    # Verifica se o banco de dados é SQLite
    if "sqlite" in DATABASE_URL:
        # Extrai o caminho do arquivo do banco de dados
        db_path = DATABASE_URL.replace("sqlite:///./", "")
        # Obtém o diretório do arquivo do banco de dados
        db_dir = os.path.dirname(db_path)
        # Se houver um diretório e ele não existir, cria-o
        if db_dir and not os.path.exists(db_dir):
            os.makedirs(db_dir, exist_ok=True)
    
    # Cria todas as tabelas definidas nos modelos
    create_tables()
