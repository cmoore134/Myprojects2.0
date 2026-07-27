from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Inventory, Sale, Service
from ..schemas import SaleCreate, SaleResponse


router = APIRouter(
    prefix="/sales",
    tags=["Sales"],
)


@router.get("/", response_model=list[SaleResponse])
def get_sales(db: Session = Depends(get_db)):
    return (
        db.query(Sale)
        .order_by(Sale.sale_date.desc(), Sale.sale_id.desc())
        .all()
    )


@router.get("/total")
def get_sales_total(db: Session = Depends(get_db)):
    sales = db.query(Sale).all()

    total_sales = len(sales)
    total_revenue = sum(float(sale.sale_amount) for sale in sales)

    return {
        "total_sales": total_sales,
        "total_revenue": total_revenue,
    }


@router.get("/{sale_id}", response_model=SaleResponse)
def get_sale(
    sale_id: int,
    db: Session = Depends(get_db),
):
    sale = (
        db.query(Sale)
        .filter(Sale.sale_id == sale_id)
        .first()
    )

    if sale is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sale not found",
        )

    return sale


@router.post(
    "/",
    response_model=SaleResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_sale(
    sale_data: SaleCreate,
    db: Session = Depends(get_db),
):
    if sale_data.item_id is None and sale_data.service_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A sale must include an item_id or service_id",
        )

    if sale_data.item_id is not None:
        inventory_item = (
            db.query(Inventory)
            .filter(Inventory.item_id == sale_data.item_id)
            .first()
        )

        if inventory_item is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Inventory item not found",
            )

    if sale_data.service_id is not None:
        service = (
            db.query(Service)
            .filter(Service.service_id == sale_data.service_id)
            .first()
        )

        if service is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Service not found",
            )

    new_sale = Sale(
        item_id=sale_data.item_id,
        service_id=sale_data.service_id,
        price=sale_data.price,
        sale_date=sale_data.sale_date,
        sale_amount=sale_data.sale_amount,
    )

    db.add(new_sale)
    db.commit()
    db.refresh(new_sale)

    return new_sale


@router.delete("/{sale_id}")
def delete_sale(
    sale_id: int,
    db: Session = Depends(get_db),
):
    sale = (
        db.query(Sale)
        .filter(Sale.sale_id == sale_id)
        .first()
    )

    if sale is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sale not found",
        )

    db.delete(sale)
    db.commit()

    return {
        "message": "Sale deleted successfully",
    }
