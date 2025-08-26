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
    
    def buscar_cena(self, id: int) -> Cena:
        cena = self.db.query(Cena).filter(Cena.id == id).first()
        if not cena:
            raise ValueError("Cena não encontrado.")
        return cena
        
    def atualizar_cena(self, id: int, nome: str) -> Cena:
        cena = self.buscar_cena(id)
        cena.nome = nome
        self.db.commit()
        self.db.refresh(cena)
        return cena
    
    def deletar_cena(self, id: int) -> bool:
        cena = self.buscar_cena(id)
        self.db.delete(cena)
        self.db.commit()  
        return True
    
    def listar_cena(self) -> List[Cena]:
        return self.db.query(Cena).all()
    
    def ativar_cena(self, id: int) -> bool:
        cena = self.buscar_cena(id)
        cena.ativo = True
        self.db.commit(cena)
        self.db.refresh()
        return True

    # Faltam algumas coisas 

    
