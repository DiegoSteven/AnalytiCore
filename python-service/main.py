from fastapi import FastAPI
from routers import job_router

app = FastAPI(title="Servicio de Submisión")

app.include_router(job_router.router)
