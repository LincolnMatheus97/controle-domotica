from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .base import Base

class Acao(Base):
    __tablename__ = "acoes"
    
    id = Column(Integer, primary_key=True, index=True)
    acao = Column(Boolean, nullable=False)  # "ligar" -> true, "desligar" -> false
    intervalo_segundos = Column(Integer, nullable=True)  # Delay antes de executar
    ordem = Column(Integer, nullable=False)  # Ordem de execução na cena
    dispositivo_id = Column(Integer, ForeignKey("dispositivos.id"), nullable=False)
    cena_id = Column(Integer, ForeignKey("cenas.id"), nullable=False)
    
    # Relacionamentos
    dispositivo = relationship("Dispositivo", back_populates="acoes")
    cena = relationship("Cena", back_populates="acoes")
    
    def __repr__(self):
        return f"<Acao(id={self.id}, acao='{self.acao}', ordem={self.ordem})>"
