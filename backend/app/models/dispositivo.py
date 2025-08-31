from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class Dispositivo(Base):
    __tablename__ = "dispositivos"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False, unique = True)
    estado = Column(Boolean, default=False)
    comodo_id = Column(Integer, ForeignKey("comodos.id"), nullable=False)
    
    # Relacionamentos
    comodo = relationship("Comodo", back_populates="dispositivos")
    acoes = relationship("Acao", back_populates="dispositivo", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Dispositivo(id={self.id}, nome='{self.nome}', estado={self.estado})>"
