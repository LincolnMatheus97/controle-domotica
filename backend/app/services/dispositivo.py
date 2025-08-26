from sqlalchemy.orm import Session
from app.models.dispositivo import Dispositivo
from typing import List

class DispositivoService:
    """Classe que representa um dispositivo."""

    def __init__(self, db: Session):
        self.db = db

    def criar_dispositivo(self, Nome: str, Estado: bool = False, idComodo: int = None) -> Dispositivo:
        dispositivo = Dispositivo(nome=Nome, estado=Estado, id_comodo=idComodo)
        self.db.add(dispositivo)
        self.db.commit()
        self.db.refresh(dispositivo)
        return dispositivo
    
    def buscar_dispositivo(self, id: int) -> Dispositivo:
        dispositivo = self.db.query(Dispositivo).filter(Dispositivo.id == id).first()
        if not dispositivo:
            raise ValueError("Dispositivo não encontrado.")
        return dispositivo
        
    def atualizar_dispositivo(self, id: int, nome: str) -> Dispositivo:
        dispositivo = self.buscar_dispositivo(id)
        dispositivo.nome = nome
        self.db.commit()
        self.db.refresh(dispositivo)
        return dispositivo
    
    def deletar_dispositivo(self, id: int) -> bool:
        dispositivo = self.buscar_dispositivo(id)
        self.db.delete(dispositivo)
        self.db.commit()  
        return True
    
    def listar_dispositivo(self) -> List[Dispositivo]:
        return self.db.query(Dispositivo).all()
    
    def ativar_dispositivo(self, id: int) -> bool:
        dispositivo = self.buscar_dispositivo(id)
        dispositivo.estado = True
        self.db.commit(dispositivo)
        self.db.refresh()
        return True


    
