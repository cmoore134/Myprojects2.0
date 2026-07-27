from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class Inventory(Base):
    __tablename__ = "inventory"

    item_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )
    name: Mapped[str] = mapped_column(String, nullable=False)
    category: Mapped[str | None] = mapped_column(String, nullable=True)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    low_stock_threshold: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=5,
    )
    expiration_date: Mapped[date | None] = mapped_column(Date, nullable=True)

    sales: Mapped[list["Sale"]] = relationship(back_populates="inventory_item")
    alerts: Mapped[list["Alert"]] = relationship(back_populates="inventory_item")
    purchases: Mapped[list["Purchase"]] = relationship(back_populates="inventory_item")


InventoryItem = Inventory


class Service(Base):
    __tablename__ = "service"

    service_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    price: Mapped[int] = mapped_column(Integer, nullable=False)
    category: Mapped[str | None] = mapped_column(String, nullable=True)

    sales: Mapped[list["Sale"]] = relationship(back_populates="service")


class Sale(Base):
    __tablename__ = "sale"

    sale_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    item_id: Mapped[int | None] = mapped_column(
        ForeignKey("inventory.item_id"),
        nullable=True,
    )
    service_id: Mapped[int | None] = mapped_column(
        ForeignKey("service.service_id"),
        nullable=True,
    )
    price: Mapped[int] = mapped_column(Integer, nullable=False)
    sale_date: Mapped[date] = mapped_column(Date, nullable=False)
    sale_amount: Mapped[int] = mapped_column(Integer, nullable=False)

    inventory_item: Mapped["Inventory | None"] = relationship(back_populates="sales")
    service: Mapped["Service | None"] = relationship(back_populates="sales")


class Alert(Base):
    __tablename__ = "alert"

    alert_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    item_id: Mapped[int] = mapped_column(
        ForeignKey("inventory.item_id"),
        nullable=False,
    )
    alert_type: Mapped[str] = mapped_column(String, nullable=False)
    alert_message: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    inventory_item: Mapped["Inventory"] = relationship(back_populates="alerts")


class Purchase(Base):
    __tablename__ = "purchase"

    order_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    item_id: Mapped[int] = mapped_column(
        ForeignKey("inventory.item_id"),
        nullable=False,
    )
    order_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False, default="pending")
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)

    inventory_item: Mapped["Inventory"] = relationship(back_populates="purchases")


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    item_id: Mapped[int | None] = mapped_column(
        ForeignKey("inventory.item_id"),
        nullable=True,
    )
    transaction_type: Mapped[str] = mapped_column(String, nullable=False)
    quantity_changed: Mapped[int] = mapped_column(Integer, nullable=False)
    timestamp: Mapped[str | None] = mapped_column(String, nullable=True)
