from __future__ import annotations

from collections import defaultdict
from decimal import Decimal

from sqlalchemy import desc, func, select
from sqlalchemy.orm import Session, joinedload

from backend.models.product import Product
from backend.models.sale import Sale
from backend.models.sale_item import SaleItem


class DashboardService:
    @staticmethod
    def get_summary(db: Session) -> dict:
        total_revenue = db.scalar(select(func.coalesce(func.sum(Sale.total_amount), 0))) or Decimal("0.00")
        total_sales = db.scalar(select(func.count(Sale.id))) or 0
        total_products = db.scalar(select(func.count(Product.id))) or 0
        low_stock = db.scalars(select(Product).where(Product.stock_quantity <= Product.min_stock_level).order_by(Product.stock_quantity)).all()

        top_products_rows = db.execute(
            select(Product.name, func.coalesce(func.sum(SaleItem.quantity), 0).label("units_sold"))
            .join(SaleItem, SaleItem.product_id == Product.id, isouter=True)
            .group_by(Product.id)
            .order_by(desc("units_sold"), Product.name)
            .limit(5)
        ).all()

        sales = db.scalars(select(Sale).options(joinedload(Sale.items))).all()
        trend = defaultdict(lambda: Decimal("0.00"))
        for sale in sales:
            trend[sale.created_at.strftime("%Y-%m-%d")] += Decimal(sale.total_amount)

        return {
            "total_revenue": total_revenue,
            "total_sales": total_sales,
            "total_products": total_products,
            "low_stock_count": len(low_stock),
            "top_products": [{"name": name, "units_sold": int(units_sold or 0)} for name, units_sold in top_products_rows],
            "revenue_trend": [
                {"date": date, "amount": amount}
                for date, amount in sorted(trend.items())[-10:]
            ],
            "low_stock_products": [
                {"id": product.id, "name": product.name, "stock_quantity": product.stock_quantity, "min_stock_level": product.min_stock_level}
                for product in low_stock
            ],
        }
