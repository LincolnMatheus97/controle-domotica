# Importa os tipos de coluna do SQLAlchemy.
from sqlalchemy import Column, Integer, String, Boolean
# Importa o relationship para definir relacionamentos entre modelos.
from sqlalchemy.orm import relationship
# Importa a base declarativa.
from .base import Base

class Cena(Base):
    """Representa uma cena, que é um conjunto de ações a serem executadas em sequência."""
    # Define o nome da tabela no banco de dados.
    __tablename__ = "cenas"
    
    # Define as colunas da tabela.
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False, unique=True) # Nome da cena.
    ativa = Column(Boolean, default=True) # Indica se a cena está ativa ou não.

    # Define o relacionamento com as ações da cena.
    acoes = relationship("Acao", back_populates="cena", cascade="all, delete-orphan")
    
    # Representação em string do objeto Cena.
    def __repr__(self):
        return f"<Cena(id={self.id}, nome='{self.nome}', ativa={self.ativa})>"
