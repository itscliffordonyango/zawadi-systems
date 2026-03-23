from decimal import Decimal

from .common import ORMModel


class DashboardSummary(ORMModel):
    total_revenue: Decimal
    total_sales: int
    total_products: int
    low_stock_count: int
    top_products: list[dict]
    revenue_trend: list[dict]
    low_stock_products: list[dict]
