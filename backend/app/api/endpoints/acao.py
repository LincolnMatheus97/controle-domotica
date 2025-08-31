from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...database import get_db
from app.services.acao import AcaoService
from app.schemes.acao import AcaoCreate, AcaoCreateInScene, AcaoUpdate, AcaoResponse

router = APIRouter()

@router.get("/acoes", response_model=list[AcaoResponse])
def listar_acoes(db: Session = Depends(get_db)):
    service = AcaoService(db)
    try: 
        return service.listar_acao()
    except ValueError:
        raise HTTPException(status_code=404, detail="Nenhuma ação encontrada")

@router.post("/acoes", response_model=AcaoResponse, status_code=201)
def criar_acao(acao: AcaoCreate, db: Session = Depends(get_db)):
    service = AcaoService(db)
    try:
        return service.criar_acao(acao.acao, acao.dispositivo_id, acao.cena_id, acao.ordem, acao.intervalo_segundos)
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Erro ao criar ação.")

@router.post("/cenas/{cena_id}/acoes", response_model=AcaoResponse, status_code=201)
def criar_acao_na_cena(cena_id: int, acao: AcaoCreateInScene, db: Session = Depends(get_db)):
    service = AcaoService(db)
    try:
        return service.criar_acao_na_cena(cena_id, acao.dispositivo_id, acao.acao, acao.ordem, acao.intervalo_segundos)
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Erro ao criar ação na cena.")
    
@router.get("/acoes/{acao_id}", response_model=AcaoResponse)
def buscar_acao(acao_id: int, db: Session = Depends(get_db)):
    service = AcaoService(db)
    try:
        return service.buscar_acao(acao_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Ação não encontrada")
    
@router.put("/acoes/{acao_id}", response_model=AcaoResponse)
def atualizar_acao(acao_id: int, acao: AcaoUpdate, db: Session = Depends(get_db)):
    service = AcaoService(db)
    try:
        return service.atualizar_acao(acao_id, acao.acao, acao.dispositivo_id, acao.cena_id, acao.ordem, acao.intervalo_segundos)
    except ValueError:
        raise HTTPException(status_code=404, detail="Ação não encontrada e erro ao atualizar")
    
@router.delete("/acoes/{acao_id}")
def deletar_acao(acao_id: int, db: Session = Depends(get_db)):
    service = AcaoService(db)
    try: 
        service.deletar_acao(acao_id)
        return {"message": "Ação deletada com sucesso"}
    except ValueError:
        raise HTTPException(status_code=404, detail="Ação não encontrada e erro ao deletar")