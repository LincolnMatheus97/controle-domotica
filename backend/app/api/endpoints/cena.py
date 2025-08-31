from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...database import get_db
from app.services.cena import CenaService
from app.schemes.cena import CenaCreate, CenaUpdate, CenaResponse, CenaExecucaoResponse
from typing import List
from app.schemes.acao import AcaoResponse 

router = APIRouter()

@router.get("/cenas", response_model=list[CenaResponse])
def listar_cenas(db: Session = Depends(get_db)):
    service = CenaService(db)
    try:
        return service.listar_cena()
    except ValueError:
        raise HTTPException(status_code=400, detail="Nenhuma cena encontrada")

@router.post("/cenas", response_model=CenaResponse, status_code=201)
def criar_cena(cena: CenaCreate, db: Session = Depends(get_db)):
    service = CenaService(db)
    try:
        return service.criar_cena(cena.nome, cena.ativa)
    except ValueError:
        raise HTTPException(status_code=400, detail="Erro ao criar cena.")
    
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
    try:
        return service.atualizar_cena(cena_id, cena.nome, cena.ativa)
    except ValueError:
        raise HTTPException(status_code=404, detail="Cena não encontrada e erro ao atualizar")
    
@router.delete("/cenas/{cena_id}")
def deletar_cena(cena_id: int, db: Session = Depends(get_db)):
    service = CenaService(db)
    try:
        service.deletar_cena(cena_id)
        return {"message": "Cena deletada com sucesso"}
    except ValueError:
        raise HTTPException(status_code=404, detail="Cena não encontrada e erro ao deletar")


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

@router.get("/cenas/{cena_id}/acoes", response_model=List[AcaoResponse])
def listar_acoes_da_cena(cena_id: int, db: Session = Depends(get_db)):
    service = CenaService(db)
    try:
        return service.listar_acoes_por_cena(cena_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))