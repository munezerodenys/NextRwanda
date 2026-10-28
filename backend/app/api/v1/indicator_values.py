
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.indicator import Indicator
from app.models.indicator_value import IndicatorValue
from app.models.sector import Sector
from app.models.user import User


router = APIRouter(
    prefix="/indicator-values",
    tags=["Indicator Values"],
)


@router.get("/")
def get_indicator_values(
    indicator_id: int | None = Query(default=None),
    year: int | None = Query(default=None),
    sector: str | None = Query(default=None),
    data_source: str | None = Query(default=None),
    verification_status: str | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = (
        db.query(
            IndicatorValue,
            Indicator.name.label("indicator_name"),
        )
        .join(Indicator, IndicatorValue.indicator_id == Indicator.id)
        .join(Sector, Indicator.sector_id == Sector.id)
    )

    if indicator_id is not None:
        query = query.filter(
            IndicatorValue.indicator_id == indicator_id
        )

    if year is not None:
        query = query.filter(
            IndicatorValue.year == year
        )

    if sector:
        query = query.filter(
            Sector.name.ilike(f"%{sector.strip()}%")
        )

    if data_source:
        query = query.filter(
            IndicatorValue.data_source.ilike(f"%{data_source.strip()}%")
        )

    if verification_status:
        query = query.filter(
            IndicatorValue.verification_status.ilike(
                f"%{verification_status.strip()}%"
            )
        )

    total = query.count()
    results = (
        query
        .order_by(
            Indicator.name,
            IndicatorValue.year.desc(),
        )
        .offset(offset)
        .limit(limit)
        .all()
    )

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "values": [
            {
                "id": value.id,
                "indicator_id": value.indicator_id,
                "indicator_name": indicator_name,
                "year": value.year,
                "value": float(value.value),
                "target": (
                    float(value.target)
                    if value.target is not None
                    else None
                ),
                "data_source": value.data_source,
                "verification_status": value.verification_status,
                "province": value.province,
                "district": value.district,
                "sector_name": value.sector_name,
                "notes": value.notes,
                "created_at": value.created_at,
                "updated_at": value.updated_at,
            }
            for value, indicator_name in results
        ],
    }


@router.get("/{indicator_id}")
def get_indicator_value_history(
    indicator_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    indicator = (
        db.query(Indicator)
        .filter(Indicator.id == indicator_id)
        .first()
    )

    if not indicator:
        raise HTTPException(
            status_code=404,
            detail="Indicator not found",
        )

    values = (
        db.query(IndicatorValue)
        .filter(
            IndicatorValue.indicator_id == indicator_id
        )
        .order_by(IndicatorValue.year)
        .all()
    )

    return {
        "indicator": {
            "id": indicator.id,
            "name": indicator.name,
            "unit": indicator.unit,
            "data_source": indicator.data_source,
            "framework": indicator.framework,
        },
        "values": [
            {
                "id": value.id,
                "year": value.year,
                "value": float(value.value),
                "target": (
                    float(value.target)
                    if value.target is not None
                    else None
                ),
                "data_source": value.data_source,
                "verification_status": value.verification_status,
                "province": value.province,
                "district": value.district,
                "sector_name": value.sector_name,
                "notes": value.notes,
            }
            for value in values
        ],
    }
