from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import date, timedelta
import random

# Import Local Files
from database import engine, SessionLocal
import models

# Initialize Database
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- CORS ---
origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SECURITY ---
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

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

# --- 1. AUTH ENDPOINTS ---
@app.post("/signup")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = pwd_context.hash(user.password)
    new_user = models.User(
        first_name=user.firstName, last_name=user.lastName,
        email=user.email, phone=user.phone, hashed_password=hashed_pw
    )
    db.add(new_user)
    db.commit()
    return {"message": "User created", "user_id": new_user.id}

@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return {"message": "Login successful", "user": db_user.first_name, "user_id": db_user.id}

# --- 2. MARKET DATA ENDPOINTS ---
@app.get("/stocks")
def get_stocks(target_date: Optional[date] = None, db: Session = Depends(get_db)):
    if target_date is None:
        target_date = date.today()
    
    # JOIN Stock and Company tables to get the name alongside the price
    results = db.query(models.Stock, models.Company.name).join(
        models.Company, models.Stock.symbol == models.Company.symbol
    ).filter(models.Stock.date == target_date).all()
    
    # Format response
    stocks_list = []
    for stock, name in results:
        stock_dict = stock.__dict__
        stock_dict['name'] = name # Add Company Name to response
        stocks_list.append(stock_dict)
        
    return stocks_list

@app.get("/index_data")
def get_index_data(target_date: Optional[date] = None, db: Session = Depends(get_db)):
    if target_date is None: target_date = date.today()
    index_data = db.query(models.KSEIndex).filter(models.KSEIndex.date == target_date).first()
    if not index_data: raise HTTPException(status_code=404, detail="No Index Data")
    return index_data

# --- 3. COMPANY PROFILE & GRAPH ENDPOINTS ---
@app.get("/company/{symbol}")
def get_company_details(symbol: str, db: Session = Depends(get_db)):
    company = db.query(models.Company).filter(models.Company.symbol == symbol).first()
    if not company: raise HTTPException(status_code=404, detail="Company not found")
    
    latest_stock = db.query(models.Stock).filter(models.Stock.symbol == symbol)\
        .order_by(models.Stock.date.desc()).first()
        
    return {"profile": company, "latest_market": latest_stock}

@app.get("/company/{symbol}/graph")
def get_company_graph(symbol: str, db: Session = Depends(get_db)):
    data = db.query(models.Stock).filter(models.Stock.symbol == symbol)\
        .order_by(models.Stock.date.asc()).all()
    return data

# --- 4. FAVORITES ENDPOINTS ---
@app.post("/favorites/add")
def add_favorite(fav: FavoriteRequest, db: Session = Depends(get_db)):
    exists = db.query(models.UserFavorite).filter(
        models.UserFavorite.user_id == fav.user_id,
        models.UserFavorite.stock_symbol == fav.stock_symbol
    ).first()
    if exists: return {"message": "Already favorited"}
    
    new_fav = models.UserFavorite(user_id=fav.user_id, stock_symbol=fav.stock_symbol)
    db.add(new_fav)
    db.commit()
    return {"message": "Added"}

@app.post("/favorites/remove")
def remove_favorite(fav: FavoriteRequest, db: Session = Depends(get_db)):
    db.query(models.UserFavorite).filter(
        models.UserFavorite.user_id == fav.user_id,
        models.UserFavorite.stock_symbol == fav.stock_symbol
    ).delete()
    db.commit()
    return {"message": "Removed"}

@app.get("/favorites/{user_id}")
def get_favorites(user_id: int, db: Session = Depends(get_db)):
    favs = db.query(models.UserFavorite).filter(models.UserFavorite.user_id == user_id).all()
    return [f.stock_symbol for f in favs]

# --- 5. THE MASTER SEEDER (30 Companies) ---
@app.post("/seed_full_data")
def seed_full_data(db: Session = Depends(get_db)):
    # 1. The List You Provided
    companies_list = [
        {"symbol": "FFC", "name": "Fauji Fertilizer Company", "sector": "Fertilizer", "base": 105},
        {"symbol": "UBL", "name": "United Bank Limited", "sector": "Banking", "base": 185},
        {"symbol": "HUBC", "name": "The Hub Power Company", "sector": "Power Gen", "base": 98},
        {"symbol": "ENGROH", "name": "Engro Holdings Limited", "sector": "Fertilizer", "base": 290},
        {"symbol": "OGDC", "name": "Oil & Gas Development", "sector": "Oil & Gas", "base": 112},
        {"symbol": "PPL", "name": "Pakistan Petroleum Limited", "sector": "Oil & Gas", "base": 85},
        {"symbol": "MEBL", "name": "Meezan Bank Limited", "sector": "Banking", "base": 145},
        {"symbol": "DGKC", "name": "D.G. Khan Cement", "sector": "Cement", "base": 65},
        {"symbol": "MARI", "name": "Mari Energies Limited", "sector": "Oil & Gas", "base": 1650},
        {"symbol": "HBL", "name": "Habib Bank Limited", "sector": "Banking", "base": 110},
        {"symbol": "FCCL", "name": "Fauji Cement Company", "sector": "Cement", "base": 18},
        {"symbol": "EFERT", "name": "Engro Fertilizers Limited", "sector": "Fertilizer", "base": 95},
        {"symbol": "PSO", "name": "Pakistan State Oil", "sector": "Oil & Gas", "base": 175},
        {"symbol": "MLCF", "name": "Maple Leaf Cement", "sector": "Cement", "base": 35},
        {"symbol": "POL", "name": "Pakistan Oilfields", "sector": "Oil & Gas", "base": 420},
        {"symbol": "GHNI", "name": "Ghandhara Industries", "sector": "Automobile", "base": 150},
        {"symbol": "PAEL", "name": "Pak Elektron Limited", "sector": "Engineering", "base": 15},
        {"symbol": "LUCK", "name": "Lucky Cement Limited", "sector": "Cement", "base": 780},
        {"symbol": "ATRL", "name": "Attock Refinery Limited", "sector": "Refinery", "base": 265},
        {"symbol": "MCB", "name": "MCB Bank Limited", "sector": "Banking", "base": 135},
        {"symbol": "SAZEW", "name": "Sazgar Engineering", "sector": "Automobile", "base": 125},
        {"symbol": "NBP", "name": "National Bank of Pakistan", "sector": "Banking", "base": 45},
        {"symbol": "SEARL", "name": "The Searle Company", "sector": "Pharma", "base": 55},
        {"symbol": "SNGP", "name": "Sui Northern Gas Pipelines", "sector": "Oil & Gas", "base": 62},
        {"symbol": "GAL", "name": "Ghandhara Automobiles", "sector": "Automobile", "base": 88},
        {"symbol": "PRL", "name": "Pakistan Refinery Limited", "sector": "Refinery", "base": 22},
        {"symbol": "BOP", "name": "The Bank of Punjab", "sector": "Banking", "base": 6},
        {"symbol": "SSGC", "name": "Sui Southern Gas Company", "sector": "Oil & Gas", "base": 12},
        {"symbol": "SYS", "name": "Systems Limited", "sector": "Technology", "base": 450},
        {"symbol": "BAHL", "name": "Bank AL Habib Limited", "sector": "Banking", "base": 82},
    ]

    # 2. Create Companies
    for c in companies_list:
        existing = db.query(models.Company).filter(models.Company.symbol == c["symbol"]).first()
        if not existing:
            # Generate Dummy Profile Data
            new_comp = models.Company(
                symbol=c["symbol"],
                name=c["name"],
                sector=c["sector"],
                status="Compliant",
                about=f"Leading company in the {c['sector']} sector.",
                total_assets=f"{random.randint(50, 500)} Billion",
                total_liabilities=f"{random.randint(10, 200)} Billion",
                loss_per_share=round(random.uniform(1, 50), 2),
                volumetric_growth=f"{random.randint(5, 80)}%",
                market_cap=f"{random.randint(100, 900)} Billion",
                shares_outstanding=f"{random.randint(100, 900)} Million",
                free_float=f"{random.randint(40, 80)}%"
            )
            db.add(new_comp)
    db.commit()

    # 3. Create 40 Days of History for each Company
    today = date.today()
    start_date = today - timedelta(days=30)
    
    total_records = 0
    all_companies = db.query(models.Company).all()

    for comp in all_companies:
        # Get base price from list or default to 50
        base_price = next((item['base'] for item in companies_list if item["symbol"] == comp.symbol), 50.0)
        curr_price = float(base_price)
        
        for i in range(40): # 30 past + 10 future
            target_date = start_date + timedelta(days=i)
            
            exists = db.query(models.Stock).filter(
                models.Stock.symbol == comp.symbol, models.Stock.date == target_date
            ).first()
            if exists: continue

            # Random Fluctuation
            change = random.uniform(-0.03, 0.035)
            curr_price = curr_price * (1 + change)
            
            stock = models.Stock(
                symbol=comp.symbol,
                date=target_date,
                last=round(curr_price, 2),
                open=round(curr_price * 0.99, 2),
                high=round(curr_price * 1.02, 2),
                low=round(curr_price * 0.98, 2),
                volume=random.randint(100000, 5000000),
                pred_close=round(curr_price * 1.01, 2),
                confidence_upper=round(curr_price * 1.05, 2),
                confidence_lower=round(curr_price * 0.95, 2),
            )
            db.add(stock)
            total_records += 1
            
    # 4. Create Index Data (KSE-30)
    idx_curr = 78000.00
    for i in range(40):
        t_date = start_date + timedelta(days=i)
        if not db.query(models.KSEIndex).filter(models.KSEIndex.date == t_date).first():
            change = random.uniform(-0.01, 0.015)
            idx_curr = idx_curr * (1 + change)
            
            idx = models.KSEIndex(
                date=t_date,
                current=round(idx_curr, 2),
                open=round(idx_curr * 0.995, 2),
                high=round(idx_curr * 1.005, 2),
                low=round(idx_curr * 0.99, 2),
                pred_close=round(idx_curr * 1.002, 2)
            )
            db.add(idx)

    db.commit()
    return {"message": f"Seeded {total_records} records for 30 companies."}