from pydantic import BaseModel
from typing import List
from decimal import Decimal
from schemas.product import Product
from schemas.user import UserRole

class SaleItemBase(BaseModel):
    product_id: int
    quantity: int

class SaleItemCreate(SaleItemBase):
    pass

class SaleBase(BaseModel):
    items: List[SaleItemCreate]
    payment_method: str

class SaleCreate(SaleBase):
    pass

class Sale(SaleBase):
    id: int
    user_id: int
    total_amount: Decimal
    created_at: str
    
    class Config:
        from_attributes = True

