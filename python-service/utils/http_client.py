import httpx
from config import settings

async def llamar_servicio_java(job_id: int, texto: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.JAVA_SERVICE_URL}",
            json={"jobId": job_id, "texto": texto}
        )
        response.raise_for_status()
