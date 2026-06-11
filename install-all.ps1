# Install all dependencies for HoopFlex Monorepo

Write-Host "📦 Installing Frontend Dependencies..." -ForegroundColor Green
Set-Location "$PSScriptRoot\HoopFlex"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend install failed" -ForegroundColor Red
    exit 1
}

Write-Host "`n📦 Installing Backend Dependencies..." -ForegroundColor Green
Set-Location "$PSScriptRoot\hoopflex-backend"
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend install failed" -ForegroundColor Red
    exit 1
}

Set-Location "$PSScriptRoot"
Write-Host "`n✅ All dependencies installed successfully!" -ForegroundColor Green
