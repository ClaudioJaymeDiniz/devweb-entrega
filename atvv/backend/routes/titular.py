from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.titular import Titular
from models.telefone import Telefone
from models.endereco import Endereco
from models.documento import Documento
from models.dependente import Dependente
from schemas.titular import TitularCreate, TitularResponse, TitularUpdate
from schemas.telefone import TelefoneCreate
from schemas.documento import DocumentoCreate
from schemas.dependente import DependenteCreate
from schemas.endereco import EnderecoCreate

router = APIRouter(prefix="/titulares", tags=["titulares"])

@router.post("/", response_model=TitularResponse)
def create_titular(titular: TitularCreate, db: Session = Depends(get_db)):
    try:
        print(f'Dados recebidos: nome={titular.nome}, data_nascimento={titular.data_nascimento} (tipo: {type(titular.data_nascimento)})')
        db_titular = Titular(
            nome=titular.nome,
            nome_social=titular.nome_social,
            data_nascimento=titular.data_nascimento
        )
        db.add(db_titular)
        db.commit()
        db.refresh(db_titular)
        return db_titular
    except Exception as e:
        print(f'Erro ao criar titular: {str(e)} (tipo: {type(e)})')
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get('/', response_model=List[TitularResponse])
def read_titulares(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    titulares = db.query(Titular).offset(skip).limit(limit).all()
    return titulares

@router.get('/{titular_id}', response_model=TitularResponse)
def read_titular(titular_id: int, db: Session = Depends(get_db)):
    titular = db.query(Titular).filter(Titular.id == titular_id).first()
    if titular is None:
        raise HTTPException(status_code=404, detail='Titular não encontrado')
    return titular

@router.put('/{titular_id}', response_model=TitularResponse)
def update_titular(titular_id: int, titular: TitularUpdate, db: Session = Depends(get_db)):
    db_titular = db.query(Titular).filter(Titular.id == titular_id).first()
    if db_titular is None:
        raise HTTPException(status_code=404, detail='Titular não encontrado')
    
    db_titular.nome = titular.nome
    db_titular.nome_social = titular.nome_social
    db_titular.data_nascimento = titular.data_nascimento
    
    db.commit()
    db.refresh(db_titular)
    return db_titular

@router.delete('/{titular_id}')
def delete_titular(titular_id: int, db: Session = Depends(get_db)):
    titular = db.query(Titular).filter(Titular.id == titular_id).first()
    if titular is None:
        raise HTTPException(status_code=404, detail='Titular não encontrado')
    
    db.delete(titular)
    db.commit()
    return {'message': 'Titular deletado com sucesso'}

# Rotas para adicionar relacionamentos
@router.post('/{titular_id}/telefones', response_model=TitularResponse)
def add_telefone(titular_id: int, telefone: TelefoneCreate, db: Session = Depends(get_db)):
    titular = db.query(Titular).filter(Titular.id == titular_id).first()
    if titular is None:
        raise HTTPException(status_code=404, detail='Titular não encontrado')
    
    db_telefone = Telefone(**telefone.dict())
    titular.telefones.append(db_telefone)
    db.commit()
    db.refresh(titular)
    return titular

@router.post('/{titular_id}/enderecos', response_model=TitularResponse)
def add_endereco(titular_id: int, endereco: EnderecoCreate, db: Session = Depends(get_db)):
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
    titular.enderecos.append(db_endereco)
    db.commit()
    db.refresh(titular)
    return titular

@router.post('/{titular_id}/documentos', response_model=TitularResponse)
def add_documento(titular_id: int, documento: DocumentoCreate, db: Session = Depends(get_db)):
    titular = db.query(Titular).filter(Titular.id == titular_id).first()
    if titular is None:
        raise HTTPException(status_code=404, detail='Titular não encontrado')
    
    db_documento = Documento(**documento.dict())
    titular.documentos.append(db_documento)
    db.commit()
    db.refresh(titular)
    return titular

@router.post('/{titular_id}/dependentes', response_model=TitularResponse)
def add_dependente(titular_id: int, dependente: DependenteCreate, db: Session = Depends(get_db)):
    titular = db.query(Titular).filter(Titular.id == titular_id).first()
    if titular is None:
        raise HTTPException(status_code=404, detail='Titular não encontrado')
    
    db_dependente = Dependente(**dependente.dict())
    titular.dependentes.append(db_dependente)
    db.commit()
    db.refresh(titular)
    return titular