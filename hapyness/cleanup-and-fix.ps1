# Hapyness App - Complete Cleanup and Fix Script (Windows)
# Save as: cleanup-and-fix.ps1
# Run with: .\cleanup-and-fix.ps1

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Hapyness App - Complete Cleanup & Fix" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Backup current state
Write-Host "[1/10] Creating backup..." -ForegroundColor Yellow
if (Test-Path "package-lock.json") {
    Copy-Item "package-lock.json" "package-lock.json.backup" -ErrorAction SilentlyContinue
    Write-Host "       Backup created" -ForegroundColor Green
}

# Step 2: Remove all cache and build artifacts
Write-Host "[2/10] Removing cache and build artifacts..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force android -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ios -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .gradle -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Force yarn.lock -ErrorAction SilentlyContinue
Remove-Item -Force .watchmanconfig -ErrorAction SilentlyContinue

# Clear temp directories
$tempPath = $env:TEMP
Remove-Item -Recurse -Force "$tempPath\react-*" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$tempPath\metro-*" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:USERPROFILE\.gradle\caches" -ErrorAction SilentlyContinue

Write-Host "       Cache cleaned" -ForegroundColor Green

# Step 3: Remove auth config file if exists
Write-Host "[3/10] Removing incorrect auth config..." -ForegroundColor Yellow
Remove-Item -Force "app\config\auth.js" -ErrorAction SilentlyContinue
Write-Host "       Auth config removed" -ForegroundColor Green

# Step 4: Clear npm cache
Write-Host "[4/10] Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force
Write-Host "       NPM cache cleared" -ForegroundColor Green

# Step 5: Clear watchman (if installed)
Write-Host "[5/10] Clearing watchman..." -ForegroundColor Yellow
try {
    watchman watch-del-all 2>&1 | Out-Null
    Write-Host "       Watchman cleared" -ForegroundColor Green
} catch {
    Write-Host "       Watchman not installed (optional)" -ForegroundColor Cyan
}

# Step 6: Install dependencies
Write-Host "[6/10] Installing dependencies..." -ForegroundColor Yellow
npm install
Write-Host "       Dependencies installed" -ForegroundColor Green

# Step 7: Clear Expo cache
Write-Host "[7/10] Clearing Expo cache..." -ForegroundColor Yellow
Write-Host "       Expo cache will be cleared on next start" -ForegroundColor Cyan

# Step 8: Check for required assets
Write-Host "[8/10] Checking required assets..." -ForegroundColor Yellow
$missingAssets = 0

function Check-Asset {
    param($assetPath)
    if (Test-Path $assetPath) {
        Write-Host "       Found: $assetPath" -ForegroundColor Green
    } else {
        Write-Host "       Missing: $assetPath" -ForegroundColor Red
        $script:missingAssets++
    }
}

Check-Asset "assets\icon.png"
Check-Asset "assets\image\male.png"
Check-Asset "assets\image\female.png"
Check-Asset "assets\image\welcome.png"

if ($missingAssets -gt 0) {
    Write-Host "       Warning: $missingAssets asset(s) missing" -ForegroundColor Yellow
} else {
    Write-Host "       All required assets present" -ForegroundColor Green
}

# Step 9: Run Expo Doctor
Write-Host "[9/10] Running Expo Doctor..." -ForegroundColor Yellow
npx expo-doctor
Write-Host "       Health check complete" -ForegroundColor Green

# Step 10: Prebuild (optional - for native builds)
Write-Host "[10/10] Prebuild (optional)..." -ForegroundColor Yellow
$prebuild = Read-Host "Run expo prebuild for native builds? (y/N)"
if ($prebuild -eq "y" -or $prebuild -eq "Y") {
    npx expo prebuild --clean
    Write-Host "       Prebuild complete" -ForegroundColor Green
} else {
    Write-Host "       Prebuild skipped" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "  Cleanup Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. npm start (or: npx expo start --clear)"
Write-Host "  2. Scan QR code or press 'a' for Android / 'i' for iOS"
Write-Host ""
Write-Host "For native builds:" -ForegroundColor Yellow
Write-Host "  Android: npx expo run:android"
Write-Host "  iOS: npx expo run:ios"
Write-Host ""
Write-Host "For EAS builds:" -ForegroundColor Yellow
Write-Host "  eas build --platform android --profile development"
Write-Host "  eas build --platform ios --profile development"
Write-Host ""

# Optional: Start development server
$startServer = Read-Host "Start development server now? (Y/n)"
if ($startServer -ne "n" -and $startServer -ne "N") {
    Write-Host ""
    Write-Host "Starting Expo development server..." -ForegroundColor Green
    npx expo start --clear
}