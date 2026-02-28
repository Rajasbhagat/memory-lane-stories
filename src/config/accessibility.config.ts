/** Research-based accessibility constants for MCI/dementia-friendly design */

export const TOUCH_TARGET = {
  MIN: 60,
  PREFERRED: 72,
  LARGE: 96,
  SPACING: 24,
} as const;

export const FONT_SIZE = {
  MIN: 18,
  BODY: 20,
  INTERACTIVE: 20,
  HEADING_SM: 24,
  HEADING_MD: 28,
  HEADING_LG: 36,
} as const;

export const CONTRAST = {
  AAA_NORMAL: 7.0,
  AAA_LARGE: 4.5,
  AA_NORMAL: 4.5,
  AA_LARGE: 3.0,
} as const;

export const ANIMATION = {
  DURATION_FAST: 200,
  DURATION_NORMAL: 400,
  DURATION_SLOW: 600,
  EASING: "easeOut" as const,
} as const;

export const COGNITIVE = {
  MAX_SIMULTANEOUS_ELEMENTS: 5,
  MAX_CHOICES_PER_SCREEN: 4,
  MAX_SESSION_DURATION_MS: 25 * 60 * 1000,
} as const;

export function validateTouchTarget(size: number): boolean {
  return size >= TOUCH_TARGET.MIN;
}

export function validateFontSize(size: number): boolean {
  return size >= FONT_SIZE.MIN;
}

export function validateContrast(ratio: number): boolean {
  return ratio >= CONTRAST.AAA_NORMAL;
}
