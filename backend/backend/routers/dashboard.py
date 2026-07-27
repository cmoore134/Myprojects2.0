from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Inventory, Sale, Service
from ..schemas import DashboardResponse


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    total_inventory_items = db.query(Inventory).count()

    total_inventory_quantity = (
        db.query(func.coalesce(func.sum(Inventory.quantity), 0))
        .scalar()
    )

    low_stock_items = (
        db.query(Inventory)
        .filter(Inventory.quantity <= Inventory.low_stock_threshold)
        .count()
    )

    total_services = db.query(Service).count()

    service_categories = (
        db.query(func.count(func.distinct(Service.category)))
        .filter(Service.category.isnot(None))
        .scalar()
        or 0
    )

    average_service_price = (
        db.query(func.coalesce(func.avg(Service.price), 0))
        .scalar()
    )

    total_sales = db.query(Sale).count()

    total_revenue = (
        db.query(func.coalesce(func.sum(Sale.sale_amount), 0))
        .scalar()
    )

    average_sale = (
        db.query(func.coalesce(func.avg(Sale.sale_amount), 0))
        .scalar()
    )

    recent_sales = (
        db.query(Sale)
        .order_by(Sale.sale_date.desc(), Sale.sale_id.desc())
        .limit(5)
        .all()
    )

    return {
        "total_inventory_items": total_inventory_items,
        "total_inventory_quantity": int(total_inventory_quantity),
        "low_stock_items": low_stock_items,
        "total_services": total_services,
        "service_categories": service_categories,
        "average_service_price": float(average_service_price),
        "total_sales": total_sales,
        "total_revenue": float(total_revenue),
        "average_sale": float(average_sale),
        "recent_sales": recent_sales,
    }
