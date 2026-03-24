from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal

class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    category: str = Field(..., min_length=1, max_length=100)
    price: Decimal
    cost_price: Decimal
    stock: int = Field(..., ge=0)
    min_stock: int = Field(..., ge=0)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    price: Optional[Decimal]
    cost_price: Optional[Decimal]
    stock: Optional[int] = Field(None, ge=0)
    min_stock: Optional[int] = Field(None, ge=0)

class Product(ProductBase):
    id: int
    created_at: str
    
    class Config:
        from_attributes = True

