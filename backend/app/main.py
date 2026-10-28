from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.api.v1.router import api_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine

from app.models.user import User
from app.models.sector import Sector
from app.models.indicator import Indicator
from app.models.indicator_value import IndicatorValue


app = FastAPI(
    title=settings.app_name,
    description="National Development Intelligence Platform API",
    version=settings.app_version,
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        *settings.allowed_origins_list,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create database tables
Base.metadata.create_all(bind=engine)


# Register API routes
app.include_router(
    api_router,
    prefix=settings.api_v1_prefix,
)


@app.get("/")
def root():
    return {
        "message": "Welcome to NexRwanda API",
        "status": "running",
        "version": settings.app_version,
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.app_name,
    }


@app.get("/health/readiness")
def readiness_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "status": "not_ready",
                "service": settings.app_name,
                "database": "unavailable",
                "error": str(exc) if settings.debug else "Database unavailable",
            },
        ) from exc

    return {
        "status": "ready",
        "service": settings.app_name,
        "database": "available",
    }