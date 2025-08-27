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

    def buscar_comodo(self, id: int) -> Comodo:
        comodo = self.db.query(Comodo).filter(Comodo.id == id).first()
        if not comodo:
            raise ValueError("Cômodo não encontrado.")
        return comodo
        
    def atualizar_comodo(self, id: int, nome: str) -> Comodo:
        comodo = self.buscar_comodo(id)
        comodo.nome = nome
        self.db.commit()
        self.db.refresh(comodo)
        return comodo
    
    def deletar_comodo(self, id: int) -> bool:
        comodo = self.buscar_comodo(id)
        self.db.delete(comodo)
        self.db.commit()  
        return True
    
    def listar_comodo(self) -> List[Comodo]:
        return self.db.query(Comodo).all()
        