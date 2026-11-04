export const STEP = 1024;
const MIN_GAP = 1e-6;

/** Position for an item between two neighbours. Null means the gap is too small and the column needs renumbering. */
export function positionBetween(
  above: number | null,
  below: number | null,
): number | null {
  if (above === null) return below === null ? STEP : below - STEP;
  if (below === null) return above + STEP;
  if (below - above < MIN_GAP) return null;
  return (above + below) / 2;
}
