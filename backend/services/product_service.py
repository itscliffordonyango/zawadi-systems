from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.models.inventory_log import InventoryLog
from backend.models.product import Product
from backend.models.user import User
from backend.schemas.inventory import InventoryAdjustmentCreate
from backend.schemas.product import ProductCreate, ProductUpdate


class ProductService:
    @staticmethod
    def create_product(db: Session, payload: ProductCreate, actor: User) -> Product:
        if db.scalar(select(Product).where(Product.sku == payload.sku)):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="SKU already exists")
        product = Product(**payload.model_dump())
        db.add(product)
        db.flush()
        log = InventoryLog(
            product_id=product.id,
            actor_id=actor.id,
            change_type="stock_in",
            quantity_change=product.stock_quantity,
            previous_stock=0,
            new_stock=product.stock_quantity,
            note="Initial stock created with product",
        )
        db.add(log)
        db.commit()
        db.refresh(product)
        return product

    @staticmethod
    def update_product(db: Session, product: Product, payload: ProductUpdate) -> Product:
        for key, value in payload.model_dump(exclude_unset=True).items():
            setattr(product, key, value)
        db.add(product)
        db.commit()
        db.refresh(product)
        return product

    @staticmethod
    def adjust_stock(db: Session, product: Product, payload: InventoryAdjustmentCreate, actor: User) -> Product:
        previous_stock = product.stock_quantity
        new_stock = previous_stock + payload.quantity_change
        if new_stock < 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Stock cannot be negative")
        product.stock_quantity = new_stock
        db.add(product)
        db.add(
            InventoryLog(
                product_id=product.id,
                actor_id=actor.id,
                change_type="stock_in" if payload.quantity_change > 0 else "stock_out",
                quantity_change=payload.quantity_change,
                previous_stock=previous_stock,
                new_stock=new_stock,
                note=payload.note,
            )
        )
        db.commit()
        db.refresh(product)
        return product

    @staticmethod
    def delete_product(db: Session, product: Product) -> None:
        db.delete(product)
        db.commit()
