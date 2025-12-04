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

# --- CORS CONFIGURATION (Updated for Safety) ---
# We add both localhost and 127.0.0.1 to be sure
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],
)

# --- SECURITY (PASSWORD HASHING) ---
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# --- DATABASE DEPENDENCY ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Pydantic Models ---
class UserCreate(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

# --- API ENDPOINTS ---

@app.get("/")
def read_root():
    return {"message": "Nomix Trade API is running"}

@app.post("/signup")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    print(f"Signup Request Received for: {user.email}") # Debug print

    # 1. Check if email already exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. Hash the password
    hashed_pw = pwd_context.hash(user.password)

    # 3. Create new user object
    new_user = models.User(
        first_name=user.firstName,
        last_name=user.lastName,
        email=user.email,
        phone=user.phone,
        hashed_password=hashed_pw
    )

    # 4. Save to Database
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        print("User saved successfully!")
    except Exception as e:
        print(f"Database Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": "User created successfully", "user_id": new_user.id}

@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    return {"message": "Login successful", "user": db_user.first_name}