from pydantic import BaseModel
from typing import Optional, List
from app.schemes.dispositivo import DispositivoInComodoResponse

# Schemas para Comodo
class ComodoBase(BaseModel):
    nome: str

class ComodoCreate(ComodoBase):
    pass

class ComodoUpdate(BaseModel):
    nome: Optional[str] = None


class ComodoResponse(ComodoBase):
    id: int
    dispositivos: List[DispositivoInComodoResponse] = [] 
    
    class Config:
        from_attributes = True
