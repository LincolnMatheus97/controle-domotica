from sqlalchemy.orm import Session
from app.models.comodo import Comodo
from app.models.dispositivo import Dispositivo
from typing import List

class ComodoService:
    """Classe que representa um cômodo."""

    # Inicializa o serviço de cômodo com uma sessão de banco de dados.
    def __init__(self,db: Session):
        self.db = db

    # Cria um novo cômodo no banco de dados.
    def criar_comodo(self, nome: str) -> Comodo:
        # Verifica se o nome do comodo já existe antes de criar
        comodo_existente = self.db.query(Comodo).filter(Comodo.nome == nome).first()
        if comodo_existente:
            raise ValueError("Erro ao criar cômodo.")
        
        comodo = Comodo(nome=nome)
        self.db.add(comodo)
        self.db.commit()
        self.db.refresh(comodo)
        return comodo

    # Busca um cômodo pelo seu ID.
    def buscar_comodo(self, id: int) -> Comodo:
        comodo = self.db.query(Comodo).filter(Comodo.id == id).first()
        if not comodo:
            raise ValueError("Cômodo não encontrado.")
        return comodo
        
    # Atualiza as informações de um cômodo existente.
    def atualizar_comodo(self, id: int, nome: str) -> Comodo:
        comodo = self.buscar_comodo(id)
        comodo.nome = nome
        self.db.commit()
        self.db.refresh(comodo)
        return comodo
    
    # Deleta um cômodo do banco de dados.
    def deletar_comodo(self, id: int) -> bool:
        comodo = self.buscar_comodo(id)
        self.db.delete(comodo)
        self.db.commit()  
        return True
    
    # Lista todos os cômodos cadastrados.
    def listar_comodo(self) -> List[Comodo]:
        return self.db.query(Comodo).all()
        