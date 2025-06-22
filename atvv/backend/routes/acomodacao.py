from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.acomodacao import Acomodacao
from models.hospedagem import Hospedagem
from schemas.acomodacao import AcomodacaoCreate, AcomodacaoResponse, AcomodacaoUpdate
from datetime import date

router = APIRouter(prefix="/acomodacoes", tags=["acomodacoes"])

@router.post("/", response_model=AcomodacaoResponse, status_code=status.HTTP_201_CREATED)
def create_acomodacao(acomodacao: AcomodacaoCreate, db: Session = Depends(get_db)):
    db_acomodacao = Acomodacao(
        nome_acomodacao=acomodacao.nome_acomodacao,
        cama_solteiro=acomodacao.cama_solteiro,
        cama_casal=acomodacao.cama_casal,
        suite=acomodacao.suite,
        climatizacao=acomodacao.climatizacao,
        garagem=acomodacao.garagem
    )
    db.add(db_acomodacao)
    db.commit()
    db.refresh(db_acomodacao)
    return db_acomodacao

@router.get("/", response_model=List[AcomodacaoResponse])
def read_acomodacoes(disponivel: bool = None, db: Session = Depends(get_db)):
    query = db.query(Acomodacao)
    
    if disponivel is not None:
        hoje = date.today()
        # Subquery para encontrar acomodações ocupadas
        ocupadas = db.query(Hospedagem.acomodacao_id).filter(
            Hospedagem.entrada <= hoje,
            Hospedagem.saida >= hoje
        ).distinct().subquery()
        
        if disponivel:
            # Retorna apenas acomodações não ocupadas
            query = query.filter(~Acomodacao.id.in_(ocupadas))
        else:
            # Retorna apenas acomodações ocupadas
            query = query.filter(Acomodacao.id.in_(ocupadas))
    
    return query.all()

@router.get("/{acomodacao_id}", response_model=AcomodacaoResponse)
def read_acomodacao(acomodacao_id: int, db: Session = Depends(get_db)):
    acomodacao = db.query(Acomodacao).filter(Acomodacao.id == acomodacao_id).first()
    if acomodacao is None:
        raise HTTPException(status_code=404, detail="Acomodação não encontrada")
    return acomodacao

@router.put("/{acomodacao_id}", response_model=AcomodacaoResponse)
def update_acomodacao(acomodacao_id: int, acomodacao: AcomodacaoUpdate, db: Session = Depends(get_db)):
    db_acomodacao = db.query(Acomodacao).filter(Acomodacao.id == acomodacao_id).first()
    if db_acomodacao is None:
        raise HTTPException(status_code=404, detail="Acomodação não encontrada")
    
    for field, value in acomodacao.dict(exclude_unset=True).items():
        setattr(db_acomodacao, field, value)
    
    db.commit()
    db.refresh(db_acomodacao)
    return db_acomodacao

@router.delete("/{acomodacao_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_acomodacao(acomodacao_id: int, db: Session = Depends(get_db)):
    db_acomodacao = db.query(Acomodacao).filter(Acomodacao.id == acomodacao_id).first()
    if db_acomodacao is None:
        raise HTTPException(status_code=404, detail="Acomodação não encontrada")
    
    # Verificar se há hospedagens ativas
    hoje = date.today()
    hospedagem_ativa = db.query(Hospedagem).filter(
        Hospedagem.acomodacao_id == acomodacao_id,
        Hospedagem.entrada <= hoje,
        Hospedagem.saida >= hoje
    ).first()
    
    if hospedagem_ativa:
        raise HTTPException(
            status_code=400,
            detail="Não é possível remover uma acomodação com hospedagens ativas"
        )
    
    db.delete(db_acomodacao)
    db.commit()
    return None