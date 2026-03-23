from __future__ import annotations

from datetime import datetime

from pydantic import EmailStr, Field

from backend.models.user import UserRole
from .common import ORMModel


class UserCreate(ORMModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=64)
    role: UserRole = UserRole.salesperson


class UserUpdate(ORMModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=120)
    email: EmailStr | None = None
    password: str | None = Field(default=None, min_length=8, max_length=64)
    role: UserRole | None = None
    is_active: bool | None = None


class UserRead(ORMModel):
    id: int
    full_name: str
    email: EmailStr
    role: UserRole
    is_active: bool
    created_at: datetime
