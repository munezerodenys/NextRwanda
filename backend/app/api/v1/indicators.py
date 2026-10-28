
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.indicator import Indicator
from app.models.sector import Sector
from app.models.user import User


router = APIRouter(
    prefix="/indicators",
    tags=["Indicators"],
)


@router.get("/")
def get_indicators(
    sector: str | None = Query(default=None),
    search: str | None = Query(default=None),
    framework: str | None = Query(default=None),
    data_source: str | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = (
        db.query(Indicator, Sector.name.label("sector_name"))
        .join(Sector, Indicator.sector_id == Sector.id)
    )

    if sector:
        query = query.filter(Sector.name.ilike(f"%{sector.strip()}%"))

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            Indicator.name.ilike(search_term)
            | Indicator.description.ilike(search_term)
        )

    if framework:
        query = query.filter(
            Indicator.framework.ilike(f"%{framework.strip()}%")
        )

    if data_source:
        query = query.filter(
            Indicator.data_source.ilike(f"%{data_source.strip()}%")
        )

    total = query.count()

    results = (
        query.order_by(Sector.name, Indicator.name)
        .offset(offset)
        .limit(limit)
        .all()
    )

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "indicators": [
            {
                "id": indicator.id,
                "name": indicator.name,
                "description": indicator.description,
                "unit": indicator.unit,
                "data_source": indicator.data_source,
                "framework": indicator.framework,
                "sector": sector_name,
                "created_at": indicator.created_at,
                "updated_at": indicator.updated_at,
            }
            for indicator, sector_name in results
        ],
    }