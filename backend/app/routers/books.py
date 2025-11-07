from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from .. import schemas
from ..db import get_db
from ..deps import get_current_user
from ..models import Book, User  # type: ignore[attr-defined]


router = APIRouter(prefix="/api/books", tags=["books"])


@router.get("/", response_model=schemas.BooksList)
def list_books(
    q: Optional[str] = Query(default=None, description="Search in title/author/category"),
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 24,
    db: Session = Depends(get_db),
):
    query = db.query(Book)
    if q:
        like = f"%{q}%"
        query = query.filter(
            (Book.title.ilike(like)) | (Book.author.ilike(like)) | (Book.category.ilike(like))
        )
    if category:
        query = query.filter(Book.category == category)
    total = query.count()
    items = query.order_by(Book.id.desc()).offset(skip).limit(limit).all()
    return {"items": items, "total": total}


@router.get("/{book_id}", response_model=schemas.BookOut)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


@router.post("/", response_model=schemas.BookOut)
def create_book(payload: schemas.BookCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    book = Book(
        title=payload.title,
        author=payload.author,
        category=payload.category,
        price=payload.price,
        description=payload.description,
        image_url=payload.image_url,
        seller_id=current_user.id,
    )
    db.add(book)
    db.commit()
    db.refresh(book)
    return book


@router.put("/{book_id}", response_model=schemas.BookOut)
def update_book(
    book_id: int,
    payload: schemas.BookUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    # Check ownership
    if book.seller_id != current_user.id:  # type: ignore[misc]
        raise HTTPException(status_code=403, detail="Not your listing")
    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(book, k, v)
    db.commit()
    db.refresh(book)
    return book


@router.delete("/{book_id}")
def delete_book(book_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    # Check ownership
    if book.seller_id != current_user.id:  # type: ignore[misc]
        raise HTTPException(status_code=403, detail="Not your listing")
    db.delete(book)
    db.commit()
    return {"ok": True}


@router.get("/me/listings", response_model=list[schemas.BookOut])
def my_listings(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    items = db.query(Book).filter(Book.seller_id == current_user.id).order_by(Book.id.desc()).all()
    return items

