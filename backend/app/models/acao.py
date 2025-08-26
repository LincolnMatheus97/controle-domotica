from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class Acao(Base):
    __tablename__ = "acoes"
    
    id = Column(Integer, primary_key=True, index=True)
    acao = Column(String(50), nullable=False)  # Ex: "ligar", "desligar", "dimmer_50"
    intervalo_segundos = Column(Integer, nullable=True)  # Delay antes de executar
    ordem = Column(Integer, nullable=False)  # Ordem de execução na cena
    id_dispositivo = Column(Integer, ForeignKey("dispositivos.id"), nullable=False)
    id_cena = Column(Integer, ForeignKey("cenas.id"), nullable=False)
    
    # Relacionamentos
    dispositivo = relationship("Dispositivo", back_populates="acoes")
    cena = relationship("Cena", back_populates="acoes")
    
    def __repr__(self):
        return f"<Acao(id={self.id}, acao='{self.acao}', ordem={self.ordem})>"
