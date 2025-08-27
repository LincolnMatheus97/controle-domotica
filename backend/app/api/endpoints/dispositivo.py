from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...database import get_db
from app.services.dispositivo import DispositivoService
from app.schemes.dispositivo import DispositivoCreate, DispositivoCreateInRoom, DispositivoUpdate, DispositivoResponse

router = APIRouter()

@router.get("/dispositivos", response_model=list[DispositivoResponse])
def listar_dispositivos(db: Session = Depends(get_db)):
    service = DispositivoService(db)
    return service.listar_dispositivos()

@router.post("/dispositivos", response_model=DispositivoResponse, status_code=201)
def criar_dispositivo(dispositivo: DispositivoCreate, db: Session = Depends(get_db)):
    service = DispositivoService(db)
    return service.criar_dispositivo(dispositivo.nome, dispositivo.estado, dispositivo.comodo_id)

