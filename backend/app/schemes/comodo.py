# app/schemes/comodo.py

# Importa BaseModel do Pydantic para criar modelos de dados
from pydantic import BaseModel
# Importa Optional para campos opcionais e List para tipagem de listas
from typing import Optional, List
# Importa DispositivoInComodoResponse para aninhar no schema de Comodo
from app.schemes.dispositivo import DispositivoInComodoResponse

# Schemas para Comodo (Cômodo)

# Classe base para Comodo, definindo os campos comuns
class ComodoBase(BaseModel):
    nome: str # Nome do cômodo

# Schema para criação de Comodo
class ComodoCreate(ComodoBase):
    pass # Herda todos os campos de ComodoBase

# Schema para atualização de Comodo, o nome é opcional
class ComodoUpdate(BaseModel):
    nome: Optional[str] = None # Novo nome do cômodo, opcional

# Schema de resposta para Comodo, inclui o ID e uma lista de dispositivos associados
class ComodoResponse(ComodoBase):
    id: int # ID único do cômodo
    dispositivos: List[DispositivoInComodoResponse] = [] # Lista de dispositivos neste cômodo
    
    # Configuração interna do Pydantic
    class Config:
        # Permite que o Pydantic leia dados de atributos de objeto (ORM mode)
        from_attributes = True
