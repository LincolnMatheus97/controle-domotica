from sqlalchemy.orm import Session
from app.models.comodo import Comodo
from app.models.dispositivo import Dispositivo
from typing import List

class ComodoService:
    """Classe que representa um cômodo."""

    def __init__(self,db: Session):
        self.db = db

    def criar_comodo(self, nome: str) -> Comodo:
        comodo = Comodo(nome=nome)
        self.db.add(comodo)
        self.db.commit()
        self.db.refresh(comodo)
        return comodo
        
        