from sqlalchemy import Column, Integer, String, Float
from models.base import BaseModel

class Product(BaseModel):
    __tablename__ = "products"

    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    cost_price = Column(Float)
    stock = Column(Integer, default=0)
    min_stock = Column(Integer, default=0)

