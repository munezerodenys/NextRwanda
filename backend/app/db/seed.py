from app.db.session import SessionLocal
from app.models.sector import Sector
from app.models.indicator import Indicator


def seed_database():
    db = SessionLocal()

    try:
        sectors_data = [
            {
                "name": "Education",
                "description": "Education development indicators across Rwanda.",
            },
            {
                "name": "Health",
                "description": "Health and population development indicators across Rwanda.",
            },
            {
                "name": "Employment",
                "description": "Employment and labor market indicators across Rwanda.",
            },
        ]

        for sector_data in sectors_data:
            existing_sector = (
                db.query(Sector)
                .filter(Sector.name == sector_data["name"])
                .first()
            )

            if not existing_sector:
                db.add(
                    Sector(
                        name=sector_data["name"],
                        description=sector_data["description"],
                    )
                )

        db.commit()

        education = (
            db.query(Sector)
            .filter(Sector.name == "Education")
            .first()
        )

        health = (
            db.query(Sector)
            .filter(Sector.name == "Health")
            .first()
        )

        employment = (
            db.query(Sector)
            .filter(Sector.name == "Employment")
            .first()
        )

        indicators_data = [
            {
                "sector": education,
                "name": "Primary School Enrollment Rate",
                "description": "Percentage of children enrolled in primary education.",
                "unit": "%",
            },
            {
                "sector": education,
                "name": "Secondary School Enrollment Rate",
                "description": "Percentage of eligible learners enrolled in secondary education.",
                "unit": "%",
            },
            {
                "sector": education,
                "name": "Youth Literacy Rate",
                "description": "Literacy level among the youth population.",
                "unit": "%",
            },
            {
                "sector": health,
                "name": "Life Expectancy",
                "description": "Average expected years of life at birth.",
                "unit": "years",
            },
            {
                "sector": health,
                "name": "Child Immunization Coverage",
                "description": "Percentage of children receiving recommended vaccinations.",
                "unit": "%",
            },
            {
                "sector": health,
                "name": "Maternal Health Coverage",
                "description": "Coverage of selected maternal health services.",
                "unit": "%",
            },
            {
                "sector": employment,
                "name": "Employment Rate",
                "description": "Percentage of the working-age population that is employed.",
                "unit": "%",
            },
            {
                "sector": employment,
                "name": "Youth Employment Rate",
                "description": "Employment rate among young people.",
                "unit": "%",
            },
            {
                "sector": employment,
                "name": "Labor Force Participation Rate",
                "description": "Percentage of the working-age population participating in the labor force.",
                "unit": "%",
            },
        ]

        for indicator_data in indicators_data:
            existing_indicator = (
                db.query(Indicator)
                .filter(
                    Indicator.name == indicator_data["name"],
                    Indicator.sector_id == indicator_data["sector"].id,
                )
                .first()
            )

            if not existing_indicator:
                db.add(
                    Indicator(
                        sector_id=indicator_data["sector"].id,
                        name=indicator_data["name"],
                        description=indicator_data["description"],
                        unit=indicator_data["unit"],
                        data_source="NISR",
                        framework="NST2",
                    )
                )

        db.commit()

        print("Database seeded successfully.")
        print("Sectors: Education, Health, Employment")
        print("Initial indicators added successfully.")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()