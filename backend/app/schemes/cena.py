from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.schemes.acao import AcaoResponse

# Schemas para Cena
class CenaBase(BaseModel):
    nome: str
    ativa: bool = True

class CenaCreate(CenaBase):
    pass

class CenaUpdate(BaseModel):
    nome: Optional[str] = None
    ativa: Optional[bool] = None

class CenaExecucaoResponse(BaseModel):
    sucesso: bool
    cena_executada: str
    acoes_executadas: int
    dispositivos_afetados: List[str]
    detalhes: List[Dict[str, Any]]

class CenaResponse(CenaBase):
    id: int
    acoes: List[AcaoResponse] = []

    class Config:
        from_attributes = True
