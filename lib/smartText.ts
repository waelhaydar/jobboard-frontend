/**
 * Utility functions for smart text colors that adapt to background colors
 */

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): RGBColor | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calculate the relative luminance of a color
 * Based on WCAG guidelines
 */
function getLuminance(color: RGBColor): number {
  const { r, g, b } = color;
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Determine if a background color is dark
 */
export function isBackgroundDark(backgroundColor: string): boolean {
  // Handle Tailwind color classes
  const tailwindColorMap: Record<string, string> = {
    'white': '#fdfdfd',
    'black': '#000000',
    'neutral-light': '#f8fafc',
    'neutral-dark': '#334155',
    'gray-50': '#f9fafb',
    'gray-100': '#f3f4f6',
    'gray-200': '#e5e7eb',
    'gray-300': '#d1d5db',
    'gray-400': '#9ca3af',
    'gray-500': '#6b7280',
    'gray-600': '#4b5563',
    'gray-700': '#374151',
    'gray-800': '#1f2937',
    'gray-900': '#111827',
    'blue-500': '#3b82f6',
    'blue-600': '#2563eb',
    'red-500': '#ef4444',
    'green-500': '#22c55e',
    'yellow-500': '#eab308',
    'yellow-600': '#ca8a04',
    'indigo-600': '#4f46e5',
    'indigo-700': '#4338ca',
    'purple-600': '#9333ea',
  };

  // Extract color from Tailwind class if present
  const colorMatch = backgroundColor.match(/bg-([a-z]+-\d+)/);
  if (colorMatch && tailwindColorMap[colorMatch[1]]) {
    backgroundColor = tailwindColorMap[colorMatch[1]];
  }

  // Handle rgba colors and Tailwind opacity modifiers (like bg-white/30)
  if (backgroundColor.includes('rgba') || backgroundColor.includes('/')) {
    // For semi-transparent colors, we need to consider the backdrop
    // Extract the base color and assume white backdrop for overlays
    const baseColorMatch = backgroundColor.match(/bg-([a-z]+(?:-\d+)?)/);
    if (baseColorMatch && tailwindColorMap[baseColorMatch[1]]) {
      backgroundColor = tailwindColorMap[baseColorMatch[1]];
    } else {
      // Default to white background for semi-transparent overlays
      backgroundColor = '#fdfdfd';
    }
  }

  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return false;

  const luminance = getLuminance(rgb);
  return luminance < 0.5; // Dark if luminance is less than 0.5
}

/**
 * Get appropriate text color class based on background
 */
export function getSmartTextColor(backgroundColor: string, darkText: string = 'text-gray-900', lightText: string = 'text-white'): string {
  return isBackgroundDark(backgroundColor) ? lightText : darkText;
}

/**
 * Get smart text color for specific use cases
 */
export function getSmartTextColorForElement(
  backgroundColor: string,
  elementType: 'primary' | 'secondary' | 'status' | 'link' = 'primary'
): string {
  const isDark = isBackgroundDark(backgroundColor);

  switch (elementType) {
    case 'primary':
      return isDark ? 'text-white' : 'text-gray-900';
    case 'secondary':
      return isDark ? 'text-gray-200' : 'text-gray-700';
    case 'status':
      return isDark ? 'text-white' : 'text-gray-800';
    case 'link':
      return isDark ? 'text-blue-200 hover:text-blue-100' : 'text-blue-600 hover:text-blue-800';
    default:
      return isDark ? 'text-white' : 'text-gray-900';
  }
}

/**
 * Get contrast ratio between two colors for accessibility checking
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 0;

  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);

  const brighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (brighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
 */
export function meetsContrastStandard(foreground: string, background: string, isLargeText: boolean = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}
