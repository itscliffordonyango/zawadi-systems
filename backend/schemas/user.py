from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    WAREHOUSE_MANAGER = "warehouse_manager"
    SALESPERSON = "salesperson"

class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=1)
    role: UserRole = UserRole.SALESPERSON

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=1)
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=8)
    role: Optional[UserRole] = None

class User(UserBase):
    id: int
    is_active: bool = True
    
    class Config:
        from_attributes = True

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None

