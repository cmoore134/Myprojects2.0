from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas
from datetime import date

router = APIRouter(prefix="/expiration", tags=["expiration"])


@router.get("/")
def get_expiring_items(db: Session = Depends(get_db)):
    # Query items that have an expiration date
    # You can customize this to only show items within X days if you want
    return db.query(models.Inventory).filter(models.Inventory.expiration_date != None).all()


@router.delete("/{item_id}")
def resolve_expiration(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Inventory).filter(models.Inventory.item_id == item_id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    db.delete(item)
    db.commit()
    
    return {"message": "Expiration resolved successfully"}
