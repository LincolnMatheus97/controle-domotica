# Importa os tipos de coluna e ForeignKey do SQLAlchemy.
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
# Importa o relationship para definir relacionamentos entre modelos.
from sqlalchemy.orm import relationship
# Importa a base declarativa.
from .base import Base

# Define o modelo Dispositivo que herda da Base.
class Dispositivo(Base):
    # Define o nome da tabela no banco de dados.
    __tablename__ = "dispositivos"
    
    # Define as colunas da tabela.
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    estado = Column(Boolean, default=False)
    comodo_id = Column(Integer, ForeignKey("comodos.id"), nullable=False)
    
    # Define os relacionamentos com outros modelos.
    # Relacionamento com Comodo: um dispositivo pertence a um cômodo.
    comodo = relationship("Comodo", back_populates="dispositivos")
    # Relacionamento com Acao: um dispositivo pode ter várias ações associadas.
    acoes = relationship("Acao", back_populates="dispositivo", cascade="all, delete-orphan")
    
    # Representação em string do objeto Dispositivo.
    def __repr__(self):
        return f"<Dispositivo(id={self.id}, nome='{self.nome}', estado={self.estado})>"
