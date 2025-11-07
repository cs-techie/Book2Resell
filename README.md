# Book2Resell

Modern full-stack marketplace for buying and selling second-hand books.

## Tech Stack
- **Frontend**: React + Vite + TailwindCSS + TypeScript
- **Backend**: FastAPI (Python 3.11)
- **Database**: PostgreSQL (production) / SQLite (local dev)
- **Auth**: JWT (JSON Web Tokens)
- **Deployment**: Railway (backend) + Vercel (frontend)

## Project Structure
```
.
├── backend/           # FastAPI backend application
│   ├── app/
│   │   ├── core/      # Configuration
│   │   ├── routers/   # API routes (auth, books, admin)
│   │   ├── utils/     # Utilities (seed data, auth)
│   │   ├── main.py    # Application entry point
│   │   ├── models.py  # SQLAlchemy models
│   │   ├── schemas.py # Pydantic schemas
│   │   └── db.py      # Database configuration
│   └── requirements.txt
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/  # API client
│   │   └── main.tsx
│   └── package.json
└── Railway config files (nixpacks.toml, railway.json, Procfile)
```

## Local Development

### Backend Setup
1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment** (recommended):
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Mac/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the server**:
   ```bash
   cd ..
   python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 --app-dir backend
   ```

5. **Access the API**:
   - API: `http://127.0.0.1:8000`
   - Swagger docs: `http://127.0.0.1:8000/docs`
   - Health check: `http://127.0.0.1:8000/api/health`

**Note**: On first run, the database is automatically created and populated with seed data (admin user + demo users + sample books).

### Frontend Setup
1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Access the app**: `http://localhost:5173`

## Features

### User Features
- User registration and login with JWT authentication
- Browse books with search and category filters
- View detailed book information
- List books for sale (title, author, category, price, description, images)
- Manage personal listings (view, edit, delete)
- User profile management

### Admin Features
- Admin dashboard with user management
- View all users and books
- Delete inappropriate listings
- System monitoring

### UI/UX
- Responsive design with TailwindCSS
- Toast notifications for user feedback
- Skeleton loaders for better UX
- Modern, clean interface

## Deployment

### Railway Deployment (Backend)

1. **Create Railway account** at [railway.app](https://railway.app)

2. **Create new project** and connect GitHub repository

3. **Add PostgreSQL database**:
   - Click "+ New" → Database → PostgreSQL
   - Railway auto-sets `DATABASE_URL`

4. **Set environment variables**:
   ```
   SECRET_KEY=<generate-secure-random-string>
   CORS_ORIGINS=https://your-frontend-url.vercel.app
   ADMIN_EMAIL=admin@book2resell.com
   ADMIN_PASSWORD=<secure-password>
   ALGORITHM=HS256
   ```

5. **Deploy**: Railway auto-deploys on push to main branch

6. **Get your URL**: Copy from Railway dashboard Settings

### Vercel Deployment (Frontend)

1. **Create Vercel account** at [vercel.com](https://vercel.com)

2. **Import GitHub repository**

3. **Configure build settings**:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Set environment variable**:
   ```
   VITE_API_URL=https://your-railway-url.railway.app
   ```

5. **Deploy**: Vercel auto-deploys on push

## Environment Variables

### Backend (.env or Railway)
```bash
# Required
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:pass@host:5432/db  # Auto-set by Railway

# CORS (use your frontend URL)
CORS_ORIGINS=http://localhost:5173,https://your-frontend.vercel.app

# Admin credentials
ADMIN_EMAIL=admin@book2resell.com
ADMIN_PASSWORD=admin123

# Optional
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ALGORITHM=HS256
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:8000  # Local
VITE_API_URL=https://your-api.railway.app  # Production
```

## Default Credentials

### Admin Account
- Email: `admin@book2resell.com`
- Password: `admin123`

### Demo User Account
- Email: `demo@student.com`
- Password: `password123`

## API Documentation

Once the backend is running, visit `/docs` for interactive Swagger API documentation.

## Database

- **Local Development**: SQLite (auto-created as `book2resell.db`)
- **Production**: PostgreSQL (recommended for Railway/Render)

**To reset database**: Delete `book2resell.db` file and restart the server.

## Security Notes

⚠️ **Important for Production**:
- Generate a strong `SECRET_KEY` using: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
- Change default admin password
- Use environment variables, never commit secrets
- Enable HTTPS only in production
- Set specific CORS origins (not `*`)

## Troubleshooting

### Backend won't start
- Ensure you're in the correct directory
- Check Python version (3.11 required)
- Verify all dependencies installed: `pip install -r backend/requirements.txt`
- Check if port 8000 is available

### Frontend won't connect to backend
- Verify `VITE_API_URL` is set correctly
- Check CORS settings in backend
- Ensure backend is running

### Database errors
- Delete `book2resell.db` and restart (local)
- Check `DATABASE_URL` is correct (production)

## License

MIT

