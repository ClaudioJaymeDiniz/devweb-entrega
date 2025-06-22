from pydantic import BaseModel
from typing import Optional

class EnderecoBase(BaseModel):
    logradouro: str
    numero: str
    complemento: Optional[str] = None
    bairro: str
    cidade: str
    estado: str
    cep: str

class EnderecoCreate(EnderecoBase):
    pass

class EnderecoUpdate(EnderecoBase):
    pass

class EnderecoResponse(EnderecoBase):
    id: int
    titular_id: int

    class Config:
        from_attributes = True