from pydantic import EmailStr, Field

from .common import ORMModel
from .user import UserRead


class LoginRequest(ORMModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=64)


class TokenResponse(ORMModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead
