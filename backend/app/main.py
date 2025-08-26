from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db, create_tables
from app.models.comodo import Comodo
from app.models.dispositivo import Dispositivo

# Criar a aplicação FastAPI
app = FastAPI(title="Controle Domótica API", version="0.1.0")

# Criar as tabelas no startup
@app.on_event("startup")
def startup():
    create_tables()

# Endpoint básico
@app.get("/")
def root():
    return {"message": "API Domótica funcionando!"}

# Endpoints para Cômodos
@app.get("/comodos/")
def listar_comodos(db: Session = Depends(get_db)):
    comodos = db.query(Comodo).all()
    return comodos

@app.post("/comodos/")
def criar_comodo(nome: str, db: Session = Depends(get_db)):
    comodo = Comodo(nome=nome)
    db.add(comodo)
    db.commit()
    db.refresh(comodo)
    return comodo

# Endpoints para Dispositivos
@app.get("/dispositivos/")
def listar_dispositivos(db: Session = Depends(get_db)):
    dispositivos = db.query(Dispositivo).all()
    return dispositivos

@app.post("/dispositivos/")
def criar_dispositivo(nome: str, id_comodo: int, db: Session = Depends(get_db)):
    # Verificar se o cômodo existe
    comodo = db.query(Comodo).filter(Comodo.id == id_comodo).first()
    if not comodo:
        raise HTTPException(status_code=404, detail="Cômodo não encontrado")
    
    dispositivo = Dispositivo(nome=nome, id_comodo=id_comodo)
    db.add(dispositivo)
    db.commit()
    db.refresh(dispositivo)
    return dispositivo

@app.put("/dispositivos/{dispositivo_id}/toggle")
def toggle_dispositivo(dispositivo_id: int, db: Session = Depends(get_db)):
    dispositivo = db.query(Dispositivo).filter(Dispositivo.id == dispositivo_id).first()
    if not dispositivo:
        raise HTTPException(status_code=404, detail="Dispositivo não encontrado")
    
    dispositivo.estado = not dispositivo.estado
    db.commit()
    db.refresh(dispositivo)
    return dispositivo
