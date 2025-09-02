# Importa os tipos de coluna do SQLAlchemy.
from sqlalchemy import Column, Integer, String
# Importa o relationship para definir relacionamentos entre modelos.
from sqlalchemy.orm import relationship
# Importa a base declarativa.
from .base import Base

class Comodo(Base):
    """Representa um cômodo da casa, como sala, quarto, cozinha, etc."""
    # Define o nome da tabela no banco de dados.
    __tablename__ = "comodos"
    
    # Define as colunas da tabela.
    id = Column(Integer, primary_key=True, index=True)
    # Nome do cômodo.
    nome = Column(String(100), nullable=False, unique=True)

    # Define o relacionamento com os dispositivos do cômodo.
    dispositivos = relationship("Dispositivo", back_populates="comodo", cascade="all, delete-orphan")
    
    # Representação em string do objeto Comodo.
    def __repr__(self):
        return f"<Comodo(id={self.id}, nome='{self.nome}')>"
