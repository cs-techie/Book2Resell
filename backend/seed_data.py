"""
Seed database with sample data for testing
"""
from app.db import SessionLocal, engine, Base
from app.models import User, Book
from app.auth import get_password_hash

def seed_database():
    """Seed database with sample users and books"""
    db = SessionLocal()
    
    try:
        # Check if data already exists
        existing_users = db.query(User).count()
        if existing_users > 0:
            print("Database already contains data. Skipping seed.")
            return
        
        print("Seeding database with sample data...")
        
        # Create admin user
        admin = User(
            name="Admin User",
            email="admin@book2resell.com",
            hashed_password=get_password_hash("admin123"),
            college="Book2Resell HQ",
            contact_no="+1234567890",
            is_admin=True
        )
        db.add(admin)
        
        # Create regular users
        user1 = User(
            name="John Doe",
            email="john@example.com",
            hashed_password=get_password_hash("password123"),
            college="MIT",
            contact_no="+1234567891"
        )
        db.add(user1)
        
        user2 = User(
            name="Jane Smith",
            email="jane@example.com",
            hashed_password=get_password_hash("password123"),
            college="Stanford University",
            contact_no="+1234567892"
        )
        db.add(user2)
        
        user3 = User(
            name="Bob Johnson",
            email="bob@example.com",
            hashed_password=get_password_hash("password123"),
            college="Harvard University",
            contact_no="+1234567893"
        )
        db.add(user3)
        
        db.commit()
        db.refresh(user1)
        db.refresh(user2)
        db.refresh(user3)
        
        # Create sample books
        books_data = [
            {
                "title": "Introduction to Algorithms",
                "author": "Thomas H. Cormen",
                "category": "Computer Science",
                "price": 45.99,
                "description": "Comprehensive guide to algorithms and data structures. Great condition, minimal highlighting.",
                "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
                "seller_id": user1.id
            },
            {
                "title": "Clean Code",
                "author": "Robert C. Martin",
                "category": "Programming",
                "price": 29.99,
                "description": "A handbook of agile software craftsmanship. Excellent condition.",
                "image_url": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
                "seller_id": user1.id
            },
            {
                "title": "Calculus: Early Transcendentals",
                "author": "James Stewart",
                "category": "Mathematics",
                "price": 55.00,
                "description": "8th edition. Some notes in margins but overall good condition.",
                "image_url": "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400",
                "seller_id": user2.id
            },
            {
                "title": "Physics for Scientists and Engineers",
                "author": "Raymond A. Serway",
                "category": "Physics",
                "price": 65.00,
                "description": "9th edition with solutions manual. Like new condition.",
                "image_url": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
                "seller_id": user2.id
            },
            {
                "title": "Organic Chemistry",
                "author": "Paula Yurkanis Bruice",
                "category": "Chemistry",
                "price": 70.00,
                "description": "7th edition. Well maintained, no damage.",
                "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
                "seller_id": user3.id
            },
            {
                "title": "The Great Gatsby",
                "author": "F. Scott Fitzgerald",
                "category": "Literature",
                "price": 8.99,
                "description": "Classic American novel. Perfect for English class.",
                "image_url": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
                "seller_id": user3.id
            },
            {
                "title": "Principles of Economics",
                "author": "N. Gregory Mankiw",
                "category": "Economics",
                "price": 48.00,
                "description": "8th edition. Great introduction to economics.",
                "image_url": "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400",
                "seller_id": user1.id
            },
            {
                "title": "Campbell Biology",
                "author": "Jane B. Reece",
                "category": "Biology",
                "price": 75.00,
                "description": "11th edition. Comprehensive biology textbook in excellent condition.",
                "image_url": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
                "seller_id": user2.id
            },
            {
                "title": "Design Patterns",
                "author": "Erich Gamma",
                "category": "Programming",
                "price": 35.00,
                "description": "Elements of Reusable Object-Oriented Software. Classic programming book.",
                "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
                "seller_id": user3.id
            },
            {
                "title": "Linear Algebra and Its Applications",
                "author": "David C. Lay",
                "category": "Mathematics",
                "price": 42.00,
                "description": "5th edition. Good condition with some highlighting.",
                "image_url": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
                "seller_id": user1.id
            }
        ]
        
        for book_data in books_data:
            book = Book(**book_data)
            db.add(book)
        
        db.commit()
        
        print("✅ Database seeded successfully!")
        print("\nTest Credentials:")
        print("=" * 50)
        print("Admin:")
        print("  Email: admin@book2resell.com")
        print("  Password: admin123")
        print("\nRegular Users:")
        print("  Email: john@example.com | Password: password123")
        print("  Email: jane@example.com | Password: password123")
        print("  Email: bob@example.com | Password: password123")
        print("=" * 50)
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Create tables
    Base.metadata.create_all(bind=engine)
    # Seed data
    seed_database()
