from sqlalchemy import Boolean, Column, ForeignKey, Integer, Numeric, String, Text, DateTime, func
from sqlalchemy.orm import relationship
from .db import Base


__all__ = ["User", "Book"]


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    college = Column(String(255), nullable=True)
    contact_no = Column(String(50), nullable=True)
    is_admin = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    books = relationship("Book", back_populates="seller", cascade="all, delete-orphan")


class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    author = Column(String(255), index=True, nullable=False)
    category = Column(String(100), index=True, nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    seller_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    seller = relationship("User", back_populates="books")

