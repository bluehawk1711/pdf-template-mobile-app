/**
 * Design tokens — single source of truth for the app's visual language.
 *
 * Palette follows Apple's iOS system neutrals with one brand accent
 * (GP Studio purple). Dark mode is intentionally designed, not inverted.
 */

export interface AppColors {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  separator: string;
  border: string;
  primary: string;
  primarySoft: string;
  onPrimary: string;
  danger: string;
  success: string;
}

export const palette: { light: AppColors; dark: AppColors } = {
  light: {
    background: '#F2F2F7',
    card: '#FFFFFF',
    text: '#1C1C1E',
    textSecondary: '#6E6E73',
    textMuted: '#98989F',
    separator: '#E5E5EA',
    border: '#D1D1D6',
    primary: '#6C4AB6',
    primarySoft: '#EFEAFB',
    onPrimary: '#FFFFFF',
    danger: '#FF3B30',
    success: '#34C759',
  },
  dark: {
    background: '#000000',
    card: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#98989F',
    textMuted: '#6E6E73',
    separator: '#38383A',
    border: '#3A3A3C',
    primary: '#8B5CF6',
    primarySoft: '#2A2140',
    onPrimary: '#FFFFFF',
    danger: '#FF453A',
    success: '#30D158',
  },
};

/** Brand accent — BhorBox yellow, used on brand surfaces (splash, home). */
export const brandAccent = '#EDE345';

/** 4pt-based spacing scale */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  giant: 48,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

/** Apple-inspired type scale (pt) */
export const type = {
  largeTitle: 34,
  title1: 28,
  title2: 22,
  title3: 20,
  headline: 17,
  body: 16,
  callout: 15,
  subheadline: 14,
  footnote: 13,
  caption1: 12,
  caption2: 11,
} as const;
