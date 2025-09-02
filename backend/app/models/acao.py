# Importa os tipos de coluna e ForeignKey do SQLAlchemy.
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
# Importa o relationship para definir relacionamentos entre modelos.
from sqlalchemy.orm import relationship
# Importa a base declarativa.
from .base import Base

class Acao(Base):
    """Representa uma ação a ser executada em um dispositivo dentro de uma cena."""
    # Define o nome da tabela no banco de dados.
    __tablename__ = "acoes"
    
    # Define as colunas da tabela.
    id = Column(Integer, primary_key=True, index=True)
    acao = Column(Boolean, nullable=False)  # Define a ação: True para "ligar", False para "desligar".
    intervalo_segundos = Column(Integer, nullable=True)  # Atraso em segundos antes de executar a ação.
    ordem = Column(Integer, nullable=False)  # Sequência de execução da ação na cena.
    dispositivo_id = Column(Integer, ForeignKey("dispositivos.id"), nullable=False)
    cena_id = Column(Integer, ForeignKey("cenas.id"), nullable=False)
    
    # Define os relacionamentos com outros modelos.
    # Relacionamento com Dispositivo: uma ação está associada a um dispositivo.
    dispositivo = relationship("Dispositivo", back_populates="acoes")
    # Relacionamento com Cena: uma ação pertence a uma cena.
    cena = relationship("Cena", back_populates="acoes")
    
    # Representação em string do objeto Acao.
    def __repr__(self):
        return f"<Acao(id={self.id}, acao='{self.acao}', ordem={self.ordem})>"