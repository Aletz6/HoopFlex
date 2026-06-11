# Run Tests

Write-Host "🧪 Running Frontend Tests..." -ForegroundColor Green
Set-Location "$PSScriptRoot\HoopFlex"
npm run validate

Write-Host "`n🧪 Running Backend Tests..." -ForegroundColor Green
Set-Location "$PSScriptRoot\hoopflex-backend"
pytest --cov=. --cov-report=term-missing

Set-Location "$PSScriptRoot"
Write-Host "`n✅ All tests completed!" -ForegroundColor Green
