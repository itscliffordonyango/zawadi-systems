# Zawadi Sales & Inventory Management System 🛒

[![Backend](https://img.shields.io/badge/FastAPI-1.0.0-green?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Frontend](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Database](https://img.shields.io/badge/SQLAlchemy-SQLite-orange?logo=postgresql)](https://www.sqlalchemy.org/)

**Zawadi** is a modern full-stack Point-of-Sale (POS) and inventory management system designed for small to medium businesses. Built with FastAPI (backend) and React (frontend), it provides real-time sales tracking, inventory management, and reporting.

## ✨ Features

### Backend
- JWT Authentication & Authorization
- RESTful API with automatic Swagger/OpenAPI docs
- SQLAlchemy ORM with Alembic migrations
- Product & Sales management
- SQLite (dev) / PostgreSQL (prod) support

### Frontend
- Responsive POS interface
- Real-time cart management
- Inventory dashboard
- Sales reports with charts
- Multiple payment methods (Cash, M-Pesa, Card)

## 🏗️ Architecture

```
Frontend (React + Vite + TypeScript)
    ↓ GraphQL/REST
Backend (FastAPI + SQLAlchemy)
    ↓ SQLite/PostgreSQL
Models: User, Product, Sale, SaleItem
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- [Optional] Gemini API Key (for AI features)

### 1. Clone & Setup Backend
```bash
cd zawadi-systems/backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\\Scripts\\activate  # Windows

pip install -r requirements.txt
alembic upgrade head
```

### 2. Create `.env` file (backend)
```env
SECRET_KEY=your-super-secret-key-change-in-production
DATABASE_URL=sqlite+aiosqlite:///./zawadi.db
BACKEND_CORS_ORIGINS=http://localhost:3000
```

### 3. Run Backend
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
- API Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

### 4. Setup Frontend
```bash
cd ../..  # back to root
npm install
```

### 5. Create `.env.local` (frontend)
```env
VITE_API_URL=http://localhost:8000
VITE_GEMINI_API_KEY=your-gemini-key
```

### 6. Run Frontend
```bash
npm run dev
```
Open http://localhost:3000

## 📚 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/login` | User login | No |
| POST | `/api/v1/auth/register` | User register | No |
| POST | `/products/` | Create product | Yes* |
| GET | `/` | Root check | No |
| GET | `/health` | Health check | No |

_*Coming soon: Full CRUD endpoints_

**Interactive Docs:** Visit `/docs` endpoint

## 🗄️ Database

- **Dev:** SQLite (`zawadi.db`)
- **Prod:** PostgreSQL (update `DATABASE_URL`)
- **Migrations:** `alembic upgrade head`

**Models:**
- `User`: email, hashed_password
- `Product`: name, category, price, stock, min_stock
- `Sale`: total, payment_method, items

## ⚙️ Environment Variables

### Backend (`.env`)
```
SECRET_KEY=super-secret-change-in-prod
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite+aiosqlite:///./zawadi.db
BACKEND_CORS_ORIGINS=["http://localhost:3000", "http://localhost:3001"]
```

### Frontend (`.env.local`)
```
VITE_API_URL=http://localhost:8000/api/v1
VITE_GEMINI_API_KEY=your-gemini-key
```

## 🛠️ Development Scripts

```bash
# Backend migrations
alembic revision --autogenerate -m "description"
alembic upgrade head

# Backend tests
pytest

# Frontend
npm run dev      # Development
npm run build    # Production build
npm run preview  # Preview build

# Both (one terminal each)
# Backend: cd backend && uvicorn main:app --reload
# Frontend: npm run dev
```

## 📱 Screenshots

**POS Interface:**
![POS](screenshots/pos.png)

**Inventory Dashboard:**
![Inventory](screenshots/inventory.png)

## 🤝 Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 🔮 Roadmap

See [TODO.md](TODO.md) for planned features.

## 📄 License

MIT License - see [LICENSE](LICENSE) (create if needed)

## 🙌 Acknowledgments

Built with ❤️ using FastAPI, React, SQLAlchemy, and Vite.

---

**⭐ Star us on GitHub if this helps your business!**

