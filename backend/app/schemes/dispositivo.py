from pydantic import BaseModel
from typing import Optional

# Schemas para Dispositivo
class DispositivoBase(BaseModel):
    nome: str
    estado: bool = False
    comodo_id: int

# Para endpoint: POST /comodos/{comodo_id}/dispositivos
class DispositivoCreateInRoom(BaseModel):
    nome: str
    estado: bool = False

# Para endpoint geral com comodo_id no body
class DispositivoCreate(DispositivoBase):
    pass

class DispositivoUpdate(BaseModel):
    nome: Optional[str] = None
    estado: Optional[bool] = None
    comodo_id: Optional[int] = None

class DispositivoResponse(DispositivoBase):
    id: int

    class Config:
        from_attributes = True
