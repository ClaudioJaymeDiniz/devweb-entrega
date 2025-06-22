from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import relationship
from database import Base

class Titular(Base):
    __tablename__ = 'titular'
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    nome_social = Column(String(100))
    data_nascimento = Column(Date, nullable=False)
    
    # Relacionamentos
    documentos = relationship('Documento', back_populates='titular', foreign_keys='Documento.titular_id', cascade='all, delete-orphan')
    telefones = relationship('Telefone', back_populates='titular', cascade='all, delete-orphan')
    enderecos = relationship('Endereco', back_populates='titular', cascade='all, delete-orphan')
    dependentes = relationship('Dependente', back_populates='titular', cascade='all, delete-orphan')
    
    def __init__(self, nome: str, nome_social: str = None, data_nascimento: date = None):
        self.nome = nome
        self.nome_social = nome_social
        if isinstance(data_nascimento, str):
            try:
                self.data_nascimento = date.fromisoformat(data_nascimento)
            except ValueError as e:
                raise ValueError(f'Data de nascimento inválida: {e}')
        else:
            self.data_nascimento = data_nascimento
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'nome_social': self.nome_social,
            'data_nascimento': str(self.data_nascimento) if self.data_nascimento else None,
            'enderecos': [end.to_dict() for end in self.enderecos],
            'telefones': [tel.to_dict() for tel in self.telefones],
            'documentos': [doc.to_dict() for doc in self.documentos],
            'dependentes': [dep.to_dict() for dep in self.dependentes]
        }