from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...database import get_db
from app.services.comodo import ComodoService
from app.schemes.comodo import ComodoCreate, ComodoUpdate, ComodoResponse

router = APIRouter()

@router.get("/comodos", response_model=list[ComodoResponse])
def listar_comodos(db: Session = Depends(get_db)):
    service = ComodoService(db)
    try:
        return service.listar_comodo()
    except ValueError:
        raise HTTPException(status_code=404, detail="Nenhum cômodo encontrado")
    
@router.post("/comodos", response_model=ComodoResponse, status_code=201)
def criar_comodo(comodo: ComodoCreate, db: Session = Depends(get_db)):
    service = ComodoService(db)
    try:
        return service.criar_comodo(comodo.nome)
    except ValueError:
        raise HTTPException(status_code=400, detail="Erro ao criar cômodo.")

@router.get("/comodos/{comodo_id}", response_model=ComodoResponse)
def buscar_comodo(comodo_id: int, db: Session = Depends(get_db)):
    service = ComodoService(db)
    try:
        return service.buscar_comodo(comodo_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Cômodo não encontrado")

@router.put("/comodos/{comodo_id}", response_model=ComodoResponse)
def atualizar_comodo(comodo_id: int, comodo: ComodoUpdate, db: Session = Depends(get_db)):
    service = ComodoService(db)
    try:
        return service.atualizar_comodo(comodo_id, comodo.nome)
    except ValueError:
        raise HTTPException(status_code=404, detail="Cômodo não encontrado")

@router.delete("/comodos/{comodo_id}")
def deletar_comodo(comodo_id: int, db: Session = Depends(get_db)):
    service = ComodoService(db)
    try:
        service.deletar_comodo(comodo_id)
        return {"message": "Cômodo deletado com sucesso"}
    except ValueError:
        raise HTTPException(status_code=404, detail="Cômodo não encontrado")
