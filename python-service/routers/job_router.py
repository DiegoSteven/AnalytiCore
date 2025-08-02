from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas.job import JobCreate, JobResponse
from services.job_service import crear_job, obtener_job

router = APIRouter()


@router.post("/jobs", response_model=JobResponse)
async def crear(job: JobCreate, db: Session = Depends(get_db)):
    try:
        return crear_job(db, job)
    except Exception as e:
        print("[ERROR EN CREAR JOB]:", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/jobs/{job_id}", response_model=JobResponse)
def consultar(job_id: int, db: Session = Depends(get_db)):
    try:
        return obtener_job(db, job_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Job no encontrado")
