# ResumeAI — Production-Ready Resume Generator SaaS

[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker)](https://www.docker.com/)

A full-stack SaaS resume builder with live preview, multiple professional templates, ATS-friendly PDF generation, JWT authentication, AI bullet enhancement, and resume version history.

---

## 📸 Screenshots

> _Screenshots — run the app locally to see the UI_

| Landing Page | Dashboard | Resume Builder | PDF Output |
|---|---|---|---|
| _(screenshot)_ | _(screenshot)_ | _(screenshot)_ | _(screenshot)_ |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router), TypeScript, Tailwind CSS, React Hook Form, Zod, Axios |
| **Backend** | FastAPI (Python 3.11), SQLAlchemy ORM, Pydantic v2, JWT, bcrypt |
| **Database** | PostgreSQL 16 with JSONB resume storage |
| **PDF** | WeasyPrint + Jinja2 HTML templates |
| **AI** | OpenAI GPT-4o-mini (with mock fallback) |
| **DevOps** | Docker, Docker Compose |

---

## 📁 Project Structure

```
resume-generator/
├── docker-compose.yml
├── .env.example
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py          # FastAPI app, CORS, middleware
│       ├── database.py      # SQLAlchemy engine & session
│       ├── models.py        # User, Resume, ResumeVersion ORM
│       ├── schemas.py       # Pydantic request/response schemas
│       ├── auth.py          # JWT + bcrypt utilities
│       ├── config.py        # Settings via pydantic-settings
│       ├── routes/
│       │   ├── auth.py      # POST /auth/register, /auth/login
│       │   ├── resume.py    # CRUD /resumes + versioning
│       │   ├── pdf.py       # POST /pdf/generate/{id}
│       │   └── ai.py        # POST /ai/improve-bullet
│       ├── services/
│       │   ├── template_engine.py  # Jinja2 rendering + colors
│       │   └── pdf_service.py      # WeasyPrint HTML→PDF
│       └── templates/
│           ├── modern.html
│           ├── sidebar.html
│           └── executive.html
└── frontend/
    ├── Dockerfile
    ├── app/
    │   ├── page.tsx             # Landing page
    │   ├── login/page.tsx
    │   ├── register/page.tsx
    │   ├── dashboard/page.tsx
    │   └── create-resume/page.tsx  # 8-step multi-form builder
    ├── components/templates/
    │   ├── ModernTemplate.tsx
    │   ├── SidebarTemplate.tsx
    │   └── ExecutiveTemplate.tsx
    └── lib/
        ├── api.ts            # Axios client with JWT interceptors
        ├── auth.ts           # Token helpers
        ├── types.ts          # TypeScript interfaces
        ├── validations.ts    # Zod schemas
        └── utils.ts          # Shared utilities
```

---

## 🚀 Getting Started

Since Docker is not available on this system, follow the **Local Development** steps.

### Phase 1: PostgreSQL Setup
1. **Install PostgreSQL**: Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/).
2. **Create Database**: Use pgAdmin or `psql` to create a database named `resume_generator`.
   ```sql
   CREATE DATABASE resume_generator;
   ```
3. **Configure Connection**: Update the `DATABASE_URL` in your `.env` file with your password.

### Phase 2: Backend Setup (FastAPI)
```bash
cd backend

# 1. Create virtual environment
python -m venv venv

# 2. Activate virtual environment
.\venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# 5. Start backend
uvicorn app.main:app --reload --port 8000
```

### Phase 3: Frontend Setup (Next.js)
```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# 3. Start development server
npm run dev
```

---

### Option B — Docker Compose (If installed later)
If you decide to install Docker Desktop later, you can run everything with a single command:
```bash
docker-compose up --build
```

---

## 🔑 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `SECRET_KEY` | JWT signing key (min 32 chars) | **Required** |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime | `10080` (7 days) |
| `OPENAI_API_KEY` | OpenAI key for AI bullet improvement | Optional (mock used if empty) |
| `NEXT_PUBLIC_API_URL` | Frontend → Backend API URL | `http://localhost:8000` |

---

## 📖 API Documentation

Full interactive docs available at `http://localhost:8000/docs`

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register new user, returns JWT |
| `POST` | `/auth/login` | Login, returns JWT |

### Resumes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/resumes/` | List all resumes for current user |
| `POST` | `/resumes/` | Create new resume |
| `GET` | `/resumes/{id}` | Get specific resume |
| `PUT` | `/resumes/{id}` | Update resume (with optional versioning) |
| `DELETE` | `/resumes/{id}` | Delete resume |
| `GET` | `/resumes/{id}/versions` | Get version history |

### PDF & AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/pdf/generate/{id}` | Generate and download PDF |
| `POST` | `/ai/improve-bullet` | AI-powered bullet point improvement |

---

## 🧪 Running Tests

```bash
cd backend
pip install -r requirements.txt
pytest tests/ -v
```

---

## 🐳 Deployment

### Production Checklist
- [ ] Set strong `SECRET_KEY` (use `openssl rand -hex 32`)
- [ ] Set secure `POSTGRES_PASSWORD`
- [ ] Set `OPENAI_API_KEY` if using AI features
- [ ] Set `NEXT_PUBLIC_API_URL` to your public backend URL
- [ ] Add your domain to CORS origins in `app/main.py`
- [ ] Use HTTPS in production (add reverse proxy like Nginx or Traefik)

---

## 🚧 Future Improvements

- [ ] Email verification
- [ ] OAuth (Google, GitHub) login  
- [ ] More resume templates (Minimal, Creative, Academic)
- [ ] Cover letter builder
- [ ] Resume scoring / ATS checker
- [ ] Resume sharing via public URL
- [ ] Stripe subscription for premium templates
- [ ] Resume analytics (views, downloads)

---

## 📄 License

MIT License — free to use and modify.
