from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...database import get_db
from app.services.cena import CenaService
from app.schemes.cena import CenaCreate, CenaUpdate, CenaResponse, CenaExecucaoResponse
from typing import List
from app.schemes.acao import AcaoResponse 

router = APIRouter()

# Lista todas as cenas cadastradas.
# db: Dependência que fornece a sessão do banco de dados.
# Retorna uma lista de cenas ou um erro HTTP se nenhuma cena for encontrada.
@router.get("/cenas", response_model=list[CenaResponse])
def listar_cenas(db: Session = Depends(get_db)):
    service = CenaService(db)
    try:
        return service.listar_cena()
    except ValueError:
        raise HTTPException(status_code=400, detail="Nenhuma cena encontrada")

# Cria uma nova cena.
# cena: Dados da cena a ser criada.
# db: Dependência que fornece a sessão do banco de dados.
# Retorna a cena criada ou um erro HTTP se a criação falhar.
@router.post("/cenas", response_model=CenaResponse, status_code=201)
def criar_cena(cena: CenaCreate, db: Session = Depends(get_db)):
    service = CenaService(db)
    try:
        return service.criar_cena(cena.nome, cena.ativa)
    except ValueError:
        raise HTTPException(status_code=400, detail="Erro ao criar cena.")

# Atualiza uma cena existente.
# cena_id: ID da cena a ser atualizada.
# cena: Dados da cena a serem atualizados.
# db: Dependência que fornece a sessão do banco de dados.
# Retorna a cena atualizada ou um erro HTTP se a cena não for encontrada.
@router.put("/cenas/{cena_id}", response_model=CenaResponse)
def atualizar_cena(cena_id: int, cena: CenaUpdate, db: Session = Depends(get_db)):
    service = CenaService(db)
    try:
        return service.atualizar_cena(cena_id, cena.nome, cena.ativa)
    except ValueError:
        raise HTTPException(status_code=404, detail="Cena não encontrada e erro ao atualizar")

# Deleta uma cena existente.
# cena_id: ID da cena a ser deletada.
# db: Dependência que fornece a sessão do banco de dados.
# Retorna uma mensagem de sucesso ou um erro HTTP se a cena não for encontrada.
@router.delete("/cenas/{cena_id}")
def deletar_cena(cena_id: int, db: Session = Depends(get_db)):
    service = CenaService(db)
    try:
        service.deletar_cena(cena_id)
        return {"message": "Cena deletada com sucesso"}
    except ValueError:
        raise HTTPException(status_code=404, detail="Cena não encontrada e erro ao deletar")

# Inverte o estado de ativação de uma cena (ativa/inativa).
# cena_id: ID da cena a ter o estado invertido.
# db: Dependência que fornece a sessão do banco de dados.
# Retorna a cena com o estado atualizado ou um erro HTTP se a cena não for encontrada.
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

# Lista todas as ações associadas a uma cena específica.
# cena_id: ID da cena para buscar as ações.
# db: Dependência que fornece a sessão do banco de dados.
# Retorna uma lista de ações ou um erro HTTP se a cena não for encontrada.
@router.get("/cenas/{cena_id}/acoes", response_model=List[AcaoResponse])
def listar_acoes_da_cena(cena_id: int, db: Session = Depends(get_db)):
    service = CenaService(db)
    try:
        return service.listar_acoes_por_cena(cena_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))