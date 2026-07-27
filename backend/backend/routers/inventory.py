from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Inventory
from .. import schemas

router = APIRouter(prefix="/inventory", tags=["inventory"])


@router.post("/", response_model=schemas.Inventory, status_code=status.HTTP_201_CREATED)
def create_item(item: schemas.InventoryCreate, db: Session = Depends(get_db)):
    new_item = Inventory(
        name=item.name,
        category=item.category,
        quantity=item.quantity,
        low_stock_threshold=item.low_stock_threshold,
        expiration_date=item.expiration_date,
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item


@router.get("/", response_model=list[schemas.Inventory])
def get_items(db: Session = Depends(get_db)):
    return db.query(Inventory).order_by(Inventory.item_id.asc()).all()


@router.get("/{item_id}", response_model=schemas.Inventory)
def get_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Inventory).filter(Inventory.item_id == item_id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.put("/{item_id}", response_model=schemas.Inventory)
def update_item(item_id: int, item_update: schemas.InventoryUpdate, db: Session = Depends(get_db)):
    item = db.query(Inventory).filter(Inventory.item_id == item_id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    update_data = item_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Inventory).filter(Inventory.item_id == item_id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    db.delete(item)
    db.commit()
    
    return {"message": "Item deleted successfully"}
