# Quick Fix Script for Hapyness App Import Paths
# Save as: quick-fix-imports.ps1
# Run with: .\quick-fix-imports.ps1

Write-Host ""
Write-Host "Fixing import paths in Hapyness app..." -ForegroundColor Cyan
Write-Host ""

# Function to replace content in file
function Fix-Imports {
    param(
        [string]$FilePath,
        [hashtable]$Replacements
    )
    
    if (Test-Path $FilePath) {
        $content = Get-Content $FilePath -Raw
        $modified = $false
        
        foreach ($old in $Replacements.Keys) {
            if ($content -match [regex]::Escape($old)) {
                $content = $content -replace [regex]::Escape($old), $Replacements[$old]
                $modified = $true
            }
        }
        
        if ($modified) {
            Set-Content $FilePath $content -NoNewline
            Write-Host "[OK] Fixed: $FilePath" -ForegroundColor Green
        } else {
            Write-Host "[SKIP] No changes needed: $FilePath" -ForegroundColor Yellow
        }
    } else {
        Write-Host "[ERROR] Not found: $FilePath" -ForegroundColor Red
    }
}

# Fix hooks/use-theme-color.ts
Fix-Imports -FilePath "hooks/use-theme-color.ts" -Replacements @{
    "@/joy/constants/theme" = "../constants/theme"
    "@/joy/hooks/use-color-scheme" = "./use-color-scheme"
}

# Fix components/themed-text.tsx
Fix-Imports -FilePath "components/themed-text.tsx" -Replacements @{
    "@/joy/hooks/use-theme-color" = "../hooks/use-theme-color"
}

# Fix components/themed-view.tsx
Fix-Imports -FilePath "components/themed-view.tsx" -Replacements @{
    "@/joy/hooks/use-theme-color" = "../hooks/use-theme-color"
}

# Fix components/ui/collapsible.tsx
Fix-Imports -FilePath "components/ui/collapsible.tsx" -Replacements @{
    "@/joy/components/themed-text" = "../themed-text"
    "@/joy/components/themed-view" = "../themed-view"
    "@/joy/components/ui/icon-symbol" = "./icon-symbol"
    "@/joy/constants/theme" = "../../constants/theme"
    "@/joy/hooks/use-color-scheme" = "../../hooks/use-color-scheme"
}

# Fix components/parallax-scroll-view.tsx
Fix-Imports -FilePath "components/parallax-scroll-view.tsx" -Replacements @{
    "@/joy/components/themed-view" = "./themed-view"
    "@/joy/hooks/use-color-scheme" = "../hooks/use-color-scheme"
    "@/joy/hooks/use-theme-color" = "../hooks/use-theme-color"
}

# Fix tsconfig.json
if (Test-Path "tsconfig.json") {
    $tsconfig = Get-Content "tsconfig.json" -Raw
    if ($tsconfig -match '"@/joy/\*"') {
        $tsconfig = $tsconfig -replace '"@/joy/\*":\s*\[.*?\]', '"@/*": ["./*"]'
        Set-Content "tsconfig.json" $tsconfig -NoNewline
        Write-Host "[OK] Fixed: tsconfig.json" -ForegroundColor Green
    } else {
        Write-Host "[SKIP] Already correct: tsconfig.json" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "All import paths fixed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run: npm install"
Write-Host "  2. Run: npx expo start --clear"
Write-Host ""