from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Book2Resell API"
    secret_key: str = "CHANGE_ME_DEV_ONLY"
    access_token_expire_minutes: int = 60 * 24
    algorithm: str = "HS256"
    database_url: str = "postgresql://postgres:hello@123@db.jelloiizczaxugxaxavr.supabase.co:5432/postgres"
    admin_email: str = "admin@book2resell.com"
    admin_password: str = "admin123"
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    class Config:
        env_file = ".env"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]


settings = Settings()

