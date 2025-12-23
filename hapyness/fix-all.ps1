# Complete Fix Script for Hapyness App
# Save as: fix-all.ps1
# Run with: .\fix-all.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Hapyness App - Complete Fix Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Create missing directories
Write-Host "[1/12] Creating directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "constants" -Force | Out-Null
New-Item -ItemType Directory -Path "hooks" -Force | Out-Null
New-Item -ItemType Directory -Path "components" -Force | Out-Null
New-Item -ItemType Directory -Path "components/ui" -Force | Out-Null
Write-Host "       Directories created" -ForegroundColor Green

# Step 2: Create constants/theme.ts
Write-Host "[2/12] Creating constants/theme.ts..." -ForegroundColor Yellow
@"
import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
"@ | Set-Content "constants/theme.ts" -NoNewline
Write-Host "       Created constants/theme.ts" -ForegroundColor Green

# Step 3: Create hooks/use-color-scheme.ts
Write-Host "[3/12] Creating hooks/use-color-scheme.ts..." -ForegroundColor Yellow
@"
export { useColorScheme } from 'react-native';
"@ | Set-Content "hooks/use-color-scheme.ts" -NoNewline
Write-Host "       Created hooks/use-color-scheme.ts" -ForegroundColor Green

# Step 4: Create hooks/use-color-scheme.web.ts
Write-Host "[4/12] Creating hooks/use-color-scheme.web.ts..." -ForegroundColor Yellow
@"
import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
"@ | Set-Content "hooks/use-color-scheme.web.ts" -NoNewline
Write-Host "       Created hooks/use-color-scheme.web.ts" -ForegroundColor Green

# Step 5: Create hooks/use-theme-color.ts
Write-Host "[5/12] Creating hooks/use-theme-color.ts..." -ForegroundColor Yellow
@"
import { Colors } from '../constants/theme';
import { useColorScheme } from './use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
"@ | Set-Content "hooks/use-theme-color.ts" -NoNewline
Write-Host "       Created hooks/use-theme-color.ts" -ForegroundColor Green

# Step 6: Create components/themed-text.tsx
Write-Host "[6/12] Creating components/themed-text.tsx..." -ForegroundColor Yellow
@"
import { StyleSheet, Text, type TextProps } from 'react-native';
import { useThemeColor } from '../hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
"@ | Set-Content "components/themed-text.tsx" -NoNewline
Write-Host "       Created components/themed-text.tsx" -ForegroundColor Green

# Step 7: Create components/themed-view.tsx
Write-Host "[7/12] Creating components/themed-view.tsx..." -ForegroundColor Yellow
@"
import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '../hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
"@ | Set-Content "components/themed-view.tsx" -NoNewline
Write-Host "       Created components/themed-view.tsx" -ForegroundColor Green

# Step 8: Fix components/ui/collapsible.tsx
Write-Host "[8/12] Fixing components/ui/collapsible.tsx..." -ForegroundColor Yellow
if (Test-Path "components/ui/collapsible.tsx") {
    (Get-Content "components/ui/collapsible.tsx" -Raw) `
        -replace '@/joy/components/themed-text', '../themed-text' `
        -replace '@/joy/components/themed-view', '../themed-view' `
        -replace '@/joy/components/ui/icon-symbol', './icon-symbol' `
        -replace '@/joy/constants/theme', '../../constants/theme' `
        -replace '@/joy/hooks/use-color-scheme', '../../hooks/use-color-scheme' `
        | Set-Content "components/ui/collapsible.tsx" -NoNewline
    Write-Host "       Fixed components/ui/collapsible.tsx" -ForegroundColor Green
} else {
    Write-Host "       Skipped (file not found)" -ForegroundColor Gray
}

# Step 9: Fix components/parallax-scroll-view.tsx
Write-Host "[9/12] Fixing components/parallax-scroll-view.tsx..." -ForegroundColor Yellow
if (Test-Path "components/parallax-scroll-view.tsx") {
    (Get-Content "components/parallax-scroll-view.tsx" -Raw) `
        -replace '@/joy/components/themed-view', './themed-view' `
        -replace '@/joy/hooks/use-color-scheme', '../hooks/use-color-scheme' `
        -replace '@/joy/hooks/use-theme-color', '../hooks/use-theme-color' `
        | Set-Content "components/parallax-scroll-view.tsx" -NoNewline
    Write-Host "       Fixed components/parallax-scroll-view.tsx" -ForegroundColor Green
} else {
    Write-Host "       Skipped (file not found)" -ForegroundColor Gray
}

# Step 10: Fix tsconfig.json
Write-Host "[10/12] Fixing tsconfig.json..." -ForegroundColor Yellow
if (Test-Path "tsconfig.json") {
    $tsconfig = Get-Content "tsconfig.json" -Raw
    $tsconfig = $tsconfig -replace '"@/joy/\*":\s*\[[^\]]*\]', '"@/*": ["./*"]'
    Set-Content "tsconfig.json" $tsconfig -NoNewline
    Write-Host "        Fixed tsconfig.json" -ForegroundColor Green
} else {
    Write-Host "        Skipped (file not found)" -ForegroundColor Gray
}

# Step 11: Clean node_modules
Write-Host "[11/12] Cleaning node_modules..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Force yarn.lock -ErrorAction SilentlyContinue
Write-Host "        Cleaned successfully" -ForegroundColor Green

# Step 12: Install dependencies
Write-Host "[12/12] Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Fix Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next step: Run the app" -ForegroundColor Cyan
Write-Host "  npx expo start --clear" -ForegroundColor White
Write-Host ""