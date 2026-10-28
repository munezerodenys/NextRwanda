from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.services.development_intelligence import analyze_development_data

router = APIRouter(
    prefix="/intelligence",
    tags=["Development Intelligence"],
)


class AnalysisRequest(BaseModel):
    sector: str | None = None
    year: int | None = Field(default=None, ge=2000, le=2100)


@router.post("/analyze")
def analyze_data(
    request: AnalysisRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return analyze_development_data(
        db=db,
        sector=request.sector,
        year=request.year,
    )
