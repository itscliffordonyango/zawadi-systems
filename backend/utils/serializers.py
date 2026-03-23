from __future__ import annotations

from backend.models.sale import Sale
from backend.schemas.sale import SaleItemRead, SaleRead


def serialize_sale(sale: Sale) -> SaleRead:
    return SaleRead(
        id=sale.id,
        reference=sale.reference,
        payment_method=sale.payment_method,
        total_amount=sale.total_amount,
        created_at=sale.created_at,
        cashier_name=sale.cashier.full_name,
        items=[
            SaleItemRead(
                id=item.id,
                product_id=item.product_id,
                quantity=item.quantity,
                unit_price=item.unit_price,
                line_total=item.line_total,
                product_name=item.product.name,
            )
            for item in sale.items
        ],
    )
