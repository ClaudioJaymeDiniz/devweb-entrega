from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum as SQLAlchemyEnum
from sqlalchemy.orm import relationship
from database import Base
from datetime import date
from .acomodacao import NomeAcomodacao

class Hospedagem(Base):
    __tablename__ = 'hospedagem'
    
    id = Column(Integer, primary_key=True, index=True)
    entrada = Column(Date, nullable=False)
    saida = Column(Date, nullable=False)
    
    # Relacionamento com Titular
    cliente_id = Column(Integer, ForeignKey('titular.id'), nullable=False)
    cliente = relationship('Titular', backref='hospedagens')
    
    # Relacionamento com Acomodação
    acomodacao_id = Column(Integer, ForeignKey('acomodacao.id'), nullable=False)
    acomodacao = relationship('Acomodacao', back_populates='hospedagens')
    
    def __init__(self, cliente_id: int, acomodacao_id: int, entrada: date, saida: date):
        self.cliente_id = cliente_id
        self.acomodacao_id = acomodacao_id
        self.entrada = entrada
        self.saida = saida
    
    def to_dict(self):
        return {
            'id': self.id,
            'cliente_id': self.cliente_id,
            'acomodacao_id': self.acomodacao_id,
            'entrada': str(self.entrada),
            'saida': str(self.saida),
            'cliente': self.cliente.to_dict() if self.cliente else None,
            'acomodacao': self.acomodacao.to_dict() if self.acomodacao else None
        }
    
    @property
    def check_out_pendente(self) -> bool:
        return date.today() <= self.saida