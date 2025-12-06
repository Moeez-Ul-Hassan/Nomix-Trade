from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    email = Column(String(100), unique=True, index=True)
    phone = Column(String(20))
    hashed_password = Column(String(255))

class Company(Base):
    __tablename__ = 'companies'
    symbol = Column(String(20), primary_key=True, index=True)
    name = Column(String(100))
    sector = Column(String(50))
    status = Column(String(50), default="Active")
    about = Column(Text)
    
    # Financial Strength
    total_assets = Column(String(50))
    total_liabilities = Column(String(50))
    loss_per_share = Column(Float)
    volumetric_growth = Column(String(20))
    
    # Equity Profile
    market_cap = Column(String(50))
    shares_outstanding = Column(String(50))
    free_float = Column(String(50))
    
    # Relationship
    daily_data = relationship("Stock", back_populates="company")

class Stock(Base):
    __tablename__ = 'stocks'
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(20), ForeignKey('companies.symbol'), index=True)
    date = Column(Date, index=True)
    
    last = Column(Float)
    open = Column(Float)
    high = Column(Float)
    low = Column(Float)
    volume = Column(Integer)
    
    pred_close = Column(Float)
    confidence_lower = Column(Float)
    confidence_upper = Column(Float)
    
    company = relationship("Company", back_populates="daily_data")

class UserFavorite(Base):
    __tablename__ = 'user_favorites'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    stock_symbol = Column(String(20), ForeignKey('companies.symbol'))

class KSEIndex(Base):
    __tablename__ = 'kse_index'
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)
    current = Column(Float)
    open = Column(Float)
    high = Column(Float)
    low = Column(Float)
    pred_close = Column(Float)