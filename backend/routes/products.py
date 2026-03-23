from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from backend.auth.dependencies import get_current_user, require_roles
from backend.database import get_db
from backend.models.inventory_log import InventoryLog
from backend.models.product import Product
from backend.models.user import User, UserRole
from backend.schemas.inventory import InventoryAdjustmentCreate, InventoryLogRead
from backend.schemas.product import ProductCreate, ProductRead, ProductUpdate
from backend.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=list[ProductRead])
def list_products(
    search: str | None = Query(default=None),
    category: str | None = Query(default=None),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    stmt = select(Product).order_by(Product.created_at.desc())
    if search:
        like = f"%{search}%"
        stmt = stmt.where(or_(Product.name.ilike(like), Product.sku.ilike(like)))
    if category:
        stmt = stmt.where(Product.category == category)
    return db.scalars(stmt).all()


@router.post("", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    actor: User = Depends(require_roles(UserRole.admin, UserRole.warehouse_manager)),
    db: Session = Depends(get_db),
):
    return ProductService.create_product(db, payload, actor)


@router.put("/{product_id}", response_model=ProductRead)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    _: User = Depends(require_roles(UserRole.admin, UserRole.warehouse_manager)),
    db: Session = Depends(get_db),
):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return ProductService.update_product(db, product, payload)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    _: User = Depends(require_roles(UserRole.admin)),
    db: Session = Depends(get_db),
):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    ProductService.delete_product(db, product)


@router.post("/{product_id}/adjust", response_model=ProductRead)
def adjust_product_stock(
    product_id: int,
    payload: InventoryAdjustmentCreate,
    actor: User = Depends(require_roles(UserRole.admin, UserRole.warehouse_manager)),
    db: Session = Depends(get_db),
):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return ProductService.adjust_stock(db, product, payload, actor)


@router.get("/{product_id}/logs", response_model=list[InventoryLogRead])
def get_product_logs(
    product_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    if not db.get(Product, product_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return db.scalars(select(InventoryLog).where(InventoryLog.product_id == product_id).order_by(InventoryLog.created_at.desc())).all()
