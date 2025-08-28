from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...database import get_db
from app.services.cena import CenaService
from app.schemes.cena import CenaCreate, CenaUpdate, CenaResponse, CenaExecucaoResponse

router = APIRouter()

@router.get("/cenas", response_model=list[CenaResponse])
def listar_cenas(db: Session = Depends(get_db)):
    service = CenaService(db)
    return service.listar_cena()

@router.post("/cenas", response_model=CenaResponse, status_code=201)
def criar_cena(cena: CenaCreate, db: Session = Depends(get_db)):
    service = CenaService(db)
    return service.criar_cena(cena.nome, cena.ativa)

@router.get("/cenas/{cena_id}", response_model=CenaResponse)
def buscar_cena(cena_id: int, db: Session = Depends(get_db)):
    service = CenaService(db)
    try:
        return service.buscar_cena(cena_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Cena não encontrada")

@router.put("/cenas/{cena_id}", response_model=CenaResponse)
def atualizar_cena(cena_id: int, cena: CenaUpdate, db: Session = Depends(get_db)):
    service = CenaService(db)
    return service.atualizar_cena(cena_id, cena.nome, cena.ativa)

@router.delete("/cenas/{cena_id}")
def deletar_cena(cena_id: int, db: Session = Depends(get_db)):
    service = CenaService(db)
    if service.deletar_cena(cena_id):
        return {"message": "Cena deletada com sucesso"}
    raise HTTPException(status_code=404, detail="Cena não encontrada")


@router.put("/cenas/{cena_id}/inverter", response_model=CenaResponse)
def inverter_ativo_cena(cena_id: int, db: Session = Depends(get_db)):
    service = CenaService(db)
    try:
        service.inverter_ativo(cena_id) # retorna o estado da cena que foi invertido
        return service.buscar_cena(cena_id)  
    except ValueError:
        raise HTTPException(status_code=404, detail="Cena não encontrada")

# Endpoint para executar uma cena
@router.post("/cenas/{cena_id}/executar", response_model=CenaExecucaoResponse)
def executar_cena(cena_id: int, db: Session = Depends(get_db)):
    service = CenaService(db)
    try:
        resultado = service.executar_cena(cena_id)
        return resultado
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))