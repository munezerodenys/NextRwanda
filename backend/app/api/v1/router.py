
from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.education import router as education_router
from app.api.v1.health import router as health_router
from app.api.v1.employment import router as employment_router
from app.api.v1.indicators import router as indicators_router
from app.api.v1.indicator_values import router as indicator_values_router
from app.api.v1.intelligence import router as intelligence_router


api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(dashboard_router)
api_router.include_router(education_router)
api_router.include_router(health_router)
api_router.include_router(employment_router)
api_router.include_router(indicators_router)
api_router.include_router(indicator_values_router)
api_router.include_router(intelligence_router)
