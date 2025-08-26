from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from .base import Base

class Cena(Base):
    __tablename__ = "cenas"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    ativo = Column(Boolean, default=True)

    acoes = relationship("Acao", back_populates="cena", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Cena(id={self.id}, nome='{self.nome}', ativo={self.ativo})>"
