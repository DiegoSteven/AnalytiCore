from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    DB_NAME: str
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    JAVA_SERVICE_URL: str

    class Config:
        env_file = ".env"
        extra = "ignore"
    
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()