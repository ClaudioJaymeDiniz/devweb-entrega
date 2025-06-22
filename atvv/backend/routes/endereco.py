from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.endereco import Endereco
from models.titular import Titular
from schemas.endereco import EnderecoCreate, EnderecoResponse, EnderecoUpdate

router = APIRouter(prefix="/enderecos", tags=["enderecos"])

@router.post('/', response_model=EnderecoResponse)
def create_endereco(endereco: EnderecoCreate, titular_id: int, db: Session = Depends(get_db)):
    titular = db.query(Titular).filter(Titular.id == titular_id).first()
    if titular is None:
        raise HTTPException(status_code=404, detail='Titular não encontrado')
    
    db_endereco = Endereco(
        rua=endereco.logradouro,
        numero=endereco.numero,
        complemento=endereco.complemento,
        bairro=endereco.bairro,
        cidade=endereco.cidade,
        estado=endereco.estado,
        cep=endereco.cep
    )
    db_endereco.titular_id = titular_id
    db.add(db_endereco)
    db.commit()
    db.refresh(db_endereco)
    return db_endereco

@router.get('/', response_model=List[EnderecoResponse])
def read_enderecos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    enderecos = db.query(Endereco).offset(skip).limit(limit).all()
    return enderecos

@router.get('/{endereco_id}', response_model=EnderecoResponse)
def read_endereco(endereco_id: int, db: Session = Depends(get_db)):
    endereco = db.query(Endereco).filter(Endereco.id == endereco_id).first()
    if endereco is None:
        raise HTTPException(status_code=404, detail='Endereço não encontrado')
    return endereco

@router.put('/{endereco_id}', response_model=EnderecoResponse)
def update_endereco(endereco_id: int, endereco: EnderecoUpdate, db: Session = Depends(get_db)):
    db_endereco = db.query(Endereco).filter(Endereco.id == endereco_id).first()
    if db_endereco is None:
        raise HTTPException(status_code=404, detail='Endereço não encontrado')
    
    db_endereco.logradouro = endereco.logradouro
    db_endereco.numero = endereco.numero
    db_endereco.complemento = endereco.complemento
    db_endereco.bairro = endereco.bairro
    db_endereco.cidade = endereco.cidade
    db_endereco.estado = endereco.estado
    db_endereco.cep = endereco.cep
    
    db.commit()
    db.refresh(db_endereco)
    return db_endereco

@router.delete('/{endereco_id}')
def delete_endereco(endereco_id: int, db: Session = Depends(get_db)):
    endereco = db.query(Endereco).filter(Endereco.id == endereco_id).first()
    if endereco is None:
        raise HTTPException(status_code=404, detail='Endereço não encontrado')
    
    db.delete(endereco)
    db.commit()
    return {'message': 'Endereço deletado com sucesso'}