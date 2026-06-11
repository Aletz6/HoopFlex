# Start Backend Development Server

Write-Host "🚀 Starting Backend (FastAPI)..." -ForegroundColor Green
Set-Location "$PSScriptRoot\hoopflex-backend"
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
