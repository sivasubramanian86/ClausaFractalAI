# PowerShell runner for ClausaFractalAI Local Stack
$ErrorActionPreference = "Stop"

Write-Host "🚀 Launching ClausaFractalAI Fullstack Studio..." -ForegroundColor Cyan

# Start Backend
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\..\backend'; python -m uvicorn src.main:app --reload --port 8000"

# Start Frontend
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\..\frontend'; npm run dev"

Write-Host "✅ Backend running on http://localhost:8000" -ForegroundColor Green
Write-Host "✅ Frontend running on http://localhost:5173" -ForegroundColor Green
