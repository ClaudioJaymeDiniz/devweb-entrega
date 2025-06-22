from sqlalchemy import Column, Integer, String, Boolean, Enum as SQLAlchemyEnum
from sqlalchemy.orm import relationship
from database import Base
import enum

class NomeAcomodacao(str, enum.Enum):
    SolteiroSimples = 'Acomodação simples para solteiro(a)'
    CasalSimples = 'Acomodação simples para casal'
    FamilaSimples = 'Acomodação para família com até duas crianças'
    FamiliaMais = 'Acomodação para família com até cinco crianças'
    SolteiroMais = 'Acomodação com garagem para solteiro(a)'
    FamiliaSuper = 'Acomodação para até duas familias, casal e três crianças cada'

class Acomodacao(Base):
    __tablename__ = 'acomodacao'
    
    id = Column(Integer, primary_key=True, index=True)
    nome_acomodacao = Column(SQLAlchemyEnum(NomeAcomodacao), nullable=False)
    cama_solteiro = Column(Integer, nullable=False, default=0)
    cama_casal = Column(Integer, nullable=False, default=0)
    suite = Column(Integer, nullable=False, default=0)
    climatizacao = Column(Boolean, nullable=False, default=False)
    garagem = Column(Integer, nullable=False, default=0)
    
    # Relacionamento com Hospedagem
    hospedagens = relationship('Hospedagem', back_populates='acomodacao')
    
    def __init__(self, nome_acomodacao: NomeAcomodacao, cama_solteiro: int, cama_casal: int,
                 suite: int, climatizacao: bool, garagem: int):
        self.nome_acomodacao = nome_acomodacao
        self.cama_solteiro = cama_solteiro
        self.cama_casal = cama_casal
        self.suite = suite
        self.climatizacao = climatizacao
        self.garagem = garagem
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome_acomodacao': self.nome_acomodacao,
            'cama_solteiro': self.cama_solteiro,
            'cama_casal': self.cama_casal,
            'suite': self.suite,
            'climatizacao': self.climatizacao,
            'garagem': self.garagem
        }