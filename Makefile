.PHONY: help install-all install-frontend install-backend \
        start-all start-frontend start-backend start-docker \
        test test-frontend test-backend lint lint-frontend lint-backend \
        format format-frontend format-backend clean docker-up docker-down

help:
	@echo "HoopFlex Monorepo - Available commands:"
	@echo ""
	@echo "Installation:"
	@echo "  make install-all          Install frontend + backend"
	@echo "  make install-frontend     Install frontend only"
	@echo "  make install-backend      Install backend only"
	@echo ""
	@echo "Development:"
	@echo "  make start-all            Start all services"
	@echo "  make start-frontend       Start frontend (Expo)"
	@echo "  make start-backend        Start backend (FastAPI)"
	@echo "  make start-docker         Start with Docker Compose"
	@echo ""
	@echo "Testing & Quality:"
	@echo "  make test                 Run all tests"
	@echo "  make test-frontend        Run frontend tests"
	@echo "  make test-backend         Run backend tests"
	@echo "  make lint                 Lint all"
	@echo "  make lint-frontend        Lint frontend"
	@echo "  make lint-backend         Lint backend"
	@echo "  make format               Format all"
	@echo "  make format-frontend      Format frontend"
	@echo "  make format-backend       Format backend"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-up            Start Docker Compose"
	@echo "  make docker-down          Stop Docker Compose"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean                Clean all build/cache files"

install-all: install-frontend install-backend
	@echo "✅ All dependencies installed"

install-frontend:
	@echo "📦 Installing frontend dependencies..."
	cd HoopFlex && npm install

install-backend:
	@echo "📦 Installing backend dependencies..."
	cd hoopflex-backend && pip install -r requirements.txt

start-all: start-frontend start-backend
	@echo "🚀 All services started"

start-frontend:
	@echo "🚀 Starting frontend..."
	cd HoopFlex && npm start

start-backend:
	@echo "🚀 Starting backend..."
	cd hoopflex-backend && python -m uvicorn main:app --reload

start-docker:
	@echo "🐳 Starting Docker Compose..."
	docker-compose up --build

test: test-frontend test-backend
	@echo "✅ All tests completed"

test-frontend:
	@echo "🧪 Testing frontend..."
	cd HoopFlex && npm run validate

test-backend:
	@echo "🧪 Testing backend..."
	cd hoopflex-backend && pytest --cov=. --cov-report=term-missing

lint: lint-frontend lint-backend
	@echo "✅ Linting completed"

lint-frontend:
	@echo "🔍 Linting frontend..."
	cd HoopFlex && npm run lint

lint-backend:
	@echo "🔍 Linting backend..."
	cd hoopflex-backend && flake8 .

format: format-frontend format-backend
	@echo "✅ Formatting completed"

format-frontend:
	@echo "🎨 Formatting frontend..."
	cd HoopFlex && npm run format

format-backend:
	@echo "🎨 Formatting backend..."
	cd hoopflex-backend && black .

clean:
	@echo "🧹 Cleaning cache and build files..."
	cd HoopFlex && rm -rf node_modules .expo dist build || true
	cd hoopflex-backend && rm -rf __pycache__ .pytest_cache .coverage || true
	find . -type d -name __pycache__ -exec rm -rf {} + || true
	find . -type f -name "*.pyc" -delete || true
	@echo "✅ Clean completed"

docker-up:
	@echo "🐳 Starting Docker Compose..."
	docker-compose up -d

docker-down:
	@echo "🛑 Stopping Docker Compose..."
	docker-compose down

docker-logs:
	@echo "📋 Docker logs..."
	docker-compose logs -f
