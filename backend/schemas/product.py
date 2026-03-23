from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from pydantic import Field

from .common import ORMModel


class ProductBase(ORMModel):
    name: str = Field(min_length=2, max_length=180)
    sku: str = Field(min_length=2, max_length=80)
    category: str = Field(min_length=2, max_length=80)
    description: str | None = None
    selling_price: Decimal = Field(gt=0)
    cost_price: Decimal = Field(ge=0)
    stock_quantity: int = Field(ge=0)
    min_stock_level: int = Field(ge=0)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(ORMModel):
    name: str | None = Field(default=None, min_length=2, max_length=180)
    sku: str | None = Field(default=None, min_length=2, max_length=80)
    category: str | None = Field(default=None, min_length=2, max_length=80)
    description: str | None = None
    selling_price: Decimal | None = Field(default=None, gt=0)
    cost_price: Decimal | None = Field(default=None, ge=0)
    stock_quantity: int | None = Field(default=None, ge=0)
    min_stock_level: int | None = Field(default=None, ge=0)


class ProductRead(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
