from datetime import date
from pydantic import BaseModel
from typing import List, Optional
from schemas.documento import DocumentoCreate, DocumentoResponse

class DependenteBase(BaseModel):
    nome: str
    nome_social: Optional[str] = None
    data_nascimento: date

class DependenteCreate(DependenteBase):
    titular_id: int
    documentos: List[DocumentoCreate]

class DependenteUpdate(DependenteBase):
    documentos: Optional[List[DocumentoCreate]] = None

class DependenteResponse(DependenteBase):
    id: int
    data_cadastro: date
    titular_id: int
    documentos: List[DocumentoResponse]

    class Config:
        from_attributes = True