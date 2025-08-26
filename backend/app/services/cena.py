from sqlalchemy.orm import Session
from app.models.cena import Cena
from app.models.acao import Acao
from typing import List, Optional
import time

class CenaService:
    """Service para gerenciar a lógica de negócio das cenas."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def criar_cena(self, nome: str, ativo: bool = True) -> Cena:
        """Cria uma nova cena"""
        cena = Cena(nome=nome, ativo=ativo)
        self.db.add(cena)
        self.db.commit()
        self.db.refresh(cena)
        return cena
    
