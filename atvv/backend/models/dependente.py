from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Dependente(Base):
    __tablename__ = 'dependente'
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    nome_social = Column(String(100))
    data_nascimento = Column(Date, nullable=False)
    data_cadastro = Column(Date, default=date.today)
    
    # Relacionamento com o titular
    titular_id = Column(Integer, ForeignKey('titular.id'), nullable=False)
    titular = relationship('Titular', back_populates='dependentes')
    
    # Relacionamentos
    documentos = relationship('Documento', back_populates='dependente', cascade='all, delete-orphan')
    
    def __init__(self, nome: str, nome_social: str = None, data_nascimento: date = None, titular_id: int = None):
        self.nome = nome
        self.nome_social = nome_social
        self.data_nascimento = data_nascimento
        self.titular_id = titular_id
        
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'nome_social': self.nome_social,
            'data_nascimento': str(self.data_nascimento) if self.data_nascimento else None,
            'data_cadastro': str(self.data_cadastro) if self.data_cadastro else None,
            'titular_id': self.titular_id,
            'documentos': [doc.to_dict() for doc in self.documentos]
        }