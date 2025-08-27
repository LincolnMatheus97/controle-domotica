from pydantic import BaseModel
from typing import Optional

# Schemas para Acao
class AcaoBase(BaseModel):
    acao: str
    intervalo_segundos: Optional[int] = None
    ordem: int
    id_dispositivo: int
    id_cena: int

class AcaoCreate(AcaoBase):
    pass

class AcaoUpdate(BaseModel):
    acao: Optional[str] = None
    intervalo_segundos: Optional[int] = None
    ordem: Optional[int] = None
    id_dispositivo: Optional[int] = None
    id_cena: Optional[int] = None

class AcaoResponse(AcaoBase):
    id: int

    class Config:
        orm_mode = True
