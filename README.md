# DocuSphere - Search-Driven Document Management Platform

An actively developed metadata-rich document management system designed for research and enterprise use cases.

This platform focuses on structured metadata, advanced search capabilities, and auditability of document access and modifications.

---

## 🚀 Current Status

⚠️ Work in Progress (early prototype)

- [x] Project setup (FastAPI + React)
- [x] Initial authentication scaffold
- [x] Deployed basic frontend on AWS EC2
- [ ] Document upload and storage
- [ ] Metadata schema and management
- [ ] OpenSearch integration for search
- [ ] Version control for documents
- [ ] Audit logging
- [ ] Role-based access control (RBAC)

---

## 🧠 Problem Statement

Modern document systems often lack:
- Rich, structured metadata
- Powerful search across both metadata and content
- Transparent audit trails
- Version traceability

This project aims to address these gaps with a scalable architecture inspired by research data platforms.

---

## 🏗️ Architecture Overview

High-level components:

- **Backend**: FastAPI (Python)
- **Frontend**: React
- **Database**: PostgreSQL
- **Search Engine**: OpenSearch
- **Storage**: AWS S3 (planned)
- **Deployment**: AWS EC2 (current), containerisation planned

```
(Client - React)
↓
(FastAPI Backend)
↓
(PostgreSQL) (OpenSearch)
↓
(Document Storage - S3)
```


---

## 🔑 Core Features (Planned)

- User authentication (JWT-based)
- Role-based access control (RBAC)
- Document upload and storage
- Metadata management (custom schemas)
- Full-text and faceted search (OpenSearch)
- Document versioning (immutable history)
- Audit logging (access and modification tracking)
- RESTful API design with OpenAPI documentation

---

## 📦 Project Structure

```
backend/
app/
api/
core/
models/
schemas/
frontend/
infra/
docs/
```


---

## ⚙️ Getting Started (Backend)

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

uvicorn app.main:app --reload
```

API docs available at:
http://localhost:8000/docs

---
## 🛣️ Roadmap

Short-term:

- Implement document upload API
- Design metadata schema
- Integrate PostgreSQL models

Mid-term:

- OpenSearch indexing + search API
- Versioning system
- Audit logging

Long-term:

- Role-based access control
- Document similarity search
- Automated metadata extraction

---
## 📌 Notes

This project is being developed iteratively with a focus on:

- clean architecture
- scalability
- alignment with research data platforms (e.g. CERN/EMBL use 
cases)

## 👤 Author

Prakash Gaur


---

# 🧱 2. Repo Structure (create this)

```
repo-root/
│
├── backend/
│ ├── app/
│ │ ├── main.py
│ │ ├── api/
│ │ │ └── routes.py
│ │ ├── core/
│ │ │ └── config.py
│ │ ├── models/
│ │ │ └── base.py
│ │ ├── schemas/
│ │ │ └── user.py
│ │
│ ├── requirements.txt
│
├── frontend/
│ └── README.md
│
├── infra/
│ └── docker-compose.yml
│
├── docs/
│ └── architecture.md
│
└── README.md
```


---

# 🐍 3. Backend starter files

## backend/app/main.py

```python
from fastapi import FastAPI
from app.api.routes import router

app = FastAPI(title="Document Management Platform")

app.include_router(router)


@app.get("/")
def root():
    return {"message": "Document Management Platform API"}
```
---
## backend/app/api/routes.py

```
from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health_check():
    return {"status": "ok"}


@router.get("/auth/login")
def login_stub():
    return {"message": "Login endpoint (to be implemented)"}
```

---
## backend/app/core/config.py
```
class Settings:
    PROJECT_NAME: str = "Document Management Platform"
    VERSION: str = "0.1.0"


settings = Settings()
```

---
## backend/app/models/base.py
```
from sqlalchemy.orm import declarative_base

Base = declarative_base()
```

---
## backend/app/schemas/user.py
```
from pydantic import BaseModel


class User(BaseModel):
    email: str
    password: str

```

---
## backend/requirements.txt
```
fastapi
uvicorn
sqlalchemy
psycopg2-binary
pydantic
python-jose
passlib
```


