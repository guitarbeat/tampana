// Helpers for VerticalSplit (React/TypeScript version)
import styled, { css } from 'styled-components';

// 1. Button scale down style (for press feedback)
export const scaleDownButtonStyle = css`
  transition: opacity 0.2s, transform 0.2s;
  &:active {
    opacity: 0.8;
    transform: scale(0.85);
    transition: opacity 0.1s, transform 0.1s;
  }
`;


// 3. Get safe area insets (web fallback)
export function getSafeAreaInsets() {
  // Try CSS env variables, fallback to 0
  const getEnv = (name: string): number => {
    if (typeof window !== 'undefined') {
      // Try both env() and --
      let value = getComputedStyle(document.documentElement).getPropertyValue(`env(${name})`);
      if (!value) value = getComputedStyle(document.documentElement).getPropertyValue(`--${name}`);
      if (value) return parseInt(value, 10) || 0;
    }
    return 0;
  };
  return {
    top: getEnv('safe-area-inset-top'),
    right: getEnv('safe-area-inset-right'),
    bottom: getEnv('safe-area-inset-bottom'),
    left: getEnv('safe-area-inset-left')
  };
}

// 4. Blur transition helper (for CSS transitions)
export function blurTransition(radius: number = 4) {
  return `filter: blur(${radius}px); transition: filter 0.3s;`;
}

// 5. Get text color for background (for contrast)
export function getTextColorForBackground(bgColor: string): string {
  // Simple luminance check for #RRGGBB or rgb()
  let r = 0, g = 0, b = 0;
  if (bgColor.startsWith('#')) {
    const hex = bgColor.replace('#', '');
    if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    }
  } else if (bgColor.startsWith('rgb')) {
    const parts = bgColor.match(/\d+/g);
    if (parts && parts.length >= 3) {
      r = parseInt(parts[0]);
      g = parseInt(parts[1]);
      b = parseInt(parts[2]);
    }
  }
  const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return brightness < 128 ? '#fff' : '#000';
}

// 6. EdgeInsets helpers (web fallback)
export interface EdgeInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export function getVerticalInsets(insets: EdgeInsets): number {
  return insets.top + insets.bottom;
}

export function getHorizontalInsets(insets: EdgeInsets): number {
  return insets.left + insets.right;
}

export function getSmartBottom(insets: EdgeInsets): number {
  return insets.bottom === 0 ? 16 : insets.bottom;
}

// Notch calculation helpers (ported from Swift)
export function getNotch(position: number, range: number): number {
  // Returns the closest notch index for a given position and range
  // NOTCHES is 6 in your constants
  const NOTCHES = 6;
  if (position < -range) return 0;
  if (position > range) return NOTCHES;
  const progress = Math.round(((position + range) / (range * 2)) * NOTCHES);
  return progress;
}

export function getSnappedPartition(notch: number, range: number): number {
  // Returns the partition value for a given notch index and range
  const NOTCHES = 6;
  const p = (notch / NOTCHES) * range * 2 - range;
  return p;
}

// Haptic feedback (vibrate) helper
export function vibrate(intensity: number = 1) {
  // On web, use the Vibration API if available
  if (typeof window !== 'undefined' && 'vibrate' in window.navigator) {
    // Map intensity to duration (arbitrary mapping)
    const duration = Math.max(10, Math.min(100, Math.round(intensity * 50)));
    window.navigator.vibrate(duration);
  }
} 