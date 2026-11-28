import {studyCases, visualCases} from './cases.mjs';
import {inkPoints, prepareStudy, upwardCap} from './study.mjs';

const epsilon = 1e-6;
const cases = [...studyCases()].map(scenario => {
  const study = prepareStudy(scenario);
  const bottom = Math.max(...inkPoints(study.centre).map(([, y]) => y));
  return {
    id: scenario.id, profile: scenario.profile, min: study.min, anchor: study.anchor, max: study.max,
    descent: study.descent, rise: study.rise, formerRise: study.formerRise,
    clearance: Math.max(0, study.frame.bottom - bottom)
  };
});
const extrema = values => [Math.min(...values), Math.max(...values)];
const floorCases = cases.filter(row => row.descent <= epsilon);
const nominalCases = cases.filter(row => row.min === 0);
const positive = cases.filter(row => row.descent > epsilon);
const visible = visualCases.map(scenario => {
  const {min, anchor, max, limit, descent, rise} = prepareStudy(scenario);
  return {id: scenario.id, min, anchor, max, limit, descent, rise};
});
console.log(JSON.stringify({
  cases: cases.length,
  floorCases: floorCases.length,
  floorClearanceMax: Math.max(...floorCases.map(row => row.clearance)),
  positiveCases: positive.length,
  positiveDescent: extrema(positive.map(row => row.descent)),
  nominalCases: nominalCases.length,
  extraBelowHistoricalZero: Math.max(...nominalCases.map(row => row.clearance - row.descent)),
  anchor: extrema(cases.map(row => row.anchor)),
  proposedRise: extrema(cases.map(row => row.rise)),
  formerRise: extrema(cases.map(row => row.formerRise)),
  upperLimitReached: cases.filter(row => row.max - row.anchor < upwardCap).length,
  examplePresetHeights: visualCases.map(scenario => ({id: scenario.id, height: scenario.brows.height ?? 50})),
  byProfile: Object.fromEntries(Object.entries(Object.groupBy(cases, row => row.profile)).map(([profile, rows]) => [
    profile, {floor: rows.filter(row => row.descent <= epsilon).length, cases: rows.length}
  ])),
  visible
}, (key, value) => typeof value === 'number' ? Number(value.toFixed(6)) : value, 2));
