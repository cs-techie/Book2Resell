from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from ..deps import get_current_admin
from ..models import Book, User  # type: ignore[attr-defined]


router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/users")
def list_users(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return db.query(User).order_by(User.id.desc()).all()


@router.get("/books")
def list_books(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return db.query(Book).order_by(Book.id.desc()).all()


@router.delete("/books/{book_id}")
def delete_book(book_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    db.delete(book)
    db.commit()
    return {"ok": True}

