from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from core.config import get_settings
from core.security import verify_password, create_access_token, get_password_hash
from database import get_db
from models.user import User
from schemas.user import UserCreate, Token

router = APIRouter()

settings = get_settings()

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(subject=user.email, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=UserCreate)
def register(user_create: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user_create.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user_create.password)
    db_user = User(**user_create.dict(exclude={"password"}), hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

