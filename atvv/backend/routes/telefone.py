from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.telefone import Telefone
from models.titular import Titular
from schemas.telefone import TelefoneCreate, TelefoneResponse, TelefoneUpdate

router = APIRouter(prefix="/telefones", tags=["telefones"])

@router.post('/', response_model=TelefoneResponse)
def create_telefone(telefone: TelefoneCreate, titular_id: int, db: Session = Depends(get_db)):
    titular = db.query(Titular).filter(Titular.id == titular_id).first()
    if titular is None:
        raise HTTPException(status_code=404, detail='Titular não encontrado')
    
    db_telefone = Telefone(
        ddd=telefone.ddd,
        numero=telefone.numero
    )
    db_telefone.titular_id = titular_id
    db.add(db_telefone)
    db.commit()
    db.refresh(db_telefone)
    return db_telefone

@router.get('/', response_model=List[TelefoneResponse])
def read_telefones(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    telefones = db.query(Telefone).offset(skip).limit(limit).all()
    return telefones

@router.get('/{telefone_id}', response_model=TelefoneResponse)
def read_telefone(telefone_id: int, db: Session = Depends(get_db)):
    telefone = db.query(Telefone).filter(Telefone.id == telefone_id).first()
    if telefone is None:
        raise HTTPException(status_code=404, detail='Telefone não encontrado')
    return telefone

@router.put('/{telefone_id}', response_model=TelefoneResponse)
def update_telefone(telefone_id: int, telefone: TelefoneUpdate, db: Session = Depends(get_db)):
    db_telefone = db.query(Telefone).filter(Telefone.id == telefone_id).first()
    if db_telefone is None:
        raise HTTPException(status_code=404, detail='Telefone não encontrado')
    
    db_telefone.ddd = telefone.ddd
    db_telefone.numero = telefone.numero
    
    db.commit()
    db.refresh(db_telefone)
    return db_telefone

@router.delete('/{telefone_id}')
def delete_telefone(telefone_id: int, db: Session = Depends(get_db)):
    telefone = db.query(Telefone).filter(Telefone.id == telefone_id).first()
    if telefone is None:
        raise HTTPException(status_code=404, detail='Telefone não encontrado')
    
    db.delete(telefone)
    db.commit()
    return {'message': 'Telefone deletado com sucesso'}