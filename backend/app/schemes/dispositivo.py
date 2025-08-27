from pydantic import BaseModel
from typing import Optional

# Schemas para Dispositivo
class DispositivoBase(BaseModel):
    nome: str
    estado: bool = False
    id_comodo: int

class DispositivoCreate(DispositivoBase):
    pass

class DispositivoUpdate(BaseModel):
    nome: Optional[str] = None
    estado: Optional[bool] = None
    id_comodo: Optional[int] = None

class DispositivoResponse(DispositivoBase):
    id: int

    class Config:
        orm_mode = True
