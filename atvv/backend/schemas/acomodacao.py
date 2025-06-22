from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

class NomeAcomodacao(str, Enum):
    SolteiroSimples = 'Acomodação simples para solteiro(a)'
    CasalSimples = 'Acomodação simples para casal'
    FamilaSimples = 'Acomodação para família com até duas crianças'
    FamiliaMais = 'Acomodação para família com até cinco crianças'
    SolteiroMais = 'Acomodação com garagem para solteiro(a)'
    FamiliaSuper = 'Acomodação para até duas familias, casal e três crianças cada'

class AcomodacaoBase(BaseModel):
    nome_acomodacao: NomeAcomodacao
    cama_solteiro: int
    cama_casal: int
    suite: int
    climatizacao: bool
    garagem: int

class AcomodacaoCreate(AcomodacaoBase):
    pass

class AcomodacaoUpdate(BaseModel):
    nome_acomodacao: Optional[NomeAcomodacao] = None
    cama_solteiro: Optional[int] = None
    cama_casal: Optional[int] = None
    suite: Optional[int] = None
    climatizacao: Optional[bool] = None
    garagem: Optional[int] = None

class AcomodacaoResponse(AcomodacaoBase):
    id: int
    disponivel: bool = True

    class Config:
        from_attributes = True