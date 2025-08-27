from pydantic import BaseModel
from typing import Optional

# Schemas para Acao
class AcaoBase(BaseModel):
    acao: str
    intervalo_segundos: Optional[int] = None
    ordem: int
    dispositivo_id: int
    cena_id: int

# Para endpoint: POST /cenas/{cena_id}/acoes
class AcaoCreateInScene(BaseModel):
    dispositivo_id: int
    acao: str
    intervalo_segundos: Optional[int] = None
    ordem: int

# Para endpoint geral com cena_id no body
class AcaoCreate(AcaoBase):
    pass

class AcaoUpdate(BaseModel):
    acao: Optional[str] = None
    intervalo_segundos: Optional[int] = None
    ordem: Optional[int] = None
    dispositivo_id: Optional[int] = None
    cena_id: Optional[int] = None

class AcaoResponse(AcaoBase):
    id: int

    class Config:
        orm_mode = True
