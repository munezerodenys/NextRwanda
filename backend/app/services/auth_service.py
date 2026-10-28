from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.schemas.auth import LoginRequest, SignupRequest


def get_user_by_email(
    db: Session,
    email: str,
) -> User | None:
    statement = select(User).where(
        User.email == email.lower()
    )

    return db.execute(statement).scalar_one_or_none()


def create_user(
    db: Session,
    user_data: SignupRequest,
) -> User:
    user = User(
        full_name=user_data.full_name,
        email=user_data.email.lower(),
        password_hash=hash_password(user_data.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def authenticate_user(
    db: Session,
    login_data: LoginRequest,
) -> User | None:
    user = get_user_by_email(
        db,
        login_data.email,
    )

    if not user:
        return None

    if not verify_password(
        login_data.password,
        user.password_hash,
    ):
        return None

    return user


def create_user_token(user: User) -> str:
    return create_access_token(
        subject=str(user.id)
    )