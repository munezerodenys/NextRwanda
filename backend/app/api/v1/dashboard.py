from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.indicator import Indicator
from app.models.indicator_value import IndicatorValue
from app.models.sector import Sector
from app.models.user import User


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/summary")
def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sectors = db.query(Sector).all()

    indicators_count = db.query(Indicator).count()

    sector_data = []

    for sector in sectors:
        indicator_count = (
            db.query(Indicator)
            .filter(Indicator.sector_id == sector.id)
            .count()
        )

        sector_data.append(
            {
                "id": sector.id,
                "name": sector.name,
                "description": sector.description,
                "indicators": indicator_count,
            }
        )

    data_sources = (
        db.query(Indicator.data_source)
        .distinct()
        .all()
    )

    frameworks = (
        db.query(Indicator.framework)
        .distinct()
        .all()
    )

    measurements_count = db.query(IndicatorValue).count()
    verified_measurements = (
        db.query(IndicatorValue)
        .filter(IndicatorValue.verification_status.ilike("verified"))
        .count()
    )
    latest_measurement = (
        db.query(IndicatorValue.year)
        .order_by(IndicatorValue.year.desc())
        .first()
    )

    return {
        "sectors": len(sectors),
        "indicators": indicators_count,
        "data_sources": [source[0] for source in data_sources],
        "frameworks": [framework[0] for framework in frameworks],
        "measurements": measurements_count,
        "verified_measurements": verified_measurements,
        "latest_reporting_year": (
            latest_measurement[0] if latest_measurement else None
        ),
        "sector_data": sector_data,
    }