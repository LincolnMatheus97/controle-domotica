from pydantic import BaseModel
from typing import Optional

# Schemas para Cena
class CenaBase(BaseModel):
    nome: str
    ativa: bool = True

class CenaCreate(CenaBase):
    pass

class CenaUpdate(BaseModel):
    nome: Optional[str] = None
    ativa: Optional[bool] = None

class CenaResponse(CenaBase):
    id: int

    class Config:
        orm_mode = True
