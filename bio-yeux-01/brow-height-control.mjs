export const historicalBrowAnchor = 6;
const editingAnchor = 50;
// The historical travel is 20% of the head's vertical radius.
const maxRise = 25;

export function browHeightRange(effectiveHeight) {
  const low = effectiveHeight(0);
  const anchor = effectiveHeight(historicalBrowAnchor);
  const high = Math.min(effectiveHeight(100), anchor + maxRise);
  return {low, anchor, high};
}

export function historicalBrowHeight(level, {low, anchor, high}) {
  if (level === editingAnchor) return historicalBrowAnchor;
  return level < editingAnchor
    ? low + (anchor - low) * (level / editingAnchor)
    : anchor + (high - anchor) * ((level - editingAnchor) / editingAnchor);
}

export function browHeightEquivalent(effective, {low, anchor, high}) {
  if (effective < low || effective > high) return null;
  if (effective === anchor) return editingAnchor;
  return effective < anchor
    ? editingAnchor * (effective - low) / (anchor - low)
    : editingAnchor + editingAnchor * (effective - anchor) / (high - anchor);
}
