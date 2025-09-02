# app/schemes/__init__.py

# Importa os esquemas (schemas) Pydantic para cada entidade
# Estes esquemas definem a estrutura dos dados para criação, atualização e resposta de cada recurso
from .comodo import ComodoCreate, ComodoUpdate, ComodoResponse
from .dispositivo import DispositivoCreate, DispositivoCreateInRoom, DispositivoUpdate, DispositivoResponse
from .cena import CenaCreate, CenaUpdate, CenaResponse, CenaExecucaoResponse
from .acao import AcaoCreate, AcaoCreateInScene, AcaoUpdate, AcaoResponse

# Define quais símbolos serão exportados quando o pacote schemes for importado
__all__ = [
    "ComodoCreate", "ComodoUpdate", "ComodoResponse",
    "DispositivoCreate", "DispositivoCreateInRoom", "DispositivoUpdate", "DispositivoResponse",
    "CenaCreate", "CenaUpdate", "CenaResponse", "CenaExecucaoResponse",
    "AcaoCreate", "AcaoCreateInScene", "AcaoUpdate", "AcaoResponse"
]