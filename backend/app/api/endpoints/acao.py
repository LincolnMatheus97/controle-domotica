from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...database import get_db
from app.services.acao import AcaoService
from app.schemes.acao import AcaoCreate, AcaoCreateInScene, AcaoUpdate, AcaoResponse

# Cria um roteador FastAPI para gerenciar as rotas da API relacionadas a ações.
router = APIRouter()

# Cria uma nova ação associada a uma cena específica.
# cena_id: ID da cena à qual a ação será associada.
# acao: Dados da ação a ser criada.
# db: Dependência que fornece a sessão do banco de dados.
# Retorna a ação criada ou um erro HTTP se a criação falhar.
@router.post("/cenas/{cena_id}/acoes", response_model=AcaoResponse, status_code=201)
def criar_acao_na_cena(cena_id: int, acao: AcaoCreateInScene, db: Session = Depends(get_db)):
    service = AcaoService(db)
    try:
        return service.criar_acao_na_cena(cena_id, acao.dispositivo_id, acao.acao, acao.ordem, acao.intervalo_segundos)
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Erro ao criar ação na cena.")


# Atualiza uma ação existente.
# acao_id: ID da ação a ser atualizada.
# acao: Dados da ação a serem atualizados.
# db: Dependência que fornece a sessão do banco de dados.
# Retorna a ação atualizada ou um erro HTTP se a ação não for encontrada.
@router.put("/acoes/{acao_id}", response_model=AcaoResponse)
def atualizar_acao(acao_id: int, acao: AcaoUpdate, db: Session = Depends(get_db)):
    service = AcaoService(db)
    try:
        return service.atualizar_acao(acao_id, acao.acao, acao.dispositivo_id, acao.cena_id, acao.ordem, acao.intervalo_segundos)
    except ValueError:
        raise HTTPException(status_code=404, detail="Ação não encontrada e erro ao atualizar")

# Deleta uma ação existente.
# acao_id: ID da ação a ser deletada.
# db: Dependência que fornece a sessão do banco de dados.
# Retorna uma mensagem de sucesso ou um erro HTTP se a ação não for encontrada.
@router.delete("/acoes/{acao_id}")
def deletar_acao(acao_id: int, db: Session = Depends(get_db)):
    service = AcaoService(db)
    try: 
        service.deletar_acao(acao_id)
        return {"message": "Ação deletada com sucesso"}
    except ValueError:
        raise HTTPException(status_code=404, detail="Ação não encontrada e erro ao deletar")