# Fix Kotlin/KSP Version Issue for Hapyness App
# Save as: fix-kotlin-version.ps1
# Run with: .\fix-kotlin-version.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Fixing Kotlin/KSP Version Issue" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Fix app.json - Remove newArchEnabled
Write-Host "[1/5] Fixing app.json..." -ForegroundColor Yellow
$appJsonContent = @"
{
  "expo": {
    "name": "hapyness",
    "slug": "joyfull",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "joyfull",
    "userInterfaceStyle": "automatic",
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.hapyness.joyfull"
    },
    "android": {
      "package": "com.hapyness.joyfull",
      "versionCode": 1,
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/icon.png"
      }
    },
    "web": {
      "output": "static",
      "favicon": "./assets/icon.png"
    },
    "plugins": [
      [
        "expo-splash-screen",
        {
          "image": "./assets/icon.png",
          "imageWidth": 100,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000"
          }
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "7c3da783-add5-44df-8a12-b42ebb647944"
      }
    }
  }
}
"@
Set-Content "app.json" $appJsonContent -NoNewline
Write-Host "       Fixed app.json (removed newArchEnabled)" -ForegroundColor Green

# Step 2: Remove gradle.properties (will be regenerated)
Write-Host "[2/5] Removing old gradle.properties..." -ForegroundColor Yellow
Remove-Item "gradle.properties" -Force -ErrorAction SilentlyContinue
Write-Host "       Removed" -ForegroundColor Green

# Step 3: Update eas.json for APK production
Write-Host "[3/5] Updating eas.json..." -ForegroundColor Yellow
$easJsonContent = @"
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
"@
Set-Content "eas.json" $easJsonContent -NoNewline
Write-Host "       Updated (production will generate APK)" -ForegroundColor Green

# Step 4: Clean build artifacts
Write-Host "[4/5] Cleaning build artifacts..." -ForegroundColor Yellow
Remove-Item -Recurse -Force android -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ios -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
Write-Host "       Cleaned" -ForegroundColor Green

# Step 5: Commit changes
Write-Host "[5/5] Committing changes..." -ForegroundColor Yellow
git add .
git commit -m "Fix Kotlin version and configure APK build"
Write-Host "       Changes committed" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Fix Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Key changes made:" -ForegroundColor Cyan
Write-Host "  1. Removed newArchEnabled (causes Kotlin issues)" -ForegroundColor White
Write-Host "  2. Removed gradle.properties (will regenerate correctly)" -ForegroundColor White
Write-Host "  3. Set production build to APK format" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Push changes: git push" -ForegroundColor White
Write-Host "  2. Build APK: eas build --platform android --profile production" -ForegroundColor White
Write-Host ""
Write-Host "The build should now work without Kotlin/KSP errors!" -ForegroundColor Green
Write-Host ""