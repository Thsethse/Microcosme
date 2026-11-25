import {acceptsEyes, eyeControls, solveEyes} from './eyes.mjs';

// Each slice fixes the other seven effective values and uses the integer
// resolution of the editor. A fractional current value stays reachable as-is.
export function eyeDomains(face, values) {
  return Object.fromEntries(Object.entries(eyeControls).map(([key, {min, max}]) => {
    const integers = [], intervals = [];
    for (let candidate = min; candidate <= max; candidate++) {
      if (!acceptsEyes(face, {...values, [key]: candidate})) continue;
      integers.push(candidate);
      const interval = intervals.at(-1);
      if (interval?.[1] === candidate - 1) interval[1] = candidate;
      else intervals.push([candidate, candidate]);
    }
    return [key, {intervals, points: integers}];
  }));
}

export function eyeChanges(before, after) {
  if (!before || !after) return [];
  return Object.keys(eyeControls).filter(key => before[key] !== after[key]).map(key => ({
    key, before: before[key], after: after[key]
  }));
}

export function eyeProposal(face, values) {
  const result = solveEyes(face, values);
  return {effective: result.effective, changes: eyeChanges(values, result.effective)};
}
