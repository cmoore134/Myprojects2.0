from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Service
from ..schemas import ServiceCreate, ServiceResponse, ServiceUpdate


router = APIRouter(
    prefix="/services",
    tags=["Services"],
)


@router.get("/", response_model=list[ServiceResponse])
def get_services(db: Session = Depends(get_db)):
    return (
        db.query(Service)
        .order_by(Service.service_id.asc())
        .all()
    )


@router.get("/{service_id}", response_model=ServiceResponse)
def get_service(
    service_id: int,
    db: Session = Depends(get_db),
):
    service = (
        db.query(Service)
        .filter(Service.service_id == service_id)
        .first()
    )

    if service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found",
        )

    return service


@router.post(
    "/",
    response_model=ServiceResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_service(
    service_data: ServiceCreate,
    db: Session = Depends(get_db),
):
    new_service = Service(
        name=service_data.name,
        description=service_data.description,
        price=service_data.price,
        category=service_data.category,
    )

    db.add(new_service)
    db.commit()
    db.refresh(new_service)

    return new_service


@router.put("/{service_id}", response_model=ServiceResponse)
def update_service(
    service_id: int,
    service_data: ServiceUpdate,
    db: Session = Depends(get_db),
):
    service = (
        db.query(Service)
        .filter(Service.service_id == service_id)
        .first()
    )

    if service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found",
        )

    update_data = service_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(service, field, value)

    db.commit()
    db.refresh(service)

    return service


@router.delete("/{service_id}")
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
):
    service = (
        db.query(Service)
        .filter(Service.service_id == service_id)
        .first()
    )

    if service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found",
        )

    db.delete(service)
    db.commit()

    return {
        "message": "Service deleted successfully",
    }
