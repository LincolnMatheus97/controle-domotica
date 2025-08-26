from sqlalchemy.orm import Session
from app.models.acao import Acao
from typing import List

class AcaoService:
    """Classe que representa uma ação."""

    def __init__(self, db: Session):
        self.db = db

    def criar_acao(self, acao: str, idacao: int, idDispositivo: int, ordem: int, intervaloSegundos: int) -> Acao:
        acao = Acao(acao=acao,ordem=ordem,intervalo_segundos= intervaloSegundos, id_dispositivo=idDispositivo, id_acao=idacao)
        self.db.add(acao)
        self.db.commit()
        self.db.refresh(acao)
        return acao
    
    def buscar_acao(self, id: int) -> Acao:
        acao = self.db.query(Acao).filter(Acao.id == id).first()
        if not acao:
            raise ValueError("Acao não encontrado.")
        return acao
        
    def atualizar_acao(self, id: int, nome: str) -> Acao:
        acao = self.buscar_acao(id)
        acao.nome = nome
        self.db.commit()
        self.db.refresh(acao)
        return acao
    
    def deletar_acao(self, id: int) -> bool:
        acao = self.buscar_acao(id)
        self.db.delete(acao)
        self.db.commit()  
        return True
    
    def listar_acao(self) -> List[Acao]:
        return self.db.query(Acao).all()