from app.db.session import SessionLocal
from app.models.indicator import Indicator
from app.models.indicator_value import IndicatorValue


def seed_indicator_values():
    db = SessionLocal()

    try:
        indicators = db.query(Indicator).all()

        if not indicators:
            print("No indicators found.")
            return

        # Demo values for development and UI testing.
        # Replace these with verified NISR data before production use.
        demo_data = {
            "Primary School Enrollment Rate": {
                2022: (94.2, 96.0),
                2023: (95.1, 97.0),
                2024: (96.0, 98.0),
                2025: (96.8, 98.5),
            },
            "Secondary School Enrollment Rate": {
                2022: (38.5, 42.0),
                2023: (40.1, 44.0),
                2024: (41.8, 46.0),
                2025: (43.2, 48.0),
            },
            "Youth Literacy Rate": {
                2022: (88.4, 90.0),
                2023: (89.1, 91.0),
                2024: (90.0, 92.0),
                2025: (90.8, 93.0),
            },
            "Employment Rate": {
                2022: (68.2, 70.0),
                2023: (69.1, 71.0),
                2024: (70.0, 72.0),
                2025: (70.8, 73.0),
            },
            "Labor Force Participation Rate": {
                2022: (63.5, 66.0),
                2023: (64.2, 67.0),
                2024: (65.0, 68.0),
                2025: (65.7, 69.0),
            },
            "Youth Employment Rate": {
                2022: (42.1, 45.0),
                2023: (43.5, 47.0),
                2024: (45.0, 49.0),
                2025: (46.2, 51.0),
            },
            "Child Immunization Coverage": {
                2022: (91.5, 93.0),
                2023: (92.4, 94.0),
                2024: (93.2, 95.0),
                2025: (94.0, 96.0),
            },
            "Life Expectancy": {
                2022: (69.1, 70.0),
                2023: (69.5, 70.5),
                2024: (69.9, 71.0),
                2025: (70.3, 71.5),
            },
            "Maternal Health Coverage": {
                2022: (87.2, 90.0),
                2023: (88.4, 91.0),
                2024: (89.5, 92.0),
                2025: (90.3, 93.0),
            },
        }

        inserted = 0

        for indicator in indicators:
            yearly_data = demo_data.get(indicator.name)

            if not yearly_data:
                print(f"No demo data configured for: {indicator.name}")
                continue

            for year, (value, target) in yearly_data.items():
                existing = (
                    db.query(IndicatorValue)
                    .filter(
                        IndicatorValue.indicator_id == indicator.id,
                        IndicatorValue.year == year,
                    )
                    .first()
                )

                if existing:
                    continue

                record = IndicatorValue(
                    indicator_id=indicator.id,
                    year=year,
                    value=value,
                    target=target,
                    data_source="NISR",
                    notes="Demo data for NexRwanda development and UI testing.",
                )

                db.add(record)
                inserted += 1

        db.commit()

        print(f"Successfully inserted {inserted} indicator values.")

    except Exception as exc:
        db.rollback()
        print(f"Error: {exc}")
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_indicator_values()