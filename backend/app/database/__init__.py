from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import DATABASE_URL
from app.models.base import Base

# Criar engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})

# Session local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency para pegar a sessão do banco
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Criar as tabelas
def create_tables():
    Base.metadata.create_all(bind=engine)
