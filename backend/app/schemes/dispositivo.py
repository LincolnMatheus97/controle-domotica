# app/schemes/dispositivo.py

# Importa BaseModel do Pydantic para criar modelos de dados
from pydantic import BaseModel
# Importa Optional para campos opcionais
from typing import Optional

# Schemas para Dispositivo

# Classe base para Dispositivo, definindo os campos comuns
class DispositivoBase(BaseModel):
    nome: str # Nome do dispositivo
    estado: bool = False # Estado do dispositivo (ligado/desligado), padrão False (desligado)
    comodo_id: int # ID do cômodo ao qual o dispositivo pertence

# Schema para criação de Dispositivo dentro de um cômodo específico (usado em endpoints aninhados)
# Para endpoint: POST /comodos/{comodo_id}/dispositivos
class DispositivoCreateInRoom(BaseModel):
    nome: str # Nome do dispositivo
    estado: bool = False # Estado inicial do dispositivo

# Schema para criação geral de Dispositivo (pode incluir comodo_id no corpo da requisição)
# Para endpoint geral com comodo_id no body
class DispositivoCreate(DispositivoBase):
    pass # Herda todos os campos de DispositivoBase

# Schema para atualização de Dispositivo, todos os campos são opcionais
class DispositivoUpdate(BaseModel):
    nome: Optional[str] = None # Novo nome do dispositivo, opcional
    estado: Optional[bool] = None # Novo estado do dispositivo, opcional
    comodo_id: Optional[int] = None # Novo ID do cômodo, opcional

# Schema de resposta para Dispositivo quando listado dentro de um Cômodo
class DispositivoInComodoResponse(BaseModel):
    id: int # ID único do dispositivo
    nome: str # Nome do dispositivo
    estado: bool # Estado atual do dispositivo

    # Configuração interna do Pydantic
    class Config:
         # Permite que o Pydantic leia dados de atributos de objeto (ORM mode)
         from_attributes = True

# Schema de resposta completo para Dispositivo, inclui o ID gerado pelo banco de dados
class DispositivoResponse(DispositivoBase):
    id: int # ID único do dispositivo

    # Configuração interna do Pydantic
    class Config:
        # Permite que o Pydantic leia dados de atributos de objeto (ORM mode)
        from_attributes = True
