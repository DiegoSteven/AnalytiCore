from pydantic import BaseModel

class JobCreate(BaseModel):
    texto: str

class JobResponse(BaseModel):
    id: int
    estado: str
    resultado: str | None

    class Config:
        orm_mode = True
