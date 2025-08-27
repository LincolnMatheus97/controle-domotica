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

@router.post("/comodos/{comodo_id}/dispositivos", response_model=DispositivoResponse, status_code=201)
def criar_dispositivo_no_comodo(comodo_id: int, dispositivo: DispositivoCreateInRoom, db: Session = Depends(get_db)):
    service = DispositivoService(db)
    return service.criar_dispositivo_no_comodo(comodo_id, dispositivo.nome, dispositivo.estado)

@router.get("/dispositivos/{dispositivo_id}", response_model=DispositivoResponse)
def buscar_dispositivo(dispositivo_id: int, db: Session = Depends(get_db)):
    service = DispositivoService(db)
    dispositivo = service.buscar_dispositivo_por_id(dispositivo_id)
    if not dispositivo:
        raise HTTPException(status_code=404, detail="Dispositivo não encontrado")
    return dispositivo
