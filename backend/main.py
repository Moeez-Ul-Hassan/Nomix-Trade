from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
from typing import List

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

# 1. USER AUTH
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
    # 1. Find user by email
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    
    # 2. Check password
    if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # 3. RETURN THE ID (This was likely missing or named differently)
    return {
        "message": "Login successful", 
        "user": db_user.first_name, 
        "user_id": db_user.id  # <--- CRITICAL LINE
    }

# 2. STOCK DATA (NEW)
@app.get("/stocks")
def get_all_stocks(db: Session = Depends(get_db)):
    # Fetches all rows from the 'stocks' table you filled in phpMyAdmin
    stocks = db.query(models.Stock).all()
    return stocks

# 1. ADD FAVORITE
@app.post("/favorites/add")
def add_favorite(fav: FavoriteRequest, db: Session = Depends(get_db)):
    # Check if already exists
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

# 2. REMOVE FAVORITE
@app.post("/favorites/remove")
def remove_favorite(fav: FavoriteRequest, db: Session = Depends(get_db)):
    db.query(models.UserFavorite).filter(
        models.UserFavorite.user_id == fav.user_id,
        models.UserFavorite.stock_symbol == fav.stock_symbol
    ).delete()
    db.commit()
    return {"message": "Removed from favorites"}

# 3. GET USER FAVORITES
@app.get("/favorites/{user_id}")
def get_favorites(user_id: int, db: Session = Depends(get_db)):
    # Get list of stock symbols for this user
    favs = db.query(models.UserFavorite).filter(models.UserFavorite.user_id == user_id).all()
    return [f.stock_symbol for f in favs]