from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from core.config import get_settings
from database import engine, Base, get_db
from schemas.product import Product, ProductCreate

settings = get_settings()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url="/docs"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Zawadi Sales API is running!"}

@app.post("/products/", response_model=Product)
def create_product(product: ProductCreate, db=Depends(get_db)):
    # TODO: implement CRUD
    return product

@app.get("/health")
def health_check():
    return {"status": "healthy"}

from api.v1 import auth

app.include_router(auth.router, prefix="/api/v1", tags=["auth"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

