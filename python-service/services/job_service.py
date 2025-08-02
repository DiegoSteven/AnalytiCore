from sqlalchemy.orm import Session
from models.job import Job
from schemas.job import JobCreate
from utils.http_client import llamar_servicio_java

def obtener_job(db: Session, job_id: int):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise ValueError("Job no encontrado")
    return job

def crear_job(db: Session, job_data: JobCreate):
    try:
        texto_limpio = job_data.texto.encode("utf-8", errors="ignore").decode("utf-8")
    except Exception as e:
        raise ValueError(f"Error al limpiar el texto: {e}")

    nuevo_job = Job(texto=texto_limpio)
    db.add(nuevo_job)
    db.commit()
    db.refresh(nuevo_job)

    try:
        import asyncio
        asyncio.create_task(
            llamar_servicio_java(nuevo_job.id, texto_limpio)
        )
    except Exception as e:
        print("[ERROR AL LLAMAR SERVICIO JAVA]:", e)

    return nuevo_job