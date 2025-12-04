from sqlalchemy import Column, Integer, String, Float,ForeignKey
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

# --- NEW STOCK MODEL ---
class Stock(Base):
    __tablename__ = 'stocks'

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(20), unique=True, index=True)
    name = Column(String(100))
    
    # OHLC Data
    last = Column(Float)
    open = Column(Float)
    high = Column(Float)
    low = Column(Float)
    
    # Predictions
    pred1 = Column(Float)  # Next Day
    pred7 = Column(Float)  # 7 Days
    pred30 = Column(Float) # 30 Days

class UserFavorite(Base):
    __tablename__ = 'user_favorites'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    stock_symbol = Column(String(20), ForeignKey('stocks.symbol'))