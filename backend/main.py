from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import date, timedelta
import random

# Import our local files
from database import engine, SessionLocal
import models

# Create the tables automatically if they don't exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- CORS CONFIGURATION ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SECURITY ---
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# --- DATABASE DEPENDENCY ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- PYDANTIC MODELS ---
class UserCreate(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class FavoriteRequest(BaseModel):
    user_id: int
    stock_symbol: str

# --- API ENDPOINTS ---

@app.get("/")
def read_root():
    return {"message": "Nomix Trade API is running"}

# 1. AUTHENTICATION
@app.post("/signup")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = pwd_context.hash(user.password)
    new_user = models.User(
        first_name=user.firstName,
        last_name=user.lastName,
        email=user.email,
        phone=user.phone,
        hashed_password=hashed_pw
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully", "user_id": new_user.id}

@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Return User ID for Frontend Session
    return {"message": "Login successful", "user": db_user.first_name, "user_id": db_user.id}

# 2. STOCKS DATA (With Date Filter)
@app.get("/stocks")
def get_stocks(target_date: Optional[date] = None, db: Session = Depends(get_db)):
    if target_date is None:
        target_date = date.today()
    
    # Fetch stocks matching specific date
    stocks = db.query(models.Stock).filter(models.Stock.date == target_date).all()
    return stocks

# 3. KSE INDEX DATA (With Date Filter)
@app.get("/index_data")
def get_index_data(target_date: Optional[date] = None, db: Session = Depends(get_db)):
    if target_date is None:
        target_date = date.today()
    
    # Fetch index data matching specific date
    index_data = db.query(models.KSEIndex).filter(models.KSEIndex.date == target_date).first()
    
    if not index_data:
        raise HTTPException(status_code=404, detail="Index data not found for this date")
        
    return index_data

# 4. FAVORITES MANAGEMENT
@app.post("/favorites/add")
def add_favorite(fav: FavoriteRequest, db: Session = Depends(get_db)):
    exists = db.query(models.UserFavorite).filter(
        models.UserFavorite.user_id == fav.user_id,
        models.UserFavorite.stock_symbol == fav.stock_symbol
    ).first()
    
    if exists:
        return {"message": "Already favorited"}

    new_fav = models.UserFavorite(user_id=fav.user_id, stock_symbol=fav.stock_symbol)
    db.add(new_fav)
    db.commit()
    return {"message": "Added to favorites"}

@app.post("/favorites/remove")
def remove_favorite(fav: FavoriteRequest, db: Session = Depends(get_db)):
    db.query(models.UserFavorite).filter(
        models.UserFavorite.user_id == fav.user_id,
        models.UserFavorite.stock_symbol == fav.stock_symbol
    ).delete()
    db.commit()
    return {"message": "Removed from favorites"}

@app.get("/favorites/{user_id}")
def get_favorites(user_id: int, db: Session = Depends(get_db)):
    favs = db.query(models.UserFavorite).filter(models.UserFavorite.user_id == user_id).all()
    return [f.stock_symbol for f in favs]

# 5. STOCK SEEDER (Generates 7 Days of Stock Data)
@app.post("/seed_week_data")
def seed_week_data(db: Session = Depends(get_db)):
    base_data = [
        {"symbol": "FFC", "name": "Fauji Fertilizer Company", "base_price": 105.50},
        {"symbol": "UBL", "name": "United Bank Limited", "base_price": 185.30},
        {"symbol": "HUBC", "name": "The Hub Power Company", "base_price": 98.75},
        {"symbol": "ENGRO", "name": "Engro Corporation", "base_price": 290.45},
        {"symbol": "OGDC", "name": "Oil & Gas Development", "base_price": 112.20},
        {"symbol": "PPL", "name": "Pakistan Petroleum Ltd", "base_price": 85.60},
        {"symbol": "MEBL", "name": "Meezan Bank Limited", "base_price": 145.00},
        {"symbol": "DGKC", "name": "D.G. Khan Cement", "base_price": 65.30},
        {"symbol": "MARI", "name": "Mari Petroleum", "base_price": 1650.00},
        {"symbol": "HBL", "name": "Habib Bank Limited", "base_price": 110.50},
        {"symbol": "FCCL", "name": "Fauji Cement Company", "base_price": 18.25},
        {"symbol": "EFERT", "name": "Engro Fertilizers", "base_price": 95.80},
        {"symbol": "PSO", "name": "Pakistan State Oil", "base_price": 175.40},
        {"symbol": "MLCF", "name": "Maple Leaf Cement", "base_price": 35.60},
        {"symbol": "POL", "name": "Pakistan Oilfields", "base_price": 420.00},
        {"symbol": "GHNI", "name": "Ghandhara Industries", "base_price": 150.25},
        {"symbol": "PAEL", "name": "Pak Elektron Limited", "base_price": 15.80},
        {"symbol": "LUCK", "name": "Lucky Cement Limited", "base_price": 780.50},
        {"symbol": "ATRL", "name": "Attock Refinery", "base_price": 265.30},
        {"symbol": "MCB", "name": "MCB Bank Limited", "base_price": 135.60},
        {"symbol": "SAZEW", "name": "Sazgar Engineering", "base_price": 125.40},
        {"symbol": "NBP", "name": "National Bank", "base_price": 45.20},
        {"symbol": "SEARL", "name": "The Searle Company", "base_price": 55.75},
        {"symbol": "SNGP", "name": "Sui Northern Gas", "base_price": 62.40},
        {"symbol": "GAL", "name": "Ghandhara Automobiles", "base_price": 88.90},
        {"symbol": "PRL", "name": "Pakistan Refinery", "base_price": 22.15},
        {"symbol": "BOP", "name": "The Bank of Punjab", "base_price": 5.60},
        {"symbol": "SSGC", "name": "Sui Southern Gas", "base_price": 12.40},
        {"symbol": "SYS", "name": "Systems Limited", "base_price": 450.00},
        {"symbol": "BAHL", "name": "Bank AL Habib", "base_price": 82.30}
    ]

    today = date.today()
    days_generated = 0
    
    for i in range(7): 
        target_date = today + timedelta(days=i)
        if db.query(models.Stock).filter(models.Stock.date == target_date).first():
            continue

        print(f"Generating stocks for {target_date}...")

        for company in base_data:
            fluctuation = random.uniform(-0.02, 0.03)
            price = company["base_price"] * (1 + (fluctuation * i))
            
            new_stock = models.Stock(
                symbol=company["symbol"],
                name=company["name"],
                date=target_date,
                last=round(price, 2),
                open=round(price * 0.99, 2),
                high=round(price * 1.02, 2),
                low=round(price * 0.98, 2),
                pred1=round(price * 1.01, 2),
                pred7=round(price * 1.05, 2),
                pred30=round(price * 1.10, 2)
            )
            db.add(new_stock)
        
        days_generated += 1

    db.commit()
    return {"message": f"Successfully seeded stock data for {days_generated} days."}