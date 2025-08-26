from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .base import Base

class Comodo(Base):
    __tablename__ = "comodos"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)

    dispositivos = relationship("Dispositivo", back_populates="comodo", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Comodo(id={self.id}, nome='{self.nome}')>"
