from sqlalchemy.orm import Session
from app.models.acao import Acao

class AcaoService:
    """Classe que representa uma ação."""

    def __init__(self, db: Session):
        self.db = db

    def criar_acao(self, acao: str, idCena: int, idDispositivo: int, ordem: int, intervaloSegundos: int) -> Acao:
        acao = Acao(acao=acao,ordem=ordem,intervalo_segundos= intervaloSegundos, id_dispositivo=idDispositivo, id_cena=idCena)
        self.db.add(acao)
        self.db.commit()
        self.db.refresh(acao)
        return acao