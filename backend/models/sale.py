from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql.expression import func

from models.base import BaseModel

class SaleItem(BaseModel):
    __tablename__ = "sale_items"

    sale_id = Column(Integer, ForeignKey("sales.id"))
    product_id = Column(Integer)
    quantity = Column(Integer)
    price = Column(Float)

class Sale(BaseModel):
    __tablename__ = "sales"

    user_id = Column(Integer)
    payment_method = Column(String)
    total_amount = Column(Float)
    
    items = relationship("SaleItem")

