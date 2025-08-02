from pydantic_settings import BaseSettings  # correcto en v2

class Settings:
    DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/analyti_core_db"
    JAVA_SERVICE_URL = "http://localhost:8080/analyze"

settings = Settings()
