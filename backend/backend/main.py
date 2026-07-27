from fastapi import FastAPI

from .database import Base, engine
from .routers import (
    alerts,
    dashboard,
    expiration,
    inventory,
    purchases,
    purchase_orders,
    sales,
    services,
)


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Inventory Management API",
    description="Backend API for the Inventory Management System",
    version="1.0.0",
)

# Add CORS so frontend dev server can call the API
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3002",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sales.router)
app.include_router(services.router)
app.include_router(alerts.router)
app.include_router(dashboard.router)
app.include_router(inventory.router)
app.include_router(purchases.router)
app.include_router(purchase_orders.router)
app.include_router(expiration.router)


@app.get("/")
def root():
    return {
        "message": "Inventory Management API is running",
        "status": "online",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }
