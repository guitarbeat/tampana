/**
 * * Friction utility function for smooth resistance calculations
 * Provides resistance when dragging beyond boundaries
 */
export default function friction(value: number): number {
  const MAX_FRICTION = 30;
  const MAX_VALUE = 100;

  const res = Math.max(
    1,
    Math.min(
      MAX_FRICTION,
      1 + (Math.abs(value) * (MAX_FRICTION - 1)) / MAX_VALUE
    )
  );

  if (value < 0) {
    return -res;
  }

  return res;
}
