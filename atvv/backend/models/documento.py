from datetime import date, datetime
from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from database import Base
import enum

class TipoDocumento(enum.Enum):
    CPF = "CPF"
    RG = "RG"
    PASSAPORTE = "PASSAPORTE"

class Documento(Base):
    __tablename__ = 'documento'
    
    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(Enum(TipoDocumento), nullable=False)
    numero = Column(String(50), nullable=False)
    data_emissao = Column(Date, nullable=False)
    
    # Relacionamento com Titular ou Dependente (apenas um deles será preenchido)
    titular_id = Column(Integer, ForeignKey('titular.id'))
    titular = relationship('Titular', back_populates='documentos')
    
    dependente_id = Column(Integer, ForeignKey('dependente.id'))
    dependente = relationship('Dependente', back_populates='documentos')
    
    def __init__(self, tipo: TipoDocumento, numero: str, data_emissao: str):
        self.tipo = tipo
        self.numero = numero
        if isinstance(data_emissao, str):
            self.data_emissao = datetime.strptime(data_emissao, "%Y-%m-%d").date()
        else:
            self.data_emissao = data_emissao
    
    def to_dict(self):
        return {
            'id': self.id,
            'tipo': self.tipo.value,
            'numero': self.numero,
            'data_emissao': str(self.data_emissao),
            'titular_id': self.titular_id,
            'dependente_id': self.dependente_id
        }