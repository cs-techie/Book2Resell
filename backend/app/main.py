from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .db import Base, engine, SessionLocal
from .routers import auth as auth_router
from .routers import books as books_router
from .routers import admin as admin_router
from .utils.seed import seed


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name)

    # CORS configuration - supports both development and production
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list if settings.cors_origins else ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # DB setup
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed(db)

    # Routers
    app.include_router(auth_router.router)
    app.include_router(books_router.router)
    app.include_router(admin_router.router)

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    return app


app = create_app()
