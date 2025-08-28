from pydantic import BaseModel
from typing import Optional, List, Dict

# Schemas para Cena
class CenaBase(BaseModel):
    nome: str
    ativo: bool = True

class CenaCreate(CenaBase):
    pass

class CenaUpdate(BaseModel):
    nome: Optional[str] = None
    ativo: Optional[bool] = None

class CenaExecucaoResponse(BaseModel):
    sucesso: bool
    cena_executada: str
    acoes_executadas: int
    dispositivos_afetados: List[str]
    detalhes: List[Dict[str, str]]

class CenaResponse(CenaBase):
    id: int

    class Config:
        orm_mode = True
