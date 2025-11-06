from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List


class UserBase(BaseModel):
    name: str
    email: EmailStr
    college: Optional[str] = None
    contact_no: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(UserBase):
    id: int
    is_admin: bool

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class BookBase(BaseModel):
    title: str
    author: str
    category: Optional[str] = None
    price: float
    description: Optional[str] = None
    image_url: Optional[str] = None


class BookCreate(BookBase):
    pass


class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    description: Optional[str] = None
    image_url: Optional[str] = None


class BookOut(BookBase):
    id: int
    seller_id: int

    class Config:
        from_attributes = True


class BooksList(BaseModel):
    items: List[BookOut]
    total: int
