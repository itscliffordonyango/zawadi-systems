from __future__ import annotations

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database import Base, engine, session_scope
from backend.models import Product, User
from backend.models.user import UserRole
from backend.routes import auth, dashboard, products, sales, users
from backend.auth.security import hash_password

app = FastAPI(title="Zawadi Sales Management API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(sales.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)
    seed_admin_user()
    seed_products()


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


def seed_admin_user() -> None:
    admin_email = os.getenv("DEFAULT_ADMIN_EMAIL", "admin@zawadi.local")
    admin_password = os.getenv("DEFAULT_ADMIN_PASSWORD", "Admin123!")
    with session_scope() as db:
        if not db.query(User).filter(User.email == admin_email).first():
            db.add(
                User(
                    full_name="System Administrator",
                    email=admin_email,
                    password_hash=hash_password(admin_password),
                    role=UserRole.admin,
                    is_active=True,
                )
            )


def seed_products() -> None:
    with session_scope() as db:
        if db.query(Product).count() > 0:
            return
        db.add_all(
            [
                Product(name="Maize Flour 2kg", sku="SKU-MAIZE-2KG", category="Groceries", description="Staple flour bag", selling_price=2.5, cost_price=1.9, stock_quantity=40, min_stock_level=10),
                Product(name="Whole Milk 500ml", sku="SKU-MILK-500", category="Dairy", description="Fresh whole milk", selling_price=0.75, cost_price=0.5, stock_quantity=14, min_stock_level=12),
                Product(name="Laundry Soap", sku="SKU-SOAP-001", category="Cleaning", description="Multipurpose soap bar", selling_price=1.25, cost_price=0.8, stock_quantity=70, min_stock_level=15),
            ]
        )
