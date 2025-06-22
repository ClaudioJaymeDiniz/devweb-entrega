from datetime import date
from typing import List, Optional
from pydantic import BaseModel, validator
from .documento import DocumentoResponse
from .telefone import TelefoneResponse
from .endereco import EnderecoResponse
from .dependente import DependenteResponse

class TitularBase(BaseModel):
    nome: str
    nome_social: Optional[str] = None
    data_nascimento: date

    @validator('data_nascimento', pre=True)
    def parse_data_nascimento(cls, v):
        print(f'Valor recebido para data_nascimento: {v} (tipo: {type(v)})')
        if isinstance(v, str):
            try:
                if not v:
                    raise ValueError('Data de nascimento não pode estar vazia')
                data_formatada = v.split('T')[0] if 'T' in v else v
                print(f'Tentando converter data formatada: {data_formatada}')
                return date.fromisoformat(data_formatada)
            except ValueError as e:
                print(f'Erro ao converter data de nascimento: {e}')
                raise ValueError(f'Data de nascimento inválida: {e}')
        elif isinstance(v, date):
            return v
        else:
            raise ValueError(f'Formato de data inválido. Recebido: {type(v)}')

class TitularCreate(TitularBase):
    pass

class TitularUpdate(TitularBase):
    pass

class TitularResponse(TitularBase):
    id: int
    documentos: List[DocumentoResponse] = []
    telefones: List[TelefoneResponse] = []
    enderecos: List[EnderecoResponse] = []
    dependentes: List[DependenteResponse] = []

    class Config:
        from_attributes = True