from sqlalchemy.orm import Session
from app.models.dispositivo import Dispositivo

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


    
