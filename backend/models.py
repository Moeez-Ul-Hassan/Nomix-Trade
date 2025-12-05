from sqlalchemy import Column, Integer, String, Float, Date
from sqlalchemy.orm import relationship
from database import Base

# --- EXISTING USER MODEL ---
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    email = Column(String(100), unique=True, index=True)
    phone = Column(String(20))
    hashed_password = Column(String(255))

# --- UPDATED STOCK MODEL WITH DATE ---
class Stock(Base):
    __tablename__ = 'stocks'

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(20), index=True) # Removed unique=True
    name = Column(String(100))
    
    date = Column(Date, index=True) # <--- NEW COLUMN
    
    # OHLC Data
    last = Column(Float)
    open = Column(Float)
    high = Column(Float)
    low = Column(Float)
    
    # Predictions
    pred1 = Column(Float)
    pred7 = Column(Float)
    pred30 = Column(Float)

# --- USER FAVORITES (No Change) ---
from sqlalchemy import ForeignKey
class UserFavorite(Base):
    __tablename__ = 'user_favorites'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    stock_symbol = Column(String(20), ForeignKey('stocks.symbol'))


# --- NEW: KSE INDEX MODEL ---
class KSEIndex(Base):
    __tablename__ = 'kse_index'

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)
    
    current = Column(Float) # Current Index Points
    open = Column(Float)
    high = Column(Float)
    low = Column(Float)
    
    pred_close = Column(Float) # Prediction for next close