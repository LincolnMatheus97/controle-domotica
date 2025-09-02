from sqlalchemy.orm import Session
from app.models.dispositivo import Dispositivo
from typing import List

class DispositivoService:
    """Service para gerenciar dispositivos."""

    # Inicializa o serviço de dispositivo com uma sessão de banco de dados.
    def __init__(self, db: Session):
        self.db = db

    # Cria um novo dispositivo no banco de dados.
    def criar_dispositivo(self, nome: str, estado: bool = False, comodo_id: int = None) -> Dispositivo:
            
        dispositivo = Dispositivo(nome=nome, estado=estado, comodo_id=comodo_id)
        if not dispositivo:
            raise ValueError("Erro ao criar dispositivo.")
        self.db.add(dispositivo)
        self.db.commit()
        self.db.refresh(dispositivo)
        return dispositivo
    
    def criar_dispositivo_no_comodo(self, comodo_id: int, nome: str, estado: bool = False) -> Dispositivo:
        """Método específico para endpoint /comodos/{comodo_id}/dispositivos"""
        return self.criar_dispositivo(nome=nome, estado=estado, comodo_id=comodo_id)
    
    # Busca um dispositivo pelo seu ID.
    def buscar_dispositivo_por_id(self, id: int) -> Dispositivo:
        dispositivo = self.db.query(Dispositivo).filter(Dispositivo.id == id).first()
        if not dispositivo:
            raise ValueError("Dispositivo não encontrado.")
        return dispositivo
    
    # Busca um dispositivo pelo seu nome.
    def buscar_dispositivo_por_nome(self, nome: str) -> Dispositivo:
        dispositivo = self.db.query(Dispositivo).filter(Dispositivo.nome == nome).first()
        if not dispositivo:
            raise ValueError("Dispositivo não encontrado.")
        return dispositivo
        
    # Atualiza as informações de um dispositivo existente.
    def atualizar_dispositivo(self, id: int, nome: str = None, estado: bool = None, comodo_id: int = None) -> Dispositivo:
        dispositivo = self.buscar_dispositivo_por_id(id)
        if nome is not None:
            dispositivo.nome = nome
        if estado is not None:
            dispositivo.estado = estado
        if comodo_id is not None:
            dispositivo.comodo_id = comodo_id
        self.db.commit()
        self.db.refresh(dispositivo)
        return dispositivo
    
    # Lista todos os dispositivos associados a um cômodo específico.
    def listar_dispositivos_por_comodo(self, comodo_id: int) -> List[Dispositivo]:
        return self.db.query(Dispositivo).filter(Dispositivo.comodo_id == comodo_id).all()
    
    # Deleta um dispositivo do banco de dados.
    def deletar_dispositivo(self, id: int) -> bool:
        dispositivo = self.buscar_dispositivo_por_id(id)
        self.db.delete(dispositivo)
        self.db.commit()
        return True
    
    # Lista todos os dispositivos cadastrados.
    def listar_dispositivo(self) -> List[Dispositivo]:
        dispositivos = self.db.query(Dispositivo).all()
        if not dispositivos:
            raise ValueError("Nenhum dispositivo encontrado.")
        return dispositivos
    
    # Ativa o estado de um dispositivo.
    def ativar_dispositivo(self, id: int) -> bool:
        dispositivo = self.buscar_dispositivo_por_id(id)
        dispositivo.estado = True
        self.db.commit()
        self.db.refresh(dispositivo)
        return True
    