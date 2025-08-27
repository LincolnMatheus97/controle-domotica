from sqlalchemy.orm import Session
from app.models.acao import Acao
from typing import List, Optional

class AcaoService:
    """Service para gerenciar ações."""

    def __init__(self, db: Session):
        self.db = db

    def criar_acao(self, acao: str, dispositivo_id: int, cena_id: int, ordem: int, intervalo_segundos: int = None) -> Acao:
        nova_acao = Acao(
            acao=acao,
            ordem=ordem,
            intervalo_segundos=intervalo_segundos, 
            dispositivo_id=dispositivo_id, 
            cena_id=cena_id
        )
        self.db.add(nova_acao)
        self.db.commit()
        self.db.refresh(nova_acao)
        return nova_acao
    
    def criar_acao_na_cena(self, cena_id: int, dispositivo_id: int, acao: str, ordem: int, intervalo_segundos: int = None) -> Acao:
        """Método específico para endpoint /cenas/{cena_id}/acoes"""
        return self.criar_acao(
            acao=acao,
            dispositivo_id=dispositivo_id,
            cena_id=cena_id,
            ordem=ordem,
            intervalo_segundos=intervalo_segundos
        )
    
    def buscar_acao(self, id: int) -> Acao:
        acao = self.db.query(Acao).filter(Acao.id == id).first()
        if not acao:
            raise ValueError("Ação não encontrada.")
        return acao
        
    def atualizar_acao(self, id: int, acao: str = None, dispositivo_id: int = None, 
                      cena_id: int = None, ordem: int = None, intervalo_segundos: int = None) -> Acao:
        acao_obj = self.buscar_acao(id)
        if acao is not None:
            acao_obj.acao = acao
        if dispositivo_id is not None:
            acao_obj.dispositivo_id = dispositivo_id
        if cena_id is not None:
            acao_obj.cena_id = cena_id
        if ordem is not None:
            acao_obj.ordem = ordem
        if intervalo_segundos is not None:
            acao_obj.intervalo_segundos = intervalo_segundos
        self.db.commit()
        self.db.refresh(acao_obj)
        return acao_obj
    
    def listar_acoes_por_cena(self, cena_id: int) -> List[Acao]:
        return self.db.query(Acao).filter(Acao.cena_id == cena_id).order_by(Acao.ordem).all()
    
    def deletar_acao(self, id: int) -> bool:
        acao = self.buscar_acao(id)
        self.db.delete(acao)
        self.db.commit()
        return True
    
    def deletar_acao(self, id: int) -> bool:
        acao = self.buscar_acao(id)
        self.db.delete(acao)
        self.db.commit()  
        return True
    
    def listar_acao(self) -> List[Acao]:
        return self.db.query(Acao).all()