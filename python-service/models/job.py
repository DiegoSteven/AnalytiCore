from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from database import Base  # <- asegúrate que esta importación está correcta

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    texto = Column(Text, nullable=False)
    estado = Column(String, default="PENDIENTE")
    resultado = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
