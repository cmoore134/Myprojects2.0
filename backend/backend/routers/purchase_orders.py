from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Inventory, Purchase
from ..schemas import PurchaseOrderCreate

router = APIRouter(prefix="/purchase_orders", tags=["purchase_orders"])


@router.get("/")
def get_purchase_orders(db: Session = Depends(get_db)):
    rows = db.query(Purchase).order_by(Purchase.order_id.desc()).all()
    result = []
    for p in rows:
        result.append(
            {
                "order_id": p.order_id,
                "item_id": p.item_id,
                "order_date": p.order_date.isoformat() if p.order_date is not None else None,
                "status": p.status,
                "quantity": p.quantity,
            }
        )
    return result


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_purchase_order(order: PurchaseOrderCreate, db: Session = Depends(get_db)):
    item = db.query(Inventory).filter(Inventory.item_id == order.item_id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    new_order = Purchase(
        item_id=order.item_id,
        order_date=order.order_date,
        status=order.status,
        quantity=order.quantity,
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return {
        "order_id": new_order.order_id,
        "item_id": new_order.item_id,
        "order_date": new_order.order_date.isoformat(),
        "status": new_order.status,
        "quantity": new_order.quantity,
    }


@router.delete("/{order_id}")
def delete_purchase_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Purchase).filter(Purchase.order_id == order_id).first()
    if order is None:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    
    db.delete(order)
    db.commit()
    
    return {"message": "Purchase order deleted successfully"}
