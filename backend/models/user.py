from sqlalchemy import Boolean, Column, Integer, String
from core.security import verify_password, get_password_hash

from models.base import BaseModel

class User(BaseModel):
    __tablename__ = "users"

    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False, default="salesperson")
    is_active = Column(Boolean, default=True)

    def verify_password(self, password: str) -> bool:
        return verify_password(password, self.hashed_password)

