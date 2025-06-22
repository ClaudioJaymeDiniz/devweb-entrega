from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.hospedagem import Hospedagem
from models.acomodacao import Acomodacao
from models.titular import Titular
from schemas.hospedagem import HospedagemCreate, HospedagemResponse, HospedagemUpdate, HospedagemFiltros
from datetime import date
from sqlalchemy import and_, or_

router = APIRouter(prefix="/hospedagens", tags=["hospedagens"])

@router.post("/", response_model=HospedagemResponse, status_code=status.HTTP_201_CREATED)
def create_hospedagem(hospedagem: HospedagemCreate, db: Session = Depends(get_db)):
    # Verificar se o titular existe
    titular = db.query(Titular).filter(Titular.id == hospedagem.cliente_id).first()
    if not titular:
        raise HTTPException(status_code=404, detail="Titular não encontrado")
    
    # Verificar se a acomodação existe
    acomodacao = db.query(Acomodacao).filter(Acomodacao.id == hospedagem.acomodacao_id).first()
    if not acomodacao:
        raise HTTPException(status_code=404, detail="Acomodação não encontrada")
    
    # Verificar disponibilidade da acomodação
    hospedagem_existente = db.query(Hospedagem).filter(
        Hospedagem.acomodacao_id == hospedagem.acomodacao_id,
        or_(
            and_(
                Hospedagem.entrada <= hospedagem.entrada,
                Hospedagem.saida >= hospedagem.entrada
            ),
            and_(
                Hospedagem.entrada <= hospedagem.saida,
                Hospedagem.saida >= hospedagem.saida
            )
        )
    ).first()
    
    if hospedagem_existente:
        raise HTTPException(
            status_code=400,
            detail="Acomodação não disponível para o período selecionado"
        )
    
    db_hospedagem = Hospedagem(
        cliente_id=hospedagem.cliente_id,
        acomodacao_id=hospedagem.acomodacao_id,
        entrada=hospedagem.entrada,
        saida=hospedagem.saida
    )
    
    db.add(db_hospedagem)
    db.commit()
    db.refresh(db_hospedagem)
    return db_hospedagem

@router.get("/", response_model=List[HospedagemResponse])
def read_hospedagens(
    filtros: HospedagemFiltros = Depends(),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Hospedagem)
    
    if filtros.data_inicio:
        query = query.filter(Hospedagem.entrada >= filtros.data_inicio)
    
    if filtros.data_fim:
        query = query.filter(Hospedagem.saida <= filtros.data_fim)
    
    if filtros.apenas_pendentes:
        hoje = date.today()
        query = query.filter(
            Hospedagem.saida >= hoje
        )
    
    if filtros.cliente_id:
        query = query.filter(Hospedagem.cliente_id == filtros.cliente_id)
    
    if filtros.acomodacao_id:
        query = query.filter(Hospedagem.acomodacao_id == filtros.acomodacao_id)
    
    return query.offset(skip).limit(limit).all()

@router.get("/{hospedagem_id}", response_model=HospedagemResponse)
def read_hospedagem(hospedagem_id: int, db: Session = Depends(get_db)):
    hospedagem = db.query(Hospedagem).filter(Hospedagem.id == hospedagem_id).first()
    if hospedagem is None:
        raise HTTPException(status_code=404, detail="Hospedagem não encontrada")
    return hospedagem

@router.put("/{hospedagem_id}", response_model=HospedagemResponse)
def update_hospedagem(hospedagem_id: int, hospedagem: HospedagemUpdate, db: Session = Depends(get_db)):
    db_hospedagem = db.query(Hospedagem).filter(Hospedagem.id == hospedagem_id).first()
    if db_hospedagem is None:
        raise HTTPException(status_code=404, detail="Hospedagem não encontrada")
    
    # Verificar se as novas datas não conflitam com outras hospedagens
    if hospedagem.entrada or hospedagem.saida:
        nova_entrada = hospedagem.entrada or db_hospedagem.entrada
        nova_saida = hospedagem.saida or db_hospedagem.saida
        
        conflito = db.query(Hospedagem).filter(
            Hospedagem.acomodacao_id == db_hospedagem.acomodacao_id,
            Hospedagem.id != hospedagem_id,
            or_(
                and_(
                    Hospedagem.entrada <= nova_entrada,
                    Hospedagem.saida >= nova_entrada
                ),
                and_(
                    Hospedagem.entrada <= nova_saida,
                    Hospedagem.saida >= nova_saida
                )
            )
        ).first()
        
        if conflito:
            raise HTTPException(
                status_code=400,
                detail="As novas datas conflitam com uma hospedagem existente"
            )
    
    for field, value in hospedagem.dict(exclude_unset=True).items():
        setattr(db_hospedagem, field, value)
    
    db.commit()
    db.refresh(db_hospedagem)
    return db_hospedagem

@router.delete("/{hospedagem_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_hospedagem(hospedagem_id: int, db: Session = Depends(get_db)):
    db_hospedagem = db.query(Hospedagem).filter(Hospedagem.id == hospedagem_id).first()
    if db_hospedagem is None:
        raise HTTPException(status_code=404, detail="Hospedagem não encontrada")
    
    # Verificar se a hospedagem está em andamento
    hoje = date.today()
    if hoje >= db_hospedagem.entrada and hoje <= db_hospedagem.saida:
        raise HTTPException(
            status_code=400,
            detail="Não é possível cancelar uma hospedagem em andamento"
        )
    
    db.delete(db_hospedagem)
    db.commit()
    return None