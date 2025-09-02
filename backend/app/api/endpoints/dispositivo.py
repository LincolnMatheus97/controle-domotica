from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...database import get_db
from app.services.dispositivo import DispositivoService
from app.schemes.dispositivo import DispositivoCreate, DispositivoCreateInRoom, DispositivoUpdate, DispositivoResponse

router = APIRouter()

# Lista todos os dispositivos cadastrados.
# db: Dependência que fornece a sessão do banco de dados.
# Retorna uma lista de dispositivos ou um erro HTTP se nenhum dispositivo for encontrado.
@router.get("/dispositivos", response_model=list[DispositivoResponse])
def listar_dispositivos(db: Session = Depends(get_db)):
    service = DispositivoService(db)
    try:
        return service.listar_dispositivo()
    except ValueError:
        raise HTTPException(status_code=404, detail="Nenhum dispositivo encontrado")
    

# Cria um novo dispositivo associado a um cômodo específico.
# comodo_id: ID do cômodo ao qual o dispositivo será associado.
# dispositivo: Dados do dispositivo a ser criado.
# db: Dependência que fornece a sessão do banco de dados.
# Retorna o dispositivo criado ou um erro HTTP se a criação falhar.
@router.post("/comodos/{comodo_id}/dispositivos", response_model=DispositivoResponse, status_code=201)
def criar_dispositivo_no_comodo(comodo_id: int, dispositivo: DispositivoCreateInRoom, db: Session = Depends(get_db)):
    service = DispositivoService(db)
    try:    
        return service.criar_dispositivo_no_comodo(comodo_id, dispositivo.nome, dispositivo.estado)
    except ValueError:
        raise HTTPException(status_code=400, detail="Erro ao criar dispositivo no cômodo.")
    

# Busca um dispositivo pelo nome.
# nome: Nome do dispositivo a ser buscado.
# db: Dependência que fornece a sessão do banco de dados.
# Retorna o dispositivo encontrado ou um erro HTTP se o dispositivo não for encontrado.
@router.get("/dispositivos/nome/{nome}", response_model=DispositivoResponse)
def buscar_dispositivo_por_nome(nome: str, db: Session = Depends(get_db)):
    service = DispositivoService(db)
    try:
        dispositivo = service.buscar_dispositivo_por_nome(nome)
        return dispositivo
    except ValueError:
        raise HTTPException(status_code=404, detail=f"Dispositivo com nome '{nome}' não encontrado")

# Atualiza um dispositivo existente.
# dispositivo_id: ID do dispositivo a ser atualizado.
# dispositivo: Dados do dispositivo a serem atualizados.
# db: Dependência que fornece a sessão do banco de dados.
# Retorna o dispositivo atualizado ou um erro HTTP se o dispositivo não for encontrado.
@router.put("/dispositivos/{dispositivo_id}", response_model=DispositivoResponse)
def atualizar_dispositivo(dispositivo_id: int, dispositivo: DispositivoUpdate, db: Session = Depends(get_db)):
    service = DispositivoService(db)
    try:
        return service.atualizar_dispositivo(dispositivo_id, dispositivo.nome, dispositivo.estado, dispositivo.comodo_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Dispositivo não encontrado e erro ao atualizar")

# Deleta um dispositivo existente.
# dispositivo_id: ID do dispositivo a ser deletado.
# db: Dependência que fornece a sessão do banco de dados.
# Retorna uma mensagem de sucesso ou um erro HTTP se o dispositivo não for encontrado.
@router.delete("/dispositivos/{dispositivo_id}")
def deletar_dispositivo(dispositivo_id: int, db: Session = Depends(get_db)):
    service = DispositivoService(db)
    if service.deletar_dispositivo(dispositivo_id):
        return {"message": "Dispositivo deletado com sucesso"}
    raise HTTPException(status_code=404, detail="Dispositivo não encontrado e erro ao deletar")

# Lista todos os dispositivos associados a um cômodo específico.
# comodo_id: ID do cômodo para buscar os dispositivos.
# db: Dependência que fornece a sessão do banco de dados.
# Retorna uma lista de dispositivos ou um erro HTTP se o cômodo não for encontrado.
@router.get("/comodos/{comodo_id}/dispositivos", response_model=list[DispositivoResponse])
def listar_dispositivos_do_comodo(comodo_id: int, db: Session = Depends(get_db)):
    service = DispositivoService(db)
    try:
        return service.listar_dispositivos_por_comodo(comodo_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Comodo não encontrado")