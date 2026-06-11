# HoopFlex - Monorepo (Frontend + Backend)

## 📁 Estructura del Proyecto

```
CompleteHoopFlex/
├── HoopFlex/              # React Native Frontend (Expo)
│   ├── package.json
│   ├── .eslintrc.json
│   ├── .prettierrc.json
│   └── ...
├── hoopflex-backend/      # FastAPI Backend
│   ├── requirements.txt
│   ├── main.py
│   ├── Dockerfile
│   ├── pytest.ini
│   └── ...
├── docker-compose.yml     # Orchestración de servicios
├── .github/
│   └── workflows/
│       └── ci.yml         # CI/CD Pipeline
└── Makefile               # Comandos útiles
```

## 🚀 Quick Start

### Frontend (React Native)

```bash
cd HoopFlex
npm install
npm start
```

### Backend (FastAPI)

```bash
cd hoopflex-backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

### Con Docker Compose (Ambos)

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000 (web)
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🧪 Testing

### Frontend

```bash
cd HoopFlex
npm run lint          # ESLint
npm run lint:fix      # Fix issues
npm run format        # Prettier
npm run validate      # Lint + Format check
```

### Backend

```bash
cd hoopflex-backend
pytest                           # Run tests
pytest --cov                     # With coverage
black .                          # Format
flake8 .                         # Lint
bandit -r .                      # Security check
```

## 🔄 CI/CD Pipeline

El archivo `.github/workflows/ci.yml` ejecuta automáticamente:

### Frontend Jobs (Paralelos)
- ✅ Lint & Format con ESLint y Prettier
- ✅ Build check
- ✅ Security audit con npm audit

### Backend Jobs (Paralelos)
- ✅ Tests con pytest
- ✅ Code formatting check (Black)
- ✅ Linting (Flake8)
- ✅ Security check (Bandit)
- ✅ Build verification
- ✅ Coverage report

### Triggers
- 🔸 `push` a `main` o `develop`
- 🔸 `pull_request` a `main` o `develop`

## 📋 Requirements

### Frontend
- Node.js 18+
- npm o yarn

### Backend
- Python 3.11+
- MongoDB 5.0+

### Docker
- Docker Engine 20.10+
- Docker Compose 2.0+

## 📝 Configuración Local

### Variables de Ambiente

**Backend** (`hoopflex-backend/.env`):
```env
MONGODB_URL=mongodb://localhost:27017/hoopflex
DEBUG=True
LOG_LEVEL=INFO
```

**Frontend** (`HoopFlex/.env`):
```env
REACT_NATIVE_BACKEND_URL=http://localhost:8000
EXPO_PUBLIC_API_URL=http://localhost:8000
```

## 🔐 Git Workflow

1. Crea una rama para tu feature:
   ```bash
   git checkout -b feature/my-feature
   ```

2. Realiza cambios y commit:
   ```bash
   git add .
   git commit -m "feat: descripción"
   ```

3. Push a GitHub:
   ```bash
   git push origin feature/my-feature
   ```

4. Abre Pull Request y espera a que CI/CD pase ✅

## 📚 Documentación Adicional

- [OFFLINE_SYNC_FASTAPI.md](./OFFLINE_SYNC_FASTAPI.md) - Sync contract
- [FastAPI Docs](http://localhost:8000/docs) - API documentation (en local)
- [Expo Docs](https://docs.expo.dev/)

## 🛠️ Troubleshooting

### MongoDB no conecta
```bash
docker-compose down -v
docker-compose up -d mongodb
```

### Puerto 8000 en uso
```bash
lsof -i :8000
kill -9 <PID>
```

### Limpiar caché
```bash
cd HoopFlex && npm run reset
cd hoopflex-backend && rm -rf __pycache__ .pytest_cache
```

---

**¿Necesitas ayuda?** Revisa los logs:
```bash
docker-compose logs -f
```
