from __future__ import annotations

from datetime import datetime

from pydantic import Field

from .common import ORMModel


class InventoryAdjustmentCreate(ORMModel):
    quantity_change: int = Field(ne=0)
    note: str | None = Field(default=None, max_length=500)


class InventoryLogRead(ORMModel):
    id: int
    product_id: int
    actor_id: int
    change_type: str
    quantity_change: int
    previous_stock: int
    new_stock: int
    note: str | None
    created_at: datetime
