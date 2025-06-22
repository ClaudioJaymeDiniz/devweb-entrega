from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Telefone(Base):
    __tablename__ = 'telefone'
    
    id = Column(Integer, primary_key=True, index=True)
    ddd = Column(String(3), nullable=False)
    numero = Column(String(9), nullable=False)
    
    # Relacionamento com Titular
    titular_id = Column(Integer, ForeignKey('titular.id'), nullable=False)
    titular = relationship('Titular', back_populates='telefones')
    
    def __init__(self, ddd: str, numero: str):
        self.ddd = ddd
        self.numero = numero
    
    def to_dict(self):
        return {
            'id': self.id,
            'ddd': self.ddd,
            'numero': self.numero,
            'titular_id': self.titular_id
        }