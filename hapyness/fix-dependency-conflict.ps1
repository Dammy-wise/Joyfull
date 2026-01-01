# Fix Expo Router Dependency Conflict
# Save as: fix-dependency-conflict.ps1
# Run with: .\fix-dependency-conflict.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Fixing Dependency Conflicts" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clean (ignore errors if files don't exist)
Write-Host "[1/8] Cleaning old files..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Force yarn.lock -ErrorAction SilentlyContinue
Write-Host "       Cleaned" -ForegroundColor Green

# Step 2: Backup app.json
Write-Host "[2/8] Backing up app.json..." -ForegroundColor Yellow
Copy-Item "app.json" "app.json.backup" -Force
Write-Host "       Backup created: app.json.backup" -ForegroundColor Green

# Step 3: Remove expo-router from plugins temporarily
Write-Host "[3/8] Temporarily removing expo-router plugin..." -ForegroundColor Yellow
$appJson = Get-Content "app.json" -Raw | ConvertFrom-Json
$originalPlugins = $appJson.expo.plugins
$appJson.expo.plugins = $appJson.expo.plugins | Where-Object { $_ -ne "expo-router" }
$appJson | ConvertTo-Json -Depth 10 | Set-Content "app.json"
Write-Host "       Removed from plugins" -ForegroundColor Green

# Step 4: Update package.json with correct versions
Write-Host "[4/8] Updating package.json..." -ForegroundColor Yellow
$packageJson = Get-Content "package.json" -Raw
$packageJson = $packageJson -replace '"react-native-safe-area-context":\s*"[^"]*"', '"react-native-safe-area-context": "~5.6.0"'
$packageJson = $packageJson -replace '"react-native-screens":\s*"[^"]*"', '"react-native-screens": "~4.16.0"'
$packageJson = $packageJson -replace '"react-native-gesture-handler":\s*"[^"]*"', '"react-native-gesture-handler": "~2.28.0"'
$packageJson = $packageJson -replace '"react-native-reanimated":\s*"[^"]*"', '"react-native-reanimated": "~4.1.1"'
Set-Content "package.json" $packageJson -NoNewline
Write-Host "       Updated with compatible versions" -ForegroundColor Green

# Step 5: Install with legacy peer deps
Write-Host "[5/8] Installing dependencies (this may take a few minutes)..." -ForegroundColor Yellow
npm install --legacy-peer-deps
if ($LASTEXITCODE -ne 0) {
    Write-Host "       ERROR: npm install failed!" -ForegroundColor Red
    exit 1
}
Write-Host "       Dependencies installed" -ForegroundColor Green

# Step 6: Let expo fix versions
Write-Host "[6/8] Fixing Expo package versions..." -ForegroundColor Yellow
npx expo install --fix
Write-Host "       Expo packages synchronized" -ForegroundColor Green

# Step 7: Verify installation
Write-Host "[7/8] Verifying installation..." -ForegroundColor Yellow
if (Test-Path "node_modules/expo-router") {
    $routerPkg = Get-Content "node_modules/expo-router/package.json" -Raw | ConvertFrom-Json
    Write-Host "       OK expo-router v$($routerPkg.version) installed" -ForegroundColor Green
} else {
    Write-Host "       ERROR expo-router not found!" -ForegroundColor Red
    exit 1
}

if (Test-Path "node_modules/react-native-safe-area-context") {
    $sacPkg = Get-Content "node_modules/react-native-safe-area-context/package.json" -Raw | ConvertFrom-Json
    Write-Host "       OK react-native-safe-area-context v$($sacPkg.version) installed" -ForegroundColor Green
} else {
    Write-Host "       ERROR react-native-safe-area-context not found!" -ForegroundColor Red
    exit 1
}

# Step 8: Test expo config without plugin
Write-Host "[8/8] Testing expo config..." -ForegroundColor Yellow
$configOutput = npx expo config --json 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "       OK Config works without expo-router plugin!" -ForegroundColor Green
} else {
    Write-Host "       WARNING Config has issues, but dependencies are installed" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Ask user what to do next
Write-Host "Choose next step:" -ForegroundColor Cyan
Write-Host "  1 - Configure EAS (without expo-router plugin)" -ForegroundColor White
Write-Host "  2 - Restore expo-router plugin and try again" -ForegroundColor White
Write-Host "  3 - Create eas.json manually and skip configure" -ForegroundColor White
Write-Host "  4 - Test app locally first" -ForegroundColor White
Write-Host "  5 - Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Configuring EAS..." -ForegroundColor Yellow
        eas build:configure
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "OK EAS configured successfully!" -ForegroundColor Green
            Write-Host "You can now build with: eas build --platform android" -ForegroundColor Cyan
        }
    }
    "2" {
        Write-Host ""
        Write-Host "Restoring expo-router plugin..." -ForegroundColor Yellow
        $appJson = Get-Content "app.json" -Raw | ConvertFrom-Json
        $appJson.expo.plugins = @("expo-router") + $appJson.expo.plugins
        $appJson | ConvertTo-Json -Depth 10 | Set-Content "app.json"
        Write-Host "OK Plugin restored" -ForegroundColor Green
        Write-Host ""
        Write-Host "Now run: eas build:configure" -ForegroundColor Cyan
    }
    "3" {
        Write-Host ""
        Write-Host "Creating eas.json..." -ForegroundColor Yellow
        $easJsonContent = @{
            cli = @{
                version = ">= 5.0.0"
            }
            build = @{
                development = @{
                    developmentClient = $true
                    distribution = "internal"
                    android = @{
                        buildType = "apk"
                    }
                }
                preview = @{
                    distribution = "internal"
                    android = @{
                        buildType = "apk"
                    }
                }
                production = @{
                    android = @{
                        buildType = "app-bundle"
                    }
                }
            }
            submit = @{
                production = @{}
            }
        }
        $easJsonContent | ConvertTo-Json -Depth 10 | Set-Content "eas.json"
        Write-Host "OK eas.json created!" -ForegroundColor Green
        Write-Host ""
        Write-Host "You can now build with: eas build --platform android --profile development" -ForegroundColor Cyan
    }
    "4" {
        Write-Host ""
        Write-Host "Starting Expo development server..." -ForegroundColor Yellow
        npx expo start --clear
    }
    default {
        Write-Host ""
        Write-Host "Exiting. Next steps:" -ForegroundColor Cyan
        Write-Host "  - Test locally: npx expo start --clear" -ForegroundColor White
        Write-Host "  - Configure EAS: eas build:configure" -ForegroundColor White
        Write-Host "  - Or manually create eas.json and build directly" -ForegroundColor White
    }
}

Write-Host ""