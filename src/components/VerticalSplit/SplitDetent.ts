/**
 * Represents the different detent positions for the vertical split
 * Directly mapped from the SwiftUI implementation
 */
export enum SplitDetent {
  // Full screen modes
  TOP_FULL = "topFull",
  BOTTOM_FULL = "bottomFull",
  
  // Mini modes (small peek of the other panel)
  TOP_MINI = "topMini",
  BOTTOM_MINI = "bottomMini",
  
  // Fractional positions (0 = top, 1 = bottom)
  FRACTION_0 = "fraction0",
  FRACTION_1 = "fraction1",
  FRACTION_1_6 = "fraction1/6",
  FRACTION_2_6 = "fraction2/6",
  FRACTION_3_6 = "fraction3/6", // middle (50/50)
  FRACTION_4_6 = "fraction4/6",
  FRACTION_5_6 = "fraction5/6"
}

/**
 * Helper functions for working with detents
 */
export const SplitDetentHelpers = {
  /**
   * Converts a fractional value to the corresponding detent
   * @param fraction Value between 0 and 1
   * @returns The corresponding detent
   */
  fromFraction: (fraction: number): SplitDetent => {
    if (fraction <= 0) return SplitDetent.FRACTION_0;
    if (fraction >= 1) return SplitDetent.FRACTION_1;
    
    // Map to the closest notch (6 notches total)
    const notch = Math.round(fraction * 6);
    switch (notch) {
      case 0: return SplitDetent.FRACTION_0;
      case 1: return SplitDetent.FRACTION_1_6;
      case 2: return SplitDetent.FRACTION_2_6;
      case 3: return SplitDetent.FRACTION_3_6;
      case 4: return SplitDetent.FRACTION_4_6;
      case 5: return SplitDetent.FRACTION_5_6;
      case 6: return SplitDetent.FRACTION_1;
      default: return SplitDetent.FRACTION_3_6;
    }
  },
  
  /**
   * Gets the fractional value for a detent
   * @param detent The detent to convert
   * @returns Fractional value between 0 and 1
   */
  toFraction: (detent: SplitDetent): number => {
    switch (detent) {
      case SplitDetent.TOP_FULL:
        return 1;
      case SplitDetent.BOTTOM_FULL:
        return 0;
      case SplitDetent.TOP_MINI:
        return 0.9;
      case SplitDetent.BOTTOM_MINI:
        return 0.1;
      case SplitDetent.FRACTION_0:
        return 0;
      case SplitDetent.FRACTION_1:
        return 1;
      case SplitDetent.FRACTION_1_6:
        return 1/6;
      case SplitDetent.FRACTION_2_6:
        return 2/6;
      case SplitDetent.FRACTION_3_6:
        return 3/6;
      case SplitDetent.FRACTION_4_6:
        return 4/6;
      case SplitDetent.FRACTION_5_6:
        return 5/6;
      default:
        return 0.5;
    }
  },
  
  /**
   * Gets the notch number (0-6) for a given position
   * @param position Current position value
   * @param range Total range of motion
   * @returns Notch number from 0 to 6
   */
  getNotch: (position: number, range: number): number => {
    // Convert position to a 0-1 range
    const fraction = Math.max(0, Math.min(1, position / range));
    return Math.round(fraction * 6);
  },
  
  /**
   * Gets the snapped position for a given notch
   * @param notch Notch number (0-6)
   * @param range Total range of motion
   * @returns The snapped position value
   */
  getSnappedPosition: (notch: number, range: number): number => {
    const clampedNotch = Math.max(0, Math.min(6, notch));
    return (clampedNotch / 6) * range;
  }
};
