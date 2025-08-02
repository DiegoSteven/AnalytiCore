import httpx
from config import settings

async def llamar_servicio_java(job_id: int, texto: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{settings.JAVA_SERVICE_URL}",
                json={"id": job_id, "texto": texto},
                timeout=30.0
            )
            response.raise_for_status()
            return response.json()
    except Exception as e:
        print(f"Error llamando al servicio Java para job {job_id}: {e}")
        raise