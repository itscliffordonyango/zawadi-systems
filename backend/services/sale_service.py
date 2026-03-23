from __future__ import annotations

from decimal import Decimal
from uuid import uuid4

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from backend.models.inventory_log import InventoryLog
from backend.models.product import Product
from backend.models.sale import Sale
from backend.models.sale_item import SaleItem
from backend.models.user import User
from backend.schemas.sale import SaleCreate


class SaleService:
    @staticmethod
    def create_sale(db: Session, payload: SaleCreate, actor: User) -> Sale:
        product_ids = [item.product_id for item in payload.items]
        products = db.scalars(
            select(Product).where(Product.id.in_(product_ids)).with_for_update()
        ).all()
        product_map = {product.id: product for product in products}
        if len(product_map) != len(set(product_ids)):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="One or more products not found")

        total_amount = Decimal("0.00")
        sale = Sale(
            reference=f"SALE-{uuid4().hex[:8].upper()}",
            cashier_id=actor.id,
            payment_method=payload.payment_method,
            total_amount=Decimal("0.00"),
        )
        db.add(sale)
        db.flush()

        for line in payload.items:
            product = product_map[line.product_id]
            if product.stock_quantity < line.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient stock for {product.name}",
                )
            previous_stock = product.stock_quantity
            product.stock_quantity -= line.quantity
            line_total = Decimal(product.selling_price) * line.quantity
            total_amount += line_total
            db.add(
                SaleItem(
                    sale_id=sale.id,
                    product_id=product.id,
                    quantity=line.quantity,
                    unit_price=product.selling_price,
                    line_total=line_total,
                )
            )
            db.add(
                InventoryLog(
                    product_id=product.id,
                    actor_id=actor.id,
                    change_type="sale",
                    quantity_change=-line.quantity,
                    previous_stock=previous_stock,
                    new_stock=product.stock_quantity,
                    note=f"Sale {sale.reference}",
                )
            )
            db.add(product)

        sale.total_amount = total_amount
        db.add(sale)
        db.commit()
        return db.scalar(
            select(Sale)
            .options(joinedload(Sale.items).joinedload(SaleItem.product), joinedload(Sale.cashier))
            .where(Sale.id == sale.id)
        )
