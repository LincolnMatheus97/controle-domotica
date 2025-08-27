from pydantic import BaseModel
from typing import Optional

# Schemas para Comodo
class ComodoBase(BaseModel):
    nome: str

class ComodoCreate(ComodoBase):
    pass

class ComodoUpdate(BaseModel):
    nome: Optional[str] = None

class ComodoResponse(ComodoBase):
    id: int

    class Config:
        orm_mode = True
