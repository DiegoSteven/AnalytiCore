from pydantic import BaseModel
from datetime import datetime

class JobCreate(BaseModel):
    texto: str

class JobResponse(BaseModel):
    id: int
    estado: str
    resultado: str | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Cambiado de orm_mode para Pydantic v2