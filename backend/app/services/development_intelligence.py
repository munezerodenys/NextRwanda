
from sqlalchemy.orm import Session

from app.models.indicator import Indicator
from app.models.indicator_value import IndicatorValue
from app.models.sector import Sector


def analyze_development_data(
    db: Session,
    sector: str | None = None,
    year: int | None = None,
) -> dict:
    """
    Analyze saved NexRwanda records.
    This is deterministic database analysis, not an AI-generated answer.
    """

    query = (
        db.query(Indicator, Sector.name.label("sector_name"))
        .join(Sector, Indicator.sector_id == Sector.id)
        .order_by(Sector.name, Indicator.name)
    )

    if sector:
        query = query.filter(
            Sector.name.ilike(f"%{sector.strip()}%")
        )

    indicators = query.all()
    results = []
    below_target = []
    missing_targets = []
    pending_verification = []
    demonstration_records = []

    for indicator, sector_name in indicators:
        value_query = db.query(IndicatorValue).filter(
            IndicatorValue.indicator_id == indicator.id
        )

        if year is not None:
            value_query = value_query.filter(
                IndicatorValue.year == year
            )

        values = value_query.order_by(
            IndicatorValue.year.desc(),
            IndicatorValue.id.desc(),
        ).all()

        records = []

        for item in values:
            target = (
                float(item.target)
                if item.target is not None
                else None
            )
            actual = float(item.value)

            notes = (item.notes or "").lower()
            is_demo = (
                "demo" in notes
                or "demonstration" in notes
            )

            record = {
                "measurement_id": item.id,
                "indicator_id": indicator.id,
                "indicator": indicator.name,
                "sector": sector_name,
                "year": item.year,
                "value": actual,
                "unit": indicator.unit,
                "target": target,
                "data_source": item.data_source,
                "verification_status": item.verification_status,
                "province": item.province,
                "district": item.district,
                "is_demonstration_data": is_demo,
                "notes": item.notes,
            }
            records.append(record)

            status = (item.verification_status or "").lower()

            if status != "verified":
                pending_verification.append(record)

            if is_demo:
                demonstration_records.append(record)

            # Only compare when a target is actually recorded.
            # This generic comparison assumes higher is better,
            # so it is not used to label a record "off track."
            if target is None:
                missing_targets.append(record)
            elif actual < target:
                below_target.append(record)

        results.append(
            {
                "indicator_id": indicator.id,
                "indicator": indicator.name,
                "description": indicator.description,
                "sector": sector_name,
                "unit": indicator.unit,
                "data_source": indicator.data_source,
                "framework": indicator.framework,
                "measurement_count": len(records),
                "measurements": records,
            }
        )

    return {
        "filters": {
            "sector": sector,
            "year": year,
        },
        "summary": {
            "indicators_analyzed": len(results),
            "measurements_analyzed": sum(
                len(item["measurements"]) for item in results
            ),
            "measurements_below_target": len(below_target),
            "measurements_missing_targets": len(missing_targets),
            "measurements_pending_or_unverified": len(
                pending_verification
            ),
            "demonstration_measurements": len(
                demonstration_records
            ),
        },
        "below_target_records": below_target,
        "missing_target_records": missing_targets,
        "pending_verification_records": pending_verification,
        "demonstration_records": demonstration_records,
        "indicators": results,
        "limitations": [
            "A source label does not independently verify provenance.",
            "Demonstration data must not be presented as official statistics.",
            "A value below a target is not automatically proof of being off track.",
            "Indicator directionality must be confirmed before interpreting performance.",
            "Missing targets cannot be treated as zero.",
        ],
    }
