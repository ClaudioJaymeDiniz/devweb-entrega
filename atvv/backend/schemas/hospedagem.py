from pydantic import BaseModel, validator
from datetime import date
from typing import Optional
from .titular import TitularResponse
from .acomodacao import AcomodacaoResponse

class HospedagemBase(BaseModel):
    cliente_id: int
    acomodacao_id: int
    entrada: date
    saida: date

    @validator('saida')
    def validar_datas(cls, saida, values):
        if 'entrada' in values and saida < values['entrada']:
            raise ValueError('A data de saída deve ser posterior à data de entrada')
        return saida

class HospedagemCreate(HospedagemBase):
    pass

class HospedagemUpdate(BaseModel):
    entrada: Optional[date] = None
    saida: Optional[date] = None

class HospedagemResponse(HospedagemBase):
    id: int
    cliente: Optional[TitularResponse]
    acomodacao: Optional[AcomodacaoResponse]
    check_out_pendente: bool

    class Config:
        from_attributes = True

class HospedagemFiltros(BaseModel):
    data_inicio: Optional[date] = None
    data_fim: Optional[date] = None
    apenas_pendentes: Optional[bool] = False
    cliente_id: Optional[int] = None
    acomodacao_id: Optional[int] = None