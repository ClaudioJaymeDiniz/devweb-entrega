from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Endereco(Base):
    __tablename__ = 'endereco'
    
    id = Column(Integer, primary_key=True, index=True)
    logradouro = Column(String(100), nullable=False)
    numero = Column(String(10), nullable=False)
    complemento = Column(String(100), nullable=True)
    bairro = Column(String(100), nullable=False)
    cidade = Column(String(100), nullable=False)
    estado = Column(String(2), nullable=False)
    cep = Column(String(8), nullable=False)
    
    # Relacionamento com Titular
    titular_id = Column(Integer, ForeignKey('titular.id'), nullable=False)
    titular = relationship('Titular', back_populates='enderecos')
    
    def __init__(self, rua: str, numero: str, complemento: str = None, bairro: str = None, cidade: str = None, estado: str = None, cep: str = None):
        self.logradouro = rua
        self.numero = numero
        self.complemento = complemento
        self.bairro = bairro
        self.cidade = cidade
        self.estado = estado
        self.cep = cep
    
    def to_dict(self):
        return {
            'id': self.id,
            'logradouro': self.logradouro,
            'numero': self.numero,
            'complemento': self.complemento,
            'bairro': self.bairro,
            'cidade': self.cidade,
            'estado': self.estado,
            'cep': self.cep,
            'titular_id': self.titular_id
        }