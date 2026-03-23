from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from pydantic import Field

from .common import ORMModel


class SaleItemCreate(ORMModel):
    product_id: int
    quantity: int = Field(gt=0)


class SaleCreate(ORMModel):
    payment_method: str = Field(min_length=2, max_length=40)
    items: list[SaleItemCreate] = Field(min_length=1)


class SaleItemRead(ORMModel):
    id: int
    product_id: int
    quantity: int
    unit_price: Decimal
    line_total: Decimal
    product_name: str


class SaleRead(ORMModel):
    id: int
    reference: str
    payment_method: str
    total_amount: Decimal
    created_at: datetime
    cashier_name: str
    items: list[SaleItemRead]
