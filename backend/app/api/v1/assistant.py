from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.services.development_intelligence import analyze_development_data


router = APIRouter(
    prefix="/assistant",
    tags=["Development Intelligence Assistant"],
)


class AssistantRequest(BaseModel):
    message: str = Field(min_length=3, max_length=1000)
    sector: str | None = None
    year: int | None = Field(default=None, ge=2000, le=2100)


def build_evidence_answer(message: str, analysis: dict) -> tuple[str, list[dict]]:
    normalized_message = message.lower()

    if "missing target" in normalized_message or "missing targets" in normalized_message:
        records = analysis["missing_target_records"]
        category = "missing targets"
    elif "pending" in normalized_message or "verification" in normalized_message:
        records = analysis["pending_verification_records"]
        category = "pending or unverified measurements"
    elif "below" in normalized_message or "target" in normalized_message:
        records = analysis["below_target_records"]
        category = "measurements below their configured targets"
    else:
        records = analysis["below_target_records"]
        category = "records that may need review"

    if not records:
        return (
            f"No database records matched this question for {category}. "
            "That does not prove that no issue exists; the connected evidence may be incomplete.",
            [],
        )

    return (
        f"I found {len(records)} database record(s) in the {category}. "
        "Review the supporting evidence before treating this as a policy conclusion.",
        records,
    )


@router.post("/chat")
def chat(
    request: AssistantRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    analysis = analyze_development_data(
        db=db,
        sector=request.sector,
        year=request.year,
    )
    answer, evidence = build_evidence_answer(request.message, analysis)

    return {
        "answer": answer,
        "mode": "deterministic_evidence",
        "evidence": evidence,
        "limitations": analysis["limitations"],
    }