# app/schemes/cena.py

# Importa BaseModel do Pydantic para criar modelos de dados
from pydantic import BaseModel
# Importa Optional para campos opcionais, List e Dict para tipagem de listas e dicionários
from typing import Optional, List, Dict, Any
# Importa AcaoResponse para aninhar no schema de Cena
from app.schemes.acao import AcaoResponse

# Schemas para Cena

# Classe base para Cena, definindo os campos comuns
class CenaBase(BaseModel):
    nome: str # Nome da cena
    ativa: bool = True # Indica se a cena está ativa, padrão True

# Schema para criação de Cena
class CenaCreate(CenaBase):
    pass # Herda todos os campos de CenaBase

# Schema para atualização de Cena, todos os campos são opcionais
class CenaUpdate(BaseModel):
    nome: Optional[str] = None # Novo nome da cena, opcional
    ativa: Optional[bool] = None # Novo status de ativação, opcional

# Schema de resposta para a execução de uma Cena
class CenaExecucaoResponse(BaseModel):
    sucesso: bool # Indica se a execução foi bem-sucedida
    cena_executada: str # Nome da cena que foi executada
    acoes_executadas: int # Número de ações executadas
    dispositivos_afetados: List[str] # Lista de nomes dos dispositivos afetados
    detalhes: List[Dict[str, Any]] # Detalhes de cada ação executada

# Schema de resposta para Cena, inclui o ID e uma lista de ações associadas
class CenaResponse(CenaBase):
    id: int # ID único da cena
    acoes: List[AcaoResponse] = [] # Lista de ações associadas a esta cena

    # Configuração interna do Pydantic
    class Config:
        # Permite que o Pydantic leia dados de atributos de objeto (ORM mode)
        from_attributes = True
