from pydantic import BaseModel
from typing import Optional

class TelefoneBase(BaseModel):
    ddd: str
    numero: str

class TelefoneCreate(TelefoneBase):
    pass

class TelefoneUpdate(TelefoneBase):
    pass

class TelefoneResponse(TelefoneBase):
    id: int
    titular_id: int

    class Config:
        from_attributes = True