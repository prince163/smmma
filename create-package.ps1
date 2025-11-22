# Deployment Package Script
Write-Host "Creating deployment package..." -ForegroundColor Green

# Create temp directory
$packageDir = "letsgrow-deploy"
if (Test-Path $packageDir) {
    Remove-Item -Recurse -Force $packageDir
}
New-Item -ItemType Directory -Path $packageDir | Out-Null

# Copy necessary files
Write-Host "Copying files..." -ForegroundColor Yellow

$items = @("app", "components", "lib", "prisma", "public", "package.json", "package-lock.json", "next.config.js", "tsconfig.json", "tailwind.config.ts", "postcss.config.js", "server.js", "vercel.json", ".htaccess", "env.production.example")

foreach ($item in $items) {
    if (Test-Path $item) {
        Copy-Item -Path $item -Destination $packageDir -Recurse -Force
        Write-Host "  Copied $item" -ForegroundColor Gray
    }
}

# Create ZIP
Write-Host "Creating ZIP file..." -ForegroundColor Yellow
$zipPath = "letsgrow-deploy.zip"
if (Test-Path $zipPath) {
    Remove-Item -Force $zipPath
}

Compress-Archive -Path "$packageDir\*" -DestinationPath $zipPath -CompressionLevel Optimal

# Get file size
$size = (Get-Item $zipPath).Length / 1MB
Write-Host "Package created: $zipPath" -ForegroundColor Green
Write-Host "Size: $([math]::Round($size, 2)) MB" -ForegroundColor Cyan

# Cleanup
Remove-Item -Recurse -Force $packageDir

Write-Host "Done! Upload $zipPath to your server" -ForegroundColor Green
