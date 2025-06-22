from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.dependente import Dependente
from models.titular import Titular
from models.documento import Documento, TipoDocumento
from schemas.dependente import DependenteCreate, DependenteResponse, DependenteUpdate
from datetime import datetime

router = APIRouter(prefix="/dependentes", tags=["dependentes"])

@router.post("/", response_model=DependenteResponse)
def create_dependente(dependente: DependenteCreate, db: Session = Depends(get_db)):
    # Verifica se o titular existe
    titular = db.query(Titular).filter(Titular.id == dependente.titular_id).first()
    if not titular:
        raise HTTPException(status_code=404, detail="Titular não encontrado")
    
    # Cria o dependente
    novo_dependente = Dependente(
        nome=dependente.nome,
        nome_social=dependente.nome_social,
        data_nascimento=dependente.data_nascimento,
        titular_id=dependente.titular_id
    )
    db.add(novo_dependente)
    db.flush()
    
    # Adiciona os documentos
    for doc in dependente.documentos:
        documento = Documento(
            tipo=TipoDocumento(doc.tipo),
            numero=doc.numero,
            data_emissao=datetime.strptime(doc.data_emissao, "%Y-%m-%d").date()
        )
        documento.dependente = novo_dependente
        db.add(documento)
    
    db.commit()
    db.refresh(novo_dependente)
    return novo_dependente

@router.get("/", response_model=List[DependenteResponse])
def get_dependentes(db: Session = Depends(get_db)):
    return db.query(Dependente).all()

@router.get("/{dependente_id}", response_model=DependenteResponse)
def get_dependente(dependente_id: int, db: Session = Depends(get_db)):
    dependente = db.query(Dependente).filter(Dependente.id == dependente_id).first()
    if not dependente:
        raise HTTPException(status_code=404, detail="Dependente não encontrado")
    return dependente

@router.put("/{dependente_id}", response_model=DependenteResponse)
def update_dependente(dependente_id: int, dependente: DependenteUpdate, db: Session = Depends(get_db)):
    db_dependente = db.query(Dependente).filter(Dependente.id == dependente_id).first()
    if not db_dependente:
        raise HTTPException(status_code=404, detail="Dependente não encontrado")
    
    # Atualiza os campos básicos
    for field, value in dependente.dict(exclude_unset=True).items():
        if field != 'documentos':
            setattr(db_dependente, field, value)
    
    # Atualiza os documentos se fornecidos
    if dependente.documentos:
        # Remove documentos existentes
        db.query(Documento).filter(Documento.dependente_id == dependente_id).delete()
        
        # Adiciona novos documentos
        for doc in dependente.documentos:
            documento = Documento(
                tipo=TipoDocumento(doc.tipo),
                numero=doc.numero,
                data_emissao=datetime.strptime(doc.data_emissao, "%Y-%m-%d").date()
            )
            documento.dependente = db_dependente
            db.add(documento)
    
    db.commit()
    db.refresh(db_dependente)
    return db_dependente

@router.delete("/{dependente_id}")
def delete_dependente(dependente_id: int, db: Session = Depends(get_db)):
    dependente = db.query(Dependente).filter(Dependente.id == dependente_id).first()
    if not dependente:
        raise HTTPException(status_code=404, detail="Dependente não encontrado")
    
    db.delete(dependente)
    db.commit()
    return {"message": "Dependente removido com sucesso"}