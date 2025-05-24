import { css } from 'styled-components';

// Types
export interface EdgeInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// Styled component helpers
export const scaleDownButtonStyle = css`
  transition: opacity 0.2s, transform 0.2s;
  &:active {
    opacity: 0.8;
    transform: scale(0.85);
    transition: opacity 0.1s, transform 0.1s;
  }
`;

export const blurTransition = (radius: number = 4) => css`
  filter: blur(${radius}px);
  transition: filter 0.3s;
`;

// Safe area helpers
export function getSafeAreaInsets() {
  const getEnv = (name: string): number => {
    if (typeof window !== 'undefined') {
      let value = getComputedStyle(document.documentElement).getPropertyValue(`env(${name})`);
      if (!value) value = getComputedStyle(document.documentElement).getPropertyValue(`--${name}`);
      if (value) {
        const num = parseFloat(value.trim());
        return isNaN(num) ? 0 : num;
      }
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

// Color helpers
export function getTextColorForBackground(bgColor: string): string {
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

// Edge insets helpers
export function getVerticalInsets(insets: EdgeInsets): number {
  return insets.top + insets.bottom;
}

export function getHorizontalInsets(insets: EdgeInsets): number {
  return insets.left + insets.right;
}

export function getSmartBottom(insets: EdgeInsets): number {
  return insets.bottom === 0 ? 16 : insets.bottom;
}

// Notch calculation helpers
export function getNotch(position: number, range: number): number {
  const NOTCHES = 6;
  if (range === 0) return 0;
  if (position < -range) return 0;
  if (position > range) return NOTCHES;
  const progress = Math.round(((position + range) / (range * 2)) * NOTCHES);
  return progress;
}

export function getSnappedPartition(notch: number, range: number): number {
  const NOTCHES = 6;
  if (range === 0) return 0;
  const p = (notch / NOTCHES) * range * 2 - range;
  return p;
}

// Haptic feedback helper
export function vibrate(intensity: number = 1) {
  if (typeof window !== 'undefined' && 'vibrate' in window.navigator) {
    const safeIntensity = Math.max(0, intensity);
    const duration = Math.max(10, Math.min(100, Math.round(safeIntensity * 50)));
    window.navigator.vibrate(duration);
  }
}

// Panel scale helper
export function getPanelScale(height: number, containerHeight: number) {
  const heightRatio = height / containerHeight;
  return 1 - (1 - heightRatio) * 0.15;
}

// Panel height calculation helper
export function getPanelHeights(splitY: number, containerHeight: number, dividerHeight: number) {
  let topHeight = Math.max(0, splitY - dividerHeight / 2);
  let bottomHeight = Math.max(0, containerHeight - (splitY + dividerHeight / 2));

  for (let i = 0; i < 10; i++) {
    const scaleTop = getPanelScale(topHeight, containerHeight);
    const scaleBottom = getPanelScale(bottomHeight, containerHeight);
    const topPanelBottom = topHeight * scaleTop;
    const bottomPanelTop = containerHeight - bottomHeight * scaleBottom;
    const gap = bottomPanelTop - topPanelBottom;
    const error = gap - dividerHeight;
    if (Math.abs(error) < 0.5) break;
    topHeight += error * 0.5;
    topHeight = Math.max(0, Math.min(topHeight, containerHeight - dividerHeight));
    bottomHeight = containerHeight - topHeight - dividerHeight;
  }
  return { topHeight: Math.round(topHeight), bottomHeight: Math.round(bottomHeight) };
} 