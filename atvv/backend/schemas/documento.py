from pydantic import BaseModel
from datetime import date
from typing import Optional
from enum import Enum

class TipoDocumento(str, Enum):
    CPF = "CPF"
    RG = "RG"
    PASSAPORTE = "PASSAPORTE"

class DocumentoBase(BaseModel):
    tipo: TipoDocumento
    numero: str
    data_emissao: date

class DocumentoCreate(DocumentoBase):
    pass

class DocumentoUpdate(DocumentoBase):
    tipo: Optional[TipoDocumento] = None
    numero: Optional[str] = None
    data_emissao: Optional[date] = None

class DocumentoResponse(DocumentoBase):
    id: int
    titular_id: Optional[int] = None
    dependente_id: Optional[int] = None

    class Config:
        from_attributes = True