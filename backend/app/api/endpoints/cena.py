from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...database import get_db
from app.services.cena import CenaService
from app.schemes.cena import CenaCreate, CenaUpdate, CenaResponse

router = APIRouter()