# Smart Resume Builder with ATS Score Analyzer

A full-stack web application for building professional resumes with ATS compatibility scoring.

**Stack:** React 19 (Vite) · Spring Boot 3.4 · MySQL · JWT Auth · iText PDF

---

## Prerequisites

| Tool | Version |
|------|---------|
| Java | 17 or 21 |
| Maven | 3.8+ (or use `./mvnw`) |
| Node.js | 18+ |
| MySQL | 8.0+ |

---

## Database Setup

```bash
# 1. Start MySQL and run schema:
mysql -u root -p < database/schema.sql
```

The schema creates the `resume_builder` database and all 8 tables automatically.

**Default credentials** in `application.properties`:
- Username: `root`
- Password: `root`

To change, edit `backend/src/main/resources/application.properties`.

---

## Backend Setup (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

Runs on **http://localhost:8080**

### API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login → JWT token |
| GET | `/api/resumes` | Get all resumes |
| POST | `/api/resumes` | Create resume |
| PUT | `/api/resumes/{id}` | Update resume |
| DELETE | `/api/resumes/{id}` | Delete resume |
| GET | `/api/resumes/{id}/pdf` | Download PDF |
| POST | `/api/scores/analyze/{id}` | Run ATS analysis |
| GET | `/api/scores/{id}` | Get stored score |

---

## Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```

Runs on **http://localhost:5173**

---

## Running the Full App

1. Start MySQL → run `database/schema.sql`
2. `cd backend && ./mvnw spring-boot:run`
3. `cd frontend && npm run dev`
4. Open **http://localhost:5173** in your browser
5. Register → Login → Start building!

---

## Features

- ✅ JWT Authentication (register, login, logout)
- ✅ Dashboard with resume management
- ✅ Resume Builder (Personal Info, Education, Skills, Projects, Experience, Certifications)
- ✅ Two professional templates (Classic & Modern)
- ✅ Real-time template switching in preview
- ✅ PDF download via backend (iText 5)
- ✅ Browser print-to-PDF
- ✅ ATS Score Analyzer with RadialBar chart
- ✅ Keyword analysis & improvement suggestions

---

## Project Structure

```
TT Today/
├── backend/                    # Spring Boot
│   └── src/main/java/com/resumebuilder/
│       ├── controller/         # AuthController, ResumeController, ScoreController
│       ├── service/            # AuthService, ResumeService, ScoreService, PdfService
│       ├── repository/         # 8 JPA repositories
│       ├── model/              # User, Resume, Education, Skill, Project, Experience, Certification, ResumeScore
│       ├── dto/                # AuthRequest/Response, ResumeRequest, ScoreResponse
│       └── security/           # JwtUtil, JwtAuthFilter, SecurityConfig, CustomUserDetailsService
├── frontend/                   # React Vite
│   └── src/
│       ├── api/                # axiosConfig, authApi, resumeApi, scoreApi
│       ├── context/            # AuthContext
│       ├── pages/              # Login, Register, Dashboard, ResumeBuilder, Preview, Score
│       ├── components/         # Navbar
│       └── templates/          # ClassicTemplate, ModernTemplate
└── database/
    └── schema.sql              # MySQL DDL
```
