# SMM Panel - Restart Script
# This script stops all processes, regenerates Prisma client, and restarts the dev server

Write-Host "🛑 Stopping all Node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

Write-Host "🔄 Regenerating Prisma Client..." -ForegroundColor Cyan
npx prisma generate

Write-Host "🗑️ Cleaning .next cache..." -ForegroundColor Cyan
if (Test-Path .next) {
    Remove-Item -Recurse -Force .next
}

Write-Host "✅ Starting dev server..." -ForegroundColor Green
npm run dev
