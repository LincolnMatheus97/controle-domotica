from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...database import get_db
from app.services.comodo import ComodoService
from app.schemes.comodo import ComodoCreate, ComodoUpdate, ComodoResponse

router = APIRouter()

# Lista todos os cômodos cadastrados.
# db: Dependência que fornece a sessão do banco de dados.
# Retorna uma lista de cômodos ou um erro HTTP se nenhum cômodo for encontrado.
@router.get("/comodos", response_model=list[ComodoResponse])
def listar_comodos(db: Session = Depends(get_db)):
    service = ComodoService(db)
    try:
        return service.listar_comodo()
    except ValueError:
        raise HTTPException(status_code=404, detail="Nenhum cômodo encontrado")

# Cria um novo cômodo.
# comodo: Dados do cômodo a ser criado.
# db: Dependência que fornece a sessão do banco de dados.
# Retorna o cômodo criado ou um erro HTTP se a criação falhar.
@router.post("/comodos", response_model=ComodoResponse, status_code=201)
def criar_comodo(comodo: ComodoCreate, db: Session = Depends(get_db)):
    service = ComodoService(db)
    try:
        return service.criar_comodo(comodo.nome)
    except ValueError:
        raise HTTPException(status_code=400, detail="Erro ao criar cômodo.")

# Atualiza um cômodo existente.
# comodo_id: ID do cômodo a ser atualizado.
# comodo: Dados do cômodo a serem atualizados.
# db: Dependência que fornece a sessão do banco de dados.
# Retorna o cômodo atualizado ou um erro HTTP se o cômodo não for encontrado.
@router.put("/comodos/{comodo_id}", response_model=ComodoResponse)
def atualizar_comodo(comodo_id: int, comodo: ComodoUpdate, db: Session = Depends(get_db)):
    service = ComodoService(db)
    try:
        return service.atualizar_comodo(comodo_id, comodo.nome)
    except ValueError:
        raise HTTPException(status_code=404, detail="Cômodo não encontrado")

# Deleta um cômodo existente.
# comodo_id: ID do cômodo a ser deletado.
# db: Dependência que fornece a sessão do banco de dados.
# Retorna uma mensagem de sucesso ou um erro HTTP se o cômodo não for encontrado.
@router.delete("/comodos/{comodo_id}")
def deletar_comodo(comodo_id: int, db: Session = Depends(get_db)):
    service = ComodoService(db)
    try:
        service.deletar_comodo(comodo_id)
        return {"message": "Cômodo deletado com sucesso"}
    except ValueError:
        raise HTTPException(status_code=404, detail="Cômodo não encontrado")
