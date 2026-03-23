from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from backend.auth.dependencies import get_current_user
from backend.database import get_db
from backend.models.sale import Sale
from backend.models.sale_item import SaleItem
from backend.models.user import User
from backend.schemas.sale import SaleCreate, SaleRead
from backend.services.sale_service import SaleService
from backend.utils.serializers import serialize_sale

router = APIRouter(prefix="/sales", tags=["Sales"])


@router.get("", response_model=list[SaleRead])
def list_sales(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    sales = db.scalars(
        select(Sale)
        .options(joinedload(Sale.items).joinedload(SaleItem.product), joinedload(Sale.cashier))
        .order_by(Sale.created_at.desc())
    ).unique().all()
    return [serialize_sale(sale) for sale in sales]


@router.post("", response_model=SaleRead)
def create_sale(
    payload: SaleCreate,
    actor: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return serialize_sale(SaleService.create_sale(db, payload, actor))
