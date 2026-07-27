from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Inventory, Transaction
from .. import schemas

router = APIRouter(prefix="/purchases", tags=["purchases"])


@router.post("/", status_code=status.HTTP_201_CREATED)
def make_purchase(purchase: schemas.PurchaseCreate, db: Session = Depends(get_db)):
    item = db.query(Inventory).filter(Inventory.item_id == purchase.item_id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    item.quantity += purchase.quantity_bought

    timestamp_value = None
    if purchase.timestamp is not None:
        timestamp_value = (
            purchase.timestamp.isoformat()
            if hasattr(purchase.timestamp, "isoformat")
            else str(purchase.timestamp)
        )

    new_transaction = Transaction(
        item_id=purchase.item_id,
        transaction_type="PURCHASE",
        quantity_changed=purchase.quantity_bought,
        timestamp=timestamp_value,
    )

    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)

    return {"message": "Purchase recorded", "transaction": new_transaction}


@router.get("/")
def get_purchases(db: Session = Depends(get_db)):
    return db.query(Transaction).order_by(Transaction.id.desc()).all()
