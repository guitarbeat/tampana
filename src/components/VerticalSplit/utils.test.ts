import { getTextColorForBackground, getNotch, getPanelScale } from './utils';

describe('utils', () => {
  describe('getTextColorForBackground', () => {
    it('returns white text for dark backgrounds', () => {
      expect(getTextColorForBackground('#000000')).toBe('#fff');
      expect(getTextColorForBackground('rgb(0, 0, 0)')).toBe('#fff');
    });

    it('returns black text for light backgrounds', () => {
      expect(getTextColorForBackground('#ffffff')).toBe('#000');
      expect(getTextColorForBackground('rgb(230, 230, 230)')).toBe('#000');
    });
  });

  describe('getNotch', () => {
    it('clamps outside range and maps within range', () => {
      const range = 100;
      expect(getNotch(-200, range)).toBe(0);
      expect(getNotch(200, range)).toBe(6);
      expect(getNotch(0, range)).toBe(3);
      expect(getNotch(50, range)).toBeGreaterThanOrEqual(3);
    });
  });

  describe('getPanelScale', () => {
    it('returns scale reduced as height decreases', () => {
      const container = 1000;
      const full = getPanelScale(container, container);
      const half = getPanelScale(container / 2, container);
      const small = getPanelScale(container / 10, container);
      expect(full).toBeCloseTo(1, 5);
      expect(half).toBeLessThan(1);
      expect(half).toBeGreaterThan(small);
      expect(half).toBeCloseTo(0.925, 3);
    });
  });
});