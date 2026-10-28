
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class IndicatorValue(Base):
    __tablename__ = "indicator_values"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    indicator_id: Mapped[int] = mapped_column(
        ForeignKey("indicators.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    year: Mapped[int] = mapped_column(
        nullable=False,
        index=True,
    )

    value: Mapped[float] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    target: Mapped[float | None] = mapped_column(
        Numeric(12, 2),
        nullable=True,
    )

    data_source: Mapped[str] = mapped_column(
        String(100),
        default="NISR",
        nullable=False,
    )

    verification_status: Mapped[str] = mapped_column(
        String(30),
        default="pending_verification",
        server_default="pending_verification",
        nullable=False,
    )

    # Optional geographic information for the Development Gap Map.
    province: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )

    district: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )

    sector_name: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    indicator = relationship(
        "Indicator",
        back_populates="values",
    )
