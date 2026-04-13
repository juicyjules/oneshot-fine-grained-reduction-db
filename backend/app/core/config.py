from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Fine-Grained Reduction Database (FGRDB)"
    DATABASE_URL: str = "sqlite:///./fgrdb.sqlite3"
    SECRET_KEY: str = "supersecretkey" # In production, load from env

    class Config:
        env_file = ".env"

settings = Settings()
