# Ultimate fix for @ import issues
# This will configure babel-plugin-module-resolver properly
# Save as: ultimate-fix.ps1
# Run with: .\ultimate-fix.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Ultimate @ Import Fix" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Install babel-plugin-module-resolver
Write-Host "[1/5] Installing babel-plugin-module-resolver..." -ForegroundColor Yellow
npm install --save-dev babel-plugin-module-resolver
Write-Host "      Installed" -ForegroundColor Green

# Step 2: Create/Update babel.config.js
Write-Host "[2/5] Creating babel.config.js..." -ForegroundColor Yellow
$babelConfig = @"
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
          },
          extensions: [
            '.ios.js',
            '.android.js',
            '.js',
            '.jsx',
            '.json',
            '.tsx',
            '.ts',
          ],
        },
      ],
    ],
  };
};
"@
Set-Content "babel.config.js" $babelConfig -NoNewline
Write-Host "      Created babel.config.js" -ForegroundColor Green

# Step 3: Update tsconfig.json
Write-Host "[3/5] Updating tsconfig.json..." -ForegroundColor Yellow
if (Test-Path "tsconfig.json") {
    $tsconfig = @"
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ],
  "extends": "expo/tsconfig.base"
}
"@
    Set-Content "tsconfig.json" $tsconfig -NoNewline
    Write-Host "      Updated tsconfig.json" -ForegroundColor Green
}

# Step 4: Clean cache
Write-Host "[4/5] Cleaning cache..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Force yarn.lock -ErrorAction SilentlyContinue
Write-Host "      Cache cleaned" -ForegroundColor Green

# Step 5: Reinstall
Write-Host "[5/5] Reinstalling dependencies..." -ForegroundColor Yellow
npm install
Write-Host "      Dependencies installed" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Fix Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "The @/ alias should now work!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. npx expo start --clear" -ForegroundColor White
Write-Host "  2. Press 'r' to reload the app" -ForegroundColor White
Write-Host ""
Write-Host "Note: You may need to restart your code editor" -ForegroundColor Yellow
Write-Host ""