# app/schemes/acao.py

# Importa BaseModel do Pydantic para criar modelos de dados
from pydantic import BaseModel
# Importa Optional para campos opcionais
from typing import Optional

# Schemas para Acao (Ação)

# Classe base para Ação, definindo os campos comuns
class AcaoBase(BaseModel):
    acao: bool # O estado da ação (ligar/desligar, etc.)
    intervalo_segundos: Optional[int] = None # Intervalo em segundos antes da próxima ação, opcional
    ordem: int # Ordem de execução da ação dentro de uma cena
    dispositivo_id: int # ID do dispositivo ao qual a ação se refere
    cena_id: int # ID da cena à qual a ação pertence

# Schema para criação de Ação dentro de uma cena específica (usado em endpoints aninhados)
# Para endpoint: POST /cenas/{cena_id}/acoes
class AcaoCreateInScene(BaseModel):
    dispositivo_id: int # ID do dispositivo
    acao: bool # Estado da ação
    intervalo_segundos: Optional[int] = None # Intervalo opcional
    ordem: int # Ordem de execução

# Schema para criação geral de Ação (pode incluir cena_id no corpo da requisição)
# Para endpoint geral com cena_id no body
class AcaoCreate(AcaoBase):
    pass # Herda todos os campos de AcaoBase

# Schema para atualização de Ação, todos os campos são opcionais
class AcaoUpdate(BaseModel):
    acao: Optional[bool] = None # Novo estado da ação, opcional
    intervalo_segundos: Optional[int] = None # Novo intervalo, opcional
    ordem: Optional[int] = None # Nova ordem, opcional
    dispositivo_id: Optional[int] = None # Novo ID do dispositivo, opcional
    cena_id: Optional[int] = None # Novo ID da cena, opcional

# Schema de resposta para Ação, inclui o ID gerado pelo banco de dados
class AcaoResponse(AcaoBase):
    id: int # ID único da ação

    # Configuração interna do Pydantic
    class Config:
        # Permite que o Pydantic leia dados de atributos de objeto (ORM mode)
        from_attributes = True
