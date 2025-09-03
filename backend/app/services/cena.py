from sqlalchemy.orm import Session, joinedload
from app.models.cena import Cena
from app.models.acao import Acao
from app.models.dispositivo import Dispositivo
from typing import List, Dict
import time

class CenaService:
    """Service para gerenciar a lógica de negócio das cenas."""
    
    # Inicializa o serviço de cena com uma sessão de banco de dados.
    def __init__(self, db: Session):
        self.db = db
    
    # Cria uma nova cena no banco de dados.
    def criar_cena(self, nome: str, ativa: bool = True) -> Cena:
        # Verifica se o nome da cena já existe antes de criar
        cena_existente = self.db.query(Cena).filter(Cena.nome == nome).first()
        if cena_existente:
            raise ValueError("Erro ao criar cena.")
    
        cena = Cena(nome=nome, ativa=ativa)
        self.db.add(cena)
        self.db.commit()
        self.db.refresh(cena)
        return cena
    
    # Busca uma cena pelo seu ID.
    def buscar_cena(self, id: int) -> Cena:
        cena = self.db.query(Cena).options(joinedload(Cena.acoes)).filter(Cena.id == id).first()
        if not cena:
            raise ValueError("Cena não encontrado.")
        return cena
        
    # Atualiza as informações de uma cena existente.
    def atualizar_cena(self, id: int, nome: str = None, ativa: bool = None) -> Cena:
        cena = self.buscar_cena(id)
        if nome is not None:
            cena.nome = nome
        if ativa is not None:
            cena.ativa = ativa
        self.db.commit()
        self.db.refresh(cena)
        return cena
    
    # Deleta uma cena do banco de dados.
    def deletar_cena(self, id: int) -> bool:
        cena = self.buscar_cena(id)
        self.db.delete(cena)
        self.db.commit()  
        return True
    
    # Lista todas as cenas cadastradas.
    def listar_cena(self) -> List[Cena]:
        return self.db.query(Cena).options(joinedload(Cena.acoes)).all()
    
    # Inverte o status de ativação de uma cena.
    def inverter_ativo(self, id: int) -> bool:
        cena = self.buscar_cena(id)
        cena.ativa = not cena.ativa
        self.db.commit()
        self.db.refresh(cena)
        return True
    
    def executar_cena(self, id: int) -> Dict:
        """Executa uma cena, processando todas as suas ações em ordem"""
        cena = self.buscar_cena(id)
        
        if not cena.ativa:
            raise ValueError("Cena não está ativa")
        
        acoes = self.db.query(Acao).filter(Acao.cena_id == id).order_by(Acao.ordem).all()
        
        if not acoes:
            raise ValueError("Cena não possui ações cadastradas")
        
        acoes_executadas = []
        dispositivos_realmente_afetados = set()
        
        for acao in acoes:
            # Carrega o dispositivo e seu cômodo relacionado em uma única consulta para eficiência
            dispositivo = self.db.query(Dispositivo).options(
                joinedload(Dispositivo.comodo)
            ).filter(Dispositivo.id == acao.dispositivo_id).first()
            
            if not dispositivo:
                continue

            # Cria um identificador único e descritivo para o dispositivo
            comodo_nome = dispositivo.comodo.nome if dispositivo.comodo else "Cômodo Desconhecido"
            identificador_unico = f"{dispositivo.nome} ({comodo_nome})"

            estado_anterior = dispositivo.estado
            novo_estado = acao.acao
            
            # Adiciona à lista de detalhes de qualquer forma
            acoes_executadas.append({
                "acao": "Ligar" if novo_estado else "Desligar",
                "dispositivo": identificador_unico
            })

            if estado_anterior != novo_estado:
                dispositivo.estado = novo_estado
                self.db.commit()
                # Adiciona o identificador único ao set
                dispositivos_realmente_afetados.add(identificador_unico)
            
            if acao.intervalo_segundos:
                time.sleep(acao.intervalo_segundos)
        
        return {
            "sucesso": True,
            "cena_executada": cena.nome,
            "acoes_executadas": len(acoes_executadas),
            "dispositivos_afetados": list(dispositivos_realmente_afetados),
            "detalhes": acoes_executadas
        }

    # Lista todas as ações associadas a uma cena específica.
    def listar_acoes_por_cena(self, cena_id: int):
        cena = self.db.query(Cena).filter(Cena.id == cena_id).first()
        if not cena:
            raise ValueError("Cena não encontrada")
        acoes = self.db.query(Acao).filter(Acao.cena_id == cena_id).order_by(Acao.ordem).all()
        return acoes