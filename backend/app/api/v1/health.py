from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.indicator import Indicator
from app.models.sector import Sector
from app.models.user import User


router = APIRouter(
    prefix="/health",
    tags=["Health"],
)


@router.get("/indicators")
def get_health_indicators(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sector = (
        db.query(Sector)
        .filter(Sector.name.ilike("Health"))
        .first()
    )

    if not sector:
        return {
            "sector": "Health",
            "indicators": [],
        }

    indicators = (
        db.query(Indicator)
        .filter(Indicator.sector_id == sector.id)
        .order_by(Indicator.id)
        .all()
    )

    return {
        "sector": sector.name,
        "description": sector.description,
        "indicators": [
            {
                "id": indicator.id,
                "name": indicator.name,
                "description": indicator.description,
                "unit": indicator.unit,
                "data_source": indicator.data_source,
                "framework": indicator.framework,
            }
            for indicator in indicators
        ],
    }