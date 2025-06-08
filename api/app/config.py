from functools import lru_cache

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    openrouter_key: str
    auth0_domain: str
    auth0_audience: str
    auth0_algorithms: str = "RS256"

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()