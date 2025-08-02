from fastapi import FastAPI
from routers.job_router import router as job_router
from database import Base, engine
import uvicorn

# Crea las tablas en la base de datos
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Servicio de Submisión",
    description="API para manejar trabajos de análisis",
    version="1.0.0"
)

# Incluye el router
app.include_router(job_router, prefix="/api/v1")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
