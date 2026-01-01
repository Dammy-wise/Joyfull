# Fix package.json versions for Expo SDK 54
# Save as: fix-package-versions.ps1
# Run with: .\fix-package-versions.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Fixing Package Versions for Expo 54" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Create correct package.json with Expo SDK 54 compatible versions
$packageJsonContent = @"
{
  "name": "hapyness",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",
    "lint": "expo lint"
  },
  "dependencies": {
    "@expo/vector-icons": "^15.0.2",
    "@react-native-async-storage/async-storage": "^2.2.0",
    "@react-navigation/bottom-tabs": "^7.4.0",
    "@react-navigation/elements": "^2.6.3",
    "@react-navigation/native": "^7.1.8",
    "expo": "~54.0.0",
    "expo-auth-session": "~7.0.8",
    "expo-constants": "~18.0.9",
    "expo-font": "~14.0.8",
    "expo-haptics": "~15.0.7",
    "expo-image": "~3.0.10",
    "expo-image-picker": "~17.0.8",
    "expo-linear-gradient": "~14.0.2",
    "expo-linking": "~8.0.8",
    "expo-router": "~6.0.14",
    "expo-splash-screen": "~31.0.10",
    "expo-status-bar": "~3.0.8",
    "expo-symbols": "~1.0.7",
    "expo-system-ui": "~6.0.8",
    "expo-web-browser": "~15.0.9",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-native": "0.76.5",
    "react-native-gesture-handler": "~2.20.2",
    "react-native-reanimated": "~3.16.1",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.3.0",
    "react-native-web": "~0.19.13"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@types/react": "~18.3.12",
    "typescript": "~5.3.3"
  },
  "private": true
}
"@

# Backup old package.json
if (Test-Path "package.json") {
    Copy-Item "package.json" "package.json.old.backup" -Force
    Write-Host "[1/3] Backed up old package.json" -ForegroundColor Yellow
}

# Write corrected package.json
Set-Content "package.json" $packageJsonContent -NoNewline
Write-Host "[2/3] Updated package.json with correct versions" -ForegroundColor Green

# Update eas.json to ensure APK for production
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
Write-Host "[3/3] Updated eas.json to use APK for production" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Fix Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Clean install: Remove-Item -Recurse -Force node_modules; npm install --legacy-peer-deps" -ForegroundColor White
Write-Host "  2. Build APK: eas build --platform android --profile production" -ForegroundColor White
Write-Host ""
Write-Host "Note: Production builds will now create APK files instead of AAB" -ForegroundColor Yellow
Write-Host ""