(() => {
  // bio-col-01/palette.mjs
  var definitions = [
    ["noir-profond", "Noir profond", "Noirs", "natural", "#29272f"],
    ["noir-ebene", "Noir \xE9b\xE8ne", "Noirs", "natural", "#3a3035"],
    ["brun-sombre", "Brun sombre", "Bruns", "natural", "#4b2f25"],
    ["brun-chocolat", "Brun chocolat", "Bruns", "natural", "#694332"],
    ["chatain", "Ch\xE2tain", "Ch\xE2tains", "natural", "#875435"],
    ["chatain-clair", "Ch\xE2tain clair", "Ch\xE2tains", "natural", "#a57950"],
    ["blond-cendre", "Blond cendr\xE9", "Blonds", "natural", "#b7a17a"],
    ["blond-dore", "Blond dor\xE9", "Blonds", "natural", "#d7b966"],
    ["blond-pale", "Blond p\xE2le", "Blonds", "natural", "#f0dfad"],
    ["roux-cuivre", "Roux cuivr\xE9", "Roux", "natural", "#b95d32"],
    ["roux-auburn", "Roux auburn", "Roux", "natural", "#853d2d"],
    ["gris-acier", "Gris acier", "Gris", "natural", "#737a83"],
    ["gris-perle", "Gris perle", "Gris", "natural", "#cbd0d4"],
    ["blanc-ivoire", "Blanc ivoire", "Blancs", "natural", "#f5f1e7"],
    ["rouge-vif", "Rouge vif", "Rouges", "fantasy", "#ed344f"],
    ["rouge-profond", "Rouge profond", "Rouges", "fantasy", "#a12746"],
    ["rose-clair", "Rose clair", "Roses", "fantasy", "#f0b6ce"],
    ["rose-framboise", "Rose framboise", "Roses", "fantasy", "#d74691"],
    ["violet-amethyste", "Violet am\xE9thyste", "Violets", "fantasy", "#9756bf"],
    ["violet-profond", "Violet profond", "Violets", "fantasy", "#643c92"],
    ["bleu-vif", "Bleu vif", "Bleus", "fantasy", "#3b66e3"],
    ["bleu-nuit", "Bleu nuit", "Bleus", "fantasy", "#304680"],
    ["turquoise-clair", "Turquoise clair", "Turquoises", "fantasy", "#6dcfc8"],
    ["turquoise-profond", "Turquoise profond", "Turquoises", "fantasy", "#238f96"],
    ["vert-emeraude", "Vert \xE9meraude", "Verts", "fantasy", "#2c9b70"],
    ["vert-sauge", "Vert sauge", "Verts", "fantasy", "#99b57a"]
  ];
  var toLinear = (x) => x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  var toSRGB = (x) => x <= 31308e-7 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
  function rgb(hex) {
    if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new RangeError("Teinte hexad\xE9cimale invalide.");
    return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  }
  function oklab(hex) {
    const [r, g, b] = rgb(hex).map(toLinear), l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
  }
  function linearRGB([L, a, b]) {
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
  }
  function contour(hex) {
    const [L, a, b] = oklab(hex), dark = Math.max(0.035, 0.64 * L - 0.045);
    let lo = 0, hi = 0.8;
    for (let i = 0; i < 20; i++) {
      const k = (lo + hi) / 2, channels = linearRGB([dark, a * k, b * k]);
      if (channels.every((v) => v >= 0 && v <= 1)) lo = k;
      else hi = k;
    }
    return "#" + linearRGB([dark, a * lo, b * lo]).map((v) => Math.round(Math.max(0, Math.min(1, toSRGB(v))) * 255).toString(16).padStart(2, "0")).join("");
  }
  function luminance(hex) {
    const [r, g, b] = rgb(hex).map(toLinear);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  var palette = Object.freeze(definitions.map(([id, name, family, category2, fill]) => Object.freeze({ id, name, family, category: category2, fill, stroke: contour(fill) })));
  var map = new Map(palette.map((p) => [p.id, p]));
  function swatch(id) {
    const p = map.get(id);
    if (!p) throw new RangeError("Couleur inconnue : " + String(id));
    return p;
  }

  // bio-yeux-01/body-structure.mjs
  var structureControls = Object.freeze({
    neck: Object.freeze({ label: "Largeur du cou", min: 70, max: 130 }),
    shoulders: Object.freeze({ label: "Largeur des \xE9paules", min: 70, max: 130 }),
    thorax: Object.freeze({ label: "Largeur du thorax", min: 70, max: 130 }),
    waist: Object.freeze({ label: "Largeur de la taille", min: 75, max: 125 }),
    pelvis: Object.freeze({ label: "Largeur du bassin", min: 70, max: 130 }),
    base: Object.freeze({ label: "Largeur de la base du pion", min: 70, max: 130 })
  });
  var axes = Object.entries(structureControls);
  var referenceStructure = Object.freeze(Object.fromEntries(axes.map(([key]) => [key, 100])));
  function validateStructure(values) {
    if (!values || typeof values !== "object" || Array.isArray(values) || Object.keys(values).length !== axes.length) {
      throw new TypeError("Les six largeurs d\u2019ossature sont requises.");
    }
    for (const [key, { label, min, max }] of axes) {
      if (!Object.hasOwn(values, key) || !Number.isInteger(values[key]) || values[key] < min || values[key] > max) {
        throw new RangeError(`${label} \xB7 pourcentage entier entre ${min} et ${max} requis.`);
      }
    }
    return values;
  }

  // bio-yeux-01/body-corpulence.mjs
  var referenceCorpulence = 50;
  var corpulenceStops = Object.freeze([
    "Tr\xE8s maigre",
    "Maigre",
    "Mince",
    "L\xE9g\xE8rement mince",
    "Standard",
    "Enrob\xE9",
    "Corpulent",
    "Ob\xE8se",
    "Tr\xE8s ob\xE8se"
  ].map((label, index) => Object.freeze({ label, value: index * 12.5 })));
  var shared = { neck: 0.1, shoulders: 0.1, thorax: 0.29, waist: 0.47, base: 0.29 };
  var previousCoefficients = {
    "adult-h": { ...shared, abdomen: 0.69, hips: 0.47, pelvis: 0.4 },
    "adult-f": { ...shared, abdomen: 0.47, hips: 0.69, pelvis: 0.5 }
  };
  var envelopes = {
    "adult-h": { slim: [7.8, 30.5, 24, 21.2, 20.8, 20.1, 19.8, 18.6], full: [14, 56, 61, 68, 70, 67, 62, 42] },
    "adult-f": { slim: [7, 24, 19, 16.6, 18, 21.5, 20.5, 19.5], full: [12.7, 44.5, 53, 63.2, 67, 68, 64, 45] }
  };
  function validateCorpulence(value) {
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      throw new RangeError("Un pourcentage de corpulence entre 0 et 100 est requis.");
    }
    return value;
  }
  function previousCorpulence(key, value, widths, regions3) {
    const t = (validateCorpulence(value) - referenceCorpulence) / referenceCorpulence;
    const coefficients = previousCoefficients[key];
    return { weight: 0.78 * t + 0.22 * t * t, widths: widths.map((width, i) => width * coefficients[regions3[i]]) };
  }
  function corpulenceEnvelope(key, value, scales, regions3) {
    const t = (validateCorpulence(value) - referenceCorpulence) / referenceCorpulence;
    const { neck, shoulders, thorax, waist: waist2, pelvis, base } = scales;
    const trunk = (shoulders + thorax + waist2 + pelvis) / 400;
    const profile = envelopes[key];
    if (t < 0) {
      const weight2 = -t * (1.24 + 0.24 * t);
      const widths2 = profile.slim.map((width, i) => width * (0.55 * scales[regions3[i]] / 100 + 0.45 * trunk));
      return { weight: weight2, widths: widths2 };
    }
    const weight = t * (1.5 - 0.5 * t);
    const widths = profile.full.map((width, i) => {
      const region = regions3[i];
      if (region === "neck") return width * (1 + 0.55 * (neck / 100 - 1));
      if (region === "base") return width * (1 + 0.42 * (base / 100 - 1));
      return width * (1 + 0.32 * (trunk - 1));
    });
    return { weight, widths };
  }

  // bio-yeux-01/chest.mjs
  var chestControls = Object.freeze({
    volume: { label: "Volume", min: 0, max: 100, neutral: 0 },
    width: { label: "Largeur", min: 0, max: 100, neutral: 50 },
    length: { label: "Allongement", min: 0, max: 100, neutral: 46 },
    roundness: { label: "Rondeur", min: 0, max: 100, neutral: 62 },
    spacing: { label: "\xC9cartement", min: 0, max: 100, neutral: 43 },
    divergence: { label: "Divergence", min: -100, max: 100, neutral: 0 },
    position: { label: "Position verticale", min: 0, max: 100, neutral: 52 },
    sag: { label: "Affaissement", min: 0, max: 100, neutral: 24 }
  });
  var axes2 = Object.entries(chestControls);
  var referenceChest = Object.freeze(Object.fromEntries(axes2.map(([key, { neutral: neutral2 }]) => [key, neutral2])));
  var chestPresets = Object.freeze([
    ["round", "Arrondie", { width: 76, length: 28, roundness: 94, spacing: 38, divergence: 0, position: 61, sag: 12 }],
    ["drop", "En goutte", { width: 56, length: 57, roundness: 78, spacing: 42, divergence: 8, position: 55, sag: 56 }],
    ["long", "Allong\xE9e", { width: 23, length: 98, roundness: 57, spacing: 44, divergence: -8, position: 53, sag: 33 }],
    ["cone", "Conique", { width: 46, length: 44, roundness: 4, spacing: 38, divergence: 11, position: 62, sag: 8 }],
    ["divergent", "Divergente", { width: 55, length: 52, roundness: 65, spacing: 74, divergence: 90, position: 57, sag: 38 }],
    ["low", "Affaiss\xE9e", { width: 68, length: 58, roundness: 64, spacing: 48, divergence: 18, position: 47, sag: 96 }]
  ]);
  function validateChest(values) {
    if (!values || Object.keys(values).length !== axes2.length || axes2.some(([key, { min, max }]) => !Object.hasOwn(values, key) || !Number.isFinite(values[key]) || values[key] < min || values[key] > max)) {
      throw new RangeError("Les huit r\xE9glages de poitrine doivent respecter leurs domaines.");
    }
    return values;
  }
  function chestGeometry(body, values, corpulence = 50) {
    const { volume, width, length, roundness, spacing, divergence, position, sag } = validateChest(values);
    if (volume === 0) return null;
    const fullness = corpulence / 100;
    const mass = (volume / 100) ** 0.56 * (0.87 + 0.13 * fullness);
    const shoulder = body.levels[1].y, thorax = body.levels[2].y;
    const anchor = shoulder + (0.72 - 0.4 * position / 100) * (thorax - shoulder);
    const depth = body.height * mass * (0.108 + 0.087 * length / 100 + 0.055 * sag / 100);
    const available2 = body.minimumWidth(anchor - 0.1 * depth, anchor + 1.02 * depth) - 2.3;
    const r = roundness / 100, s = sag / 100, tilt = divergence / 100;
    const outline3 = [
      [-0.51, 0.14],
      [-0.08, 0],
      [0.48 + 0.23 * r - 0.15 * s, 0.12 + 0.09 * s],
      [0.91, 0.43 + 0.2 * s - 0.14 * r],
      [0.49 + 0.3 * r, 0.74 + 0.08 * s],
      [0.03 + 0.11 * (1 - r), 0.94],
      [-0.47 - 0.31 * r + 0.08 * s, 0.73 + 0.1 * s],
      [-0.88, 0.42 + 0.16 * s]
    ];
    const segments = outline3.map((point3, index) => {
      const previous = outline3[(index + 7) % 8], next = outline3[(index + 1) % 8], following = outline3[(index + 2) % 8];
      const tangent = 0.14 + 0.035 * r + 0.014 * fullness;
      return [
        point3.map((value, i) => value + tangent * (next[i] - previous[i])),
        next.map((value, i) => value - tangent * (following[i] - point3[i])),
        next
      ];
    });
    const lateral2 = [[0.43 + 0.19 * tilt, 0.59 + 0.06 * s], [0.43 + 0.14 * tilt, 0.36 + 0.12 * s], outline3[2]];
    const underside = [[-0.24, 0.79], [0.49, 0.71 + 0.06 * s], outline3[3]];
    const shear = ([x, y]) => x + 0.27 * tilt * (y - 0.2);
    const extents = [...segments.flat(), ...lateral2, ...underside].map(shear);
    const left = Math.min(...extents), right = Math.max(...extents);
    const capacity = (available2 - 0.65) / (right - left);
    const preferredHalf = body.height * (0.04 + 0.082 * width / 100) * mass ** 0.85;
    const half = preferredHalf / Math.hypot(1, preferredHalf / capacity);
    const inner = 0.65 - left * half;
    const outer = available2 - right * half;
    const center = inner + (outer - inner) * (0.065 + 0.76 * spacing / 100) ** 1.32;
    const lobes = [-1, 1].map((side) => {
      const project = (offset) => [body.ground.x + side * (center + half * shear(offset)), anchor + depth * offset[1]];
      return {
        base: outline3.map(project),
        segments: segments.map((points) => points.map(project)),
        lateral: lateral2.map(project),
        underside: underside.map(project)
      };
    });
    return { anchor, depth, center, half, available: available2, fullness, lobes };
  }
  var point = ([x, y]) => `${Number(x.toFixed(3))},${Number(y.toFixed(3))}`;
  var bezier = (segment) => "C" + segment.map(point).join(" ");
  var trace = (start, segments) => "M" + point(start) + segments.map(bezier).join("");
  var blend = (skin, tint, weight) => "#" + rgb(skin).map((value, i) => Math.round(255 * (value * (1 - weight) + tint[i] * weight)).toString(16).padStart(2, "0")).join("");
  function chestMarkup(body, chest, corpulence, skin) {
    const shape = chestGeometry(body, chest, corpulence);
    if (!shape) return "";
    const lift = blend(skin, [1, 0.94, 0.78], 0.14 - 0.042 * shape.fullness);
    const side = blend(skin, [0.22, 0.11, 0.09], 0.13 - 0.035 * shape.fullness);
    const shadow2 = blend(skin, [0.22, 0.11, 0.09], 0.285 - 0.05 * shape.fullness);
    const line = 0.82 - 0.24 * shape.fullness;
    return `<g data-chest="adult-f" aria-hidden="true">${shape.lobes.map(
      ({ base, segments, lateral: lateral2, underside }) => `<path d="${trace(base[0], segments)}Z" fill="${lift}"/><path d="${trace(base[2], [...segments.slice(2, 4), lateral2])}Z" fill="${side}"/><path d="${trace(base[3], [...segments.slice(3, 6), underside])}Z" fill="${shadow2}"/><path d="${trace(base[4], segments.slice(4, 6))}" fill="none" stroke="${shadow2}" stroke-width="${line}" stroke-linecap="round"/>`
    ).join("")}</g>`;
  }

  // bio-yeux-01/adult-body.mjs
  var anatomyLevels = Object.freeze([
    { id: "neck", label: "Base du cou", height: 0 },
    { id: "shoulders", label: "\xC9paules", height: 0.12 },
    { id: "thorax", label: "Thorax", height: 0.26 },
    { id: "waist", label: "Taille", height: 0.4 },
    { id: "abdomen", label: "Abdomen", height: 0.47 },
    { id: "hips", label: "Hanches", height: 0.57 },
    { id: "pelvis", label: "Base pelvienne", height: 2 / 3 }
  ].map((level) => Object.freeze(level)));
  var adultBodies = Object.freeze({
    "adult-h": Object.freeze({
      name: "Base adulte masculine (H)",
      widths: Object.freeze([12, 48, 44, 39, 38, 36, 34]),
      baseWidth: 32
    }),
    "adult-f": Object.freeze({
      name: "Base adulte f\xE9minine (F)",
      widths: Object.freeze([10.5, 37, 35, 28, 31, 42, 39]),
      baseWidth: 36
    })
  });
  var isAdultBody = (key) => typeof key === "string" && Object.hasOwn(adultBodies, key);
  var format = (value) => Number(value.toFixed(3));
  var pair = (x, y) => `${format(x)},${format(y)}`;
  var slope = (a, b) => (b.width - a.width) / (b.y - a.y);
  function tangents(points) {
    const slopes = points.slice(1).map((point3, index) => slope(points[index], point3));
    return points.map((_, index) => {
      if (index === 0) return 0;
      const before = slopes[index - 1], after = slopes[index] ?? before;
      return before * after > 0 ? 2 * before * after / (before + after) : 0;
    });
  }
  function minimumWidth(spans, from, to) {
    return Math.min(...spans.filter(({ a, b }) => a.y <= to && b.y >= from).map(({ a, start, end, b }) => {
      const lo = Math.max(0, (from - a.y) / (b.y - a.y)), hi = Math.min(1, (to - a.y) / (b.y - a.y));
      const x0 = a.width, x1 = start.width, x2 = end.width, x3 = b.width;
      const at = (t) => x0 * (1 - t) ** 3 + 3 * x1 * t * (1 - t) ** 2 + 3 * x2 * t * t * (1 - t) + x3 * t ** 3;
      const thirdSlope = (t) => (x1 - x0) * (1 - t) ** 2 + 2 * (x2 - x1) * t * (1 - t) + (x3 - x2) * t * t;
      return Math.min(at(lo), at(lo) + thirdSlope(lo) * (hi - lo), at(hi) - thirdSlope(hi) * (hi - lo), at(hi));
    }));
  }
  var [, , , waist, abdomen, hips] = anatomyLevels;
  var abdomenWeight = (abdomen.height - waist.height) / (hips.height - waist.height);
  var regions = [...anatomyLevels.map(({ id }) => id), "base"];
  function adultBodyGeometry(key, [axis7, chinY], structure = referenceStructure, corpulence = referenceCorpulence, beforeCorrection = false) {
    validateStructure(structure);
    const profile = adultBodies[key];
    const ground = { x: axis7, y: 249 };
    const neckY = chinY - 4;
    const height = ground.y - neckY;
    const abdomenScale = structure.waist + (structure.pelvis - structure.waist) * abdomenWeight;
    const scales = { ...structure, abdomen: abdomenScale, hips: structure.pelvis };
    const levels = anatomyLevels.map((level, index) => ({
      ...level,
      y: neckY + level.height * height,
      width: profile.widths[index] * (scales[level.id] / 100)
    }));
    const flank = { y: ground.y - 8, width: profile.baseWidth * (structure.base / 100) };
    const points = [...levels, flank];
    const dx = tangents(points);
    if (corpulence !== referenceCorpulence) {
      const { weight, widths } = beforeCorrection ? previousCorpulence(key, corpulence, [...profile.widths, profile.baseWidth], regions) : corpulenceEnvelope(key, corpulence, scales, regions);
      const envelope = points.map(({ y }, index) => ({ y, width: widths[index] }));
      const envelopeDx = tangents(envelope);
      const structureWeight = beforeCorrection ? 1 : 1 - weight;
      for (const [index, point3] of points.entries()) {
        point3.width = structureWeight * point3.width + weight * envelope[index].width;
        dx[index] = structureWeight * dx[index] + weight * envelopeDx[index];
      }
    }
    const spans = points.slice(1).map((b, index) => {
      const a = points[index], step = (b.y - a.y) / 3;
      return {
        a,
        b,
        start: { width: a.width + dx[index] * step, y: a.y + step },
        end: { width: b.width - dx[index + 1] * step, y: b.y - step }
      };
    });
    const at = (side, { width, y }) => pair(axis7 + side * width, y);
    const cubic = (side, a, b, c) => `C${at(side, a)} ${at(side, b)} ${at(side, c)}`;
    const down = spans.map(({ start, end, b }) => cubic(1, start, end, b));
    const up = spans.slice().reverse().map(({ start, end, a }) => cubic(-1, end, start, a));
    const neck = levels[0];
    const baseY = ground.y - flank.y;
    const rim = { width: flank.width + dx.at(-1) * baseY * 0.7, y: flank.y + baseY * 0.7 };
    const sole = { width: flank.width * 0.62, y: ground.y };
    const path5 = [
      `M${at(1, neck)}`,
      ...down,
      cubic(1, rim, sole, { width: 0, y: ground.y }),
      cubic(-1, sole, rim, flank),
      ...up,
      `C${pair(axis7 - neck.width, neckY - 4)} ${pair(axis7 + neck.width, neckY - 4)} ${at(1, neck)}Z`
    ].join(" ");
    return { levels, ground, height, path: path5, minimumWidth: (from, to) => minimumWidth(spans, from, to) };
  }
  function adultBodyMarkup(key, chin, { skin, contour: contour2 }, structure, corpulence, beforeCorrection, chest, studySkin2 = skin) {
    const body = adultBodyGeometry(key, chin, structure, corpulence, beforeCorrection);
    const surface2 = key === "adult-f" && chest ? chestMarkup(body, chest, corpulence, studySkin2) : "";
    return `<g class="body-shape" data-adult-body="${key}"><path d="${body.path}" fill="${skin}" stroke="${contour2}" stroke-width="4.2" stroke-linejoin="round"/></g>${surface2}`;
  }

  // preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/p2/base/model.mjs
  var palette2 = Object.freeze({ skin: "#dbbf88", contour: "#c2a873", detail: "#c2a873", white: "#ebebeb", pupil: "#171713", hair: "#75470f" });
  var choices = Object.freeze({
    silhouette: ["tee", "pear", "oval", "column", "trapezoid", "hourglass"],
    head: ["triangle", "round", "oval", "square", "pear"],
    eyes: ["round", "sleepy", "sharp"],
    nose: ["button", "line", "triangle"],
    mouth: ["line", "smile", "lips", "round", "pout"],
    hair: ["short", "bob", "curls", "swept", "none"],
    chest: ["plain", "curves", "pectoral"],
    age: ["adult", "elder"]
  });
  var bounds = Object.freeze({ belly: [0.72, 1.3], shoulders: [0.72, 1.25], hips: [0.72, 1.25] });
  var defaults = Object.freeze({ silhouette: "tee", belly: 1, shoulders: 1, hips: 1, head: "triangle", eyes: "round", nose: "button", mouth: "line", hair: "short", chest: "pectoral", age: "adult" });
  var presets = Object.freeze([
    { name: "\xC9mile", note: "\xC9paules carr\xE9es \xB7 t\xEAte en pointe", ...defaults },
    { name: "Alma", note: "Courbes douces \xB7 carr\xE9 court", ...defaults, silhouette: "pear", head: "oval", hair: "bob", eyes: "sharp", mouth: "lips", chest: "curves", hips: 1.1 },
    { name: "Rose", note: "Silhouette ronde \xB7 boucles", ...defaults, silhouette: "oval", head: "square", hair: "curls", chest: "curves", nose: "line", mouth: "pout", belly: 1.12 },
    { name: "Lou", note: "Colonne fine \xB7 m\xE8che", ...defaults, silhouette: "column", head: "square", hair: "swept", chest: "plain", mouth: "smile" },
    { name: "Gustave", note: "Trap\xE8ze \xB7 visage rond", ...defaults, silhouette: "trapezoid", head: "pear", hair: "none", age: "elder", belly: 1.15, mouth: "smile", chest: "plain" },
    { name: "Ari", note: "Sablier \xB7 regard tranquille", ...defaults, silhouette: "hourglass", head: "oval", hair: "none", eyes: "sleepy", chest: "curves", nose: "line" }
  ]);
  function normalize(input = {}) {
    const p = { ...defaults };
    for (const [key, values] of Object.entries(choices)) if (values.includes(input[key])) p[key] = input[key];
    for (const [key, [lo, hi]] of Object.entries(bounds)) if (Number.isFinite(input[key])) p[key] = Math.max(lo, Math.min(hi, input[key]));
    return p;
  }
  var forms = { tee: [48, 25, 29], pear: [31, 36, 48], oval: [37, 43, 51], column: [18, 17, 18], trapezoid: [41, 48, 47], hourglass: [48, 25, 48] };
  function geometry(input) {
    const p = normalize(input), [s, b, h] = forms[p.silhouette];
    const shoulders = s * p.shoulders, belly = b * p.belly, hips2 = h * p.hips;
    const dims = { triangle: [31, 44], round: [36, 40], oval: [29, 44], square: [29, 42], pear: [34, 39] };
    const [rx, ry] = dims[p.head];
    const cy = p.head === "round" ? 68 : 65;
    const head = { cx: 80, cy, rx, ry };
    const anchor = (u, v) => [80 + rx * u, cy + ry * v];
    return {
      parameters: p,
      body: { shoulders, belly, hips: hips2, top: 108, waist: 171, bottom: 249 },
      head,
      anchors: { eyeLeft: anchor(-0.42, 0.13), eyeRight: anchor(0.42, 0.13), nose: anchor(0, 0.4), mouth: anchor(0, 0.67), browLeft: anchor(-0.42, -0.09), browRight: anchor(0.42, -0.09) }
    };
  }

  // preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/p2/hair-model.mjs
  var cuts = Object.freeze({
    classic: { name: "Classique courte", catalogue: "03 \xB7 Classique", texture: "lisse", color: "#a7742e", contour: "#79501f", light: "#bc8b43", note: "Volume sup\xE9rieur balay\xE9, tempes d\xE9gag\xE9es." },
    bob: { name: "Carr\xE9 court", catalogue: "04 \xB7 Carr\xE9 court", texture: "lisse", color: "#9a692d", contour: "#70491d", light: "#b3813c", note: "Raie centrale, m\xE8ches courbes et c\xF4t\xE9s arrondis." },
    curls: { name: "Boucles courtes", catalogue: "08 \xB7 Boucles courtes", texture: "boucl\xE9e", color: "#bc7b2c", contour: "#935b20", light: "#d69948", note: "Boucles larges, volume irr\xE9gulier autour du cr\xE2ne." }
  });
  var heads = Object.freeze({ oval: "Allong\xE9e", round: "Ronde", pear: "\xC0 bajoues" });
  var defaults2 = Object.freeze({ cut: "classic", head: "oval" });

  // preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/model.mjs
  var controls = Object.freeze({
    skull_width: { label: "Largeur du cr\xE2ne", min: 0.86, max: 1.18 },
    skull_height: { label: "Hauteur du cr\xE2ne", min: 0.88, max: 1.18 },
    forehead_width: { label: "Largeur du front", min: 0.88, max: 1.14 },
    forehead_height: { label: "Hauteur du front", min: 0.84, max: 1.18 },
    temple_width: { label: "Largeur des tempes", min: 0.9, max: 1.16 },
    cheek_width: { label: "Largeur des joues", min: 0.88, max: 1.22 },
    jowls: { label: "Volume des bajoues", min: 0.75, max: 1.35 },
    jaw_width: { label: "Largeur de la m\xE2choire", min: 0.82, max: 1.22 }
  });
  var presets2 = Object.freeze({ neutral: { name: "Neutre", values: {} }, tall: { name: "Allong\xE9 \xB7 front haut", values: { skull_width: 0.94, skull_height: 1.16, forehead_width: 0.96, forehead_height: 1.17, temple_width: 0.95, cheek_width: 0.94, jowls: 0.88, jaw_width: 0.94 } }, broad: { name: "Large \xB7 joues et bajoues", values: { skull_width: 1.16, skull_height: 0.95, forehead_width: 1.08, forehead_height: 0.96, temple_width: 1.12, cheek_width: 1.2, jowls: 1.32, jaw_width: 1.12 } } });
  function normalize2(input = {}) {
    const result = { cut: Object.hasOwn(cuts, input.cut) ? input.cut : "classic" };
    for (const [key, { min, max }] of Object.entries(controls)) result[key] = Math.max(min, Math.min(max, Number.isFinite(input[key]) ? input[key] : 1));
    return result;
  }
  var smoothMax = (a, b) => 0.5 * (a + b + Math.sqrt((a - b) ** 2 + 0.64));
  function contourPath(points) {
    let d = `M${points[0]}`;
    for (let i = 0; i < points.length; i++) {
      const p0 = points[(i + points.length - 1) % points.length], p1 = points[i], p2 = points[(i + 1) % points.length], p3 = points[(i + 2) % points.length];
      const a = p1.map((v, j) => v + (p2[j] - p0[j]) / 6), b = p2.map((v, j) => v - (p3[j] - p1[j]) / 6);
      d += ` C${a} ${b} ${p2}`;
    }
    return d + "Z";
  }
  function model(input = {}) {
    const parameters = normalize2(input), p = parameters;
    const x = 80, y = 65, r = 29 * p.skull_width, h = 44 * p.skull_height, top = y - h;
    const fw = r * p.forehead_width, tw = r * 0.88 * p.temple_width;
    const cheek = r * 0.98 * p.cheek_width, jowl = r * (0.82 + 0.75 * (p.jowls - 1)) * p.cheek_width, jaw = r * 0.62 * p.jaw_width;
    const fy = y - h * 0.46 - 16 * (p.forehead_height - 1), end = y + h - 2;
    const base = geometry({ head: "oval", hair: "none", mouth: "smile", nose: "triangle", silhouette: "tee", chest: "plain" });
    base.head = { cx: x, cy: y, rx: r, ry: h };
    const eyeX = r * 0.42 * (1 + 0.08 * (p.temple_width - 1));
    base.anchors = { eyeLeft: [x - eyeX, y + h * 0.13], eyeRight: [x + eyeX, y + h * 0.13], nose: [x, y + h * 0.4], mouth: [x, y + h * 0.67], browLeft: [x - eyeX, y - h * 0.09], browRight: [x + eyeX, y - h * 0.09] };
    const anchors = {
      crown: [x, top],
      hairline: [x, fy],
      foreheadLeft: [x - fw * 0.96, y - h * 0.5],
      foreheadRight: [x + fw * 0.96, y - h * 0.5],
      templeLeft: [x - tw, y - h * 0.12],
      templeRight: [x + tw, y - h * 0.12],
      sideLeft: [x - r, y - h * 0.34],
      sideRight: [x + r, y - h * 0.34],
      earLeft: [x - tw * 1.08, y + h * 0.18],
      earRight: [x + tw * 1.08, y + h * 0.18],
      cheekLeft: [x - cheek, y + h * 0.35],
      cheekRight: [x + cheek, y + h * 0.35],
      jowlLeft: [x - jowl, y + h * 0.63],
      jowlRight: [x + jowl, y + h * 0.63],
      jawLeft: [x - jaw, y + h * 0.85],
      jawRight: [x + jaw, y + h * 0.85],
      chin: [x, y + h],
      nape: [x, y + h + 3]
    };
    const half = [[x, top], [x + r * 0.72, y - h * 0.8], anchors.foreheadRight, [x + tw / 0.88 * 0.97, y - h * 0.12], anchors.cheekRight, anchors.jowlRight, anchors.jawRight, anchors.chin];
    const outline3 = contourPath([...half, ...half.slice(1, -1).reverse().map(([u, v]) => [2 * x - u, v])]);
    const passage = smoothMax(cheek, jowl), side = smoothMax(r + 5, passage + 3), lower = smoothMax(r * 0.88, jaw + 5);
    const fit = { cx: x, cy: y, rx: r, ry: h, top, cap: r + 5, forehead: fy, frontWidth: fw, temple: tw, side, end, cheek: passage, lower };
    const hairAnchors = { capLeft: [x - fit.cap, top + 12], capRight: [x + fit.cap, top + 12], frontLeft: [x - fw * 0.55, fy - 4], frontRight: [x + fw * 0.55, fy - 4], attachLeft: anchors.templeLeft, attachRight: anchors.templeRight, passLeft: [x - passage - 3, y + h * 0.45], passRight: [x + passage + 3, y + h * 0.45], endLeft: [x - lower, end], endRight: [x + lower, end] };
    return { parameters, cut: cuts[p.cut], base, anchors, hairAnchors, outline: outline3, fit };
  }

  // preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/catalogue.mjs
  var list = [
    ["shaved", "Ras\xE9e", 1, "bob", "bald", "Cr\xE2ne d\xE9gag\xE9, sans calotte."],
    ["short", "Courte \xE9bouriff\xE9e", 2, "classic", "short", "Petites pointes irr\xE9guli\xE8res, volume pr\xE8s du cr\xE2ne."],
    ["classic", "Classique courte", 3, "classic", "original", "M\xE8che lat\xE9rale valid\xE9e dans P3-R1."],
    ["bob", "Carr\xE9 court", 4, "bob", "original", "Raie centrale et panneaux arrondis valid\xE9s dans R1."],
    ["fringe_bob", "Carr\xE9 \xE0 frange", 5, "bob", "fringe", "Frange pleine, coupe droite au menton."],
    ["mid_waves", "Mi-longs ondul\xE9s", 6, "bob", "waves", "Ondulations souples jusqu\u2019aux \xE9paules."],
    ["long_straight", "Longs lisses", 7, "bob", "straight", "Raie centrale, longueurs brunes derri\xE8re les \xE9paules."],
    ["curls", "Boucles courtes", 8, "curls", "original", "Boucles courtes valid\xE9es dans P3-R1."],
    ["long_curls", "Boucles longues", 9, "curls", "curls", "Masse de boucles \xE9paisses jusqu\u2019\xE0 la poitrine."],
    ["braids", "Tresses", 10, "bob", "braids", "Deux tresses blondes devant les \xE9paules."],
    ["bun", "Attach\xE9 \xB7 chignon", 11, "bob", "bun", "Chignon haut et petites m\xE8ches pr\xE8s des oreilles."],
    ["pony", "Queue de cheval", 12, "classic", "pony", "Attache haute d\xE9centr\xE9e, queue courbe derri\xE8re l\u2019\xE9paule."],
    ["waist_straight", "Tr\xE8s longs lisses", null, "bob", "straight", "Rideaux lisses devant le buste, pointes \xE0 la taille."],
    ["waist_waves", "Tr\xE8s longs ondul\xE9s", null, "bob", "waves", "Vagues amples et \xE9paisses jusqu\u2019\xE0 la taille."],
    ["waist_curls", "Tr\xE8s longues boucles", null, "curls", "curls", "Cascade de boucles larges, jusqu\u2019\xE0 la taille."],
    ["afro", "Afro ample", null, "curls", "afro", "Couronne ronde tr\xE8s volumineuse, contour en gros lobes."],
    ["side_braid", "Natte sur l\u2019\xE9paule", null, "bob", "braid", "Raie d\xE9centr\xE9e, une natte \xE9paisse devant l\u2019\xE9paule droite."],
    ["asym_long", "Asym\xE9trique \xB7 carr\xE9 et cascade", null, "bob", "asym", "Carr\xE9 \xE0 gauche, longue cascade ondul\xE9e \xE0 droite."]
  ];
  var palettes = { blond: ["#c69d46", "#94712f", "#dfba64"], brown: ["#94612d", "#69451f", "#b38344"], dark: ["#79512b", "#5e401f", "#a07545"], copper: ["#b77c35", "#875a28", "#d49b51"] };
  var styles = Object.freeze(Object.fromEntries(list.map(([id, name, v1, cap, kind, note]) => {
    const palette3 = ["mid_waves", "braids", "pony", "waist_waves", "side_braid"].includes(id) ? "blond" : ["long_straight", "waist_straight"].includes(id) ? "dark" : ["long_curls", "waist_curls", "afro"].includes(id) ? "copper" : "brown";
    return [id, Object.freeze({ id, name, v1, cap, kind, note, color: palettes[palette3][0], contour: palettes[palette3][1], light: palettes[palette3][2] })];
  })));
  var bodies = Object.freeze({
    standard: { name: "Corps de r\xE9f\xE9rence", values: { silhouette: "tee", chest: "plain" } },
    slim: { name: "Silhouette mince", values: { silhouette: "column", shoulders: 0.85, belly: 0.8, hips: 0.85, chest: "plain" } },
    broad: { name: "Silhouette large", values: { silhouette: "trapezoid", shoulders: 1.12, belly: 1.3, hips: 1.2, chest: "plain" } },
    narrow: { name: "\xC9paules \xE9troites", values: { silhouette: "hourglass", shoulders: 0.72, belly: 1, hips: 1.12, chest: "plain" } },
    shoulders: { name: "\xC9paules larges", values: { silhouette: "tee", shoulders: 1.25, belly: 1, hips: 1, chest: "plain" } },
    bust: { name: "Buste volumineux", values: { silhouette: "pear", shoulders: 1.25, belly: 1.25, hips: 1.12, chest: "curves" } }
  });

  // preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/model.mjs
  function normalize3(input = {}) {
    const style = Object.hasOwn(styles, input.style) ? input.style : "classic";
    return { ...normalize2({ ...input, cut: styles[style].cap }), style, body: Object.hasOwn(bodies, input.body) ? input.body : "standard", monochrome: input.monochrome === true };
  }
  function model2(input = {}) {
    const p = normalize3(input), style = styles[p.style], m = model(p);
    if (style.kind !== "original") m.cut = { ...m.cut, ...style };
    if (p.monochrome) m.cut = { ...m.cut, color: "#94612d", contour: "#69451f", light: "#b38344" };
    return { ...m, state: p, style, body: geometry(bodies[p.body].values) };
  }

  // preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/catalogue.mjs
  var references = Object.freeze(Object.fromEntries([
    [19, "Raie classique", "classic", "bob", "Vague courte et carr\xE9 arrondi \xE0 raie lat\xE9rale."],
    [20, "D\xE9grad\xE9 court", "classic", "classic", "Dessus court pointu, puis frange balay\xE9e."],
    [21, "Carr\xE9 moderne", "classic", "bob", "Vague courte mutualis\xE9e avec 19-G ; carr\xE9 \xE0 ligne basse nette."],
    [22, "Ondulations souples", "classic", "mid_waves", "Vagues courtes retourn\xE9es, puis grandes ondulations libres."],
    [23, "Effet coiff\xE9-d\xE9coiff\xE9", "classic", "bun", "Pointes libres, puis chignon irr\xE9gulier et m\xE8ches pendantes."],
    [24, "Queue-de-cheval", "classic", "pony", "Queue basse derri\xE8re la nuque, puis queue haute d\xE9centr\xE9e."],
    [25, "Undercut", "classic", "bob", "Quiff sur c\xF4t\xE9s ras\xE9s, puis longue m\xE8che et une tempe d\xE9gag\xE9e."],
    [26, "Frange et m\xE8ches", "classic", "fringe_bob", "Frange morcel\xE9e, puis frange droite sur de longues m\xE8ches."],
    [27, "Boucles volumineuses", "curls", "long_curls", "Couronne de grandes boucles, puis cascade \xE9paisse."]
  ].map(([number, name, G, D, note]) => {
    const id = "p5-" + String(number).padStart(3, "0");
    return [id, Object.freeze({ id, number, name, note, source: "P5-A", position: `L${Math.floor((number - 19) / 3) + 1}C${(number - 19) % 3 + 1}`, bases: { G, D }, longArrangements: number === 24 ? ["G", "D"] : [22, 23, 25, 26, 27].includes(number) ? ["D"] : [] })];
  })));
  var styles2 = Object.freeze({ ...styles, ...references });
  var arrangements = Object.freeze(["G", "D"]);
  function geometryKey(id, arrangement) {
    if ((id === "p5-019" || id === "p5-021") && arrangement === "G") return "side-wave-short";
    if (id === "p5-024" && arrangement === "D") return "p4-pony";
    return id + "-" + arrangement;
  }

  // preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/model.mjs
  function normalize4(input = {}) {
    const style = input.style === void 0 ? "p5-019" : input.style;
    if (!Object.hasOwn(styles2, style)) throw new RangeError("Coiffure inconnue : " + String(style));
    const arrangement = arrangements.includes(input.arrangement) ? input.arrangement : "G";
    const baseStyle = references[style]?.bases[arrangement] || style;
    const p = normalize3({ ...input, style: baseStyle });
    return { ...p, style, arrangement, accessories: input.accessories !== false && !p.monochrome };
  }
  function model3(input = {}) {
    const state = normalize4(input), ref = references[state.style], baseState = { ...state, style: ref?.bases[state.arrangement] || state.style };
    const m = model2(baseState);
    return { ...m, state, baseState, reference: ref || null, geometryKey: ref ? geometryKey(state.style, state.arrangement) : state.style };
  }

  // preview/bio-vis-p5-i6/i5/i4/i3/i2/catalogue.mjs
  var lotB = Object.freeze(Object.fromEntries([
    [28, "Couronne tress\xE9e", "Anneau de cheveux entrelac\xE9s ; raie centrale et deux m\xE8ches libres en D.", ["D"], "braid-crown"],
    [29, "Chignon architectural", "\xC9ventail relev\xE9 en G ; chignon \xE0 grands rouleaux, attache haute et deux retomb\xE9es en D.", ["D"], "rolled-bun"],
    [30, "Boucles aristocratiques", "Rouleaux ouverts et boucles \xE0 la nuque ; demi-attache sur une longue cascade en D.", ["G", "D"], "curls"],
    [31, "Coiffure de cour", "Sommet bomb\xE9 et rouleaux sym\xE9triques ; chignon haut et m\xE8ches pendantes en D.", ["D"], "court-rolls"],
    [32, "Tresse royale", "Racines balay\xE9es et grosse natte avant ; couronne et deux longues tresses en D.", ["G", "D"], "front-braids"],
    [33, "Chignon ornement\xE9", "M\xE8ches courtes balay\xE9es et ruban de nuque ; chignon lat\xE9ral et fleur en D.", [], "side-roll"],
    [34, "Haut volume sophistiqu\xE9", "Quiff haut en grandes vagues ; balayage ample sur une cascade lat\xE9rale en D.", ["D"], "high-sweep"],
    [35, "Natte et bijoux", "Natte avant plus fine et racines liss\xE9es ; couronne basse et deux brins fins en D.", ["G", "D"], "front-braids"],
    [36, "Coiffure c\xE9r\xE9monielle", "Raie centrale et longs c\xF4t\xE9s ; structure haute de rouleaux sym\xE9triques en D.", ["G"], "ceremonial-rolls"]
  ].map(([number, name, note, longArrangements, family]) => {
    const id = "p5-" + String(number).padStart(3, "0");
    return [id, Object.freeze({ id, number, name, note, longArrangements, family, source: "P5-B", position: `L${Math.floor((number - 28) / 3) + 1}C${(number - 28) % 3 + 1}`, bases: { G: "classic", D: "classic" } })];
  })));
  var references2 = Object.freeze({ ...references, ...lotB });
  var styles3 = Object.freeze({ ...styles2, ...lotB });
  function geometryKey2(id, a) {
    return lotB[id] ? id + "-" + a : geometryKey(id, a);
  }

  // preview/bio-vis-p5-i6/i5/i4/i3/i2/model.mjs
  function normalize5(input = {}) {
    const style = input.style === void 0 ? "p5-028" : input.style;
    if (!Object.hasOwn(styles3, style)) throw new RangeError("Coiffure inconnue : " + String(style));
    if (!lotB[style]) return normalize4({ ...input, style });
    const arrangement = arrangements.includes(input.arrangement) ? input.arrangement : "G";
    const p = normalize3({ ...input, style: "classic" });
    return { ...p, style, arrangement, accessories: input.accessories !== false && !p.monochrome };
  }
  function model4(input = {}) {
    const state = normalize5(input);
    if (!lotB[state.style]) return model3(state);
    const baseState = { ...state, style: "classic" }, m = model2(baseState);
    return { ...m, state, baseState, reference: lotB[state.style], geometryKey: geometryKey2(state.style, state.arrangement) };
  }

  // preview/bio-vis-p5-i6/i5/i4/i3/catalogue.mjs
  var lotC = Object.freeze(Object.fromEntries([
    [37, "Coupe de travail", "Pointes courtes courb\xE9es ; grand balayage et queue basse lat\xE9rale en D.", ["D"]],
    [38, "Cheveux en bataille", "Pointes multidirectionnelles ; frange d\xE9chiquet\xE9e et nuque libre en D.", ["D"]],
    [39, "Coupe rustique", "Frange courte morcel\xE9e ; raie centrale et deux nattes simples en D.", ["D"]],
    [40, "Longue chevelure sauvage", "M\xE8ches de nuque \xE9tag\xE9es ; longues vagues libres et brins fins en D.", ["G", "D"]],
    [41, "Natte de travail", "Rouleau tir\xE9 sur tempes courtes et natte ; raie simple, une natte et m\xE8che libre en D.", ["G", "D"]],
    [42, "Demi-attach\xE9 naturel", "Petit chignon sur nuque libre ; demi-attache et longue masse ondul\xE9e en D.", ["G", "D"]],
    [43, "Cheveux \xE9bouriff\xE9s et longs", "Grandes m\xE8ches \xE9tag\xE9es ; balayage ample et cascade asym\xE9trique en D.", ["G", "D"]],
    [44, "Coupe asym\xE9trique simple", "Frange oblique en pointes ; panneau long et petite tempe tress\xE9e en D.", ["D"]],
    [45, "Tresses sauvages", "Gros brins courts orient\xE9s en \xE9ventail ; d\xE9parts tress\xE9s et longues nattes irr\xE9guli\xE8res en D.", ["G", "D"]]
  ].map(([number, name, note, longArrangements]) => {
    const id = "p5-" + String(number).padStart(3, "0");
    return [id, Object.freeze({ id, number, name, note, longArrangements, source: "P5-C", position: `L${Math.floor((number - 37) / 3) + 1}C${(number - 37) % 3 + 1}`, bases: { G: "classic", D: "classic" } })];
  })));
  var references3 = Object.freeze({ ...references2, ...lotC });
  var styles4 = Object.freeze({ ...styles3, ...lotC });
  function geometryKey3(id, a) {
    return lotC[id] ? id + "-" + a : geometryKey2(id, a);
  }

  // preview/bio-vis-p5-i6/i5/i4/i3/model.mjs
  function normalize6(input = {}) {
    const style = input.style === void 0 ? "p5-037" : input.style;
    if (!Object.hasOwn(styles4, style)) throw new RangeError("Coiffure inconnue : " + String(style));
    if (!lotC[style]) return normalize5({ ...input, style });
    const arrangement = arrangements.includes(input.arrangement) ? input.arrangement : "G";
    const p = normalize3({ ...input, style: "classic" });
    return { ...p, style, arrangement, accessories: input.accessories !== false && !p.monochrome };
  }
  function model5(input = {}) {
    const state = normalize6(input);
    if (!lotC[state.style]) return model4(state);
    const baseState = { ...state, style: "classic" }, m = model2(baseState);
    return { ...m, state, baseState, reference: lotC[state.style], geometryKey: geometryKey3(state.style, state.arrangement) };
  }

  // preview/bio-vis-p5-i6/i5/i4/catalogue.mjs
  var lotD = Object.freeze(Object.fromEntries([
    [46, "Cr\xEAte / Iroquois", "Bande centrale en longues pointes ; \xE9ventail inclin\xE9 en D. C\xF4t\xE9s d\xE9couverts.", []],
    [47, "C\xF4t\xE9s ras\xE9s et longue m\xE8che", "Dessus pointu rabattu ; long panneau oblique en D. Tempe oppos\xE9e courte.", ["D"]],
    [48, "Pointes \xE9bouriff\xE9es", "Pointes courtes multidirectionnelles ; m\xE8ches plus longues et rayonnantes en D.", ["D"]],
    [49, "Coupe asym\xE9trique extr\xEAme", "Longue pointe frontale et c\xF4t\xE9 court ; panneau sous le menton en D.", ["G", "D"]],
    [50, "Couleurs et m\xE8ches contrast\xE9es", "Pointes et zones contrast\xE9es ; panneau long avec m\xE8che de couleur en D.", ["D"]],
    [51, "Volume extravagant", "Tr\xE8s haut \xE9ventail souple ; rouleaux ferm\xE9s et retomb\xE9es en D.", ["D"]],
    [52, "Dreadlocks / Locks", "Cylindres courts rayonnants ; longs brins souples et certains relev\xE9s en D.", ["G", "D"]],
    [53, "Tresses cr\xE9atives", "Rang\xE9es s\xE9par\xE9es et deux brins ; implantation asym\xE9trique et longues tresses en D.", ["G", "D"]],
    [54, "Accessoires et ornements", "Pointes courtes et lunettes amovibles ; grande touffe et plumes ind\xE9pendantes en D.", ["D"]]
  ].map(([number, name, note, longArrangements]) => {
    const id = "p5-" + String(number).padStart(3, "0");
    return [id, Object.freeze({ id, number, name, note, longArrangements, source: "P5-D", position: `L${Math.floor((number - 46) / 3) + 1}C${(number - 46) % 3 + 1}`, bases: { G: "classic", D: "classic" } })];
  })));
  var references4 = Object.freeze({ ...references3, ...lotD });
  var styles5 = Object.freeze({ ...styles4, ...lotD });
  function geometryKey4(id, a) {
    if ((id === "p5-048" || id === "p5-054") && a === "G") return geometryKey3("p5-038", "G");
    if (id === "p5-050" && a === "G") return "p5-047-G";
    return lotD[id] ? id + "-" + a : geometryKey3(id, a);
  }

  // preview/bio-vis-p5-i6/i5/i4/model.mjs
  function normalize7(input = {}) {
    const style = input.style === void 0 ? "p5-046" : input.style;
    if (!Object.hasOwn(styles5, style)) throw new RangeError("Coiffure inconnue : " + String(style));
    if (!lotD[style]) return normalize6({ ...input, style });
    const arrangement = arrangements.includes(input.arrangement) ? input.arrangement : "G";
    const p = normalize3({ ...input, style: "classic" });
    return { ...p, style, arrangement, accessories: input.accessories !== false && !p.monochrome, contrast: input.contrast !== false };
  }
  function model6(input = {}) {
    const state = normalize7(input);
    if (!lotD[state.style]) return model5(state);
    const baseState = { ...state, style: "classic" }, m = model2(baseState);
    return { ...m, state, baseState, reference: lotD[state.style], geometryKey: geometryKey4(state.style, state.arrangement) };
  }

  // preview/bio-vis-p5-i6/i5/catalogue.mjs
  var lotE = Object.freeze(Object.fromEntries([
    [55, "Tresses africaines", "Rang\xE9es plaqu\xE9es et six longs brins ; chignon de fines tresses et retomb\xE9es courtes en D.", ["G", "D"]],
    [56, "Chignon japonais", "Petit chignon et front tir\xE9 ; grand chignon, raie centrale et deux m\xE8ches en D.", ["D"]],
    [57, "Coiffure \xE9gyptienne", "Carr\xE9 structur\xE9 \xE0 frange droite ; brins plus longs en D, ornements s\xE9par\xE9s.", ["G", "D"]],
    [58, "Coiffure romaine", "Couronne de boucles courtes ; chignon, rouleaux et m\xE8ches pr\xE8s des joues en D.", ["D"]],
    [59, "Coiffure m\xE9di\xE9vale", "Couronne tress\xE9e ; grandes vagues libres \xE0 raie centrale sous un bandeau en D.", ["D"]],
    [60, "Coiffure nordique", "Dessus relev\xE9, tempe tress\xE9e et natte ; couronne et deux nattes avec m\xE8ches libres en D.", ["G", "D"]],
    [61, "Coiffure asiatique", "Chignon lisse avec deux m\xE8ches fines ; grand rouleau lat\xE9ral et chignon d\xE9centr\xE9 en D.", ["G", "D"]],
    [62, "Coiffure punk", "Cr\xEAte centrale \xE9largie ; balayage asym\xE9trique \xE0 c\xF4t\xE9 court et teinte amovible en D.", ["D"]],
    [63, "Coiffure nomade", "G : foulard, cheveux non observables ; D : demi-attache torsad\xE9e haute et longueurs ondul\xE9es.", ["G", "D"]]
  ].map(([number, name, note, longArrangements]) => {
    const id = "p5-" + String(number).padStart(3, "0");
    return [id, Object.freeze({ id, number, name, note, longArrangements, source: "P5-E v1", position: `L${Math.floor((number - 55) / 3) + 1}C${(number - 55) % 3 + 1}`, bases: { G: number === 58 ? "curls" : "classic", D: "classic" }, unknownArrangements: number === 63 ? ["G"] : [] })];
  })));
  var references5 = Object.freeze({ ...references4, ...lotE });
  var styles6 = Object.freeze({ ...styles5, ...lotE });
  function geometryKey5(id, a) {
    if (id === "p5-058") return a === "G" ? "curls" : geometryKey4("p5-031", "D");
    if (id === "p5-059" && a === "G") return geometryKey4("p5-028", "G");
    if (id === "p5-062" && a === "D") return geometryKey4("p5-049", "G");
    if (id === "p5-063" && a === "G") return "unknown-under-scarf";
    return lotE[id] ? id + "-" + a : geometryKey4(id, a);
  }

  // preview/bio-vis-p5-i6/i5/model.mjs
  function normalize8(input = {}) {
    const style = input.style === void 0 ? "p5-055" : input.style;
    if (!Object.hasOwn(styles6, style)) throw new RangeError("Coiffure inconnue : " + String(style));
    if (!lotE[style]) return normalize7({ ...input, style });
    const arrangement = arrangements.includes(input.arrangement) ? input.arrangement : "G";
    const p = normalize3({ ...input, style: lotE[style].bases[arrangement] });
    return { ...p, style, arrangement, accessories: input.accessories !== false && !p.monochrome, contrast: input.contrast !== false };
  }
  function model7(input = {}) {
    const state = normalize8(input);
    if (!lotE[state.style]) return model6(state);
    const baseState = { ...state, style: lotE[state.style].bases[state.arrangement] }, m = model2(baseState);
    return { ...m, state, baseState, reference: lotE[state.style], geometryKey: geometryKey5(state.style, state.arrangement) };
  }

  // preview/bio-vis-p5-i6/catalogue.mjs
  var lotF = Object.freeze(Object.fromEntries([
    [64, "Coiffure de guerrier", "Chignon central \xE0 c\xF4t\xE9s courts ; couronne, chignon et deux longues nattes en D.", ["D"]],
    [65, "Coiffure d\u2019aventurier", "Courtes m\xE8ches projet\xE9es vers un c\xF4t\xE9 ; pointes rayonnantes jusqu\u2019\xE0 la nuque en D.", ["D"]],
    [66, "Coiffure de r\xF4deur", "Frange irr\xE9guli\xE8re G, raie et deux nattes D ; parties cach\xE9es sous la capuche inconnues.", ["G", "D"]],
    [67, "Coiffure de voyageur", "Frange balay\xE9e et deux petites couettes basses ; deux nattes sous un foulard en D.", ["G", "D"]],
    [68, "Coiffure de savant", "Grande m\xE8che courte balay\xE9e ; chignon haut et deux boucles lat\xE9rales en D.", ["D"]],
    [69, "Coiffure d\u2019alchimiste", "Pointes courtes ; chignon irr\xE9gulier et nombreuses m\xE8ches libres en D.", ["D"]],
    [70, "Coiffure spirituelle", "Chignon central \xE0 c\xF4t\xE9s courts ; chignon haut, longueurs libres et parure s\xE9par\xE9e en D.", ["D"]],
    [71, "Coiffure mystique", "Longue m\xE8che lat\xE9rale et tempe courte ; structure tress\xE9e haute et deux brins en D.", ["G", "D"]],
    [72, "Coiffure h\xE9ro\xEFque", "Grand balayage, c\xF4t\xE9 tress\xE9 et natte ; couronne \xE9tag\xE9e sur longueurs ondul\xE9es en D.", ["G", "D"]]
  ].map(([number, name, note, longArrangements]) => {
    const id = "p5-" + String(number).padStart(3, "0");
    return [id, Object.freeze({ id, number, name, note, longArrangements, source: "P5-F", position: `L${Math.floor((number - 64) / 3) + 1}C${(number - 64) % 3 + 1}`, bases: { G: "classic", D: "classic" }, partialArrangements: number === 66 ? ["G", "D"] : number === 67 ? ["D"] : [] })];
  })));
  var references6 = Object.freeze({ ...references5, ...lotF });
  var styles7 = Object.freeze({ ...styles6, ...lotF });
  function geometryKey6(id, a) {
    if (id === "p5-065" && a === "D") return geometryKey5("p5-048", "D");
    if (id === "p5-068" && a === "G") return geometryKey5("p5-019", "G");
    if (id === "p5-069" && a === "G") return geometryKey5("p5-054", "G");
    if (id === "p5-070" && a === "G") return "p5-064-G";
    if (id === "p5-071" && a === "G") return geometryKey5("p5-049", "G");
    return lotF[id] ? id + "-" + a : geometryKey5(id, a);
  }

  // preview/bio-vis-p5-i6/model.mjs
  function normalize9(input = {}) {
    const style = input.style === void 0 ? "p5-064" : input.style;
    if (!Object.hasOwn(styles7, style)) throw new RangeError("Coiffure inconnue : " + String(style));
    if (!lotF[style]) return normalize8({ ...input, style });
    const arrangement = arrangements.includes(input.arrangement) ? input.arrangement : "G";
    const p = normalize3({ ...input, style: lotF[style].bases[arrangement] });
    return { ...p, style, arrangement, accessories: input.accessories !== false && !p.monochrome, contrast: input.contrast !== false };
  }
  function model8(input = {}) {
    const state = normalize9(input);
    if (!lotF[state.style]) return model7(state);
    const baseState = { ...state, style: lotF[state.style].bases[state.arrangement] }, m = model2(baseState);
    return { ...m, state, baseState, reference: lotF[state.style], geometryKey: geometryKey6(state.style, state.arrangement) };
  }

  // preview/bio-vis-dedup-lot-2/catalogue.mjs
  var groups = Object.freeze([
    ["E03", "p5-019:G", "p5-021:G", "19-G", "21-G", "M\xEAme balayage court. R\xE9serve sur 21-G accept\xE9e ; aucune retouche graphique."],
    ["E04", "p5-028:G", "p5-059:G", "28-G", "59-G", "Couronne tress\xE9e commune ; les arrangements D restent ind\xE9pendants."],
    ["E07", "p5-047:G", "p5-050:G", "47-G", "50-G", "La couleur de 50-G reste une information historique, sans nouvelle entr\xE9e biologique."],
    ["E09", "p5-049:G", "p5-062:D", "49-G", "62-D", "Contraste de 62-D conserv\xE9. 71-G garde son entr\xE9e et son rendu."],
    ["E10", "p5-064:G", "p5-070:G", "64-G", "70-G", "Chignon central commun ; les deux arrangements D restent ind\xE9pendants."],
    ["V01", "p5-056:G", "p5-061:G", "56-G", "61-G", "Compromis de catalogue : 61-G garde ses deux m\xE8ches suppl\xE9mentaires dans son rendu historique."]
  ].map(([id, primary, secondary, primaryLabel, secondaryLabel, note]) => Object.freeze({ id, primary, secondary, primaryLabel, secondaryLabel, note })));
  var choices2 = Object.freeze(Object.entries(styles7).flatMap(([style, s], i) => {
    const number = s.number || i + 1;
    return (s.number ? ["G", "D"] : ["U"]).map((arrangement) => Object.freeze({ key: style + ":" + arrangement, style, arrangement, number, name: s.name, label: String(number).padStart(2, "0") + (arrangement === "U" ? "" : "-" + arrangement), source: s.source || "P4 / V1", position: s.position || null }));
  }));
  var byKey = new Map(choices2.map((e) => [e.key, e]));
  var alias = new Map(groups.map((g) => [g.secondary, g.primary]));
  function choice(key) {
    const e = byKey.get(key);
    if (!e) throw new RangeError("Choix historique inconnu : " + key);
    return e;
  }
  function primaryKey(key) {
    choice(key);
    return alias.get(key) || key;
  }
  function groupFor(key) {
    choice(key);
    return groups.find((g) => g.primary === key || g.secondary === key) || null;
  }
  var ordinaryChoices = Object.freeze(choices2.filter((e) => !alias.has(e.key)));
  function keyFromSelection(raw) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw) || !Object.hasOwn(styles7, raw.style)) throw new RangeError("Identifiant historique inconnu.");
    if (references6[raw.style] && raw.arrangement !== void 0 && !["G", "D"].includes(raw.arrangement)) throw new RangeError("Arrangement historique inconnu.");
    const state = normalize9(raw), key = state.style + ":" + (references6[state.style] ? state.arrangement : "U");
    choice(key);
    return key;
  }

  // preview/bio-vis-dedup-lot-3/catalogue.mjs
  var dossiers = Object.freeze([
    { id: "E06", title: "Courbes souples et pointes rayonnantes", keys: ["p5-038:G", "p5-048:G", "p5-054:G", "p5-069:G"], note: "38-G : grands retours courbes ; 48-G : pointes rayonnantes. 54-G et 69-G gardent leur g\xE9om\xE9trie historique, sans reconstruction sous les lunettes." },
    { id: "E09", title: "Une nappe oblique, un undercut \xE0 pointe", keys: ["p5-049:G", "p5-062:D", "p5-071:G"], note: "71-G re\xE7oit une nappe souple plus large, d\xE9gag\xE9e autour de l\u2019\u0153il. Les rendus et le regroupement 49-G / 62-D restent inchang\xE9s." },
    { id: "Q03", title: "Deux organisations de panneaux", keys: ["p5-019:D", "p5-021:D"], note: "19-D : panneaux arrondis et pointes rentrantes. 21-D : panneau frontal oblique continu et ligne basse plus droite. Leurs arrangements G restent inchang\xE9s." },
    { id: "V02", title: "Raie centr\xE9e et grand retour d\xE9port\xE9", keys: ["p5-056:D", "p5-061:D"], note: "56-D : deux panneaux s\xE9par\xE9s au centre. 61-D : grand retour frontal d\xE9port\xE9, raccord\xE9 au chignon existant. Les arrangements G gardent leurs rendus historiques." },
    { id: "V09", title: "Trois mouvements de volumes", keys: ["p5-029:G", "p5-034:G", "p5-051:G"], note: "29-G : rel\xE8vement roul\xE9 bas. 34-G : grande vague bascul\xE9e. 51-G : trois retours ouverts, de directions et d\u2019intervalles irr\xE9guliers. Aucun changement des versions D." }
  ]);

  // preview/bio-vis-dedup-lot-2/selection.mjs
  var clone = (raw) => JSON.parse(JSON.stringify(raw));
  function restoreSelection(raw) {
    const key = keyFromSelection(raw), copy = clone(raw);
    return { raw: copy, key, visibleKey: primaryKey(key), state: normalize9(copy), group: groupFor(key) };
  }
  function exportSelection(selection2) {
    return JSON.stringify(selection2.raw, null, 2);
  }
  function selectOrdinary(key, previous = {}) {
    if (primaryKey(key) !== key) throw new RangeError("Utiliser le contr\xF4le historique pour un identifiant secondaire.");
    const e = choice(key);
    return restoreSelection({ ...clone(previous), style: e.style, arrangement: e.arrangement === "U" ? "G" : e.arrangement });
  }

  // bio-yeux-01/catalogue.mjs
  var alias2 = Object.freeze({
    id: "BIO-INV-01-C",
    primary: "p5-048:D",
    secondary: "p5-065:D",
    primaryLabel: "48-D",
    secondaryLabel: "65-D"
  });
  var groups2 = Object.freeze([...groups, alias2]);
  var ordinaryChoices2 = Object.freeze(ordinaryChoices.filter((entry) => entry.key !== alias2.secondary));
  function restoreSelection2(raw, body, structure, corpulence, chest) {
    const selection2 = restoreSelection(raw);
    if (isAdultBody(body)) {
      selection2.state.body = body;
      if (structure != null) selection2.state.structure = Object.freeze({ ...validateStructure(structure) });
      if (corpulence != null) selection2.state.corpulence = validateCorpulence(corpulence);
      if (body === "adult-f" && chest != null) selection2.state.chest = Object.freeze({ ...validateChest(chest) });
    }
    if (selection2.key !== alias2.secondary) return selection2;
    return { ...selection2, visibleKey: alias2.primary, group: alias2 };
  }
  function selectOrdinary2(key, previous) {
    if (key === alias2.secondary) throw new RangeError("Utilisez les identifiants historiques pour ouvrir 65-D.");
    return selectOrdinary(key, previous);
  }

  // preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs
  var priorityCase = Object.freeze({ cut: "bob", skull_width: 1.18, skull_height: 1.18, forehead_width: 1.14, forehead_height: 1.18, temple_width: 0.9, cheek_width: 1.22, jowls: 1.35, jaw_width: 0.82 });
  function upperSegments(outline3) {
    const n2 = [...outline3.matchAll(/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/gi)].map((m) => Number(m[0]));
    const start = n2.slice(0, 2), segments = [];
    let previous = start;
    for (let i = 2; i < 20; i += 6) {
      const next = [previous, n2.slice(i, i + 2), n2.slice(i + 2, i + 4), n2.slice(i + 4, i + 6)];
      segments.push(next);
      previous = next[3];
    }
    return segments;
  }
  function point2(segment, t) {
    const [a, b, c, d] = segment, u = 1 - t;
    const p = [0, 1].map((i) => u * u * u * a[i] + 3 * u * u * t * b[i] + 3 * u * t * t * c[i] + t * t * t * d[i]);
    const v = [0, 1].map((i) => 3 * u * u * (b[i] - a[i]) + 6 * u * t * (c[i] - b[i]) + 3 * t * t * (d[i] - c[i]));
    const length = Math.hypot(...v);
    return { x: p[0], y: p[1], nx: v[1] / length, ny: -v[0] / length };
  }
  function scalpSamples(m, steps = 6) {
    const arcs = upperSegments(m.outline), right = [];
    for (let i = 0; i < 3; i++) for (let j = 0; j <= steps; j++) {
      if (i > 0 && j === 0) continue;
      const t = j / steps;
      right.push(point2(arcs[i], t));
    }
    const left = right.slice(1).map((p) => ({ x: 160 - p.x, y: p.y, nx: -p.nx, ny: p.ny })).reverse();
    return [...left, ...right];
  }
  var fixed = (n2) => Number(n2.toFixed(5));
  function through(points) {
    let d = "M" + points[0];
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[Math.max(0, i - 1)], b = points[i], c = points[i + 1], e = points[Math.min(points.length - 1, i + 2)];
      const c1 = b.map((v, j) => fixed(v + (c[j] - a[j]) / 6)), c2 = c.map((v, j) => fixed(v - (e[j] - b[j]) / 6));
      d += ` C${c1} ${c2} ${c}`;
    }
    return d;
  }
  function halfWidthAt(m, y) {
    const arcs = upperSegments(m.outline);
    const segment = arcs.find((s) => y <= s[3][1]) || arcs.at(-1);
    let lo = 0, hi = 1;
    for (let i = 0; i < 28; i++) {
      const t = (lo + hi) / 2;
      if (point2(segment, t).y < y) lo = t;
      else hi = t;
    }
    return point2(segment, (lo + hi) / 2).x - m.fit.cx;
  }
  function coverageCap(m) {
    const { fit: f, parameters: p, cut: c } = m, { cx: x, cy: y, rx: r, ry: h, top: t, forehead: fy, temple: tw, frontWidth: fw } = f;
    const samples = scalpSamples(m);
    const outer = samples.map((point3) => {
      const u = Math.max(0, Math.min(1, (y - h * 0.7 - point3.y) / (h * 0.3))), blend2 = u * u * (3 - 2 * u), margin = 3.3 + 3.2 * blend2;
      return [fixed(point3.x + margin * point3.nx), fixed(point3.y + margin * point3.ny)];
    });
    const join = Math.min(tw * (0.9 / 0.88), halfWidthAt(m, fy + 2) - 6.5);
    const rootY = y - h * 0.16, rootWidth = halfWidthAt(m, rootY) - 6.5;
    const outerPath = through(outer);
    let d = outerPath;
    if (p.cut === "classic") {
      d += ` L${x + tw * (0.87 / 0.88)},${y + h * 0.08} L${x + Math.min(join, halfWidthAt(m, y - h * 0.36) - 6.5)},${y - h * 0.36} Q${x + fw * 0.44},${fy + 3} ${x + fw * 0.04},${fy - 2} Q${x - fw * 0.55},${fy - 9} ${x - join},${fy + 4} L${x - tw * (0.87 / 0.88)},${y + h * 0.08}Z`;
    } else if (p.cut === "bob") {
      d += ` C${outer.at(-1)[0]},${outer.at(-1)[1] + 1.5} ${x + rootWidth},${rootY + 1.5} ${x + rootWidth},${rootY} C${x + rootWidth},${rootY - 4} ${x + join},${fy + 6} ${x + join},${fy + 2} Q${x + fw * 0.43},${fy - 1} ${x + fw * 0.19},${fy - 8} L${x},${t + 9} Q${x - fw * 0.16},${fy - 1} ${x - join},${fy + 2} L${x - rootWidth},${rootY}Z`;
    } else {
      d += ` C${outer.at(-1)[0]},${outer.at(-1)[1] + 1.5} ${x + rootWidth},${rootY + 1.5} ${x + rootWidth},${rootY} C${x + rootWidth},${rootY - 4} ${x + join},${fy + 5} ${x + join},${fy + 1} Q${x + r * 0.35},${fy + 4} ${x},${fy - 2} Q${x - fw * 0.43},${fy + 4} ${x - join},${fy + 1} L${x - rootWidth},${rootY}Z`;
    }
    return `<path data-coverage="upper-cranium" d="${d}" fill="${c.color}" stroke="none"/><path d="${outerPath}" fill="none" stroke="${c.contour}" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>`;
  }

  // preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/p2/base/render.mjs
  var path = (d, fill = palette2.skin, stroke2 = palette2.contour, width = 4.2, extra = "") => `<path d="${d}" fill="${fill}" stroke="${stroke2}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
  var ellipse = (x, y, rx, ry, fill, extra = "") => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
  var stroke = (d) => path(d, "none", palette2.detail, 1.9);
  function bodyMarkup(g) {
    const { parameters: p, body: { shoulders: s, belly: b, hips: h, top: t, waist: w, bottom: d } } = g;
    let outline3;
    const L = (x) => 80 - x, R = (x) => 80 + x;
    if (p.silhouette === "tee") outline3 = `M${L(s)},${t} L${R(s)},${t} L${R(s)},164 L${R(b)},164 L${R(h)},${d} L${L(h)},${d} L${L(b)},164 L${L(s)},164Z`;
    if (p.silhouette === "column") outline3 = `M${L(s)},${t} L${R(s)},${t - 2} Q${R(b)},171 ${R(h)},${d} L${L(h)},${d + 1} Q${L(b)},171 ${L(s)},${t}Z`;
    if (p.silhouette === "hourglass") outline3 = `M${L(s)},${t} L${R(s)},${t} L${R(b)},${w} L${R(h)},${d} L${L(h)},${d} L${L(b)},${w}Z`;
    if (p.silhouette === "trapezoid") outline3 = `M${L(s * 0.8)},${t} L${R(s * 0.8)},${t} L${R(s * 1.25)},163 L${R(b)},163 L${R(h)},${d} Q80,${d - 3} ${L(h)},${d} L${L(b)},163 L${L(s * 1.25)},163Z`;
    if (p.silhouette === "pear") outline3 = `M80,${t - 4} C${L(s * 0.8)},${t - 6} ${L(s * 1.13)},145 ${L(b * 0.86)},${w} C${L(h * 1.26)},197 ${L(h * 1.2)},${d + 4} 80,${d + 3} C${R(h * 1.2)},${d + 4} ${R(h * 1.26)},197 ${R(b * 0.86)},${w} C${R(s * 1.13)},145 ${R(s * 0.8)},${t - 6} 80,${t - 4}Z`;
    if (p.silhouette === "oval") outline3 = `M80,${t - 3} C${L(s * 1.25)},${t - 5} ${L(s * 1.3)},148 ${L(b * 0.82)},${w} C${L(h * 1.35)},198 ${L(h * 1.3)},${d + 5} 80,${d + 4} C${R(h * 1.3)},${d + 5} ${R(h * 1.35)},198 ${R(b * 0.82)},${w} C${R(s * 1.3)},148 ${R(s * 1.25)},${t - 5} 80,${t - 3}Z`;
    let out = path(outline3);
    const chestWidth = Math.min(s, b * 1.2) * 0.79;
    if (p.chest === "pectoral") {
      out += stroke(`M${80 - chestWidth},137 q-7,8 0,14 Q72,158 80,149 Q88,158 ${80 + chestWidth},151 q7,-5 0,-14 M80,153 v32 M72,169 q8,-4 16,0 M73,179 q7,-4 14,0`);
    } else if (p.chest === "curves") {
      for (const sign of [-1, 1]) {
        const x = 80 + sign * chestWidth * 0.55;
        out += stroke(`M${x - sign * chestWidth * 0.48},139 Q${x - sign * chestWidth * 0.65},166 ${x},166 Q${x + sign * chestWidth * 0.67},169 ${x + sign * chestWidth * 0.58},147`);
        out += ellipse(x + sign * chestWidth * 0.29, 157, 1.7, 1.9, palette2.detail);
      }
    } else {
      out += stroke(`M${80 - chestWidth},146 Q${80 - chestWidth * 0.8},161 76,157 M${80 + chestWidth},146 Q${80 + chestWidth * 0.8},161 84,157`);
    }
    const navelY = p.silhouette === "trapezoid" ? 199 : 191;
    out += ellipse(80, navelY, 1.9, 3.4, palette2.detail);
    if (p.silhouette === "trapezoid") out += stroke(`M${80 - b * 0.72},198 Q80,218 ${80 + b * 0.72},198`);
    out += stroke(`M${80 - Math.min(h * 0.24, 9)},221 q4,10 9,0 q5,10 ${Math.min(h * 0.24, 9)},0`);
    if (p.age === "elder") out += stroke(`M${80 - b * 0.57},184 q4,5 8,5 M${80 + b * 0.57},184 q-4,5 -8,5`);
    return `<g class="body-shape">${out}</g>`;
  }
  function headMarkup(g) {
    const { head: { cx: x, cy: y, rx, ry }, anchors: a, parameters: p } = g;
    const hair2 = p.age === "elder" ? "#b6ae94" : p.hair === "swept" ? "#d5a917" : p.hair === "curls" ? "#cb7916" : p.hair === "bob" ? "#6c521d" : palette2.hair;
    const point3 = (u, v) => [x + rx * u, y + ry * v];
    let out = "";
    if (p.hair === "bob") out += path(`M${point3(-1.03, 1.05)} Q${point3(-1.48, -0.4)} ${point3(-0.5, -1.13)} Q${point3(0.3, -1.6)} ${point3(1, -0.6)} L${point3(1.12, 1.06)} L${point3(0.66, 1.02)} L${point3(-0.7, 1.02)}Z`, hair2, hair2, 2);
    let d;
    if (p.head === "triangle") d = `M${point3(0, -1)} C${point3(-1, -1)} ${point3(-1.3, -0.13)} ${point3(-0.86, 0.45)} L${point3(0, 1.18)} L${point3(0.86, 0.45)} C${point3(1.3, -0.13)} ${point3(1, -1)} ${point3(0, -1)}Z`;
    else if (p.head === "square") d = `M${point3(-0.9, -0.1)} Q${point3(-0.97, -1.08)} ${point3(0, -1.08)} Q${point3(1.02, -1.08)} ${point3(0.94, -0.1)} L${point3(0.94, 0.98)} L${point3(-0.94, 0.98)}Z`;
    else if (p.head === "pear") d = `M${point3(-0.84, 0.18)} C${point3(-1.2, -0.45)} ${point3(-0.65, -1.12)} ${point3(0, -1.06)} C${point3(0.65, -1.12)} ${point3(1.2, -0.45)} ${point3(0.84, 0.18)} C${point3(1.55, 0.92)} ${point3(0.9, 1.13)} ${point3(0, 1.14)} C${point3(-0.9, 1.13)} ${point3(-1.55, 0.92)} ${point3(-0.84, 0.18)}Z`;
    else d = `M${point3(0, -1)} C${point3(-1.36, -1)} ${point3(-1.3, 1)} ${point3(0, 1)} C${point3(1.3, 1)} ${point3(1.36, -1)} ${point3(0, -1)}Z`;
    out += path(d);
    for (const [i, anchor] of [a.eyeLeft, a.eyeRight].entries()) {
      const [ex, ey] = anchor, ew = rx * 0.26, eh = ry * (p.eyes === "sleepy" ? 0.105 : 0.135);
      if (p.eyes === "sharp") {
        const sign = i === 0 ? 1 : -1;
        out += path(`M${ex - ew},${ey - eh - sign * 2} L${ex + ew},${ey - eh + sign * 2} L${ex + ew},${ey + eh} L${ex - ew},${ey + eh}Z`, palette2.white, palette2.pupil, 0.9);
      } else out += ellipse(ex, ey, ew, eh, palette2.white);
      out += ellipse(ex + (i === 0 ? -1 : 1) * 0.5, ey + 0.3, 1.9, 2.2, palette2.pupil);
      if (p.eyes === "sleepy") out += path(`M${ex - ew - 1},${ey - eh * 0.6} Q${ex},${ey - eh * 0.25} ${ex + ew + 1},${ey - eh * 0.6}`, "none", palette2.contour, 2.7);
      const [bx, by] = i === 0 ? a.browLeft : a.browRight;
      out += path(p.eyes === "sharp" ? `M${bx - ew},${by - 2 * (i === 0 ? 1 : -1)} L${bx + ew},${by + 2 * (i === 0 ? 1 : -1)}` : `M${bx - ew * 0.9},${by} Q${bx},${by - 1.3} ${bx + ew * 0.8},${by + 0.2}`, "none", p.hair === "none" ? palette2.contour : hair2, p.eyes === "sharp" ? 2.6 : 2.2);
      if (p.age === "elder") out += stroke(`M${ex - ew},${ey + eh + 2.2} q${ew},2 ${ew * 2},0`);
    }
    const [nx, ny] = a.nose;
    if (p.nose === "button") out += stroke(`M${nx - 3},${ny - 1} q-2,-3 0,-3 q3,1 6,0 q3,2 -1,3 M${nx},${ny - 1} v3`);
    if (p.nose === "line") out += stroke(`M${nx},${ny - 5} l-2,7 h5`);
    if (p.nose === "triangle") out += path(`M${nx},${ny - 5} l-4,7 h8Z`, palette2.detail, "none");
    const [mx, my] = a.mouth, mw = rx * 0.25;
    if (p.mouth === "line") out += stroke(`M${mx - mw},${my} q${mw},1 ${mw * 2},0`);
    if (p.mouth === "smile") out += stroke(`M${mx - mw},${my - 1} Q${mx},${my + 5} ${mx + mw},${my - 1}`);
    if (p.mouth === "lips") out += path(`M${mx - mw},${my} l${mw * 0.7},-3 l${mw * 0.3},1 l${mw * 0.3},-1 l${mw * 0.7},3 Q${mx},${my + 7} ${mx - mw},${my}Z`, "#af4b32", "none");
    if (p.mouth === "round") out += ellipse(mx, my, 2.6, 3.3, palette2.detail);
    if (p.mouth === "pout") out += path(`M${mx},${my - 1} C${mx - mw},${my - 7} ${mx - mw},${my + 2} ${mx},${my + 4} C${mx + mw},${my + 2} ${mx + mw},${my - 7} ${mx},${my - 1}Z`, palette2.detail, "none");
    if (p.age === "elder") out += stroke(`M${mx - mw - 2},${my - 2} l-1,5 M${mx + mw + 2},${my - 2} l1,5 M${point3(-0.45, -0.34)} q${rx * 0.45},-1 ${rx * 0.9},0`);
    if (p.hair === "short") {
      out += path(`M${point3(-1, 0.02)} Q${point3(-1.4, -0.85)} ${point3(-0.6, -1.13)} Q${point3(-0.12, -1.53)} ${point3(0.55, -1.13)} Q${point3(1.2, -0.98)} ${point3(0.95, -0.45)} L${point3(0.89, -0.02)} L${point3(0.7, -0.58)} Q${point3(0.27, -0.82)} ${point3(0, -0.64)} Q${point3(-0.7, -0.94)} ${point3(-0.82, -0.38)} L${point3(-0.85, 0.02)}Z`, hair2, hair2, 2);
    } else if (p.hair === "bob") {
      out += path(`M${point3(-0.94, -0.3)} Q${point3(-0.95, -1.4)} ${point3(0, -1.23)} Q${point3(0.8, -1.38)} ${point3(0.94, -0.3)} Q${point3(0.3, -0.38)} ${point3(0.05, -0.86)} Q${point3(-0.3, -0.12)} ${point3(-0.94, -0.3)}Z`, hair2, hair2, 1.5);
      for (let i = 0; i < 5; i++) out += path(`M${point3(-0.5 + i * 0.2, -1.06)} Q${point3(-0.3 + i * 0.12, -0.65)} ${point3(0, -0.45)}`, "none", "#a48a39", 0.8);
    } else if (p.hair === "swept") {
      out += path(`M${point3(-1.05, 1.02)} Q${point3(-1.27, -0.25)} ${point3(-0.98, -0.72)} Q${point3(-0.48, -1.35)} ${point3(0.18, -1.1)} Q${point3(0.72, -1.46)} ${point3(1, -0.57)} L${point3(1.04, 1.03)} L${point3(0.83, 1.03)} L${point3(0.77, -0.52)} Q${point3(0.5, -0.8)} ${point3(0.04, -0.91)} Q${point3(0.12, -0.13)} ${point3(-0.9, 0.04)} Q${point3(-0.42, -0.44)} ${point3(-0.42, -0.76)} Q${point3(-0.88, -0.19)} ${point3(-0.85, 0.17)} L${point3(-0.8, 1.02)}Z`, hair2, hair2, 1.7);
    } else if (p.hair === "curls") {
      out += path(`M${point3(-1.06, 0.03)} Q${point3(-1.26, -1.22)} ${point3(0, -1.13)} Q${point3(1.26, -1.22)} ${point3(1.06, 0.03)} L${point3(0.84, -0.35)} Q${point3(0.15, -0.5)} ${point3(-0.84, -0.35)}Z`, hair2, hair2, 1.5);
      for (let row = 0; row < 5; row++) for (let col = 0; col < 11; col++) {
        const u = -0.86 + col * 0.172, v = -0.84 + row * 0.118;
        if (u * u + v * v > 1.45) continue;
        const [px, py] = point3(u, v);
        out += path(`M${px},${py} c-4,-4 5,-6 3,-1 c-1,5 -6,0 -2,-1`, "none", p.age === "elder" ? "#d6c8a6" : (row + col) % 2 ? "#9b5b13" : "#e5a044", 1.1);
      }
      for (let i = 0; i < 66; i++) {
        const angle2 = Math.PI + i % 22 / 21 * Math.PI, layer = Math.floor(i / 22);
        const px = x + Math.cos(angle2) * (rx * (1.03 + layer * 0.06)), py = y + Math.sin(angle2) * ry * (1.03 + layer * 0.065) - layer * 0.6;
        out += path(`M${px},${py} c-5,-7 6,-8 4,-2 c-2,6 -8,0 -3,-1`, "none", p.age === "elder" ? "#c6baa1" : i % 3 ? "#a9681f" : "#d39135", 2.6);
      }
      for (const sign of [-1, 1]) for (let i = 0; i < 14; i++) {
        const px = x + sign * (rx * (0.98 + i % 3 * 0.07)), py = y - ry * 0.25 + i * 3.4;
        out += path(`M${px},${py} c${sign * 7},-5 ${sign * 7},7 0,5 c${-sign * 5},-1 ${-sign * 4},-6 0,-4`, "none", p.age === "elder" ? "#b6ae94" : i % 2 ? hair2 : "#9f681f", 2.4);
      }
    }
    return `<g class="head-shape">${out}</g>`;
  }

  // preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/source-render.mjs
  var path2 = (d, fill, stroke2, width = 1.6, extra = "") => `<path d="${d}" fill="${fill}" stroke="${stroke2}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
  var layerOrder = Object.freeze(["back", "face", "volume", "front", "sides", "texture"]);
  function hairLayers(m) {
    const { fit: f, parameters: p, cut: c } = m, { cx: x, cy: y, rx: r, ry: h, top: t, cap: w, forehead: fy, side: s, end, temple: tw, frontWidth: fw } = f;
    let back = "", volume = "", front = "", sides = "", texture2 = "";
    const draw2 = (d) => path2(d, c.color, c.contour, 1.7);
    const detail = (d) => path2(d, "none", c.contour, 1.15, 'opacity=".64"');
    if (p.cut === "classic") {
      back = draw2(`M${x - tw * (0.93 / 0.88)},${y + h * 0.19} C${x - w - 3},${y - h * 0.3} ${x - w},${t - 7} ${x},${t - 6} C${x + w},${t - 10} ${x + w + 3},${y - h * 0.25} ${x + tw * (0.93 / 0.88)},${y + h * 0.16} L${x + tw * (0.82 / 0.88)},${y - h * 0.16} L${x - tw * (0.82 / 0.88)},${y - h * 0.16}Z`);
      volume = draw2(`M${x - tw * (0.98 / 0.88)},${y - h * 0.16} Q${x - w - 4},${t + h * 0.33} ${x - r * 0.68},${t + h * 0.15} C${x - r * 0.38},${t - 9} ${x + r * 0.25},${t - 13} ${x + r * 0.66},${t - 3} Q${x + r * 0.94},${t + 2} ${x + w},${t - 1} Q${x + w + 2},${t + 9} ${x + r * 0.83},${t + 14} Q${x + tw * (0.98 / 0.88)},${y - h * 0.23} ${x + tw * (0.87 / 0.88)},${y + h * 0.08} L${x + tw * (0.77 / 0.88)},${y - h * 0.36} Q${x + fw * 0.44},${fy + 3} ${x + fw * 0.04},${fy - 2} Q${x - fw * 0.55},${fy - 9} ${x - tw * (0.78 / 0.88)},${fy + 4} L${x - tw * (0.87 / 0.88)},${y + h * 0.08}Z`);
      front = draw2(`M${x - r * 0.67},${t + h * 0.17} C${x - r * 0.3},${t - 9} ${x + r * 0.29},${t - 9} ${x + r * 0.65},${t - 2} Q${x + r * 0.94},${t + 3} ${x + w},${t - 1} Q${x + r * 0.86},${fy + 4} ${x + fw * 0.25},${fy - 1} Q${x - fw * 0.12},${fy - 8} ${x - fw * 0.54},${fy - 2}`);
      texture2 = detail(`M${x - r * 0.55},${t + 12} Q${x - r * 0.18},${t + 1} ${x + r * 0.27},${t + 3} M${x - r * 0.44},${fy - 5} Q${x - fw * 0.12},${fy - 9} ${x + r * 0.2},${fy - 4} Q${x + r * 0.55},${fy + 1} ${x + r * 0.84},${fy - 3}`);
    } else if (p.cut === "bob") {
      back = draw2(`M${x - s * 0.8},${end - 2} C${x - s - 9},${end + 2} ${x - s - 7},${y + h * 0.1} ${x - w - 3},${y - h * 0.13} C${x - w - 5},${t - 12} ${x + w + 5},${t - 12} ${x + w + 3},${y - h * 0.13} C${x + s + 7},${y + h * 0.1} ${x + s + 9},${end + 2} ${x + s * 0.8},${end - 2} Q${x},${end + 4} ${x - s * 0.8},${end - 2}Z`);
      volume = draw2(`M${x - tw * (0.9 / 0.88)},${y - h * 0.16} Q${x - w - 3},${t + h * 0.22} ${x - r * 0.62},${t - 1} Q${x},${t - 12} ${x + r * 0.62},${t - 1} Q${x + w + 3},${t + h * 0.22} ${x + tw * (0.9 / 0.88)},${y - h * 0.16} Q${x + fw * 0.43},${fy - 1} ${x + fw * 0.19},${fy - 8} L${x},${t + 9} Q${x - fw * 0.16},${fy - 1} ${x - tw * (0.9 / 0.88)},${y - h * 0.16}Z`);
      front = path2(`M${x},${t + 8} Q${x - r * 0.08},${fy - 2} ${x - tw * (0.9 / 0.88)},${fy + 2} L${x - tw * (0.95 / 0.88)},${fy - 4} Q${x - fw * 0.32},${fy - 11} ${x - r * 0.08},${t + 7}Z M${x},${t + 8} Q${x + r * 0.08},${fy - 2} ${x + tw * (0.9 / 0.88)},${fy + 2} L${x + tw * (0.95 / 0.88)},${fy - 4} Q${x + fw * 0.32},${fy - 11} ${x + r * 0.08},${t + 7}Z`, c.color, "none", 0);
      for (const sign of [-1, 1]) {
        const inner = x + sign * tw * (0.9 / 0.88), outer = x + sign * (s + 3), cheek = x + sign * (f.lower + 1), innerCheek = x + sign * (f.cheek + 1);
        sides += draw2(`M${inner},${fy} Q${outer},${y - h * 0.21} ${outer},${y + h * 0.25} Q${x + sign * (s + 6)},${end - 1} ${cheek},${end} Q${x + sign * f.lower * 0.9},${end - 4} ${innerCheek},${y + h * 0.36} Q${x + sign * r * 0.86},${y} ${inner},${fy}Z`);
        texture2 += detail(`M${x + sign * (r + 2)},${fy + 5} Q${x + sign * (s + 1)},${y + h * 0.75} ${cheek},${end - 4} M${x + sign * r * 0.18},${t + 12} Q${x + sign * fw * 0.38},${fy - 3} ${x + sign * r * 0.81},${fy - 1}`);
      }
    } else {
      const locks = [];
      const rings = 17;
      for (let i = 0; i < rings; i++) {
        const angle2 = Math.PI * 0.94 + i / (rings - 1) * Math.PI * 1.12;
        const radius = 1 + 0.045 * Math.sin(i * 2.17);
        const ly = y + Math.sin(angle2) * (h + 7) * radius;
        const z = Math.max(0, Math.min(1, (ly - y + h * 0.2) / (h * 0.5))), blend2 = z * z * (3 - 2 * z);
        const localWidth = (w + 2) * (1 - blend2) + (s + 2) * blend2;
        locks.push({
          x: x + Math.cos(angle2) * localWidth * radius,
          y: ly,
          r: 6.6 + 1.15 * Math.sin(i * 1.7)
        });
      }
      back = draw2(`M${x - s + 1},${y + h * 0.68} Q${x - s - 10},${y + h * 0.38} ${x - w - 3},${y - h * 0.13} C${x - w - 6},${t - 9} ${x + w + 6},${t - 9} ${x + w + 3},${y - h * 0.13} Q${x + s + 10},${y + h * 0.38} ${x + s - 1},${y + h * 0.68} Q${x},${y + h * 0.54} ${x - s + 1},${y + h * 0.68}Z`);
      volume = draw2(`M${x - tw * (0.9 / 0.88)},${fy + 1} Q${x - w - 2},${t + 2} ${x - r * 0.25},${t - 3} Q${x + r * 0.43},${t - 10} ${x + tw * (0.95 / 0.88)},${fy + 1} Q${x + r * 0.35},${fy + 4} ${x},${fy - 2} Q${x - fw * 0.43},${fy + 4} ${x - tw * (0.9 / 0.88)},${fy + 1}Z`);
      for (const lock of locks) {
        const { x: lx, y: ly, r: lr } = lock;
        front += path2(`M${lx - lr},${ly} C${lx - lr * 1.1},${ly - lr} ${lx + lr * 0.55},${ly - lr * 1.28} ${lx + lr},${ly - lr * 0.2} C${lx + lr * 1.48},${ly + lr * 0.55} ${lx - lr * 0.3},${ly + lr * 1.25} ${lx - lr},${ly}Z`, c.color, c.contour, 1.5);
        texture2 += path2(`M${lx - lr * 0.4},${ly - lr * 0.1} C${lx - lr * 0.15},${ly - lr * 0.85} ${lx + lr * 0.85},${ly - lr * 0.4} ${lx + lr * 0.35},${ly + lr * 0.2} Q${lx - lr * 0.18},${ly + lr * 0.66} ${lx - lr * 0.1},${ly}`, "none", c.contour, 1.45);
      }
      for (let i = -1; i <= 1; i++) {
        const lx = x + i * fw * 0.5, ly = fy - 5 + (i === 0 ? -2 : 0), lr = 6.5;
        front += draw2(`M${lx - lr},${ly} C${lx - lr},${ly - 8} ${lx + lr + 1},${ly - 7} ${lx + lr},${ly} Q${lx + lr - 2},${ly + 8} ${lx - lr + 1},${ly + 3}Z`);
        texture2 += detail(`M${lx - 2},${ly - 1} q5,-4 5,1 q-1,5 -5,2`);
      }
      for (const sign of [-1, 1]) {
        const sx = x + sign * (s + 1), sy = y + h * 0.45;
        sides += draw2(`M${sx},${sy - 10} C${sx + sign * 10},${sy - 14} ${sx + sign * 10},${sy + 7} ${sx + sign * 3},${sy + 9} Q${sx - sign * 8},${sy + 8} ${sx},${sy - 10}Z`);
        texture2 += detail(`M${sx},${sy - 3} q${sign * 6},-3 ${sign * 5},3 q${-sign * 3},6 ${-sign * 7},0`);
      }
    }
    return { back, volume, front, sides, texture: texture2 };
  }
  function construction(m) {
    const points = (anchors, color, prefix) => Object.entries(anchors).map(([key, [x, y]]) => `<circle cx="${x}" cy="${y}" r=".9" fill="#fff" stroke="${color}" stroke-width=".5"/><text x="${x + 1.3}" y="${y - 1.1}" font-size="2" fill="${color}">${prefix}${key}</text>`).join("");
    const a = m.anchors;
    return `<g class="anchors">${path2(m.outline, "none", "#168789", 0.6, 'stroke-dasharray="1 1"')}${path2(`M${a.templeLeft} Q${a.hairline} ${a.templeRight}`, "none", "#168789", 0.7, 'stroke-dasharray="2 1"')}${points(a, "#168789", "")}${points(m.hairAnchors, "#b87524", "h:")}</g>`;
  }

  // preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/render.mjs
  function hairLayers2(m) {
    const layers2 = hairLayers(m);
    return { ...layers2, volume: coverageCap(m) };
  }
  function headGroup(input = {}, options2 = {}) {
    const m = model(input), h = hairLayers2(m), face = headMarkup(m.base).replace(/<path d="[^"]*"/, `<path d="${m.outline}"`);
    const blocks = { back: h.back, face, volume: h.volume, front: h.front, sides: h.sides, texture: h.texture };
    return `<g class="p3-head" data-cut="${m.parameters.cut}">${layerOrder.map((name) => `<g data-layer="${name}">${options2.isolate && options2.isolate !== name && name !== "face" ? "" : blocks[name]}</g>`).join("")}${options2.construction ? construction(m) : ""}</g>`;
  }

  // preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/p4-render.mjs
  var path3 = (d, fill, stroke2, width = 2) => `<path d="${d}" fill="${fill}" stroke="${stroke2}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  function extraLayers(m) {
    const { fit: f, cut: c, style: s } = m, { cx: x, cy: y, ry: h, rx: r, top: t, forehead: fy, side: w, end, temple: tw } = f;
    const draw2 = (d) => path3(d, c.color, c.contour), line = (d) => path3(d, "none", c.contour, 1.35);
    const cap = coverageCap(m), old = hairLayers2(m);
    let back = "", front = "", sides = "", texture2 = "", lengths = "";
    const long = s.id.startsWith("waist_"), length = long ? 118 : s.kind === "asym" ? 88 : s.kind === "curls" ? 64 : s.kind === "straight" ? 58 : 27;
    const bottom = end + length;
    function ribbon3(sign, to, kind = "straight", front2 = false) {
      const root = x + sign * (tw + 2), edge = x + sign * (w + 7), inner = x + sign * (f.cheek + 3);
      const width = kind === "curls" ? 19 : kind === "waves" ? 8 : 10, outer = edge + sign * width;
      let d = `M${root},${fy - 2} Q${edge},${fy - 5} ${edge},${y + h * 0.4}`;
      if (kind === "straight") d += ` C${outer},${end + 10} ${outer},${to - 10} ${edge + sign * 2},${to} L${edge - sign * 10},${to - 4} Q${inner - sign * 2},${end + 10} ${inner},${y + h * 0.35}`;
      else {
        const steps = Math.max(2, Math.round((to - end + 26) / (kind === "curls" ? 16 : 30))), span2 = (to - y - h * 0.4) / steps;
        for (let i = 0; i < steps; i++) {
          const yy = y + h * 0.4 + i * span2;
          d += ` C${edge + sign * (width + 5)},${yy + span2 * 0.25} ${edge - sign * (i % 2 ? 3 : 1)},${yy + span2 * 0.65} ${edge + sign * (i % 2 ? 1 : 4)},${yy + span2}`;
        }
        d += ` Q${edge - sign * 5},${to + 6} ${edge - sign * 13},${to - 2} C${inner - sign * 7},${end + 12} ${inner + sign * 3},${end} ${inner},${y + h * 0.35}`;
      }
      d += ` Q${x + sign * r * 0.9},${y} ${root},${fy - 2}Z`;
      const shape = draw2(d);
      let detail = "";
      if (kind === "straight") detail = line(`M${edge - sign * 3},${y + h * 0.25} C${edge + sign * 5},${end + 10} ${edge + sign * 2},${to - 18} ${edge - sign * 4},${to - 8}`);
      else {
        const count = Math.max(2, Math.floor((to - end + 25) / (kind === "curls" ? 13 : 26)));
        for (let i = 0; i < count; i++) {
          const yy = y + h * 0.42 + (to - 10 - y - h * 0.42) * i / count;
          detail += line(kind === "curls" ? `M${edge - sign * 3},${yy} c${sign * 15},-9 ${sign * 17},12 ${sign * 4},10 q${-sign * 9},-3 ${-sign * 2},-7` : `M${edge - sign * 4},${yy} q${sign * 11},8 ${sign * 3},19`);
        }
      }
      if (front2) lengths += `<g data-route="front-${sign < 0 ? "left" : "right"}">${shape}${detail}</g>`;
      else if (["long_straight", "long_curls"].includes(s.id)) back += shape + detail;
      else {
        sides += shape;
        texture2 += detail;
      }
    }
    function braid(rootX, rootY, to, width, lean = 0) {
      const count = Math.round((to - rootY) / 9), step = (to - rootY) / count;
      let out = "";
      for (let i = 0; i < count; i++) {
        const yy = rootY + i * step, xx2 = rootX + lean * i / count, ww = width * (1 - 0.48 * i / count), sw = i % 2 ? 1 : -1;
        out += draw2(`M${xx2},${yy - 2} C${xx2 + sw * ww * 1.1},${yy - 5} ${xx2 + sw * ww * 1.15},${yy + step * 0.45} ${xx2},${yy + step + 1} C${xx2 - sw * ww * 1.15},${yy + step * 0.45} ${xx2 - sw * ww * 1.1},${yy - 5} ${xx2},${yy - 2}Z`);
        out += line(`M${xx2 - sw * ww * 0.65},${yy} Q${xx2},${yy + 2} ${xx2 + sw * ww * 0.6},${yy + step * 0.7}`);
      }
      const xx = rootX + lean;
      out += path3(`M${xx - width * 0.6},${to} h${width * 1.2}`, "none", c.contour, 3.3);
      out += draw2(`M${xx - width * 0.4},${to + 2} L${xx + width * 0.4},${to + 2} L${xx + width * 0.65},${to + 10} Q${xx},${to + 14} ${xx - width * 0.6},${to + 10}Z`);
      return out;
    }
    if (s.kind === "bald") return { back: "", volume: "", front: "", sides: "", texture: "", lengths: "" };
    if (s.kind === "short") {
      const points = [];
      for (let i = 0; i <= 16; i++) {
        const a = Math.PI + i / 16 * Math.PI, spike = i % 2 ? 5 : 0;
        points.push([x + Math.cos(a) * (r + 6 + spike), y + Math.sin(a) * (h + 5 + spike)]);
      }
      points.push([x + tw, y - h * 0.18], [x - tw, y - h * 0.18]);
      back = draw2("M" + points.join(" L") + "Z");
      front = draw2(`M${x - r * 0.76},${fy - 6} l${r * 0.3},-10 l${r * 0.15},6 l${r * 0.34},-8 l${r * 0.18},9 l${r * 0.48},-6 l-4,11 Q${x},${fy - 4} ${x - r * 0.76},${fy - 6}Z`);
      texture2 = line(`M${x - r * 0.55},${t + 9} l7,-4 M${x + 4},${t + 8} l7,-4`);
    } else if (s.kind === "fringe") {
      back = draw2(`M${x - w - 4},${end} Q${x - w - 11},${y} ${x - r * 0.65},${t - 5} Q${x},${t - 13} ${x + r * 0.65},${t - 5} Q${x + w + 11},${y} ${x + w + 4},${end}Z`);
      for (const sign of [-1, 1]) {
        const inner = x + sign * (f.cheek + 1), outer = x + sign * (w + 5);
        sides += draw2(`M${x + sign * (tw + 1)},${fy} L${outer},${fy} L${outer},${end} L${inner},${end} Q${inner - sign * 6},${y + h * 0.5} ${x + sign * (tw + 1)},${fy}Z`);
        texture2 += line(`M${outer - sign * 5},${fy + 7} L${outer - sign * 4},${end - 5}`);
      }
      const by = Math.min(m.base.anchors.browLeft[1] - 4, fy + 10), a = tw * 0.94;
      front = draw2(`M${x - a},${fy - 7} Q${x},${t} ${x + a},${fy - 7} L${x + a},${by} Q${x},${by + 1} ${x - a},${by}Z`);
      for (let i = -2; i <= 2; i++) texture2 += line(`M${x + i * a / 3},${fy - 4} l1,${by - fy + 1}`);
    } else if (["straight", "waves", "curls", "asym"].includes(s.kind)) {
      back = s.kind === "asym" ? draw2(`M${x - w - 4},${fy} C${x - w - 13},${t - 12} ${x + w + 13},${t - 12} ${x + w + 4},${fy} L${x + w + 9},${bottom - 9} Q${x + w - 2},${bottom} ${x + w - 10},${bottom - 6} L${x + w - 10},${end} L${x - w - 4},${end}Z`) : draw2(`M${x - w - 4},${fy} C${x - w - 13},${t - 12} ${x + w + 13},${t - 12} ${x + w + 4},${fy} L${x + w + 9},${bottom - 9} Q80,${bottom + 8} ${x - w - 9},${bottom - 9}Z`);
      front = old.front;
      if (s.kind === "curls") texture2 = old.texture;
      if (s.kind === "asym") {
        ribbon3(-1, end + 1, "straight");
        ribbon3(1, bottom, "waves", true);
        front += draw2(`M${x - r * 0.38},${t + 6} Q${x + r * 0.48},${fy - 8} ${x + tw + 1},${fy + 3} L${x + tw + 4},${fy - 5} Q${x + r * 0.7},${t - 2} ${x - r * 0.38},${t + 6}Z`);
      } else for (const sign of [-1, 1]) ribbon3(sign, bottom, s.kind, long || s.kind === "waves");
    } else if (s.kind === "afro") {
      const points = [];
      for (let i = 0; i < 40; i++) {
        const a = 2 * Math.PI * i / 40, lobe = i % 2 ? 2.5 : -2.5;
        points.push([x + Math.cos(a) * (w + 24 + lobe), y - 7 + Math.sin(a) * (h + 20 + lobe)]);
      }
      back = draw2(contourPath(points));
      front = old.front;
      for (let row = 0; row < 7; row++) for (let col = 0; col < 9; col++) {
        const u = (col - 4) / 4, v = -0.92 + row * 0.27, px = x + u * (w + 18), py = y - 7 + v * (h + 15);
        if (u * u + v * v > 0.9 || v > -0.6 && Math.abs(u) < 0.78) continue;
        texture2 += line(`M${px},${py} c-5,-6 7,-9 6,-2 c-1,7 -9,5 -6,0`);
      }
    } else if (s.kind === "braids" || s.kind === "braid") {
      back = old.back;
      front = old.front;
      for (const sign of s.kind === "braids" ? [-1, 1] : [1]) {
        const root = x + sign * (w + 1), yy = end - 6;
        sides += draw2(`M${x + sign * tw},${fy} Q${root + sign * 9},${y} ${root},${yy + 4} L${root - sign * 9},${yy} Q${root - sign * 3},${y + h * 0.3} ${x + sign * tw},${fy}Z`);
        lengths += `<g data-route="front-${sign < 0 ? "left" : "right"}">${braid(root, yy, s.kind === "braids" ? end + 67 : end + 111, s.kind === "braids" ? 7 : 10, s.kind === "braids" ? sign * 3 : 8)}</g>`;
      }
      if (s.kind === "braid") {
        sides += draw2(`M${x - tw},${fy} Q${x - w - 4},${y + h * 0.1} ${x - w + 4},${end - 6} L${x - w + 12},${end - 10} Q${x - w},${y} ${x - tw},${fy}Z`);
        texture2 += line(`M${x - r * 0.4},${t + 9} Q${x + r * 0.2},${fy - 6} ${x + tw},${fy + 2}`);
      }
    } else if (s.kind === "bun") {
      back = draw2(`M${x - 14},${t + 2} C${x - 34},${t - 29} ${x + 30},${t - 37} ${x + 18},${t + 2}Z`);
      back += line(`M${x - 13},${t - 6} C${x - 20},${t - 24} ${x + 20},${t - 28} ${x + 14},${t - 9} Q${x - 4},${t - 17} ${x - 10},${t - 7}`);
      front = old.front;
      for (const sign of [-1, 1]) {
        sides += draw2(`M${x + sign * tw},${fy} Q${x + sign * (w + 6)},${y + h * 0.4} ${x + sign * (w - 5)},${end + 8} Q${x + sign * (w + 1)},${y + h * 0.3} ${x + sign * (tw - 3)},${fy + 4}Z`);
        texture2 += line(`M${x + sign * r * 0.26},${t + 8} Q${x + sign * r * 0.72},${fy - 8} ${x + sign * (tw + 1)},${fy}`);
      }
    } else if (s.kind === "pony") {
      const ax = x + r * 0.76, ay = t + 12;
      back = draw2(`M${ax},${ay} C${ax + 40},${ay - 16} ${x + w + 42},${end - 8} ${x + w + 8},${end + 42} Q${x + w + 23},${end + 16} ${x + w + 7},${end - 1} C${x + w - 4},${y + h * 0.2} ${ax + 13},${ay + 9} ${ax},${ay}Z`);
      back += line(`M${ax + 12},${ay + 6} Q${x + w + 42},${y + h * 0.1} ${x + w + 14},${end + 24}`);
      back += path3(`M${ax + 1},${ay - 1} l7,10`, "none", c.contour, 4);
      front = old.front;
      texture2 = old.texture;
    }
    return { back, volume: cap, front, sides, texture: texture2, lengths };
  }
  function layers(input = {}) {
    const m = model2(input);
    return m.style.kind === "original" ? { ...hairLayers2(m), lengths: "" } : extraLayers(m);
  }
  function headGroup2(input = {}, options2 = {}) {
    const m = model2(input);
    if (m.style.kind === "original") {
      let html = headGroup(m.parameters, options2);
      if (m.state.monochrome) {
        const c = model2({ ...m.state, monochrome: false }).cut;
        for (const [old, next] of [[c.color, m.cut.color], [c.contour, m.cut.contour], [c.light, m.cut.light]]) html = html.replaceAll(old, next);
      }
      return html;
    }
    const h = extraLayers(m), face = headMarkup(m.base).replace(/<path d="[^"]*"/, `<path d="${m.outline}"`);
    return `<g class="p4-head" data-cut="${m.style.id}">${["face", "volume", "front", "sides", "texture"].map((k) => `<g data-layer="${k}">${k === "face" ? face : h[k]}</g>`).join("")}${options2.construction ? construction(m) : ""}</g>`;
  }
  function character(input = {}, options2 = {}) {
    const m = model2(input), h = layers(input), original = m.style.kind === "original";
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${options2.headOnly ? m.style.id === "afro" ? "-10 -38 180 174" : "0 -32 160 165" : "-26 -43 212 310"}" role="img" aria-label="${styles[m.state.style].name} \xB7 ${options2.headOnly ? "t\xEAte agrandie" : "personnage entier"}">${original ? "" : `<g data-layer="rear">${h.back}</g>`}${bodyMarkup(m.body)}${headGroup2(input, options2)}${options2.headOnly ? "" : `<g data-layer="lengths">${h.lengths}</g>`}</svg>`;
  }

  // preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/render.mjs
  var details = /* @__PURE__ */ new Set(["braids", "waist_waves"]);
  function character2(input = {}, options2 = {}) {
    const svg2 = character(input, options2), state = normalize3(input);
    if (!options2.headOnly || options2.smallScale || !details.has(state.style)) return svg2;
    return svg2.replace(/viewBox="[^"]*"/, 'viewBox="0 0 160 205"').replace("</svg>", `<g data-layer="lengths">${layers(input).lengths}</g></svg>`);
  }

  // preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/hair.mjs
  function coveragePolicy(m) {
    const n2 = m.reference.number, a = m.state.arrangement;
    return { mode: n2 === 20 && a === "G" || n2 === 25 && a === "G" ? "top" : n2 === 25 && a === "D" ? "right-shaved" : "full", cutY: m.anchors.templeRight[1] - 5 };
  }
  function hairLayers3(m, instance = "drawing") {
    const f = m.fit, c = m.cut, { cx: x, cy: y, rx: r, ry: h, top: t, forehead: fy, temple: tw, side: s, end, frontWidth: fw } = f;
    const n2 = m.reference.number, a = m.state.arrangement, old = layers(m.baseState);
    if (n2 === 24 && a === "D") {
      const tie = old.back.match(/<path[^>]*\/>$/)[0];
      return { ...old, back: old.back.slice(0, -tie.length), accessories: "", backAccessories: m.state.accessories ? tie : "", defs: "", policy: coveragePolicy(m) };
    }
    const draw2 = (d) => `<path d="${d}" fill="${c.color}" stroke="${c.contour}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
    const line = (d, w = 1.2) => `<path d="${d}" fill="none" stroke="${c.contour}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const filledCap = coverageCap(m).match(/^<path[^>]*\/>/)[0];
    const policy = coveragePolicy(m), brow = m.base.anchors.browLeft[1], low = Math.min(fy + 9, brow - 4);
    let back = "", volume = coverageCap(m), front = "", sides = "", texture2 = "", lengths = "", accessories = "", backAccessories = "", defs = "";
    if (policy.mode !== "full") {
      const id = "hair-" + instance.replace(/[^a-zA-Z0-9_-]/g, "-"), cut = policy.cutY;
      const d = policy.mode === "top" ? `M-50,-100 H210 V${cut} H-50Z` : `M-50,-100 H210 V${cut} H${x + tw * 0.72} V270 H-50Z`;
      defs = `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs>`;
      volume = `<g clip-path="url(#${id})">${volume}</g>`;
    }
    function shaved(signs, fade = true) {
      if (!fade) return;
      for (const sign of signs) for (const u of [0.23, 0.53, 0.82]) {
        const yy = policy.cutY + (y - h * 0.12 - policy.cutY) * u, edge = halfWidthAt(m, yy);
        texture2 += line(`M${x + sign * (edge - 5)},${yy} l${sign * 3.8},-1`, 0.9);
      }
    }
    function swept(extra = 0) {
      const tip = Math.min(low + extra, brow - 3.5);
      front += draw2(`M${x + r * 0.58},${t + 5} C${x + r * 0.13},${t - 9} ${x - r * 0.55},${t - 4} ${x - r * 0.94},${fy - 8} Q${x - r * 1.12},${fy - 2} ${x - r * 1.19},${fy - 5} Q${x - r * 1.03},${tip + 1} ${x - r * 0.59},${tip - 3} C${x - r * 0.2},${tip - 7} ${x - fw * 0.09},${fy - 18} ${x + fw * 0.24},${fy - 12} Q${x + tw * 0.95},${fy - 7} ${x + tw * 0.99},${y - h * 0.03} Q${x + r * 1.05},${t + 18} ${x + r * 0.58},${t + 5}Z`);
      texture2 += line(`M${x + r * 0.53},${t + 8} C${x + r * 0.07},${t - 3} ${x - r * 0.48},${t + 4} ${x - r * 0.77},${fy - 4} M${x + r * 0.51},${t + 9} Q${x + r * 0.1},${fy - 12} ${x - r * 0.54},${tip - 6}`);
    }
    function bob(blunt = false) {
      back = old.back;
      swept(blunt ? 0 : 2);
      for (const sign of [-1, 1]) {
        const edge = x + sign * (s + (sign < 0 ? 5 : 2)), inner = x + sign * (f.cheek + 1.5), yy = end + (blunt ? 5 : 3), lower = x + sign * (f.lower + (blunt ? 5 : 0));
        sides += draw2(`M${x + sign * tw},${fy - 2} Q${edge},${fy - 4} ${edge},${y + h * 0.38} ${blunt ? `L${edge},${yy} L${lower},${yy - 1}` : `Q${edge + sign * 5},${yy + 3} ${lower},${yy}`} Q${x + sign * f.lower * 0.83},${yy - 3} ${inner},${y + h * 0.34} Q${x + sign * r * 0.87},${y} ${x + sign * tw},${fy - 2}Z`);
        texture2 += line(`M${edge - sign * 5},${fy + 10} Q${edge - sign * 1},${y + h * 0.65} ${lower},${yy - 5}`);
      }
    }
    function spikes(kind) {
      const crop = kind === "crop", messy = kind === "messy", fringed = kind === "fringe";
      const outline3 = messy ? [[-1.02, 20], [-1.27, 7], [-0.91, 8], [-1.15, -5], [-0.66, -1], [-0.82, -17], [-0.38, -8], [-0.16, -23], [0.22, -9], [0.55, -18], [0.67, -3], [1.08, -8], [0.98, 8], [1.21, 10], [1, 22]] : crop ? [[-1.02, 20], [-1.12, 8], [-0.78, 10], [-0.94, -4], [-0.52, 1], [-0.57, -12], [-0.1, -4], [-0.18, -16], [0.36, -5], [0.48, -11], [0.77, 2], [1.04, 10], [1.02, 22]] : fringed ? [[-1.03, 24], [-1.12, 9], [-0.75, 5], [-0.92, -3], [-0.43, 0], [-0.18, -9], [0.3, -4], [0.62, -6], [0.94, 8], [1.09, 24]] : [[-1.02, 24], [-1.09, 8], [-0.75, 10], [-0.9, -3], [-0.38, 1], [-0.49, -10], [0.05, -3], [0.27, -9], [0.71, 0], [1.01, 10], [1.05, 24]];
      let d = "M" + outline3.map(([u, v]) => [x + (r + 2) * u, t + v]).join(" L");
      const fringe = crop ? [[0.94, 1], [0.4, 0], [-0.3, 1], [-0.95, 0]] : fringed ? [[0.98, -1], [0.8, 9], [0.57, 2], [0.32, 15], [0.2, 5], [-0.04, 13], [-0.2, 5], [-0.43, 17], [-0.58, 5], [-0.86, 10], [-1, -1]] : messy ? [[1, -2], [0.78, 8], [0.52, 0], [0.3, 10], [0.12, 1], [-0.18, 8], [-0.35, 0], [-0.61, 10], [-0.8, 1], [-1, 4]] : [[1, -1], [0.8, 3], [0.51, 13], [0.36, 2], [0.07, 10], [-0.1, 1], [-0.44, 15], [-0.57, 4], [-0.9, 9], [-1, 0]];
      for (const [u, v] of fringe) d += ` L${x + fw * 0.88 * u},${Math.min(fy + v, brow - 3.5)}`;
      front += draw2(d + "Z");
      for (const u of [-0.48, 0.05, 0.53]) texture2 += line(`M${x + r * u},${t + 9} q7,-5 12,-3`);
    }
    function ribbon3(sign, to, { amp = 8, lobes = 3, width = 11, curl = false } = {}) {
      const root = x + sign * (tw + 1), edge = x + sign * (s + 8), inner = x + sign * (f.cheek + (curl ? -2 : 2)), start = y + h * 0.35, step = (to - start) / lobes;
      let d = `M${root},${fy - 2} Q${edge + sign * 2},${fy - 5} ${edge},${start}`;
      for (let i = 0; i < lobes; i++) {
        const yy = start + i * step;
        d += ` C${edge + sign * amp},${yy + step * 0.18} ${edge + sign * amp},${yy + step * 0.32} ${edge},${yy + step * 0.5} C${edge - sign * amp},${yy + step * 0.68} ${edge - sign * amp},${yy + step * 0.82} ${edge},${yy + step}`;
      }
      d += ` Q${edge - sign * 3},${to + 6} ${edge - sign * width},${to - 1} C${inner - sign * 6},${end + 16} ${inner + sign * 2},${end - 2} ${inner},${y + h * 0.36} Q${x + sign * r * 0.9},${y} ${root},${fy - 2}Z`;
      let detail = "";
      for (let i = 0; i < lobes; i++) {
        const yy = start + (to - start) * i / lobes;
        detail += line(curl ? `M${edge - sign * 5},${yy + 2} c${sign * 7},-5 ${sign * 10},7 ${sign * 2},9 q${-sign * 6},1 ${-sign * 4},-4` : `M${edge - sign * 3},${yy + 3} q${sign * (amp + 4)},9 ${sign * 2},${step * 0.68}`);
      }
      lengths += `<g data-route="front-${sign < 0 ? "left" : "right"}">${draw2(d)}${detail}</g>`;
    }
    function halo(long = false) {
      const points = [];
      const count = long ? 22 : 26;
      for (let i = 0; i < count; i++) {
        const angle2 = 2 * Math.PI * i / count, bump = i % 2 ? 0 : 4;
        points.push([x + Math.cos(angle2) * (s + 6 + bump), y - 5 + Math.sin(angle2) * (h + 8 + bump)]);
      }
      back = draw2(contourPath(points));
      volume = filledCap;
      for (let i = 0; i < (long ? 7 : 9); i++) {
        const angle2 = Math.PI + i / (long ? 6 : 8) * Math.PI, lx = x + Math.cos(angle2) * (s + 3), ly = y - 5 + Math.sin(angle2) * (h + 4);
        texture2 += line(long ? `M${lx - 3},${ly + 2} q7,-9 12,-1` : `M${lx - 2},${ly + 2} c-5,-9 11,-12 10,-2 c-1,8 -13,8 -9,1`, 1.4);
      }
      if (long) {
        for (const sign of [-1, 1]) {
          front += draw2(`M${x},${t + 10} C${x + sign * fw * 0.5},${t - 1} ${x + sign * (s + 1)},${fy - 9} ${x + sign * tw},${fy + 3} Q${x + sign * fw * 0.55},${Math.min(fy + 7, brow - 4)} ${x + sign * fw * 0.33},${fy - 6} Q${x + sign * fw * 0.12},${fy - 13} ${x},${t + 10}Z`);
          texture2 += line(`M${x + sign * fw * 0.16},${t + 12} Q${x + sign * fw * 0.5},${fy - 8} ${x + sign * fw * 0.65},${fy - 1}`);
        }
      } else for (const u of [-0.5, 0.12, 0.68]) {
        const xx = x + fw * u, yy = fy - 8;
        front += draw2(`M${xx - 7},${yy} C${xx - 8},${yy - 10} ${xx + 11},${yy - 11} ${xx + 10},${yy} Q${xx + 9},${Math.min(yy + 9, brow - 4)} ${xx - 5},${yy + 5}Z`);
        texture2 += line(`M${xx - 1},${yy - 2} c7,-4 9,5 2,6 q-5,0 -3,-4`, 1.3);
      }
    }
    if ((n2 === 19 || n2 === 21) && a === "G") {
      back = old.back;
      swept();
    } else if ((n2 === 19 || n2 === 21) && a === "D") bob(n2 === 21);
    else if (n2 === 20 && a === "G") {
      spikes("crop");
      shaved([-1, 1]);
    } else if (n2 === 20 && a === "D") {
      back = old.back;
      spikes("swept");
    } else if (n2 === 22 && a === "G") {
      back = old.back;
      swept();
      for (const sign of [-1, 1]) {
        const xx = x + sign * (s - 1), yy = fy + 1;
        sides += draw2(`M${x + sign * tw},${yy - 5} C${xx + sign * 8},${yy + 3} ${xx - sign * 6},${yy + 19} ${xx + sign * 6},${yy + 21} Q${xx - sign * 2},${yy + 29} ${xx - sign * 7},${yy + 18} Q${xx - sign * 12},${yy + 8} ${x + sign * tw},${yy - 5}Z`);
        texture2 += line(`M${xx},${yy + 1} q${-sign * 6},12 ${sign * 1},18`);
      }
    } else if (n2 === 22 && a === "D") {
      back = old.back;
      swept();
      for (const sign of [-1, 1]) ribbon3(sign, end + 53, { amp: 8, lobes: 3 });
    } else if (n2 === 23 && a === "G") {
      back = old.back;
      spikes("messy");
    } else if (n2 === 23 && a === "D") {
      back = draw2(`M${x - 6},${t + 5} C${x - 28},${t - 4} ${x - 15},${t - 25} ${x - 3},${t - 20} C${x + 7},${t - 34} ${x + 20},${t - 17} ${x + 17},${t - 10} Q${x + 34},${t + 1} ${x + 13},${t + 9}Z`);
      texture2 += line(`M${x - 6},${t - 15} q-7,12 5,17 M${x + 5},${t - 21} q-4,13 5,19`);
      swept();
      for (const sign of [-1, 1]) {
        const xx = x + sign * (s - 2);
        sides += draw2(`M${x + sign * tw},${fy - 1} C${xx + sign * 9},${y} ${xx - sign * 8},${end - 10} ${xx},${end + 3} Q${xx + sign * 8},${end + 17} ${xx - sign * 3},${end + 22} Q${xx + sign * 4},${end + 9} ${xx - sign * 5},${end} C${xx - sign * 13},${end - 11} ${xx + sign * 3},${y + h * 0.2} ${x + sign * tw},${fy - 1}Z`);
      }
      if (m.state.accessories) accessories = line(`M${x - 5},${t + 2} q11,4 21,1`, 2.6);
    } else if (n2 === 24 && a === "G") {
      const ax = x + f.lower * 0.5, ay = end - 8;
      back = draw2(`M${ax},${ay} C${x + s + 28},${ay - 5} ${x + s + 31},${end + 21} ${x + s + 10},${end + 59} L${x + s + 1},${end + 49} L${x + s - 3},${end + 59} C${x + s + 9},${end + 20} ${ax - 9},${ay + 14} ${ax},${ay}Z`);
      back += line(`M${ax + 5},${ay + 3} Q${x + s + 28},${end + 22} ${x + s + 9},${end + 47}`);
      for (const u of [-0.7, -0.35, 0.35, 0.7]) texture2 += line(`M${x + fw * u},${fy - 5} Q${x + fw * u * 0.8},${t + 7} ${x},${t + 4}`);
      if (m.state.accessories) backAccessories = line(`M${ax - 4},${ay + 1} l8,3`, 2.6);
    } else if (n2 === 25 && a === "G") {
      front = draw2(`M${x - r * 0.95},${fy - 3} Q${x - r * 1.15},${t + 12} ${x - r * 0.6},${t + 7} L${x - r * 0.95},${t - 5} Q${x - r * 0.48},${t - 2} ${x - r * 0.4},${t - 8} L${x - r * 0.45},${t - 17} Q${x + r * 0.1},${t - 12} ${x + r * 0.24},${t - 1} Q${x + r * 0.8},${t - 13} ${x + r * 0.75},${t + 7} Q${x + r * 1.09},${fy - 9} ${x + r * 0.88},${fy - 2} Q${x},${fy - 7} ${x - r * 0.95},${fy - 3}Z`);
      texture2 += line(`M${x - r * 0.6},${fy - 7} Q${x - r * 0.25},${t + 2} ${x + r * 0.1},${t + 5} M${x - r * 0.42},${fy - 8} Q${x + r * 0.2},${t + 6} ${x + r * 0.55},${t + 11}`);
    } else if (n2 === 25 && a === "D") {
      swept();
      shaved([1]);
      const edge = x - s - 8, inner = x - f.cheek - 2;
      sides += draw2(`M${x + r * 0.58},${t + 8} C${x - r * 0.38},${t + 4} ${edge},${fy + 7} ${edge},${y + h * 0.45} Q${edge - 5},${end + 5} ${x - f.lower * 0.64},${end + 24} Q${x - f.lower * 0.85},${end + 5} ${inner},${y + h * 0.45} Q${x - r * 0.97},${y - h * 0.2} ${x + r * 0.58},${t + 8}Z`);
      texture2 += line(`M${x + r * 0.4},${t + 11} Q${edge - 1},${fy + 13} ${edge + 4},${end + 6}`);
    } else if (n2 === 26 && a === "G") {
      back = old.back;
      spikes("fringe");
    } else if (n2 === 26 && a === "D") {
      back = old.back;
      front = old.front;
      for (let i = -2; i <= 2; i++) texture2 += line(`M${x + i * tw * 0.94 / 3},${fy - 4} l1,${Math.min(brow - 4, fy + 10) - fy + 1}`);
      for (const sign of [-1, 1]) ribbon3(sign, end + 55, { amp: 4, lobes: 3, width: 11 });
    } else if (n2 === 27) {
      halo(a === "D");
      if (a === "D") for (const sign of [-1, 1]) ribbon3(sign, end + 64, { amp: 10, lobes: 4, width: 16, curl: true });
    }
    if (policy.mode !== "full") front = `<g clip-path="url(#hair-${instance.replace(/[^a-zA-Z0-9_-]/g, "-")})">${front}</g>`;
    return { back, volume, front, sides, texture: texture2, lengths, accessories, backAccessories, defs, policy };
  }

  // preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/render.mjs
  function headGroup3(input = {}, options2 = {}) {
    const m = model3(input);
    if (!m.reference) return headGroup2(m.baseState, options2);
    const h = hairLayers3(m, options2.instance || "head"), face = headMarkup(m.base).replace(/<path d="[^"]*"/, `<path d="${m.outline}"`);
    return `<g class="lot-head" data-reference="${m.state.style}" data-arrangement="${m.state.arrangement}">${["face", "volume", "front", "sides", "texture"].map((k) => `<g data-layer="${k}">${k === "face" ? face : h[k]}</g>`).join("")}${options2.construction ? construction(m) : ""}</g>`;
  }
  function character3(input = {}, options2 = {}) {
    const state = normalize4(input);
    if (!references[state.style]) return character2(state, options2);
    const m = model3(state), long = m.reference.longArrangements.includes(state.arrangement), h = hairLayers3(m, options2.instance || (options2.smallScale ? "mini" : options2.headOnly ? "head" : "whole") + "-" + state.style + "-" + state.arrangement);
    const frame = options2.headOnly ? long ? "-10 -32 180 225" : "0 -26 160 160" : "-26 -43 212 310";
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${frame}" role="img" aria-label="${m.reference.number} \xB7 ${m.reference.name} \xB7 arrangement ${state.arrangement}">${h.defs}<g data-layer="rear">${h.back}</g><g data-layer="accessories-back">${h.backAccessories}</g>${bodyMarkup(m.body)}${headGroup3(state, { ...options2, instance: options2.instance || (options2.smallScale ? "mini" : options2.headOnly ? "head" : "whole") + "-" + state.style + "-" + state.arrangement })}<g data-layer="lengths">${h.lengths}</g><g data-layer="accessories">${h.accessories}</g></svg>`;
  }

  // preview/bio-vis-p5-i6/i5/i4/i3/i2/hair.mjs
  function hairLayers4(m, instance = "drawing") {
    if (!lotB[m.state.style]) return hairLayers3(m, instance);
    const f = m.fit, c = m.cut, { cx: x, cy: y, rx: r, ry: h, top: t, forehead: fy, temple: tw, side: s, end, frontWidth: fw } = f;
    const n2 = m.reference.number, a = m.state.arrangement, brow = m.base.anchors.browLeft[1];
    const draw2 = (d) => `<path d="${d}" fill="${c.color}" stroke="${c.contour}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
    const line = (d, w = 1.2) => `<path d="${d}" fill="none" stroke="${c.contour}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const feature = (name, markup) => `<g data-feature="${name}">${markup}</g>`;
    let back = "", volume = coverageCap(m).match(/^<path[^>]*\/>/)[0], front = "", sides = "", texture2 = "", lengths = "", accessories = "", backAccessories = "";
    const ornament = (d) => `<path d="${d}" fill="#d8bc7a" stroke="#91723c" stroke-width="1.5" stroke-linejoin="round"/>`;
    const pearl = (px, py, rr = 2.5) => `<circle cx="${px}" cy="${py}" r="${rr}" fill="#f4e5be" stroke="#91723c" stroke-width="1.1"/>`;
    function centrePart() {
      for (const sign of [-1, 1]) front += draw2(`M${x},${t + 7} C${x + sign * r * 0.5},${t - 2} ${x + sign * (s + 4)},${fy - 8} ${x + sign * (tw + 3)},${y - h * 0.07} Q${x + sign * (tw - 2)},${fy + 6} ${x + sign * fw * 0.76},${Math.min(fy + 1, brow - 5)} Q${x + sign * fw * 0.33},${fy - 10} ${x},${t + 7}Z`);
    }
    function swept() {
      const p = { ...m, reference: { number: 19 }, state: { ...m.state, arrangement: "G" } };
      const old = hairLayers3(p);
      front += old.front;
      texture2 += old.texture;
    }
    function fan(high = false) {
      const rootY = fy - 9, rootX = x + 4;
      const d = high ? `M${x - r - 3},${fy + 1} Q${x - r - 14},${fy - 8} ${x - r - 5},${t + 2} Q${x - r - 10},${t - 10} ${x - r - 5},${t - 27} C${x - r + 1},${t - 15} ${x - 4},${t - 24} ${x + 8},${t - 18} Q${x + r * 0.8},${t - 15} ${x + r * 0.8},${t - 4} Q${x + r + 8},${t - 4} ${x + r + 5},${t + 12} Q${x + r + 8},${fy - 3} ${x + tw},${fy + 1} Q${x},${fy - 7} ${x - r - 3},${fy + 1}Z` : `M${x - r - 4},${fy + 1} Q${x - r - 12},${fy - 4} ${x - r - 7},${t + 6} Q${x - r - 4},${t - 7} ${x - r * 0.4},${t - 8} Q${x - r * 0.2},${t - 19} ${x + 8},${t - 15} Q${x + r * 0.9},${t - 15} ${x + r * 0.87},${t + 1} Q${x + r + 13},${t + 4} ${x + r + 9},${fy - 5} Q${x + r + 4},${fy + 5} ${x + tw},${fy} Q${x},${fy - 6} ${x - r - 4},${fy + 1}Z`;
      front += feature(high ? "high-quiff" : "architectural-fan", draw2(d));
      const tops = high ? [[-0.85, -19], [-0.32, -19], [0.25, -17], [0.8, -3]] : [[-0.9, 1], [-0.42, -6], [0.13, -13], [0.75, -2]];
      for (const [u, v] of tops) texture2 += line(`M${rootX},${rootY} C${x + r * u * 0.7},${fy - 20} ${x + r * u + 9},${t + v} ${x + r * u},${t + v}`);
    }
    function bun(px = x, py = t - 12, rx = 22, ry = 15, tiers = 1) {
      let out = draw2(`M${px - rx * 0.52},${py + ry - 6} Q${x},${t - 3} ${x - r * 0.5},${t + 14} L${x + r * 0.5},${t + 14} Q${x + rx * 0.4},${t - 3} ${px + rx * 0.52},${py + ry - 6}Z`);
      for (let tier = 0; tier < tiers; tier++) {
        const yy = py - tier * 13, ww = rx * (1 - tier * 0.18), hh = ry * (1 - tier * 0.12);
        const points = Array.from({ length: 48 }, (_, i) => {
          const z = Math.PI * 2 * i / 48, bump = 1.8 * Math.cos(z * 5);
          return [px + Math.cos(z) * (ww + bump), yy + Math.sin(z) * (hh + bump)];
        });
        out += draw2(contourPath(points));
        for (const u of [-0.55, 0, 0.55]) out += line(`M${px + ww * u},${yy - hh + 2} C${px + ww * (u - 0.38)},${yy - 2} ${px + ww * (u + 0.45)},${yy + 4} ${px},${yy + hh - 1}`);
      }
      return feature(tiers > 1 ? "stacked-rolls" : "rolled-bun", out);
    }
    function sideRolls(large = false) {
      for (const sign of [-1, 1]) {
        const xx = x + sign * (s - 1), yy = fy - 2, w = large ? 12 : 9;
        sides += feature("side-roll", draw2(`M${x + sign * tw},${yy - 8} C${xx + sign * w},${yy - 11} ${xx + sign * (w + 7)},${yy + 9} ${xx + sign * 5},${yy + 13} C${xx - sign * 7},${yy + 18} ${xx - sign * 10},${yy + 5} ${xx - sign * 1},${yy + 3} Q${xx + sign * 7},${yy + 7} ${xx + sign * 4},${yy - 1} Q${xx},${yy - 5} ${x + sign * tw},${yy - 8}Z`));
      }
    }
    function braid(points, width) {
      const normal = points.map((p, i) => {
        const aa = points[Math.max(0, i - 1)], bb = points[Math.min(points.length - 1, i + 1)], dx = bb[0] - aa[0], dy = bb[1] - aa[1], l = Math.hypot(dx, dy);
        return [-dy / l, dx / l];
      });
      let out = "";
      for (let i = 0; i < points.length - 1; i++) {
        const p = points[i], q2 = points[i + 1], dx = q2[0] - p[0], dy = q2[1] - p[1], sw = i % 2 ? 1 : -1, ww = width * (1 - 0.22 * i / (points.length - 1));
        const at = (u, v) => [p[0] + dx * u + normal[i][0] * v, p[1] + dy * u + normal[i][1] * v];
        out += draw2(`M${at(-0.2, 0)} C${at(-0.5, sw * ww * 1.1)} ${at(0.45, sw * ww * 1.15)} ${at(1.1, 0)} C${at(0.45, -sw * ww * 1.15)} ${at(-0.5, -sw * ww * 1.1)} ${at(-0.2, 0)}Z`);
        out += line(`M${at(0, -sw * ww * 0.65)} Q${at(0.2, 0)} ${at(0.7, sw * ww * 0.6)}`, 1.1);
      }
      return `<g data-feature="braid" data-root="${points[0]}" data-end="${points.at(-1)}">${out}</g>`;
    }
    function crown(low = false) {
      const yy = y - h * 0.2, ry = yy - t + (low ? 0 : 8), rr = r + (low ? 3 : 5);
      const pts = Array.from({ length: 17 }, (_, i) => {
        const angle2 = Math.PI + i * Math.PI / 16;
        return [x + Math.cos(angle2) * rr, yy + Math.sin(angle2) * ry];
      });
      front += feature("braided-crown", braid(pts, low ? 4.5 : 5.4));
    }
    function hangingBraid(sign, { thin = false, loose = false } = {}) {
      const from = fy + 6, to = end + (thin ? 64 : 61), root = [x + sign * (tw + 3), from], w = thin ? 4 : 6;
      const pts = Array.from({ length: 11 }, (_, i) => {
        const u = i / 10;
        return [root[0] + sign * (s - tw + 2) * Math.sin(Math.PI * Math.min(1, u * 2) / 2) + sign * (loose ? 3 : 0) * Math.sin(u * Math.PI), from + (to - from) * u];
      });
      const [ax, ay] = root;
      sides += feature("braid-root", draw2(`M${ax - sign * 6},${ay - 16} C${ax + sign * 6},${ay - 20} ${ax + sign * 8},${ay - 7} ${ax + sign * w * 0.8},${ay + 5} L${ax - sign * w * 0.8},${ay + 5} Q${ax - sign * 4},${ay - 5} ${ax - sign * 6},${ay - 16}Z`));
      lengths += braid(pts, w);
      const tip = pts.at(-1);
      lengths += draw2(`M${tip[0] - w * 0.65},${tip[1] - 1} Q${tip[0]},${tip[1] + 12} ${tip[0] + w * 0.65},${tip[1] - 1}Z`);
      if (m.state.accessories) accessories += ornament(`M${tip[0] - w * 0.7},${tip[1] - 1} h${w * 1.4} v3 h${-w * 1.4}Z`);
    }
    function tendril(sign, to = end + 27, slender = true) {
      const root = x + sign * (tw + 4), edge = x + sign * (s + 3), start = fy + 3;
      const pts = Array.from({ length: 37 }, (_, i) => {
        const u = i / 36;
        return [root + (edge - root) * Math.min(1, u * 4) + sign * 4 * Math.sin(u * Math.PI * 6), start + (to - start) * u];
      });
      const w = slender ? 1.8 : 3;
      lengths += feature("loose-lock", draw2(contourPath([...pts.map(([px, py], i) => [px + w * (1 - i / pts.length * 0.65), py]), ...pts.slice().reverse().map(([px, py], i) => [px - w * (0.35 + i / pts.length * 0.65), py])])));
    }
    function curls(sign, to, turns = 4, wide = 10) {
      const root = x + sign * (tw + 3), edge = x + sign * (s + 6), start = fy + 4, step = (to - start) / turns;
      let d = `M${root},${start} Q${edge + sign * 8},${start - 5} ${edge},${start + step * 0.25}`;
      for (let i = 0; i < turns; i++) {
        const yy = start + i * step;
        d += ` C${edge + sign * (wide + 2)},${yy + step * 0.25} ${edge + sign * (wide + 2)},${yy + step * 0.75} ${edge},${yy + step} C${edge - sign * 7},${yy + step + 2} ${edge - sign * 9},${yy + step * 0.75} ${edge - sign * 5},${yy + step * 0.65}`;
      }
      d += ` Q${edge - sign * wide},${to + 9} ${edge - sign * (wide + 4)},${to - 3} C${x + sign * (f.cheek + 3)},${end + 7} ${x + sign * (f.cheek + 4)},${y + h * 0.2} ${root},${start}Z`;
      let out = draw2(d);
      for (let i = 0; i < turns; i++) {
        const yy = start + (i + 0.48) * step;
        out += line(`M${edge - sign * 4},${yy} C${edge + sign * 10},${yy - 8} ${edge + sign * 12},${yy + 11} ${edge},${yy + 9} Q${edge - sign * 8},${yy + 7} ${edge - sign * 2},${yy + 3}`, 1.25);
      }
      lengths += feature("open-curls", out);
    }
    function pearls(yy, span2 = 20, count = 7) {
      if (!m.state.accessories) return;
      for (let i = 0; i < count; i++) {
        const u = (i / (count - 1) - 0.5) * 2;
        accessories += pearl(x + u * span2, yy + 5 * u * u);
      }
    }
    function flower(px, py) {
      if (!m.state.accessories) return;
      for (let i = 0; i < 5; i++) {
        const z = Math.PI * 2 * i / 5;
        accessories += pearl(px + Math.cos(z) * 5, py + Math.sin(z) * 5, 3.1);
      }
      accessories += pearl(px, py, 2.5);
    }
    function cascade(sign) {
      const root = x + sign * (tw + 3), edge = x + sign * (s + 5), inner = x + sign * (f.cheek + 3), to = end + 66;
      lengths += feature("side-cascade", draw2(`M${root},${fy} C${edge + sign * 18},${fy + 3} ${edge - sign * 5},${y + h * 0.4} ${edge + sign * 5},${end - 2} C${edge + sign * 20},${end + 17} ${edge - sign * 8},${end + 29} ${edge + sign * 6},${end + 44} Q${edge + sign * 16},${to} ${edge - sign * 13},${to} Q${edge + sign * 1},${end + 43} ${edge - sign * 12},${end + 33} C${inner - sign * 8},${end + 17} ${inner + sign * 6},${end - 2} ${inner},${y + h * 0.3} Q${x + sign * r * 0.9},${y - h * 0.25} ${root},${fy}Z`) + line(`M${edge - sign * 1},${fy + 9} C${edge + sign * 10},${end - 7} ${edge - sign * 15},${end + 15} ${edge},${end + 30} Q${edge + sign * 10},${end + 43} ${edge - sign * 4},${to - 6}`));
    }
    function highSweep() {
      front += feature("high-sweep", draw2(`M${x + r * 0.72},${t - 13} C${x + 7},${t - 36} ${x - r - 18},${t - 21} ${x - r - 9},${fy - 9} Q${x - r - 14},${fy + 1} ${x - r - 20},${fy - 3} Q${x - r - 16},${Math.min(fy + 12, brow - 4)} ${x - r * 0.65},${fy + 3} C${x - r * 0.12},${fy - 3} ${x - 2},${t - 7} ${x + fw * 0.32},${t + 1} Q${x + r},${t + 8} ${x + tw},${fy + 7} Q${x + r + 15},${fy - 9} ${x + r * 0.72},${t - 13}Z`));
      texture2 += line(`M${x + r * 0.5},${t - 10} C${x},${t - 23} ${x - r - 8},${t - 10} ${x - r - 4},${fy - 4} M${x + r * 0.38},${t - 4} Q${x - r * 0.5},${t - 15} ${x - r * 0.6},${fy - 1}`);
    }
    if (n2 === 28) {
      centrePart();
      crown();
      if (a === "D") for (const sign of [-1, 1]) tendril(sign, end + 31);
    } else if (n2 === 29) {
      if (a === "G") fan();
      else {
        back = bun(x, t - 18, 24, 16);
        centrePart();
        for (const sign of [-1, 1]) tendril(sign, end + 35);
        if (m.state.accessories) accessories += ornament(`M${x - 15},${t - 3} Q${x},${t - 9} ${x + 15},${t - 3} l-1,3 Q${x},${t - 5} ${x - 14},${t}Z`);
      }
    } else if (n2 === 30) {
      if (a === "D") back = bun(x + 3, t - 13, 21, 13);
      centrePart();
      sideRolls(true);
      for (const sign of [-1, 1]) curls(sign, end + (a === "D" ? 63 : 19), a === "D" ? 4 : 3, a === "D" ? 10 : 8);
      front += feature("frontal-curl", draw2(`M${x - 4},${t + 5} C${x - 19},${t - 12} ${x - r - 4},${t + 2} ${x - r - 2},${fy - 3} Q${x - r - 8},${fy + 8} ${x - r - 14},${fy - 1} Q${x - r - 11},${fy + 13} ${x - r * 0.48},${fy + 2} C${x - r * 0.1},${fy - 8} ${x - r * 0.8},${t + 2} ${x - 4},${t + 5}Z`));
      if (a === "D") pearls(t + 2, 13, 5);
    } else if (n2 === 31) {
      if (a === "D") {
        back = bun(x, t - 20, 23, 17);
        for (const sign of [-1, 1]) tendril(sign, end + 28, false);
        pearls(t - 4, 20, 7);
      } else back = bun(x, t + 1, 22, 12);
      centrePart();
      sideRolls(a === "D");
    } else if (n2 === 32 || n2 === 35) {
      const thin = n2 === 35;
      if (a === "G") {
        swept();
        hangingBraid(-1, { thin, loose: thin });
        if (thin) pearls(t + 3, 20, 7);
      } else {
        centrePart();
        crown(thin);
        for (const sign of [-1, 1]) hangingBraid(sign, { thin, loose: thin });
        if (thin && m.state.accessories) {
          accessories += ornament(`M${x},${fy - 6} l4,6 -4,6 -4,-6Z`);
          for (const sign of [-1, 1]) {
            const px = x + sign * (s + 8), yy = end + 30;
            accessories += ornament(`M${px},${yy} l4,8 -4,8 -4,-8Z`);
          }
        }
      }
    } else if (n2 === 33) {
      if (a === "G") {
        swept();
        if (m.state.accessories) {
          const px = x - s + 2, yy = end - 10;
          backAccessories = ornament(`M${px},${yy} l-10,-4 v10 l10,-3 3,4 7,-8 -1,18 -6,-6Z`);
        }
      } else {
        back = bun(x + r * 0.8, t + 2, 20, 20);
        swept();
        const px = x + s + 3;
        flower(px, fy - 10);
        if (m.state.accessories) for (let i = 0; i < 5; i++) accessories += pearl(px + 4 + i * 0.4, fy + 2 + i * 7, 2.2);
        tendril(-1, end + 15);
      }
    } else if (n2 === 34) {
      if (a === "G") fan(true);
      else {
        back = bun(x + 8, t - 13, 23, 15);
        cascade(1);
        highSweep();
        flower(x + s + 2, fy - 12);
      }
    } else if (n2 === 36) {
      if (a === "G") {
        centrePart();
        for (const sign of [-1, 1]) cascade(sign);
        if (m.state.accessories) for (const sign of [-1, 1]) {
          const px = x + sign * (r + 1), yy = fy - 5;
          accessories += ornament(`M${px},${yy} q${-sign * 12},-1 ${-sign * 8},-15 q${sign * 8},5 ${sign * 8},15 q${sign * 10},-6 ${sign * 6},-19 q${-sign * 9},10 ${-sign * 6},19Z`);
        }
      } else {
        back = bun(x, t - 12, 24, 14, 2);
        centrePart();
        sideRolls(true);
        if (m.state.accessories) accessories += ornament(`M${x - 22},${t + 4} l-3,-9 9,4 3,-13 7,8 6,-17 6,17 7,-8 3,13 9,-4 -3,9 Q${x},${t - 1} ${x - 22},${t + 4}Z`);
      }
    }
    return { back, volume, front, sides, texture: texture2, lengths, accessories, backAccessories, defs: "", policy: { mode: "full" } };
  }

  // preview/bio-vis-p5-i6/i5/i4/i3/i2/render.mjs
  function headGroup4(input = {}, options2 = {}) {
    const m = model4(input);
    if (!lotB[m.state.style]) return headGroup3(m.state, options2);
    const h = hairLayers4(m), face = headMarkup(m.base).replace(/<path d="[^"]*"/, `<path d="${m.outline}"`);
    return `<g class="lot-head" data-reference="${m.state.style}" data-arrangement="${m.state.arrangement}">${["face", "volume", "front", "sides", "texture"].map((k) => `<g data-layer="${k}">${k === "face" ? face : h[k]}</g>`).join("")}${options2.construction ? construction(m) : ""}</g>`;
  }
  function character4(input = {}, options2 = {}) {
    const state = normalize5(input);
    if (!lotB[state.style]) return character3(state, options2);
    const m = model4(state), h = hairLayers4(m), long = m.reference.longArrangements.includes(state.arrangement);
    const frame = options2.headOnly ? long ? "-26 -58 212 282" : "-26 -58 212 198" : "-26 -58 212 325";
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${frame}" role="img" aria-label="${m.reference.number} \xB7 ${m.reference.name} \xB7 arrangement ${state.arrangement}">${h.defs}<g data-layer="rear">${h.back}</g><g data-layer="accessories-back">${h.backAccessories}</g>${bodyMarkup(m.body)}${headGroup4(state, options2)}<g data-layer="lengths">${h.lengths}</g><g data-layer="accessories">${h.accessories}</g></svg>`;
  }

  // preview/bio-vis-p5-i6/i5/i4/i3/strand.mjs
  function strandFactory(draw2, line) {
    return function braid(points, width) {
      const normal = points.map((p, i) => {
        const aa = points[Math.max(0, i - 1)], bb = points[Math.min(points.length - 1, i + 1)], dx = bb[0] - aa[0], dy = bb[1] - aa[1], l = Math.hypot(dx, dy);
        return [-dy / l, dx / l];
      });
      let out = "";
      for (let i = 0; i < points.length - 1; i++) {
        const p = points[i], q2 = points[i + 1], dx = q2[0] - p[0], dy = q2[1] - p[1], sw = i % 2 ? 1 : -1, ww = width * (1 - 0.22 * i / (points.length - 1));
        const at = (u, v) => [p[0] + dx * u + normal[i][0] * v, p[1] + dy * u + normal[i][1] * v];
        out += draw2(`M${at(-0.2, 0)} C${at(-0.5, sw * ww * 1.1)} ${at(0.45, sw * ww * 1.15)} ${at(1.1, 0)} C${at(0.45, -sw * ww * 1.15)} ${at(-0.5, -sw * ww * 1.1)} ${at(-0.2, 0)}Z`);
        out += line(`M${at(0, -sw * ww * 0.65)} Q${at(0.2, 0)} ${at(0.7, sw * ww * 0.6)}`, 1.1);
      }
      return `<g data-feature="braid" data-root="${points[0]}" data-end="${points.at(-1)}">${out}</g>`;
    };
  }

  // preview/bio-vis-p5-i6/i5/i4/i3/hair.mjs
  function coveragePolicy2(m) {
    const n2 = m.reference.number, a = m.state.arrangement;
    return { mode: n2 === 41 && a === "G" ? "top" : n2 === 44 && a === "D" ? "right-shaved" : "full", cutY: m.anchors.templeRight[1] - 5 };
  }
  function hairLayers5(m, instance = "drawing") {
    if (!lotC[m.state.style]) return hairLayers4(m, instance);
    const f = m.fit, c = m.cut, { cx: x, cy: y, rx: r, ry: h, top: t, forehead: fy, temple: tw, side: s, end, frontWidth: fw } = f;
    const n2 = m.reference.number, a = m.state.arrangement, brow = m.base.anchors.browLeft[1];
    const draw2 = (d) => `<path d="${d}" fill="${c.color}" stroke="${c.contour}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
    const line = (d, w = 1.2) => `<path d="${d}" fill="none" stroke="${c.contour}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const feature = (name, markup) => `<g data-feature="${name}">${markup}</g>`;
    const braid = strandFactory(draw2, line), policy = coveragePolicy2(m);
    let back = "", volume = coverageCap(m).match(/^<path[^>]*\/>/)[0], front = "", sides = "", texture2 = "", lengths = "", accessories = "", backAccessories = "", defs = "";
    const ornament = (d) => `<path d="${d}" fill="#d8bc7a" stroke="#91723c" stroke-width="1.5" stroke-linejoin="round"/>`;
    const seed = (number, arrangement) => hairLayers4({ ...m, reference: { number }, state: { ...m.state, style: "p5-" + String(number).padStart(3, "0"), arrangement } });
    const seedA = (number, arrangement) => hairLayers3({ ...m, reference: { number }, state: { ...m.state, style: "p5-" + String(number).padStart(3, "0"), arrangement } });
    function parted() {
      front += seed(28, "G").front.split('<g data-feature="braided-crown">')[0];
    }
    function swept() {
      const q2 = seedA(19, "G");
      front += q2.front;
      texture2 += q2.texture;
    }
    function rough(kind) {
      const tops = {
        work: [[-1.04, 24], [-1.22, 14], [-0.94, 12], [-1.1, 1], [-0.72, 5], [-0.83, -10], [-0.35, -4], [-0.47, -17], [0.07, -9], [0.37, -15], [0.52, -1], [0.72, -9], [0.8, 5], [1.06, 5], [1, 16], [1.18, 23]],
        battle: [[-1.02, 25], [-1.34, 16], [-1.07, 9], [-1.25, -3], [-0.78, 2], [-0.95, -15], [-0.45, -7], [-0.64, -24], [-0.08, -14], [0.25, -20], [0.45, -4], [0.78, -12], [0.83, 1], [1.23, -5], [1.1, 11], [1.34, 20], [1.01, 23]],
        fringe: [[-1.01, 27], [-1.17, 19], [-1.02, 11], [-1.18, 5], [-0.82, 7], [-0.9, -7], [-0.35, -5], [-0.53, -13], [0.04, -6], [0.4, -9], [0.6, 0], [0.95, -2], [0.85, 8], [1.15, 19], [1.01, 28]],
        shag: [[-1.02, 28], [-1.25, 19], [-1.08, 11], [-1.25, 5], [-0.87, 7], [-1.05, -3], [-0.51, 1], [-0.7, -14], [-0.21, -8], [0.1, -17], [0.41, -6], [0.77, -8], [0.79, 3], [1.09, 6], [1, 17], [1.26, 24]],
        oblique: [[-1.03, 25], [-1.18, 16], [-0.97, 11], [-1.12, 2], [-0.74, 4], [-0.94, -6], [-0.4, -4], [-0.56, -14], [-0.06, -8], [0.31, -10], [0.65, -2], [0.9, 2], [1.11, 17], [1.02, 26]]
      };
      const base = kind === "rustic" ? "fringe" : kind, top = tops[base];
      let d = `M${x + (r + 1) * top[0][0]},${t + top[0][1]}`;
      for (let i = 1; i < top.length; i++) {
        const [u, v] = top[i], prev = top[i - 1];
        d += ` Q${x + (r + 1) * (i % 2 ? prev[0] * 0.7 + u * 0.3 : prev[0] * 0.2 + u * 0.8)},${t + (prev[1] + v) * 0.5 + 5} ${x + (r + 1) * u},${t + v}`;
      }
      const fringes = kind === "rustic" ? [[1, 1], [0.84, 4], [0.71, 0], [0.48, 5], [0.32, 0], [0.06, 5], [-0.12, 0], [-0.41, 5], [-0.49, 0], [-0.77, 5], [-0.83, 0], [-1, 3]] : kind === "oblique" ? [[1, 0], [0.75, 5], [0.57, 1], [0.33, 8], [0.12, 3], [-0.16, 13], [-0.22, 3], [-0.57, 15], [-0.55, 1], [-0.89, 10], [-1, 2]] : kind === "work" ? [[1, 1], [0.78, -3], [0.57, -5], [0.42, 4], [0.25, 1], [0.07, 10], [-0.04, 1], [-0.37, 10], [-0.33, 0], [-0.67, 8], [-0.8, 2], [-1, 7]] : [[1, 2], [0.79, 8], [0.64, 1], [0.42, 10], [0.3, 0], [0.09, 13], [-0.1, 4], [-0.31, 12], [-0.42, 3], [-0.73, 13], [-0.7, 1], [-1, 7]];
      for (const [u, v] of fringes) d += ` L${x + fw * 0.9 * u},${Math.min(fy + v, brow - 4.5)}`;
      front += feature("irregular-fringe", draw2(d + "Z"));
      for (const [u, v] of [[-0.64, 5], [-0.15, -1], [0.53, 6]]) texture2 += line(`M${x + r * u},${t + v + 9} q7,-4 12,0`);
    }
    function forelock() {
      const low = Math.min(fy + 10, brow - 4.5);
      front += feature("swept-lock", draw2(`M${x + r * 0.38},${t + 6} C${x - r * 0.13},${t - 4} ${x - r * 0.88},${t + 7} ${x - fw * 0.83},${fy - 1} Q${x - fw * 0.93},${low - 3} ${x - fw * 1.06},${low} Q${x - fw * 0.68},${low + 1} ${x - fw * 0.48},${fy} C${x - fw * 0.14},${fy - 11} ${x - fw * 0.15},${t + 9} ${x + r * 0.38},${t + 6}Z`));
    }
    function shag(sign, len = 15) {
      const edge = x + sign * (s + 5), inner = x + sign * (s - 5), root = x + sign * (tw + 1), yy = end + len + (sign < 0 ? 0 : 5);
      sides += feature("layered-lock", draw2(`M${root},${fy - 6} Q${edge + sign * 6},${fy - 7} ${edge + sign * 3},${y + 2} L${edge + sign * 9},${y - 3} Q${edge + sign * 4},${y + 11} ${edge + sign * 11},${y + 18} L${edge + sign * 3},${y + 15} Q${edge + sign * 6},${end - 9} ${edge + sign * 12},${yy - 7} L${edge + sign * 3},${yy - 10} Q${edge + sign * 4},${yy + 2} ${inner},${yy} L${inner + sign * 3},${yy - 10} Q${inner - sign * 1},${end - 5} ${inner},${y + h * 0.32} Q${x + sign * r * 0.88},${y - h * 0.18} ${root},${fy - 6}Z`));
      texture2 += line(`M${edge - sign * 2},${y + 3} Q${edge - sign * 5},${end - 3} ${edge + sign * 4},${yy - 7}`);
    }
    function wave(sign, to, { phase = 0, amp = 6, width = 13, offset = 0 } = {}) {
      const start = fy - 3, pts = [], N = 36;
      for (let i = 0; i <= N; i++) {
        const u = i / N, z = Math.min(1, u * 3), mix5 = z * z * (3 - 2 * z), yy = start + (to - start) * u;
        let v = tw + 3 + (s + 9 + offset - tw - 3) * mix5 + amp * Math.sin(u * Math.PI * 5 + phase) * mix5;
        const w = width * (0.4 + 0.6 * Math.sin(Math.PI * u) ** 0.4);
        const clearance2 = s + w / 2 + 1.5 - (s - tw) * Math.max(0, 1 - u * 6), blend2 = Math.max(0, Math.min(1, (end + 8 - yy) / 16));
        v += (Math.max(v, clearance2) - v) * blend2;
        pts.push({ x: x + sign * v, y: yy, w: i === N ? 1 : w });
      }
      const outline3 = [...pts.map((p) => [p.x + p.w / 2, p.y]), ...pts.slice().reverse().map((p) => [p.x - p.w / 2, p.y])];
      let detail = "";
      for (let i = 3; i < N - 3; i += 7) {
        const p = pts[i], q2 = pts[Math.min(N, i + 5)];
        detail += line(`M${p.x - sign * 2},${p.y} Q${p.x + sign * 5},${p.y + 8} ${q2.x - sign * 2},${q2.y}`);
      }
      lengths += feature("free-wave", draw2(contourPath(outline3)) + detail);
    }
    function loose(sign, to = end + 20) {
      const edge = x + sign * (s + 2), root = x + sign * (tw + 2);
      lengths += feature("loose-lock", draw2(`M${root},${fy - 2} C${edge + sign * 9},${y + 8} ${edge - sign * 6},${end - 5} ${edge + sign * 3},${end + 4} Q${edge + sign * 8},${to} ${edge - sign * 3},${to} Q${edge + sign * 2},${end + 9} ${edge - sign * 3},${end + 4} C${edge - sign * 11},${end - 5} ${edge + sign * 2},${y + 7} ${root},${fy - 2}Z`));
    }
    function halfBun() {
      const px = x + (a === "D" ? 7 : 3), py = t - 11;
      back += feature("half-up-knot", draw2(`M${px - 14},${py + 10} C${px - 25},${py + 5} ${px - 14},${py - 13} ${px - 3},${py - 9} C${px + 8},${py - 15} ${px + 24},${py} ${px + 13},${py + 10} L${x + 12},${t + 15} L${x - 13},${t + 15}Z`) + line(`M${px - 4},${py - 8} q-10,10 8,17 M${px + 5},${py - 7} q-5,10 7,15`));
      if (m.state.accessories) backAccessories += ornament(`M${px - 11},${py + 7} q12,-3 24,1 l-1,3 q-12,-4 -22,-1Z`);
    }
    function hanging(sign, to, width = 5, offset = 0, rootY = fy + 6) {
      const root = [x + sign * (tw + 3 + offset), rootY], pts = Array.from({ length: 11 }, (_, i) => {
        const u = i / 10;
        return [root[0] + sign * (s - tw + 3) * Math.sin(Math.PI * Math.min(1, u * 2) / 2) + sign * (n2 === 45 ? 6 : 3) * Math.sin(u * Math.PI * (n2 === 45 ? 3 : 1)), rootY + (to - rootY) * u];
      });
      const [ax, ay] = root;
      sides += feature("braid-root", draw2(`M${ax - sign * 6},${ay - 16} C${ax + sign * 6},${ay - 20} ${ax + sign * 8},${ay - 7} ${ax + sign * width * 0.8},${ay + 5} L${ax - sign * width * 0.8},${ay + 5} Q${ax - sign * 4},${ay - 5} ${ax - sign * 6},${ay - 16}Z`));
      lengths += braid(pts, width);
      const tip = pts.at(-1);
      lengths += draw2(`M${tip[0] - width * 0.6},${tip[1] - 1} Q${tip[0]},${tip[1] + 10} ${tip[0] + width * 0.6},${tip[1] - 1}Z`);
      if (m.state.accessories) accessories += ornament(`M${tip[0] - width * 0.7},${tip[1] - 1} h${width * 1.4} v3 h${-width * 1.4}Z`);
    }
    if (n2 === 37) {
      if (a === "G") {
        rough("work");
        forelock();
      } else {
        const ax = x - f.lower * 0.5, ay = end - 8;
        back = draw2(`M${ax},${ay} C${x - s - 28},${ay - 5} ${x - s - 31},${end + 21} ${x - s - 10},${end + 59} L${x - s - 1},${end + 49} L${x - s + 3},${end + 59} C${x - s - 9},${end + 20} ${ax + 9},${ay + 14} ${ax},${ay}Z`) + line(`M${ax - 5},${ay + 3} Q${x - s - 28},${end + 22} ${x - s - 9},${end + 47}`);
        if (m.state.accessories) backAccessories = ornament(`M${ax - 4},${ay + 1} l8,-3 1,3 -8,3Z`);
        swept();
        const edge = x - s - 8, inner = x - s + 1;
        sides += draw2(`M${x + r * 0.5},${t + 8} C${x - r * 0.4},${t + 3} ${edge},${fy + 6} ${edge},${y + h * 0.35} Q${edge - 3},${end + 2} ${x - f.lower * 0.65},${end + 7} Q${x - f.lower * 0.85},${end} ${inner},${y + h * 0.36} Q${x - r * 0.97},${y - h * 0.2} ${x + r * 0.5},${t + 8}Z`);
      }
    } else if (n2 === 38) {
      rough(a === "G" ? "battle" : "fringe");
      if (a === "D") for (const sign of [-1, 1]) shag(sign, 12);
    } else if (n2 === 39) {
      if (a === "G") rough("rustic");
      else {
        parted();
        const q2 = seed(32, "D");
        sides = q2.sides;
        lengths = q2.lengths;
        accessories = q2.accessories;
      }
    } else if (n2 === 40) {
      if (a === "G") {
        rough("shag");
        forelock();
        for (const sign of [-1, 1]) shag(sign, 22);
      } else {
        parted();
        for (const sign of [-1, 1]) wave(sign, end + (sign < 0 ? 60 : 70), { phase: sign < 0 ? 0.4 : -0.6, amp: sign < 0 ? 7 : 9 });
        for (const sign of [-1, 1]) {
          hanging(sign, end + (sign < 0 ? 48 : 54), 2.1, 12, fy + 23);
          if (m.state.accessories) for (let i = 0; i < 3; i++) accessories += `<circle cx="${x + sign * (s + 15)}" cy="${end - 3 + i * 6}" r="2" fill="#f4e5be" stroke="#91723c" stroke-width="1.1"/>`;
        }
      }
    } else if (n2 === 41) {
      if (a === "D") {
        parted();
        const q2 = seed(32, "G");
        sides = q2.sides;
        lengths = q2.lengths;
        accessories = q2.accessories;
        loose(1, end + 10);
      } else {
        front += feature("pulled-roll", draw2(`M${x - r * 0.82},${fy - 3} C${x - r * 0.96},${t - 7} ${x + r * 0.78},${t - 11} ${x + r * 0.84},${fy - 4} Q${x},${fy + 1} ${x - r * 0.82},${fy - 3}Z`));
        for (const u of [-0.6, -0.2, 0.3, 0.65]) texture2 += line(`M${x + r * u},${fy - 5} Q${x + r * u * 0.8},${t + 6} ${x + r * u * 0.5},${t + 2}`);
        const root = [x + s + 2, end - 9], pts = Array.from({ length: 11 }, (_, i) => [root[0] + 3 * Math.sin(i / 10 * Math.PI), root[1] + i / 10 * 78]);
        back += draw2(`M${x + tw + 1},${policy.cutY - 4} Q${x + s + 9},${y} ${root[0] + 3},${root[1] + 6} L${root[0] - 4},${root[1] + 6} Q${x + s + 1},${y} ${x + tw - 2},${policy.cutY - 3}Z`);
        lengths += `<g data-attachment="rear">${braid(pts, 5.5)}</g>`;
        if (m.state.accessories) accessories += ornament(`M${root[0] - 2},${root[1] + 77} h5 v3 h-5Z`);
      }
    } else if (n2 === 42) {
      halfBun();
      parted();
      if (a === "G") {
        for (const sign of [-1, 1]) shag(sign, 16);
      } else for (const sign of [-1, 1]) wave(sign, end + (sign < 0 ? 62 : 69), { phase: sign * 0.4, amp: 6, width: 14 });
    } else if (n2 === 43) {
      if (a === "G") {
        rough("oblique");
        forelock();
        for (const sign of [-1, 1]) shag(sign, 8);
      } else {
        for (const sign of [-1, 1]) wave(sign, end + (sign < 0 ? 71 : 63), { phase: sign < 0 ? 1 : -0.6, amp: 8, width: 14 });
        swept();
      }
    } else if (n2 === 44) {
      if (a === "G") rough("oblique");
      else {
        const q2 = seedA(25, "D");
        front = q2.front.replace(/^<g clip-path="[^"]*">/, "").replace(/<\/g>$/, "");
        sides = q2.sides;
        texture2 = q2.texture;
        for (let i = 0; i < 3; i++) {
          const yy = policy.cutY - 13 + i * 3.3;
          const pts = Array.from({ length: 5 }, (_, j) => [x + tw * 0.72 + j * 2, yy - 2 * Math.sin(j / 4 * Math.PI)]);
          front += braid(pts, 1.5);
        }
      }
    } else if (n2 === 45) {
      if (a === "G") {
        for (const [i, u] of [-0.94, -0.63, -0.31, 0.05, 0.37, 0.66, 0.92].entries()) {
          const root = [x + tw * u, fy - 6 + Math.abs(u) * 3], tip = [x + (r + 12) * u, t - 15 + Math.abs(u) * 29 + (i % 2 ? 3 : 0)], pts = Array.from({ length: 3 }, (_, j) => {
            const z = j / 2;
            return [root[0] + (tip[0] - root[0]) * z + 3 * Math.sin(z * Math.PI), root[1] + (tip[1] - root[1]) * z];
          });
          front += braid(pts, 4.3);
        }
        hanging(-1, end + 25, 3.4, 4);
        hanging(1, end + 15, 3, 5);
      } else {
        const yy = y - h * 0.2, pts = Array.from({ length: 15 }, (_, i) => {
          const z = Math.PI + i * Math.PI / 14;
          return [x + Math.cos(z) * (r + 7), yy + Math.sin(z) * (yy - t + 10)];
        });
        front += feature("braided-crown", braid(pts, 6));
        swept();
        for (const [sign, offset, extra, width] of [[-1, 3, 69, 4.7], [1, 4, 59, 4.2], [-1, 14, 76, 3], [1, 15, 79, 2.9]]) hanging(sign, end + extra, width, offset, fy + (offset > 10 ? 20 : 6));
      }
    }
    if (policy.mode !== "full") {
      const id = "hair-" + instance.replace(/[^a-zA-Z0-9_-]/g, "-"), cut = policy.cutY;
      const d = policy.mode === "top" ? `M-50,-100 H210 V${cut} H-50Z` : `M-50,-100 H210 V${cut} H${x + tw * 0.72} V270 H-50Z`;
      defs = `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs>`;
      volume = `<g clip-path="url(#${id})">${volume}</g>`;
      front = `<g clip-path="url(#${id})">${front}</g>`;
      if (n2 === 41) for (const sign of [-1, 1]) for (const u of [0.25, 0.6, 0.85]) {
        const yy = cut + (y - h * 0.12 - cut) * u, edge = halfWidthAt(m, yy);
        texture2 += line(`M${x + sign * (edge - 5)},${yy} l${sign * 3.8},-1`, 0.9);
      }
    }
    return { back, volume, front, sides, texture: texture2, lengths, accessories, backAccessories, defs, policy };
  }

  // preview/bio-vis-p5-i6/i5/i4/i3/render.mjs
  function headGroup5(input = {}, options2 = {}) {
    const m = model5(input);
    if (!lotC[m.state.style]) return headGroup4(m.state, options2);
    const h = hairLayers5(m, options2.instance || "head"), face = headMarkup(m.base).replace(/<path d="[^"]*"/, `<path d="${m.outline}"`);
    return `<g class="lot-head" data-reference="${m.state.style}" data-arrangement="${m.state.arrangement}">${["face", "volume", "front", "sides", "texture"].map((k) => `<g data-layer="${k}">${k === "face" ? face : h[k]}</g>`).join("")}${options2.construction ? construction(m) : ""}</g>`;
  }
  function character5(input = {}, options2 = {}) {
    const state = normalize6(input);
    if (!lotC[state.style]) return character4(state, options2);
    const instance = options2.instance || (options2.smallScale ? "mini" : options2.headOnly ? "head" : "whole") + "-" + state.style + "-" + state.arrangement;
    const m = model5(state), h = hairLayers5(m, instance), long = m.reference.longArrangements.includes(state.arrangement);
    const frame = options2.headOnly ? long ? "-26 -58 212 282" : "-26 -58 212 198" : "-26 -58 212 325";
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${frame}" role="img" aria-label="${m.reference.number} \xB7 ${m.reference.name} \xB7 arrangement ${state.arrangement}">${h.defs}<g data-layer="rear">${h.back}</g><g data-layer="accessories-back">${h.backAccessories}</g>${bodyMarkup(m.body)}${headGroup5(state, { ...options2, instance })}<g data-layer="lengths">${h.lengths}</g><g data-layer="accessories">${h.accessories}</g></svg>`;
  }

  // preview/bio-vis-p5-i6/i5/i4/hair.mjs
  function rowRoutes(m) {
    const { cx: x, rx: r, top: t, forehead: fy } = m.fit;
    return [-0.88, -0.44, 0, 0.44, 0.88].map((u) => Array.from({ length: 5 }, (_, i) => {
      const v = i / 4, start = [x + r * u * 0.9, t - 4 + Math.abs(u) * r * 0.25], control = [x + r * u * 1.05 + 4, start[1] + 5], end = [x + r * u * 0.55, fy - 7 + Math.abs(u) * 2];
      return start.map((z, j) => (1 - v) ** 2 * z + 2 * (1 - v) * v * control[j] + v * v * end[j]);
    }));
  }
  function coveragePolicy3(m) {
    const n2 = m.reference.number, a = m.state.arrangement;
    return { mode: n2 === 46 ? "crest" : n2 === 53 && a === "G" ? "rows" : [47, 49, 50].includes(n2) || n2 === 53 && a === "D" ? "right-shaved" : "full", cutY: m.anchors.templeRight[1] - 5, crestWidth: m.fit.rx * (a === "G" ? 0.31 : 0.48) };
  }
  function hairLayers6(m, instance = "drawing") {
    if (!lotD[m.state.style]) return hairLayers5(m, instance);
    const f = m.fit, c = m.cut, { cx: x, cy: y, rx: r, ry: h, top: t, forehead: fy, temple: tw, side: s, end, frontWidth: fw } = f, n2 = m.reference.number, a = m.state.arrangement, brow = m.base.anchors.browLeft[1];
    const draw2 = (d) => `<path d="${d}" fill="${c.color}" stroke="${c.contour}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
    const line = (d, w = 1.2) => `<path d="${d}" fill="none" stroke="${c.contour}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const feature = (name, markup) => `<g data-feature="${name}">${markup}</g>`, braid = strandFactory(draw2, line), policy = coveragePolicy3(m);
    const id = instance.replace(/[^a-zA-Z0-9_-]/g, "-");
    let back = "", volume = coverageCap(m).match(/^<path[^>]*\/>/)[0], front = "", sides = "", texture2 = "", lengths = "", accessories = "", backAccessories = "", defs = "", color = "";
    const seed = (number, arrangement) => hairLayers5({ ...m, reference: { number }, state: { ...m.state, style: "p5-" + String(number).padStart(3, "0"), arrangement } }, "seed-" + id);
    const ornament = (d) => `<path d="${d}" fill="#d8bc7a" stroke="#91723c" stroke-width="1.5" stroke-linejoin="round"/>`;
    function swept() {
      const q2 = seed(19, "G");
      front += q2.front;
      texture2 += q2.texture;
    }
    function fade() {
      for (const u of [0.25, 0.6, 0.85]) {
        const yy = policy.cutY + (y - h * 0.12 - policy.cutY) * u, edge = halfWidthAt(m, yy);
        texture2 += line(`M${x + edge - 5},${yy} l3.8,-1`, 0.9);
      }
    }
    function undercut(long = false, extreme = false) {
      const tip = Math.min(fy + 12, brow - 4.5);
      front += feature("oblique-root", draw2(`M${x + r * 0.57},${t + 5} C${x + 3},${t - 17} ${x - r * 0.8},${t - 10} ${x - r * 1.19},${t - 13} Q${x - r * 1.07},${t - 1} ${x - r * 0.61},${t} L${x - r * 1.16},${fy - 6} Q${x - r * 0.73},${fy - 9} ${x - r * 0.46},${fy - 10} L${x - r * 0.75},${tip} Q${x - r * 0.23},${fy - 1} ${x + fw * 0.21},${fy - 14} Q${x + tw * 0.7},${fy - 9} ${x + tw * 0.94},${fy - 2} Q${x + r * 1.01},${t + 18} ${x + r * 0.57},${t + 5}Z`));
      texture2 += line(`M${x + r * 0.48},${t + 7} Q${x - r * 0.22},${t - 5} ${x - r * 0.69},${fy - 6}`);
      if (long || extreme) {
        const outer = x - s - (extreme ? 13 : 8), inner = x - s + 2, to = end + (long ? extreme ? 53 : 21 : 5);
        sides += feature("asymmetric-panel", draw2(`M${x + r * 0.54},${t + 7} C${x - r * 0.42},${t - 2} ${outer},${fy + 5} ${outer},${y + h * 0.2} L${outer - 4},${to - 10} L${outer + 5},${to - 20} L${outer + 10},${to} L${outer + 15},${to - 11} L${outer + 24},${to + 3} C${inner - 9},${end + 3} ${inner + 1},${y + h * 0.3} ${inner},${y + h * 0.15} Q${x - r * 0.5},${fy - 7} ${x + r * 0.54},${t + 7}Z`));
        texture2 += line(`M${x + r * 0.36},${t + 10} Q${outer + 2},${fy + 6} ${outer + 8},${to - 15}`);
      }
      fade();
    }
    function crest() {
      const w = policy.crestWidth, rootY = Math.min(fy + 3, brow - 6);
      const pts = a === "G" ? [[x - w, rootY], [x - w - 4, t - 22], [x - w * 0.3, t - 14], [x - w * 0.45, t - 36], [x, t - 29], [x + w * 0.4, t - 40], [x + w * 0.48, t - 24], [x + w + 5, t - 30], [x + w, rootY]] : [[x - w, rootY], [x - r * 0.93, fy - 5], [x - r * 0.67, t + 2], [x - r * 1.02, t - 4], [x - r * 0.47, t - 9], [x - r * 0.75, t - 21], [x - r * 0.17, t - 15], [x - r * 0.32, t - 34], [x + r * 0.18, t - 26], [x + r * 0.4, t - 34], [x + r * 0.55, t - 16], [x + r * 0.78, t - 22], [x + w, rootY]];
      const d = a === "G" ? "M" + pts.join(" L") + "Z" : `M${x - w},${rootY} Q${x - r * 0.73},${fy - 6} ${x - r * 1.13},${fy + 1} Q${x - r * 1.01},${t + 1} ${x - r * 0.57},${t + 2} Q${x - r * 0.98},${t - 8} ${x - r * 1.1},${t - 11} Q${x - r * 0.57},${t - 18} ${x - r * 0.23},${t - 9} L${x - r * 0.49},${t - 31} Q${x - r * 0.03},${t - 28} ${x + r * 0.16},${t - 11} L${x + r * 0.37},${t - 31} Q${x + r * 0.64},${t - 22} ${x + r * 0.45},${t - 5} Q${x + r * 0.96},${t - 14} ${x + r * 0.78},${t - 24} Q${x + r * 1.08},${t - 10} ${x + w},${rootY}Z`;
      front += feature("central-crest", draw2(d));
      for (const u of [-0.55, 0, 0.55]) texture2 += line(`M${x + w * u * 0.5},${rootY - 2} Q${x + w * u},${t - 7} ${x + w * u},${t - (a === "G" ? 22 : 15)}`);
    }
    function highFan() {
      front += feature("extravagant-fan", draw2(`M${x - r - 6},${fy - 1} Q${x - r - 19},${fy - 7} ${x - r - 5},${fy - 13} Q${x - r - 18},${t + 3} ${x - r - 11},${t - 13} Q${x - r - 7},${t + 1} ${x - r * 0.5},${t - 3} C${x - r * 1.01},${t - 22} ${x - r * 0.6},${t - 34} ${x - r * 0.41},${t - 39} Q${x - r * 0.53},${t - 18} ${x - r * 0.1},${t - 11} C${x - r * 0.25},${t - 37} ${x + r * 0.13},${t - 44} ${x + r * 0.35},${t - 46} Q${x + r * 0.08},${t - 24} ${x + r * 0.46},${t - 16} Q${x + r * 0.65},${t - 34} ${x + r * 0.78},${t - 30} C${x + r * 1.4},${t - 19} ${x + r * 1.21},${fy - 10} ${x + tw},${fy + 1} Q${x},${fy - 7} ${x - r - 6},${fy - 1}Z`));
      for (const u of [-0.75, -0.2, 0.35, 0.75]) texture2 += line(`M${x + r * u * 0.3},${fy - 8} C${x + r * u - 10},${t - 1} ${x + r * u - 7},${t - 18} ${x + r * u},${t - 25}`);
    }
    function roll(px, py, ww, hh) {
      return feature("closed-roll", draw2(`M${px - ww},${py + 3} C${px - ww - 3},${py - hh} ${px + ww * 0.7},${py - hh - 7} ${px + ww},${py - 1} Q${px + ww + 1},${py + hh} ${px - ww * 0.2},${py + hh} C${px - ww},${py + hh} ${px - ww * 0.8},${py - 5} ${px + ww * 0.2},${py - 5} C${px + ww * 0.8},${py - 2} ${px + ww * 0.3},${py + 7} ${px - ww * 0.2},${py + 3}Z`));
    }
    function cylinder(points, width) {
      const normal = points.map((p, i) => {
        const aa2 = points[Math.max(0, i - 1)], bb2 = points[Math.min(points.length - 1, i + 1)], dx = bb2[0] - aa2[0], dy = bb2[1] - aa2[1], l = Math.hypot(dx, dy);
        return [-dy / l, dx / l];
      });
      const sides2 = (sign) => points.map((p, i) => [p[0] + sign * normal[i][0] * width * 0.5, p[1] + sign * normal[i][1] * width * 0.5]);
      const aa = sides2(1), bb = sides2(-1), first = points[0], last = points.at(-1), tangent = [normal.at(-1)[1], -normal.at(-1)[0]];
      const shape = draw2(contourPath([...aa, [last[0] + tangent[0] * width * 0.35, last[1] + tangent[1] * width * 0.35], ...bb.reverse(), [first[0] - normal[0][1] * width * 0.35, first[1] + normal[0][0] * width * 0.35]]));
      let detail = "";
      for (let i = 2; i < points.length - 1; i += 4) {
        const p = points[i], nn = normal[i];
        detail += line(`M${p[0] - nn[0] * width * 0.25},${p[1] - nn[1] * width * 0.25} q${nn[0] * width * 0.45 + 1},${nn[1] * width * 0.45 + 1} ${nn[0] * width * 0.5},${nn[1] * width * 0.5 + 2}`, 0.9);
      }
      return `<g data-feature="lock" data-root="${first}" data-end="${last}">${shape}${detail}</g>`;
    }
    function lockFan(long = false) {
      const us = long ? [-0.83, -0.42, -0.05, 0.38, 0.8] : [-1, -0.65, -0.3, 0.08, 0.43, 0.75, 1];
      for (const [i, u] of us.entries()) {
        const root = [x + tw * u * 0.65, fy - 6 + Math.abs(u) * 2], tip = [x + (r + 14) * u, t - 12 + Math.abs(u) * 39 + (i % 2 ? 4 : 0)], points = Array.from({ length: 9 }, (_, j) => {
          const z = j / 8;
          return [root[0] + (tip[0] - root[0]) * z + 7 * Math.sin(z * Math.PI), root[1] + (tip[1] - root[1]) * z - 7 * Math.sin(z * Math.PI)];
        });
        front += cylinder(points, long ? 8 : 9);
      }
      for (const sign of [-1, 1]) for (let i = 0; i < (long ? 3 : 2); i++) {
        const root = [x + sign * (tw + 1 + i * 3), fy + 6 + i * 5], to = end + (long ? 56 + i * 10 + (sign < 0 ? 0 : 5) : 14 + i * 9), points = Array.from({ length: 17 }, (_, j) => {
          const z = j / 16;
          return [root[0] + sign * ((s - tw + 7 + i * 4) * Math.sin(Math.min(1, z * 2) * Math.PI / 2) + 4 * Math.sin(z * Math.PI * 3 + i * 0.4)), root[1] + (to - root[1]) * z];
        });
        lengths += cylinder(points, long ? 7.5 : 8.5);
        sides += draw2(`M${root[0] - sign * 6},${root[1] - 15} Q${root[0] + sign * 8},${root[1] - 12} ${root[0] + sign * 4},${root[1] + 7} L${root[0] - sign * 4},${root[1] + 7}Z`);
        if (m.state.accessories) {
          const q2 = points[long ? 12 : 10];
          accessories += ornament(`M${q2[0] - 4},${q2[1] - 1} h8 v5 h-8Z`);
        }
      }
    }
    function hanging(sign, to, width = 4, offset = 0, rootY = fy + 6) {
      const root = [x + sign * (tw + 3 + offset), rootY], points = Array.from({ length: 11 }, (_, i) => {
        const z = i / 10;
        return [root[0] + sign * (s - tw + 4) * Math.sin(Math.min(1, z * 2) * Math.PI / 2) + sign * 3 * Math.sin(z * Math.PI * 2), root[1] + (to - root[1]) * z];
      });
      sides += feature("braid-root", draw2(`M${root[0] - sign * 6},${root[1] - 15} Q${root[0] + sign * 8},${root[1] - 12} ${root[0] + sign * width},${root[1] + 7} L${root[0] - sign * width},${root[1] + 7}Z`));
      lengths += braid(points, width);
      if (m.state.accessories) {
        const q2 = points[8];
        accessories += ornament(`M${q2[0] - width},${q2[1] - 1} h${width * 2} v5 h${-width * 2}Z`);
      }
    }
    function feather(px, py, sign) {
      if (!m.state.accessories) return "";
      return ornament(`M${px},${py} Q${px + sign * 19},${py + 14} ${px + sign * 6},${py + 35} Q${px - sign * 12},${py + 18} ${px},${py}Z`) + `<path d="M${px},${py + 3} l${sign * 5},25 m-1,-12 l${-sign * 7},3" fill="none" stroke="#91723c" stroke-width="1.2"/>`;
    }
    if (n2 === 46) crest();
    else if (n2 === 47) undercut(a === "D");
    else if (n2 === 48 || n2 === 54 && a === "G") {
      const q2 = seed(38, a);
      ({ back, volume, front, sides, texture: texture2, lengths } = q2);
      if (a === "D") {
        front += feature("radiating-tufts", draw2(`M${x + r * 0.15},${t + 13} Q${x - r * 0.4},${t - 12} ${x - r * 0.58},${t - 26} Q${x - r * 0.16},${t - 25} ${x + r * 0.24},${t - 5} L${x + r * 0.42},${t - 31} Q${x + r * 0.82},${t - 22} ${x + r * 0.65},${t + 2} Q${x + r * 1.3},${t - 7} ${x + r * 1.18},${t - 18} Q${x + r * 1.55},${t + 4} ${x + r * 0.8},${t + 19}Z`));
      }
      if (n2 === 54 && m.state.accessories) {
        const yy = fy - 10;
        accessories += ornament(`M${x - r - 3},${yy - 3} Q${x},${yy - 10} ${x + r + 3},${yy - 3} l-1,5 Q${x},${yy - 5} ${x - r - 2},${yy + 2}Z`);
        for (const sign of [-1, 1]) accessories += `<ellipse cx="${x + sign * 12}" cy="${yy}" rx="10" ry="7" fill="#ece0bd" stroke="#91723c" stroke-width="2.3"/>`;
        accessories += feather(x - s - 1, end - 10, -1);
      }
    } else if (n2 === 49 || n2 === 50) {
      undercut(a === "D", n2 === 49 || a === "D");
      if (n2 === 50 && a === "D") back += draw2(`M${x + tw},${fy - 4} Q${x + s + 12},${y} ${x + s + 2},${end + 44} L${x + s - 7},${end + 35} Q${x + s + 1},${end - 5} ${x + tw},${fy - 4}Z`);
    } else if (n2 === 51) {
      if (a === "G") highFan();
      else {
        back += draw2(`M${x - r},${fy - 8} Q${x - r - 14},${t - 12} ${x},${t - 32} Q${x + r + 27},${t - 32} ${x + r + 7},${fy - 4}Z`);
        for (const [u, v, w, hh] of [[-0.7, -13, 13, 18], [0, -25, 15, 19], [0.68, -18, 13, 18], [1, -1, 12, 17]]) back += roll(x + r * u, t + v, w, hh);
        swept();
        const q2 = seed(31, "D");
        lengths = q2.lengths;
        sides += draw2(`M${x + r * 0.57},${t + 8} C${x - r * 0.4},${t - 1} ${x - s - 14},${fy + 4} ${x - s - 8},${y + h * 0.4} Q${x - s - 19},${end + 4} ${x - s + 5},${end + 24} Q${x - s - 1},${end + 2} ${x - s + 1},${y + h * 0.34} Q${x - r * 0.9},${fy - 3} ${x + r * 0.57},${t + 8}Z`);
      }
    } else if (n2 === 52) lockFan(a === "D");
    else if (n2 === 53) {
      if (a === "G") {
        volume = "";
        for (const points of rowRoutes(m)) front += feature("scalp-row", braid(points, 3.2));
        for (const sign of [-1, 1]) front += feature("temple-row", braid([[x + sign * r * 0.73, t + 10], [x + sign * tw, fy - 6], [x + sign * (tw + 3), fy + 6]], 3));
        hanging(-1, end + 27, 3.6, 0);
        hanging(1, end + 22, 3.2, 0);
      } else {
        swept();
        const crown = Array.from({ length: 11 }, (_, i) => {
          const z = Math.PI + i * Math.PI * 0.72 / 10;
          return [x + Math.cos(z) * (r + 5), y - h * 0.2 + Math.sin(z) * (y - h * 0.2 - t + 9)];
        });
        front += braid(crown, 5);
        for (let i = 0; i < 3; i++) {
          const yy = policy.cutY - 14 + i * 3.7, points = Array.from({ length: 5 }, (_, j) => [x + tw * 0.71 + j * 3.2, yy - 2 * Math.sin(j / 4 * Math.PI)]);
          front += braid(points, 1.4);
        }
        hanging(-1, end + 67, 4.8, 1);
        hanging(-1, end + 76, 3.7, 12, fy + 19);
        const rootY = m.anchors.earRight[1] + 6, rootX = x + tw + 4;
        back += draw2(`M${x + tw},${policy.cutY - 2} Q${x + s + 6},${y + 3} ${rootX + 3},${rootY + 5} L${rootX - 3},${rootY + 5} Q${x + tw + 2},${y + 5} ${x + tw - 2},${policy.cutY - 2}Z`);
        hanging(1, end + 56, 3.3, 1, rootY);
      }
    } else if (n2 === 54) {
      highFan();
      swept();
      const q2 = seed(23, "D");
      sides = q2.sides;
      if (m.state.accessories) {
        accessories += ornament(`M${x - r - 4},${fy - 13} Q${x},${fy - 20} ${x + r + 4},${fy - 13} l-1,5 Q${x},${fy - 16} ${x - r - 3},${fy - 8}Z`);
        accessories += feather(x - s - 1, end - 10, -1);
        for (let i = 0; i < 4; i++) accessories += `<circle cx="${x + r - 4 + i * 1.5}" cy="${fy - 6 + i * 4}" r="2" fill="#f4e5be" stroke="#91723c" stroke-width="1.1"/>`;
      }
    }
    if (policy.mode === "crest" || policy.mode === "right-shaved") {
      const clip = "hair-" + id, cut = policy.cutY, cw = policy.crestWidth;
      const path5 = policy.mode === "crest" ? `M${x - cw},-120 H${x + cw} V${Math.min(fy + 3, brow - 6)} H${x - cw}Z` : `M-60,-120 H220 V${cut} H${x + tw * 0.72} V280 H-60Z`;
      defs += `<defs><clipPath id="${clip}"><path d="${path5}"/></clipPath></defs>`;
      volume = `<g clip-path="url(#${clip})">${volume}</g>`;
      if (policy.mode === "right-shaved") front = `<g clip-path="url(#${clip})">${front}</g>`;
    }
    if (n2 === 50 && m.state.contrast && !m.state.monochrome) {
      const clip = "contrast-" + id;
      const silhouette2 = (volume + front + sides).replace(/<\/?g[^>]*>/g, "");
      defs += `<defs><clipPath id="${clip}" clipPathUnits="userSpaceOnUse">${silhouette2}</clipPath></defs>`;
      color = `<g clip-path="url(#hair-${id})"><g data-feature="contrast-color" clip-path="url(#${clip})"><path d="M${x - r * 0.2},${t - 25} Q${x - r * 0.7},${fy - 13} ${x - r * 0.65},${a === "G" ? fy + 4 : end + 66} l-12,-2 Q${x - r * 0.9},${fy - 5} ${x - r * 0.72},${t - 26}Z" fill="#dbc48a"/><path d="M${x + r * 0.4},${t - 20} l12,3 Q${x + r * 0.7},${fy - 7} ${x + tw},${fy + 6} l-5,-2 Q${x + r * 0.4},${fy - 12} ${x + r * 0.4},${t - 20}Z" fill="#65421f"/></g></g>`;
    }
    return { back, volume, front, sides, texture: texture2, lengths, accessories, backAccessories, defs, color, policy };
  }

  // preview/bio-vis-p5-i6/i5/i4/render.mjs
  function headGroup6(input = {}, options2 = {}) {
    const m = model6(input);
    if (!lotD[m.state.style]) return headGroup5(m.state, options2);
    const h = hairLayers6(m, options2.instance || "head"), face = headMarkup(m.base).replace(/<path d="[^"]*"/, `<path d="${m.outline}"`);
    return `<g class="lot-head" data-reference="${m.state.style}" data-arrangement="${m.state.arrangement}">${["face", "volume", "front", "sides", "color", "texture"].map((k) => `<g data-layer="${k}">${k === "face" ? face : h[k]}</g>`).join("")}${options2.construction ? construction(m) : ""}</g>`;
  }
  function character6(input = {}, options2 = {}) {
    const state = normalize7(input);
    if (!lotD[state.style]) return character5(state, options2);
    const instance = options2.instance || (options2.smallScale ? "mini" : options2.headOnly ? "head" : "whole") + "-" + state.style + "-" + state.arrangement;
    const m = model6(state), h = hairLayers6(m, instance), long = m.reference.longArrangements.includes(state.arrangement);
    const frame = options2.headOnly ? long ? "-36 -80 232 302" : "-36 -80 232 228" : "-36 -80 232 347";
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${frame}" role="img" aria-label="${m.reference.number} \xB7 ${m.reference.name} \xB7 arrangement ${state.arrangement}">${h.defs}<g data-layer="rear">${h.back}</g><g data-layer="accessories-back">${h.backAccessories}</g>${bodyMarkup(m.body)}${headGroup6(state, { ...options2, instance })}<g data-layer="lengths">${h.lengths}</g><g data-layer="accessories">${h.accessories}</g></svg>`;
  }

  // preview/bio-vis-p5-i6/i5/hair.mjs
  function rowRoutes2(m) {
    const { cx: x, rx: r, top: t, forehead: fy } = m.fit, count = m.state.arrangement === "G" ? 7 : 9;
    return Array.from({ length: count }, (_, j) => {
      const u = (j / (count - 1) - 0.5) * 2;
      const A = [x + r * u * 0.78, t - 4 + Math.abs(u) * r * 0.27], B = [x + r * u * 0.99, t + 7 + Math.abs(u) * 4], cy = fy - 6 + Math.abs(u) * 8, C = [x + halfWidthAt(m, cy) * u * 0.88, cy];
      return Array.from({ length: 6 }, (_2, i) => {
        const v = i / 5;
        return A.map((z, k) => (1 - v) ** 2 * z + 2 * (1 - v) * v * B[k] + v * v * C[k]);
      });
    });
  }
  function coveragePolicy4(m) {
    const n2 = m.reference.number, a = m.state.arrangement;
    return { mode: n2 === 55 ? "rows" : n2 === 63 && a === "G" ? "unknown" : n2 === 62 && a === "G" ? "crest" : n2 === 60 && a === "G" || n2 === 62 && a === "D" ? "right-shaved" : "full", cutY: m.anchors.templeRight[1] - 5, crestWidth: m.fit.rx * 0.69 };
  }
  function hairLayers7(m, instance = "drawing") {
    if (!lotE[m.state.style]) return hairLayers6(m, instance);
    const f = m.fit, c = m.cut, { cx: x, cy: y, rx: r, ry: h, top: t, forehead: fy, temple: tw, side: s, end } = f, n2 = m.reference.number, a = m.state.arrangement, brow = m.base.anchors.browLeft[1];
    const draw2 = (d) => `<path d="${d}" fill="${c.color}" stroke="${c.contour}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
    const line = (d, w = 1.2) => `<path d="${d}" fill="none" stroke="${c.contour}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const feature = (name, s2) => `<g data-feature="${name}">${s2}</g>`, braid = strandFactory(draw2, line), fineBraid = strandFactory((d) => draw2(d).replace('stroke-width="1.8"', 'stroke-width="1.2"'), (d, w) => line(d, Math.min(w, 0.8))), policy = coveragePolicy4(m), id = instance.replace(/[^a-zA-Z0-9_-]/g, "-");
    const seed = (number, arrangement) => hairLayers6(model6({ ...m.state, style: "p5-" + String(number).padStart(3, "0"), arrangement }), instance);
    const unclip = (s2) => s2.replace(/^<g clip-path="[^"]*">/, "").replace(/<\/g>$/, "");
    let back = "", volume = coverageCap(m).match(/^<path[^>]*\/>/)[0], front = "", sides = "", texture2 = "", lengths = "", accessories = "", backAccessories = "", defs = "", color = "", reusedClip = false;
    const ornament = (d) => `<path d="${d}" fill="#d8bc7a" stroke="#91723c" stroke-width="1.5" stroke-linejoin="round"/>`;
    const pearl = (px, py, rr = 2.5) => `<circle cx="${px}" cy="${py}" r="${rr}" fill="#f4e5be" stroke="#91723c" stroke-width="1.1"/>`;
    function parted() {
      front += seed(28, "G").front.split('<g data-feature="braided-crown">')[0];
    }
    function pulled() {
      front += feature("pulled-roots", draw2(`M${x - tw},${fy - 3} C${x - r - 5},${t - 6} ${x + r + 5},${t - 6} ${x + tw},${fy - 3} Q${x + r * 0.5},${fy - 8} ${x},${fy - 5} Q${x - r * 0.5},${fy - 8} ${x - tw},${fy - 3}Z`));
      for (const u of [-0.75, -0.4, 0, 0.4, 0.75]) texture2 += line(`M${x + r * u},${fy - 5} Q${x + r * u * 0.9},${t + 7} ${x + r * u * 0.3},${t + 2}`);
    }
    function smoothBun(px, py, rx, ry) {
      return feature("smooth-bun", draw2(`M${px - rx * 0.5},${py + ry - 3} Q${x - r * 0.5},${t - 3} ${x - r * 0.45},${t + 10} L${x + r * 0.45},${t + 10} Q${x + r * 0.5},${t - 3} ${px + rx * 0.5},${py + ry - 3}Z`) + draw2(`M${px - rx},${py} C${px - rx},${py - ry * 1.35} ${px + rx},${py - ry * 1.35} ${px + rx},${py} C${px + rx},${py + ry * 1.35} ${px - rx},${py + ry * 1.35} ${px - rx},${py}Z`) + line(`M${px - rx * 0.45},${py - ry * 0.85} Q${px - rx},${py} ${px},${py + ry - 1} M${px + rx * 0.25},${py - ry * 0.95} Q${px + rx * 0.9},${py} ${px},${py + ry - 1}`));
    }
    function pins(px, py, crossed = false, rx = 23) {
      if (!m.state.accessories) return;
      const clip = "pins-" + id;
      defs += `<defs><clipPath id="${clip}" clipPathUnits="userSpaceOnUse"><path d="M-80,-160 H${px - rx * 0.95} V260 H-80Z M${px + rx * 0.95},-160 H240 V260 H${px + rx * 0.95}Z"/></clipPath></defs>`;
      const bars = ornament(`M${px - 29},${py - 2} l57,${crossed ? -11 : 0} 1,3 -57,${crossed ? 11 : 0}Z`) + (crossed ? ornament(`M${px - 25},${py - 15} l54,12 -1,3 -54,-12Z`) : "");
      backAccessories += `<g data-feature="hair-pins" clip-path="url(#${clip})">${bars}</g>`;
    }
    function loose(sign, to = end + 16) {
      const root = x + sign * (tw + 2), edge = x + sign * (s + 1);
      lengths += feature("loose-lock", draw2(`M${root},${fy - 2} C${edge + sign * 8},${y + 8} ${edge - sign * 7},${end - 5} ${edge + sign * 2},${end + 3} Q${edge + sign * 8},${to} ${edge - sign * 3},${to} Q${edge + sign * 2},${end + 9} ${edge - sign * 3},${end + 3} C${edge - sign * 11},${end - 5} ${edge + sign * 2},${y + 7} ${root},${fy - 2}Z`));
    }
    function band2(yy, central = false) {
      if (!m.state.accessories) return;
      accessories += ornament(`M${x - r - 5},${yy} Q${x},${yy - 8} ${x + r + 5},${yy} l-1,3 Q${x},${yy - 4} ${x - r - 4},${yy + 3}Z`);
      if (central) accessories += pearl(x, yy - 2, 3.4);
    }
    function flower(px, py) {
      if (!m.state.accessories) return;
      for (let i = 0; i < 5; i++) {
        const z = i * Math.PI * 2 / 5;
        accessories += pearl(px + Math.cos(z) * 4, py + Math.sin(z) * 4, 2.8);
      }
      accessories += pearl(px, py, 2);
    }
    function hangingFine(sign, to, offset = 0, rootY = fy + 10) {
      const root = [x + sign * (tw + 2 + offset), rootY], points = Array.from({ length: 12 }, (_, i) => {
        const z = i / 11;
        return [root[0] + sign * (s - tw + 5) * Math.sin(Math.min(1, z * 2) * Math.PI / 2) + sign * 2 * Math.sin(z * Math.PI * 2 + 0.2 * offset), root[1] + (to - root[1]) * z];
      });
      sides += feature("braid-root", draw2(`M${root[0] - sign * 4},${root[1] - 12} Q${root[0] + sign * 6},${root[1] - 9} ${root[0] + sign * 3},${root[1] + 5} L${root[0] - sign * 3},${root[1] + 5}Z`));
      lengths += fineBraid(points, 2.25);
      if (m.state.accessories) {
        const q2 = points[10];
        accessories += ornament(`M${q2[0] - 2.8},${q2[1] - 1} h5.6 v4 h-5.6Z`);
      }
    }
    function braidedBun() {
      const py = t - 18, rx = 23, ry = 16;
      back += feature("braided-bun", draw2(`M${x - 10},${t - 6} L${x - 13},${t + 8} H${x + 13} L${x + 10},${t - 6}Z`) + draw2(contourPath(Array.from({ length: 32 }, (_, i) => [x + Math.cos(i * Math.PI / 16) * rx, py + Math.sin(i * Math.PI / 16) * ry]))));
      for (const scale of [1, 0.62]) {
        const points = Array.from({ length: 33 }, (_, i) => {
          const z = i * Math.PI / 16;
          return [x + Math.cos(z) * rx * scale, py + Math.sin(z) * ry * scale];
        });
        back += fineBraid(points, 1.75);
      }
      if (m.state.accessories) accessories += ornament(`M${x - 16},${t - 4} Q${x},${t - 10} ${x + 16},${t - 4} l-1,3 Q${x},${t - 6} ${x - 15},${t - 1}Z`);
    }
    if (n2 === 55) {
      volume = "";
      if (a === "D") braidedBun();
      for (const points of rowRoutes2(m)) front += feature("scalp-row", fineBraid(points, a === "G" ? 2.1 : 1.65));
      for (const sign of [-1, 1]) {
        sides += draw2(`M${x + sign * (tw - 2)},${fy - 5} Q${x + sign * (s + 9)},${fy - 2} ${x + sign * (tw + 14)},${fy + 32} L${x + sign * (tw + 2)},${fy + 32} Q${x + sign * (tw - 1)},${fy + 10} ${x + sign * (tw - 2)},${fy - 5}Z`);
        for (let i = 0; i < (a === "G" ? 3 : 2); i++) hangingFine(sign, end + (a === "G" ? 65 - i * 6 : 13 - i * 6), i * 5, fy + 10 + i * 7);
      }
    } else if (n2 === 56 || n2 === 61) {
      const large = a === "D", px = x + (n2 === 61 && large ? 9 : 0), py = t - (large ? 18 : 12), rx = large ? 23 : 14, ry = large ? 15 : 10;
      back = smoothBun(px, py, rx, ry);
      if (!large) pulled();
      else if (n2 === 56) parted();
      else {
        const q2 = seed(19, "G");
        front = q2.front;
        texture2 = q2.texture;
      }
      if (large || n2 === 61) for (const sign of [-1, 1]) loose(sign, end + (n2 === 56 ? 12 : 19));
      if (n2 === 56 && large) pins(px, py, true, rx);
      if (n2 === 61) {
        pins(px, py, false, rx);
        if (large) flower(px + rx - 1, py + 4);
      }
    } else if (n2 === 57) {
      front = layers({ ...m.baseState, style: "fringe_bob" }).front.replace(/fill="(?!none")[^"]+"/g, `fill="${c.color}"`).replace(/stroke="[^"]+"/g, `stroke="${c.contour}"`);
      const to = end + (a === "G" ? 12 : 28);
      for (const sign of [-1, 1]) {
        const outer = x + sign * (s + 10), inner = x + sign * (s - 4), root = x + sign * (tw + 1);
        sides += feature("geometric-bob", draw2(`M${root},${fy - 7} Q${outer},${fy - 9} ${outer},${y + h * 0.2} L${outer},${to} L${inner},${to} L${inner},${y + h * 0.32} Q${x + sign * r * 0.83},${y - h * 0.2} ${root},${fy - 7}Z`));
        for (const u of [0.25, 0.6]) texture2 += line(`M${outer + (inner - outer) * u},${fy + 4} V${to - 3}`);
        if (m.state.accessories) for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) {
          const px = outer + (inner - outer) * (i + 0.5) / 3;
          accessories += ornament(`M${px - 1.5},${to - 12 + j * 6} h3 v4 h-3Z`);
        }
      }
      for (let i = -2; i <= 2; i++) texture2 += line(`M${x + i * tw * 0.94 / 3},${fy - 4} l1,${Math.min(brow - 4, fy + 10) - fy + 1}`);
      band2(fy - 16, a === "G");
    } else if (n2 === 58) {
      const q2 = a === "G" ? layers(m.baseState) : seed(31, "D");
      ({ back, volume, front, sides, texture: texture2, lengths } = q2);
      if (a === "G" && m.state.accessories) for (const sign of [-1, 1]) for (let i = 0; i < 4; i++) {
        const px = x + sign * (r - 3 - i * 4), py = fy - 2 - i * 5;
        accessories += ornament(`M${px},${py} q${-sign * 10},-1 ${-sign * 9},-10 q${sign * 11},0 ${sign * 9},10 q${sign * 10},-4 ${sign * 8},-14 q${-sign * 10},4 ${-sign * 8},14Z`);
      }
      if (a === "D") band2(t + 1, false);
    } else if (n2 === 59) {
      if (a === "G") {
        const q2 = seed(28, "G");
        ({ back, volume, front, sides, texture: texture2, lengths } = q2);
      } else {
        parted();
        lengths = seed(42, "D").lengths;
        band2(fy - 10, true);
      }
    } else if (n2 === 60) {
      if (a === "G") {
        const q2 = seed(32, "G");
        sides = q2.sides;
        lengths = q2.lengths;
        accessories = q2.accessories;
        const top = seed(41, "G");
        front = unclip(top.front);
        texture2 = "";
        for (const u of [-0.6, -0.2, 0.25, 0.6]) texture2 += line(`M${x + r * u},${fy - 5} Q${x + r * u * 0.7},${t + 8} ${x + r * u * 0.35},${t + 2}`);
        const points = Array.from({ length: 8 }, (_, i) => {
          const z = i / 7;
          return [x - r * 0.72 - (tw + 4 - r * 0.72) * z, t + 7 + (fy + 19 - t - 7) * z];
        });
        front += feature("temple-row", braid(points, 3.1));
      } else {
        const q2 = seed(32, "D");
        ({ back, volume, front, sides, texture: texture2, lengths, accessories } = q2);
        lengths += seed(28, "D").lengths;
      }
    } else if (n2 === 62) {
      if (a === "G") {
        const w = policy.crestWidth, root = Math.min(fy + 2, brow - 6), points = [[x - w, root], [x - r * 0.95, t - 4], [x - r * 0.63, t - 9], [x - r * 0.84, t - 23], [x - r * 0.31, t - 16], [x - r * 0.37, t - 38], [x, t - 26], [x + r * 0.19, t - 43], [x + r * 0.36, t - 24], [x + r * 0.68, t - 32], [x + r * 0.65, t - 12], [x + r * 0.98, t - 20], [x + w, root]];
        front = feature("central-crest", draw2("M" + points.join(" L") + "Z"));
        for (const u of [-0.5, 0, 0.5]) texture2 += line(`M${x + w * u},${root - 2} Q${x + w * u * 1.1},${t - 4} ${x + w * u * 0.9},${t - 16}`);
      } else {
        const q2 = seed(49, "G");
        ({ back, volume, front, sides, texture: texture2, lengths, defs } = q2);
        reusedClip = true;
        if (m.state.contrast && !m.state.monochrome) {
          const clip = "contrast-" + id, silhouette2 = (volume + front + sides).replace(/<\/?g[^>]*>/g, "");
          defs += `<defs><clipPath id="${clip}" clipPathUnits="userSpaceOnUse">${silhouette2}</clipPath></defs>`;
          color = `<g clip-path="url(#hair-${id})"><g data-feature="contrast-color" clip-path="url(#${clip})"><path d="M${x + r * 0.4},${t - 23} Q${x - r * 0.35},${t - 13} ${x - r * 0.72},${end + 12} l-13,-8 Q${x - r * 0.72},${fy - 10} ${x - r * 0.7},${t - 25}Z" fill="#bd806c"/></g></g>`;
        }
      }
    } else if (n2 === 63) {
      if (a === "G") {
        volume = "";
        if (m.state.accessories) {
          backAccessories += ornament(`M${x - r - 5},${fy - 2} Q${x - s - 12},${end - 7} ${x - s - 5},${end + 35} L${x - s + 6},${end + 27} L${x - s + 13},${end + 34} Q${x - s + 3},${end + 2} ${x - tw + 3},${fy + 3}Z`);
          accessories += feature("headscarf", ornament(`M${x - r - 7},${fy + 4} Q${x - r - 15},${t - 9} ${x},${t - 10} Q${x + r + 17},${t - 8} ${x + r + 9},${fy + 5} Q${x + r + 4},${fy - 7} ${x + r * 0.42},${fy - 11} Q${x - r * 0.15},${fy - 7} ${x - r - 7},${fy + 4}Z`) + `<path d="M${x - r - 7},${fy - 4} Q${x},${t - 3} ${x + r + 8},${fy - 11} M${x - r - 5},${fy + 1} Q${x - r * 0.2},${fy - 13} ${x + r + 9},${fy - 17}" fill="none" stroke="#91723c" stroke-width="1.5"/>`);
        }
      } else {
        back = feature("twisted-half-up", smoothBun(x + 5, t - 16, 24, 15) + smoothBun(x + 10, t - 37, 18, 12));
        parted();
        lengths = seed(42, "D").lengths;
        for (const sign of [-1, 1]) loose(sign, end + 22);
        if (m.state.accessories) {
          band2(t + 1, false);
          accessories += ornament(`M${x - 4},${t - 24} q12,-5 28,1 l-1,3 q-15,-5 -26,-1Z`);
        }
      }
    }
    if (!reusedClip && (policy.mode === "crest" || policy.mode === "right-shaved")) {
      const clip = "hair-" + id, cw = policy.crestWidth;
      const d = policy.mode === "crest" ? `M${x - cw},-120 H${x + cw} V${Math.min(fy + 2, brow - 6)} H${x - cw}Z` : `M-60,-120 H220 V${policy.cutY} H${x + tw * 0.72} V280 H-60Z`;
      defs += `<defs><clipPath id="${clip}"><path d="${d}"/></clipPath></defs>`;
      volume = `<g clip-path="url(#${clip})">${volume}</g>`;
      if (policy.mode === "right-shaved") front = `<g clip-path="url(#${clip})">${front}</g>`;
    }
    return { back, volume, front, sides, texture: texture2, lengths, accessories, backAccessories, defs, color, policy };
  }

  // preview/bio-vis-p5-i6/i5/render.mjs
  function headGroup7(input = {}, options2 = {}) {
    const m = model7(input);
    if (!lotE[m.state.style]) return headGroup6(m.state, options2);
    const h = hairLayers7(m, options2.instance || "head"), face = headMarkup(m.base).replace(/<path d="[^"]*"/, `<path d="${m.outline}"`);
    return `<g class="lot-head" data-reference="${m.state.style}" data-arrangement="${m.state.arrangement}" data-hair-status="${m.reference.unknownArrangements?.includes(m.state.arrangement) ? "unknown" : "known"}">${["face", "volume", "front", "sides", "color", "texture"].map((k) => `<g data-layer="${k}">${k === "face" ? face : h[k]}</g>`).join("")}${options2.construction ? construction(m) : ""}</g>`;
  }
  function character7(input = {}, options2 = {}) {
    const state = normalize8(input);
    if (!lotE[state.style]) return character6(state, options2);
    const instance = options2.instance || (options2.smallScale ? "mini" : options2.headOnly ? "head" : "whole") + "-" + state.style + "-" + state.arrangement;
    const m = model7(state), h = hairLayers7(m, instance), long = m.reference.longArrangements.includes(state.arrangement);
    const frame = options2.headOnly ? long ? "-36 -80 232 302" : "-36 -80 232 228" : "-36 -80 232 347";
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${frame}" role="img" aria-label="${m.reference.number} \xB7 ${m.reference.name} \xB7 arrangement ${state.arrangement}${m.reference.unknownArrangements?.includes(state.arrangement) ? " \xB7 cheveux non document\xE9s" : ""}">${h.defs}<g data-layer="rear">${h.back}</g><g data-layer="accessories-back">${h.backAccessories}</g>${bodyMarkup(m.body)}${headGroup7(state, { ...options2, instance })}<g data-layer="lengths">${h.lengths}</g><g data-layer="accessories">${h.accessories}</g></svg>`;
  }

  // preview/bio-vis-p5-i6/hair.mjs
  function coveragePolicy5(m) {
    const n2 = m.reference.number, a = m.state.arrangement;
    return { mode: m.reference.partialArrangements?.includes(a) ? "partial" : (n2 === 64 || n2 === 70) && a === "G" ? "top" : (n2 === 71 || n2 === 72) && a === "G" ? "right-shaved" : "full", cutY: m.anchors.templeRight[1] - 5 };
  }
  function hairLayers8(m, instance = "drawing") {
    if (!lotF[m.state.style]) return hairLayers7(m, instance);
    const { cx: x, cy: y, rx: r, ry: h, top: t, forehead: fy, temple: tw, side: s, end } = m.fit, c = m.cut, n2 = m.reference.number, a = m.state.arrangement, id = instance.replace(/[^a-zA-Z0-9_-]/g, "-"), policy = coveragePolicy5(m);
    const draw2 = (d) => `<path d="${d}" fill="${c.color}" stroke="${c.contour}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
    const line = (d, w = 1.2) => `<path d="${d}" fill="none" stroke="${c.contour}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const feature = (name, markup, root) => `<g data-feature="${name}"${root ? ` data-root="${root}"` : ""}>${markup}</g>`, braid = strandFactory(draw2, line);
    const seed = (number, arrangement) => hairLayers7(model7({ ...m.state, style: "p5-" + String(number).padStart(3, "0"), arrangement }), instance);
    const hairKeys = ["back", "volume", "front", "sides", "texture", "lengths"];
    let back = "", volume = coverageCap(m).match(/^<path[^>]*\/>/)[0], front = "", sides = "", texture2 = "", lengths = "", accessories = "", backAccessories = "", defs = "", color = "", cover = "";
    function copy(q2) {
      [back, volume, front, sides, texture2, lengths] = hairKeys.map((k) => q2[k] || "");
      defs = q2.defs || "";
    }
    const ornament = (d) => `<path d="${d}" fill="#d8bc7a" stroke="#91723c" stroke-width="1.5" stroke-linejoin="round"/>`;
    const bead = (px, py, rr = 2.8) => `<circle cx="${px}" cy="${py}" r="${rr}" fill="#f4e5be" stroke="#91723c" stroke-width="1.1"/>`;
    function band2(yy) {
      if (m.state.accessories) accessories += ornament(`M${x - r - 4},${yy} Q${x},${yy - 8} ${x + r + 4},${yy} l-1,3 Q${x},${yy - 4} ${x - r - 3},${yy + 3}Z`);
    }
    function bun() {
      const q2 = seed(56, "G");
      back = q2.back;
      front = q2.front;
      texture2 = q2.texture;
    }
    function parted() {
      front = seed(28, "G").front.split('<g data-feature="braided-crown">')[0];
    }
    function hanging(sign, to, width = 5) {
      const root = [x + sign * (tw + 3), fy + 7], points = Array.from({ length: 12 }, (_, i) => {
        const z = i / 11;
        return [root[0] + sign * (s - tw + 6) * Math.sin(Math.min(1, z * 2) * Math.PI / 2) + sign * 3 * Math.sin(z * Math.PI * 2), root[1] + (to - root[1]) * z];
      });
      sides += feature("braid-root", draw2(`M${root[0] - sign * 6},${root[1] - 15} Q${root[0] + sign * 8},${root[1] - 12} ${root[0] + sign * width},${root[1] + 7} L${root[0] - sign * width},${root[1] + 7}Z`));
      lengths += braid(points, width);
      if (m.state.accessories) {
        const p = points[9];
        accessories += ornament(`M${p[0] - width},${p[1] - 1} h${width * 2} v5 h${-width * 2}Z`);
      }
    }
    function pins() {
      if (!m.state.accessories) return;
      const px = x, py = t - 18, clip = "pins-" + id;
      defs += `<defs><clipPath id="${clip}" clipPathUnits="userSpaceOnUse"><path d="M-80,-160 H${px - 22} V260 H-80Z M${px + 22},-160 H240 V260 H${px + 22}Z"/></clipPath></defs>`;
      backAccessories += `<g data-feature="hair-pins" clip-path="url(#${clip})">${ornament(`M${px - 29},${py + 1} l59,-12 1,3 -59,12Z`) + ornament(`M${px - 29},${py - 4} l59,1 v3 l-59,-1Z`)}</g>`;
    }
    function smallTail(sign) {
      const px = x + sign * (s + 3), py = end - 5;
      lengths += feature("low-pigtail", draw2(`M${px - sign * 4},${py - 5} Q${px + sign * 13},${py - 3} ${px + sign * 18},${py + 20} L${px + sign * 9},${py + 16} L${px + sign * 7},${py + 29} Q${px - sign * 6},${py + 15} ${px - sign * 4},${py - 5}Z`) + line(`M${px},${py} q${sign * 10},9 ${sign * 8},18`), [px, py]);
      sides += feature("pigtail-root", draw2(`M${x + sign * (tw + 1)},${fy - 3} Q${x + sign * (s + 4)},${fy + 9} ${px + sign * 4},${py + 3} L${px - sign * 5},${py + 3} Q${x + sign * (s - 8)},${y + h * 0.2} ${x + sign * (tw - 3)},${fy + 3}Z`));
      if (m.state.accessories) accessories += ornament(`M${px - 5},${py - 1} h10 v3 h-10Z`);
    }
    function hood() {
      if (!m.state.accessories) return;
      const outer = `M${x},${t - 36} Q${x - r - 25},${t - 17} ${x - r - 31},${fy + 13} Q${x - r - 34},${end + 18} ${x - s - 7},${end + 33} Q${x},${end + 24} ${x + s + 7},${end + 33} Q${x + r + 34},${end + 18} ${x + r + 31},${fy + 13} Q${x + r + 25},${t - 17} ${x},${t - 36}Z`;
      const inner = `M${x},${t + 5} Q${x - r - 3},${t + 10} ${x - r - 13},${fy + 10} Q${x - s - 17},${end + 2} ${x - s - 4},${end + 16} Q${x},${end + 23} ${x + s + 4},${end + 16} Q${x + s + 17},${end + 2} ${x + r + 13},${fy + 10} Q${x + r + 3},${t + 10} ${x},${t + 5}Z`;
      backAccessories += `<path d="${outer}" fill="#b58c50" stroke="#91723c" stroke-width="1.8"/>`;
      cover += `<g data-feature="hood"><path d="${outer} ${inner}" fill="#b58c50" fill-rule="evenodd" stroke="#91723c" stroke-width="1.8" stroke-linejoin="round"/></g>`;
    }
    function scarf() {
      if (!m.state.accessories) return;
      backAccessories += ornament(`M${x + r + 3},${fy - 2} Q${x + s + 16},${end - 5} ${x + s + 13},${end + 36} L${x + s + 4},${end + 28} L${x + s - 1},${end + 33} Q${x + s + 4},${end - 5} ${x + tw - 3},${fy + 3}Z`);
      accessories += feature("headscarf", ornament(`M${x - r - 7},${fy + 4} Q${x - r - 15},${t - 12} ${x},${t - 13} Q${x + r + 17},${t - 9} ${x + r + 9},${fy + 5} Q${x + r + 4},${fy - 7} ${x + r * 0.42},${fy - 11} Q${x - r * 0.15},${fy - 7} ${x - r - 7},${fy + 4}Z`) + `<path d="M${x - r - 6},${fy - 2} Q${x},${t - 4} ${x + r + 8},${fy - 11}" fill="none" stroke="#91723c" stroke-width="1.4"/>`);
    }
    function crestBraid(levels) {
      back += feature("tiered-crown", draw2(`M${x - r * 0.85},${t + 12} Q${x - r * 0.92},${t - 43} ${x},${t - 46} Q${x + r * 0.92},${t - 43} ${x + r * 0.85},${t + 12}Z`));
      for (let j = 0; j < levels; j++) {
        const rr = r * (1.03 - j * 0.19), yy = t + 10 - j * 12, points = Array.from({ length: 15 }, (_, i) => {
          const z = Math.PI + i * Math.PI / 14;
          return [x + Math.cos(z) * rr, yy + Math.sin(z) * (15 - j * 1.2)];
        });
        back += braid(points, 5 - j * 0.45);
      }
    }
    if ((n2 === 64 || n2 === 70) && a === "G") {
      bun();
      const clip = "hair-" + id;
      defs += `<defs><clipPath id="${clip}"><path d="M-60,-120 H220 V${policy.cutY} H-60Z"/></clipPath></defs>`;
      volume = `<g clip-path="url(#${clip})">${volume}</g>`;
      front = `<g clip-path="url(#${clip})">${front}</g>`;
      for (const sign of [-1, 1]) for (const u of [0.25, 0.6, 0.85]) {
        const yy = policy.cutY + (y - h * 0.12 - policy.cutY) * u, edge = halfWidthAt(m, yy);
        texture2 += line(`M${x + sign * (edge - 5)},${yy} l${sign * 3.8},-1`, 0.9);
      }
      if (m.state.accessories) accessories += ornament(`M${x - 10},${t - 5} q10,-3 20,0 v3 q-10,-3 -20,0Z`);
    } else if (n2 === 64) {
      const q2 = seed(28, "G");
      front = q2.front;
      back = seed(56, "D").back;
      for (const sign of [-1, 1]) hanging(sign, end + 72, 5.5);
      if (m.state.accessories) {
        band2(t + 1);
        for (const sign of [-1, 1]) for (let i = 0; i < 2; i++) accessories += bead(x + sign * (s + 9), end + 29 + i * 8, 2.4);
      }
    } else if (n2 === 65) {
      copy(seed(a === "G" ? 19 : 48, a === "G" ? "G" : "D"));
      if (a === "G") {
        back += feature("projected-tufts", draw2(`M${x + r * 0.5},${t + 9} Q${x - r * 0.5},${t - 21} ${x - r * 1.15},${t - 15} Q${x - r * 1.04},${t - 8} ${x - r * 0.7},${t - 6} L${x - r * 1.45},${t - 1} L${x - r * 1.13},${t + 10} L${x - r * 1.6},${t + 15} Q${x - r * 1.3},${t + 24} ${x - r * 0.95},${fy - 4}Z`));
        band2(fy - 10);
      }
    } else if (n2 === 66 || n2 === 67 && a === "D") {
      volume = "";
      back = "";
      if (n2 === 66 && a === "G") {
        const q2 = seed(26, "G");
        front = q2.front;
        texture2 = q2.texture;
      } else {
        parted();
        for (const sign of [-1, 1]) hanging(sign, end + 72, 5.4);
      }
      const clip = "visible-" + id, yy = n2 === 66 ? t + 5 : fy - 6;
      defs += `<defs><clipPath id="${clip}" clipPathUnits="userSpaceOnUse"><path d="M${x - r - 13},${yy} H${x + r + 13} V${end + 100} H${x - r - 13}Z"/></clipPath></defs>`;
      front = `<g clip-path="url(#${clip})">${front}</g>`;
      texture2 = `<g clip-path="url(#${clip})">${texture2}</g>`;
      if (n2 === 66) hood();
      else scarf();
    } else if (n2 === 67) {
      const q2 = seed(19, "G");
      copy(q2);
      for (const sign of [-1, 1]) smallTail(sign);
    } else if (n2 === 68) {
      if (a === "G") copy(seed(19, "G"));
      else {
        copy(seed(56, "D"));
        defs = "";
        const q2 = seed(31, "D");
        sides = q2.sides;
        lengths = q2.lengths;
        pins();
      }
    } else if (n2 === 69) {
      if (a === "G") copy(seed(54, "G"));
      else {
        copy(seed(23, "D"));
        const q2 = seed(31, "D");
        lengths = q2.lengths;
        back += feature("irregular-bun", draw2(`M${x - 14},${t + 1} Q${x - 35},${t - 9} ${x - 19},${t - 26} Q${x - 8},${t - 39} ${x + 2},${t - 28} Q${x + 28},${t - 35} ${x + 30},${t - 13} Q${x + 38},${t + 3} ${x + 15},${t + 6}Z`) + line(`M${x - 22},${t - 12} Q${x - 17},${t - 32} ${x},${t - 15} M${x + 4},${t - 24} Q${x + 30},${t - 26} ${x + 20},${t - 5}`));
        if (m.state.accessories) {
          band2(t + 2);
          for (const sign of [-1, 1]) for (let i = 0; i < 3; i++) accessories += bead(x + sign * (s + 5), end + 3 + i * 7, 2);
        }
      }
    } else if (n2 === 70) {
      back = seed(56, "D").back;
      parted();
      lengths = seed(42, "D").lengths;
      if (m.state.accessories) {
        for (let j = -3; j <= 3; j++) accessories += bead(x + j * r / 3, fy - 10 + Math.abs(j) * 1.5, 3);
        accessories += ornament(`M${x},${fy - 7} l3,5 -3,4 -3,-4Z`);
      }
    } else if (n2 === 71) {
      if (a === "G") copy(seed(49, "G"));
      else {
        const q2 = seed(55, "D");
        back = q2.back;
        front = seed(28, "G").front;
        for (const sign of [-1, 1]) hanging(sign, end + 38, 3.4);
        if (m.state.accessories) {
          for (let i = -2; i <= 2; i++) accessories += bead(x + i * r * 0.4, fy - 12 + Math.abs(i) * 2, 2.8);
          accessories += ornament(`M${x},${fy - 8} l4,5 -4,5 -4,-5Z`);
        }
      }
    } else if (n2 === 72) {
      if (a === "G") {
        const q2 = seed(60, "G");
        copy(q2);
        const swept = seed(25, "D");
        front = swept.front;
        defs = swept.defs;
        texture2 = swept.texture;
        sides += swept.sides;
        for (let j = 0; j < 3; j++) {
          const yy = fy - 11 + j * 4, edge = halfWidthAt(m, yy) - 4, start = Math.min(tw * 0.55, edge - 3), points = Array.from({ length: 6 }, (_, i) => [x + start + (edge - start) * i / 5, yy - 2 * Math.sin(i / 5 * Math.PI)]);
          front += feature("temple-row", braid(points, 1.5));
        }
      } else {
        parted();
        crestBraid(3);
        lengths = seed(42, "D").lengths;
      }
    }
    return { back, volume, front, sides, texture: texture2, lengths, accessories, backAccessories, defs, color, cover, policy };
  }

  // preview/bio-vis-p5-i6/render.mjs
  function headGroup8(input = {}, options2 = {}) {
    const m = model8(input);
    if (!lotF[m.state.style]) return headGroup7(m.state, options2);
    const h = hairLayers8(m, options2.instance || "head"), face = headMarkup(m.base).replace(/<path d="[^"]*"/, `<path d="${m.outline}"`);
    return `<g class="lot-head" data-reference="${m.state.style}" data-arrangement="${m.state.arrangement}" data-hair-status="${m.reference.partialArrangements?.includes(m.state.arrangement) ? "partial" : "known"}">${["face", "volume", "front", "sides", "color", "texture"].map((k) => `<g data-layer="${k}">${k === "face" ? face : h[k]}</g>`).join("")}${options2.construction ? construction(m) : ""}</g>`;
  }
  function character8(input = {}, options2 = {}) {
    const state = normalize9(input);
    if (!lotF[state.style]) return character7(state, options2);
    const instance = options2.instance || (options2.smallScale ? "mini" : options2.headOnly ? "head" : "whole") + "-" + state.style + "-" + state.arrangement;
    const m = model8(state), h = hairLayers8(m, instance), long = m.reference.longArrangements.includes(state.arrangement);
    const frame = options2.headOnly ? long ? "-36 -80 232 302" : "-36 -80 232 228" : "-36 -80 232 347";
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${frame}" role="img" aria-label="${m.reference.number} \xB7 ${m.reference.name} \xB7 arrangement ${state.arrangement}${m.reference.partialArrangements?.includes(state.arrangement) ? " \xB7 implantation cach\xE9e non document\xE9e" : ""}">${h.defs}<g data-layer="rear">${h.back}</g><g data-layer="accessories-back">${h.backAccessories}</g>${bodyMarkup(m.body)}${headGroup8(state, { ...options2, instance })}<g data-layer="accessories-cover">${h.cover}</g><g data-layer="lengths">${h.lengths}</g><g data-layer="accessories">${h.accessories}</g></svg>`;
  }

  // preview/bio-vis-dedup-lot-1/hair.mjs
  var targets = Object.freeze(["p5-058:G", "p5-024:D", "p5-068:G", "p5-058:D"]);
  var isTarget = (m) => targets.includes(m.state.style + ":" + m.state.arrangement);
  function hairLayers9(m, instance = "lot1") {
    const prior = hairLayers8(m, instance);
    if (!isTarget(m)) return prior;
    const h = { ...prior }, f = m.fit, { cx: x, cy: y, rx: r, ry: rh, top: t, forehead: fy, frontWidth: fw, temple: tw, side: s, end } = f;
    const brow = m.base.anchors.browLeft[1], low = Math.min(fy + 7, brow - 7);
    const draw2 = (d) => `<path d="${d}" fill="${m.cut.color}" stroke="${m.cut.contour}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
    const line = (d, w = 1.2) => `<path d="${d}" fill="none" stroke="${m.cut.contour}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const feature = (name, s2) => `<g data-feature="${name}" data-anchor-reference="${m.hairAnchors.frontRight}">${s2}</g>`;
    if (m.state.style === "p5-058" && m.state.arrangement === "G") {
      h.back = "";
      h.volume = coverageCap(m);
      h.sides = "";
      h.lengths = "";
      const scalp = scalpSamples(m);
      for (const arc of [scalp.slice(0, 4), scalp.slice(-4).reverse()]) {
        const outer = arc.map((p) => [p.x + 3.3 * p.nx, p.y + 3.3 * p.ny]), inner = arc.map((p) => [p.x - p.nx, p.y - p.ny]);
        const points = [[outer[0][0], outer[0][1] + 2], ...outer, ...inner.reverse(), [inner.at(-1)[0], inner.at(-1)[1] + 2]];
        h.volume += `<path data-coverage="short-wave-temple-join" d="M${points.join(" L")}Z" fill="${m.cut.color}" stroke="none"/>`;
      }
      h.front = feature("close-joined-waves", draw2(`M${x - tw - 2},${fy + 2} C${x - r - 5},${t + 7} ${x - r * 0.6},${t - 3} ${x - r * 0.23},${t + 1} C${x - r * 0.02},${t - 5} ${x + r * 0.35},${t - 4} ${x + r * 0.54},${t + 2} C${x + r * 0.96},${t + 2} ${x + r + 6},${fy - 7} ${x + tw + 2},${fy + 2} Q${x + fw * 0.73},${low + 2} ${x + fw * 0.38},${low - 3} Q${x + fw * 0.18},${fy - 3} ${x - fw * 0.04},${low - 1} Q${x - fw * 0.35},${low + 4} ${x - fw * 0.55},${low - 2} Q${x - fw * 0.8},${fy + 7} ${x - tw - 2},${fy + 2}Z`));
      h.texture = feature("broad-wave-rhythm", line(`M${x - r * 0.83},${fy - 2} C${x - r * 0.64},${t + 4} ${x - r * 0.12},${t + 1} ${x - r * 0.12},${fy - 4} Q${x - r * 0.08},${low + 2} ${x - r * 0.39},${low - 1} M${x - r * 0.06},${fy - 4} C${x + r * 0.12},${t + 4} ${x + r * 0.6},${t + 5} ${x + r * 0.64},${fy - 1} Q${x + r * 0.72},${fy + 7} ${x + r * 0.4},${low - 2}`));
      for (const sign of [-1, 1]) h.sides += feature("short-temple-wave", draw2(`M${x + sign * tw},${fy} C${x + sign * (r + 5)},${fy - 3} ${x + sign * (r + 7)},${y + 1} ${x + sign * (tw + 2)},${y + rh * 0.18} Q${x + sign * (tw + 3)},${y + 1} ${x + sign * (tw - 1)},${y - rh * 0.05} Q${x + sign * (tw + 6)},${fy + 5} ${x + sign * tw},${fy}Z`));
    } else if (m.state.style === "p5-024") {
      h.volume = coverageCap(m);
      h.front = "";
      h.sides = "";
      h.texture = "";
      h.lengths = "";
      for (const sign of [-1, 1]) {
        h.front += feature("central-part-panel", draw2(`M${x},${t + 7} C${x + sign * r * 0.35},${t - 1} ${x + sign * (r + 6)},${fy - 12} ${x + sign * (tw + 3)},${fy + 4} Q${x + sign * (tw + 4)},${y - rh * 0.04} ${x + sign * (tw - 3)},${y - rh * 0.08} Q${x + sign * (tw - 5)},${fy + 8} ${x + sign * fw * 0.57},${low} Q${x + sign * fw * 0.25},${fy - 8} ${x},${t + 7}Z`));
        h.texture += line(`M${x + sign * 2},${t + 10} C${x + sign * r * 0.35},${t + 2} ${x + sign * (r + 1)},${fy - 7} ${x + sign * (tw + 1)},${fy + 7}`);
        const outer = x + sign * (s + 7), inner = x + sign * (f.cheek + 3), start = y + rh * 0.28, to = end + 34;
        h.lengths += feature("side-wave-length", draw2(`M${x + sign * (tw + 1)},${fy + 1} C${outer + sign * 2},${fy - 1} ${outer + sign * 5},${start - 8} ${outer},${start} C${outer - sign * 9},${start + 12} ${outer - sign * 9},${end - 4} ${outer + sign * 2},${end + 4} C${outer + sign * 12},${end + 13} ${outer + sign * 9},${end + 24} ${outer - sign * 2},${to} Q${outer - sign * 15},${to + 4} ${outer - sign * 13},${to - 5} C${outer + sign * 1},${end + 20} ${inner - sign * 6},${end + 8} ${inner},${end - 4} C${inner + sign * 5},${y + rh * 0.18} ${x + sign * (tw - 2)},${fy + 7} ${x + sign * (tw + 1)},${fy + 1}Z`) + line(`M${x + sign * (tw + 3)},${fy + 6} C${outer + sign * 4},${y + 4} ${outer - sign * 10},${end - 6} ${outer + sign * 3},${end + 7} Q${outer + sign * 10},${end + 21} ${outer - sign * 6},${to - 3}`));
      }
    } else if (m.state.style === "p5-068") {
      h.front = feature("raised-three-returns", draw2(`M${x + tw},${fy + 2} C${x + r + 3},${t + 12} ${x + r * 0.72},${t - 2} ${x + r * 0.2},${t - 1} C${x + r * 0.44},${t - 14} ${x + r * 0.1},${t - 28} ${x - r * 0.32},${t - 23} C${x - r * 0.05},${t - 10} ${x - r * 0.54},${t - 13} ${x - r * 0.98},${t - 10} Q${x - r * 1.2},${t - 9} ${x - r * 1.18},${t - 5} Q${x - r * 0.9},${t + 1} ${x - r * 0.63},${t - 1} Q${x - r * 0.85},${t + 12} ${x - r * 1.23},${t + 10} Q${x - r * 1.17},${t + 22} ${x - r * 0.73},${t + 16} Q${x - r * 0.92},${fy - 5} ${x - r * 1.22},${fy - 7} Q${x - r * 1.14},${low + 1} ${x - r * 0.63},${low - 4} C${x - r * 0.2},${low - 9} ${x + fw * 0.04},${fy - 20} ${x + fw * 0.35},${fy - 10} Q${x + tw * 0.92},${fy - 5} ${x + tw},${fy + 2}Z`));
      h.texture = feature("common-root-flow", line(`M${x + fw * 0.43},${fy - 8} C${x + r * 0.32},${t + 1} ${x - r * 0.03},${t - 12} ${x - r * 0.22},${t - 20} M${x + fw * 0.37},${fy - 9} C${x - r * 0.03},${t - 3} ${x - r * 0.5},${t - 2} ${x - r * 0.87},${t - 6} M${x + fw * 0.3},${fy - 9} C${x - r * 0.07},${fy - 9} ${x - r * 0.58},${t + 15} ${x - r * 0.96},${t + 15}`));
    } else {
      h.front = feature("single-central-roll", draw2(`M${x - tw},${fy + 2} C${x - r * 1.04},${t + 5} ${x - r * 0.2},${t - 6} ${x + r * 0.35},${t + 2} C${x + r * 0.95},${t + 11} ${x + r * 0.72},${fy + 7} ${x + r * 0.11},${fy + 7} C${x - r * 0.12},${fy + 7} ${x - r * 0.18},${fy - 3} ${x + r * 0.07},${fy - 6} C${x - r * 0.36},${fy - 10} ${x - r * 0.47},${fy + 9} ${x - tw},${fy + 2}Z`));
      h.sides = "";
      h.texture = "";
      h.lengths = "";
      for (const sign of [-1, 1]) {
        h.sides += feature("continuous-swept-side", draw2(`M${x + sign * (tw - 1)},${fy - 4} C${x + sign * (r + 9)},${fy - 7} ${x + sign * (r + 6)},${t - 6} ${x + sign * r * 0.38},${t + 1} Q${x + sign * r * 0.7},${t + 8} ${x + sign * (tw + 2)},${fy + 1} Q${x + sign * (s + 4)},${fy + 9} ${x + sign * (tw + 1)},${y + rh * 0.03} Q${x + sign * (tw + 8)},${fy + 12} ${x + sign * (tw - 1)},${fy - 4}Z`));
        const edge = x + sign * (s + 1);
        h.lengths += feature("short-rolled-end", draw2(`M${x + sign * (tw + 2)},${fy + 4} C${edge + sign * 7},${y + 3} ${edge - sign * 7},${end - 15} ${edge + sign * 2},${end - 8} C${edge + sign * 13},${end + 1} ${edge - sign * 7},${end + 15} ${edge - sign * 9},${end + 4} Q${edge + sign * 3},${end + 9} ${edge - sign * 1},${end - 3} C${edge - sign * 14},${end - 13} ${edge + sign * 1},${y + 5} ${x + sign * (tw + 2)},${fy + 4}Z`));
      }
      h.texture = feature("central-roll-fold", line(`M${x - tw + 3},${fy - 2} C${x - r * 0.6},${t + 5} ${x + r * 0.48},${t - 2} ${x + r * 0.48},${fy - 2} Q${x + r * 0.34},${fy + 9} ${x + r * 0.1},${fy + 2}`));
    }
    return h;
  }

  // preview/bio-vis-dedup-lot-1/render.mjs
  function character9(input = {}, options2 = {}) {
    const state = normalize9(input), m = model8(state);
    if (!isTarget(m)) return character8(input, options2);
    const instance = options2.instance || "lot1-" + state.style + "-" + state.arrangement, h = hairLayers9(m, instance);
    const face = headMarkup(m.base).replace(/<path d="[^"]*"/, `<path d="${m.outline}"`);
    const frame = options2.headOnly ? "-35 -68 230 245" : "-40 -85 240 355";
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${frame}" role="img" aria-label="${m.reference.number} \xB7 ${m.reference.name} \xB7 arrangement ${state.arrangement}">${h.defs || ""}<g data-layer="rear">${h.back}</g><g data-layer="accessories-back">${h.backAccessories || ""}</g>${bodyMarkup(m.body)}<g class="lot-head" data-reference="${state.style}" data-arrangement="${state.arrangement}">${["face", "volume", "front", "sides", "color", "texture"].map((k) => `<g data-layer="${k}">${k === "face" ? face : h[k] || ""}</g>`).join("")}${options2.construction ? construction(m) : ""}</g><g data-layer="accessories-cover">${h.cover || ""}</g><g data-layer="lengths">${h.lengths || ""}</g><g data-layer="accessories">${h.accessories || ""}</g></svg>`;
  }

  // preview/bio-vis-dedup-lot-3/hair.mjs
  var targets2 = Object.freeze(["p5-038:G", "p5-048:G", "p5-071:G", "p5-019:D", "p5-021:D", "p5-056:D", "p5-061:D", "p5-029:G", "p5-034:G", "p5-051:G"]);
  var isTarget2 = (state) => targets2.includes(state.style + ":" + state.arrangement);
  function hairLayers10(m, instance = "lot3") {
    const prior = hairLayers9(m, instance);
    if (!isTarget2(m.state)) return prior;
    const h = { ...prior }, f = m.fit, { cx: x, cy: y, rx: r, ry: rh, top: t, forehead: fy, frontWidth: fw, temple: tw, side: s, end } = f;
    const n2 = m.reference.number, brow = m.base.anchors.browLeft[1], low = Math.min(fy + 8, brow - 8);
    const draw2 = (d) => `<path d="${d}" fill="${m.cut.color}" stroke="${m.cut.contour}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
    const line = (d, w = 1.2) => `<path d="${d}" fill="none" stroke="${m.cut.contour}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const feature = (name, markup) => `<g data-feature="${name}" data-anchor-reference="${m.hairAnchors.frontRight}">${markup}</g>`;
    h.volume = coverageCap(m);
    h.front = "";
    h.texture = "";
    if (n2 === 38) {
      h.front = feature("soft-directed-returns", draw2(`M${x + tw + 1},${fy + 1} C${x + r + 6},${t + 7} ${x + r * 0.52},${t - 8} ${x + r * 0.02},${t - 7} Q${x + r * 0.33},${t + 1} ${x + r * 0.1},${t + 5} C${x - r * 0.13},${t - 9} ${x - r * 0.77},${t - 6} ${x - r * 1.13},${t - 10} Q${x - r * 1.15},${t + 3} ${x - r * 0.6},${t + 7} Q${x - r * 0.91},${t + 12} ${x - r * 1.22},${t + 8} Q${x - r * 1.2},${t + 23} ${x - r * 0.72},${t + 24} Q${x - r * 0.93},${fy - 1} ${x - r * 1.18},${fy - 4} Q${x - r * 0.98},${low + 3} ${x - fw * 0.64},${low - 1} C${x - fw * 0.28},${low - 4} ${x - fw * 0.09},${fy - 13} ${x + fw * 0.22},${fy - 9} Q${x + tw * 0.8},${fy - 5} ${x + tw + 1},${fy + 1}Z`));
      h.texture = feature("soft-return-flow", line(`M${x + fw * 0.22},${fy - 7} C${x + r * 0.03},${t + 4} ${x - r * 0.39},${t + 3} ${x - r * 0.87},${t - 3} M${x + fw * 0.15},${fy - 7} Q${x - r * 0.29},${t + 14} ${x - r * 0.96},${t + 16} M${x + fw * 0.22},${fy - 7} Q${x + r * 0.55},${t + 4} ${x + r * 0.14},${t - 3}`));
    } else if (n2 === 48) {
      const pts = [[-1.04, 25], [-1.32, 12], [-1.02, 13], [-1.2, -3], [-0.76, 3], [-0.83, -20], [-0.32, -5], [-0.15, -25], [0.2, -7], [0.62, -18], [0.64, -1], [1.12, -5], [0.99, 12], [1.27, 17], [1.02, 27]];
      let d = "M" + pts.map(([u, v]) => [x + (r + 1) * u, t + v]).join(" L");
      for (const [u, v] of [[1, 0], [0.65, 3], [0.41, -2], [0.12, 4], [-0.12, -1], [-0.5, 4], [-0.72, 0], [-1, 2]]) d += ` L${x + fw * 0.92 * u},${Math.min(fy + v, low)}`;
      h.front = feature("radial-large-tips", draw2(d + "Z"));
      h.texture = feature("radial-tip-flow", line(`M${x - fw * 0.45},${fy - 5} Q${x - r * 0.38},${t + 7} ${x - r * 0.68},${t - 9} M${x},${fy - 7} Q${x + r * 0.01},${t + 4} ${x - r * 0.08},${t - 15} M${x + fw * 0.45},${fy - 5} Q${x + r * 0.46},${t + 8} ${x + r * 0.91},${t + 2}`));
    } else if (n2 === 71) {
      h.sides = "";
      h.lengths = "";
      const eye = m.base.anchors.eyeLeft, inner = Math.min(x - f.cheek + 2, eye[0] - 8), outer = x - s - 8;
      h.front = feature("oblique-covering-sheet", draw2(`M${x + r * 0.68},${t + 6} C${x + r * 0.17},${t - 9} ${x - r * 0.59},${t - 6} ${x - r * 1.1},${t + 2} Q${x - r * 0.72},${t + 5} ${x - r * 0.48},${t + 3} Q${outer - 4},${fy - 8} ${outer},${y + rh * 0.16} C${outer - 1},${y + rh * 0.47} ${outer + 5},${end - 8} ${x - f.lower - 2},${end + 4} Q${inner - 3},${y + rh * 0.37} ${inner},${eye[1] - 7} C${inner + 2},${low + 3} ${x - fw * 0.24},${fy - 10} ${x + fw * 0.27},${fy - 12} Q${x + tw * 0.92},${fy - 6} ${x + tw},${fy + 1} Q${x + r + 4},${t + 15} ${x + r * 0.68},${t + 6}Z`));
      h.texture = feature("sheet-two-origins", line(`M${x + r * 0.5},${t + 8} C${x - r * 0.11},${t - 1} ${outer + 4},${fy + 2} ${outer + 5},${y + rh * 0.25} Q${outer + 6},${end - 6} ${x - f.lower - 3},${end - 2} M${x + r * 0.33},${t + 10} C${x - r * 0.25},${t + 8} ${inner - 4},${fy + 2} ${inner - 5},${eye[1] - 6}`));
    } else if (n2 === 19 || n2 === 21) {
      h.sides = "";
      const blunt = n2 === 21;
      const scalp = scalpSamples(m);
      if (!blunt) for (const arc of [scalp.slice(0, 4), scalp.slice(-4).reverse()]) {
        const outer = arc.map((p) => [p.x + 3.3 * p.nx, p.y + 3.3 * p.ny]), inner = arc.map((p) => [p.x - p.nx, p.y - p.ny]);
        const points = [[outer[0][0], outer[0][1] + 2], ...outer, ...inner.reverse(), [inner.at(-1)[0], inner.at(-1)[1] + 2]];
        h.sides += `<path data-coverage="bob-temple-join" d="M${points.join(" L")}Z" fill="${m.cut.color}" stroke="none"/>`;
      }
      for (const sign of [-1, 1]) {
        const outer = x + sign * (s + (blunt ? 4 : 10)), inner = x + sign * (f.cheek + 2), bottom = end + (blunt ? 7 : 3), root = x + sign * (tw + 1);
        h.sides += feature(blunt ? "straight-bob-panel" : "inward-bob-panel", draw2(`M${root},${fy - 6} C${outer},${fy - 8} ${outer + sign * (blunt ? 0 : 5)},${y + rh * 0.3} ${outer},${bottom - 12} ${blunt ? `L${outer},${bottom} L${x + sign * (f.lower + 4)},${bottom}` : `Q${outer + sign * 2},${bottom + 8} ${x + sign * (f.lower - 3)},${bottom - 1}`} Q${inner - sign * 2},${bottom - 7} ${inner},${y + rh * 0.25} Q${x + sign * (tw - 1)},${fy + 5} ${root},${fy - 6}Z`));
        h.texture += line(`M${root + sign * 3},${fy + 1} ${blunt ? `L${outer - sign * 4},${bottom - 4}` : `C${outer + sign * 1},${y + 5} ${outer + sign * 4},${bottom - 2} ${x + sign * (f.lower + 1)},${bottom - 4}`}`);
      }
      h.front = feature(blunt ? "long-oblique-panel" : "rounded-swept-panel", draw2(blunt ? `M${x + r * 0.65},${t + 6} C${x - r * 0.06},${t - 6} ${x - r * 0.92},${t + 2} ${x - r - 5},${fy + 1} L${x - tw - 3},${y + rh * 0.15} L${x - tw + 1},${fy + 6} Q${x - fw * 0.35},${low - 1} ${x + fw * 0.17},${fy - 15} Q${x + fw * 0.48},${fy - 15} ${x + tw},${fy + 1} Q${x + r + 4},${t + 18} ${x + r * 0.65},${t + 6}Z` : `M${x + r * 0.6},${t + 6} C${x + r * 0.08},${t - 8} ${x - r * 0.63},${t - 1} ${x - r - 4},${fy - 7} Q${x - r - 9},${fy + 5} ${x - r - 8},${fy + 1} Q${x - r * 0.91},${low + 5} ${x - fw * 0.55},${low} C${x - fw * 0.12},${fy - 9} ${x + fw * 0.12},${fy - 15} ${x + fw * 0.33},${fy - 10} Q${x + tw * 0.89},${fy - 3} ${x + tw + 1},${fy + 1} Q${x + r + 4},${t + 17} ${x + r * 0.6},${t + 6}Z`));
      h.texture += line(blunt ? `M${x + r * 0.48},${t + 9} C${x - r * 0.12},${t + 3} ${x - r * 0.84},${fy - 6} ${x - tw - 1},${fy + 10}` : `M${x + r * 0.5},${t + 9} C${x - r * 0.02},${t + 1} ${x - r * 0.64},${fy - 6} ${x - r * 0.97},${fy + 1}`);
    } else if (n2 === 56) {
      for (const sign of [-1, 1]) {
        h.front += feature("centred-bun-panel", draw2(`M${x},${t + 6} C${x + sign * r * 0.46},${t - 4} ${x + sign * (r + 8)},${fy - 13} ${x + sign * (tw + 3)},${fy + 6} L${x + sign * (tw + 1)},${y - rh * 0.03} Q${x + sign * (tw - 3)},${fy + 4} ${x + sign * fw * 0.64},${low - 1} Q${x + sign * fw * 0.33},${fy - 15} ${x},${t + 6}Z`));
        h.texture += line(`M${x + sign * 2},${t + 8} C${x + sign * r * 0.45},${t + 3} ${x + sign * (r + 3)},${fy - 8} ${x + sign * (tw + 2)},${fy + 6}`);
      }
    } else if (n2 === 61) {
      h.front = feature("broad-offset-frontal-roll", draw2(`M${x + tw + 2},${fy + 1} C${x + r + 7},${t + 1} ${x + r * 0.22},${t - 13} ${x - r * 0.36},${t - 5} C${x - r * 0.84},${t - 1} ${x - r * 1.18},${fy - 3} ${x - tw - 2},${fy + 3} Q${x - fw * 0.67},${low + 5} ${x - fw * 0.2},${low} C${x + fw * 0.24},${low - 4} ${x + fw * 0.1},${fy - 13} ${x - fw * 0.16},${fy - 12} C${x + fw * 0.3},${fy - 18} ${x + fw * 0.61},${fy - 11} ${x + tw + 2},${fy + 1}Z`));
      h.texture = feature("offset-roll-fold", line(`M${x - tw},${fy - 1} C${x - r * 0.69},${t + 7} ${x + r * 0.1},${t - 3} ${x + r * 0.3},${fy - 7} Q${x + r * 0.46},${low + 2} ${x - fw * 0.14},${low - 3} M${x + r * 0.38},${t + 5} Q${x + r * 0.8},${t + 12} ${x + tw},${fy - 1}`));
    } else if (n2 === 29) {
      h.front = feature("low-rolled-lift", draw2(`M${x - tw - 3},${fy + 1} C${x - r - 16},${fy - 7} ${x - r - 7},${t - 9} ${x - r * 0.46},${t - 8} C${x - r * 0.18},${t - 23} ${x + r * 0.48},${t - 22} ${x + r * 0.61},${t - 8} C${x + r + 13},${t - 9} ${x + r + 15},${fy - 5} ${x + tw + 3},${fy + 1} Q${x},${fy - 8} ${x - tw - 3},${fy + 1}Z`));
      h.texture = feature("rounded-lift-folds", line(`M${x - 1},${fy - 8} C${x - r * 0.54},${fy - 13} ${x - r * 0.9},${t + 2} ${x - r * 0.56},${t - 5} M${x + 2},${fy - 8} C${x + r * 0.17},${t + 3} ${x - r * 0.05},${t - 10} ${x - r * 0.25},${t - 13} M${x + 5},${fy - 8} C${x + r * 0.72},${fy - 15} ${x + r * 0.82},${t + 4} ${x + r * 0.58},${t - 4}`));
    } else if (n2 === 34) {
      h.front = feature("tilted-high-wave", draw2(`M${x - tw - 3},${fy + 1} Q${x - r - 16},${fy - 4} ${x - r - 6},${t + 7} Q${x - r - 18},${t + 6} ${x - r - 13},${t - 9} Q${x - r - 2},${t + 2} ${x - r * 0.56},${t - 5} Q${x - r * 1.06},${t - 11} ${x - r * 0.89},${t - 28} C${x - r * 0.73},${t - 17} ${x - r * 0.25},${t - 29} ${x + r * 0.19},${t - 22} C${x + r * 0.72},${t - 23} ${x + r * 0.91},${t - 8} ${x + r * 0.8},${t - 1} C${x + r + 13},${t + 1} ${x + r + 13},${fy - 5} ${x + tw + 2},${fy + 1} Q${x},${fy - 7} ${x - tw - 3},${fy + 1}Z`));
      h.texture = feature("tilted-wave-flow", line(`M${x + fw * 0.25},${fy - 8} C${x + r * 0.59},${t + 4} ${x + r * 0.26},${t - 22} ${x - r * 0.64},${t - 20} M${x + fw * 0.2},${fy - 8} C${x - r * 0.15},${t - 2} ${x - r * 0.74},${t + 5} ${x - r * 0.95},${t - 2} M${x + fw * 0.28},${fy - 8} Q${x + r * 0.8},${fy - 16} ${x + r * 0.88},${t + 6}`));
    } else if (n2 === 51) {
      h.front = feature("three-open-rolls", draw2(`M${x - tw - 4},${fy + 1} Q${x - r - 18},${fy - 1} ${x - r - 11},${fy - 13} Q${x - r - 23},${t + 3} ${x - r - 14},${t - 15} C${x - r - 15},${t - 2} ${x - r * 0.56},${t + 2} ${x - r * 0.48},${t - 9} C${x - r * 0.86},${t - 23} ${x - r * 0.55},${t - 33} ${x - r * 0.34},${t - 38} Q${x - r * 0.55},${t - 18} ${x - r * 0.06},${t - 12} C${x - r * 0.19},${t - 36} ${x + r * 0.16},${t - 47} ${x + r * 0.49},${t - 40} C${x + r * 0.13},${t - 42} ${x + r * 0.14},${t - 26} ${x + r * 0.47},${t - 15} C${x + r * 0.52},${t - 33} ${x + r + 16},${t - 29} ${x + r + 14},${t - 11} Q${x + r + 6},${t - 22} ${x + r * 0.8},${t - 9} Q${x + r + 11},${fy - 5} ${x + tw + 2},${fy + 1} Q${x},${fy - 7} ${x - tw - 4},${fy + 1}Z`));
      h.texture = feature("open-roll-directions", line(`M${x - r * 0.2},${fy - 8} C${x - r * 0.6},${t + 1} ${x - r * 1.02},${t - 2} ${x - r - 12},${t - 8} M${x},${fy - 9} C${x - r * 0.38},${t - 4} ${x - r * 0.58},${t - 22} ${x - r * 0.38},${t - 29} M${x + r * 0.13},${fy - 9} C${x - r * 0.08},${t - 2} ${x + r * 0.04},${t - 28} ${x + r * 0.32},${t - 36} M${x + r * 0.26},${fy - 8} C${x + r * 0.6},${t + 1} ${x + r * 0.69},${t - 20} ${x + r + 9},${t - 16}`));
    }
    return h;
  }

  // preview/bio-vis-dedup-lot-3/render.mjs
  function character10(input = {}, options2 = {}) {
    const state = normalize9(input);
    if (!isTarget2(state)) return character9(input, options2);
    const m = model8(state), h = hairLayers10(m, options2.instance || "lot3-" + state.style + "-" + state.arrangement);
    const face = headMarkup(m.base).replace(/<path d="[^"]*"/, `<path d="${m.outline}"`);
    const frame = character9(input, options2).match(/viewBox="([^"]*)"/)[1];
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${frame}" role="img" aria-label="${m.reference.number} \xB7 ${m.reference.name} \xB7 arrangement ${state.arrangement}">${h.defs || ""}<g data-layer="rear">${h.back || ""}</g><g data-layer="accessories-back">${h.backAccessories || ""}</g>${bodyMarkup(m.body)}<g class="lot-head" data-reference="${state.style}" data-arrangement="${state.arrangement}">${["face", "volume", "front", "sides", "color", "texture"].map((k) => `<g data-layer="${k}">${k === "face" ? face : h[k] || ""}</g>`).join("")}${options2.construction ? construction(m) : ""}</g><g data-layer="accessories-cover">${h.cover || ""}</g><g data-layer="lengths">${h.lengths || ""}</g><g data-layer="accessories">${h.accessories || ""}</g></svg>`;
  }

  // bio-col-01/paint.mjs
  var hair = /* @__PURE__ */ new Set(["rear", "back", "volume", "front", "sides", "texture", "lengths"]);
  var shapes = /* @__PURE__ */ new Set(["path", "circle", "ellipse", "rect", "line", "polyline", "polygon"]);
  var attrs = (s) => Object.fromEntries([...s.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
  function protectedTies(input) {
    if (!["pony", "braids", "side_braid"].includes(input.style)) return /* @__PURE__ */ new Set();
    const h = layers(input), width = input.style === "pony" ? "4" : "3.3", source = input.style === "pony" ? h.back : h.lengths;
    return new Set([...source.matchAll(/<path\b[^>]*\/>/g)].map((m) => m[0]).filter((tag) => attrs(tag)["stroke-width"] === width));
  }
  function paint(svg2, input, colour2) {
    const ties = protectedTies(input), stack = [];
    return svg2.replace(/<\/?[\w:-]+\b[^>]*>/g, (tag) => {
      if (tag.startsWith("</")) {
        stack.pop();
        return tag;
      }
      const name = tag.match(/^<([\w:-]+)/)[1], a = attrs(tag), parent = stack.at(-1), layer = a["data-layer"] || parent?.layer;
      const blocked = parent?.blocked || ["defs", "clipPath", "mask", "pattern", "filter", "marker"].includes(name);
      if (!tag.endsWith("/>")) stack.push({ layer, blocked });
      if (blocked || !hair.has(layer) || !shapes.has(name) || ties.has(tag)) return tag;
      return tag.replace(/(\s)(fill|stroke)="([^"]*)"/g, (match, space, key, value) => value === "none" || value === "transparent" ? match : `${space}${key}="${key === "fill" ? colour2.fill : colour2.stroke}"`);
    });
  }

  // bio-col-01/render.mjs
  function character11(input = {}, options2 = {}) {
    const colour2 = options2.hairColor;
    if (colour2 === void 0 || colour2 === null || colour2 === "historical") return character10(input, options2);
    const p = swatch(colour2);
    return paint(character10(input, options2), input, p);
  }

  // bio-yeux-01/bezier.mjs
  function outlineCurves(path5) {
    const points = [...path5.matchAll(/(-?[\d.eE+-]+),(-?[\d.eE+-]+)/g)].map(([, x, y]) => [Number(x), Number(y)]);
    if (!/^M[^C]+(?:C[^CZ]+)+Z$/.test(path5) || points.length % 3 !== 1) {
      throw new Error("Contour facial h\xE9rit\xE9 incompatible");
    }
    const curves = [];
    for (let i = 0; i < points.length - 1; i += 3) curves.push(points.slice(i, i + 4));
    return curves;
  }
  function coordinateAt(curve, t, axis7) {
    const u = 1 - t;
    return u ** 3 * curve[0][axis7] + 3 * u * u * t * curve[1][axis7] + 3 * u * t * t * curve[2][axis7] + t ** 3 * curve[3][axis7];
  }
  function pointAt(curve, t) {
    return [coordinateAt(curve, t, 0), coordinateAt(curve, t, 1)];
  }
  function extrema(curve, axis7) {
    const [p0, p1, p2, p3] = curve.map((point3) => point3[axis7]);
    const c = p1 - p0;
    const b = 2 * (p2 - 2 * p1 + p0);
    const a = p3 - 3 * p2 + 3 * p1 - p0;
    const discriminant = b * b - 4 * a * c;
    const roots = Math.abs(a) < 1e-9 ? Math.abs(b) < 1e-9 ? [] : [-c / b] : discriminant < 0 ? [] : [(-b - Math.sqrt(discriminant)) / (2 * a), (-b + Math.sqrt(discriminant)) / (2 * a)];
    return roots.filter((t) => t > 0 && t < 1).sort((a2, b2) => a2 - b2);
  }
  function bounds2(curves, padding = 0) {
    return [0, 1].map((axis7) => {
      const values = curves.flatMap((curve) => [0, 1, ...extrema(curve, axis7)].map((t) => pointAt(curve, t)[axis7]));
      return [Math.min(...values) - padding, Math.max(...values) + padding];
    });
  }
  function horizontalRoots(curve, y) {
    const stops = [0, ...extrema(curve, 1), 1];
    const roots = [];
    for (let i = 1; i < stops.length; i++) {
      let lo = stops[i - 1], hi = stops[i];
      const y0 = coordinateAt(curve, lo, 1), y1 = coordinateAt(curve, hi, 1);
      if (y < Math.min(y0, y1) || y > Math.max(y0, y1)) continue;
      if (y === y0) {
        roots.push(lo);
        continue;
      }
      if (y === y1) {
        roots.push(hi);
        continue;
      }
      for (let j = 0; j < 35; j++) {
        const mid = (lo + hi) / 2;
        if (coordinateAt(curve, mid, 1) < y === y0 < y1) lo = mid;
        else hi = mid;
      }
      roots.push((lo + hi) / 2);
    }
    return roots;
  }
  function stripX(curves, top, bottom = top) {
    return curves.flatMap((curve) => {
      const crossings = horizontalRoots(curve, top);
      if (bottom === top) return crossings.map((t) => pointAt(curve, t)[0]);
      const internal = [0, 1, ...extrema(curve, 0)].filter((t) => {
        const y = pointAt(curve, t)[1];
        return y >= top && y <= bottom;
      });
      return [...crossings, ...horizontalRoots(curve, bottom), ...internal].map((t) => pointAt(curve, t)[0]);
    });
  }

  // bio-yeux-01/eyes.mjs
  var eyeControls = Object.freeze({
    width: Object.freeze({ label: "Largeur", min: 75, max: 120, neutral: 100, unit: "%" }),
    height: Object.freeze({ label: "Hauteur d\u2019ouverture", min: 40, max: 130, neutral: 100, unit: "%" }),
    upper: Object.freeze({ label: "Courbure sup\xE9rieure", min: 50, max: 150, neutral: 100, unit: "%" }),
    lower: Object.freeze({ label: "Courbure inf\xE9rieure", min: 30, max: 140, neutral: 100, unit: "%" }),
    tilt: Object.freeze({ label: "Inclinaison", min: -12, max: 12, neutral: 0, unit: "\xB0" }),
    taper: Object.freeze({ label: "Effilement des coins", min: 0, max: 100, neutral: 48, unit: "%" }),
    upperPeak: Object.freeze({ label: "D\xE9calage du sommet sup\xE9rieur", min: -20, max: 20, neutral: 0, unit: "%" }),
    lowerPeak: Object.freeze({ label: "D\xE9calage du sommet inf\xE9rieur", min: -20, max: 20, neutral: 0, unit: "%" })
  });
  var keys = Object.keys(eyeControls);
  var presets3 = [
    ["round", "Rond", [86, 110, 124, 135, 0, 3, 0, 0]],
    ["oval", "Ovale", [117, 74, 100, 119, 0, 20, 0, 0]],
    ["almond", "Amande", [108, 91, 115, 110, 0, 100, 0, -3]],
    ["narrow", "\xC9troit", [111, 40, 90, 74, 0, 62, 0, 0]],
    ["upturned", "Relev\xE9", [105, 81, 108, 104, 12, 80, 9, 3]],
    ["downturned", "Tombant", [104, 79, 116, 103, -12, 76, -8, -4]],
    ["heavy", "Paupi\xE8re lourde", [105, 83, 50, 140, 0, 55, -4, 2]],
    ["crescent", "Demi-lune", [109, 88, 150, 30, 0, 81, 0, -3]]
  ];
  var eyePresets = Object.freeze(Object.fromEntries(presets3.map(([key, label, values]) => [
    key,
    Object.freeze({ label, values: Object.freeze(Object.fromEntries(keys.map((name, i) => [name, values[i]]))) })
  ])));
  var eyeStroke = 0.8;
  function normalizeEyes(value) {
    if (value == null || value === "historical") return null;
    if (typeof value === "string") {
      if (!Object.hasOwn(eyePresets, value)) throw new RangeError("Forme d\u2019yeux inconnue : " + value);
      return eyePresets[value].values;
    }
    return Object.fromEntries(Object.entries(eyeControls).map(([key, { min, max, neutral: neutral2 }]) => [
      key,
      Number.isFinite(value[key]) ? Math.min(max, Math.max(min, value[key])) : neutral2
    ]));
  }
  function faceEnvelope(input) {
    const face = model8(input);
    const { head, anchors } = face.base;
    const [cx, y] = [head.cx, anchors.eyeLeft[1]];
    const outline3 = outlineCurves(face.outline);
    const [, [faceTop, faceBottom]] = bounds2(outline3);
    const section = stripX(outline3, y);
    const faceWidth = Math.max(...section) - Math.min(...section);
    const faceHeight = faceBottom - faceTop;
    const maxWidth = faceWidth * 0.25;
    const maxHeight = faceHeight * 0.12;
    const top = Math.max(y - maxHeight, anchors.browLeft[1] + 1.6);
    const bottom = Math.min(y + maxHeight, anchors.mouth[1] - 2.25);
    const edges = stripX(outline3, top, bottom);
    const left = Math.max(...edges.filter((x) => x < cx)) + 2.35;
    const right = Math.min(...edges.filter((x) => x > cx)) - 2.35;
    const envelopes2 = [anchors.eyeLeft, anchors.eyeRight].map(([x, y2], i) => ({
      x,
      y: y2,
      side: i ? 1 : -1,
      top,
      bottom,
      left: i ? cx + 0.3 : left,
      right: i ? right : cx - 0.3
    }));
    const nose = { left: anchors.nose[0] - 4.25, right: anchors.nose[0] + 4.25, top: anchors.nose[1] - 5.25 };
    const reference = { width: 2 * (head.rx * 0.26), height: 2 * (head.ry * 0.135) };
    return {
      faceWidth,
      faceHeight,
      maxWidth,
      maxHeight,
      nose,
      envelopes: envelopes2,
      reference,
      historicalExcess: {
        width: Math.max(0, reference.width - maxWidth),
        height: Math.max(0, reference.height - maxHeight),
        ratio: Math.max(0, reference.height / reference.width - 0.85)
      }
    };
  }
  function lid(halfWidth, height, peak, curvature, taper) {
    const leftSpan = peak + halfWidth, rightSpan = halfWidth - peak;
    const cornerX = 0.28 * taper;
    const cornerY = height * (0.72 - 0.55 * taper);
    const shoulder = 0.22 + 0.25 * (curvature / 150);
    return [
      [[-halfWidth, 0], [-halfWidth + leftSpan * cornerX, cornerY], [peak - leftSpan * shoulder, height], [peak, height]],
      [[peak, height], [peak + rightSpan * shoulder, height], [halfWidth - rightSpan * cornerX, cornerY], [halfWidth, 0]]
    ];
  }
  function makeShape(eye, reference, values) {
    const width = reference.width * values.width / 100;
    const height = reference.height * values.height / 100;
    const upperShare = 0.56 * values.upper / (0.56 * values.upper + 0.44 * values.lower);
    const upper = lid(width / 2, -height * upperShare, width * values.upperPeak / 100, values.upper, values.taper / 100);
    const lower = lid(width / 2, height * (1 - upperShare), width * values.lowerPeak / 100, values.lower, values.taper / 100);
    const angle2 = values.tilt * Math.PI / 180, cos = Math.cos(angle2), sin = Math.sin(angle2);
    const closed = [...upper, ...lower.reverse().map((curve) => [...curve].reverse())];
    const curves = closed.map((curve) => curve.map(([x, y]) => [
      eye.x + eye.side * (x * cos + y * sin),
      eye.y - x * sin + y * cos
    ]));
    return { curves, bounds: bounds2(curves, eyeStroke / 2) };
  }
  function fits(shape, eye, face) {
    const [[left, right], [top, bottom]] = shape.bounds;
    const width = right - left, height = bottom - top;
    return width <= face.maxWidth && height <= face.maxHeight && height <= 0.85 * width && left >= eye.left && right <= eye.right && top >= eye.top && bottom <= eye.bottom && (bottom <= face.nose.top || right <= face.nose.left || left >= face.nose.right);
  }
  function acceptsEyes(face, values) {
    return face.envelopes.every((eye) => fits(makeShape(eye, face.reference, values), eye, face));
  }
  function pathOf(curves) {
    return "M" + curves[0][0].join(",") + curves.map((curve) => " C" + curve.slice(1).map((point3) => point3.join(",")).join(" ")).join("") + "Z";
  }
  function solveEyes(face, requested) {
    if (!requested) return { face, requested, effective: null, corrected: [], shapes: [] };
    const tryFit = (values) => {
      const shapes3 = face.envelopes.map((eye) => makeShape(eye, face.reference, values));
      return shapes3.every((shape, i) => fits(shape, face.envelopes[i], face)) ? shapes3 : null;
    };
    let effective = requested, shapes2 = tryFit(requested);
    if (!shapes2) {
      const minimum = { ...requested, width: eyeControls.width.min, height: eyeControls.height.min };
      const largestFit = (start, key, target) => {
        let lo = 0, hi = 1, best = start;
        if (start[key] === target) return start;
        const full = { ...start, [key]: target };
        if (tryFit(full)) return full;
        for (let i = 0; i < 20; i++) {
          const amount = (lo + hi) / 2;
          const candidate = { ...start, [key]: start[key] + (target - start[key]) * amount };
          if (tryFit(candidate)) {
            lo = amount;
            best = candidate;
          } else hi = amount;
        }
        return best;
      };
      const fullWidth = { ...minimum, width: requested.width };
      if (tryFit(fullWidth)) effective = fullWidth;
      else if (tryFit(minimum)) effective = largestFit(minimum, "width", requested.width);
      else {
        const level = { ...minimum, tilt: 0 };
        if (!tryFit(level)) throw new Error("Enveloppe faciale trop petite pour l\u2019ouverture minimale");
        const inclined = largestFit(level, "tilt", requested.tilt);
        effective = largestFit(inclined, "width", requested.width);
      }
      effective = largestFit(effective, "height", requested.height);
      shapes2 = tryFit(effective);
    }
    return {
      face,
      requested,
      effective,
      corrected: keys.filter((key) => effective[key] !== requested[key]),
      shapes: shapes2.map((shape) => ({ ...shape, path: pathOf(shape.curves) }))
    };
  }
  function eyesFor(input, value) {
    return solveEyes(faceEnvelope(input), normalizeEyes(value));
  }
  function randomEyes(input, seed) {
    let state = 2166136261;
    for (const character13 of String(seed)) state = Math.imul(state ^ character13.codePointAt(0), 16777619);
    const face = faceEnvelope(input);
    let sample;
    for (let attempt = 0; attempt < 128; attempt++) {
      sample = Object.fromEntries(Object.entries(eyeControls).map(([key, { min, max }]) => {
        state = Math.imul(1664525, state) + 1013904223 >>> 0;
        return [key, min + Math.floor(state / 2 ** 32 * (max - min + 1))];
      }));
      if (acceptsEyes(face, sample)) return sample;
    }
    return { ...sample, width: eyeControls.width.min, height: eyeControls.height.min, tilt: 0 };
  }

  // bio-yeux-01/draw.mjs
  var legacyDraw = "lcg-v1";
  var currentDraw = "xoshiro128ss-rejet-v2";
  var budget = 8192;
  var axes3 = Object.entries(eyeControls);
  var uint32 = 2 ** 32;
  function generator(seed) {
    let h = 1779033703 ^ seed.length;
    for (let i = 0; i < seed.length; i++) {
      h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
      h = h << 13 | h >>> 19;
    }
    const word = () => {
      h = Math.imul(h ^ h >>> 16, 2246822507);
      h = Math.imul(h ^ h >>> 13, 3266489909);
      return (h ^= h >>> 16) >>> 0;
    };
    let a = word(), b = word(), c = word(), d = word();
    if (!(a | b | c | d)) d = 1;
    return () => {
      const product = Math.imul(b, 5), t = b << 9;
      const result = Math.imul(product << 7 | product >>> 25, 9) >>> 0;
      c ^= a;
      d ^= b;
      b ^= c;
      a ^= d;
      c ^= t;
      d = d << 11 | d >>> 21;
      return result;
    };
  }
  function integer(next, span2) {
    const limit = uint32 - uint32 % span2;
    for (let attempt = 0; attempt < 32; attempt++) {
      const value = next();
      if (value < limit) return value % span2;
    }
    throw new Error("Budget de conversion du tirage d\xE9pass\xE9. Essayez une autre graine.");
  }
  function seededIndex(seed) {
    const next = generator(seed);
    return (span2) => integer(next, span2);
  }
  function drawEyes(input, seed, version = currentDraw) {
    if (typeof seed !== "string") throw new TypeError("Graine textuelle requise.");
    if (version === legacyDraw) return { values: randomEyes(input, seed), attempts: null };
    if (version !== currentDraw) throw new RangeError("Version de tirage inconnue.");
    const face = faceEnvelope(input);
    const next = generator(seed);
    for (let attempts = 1; attempts <= budget; attempts++) {
      const values = Object.fromEntries(axes3.map(([key, { min, max }]) => [
        key,
        min + integer(next, max - min + 1)
      ]));
      if (acceptsEyes(face, values)) return { values, attempts };
    }
    throw new Error("Aucun tuple admissible trouv\xE9 apr\xE8s 8 192 propositions. Essayez une autre graine.");
  }

  // bio-yeux-01/iris.mjs
  var referenceRadius = Math.sqrt(1.9 * 2.2);
  var irisDrawVersion = "iris-xoshiro128ss-v1";
  var irisControls = Object.freeze({
    irisSize: Object.freeze({ label: "Taille de l\u2019iris", min: 60, max: 140, step: 1, neutral: 100, unit: "%" }),
    irisRatio: Object.freeze({ label: "Rapport largeur/hauteur", min: 0.75, max: 1.25, step: 0.01, neutral: 1, unit: "" }),
    pupilSize: Object.freeze({ label: "Taille de la pupille", min: 15, max: 80, step: 1, neutral: 45, unit: "%" }),
    outline: Object.freeze({ label: "Contour de l\u2019iris", min: 0, max: 10, step: 1, neutral: 5, unit: "%" }),
    secondarySize: Object.freeze({ label: "Zone secondaire", min: 0, max: 80, step: 1, neutral: 50, unit: "%" })
  });
  var pupilShapes = Object.freeze({
    circle: "Circulaire",
    vertical: "Fente verticale",
    horizontal: "Fente horizontale",
    diamond: "Losange",
    star: "\xC9toile \xE0 cinq branches",
    ring: "Anneau"
  });
  var heterochromias = Object.freeze({ none: "Aucune", complete: "Compl\xE8te", central: "Centrale" });
  var swatches = [
    ["brun-sombre", "Brun sombre", "#4c3226"],
    ["marron", "Marron", "#82532f"],
    ["noisette", "Noisette", "#9b864a"],
    ["ambre", "Ambre", "#c18b36"],
    ["vert", "Vert", "#748b58"],
    ["gris", "Gris", "#929da4"],
    ["bleu", "Bleu", "#638cae"],
    ["bleu-clair", "Bleu clair", "#a2c9df"],
    ["rouge", "Rouge", "#b73943"],
    ["rose", "Rose", "#df83b1"],
    ["violet", "Violet", "#9668bc"],
    ["turquoise", "Turquoise", "#40b9b5"],
    ["or", "Or", "#e8bb39"],
    ["argent", "Argent", "#d5dbe0"],
    ["orange", "Orange", "#ed873c"],
    ["blanc", "Blanc", "#f4f2e9"]
  ];
  var irisPalette = Object.freeze(swatches.map(([id, label, fill], i) => Object.freeze({ id, label, fill, outline: contour(fill), family: i < 8 ? "natural" : "fantasy" })));
  var colours = Object.fromEntries(irisPalette.map((colour2) => [colour2.id, colour2]));
  var axes4 = Object.entries(irisControls);
  var grid = ({ min, max, step }) => Array.from(
    { length: Math.round((max - min) / step) + 1 },
    (_, i) => +(min + i * step).toFixed(2)
  );
  var grids = Object.fromEntries(axes4.map(([key, control]) => [key, grid(control)]));
  function normalizeIris(value) {
    if (value == null || value === "historical") return null;
    if (typeof value !== "object" || Array.isArray(value)) throw new TypeError("R\xE9glages d\u2019iris invalides.");
    const numeric = Object.fromEntries(axes4.map(([key, { min, max, neutral: neutral2 }]) => [
      key,
      Number.isFinite(value[key]) ? Math.min(max, Math.max(min, value[key])) : neutral2
    ]));
    const presets4 = { pupilShape: pupilShapes, heterochromia: heterochromias, primary: colours, secondary: colours };
    const defaults3 = { pupilShape: "circle", heterochromia: "none", primary: "noisette", secondary: "bleu" };
    for (const [key, values] of Object.entries(presets4)) {
      if (value[key] === void 0) continue;
      if (!Object.hasOwn(values, value[key])) throw new RangeError("Choix d\u2019iris inconnu \xB7 " + key);
      defaults3[key] = value[key];
    }
    return { ...numeric, ...defaults3 };
  }
  function pigmentCenters(opening) {
    return opening.face.envelopes.map(({ x, y, side }) => ({ x: x + side * 0.5, y: y + 0.3, side }));
  }
  function insidePolygon(points, x, y) {
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const [ax, ay] = points[i], [bx, by] = points[j];
      if (ay > y !== by > y && x < (bx - ax) * (y - ay) / (by - ay) + ax) inside = !inside;
    }
    return inside;
  }
  function irisAperture(opening) {
    const polygon3 = opening.shapes[0]?.curves.flatMap((curve) => Array.from({ length: 20 }, (_, i) => pointAt(curve, i / 20)));
    const [center] = pigmentCenters(opening);
    const { width, height } = opening.face.reference;
    return {
      // Samples classify usefulness. The renderer uses the original cubic or
      // ellipse as its real clip, including between the sampled points.
      visible(dx, dy) {
        const x = center.x - dx, y = center.y + dy;
        if (polygon3) return insidePolygon(polygon3, x, y);
        const a = opening.face.envelopes[0];
        return ((x - a.x) / (width / 2)) ** 2 + ((y - a.y) / (height / 2)) ** 2 < 1;
      }
    };
  }
  var ringHole = 0.56;
  var slitWidth = 0.27;
  var diamondWidth = 0.8;
  var star = Array.from({ length: 10 }, (_, i) => {
    const angle2 = -Math.PI / 2 + i * Math.PI / 5, radius = i % 2 ? 0.45 : 1;
    return [radius * Math.cos(angle2), radius * Math.sin(angle2)];
  });
  var angles = Array.from({ length: 72 }, (_, i) => [Math.cos(i * Math.PI / 36), Math.sin(i * Math.PI / 36)]);
  function pupilContains(shape, x, y, r) {
    const u = x / r, v = y / r, squared = u * u + v * v;
    switch (shape) {
      case "circle":
        return squared <= 1;
      case "vertical":
        return (u / slitWidth) ** 2 + v * v <= 1;
      case "horizontal":
        return u * u + (v / slitWidth) ** 2 <= 1;
      case "diamond":
        return Math.abs(u) / diamondWidth + Math.abs(v) <= 1;
      case "star":
        return insidePolygon(star, u, v);
      case "ring":
        return squared <= 1 && squared >= ringHole ** 2;
    }
  }
  function minorFactor(ratio) {
    const scale = Math.sqrt(ratio);
    return Math.min(scale, 1 / scale);
  }
  function fitsPupil(ratio, outline3, size) {
    return (outline3 + size) / 100 <= minorFactor(ratio) + 1e-12;
  }
  function irisGeometry(values) {
    const radius = referenceRadius * values.irisSize / 100;
    const stretch = Math.sqrt(values.irisRatio);
    const rx = radius * stretch, ry = radius / stretch, outline3 = radius * values.outline / 100;
    return {
      radius,
      rx,
      ry,
      innerRx: rx - outline3,
      innerRy: ry - outline3,
      pupil: radius * values.pupilSize / 100,
      highlightX: 0.51 * rx,
      highlightY: -0.5 * ry,
      highlightRadius: 0.106 * radius
    };
  }
  function visibleBand(aperture, values, geometry2, end) {
    const { rx, ry, pupil, highlightX, highlightY, highlightRadius } = geometry2;
    for (const level of [end - 0.2, end - 0.65]) {
      if (level <= 0) continue;
      for (const [cos, sin] of angles) {
        const x = rx * level / 100 * cos, y = ry * level / 100 * sin;
        if (!pupilContains(values.pupilShape, x, y, pupil) && (x - highlightX) ** 2 + (y - highlightY) ** 2 > highlightRadius ** 2 && aperture.visible(x, y)) return true;
      }
    }
    return false;
  }
  function visibleSteps(aperture, values, geometry2) {
    return grids.secondarySize.filter((s) => s === 0 || visibleBand(aperture, values, geometry2, s));
  }
  function solveIris(opening, value, withDomains = false) {
    const requested = normalizeIris(value);
    if (!requested) return null;
    const effective = { ...requested };
    const limit = Math.min(80, 100 * minorFactor(requested.irisRatio) - requested.outline);
    effective.pupilSize = Math.min(requested.pupilSize, limit);
    if (effective.primary === effective.secondary) effective.heterochromia = "none";
    const geometry2 = irisGeometry(effective);
    let secondaryDomain = [0];
    if (effective.heterochromia === "central") {
      const aperture = irisAperture(opening);
      secondaryDomain = visibleSteps(aperture, effective, geometry2);
      if (!secondaryDomain.includes(effective.secondarySize) && !(effective.secondarySize % 1 && visibleBand(aperture, effective, geometry2, effective.secondarySize))) {
        effective.secondarySize = secondaryDomain.filter((size) => size <= requested.secondarySize).at(-1);
      }
    } else effective.secondarySize = 0;
    if (effective.heterochromia === "central" && effective.secondarySize === 0) effective.heterochromia = "none";
    if (effective.heterochromia === "none") effective.secondary = effective.primary;
    const domains = withDomains ? {
      irisSize: grids.irisSize,
      irisRatio: grids.irisRatio.filter((ratio) => fitsPupil(ratio, effective.outline, effective.pupilSize)),
      outline: grids.outline.filter((outline3) => fitsPupil(effective.irisRatio, outline3, effective.pupilSize)),
      pupilSize: grids.pupilSize.filter((size) => fitsPupil(effective.irisRatio, effective.outline, size)),
      secondarySize: secondaryDomain
    } : null;
    return { requested, effective, geometry: geometry2, domains };
  }
  function irisFor(input, eyes2, iris, withDomains = false) {
    return solveIris(eyesFor(input, eyes2), iris, withDomains);
  }
  function intervalsOf(points, step) {
    const intervals = [];
    for (const value of points) {
      const last = intervals.at(-1);
      if (last && Math.abs(last[1] + step - value) < 1e-8) last[1] = value;
      else intervals.push([value, value]);
    }
    return intervals;
  }
  function drawIris(input, eyes2, seed) {
    if (typeof seed !== "string") throw new TypeError("Graine textuelle requise.");
    const next = seededIndex(irisDrawVersion + "\0" + seed);
    const choose = (values) => values[next(values.length)];
    const opening = eyesFor(input, eyes2), aperture = irisAperture(opening);
    const ids = Object.keys(colours);
    const heterochromia = choose(Object.keys(heterochromias));
    for (let i = 0; i < 4096; i++) {
      const values = {
        irisSize: choose(grids.irisSize),
        irisRatio: choose(grids.irisRatio),
        outline: choose(grids.outline),
        pupilShape: choose(Object.keys(pupilShapes)),
        primary: choose(ids),
        heterochromia
      };
      values.pupilSize = choose(grids.pupilSize.filter((size) => fitsPupil(values.irisRatio, values.outline, size)));
      values.secondary = values.heterochromia === "none" ? values.primary : choose(ids.filter((id) => id !== values.primary));
      values.secondarySize = 0;
      if (values.heterochromia === "central") {
        const sizes = visibleSteps(aperture, values, irisGeometry(values)).slice(1);
        if (!sizes.length) continue;
        values.secondarySize = choose(sizes);
      }
      return values;
    }
    throw new Error("Budget de tirage des iris d\xE9pass\xE9. Essayez une autre graine.");
  }
  var pupilInk = "#171713";
  var ellipse2 = (x, y, rx, ry, fill) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}"/>`;
  var polygon = (points, x, y, r) => `<polygon points="${points.map(([u, v]) => [x + r * u, y + r * v].join(",")).join(" ")}" fill="${pupilInk}"/>`;
  function pupilMarkup(shape, x, y, r) {
    switch (shape) {
      case "circle":
        return ellipse2(x, y, r, r, pupilInk);
      case "vertical":
        return ellipse2(x, y, r * slitWidth, r, pupilInk);
      case "horizontal":
        return ellipse2(x, y, r, r * slitWidth, pupilInk);
      case "diamond":
        return polygon([[0, -1], [diamondWidth, 0], [0, 1], [-diamondWidth, 0]], x, y, r);
      case "star":
        return polygon(star, x, y, r);
      case "ring": {
        const circle = (radius) => `M${x - radius},${y} a${radius},${radius} 0 1 0 ${2 * radius},0 a${radius},${radius} 0 1 0 ${-2 * radius},0Z`;
        return `<path d="${circle(r)} ${circle(r * ringHole)}" fill="${pupilInk}" fill-rule="evenodd"/>`;
      }
    }
  }
  function irisMarkup(result, center, index) {
    const { effective, geometry: geometry2 } = result;
    const { x, y, side } = center;
    const { rx, ry, innerRx, innerRy, pupil, highlightX, highlightY, highlightRadius } = geometry2;
    const id = index === 1 && effective.heterochromia === "complete" ? effective.secondary : effective.primary;
    const colour2 = colours[id];
    const rim = effective.outline ? ellipse2(x, y, rx, ry, colour2.outline) : "";
    const secondary = effective.heterochromia === "central" ? `<g data-iris-secondary="">${ellipse2(x, y, rx * effective.secondarySize / 100, ry * effective.secondarySize / 100, colours[effective.secondary].fill)}</g>` : "";
    const highlight = ellipse2(x + side * highlightX, y + highlightY, highlightRadius, highlightRadius, "#fffaf0");
    return `<g data-bio-iris="${index === 0 ? "left" : "right"}" data-iris-colour="${id}">${rim}${ellipse2(x, y, innerRx, innerRy, colour2.fill)}${secondary}<g data-pupil-shape="${effective.pupilShape}">${pupilMarkup(effective.pupilShape, x, y, pupil)}</g>${highlight}</g>`;
  }

  // bio-yeux-01/details.mjs
  var axis = (label, min, max, neutral2, step = 1, unit4 = "%") => Object.freeze({ label, min, max, neutral: neutral2, step, unit: unit4 });
  var foldAxes = {
    count: axis("Nombre de plis", 0, 2, 1, 1, ""),
    distance: axis("Distance \xE0 l\u2019\u0153il", 0, 100, 34),
    length: axis("Longueur", 20, 100, 76),
    curve: axis("Courbure", 0, 100, 36),
    thickness: axis("\xC9paisseur", 10, 100, 33),
    intensity: axis("Intensit\xE9", 0, 100, 42)
  };
  var detailControls = Object.freeze({
    upper: Object.freeze({ ...foldAxes }),
    lower: Object.freeze({ ...foldAxes, count: axis("Nombre de plis", 0, 2, 0, 1, "") }),
    lashes: Object.freeze({
      count: axis("Nombre de pointes", 0, 3, 1, 1, ""),
      length: axis("Longueur", 5, 15, 8),
      spacing: axis("Espacement", 0, 100, 48)
    }),
    shadows: Object.freeze({
      intensity: axis("Intensit\xE9 des cernes", 0, 100, 0),
      width: axis("Largeur des cernes", 30, 100, 68),
      height: axis("Hauteur des cernes", 10, 100, 46),
      volume: axis("Volume des poches", 0, 100, 0),
      puffWidth: axis("Largeur des poches", 30, 100, 67)
    }),
    contours: Object.freeze({
      upper: axis("Contour sup\xE9rieur", 50, 250, 115),
      lower: axis("Contour inf\xE9rieur", 50, 200, 74)
    })
  });
  var detailsDrawVersion = "details-xoshiro128ss-v1";
  var groups3 = Object.entries(detailControls);
  var grids2 = Object.fromEntries(groups3.map(([group, axes12]) => [group, Object.fromEntries(
    Object.entries(axes12).map(([key, { min, max, step }]) => [key, Array.from({ length: (max - min) / step + 1 }, (_, i) => min + i * step)])
  )]));
  var clamp = (value, lo, hi) => Math.max(lo, Math.min(hi, value));
  var ticks = Array.from({ length: 65 }, (_, i) => i / 64);
  function normalizeDetails(value) {
    if (value == null || value === "historical") return null;
    if (typeof value !== "object" || Array.isArray(value)) throw new TypeError("D\xE9tails des yeux invalides.");
    return Object.fromEntries(groups3.map(([group, axes12]) => [group, Object.fromEntries(
      Object.entries(axes12).map(([key, { min, max, neutral: neutral2, unit: unit4 }]) => {
        const v = value[group]?.[key];
        return [key, Number.isFinite(v) ? clamp(unit4 ? v : Math.round(v), min, max) : neutral2];
      })
    )]));
  }
  function detailFrame(opening) {
    const { envelopes: [left, right], nose, reference } = opening.face;
    const region = {
      left: Math.max(right.left - right.x, left.x - left.right),
      right: Math.min(right.right - right.x, left.x - left.left),
      top: Math.max(right.top - right.y, left.top - left.y),
      bottom: Math.min(right.bottom - right.y, left.bottom - left.y),
      noseX: Math.max(nose.right - right.x, left.x - nose.left),
      noseY: Math.max(nose.top - right.y, nose.top - left.y)
    };
    const customized = opening.shapes[1];
    const arc = (dir, t) => {
      if (!customized) {
        const angle2 = Math.PI * t;
        return [-reference.width / 2 * Math.cos(angle2), dir * reference.height / 2 * Math.sin(angle2)];
      }
      const parameter = dir < 0 ? t : 1 - t;
      const i = Math.min(1, Math.floor(parameter * 2));
      const [x, y] = pointAt(customized.curves[(dir < 0 ? 0 : 2) + i], 2 * parameter - i);
      return [x - right.x, y - right.y];
    };
    const upper = ticks.map((t) => arc(-1, t)), lower = ticks.map((t) => arc(1, t));
    const [lo, hi] = customized ? customized.bounds[0].map((x, i) => x - right.x + (i ? -1 : 1) * eyeStroke / 2) : [-reference.width / 2, reference.width / 2];
    return { region, arc, upper, lower, lo, hi, width: hi - lo, envelopes: [left, right] };
  }
  function rayRoom({ left, right, top, bottom, noseX, noseY }, p, v) {
    const [x, y] = p, [dx, dy] = v;
    let limit = Math.min(
      dx > 0 ? (right - x) / dx : dx < 0 ? (left - x) / dx : Infinity,
      dy > 0 ? (bottom - y) / dy : dy < 0 ? (top - y) / dy : Infinity
    );
    const enterX = dx < 0 ? (noseX - x) / dx : x <= noseX ? -Infinity : Infinity;
    const leaveX = dx > 0 ? (noseX - x) / dx : Infinity;
    const enterY = dy > 0 ? (noseY - y) / dy : y >= noseY ? -Infinity : Infinity;
    const leaveY = dy < 0 ? (noseY - y) / dy : Infinity;
    const enter = Math.max(0, enterX, enterY);
    if (enter <= Math.min(leaveX, leaveY)) limit = Math.min(limit, enter);
    return Math.max(0, limit);
  }
  var unit = ([x, y]) => {
    const d = Math.hypot(x, y);
    return [x / d, y / d];
  };
  var cornerWidth = eyeStroke * 0.42;
  var clearance = 0.055;
  function contourWeight(t) {
    return Math.sin(Math.PI * t) ** 0.7 * (0.79 + 0.21 * t);
  }
  function contourDepth(t, value) {
    const weight = contourWeight(t);
    return cornerWidth * (1 - weight) + eyeStroke * value / 100 * weight;
  }
  function contourRoom(frame, point3) {
    return Math.max(0, rayRoom(frame.region, point3, unit(point3)) - clearance);
  }
  function normalIncidence(frame, dir, t, point3) {
    const incidence = (side) => {
      const a = frame.arc(side, Math.max(0, t - 1e-3)), b = frame.arc(side, Math.min(1, t + 1e-3));
      const [dx, dy] = unit([b[0] - a[0], b[1] - a[1]]);
      const [x, y] = unit(point3);
      return Math.abs(dy * x - dx * y);
    };
    const projected = incidence(dir);
    const joined = t === 0 || t === 1 ? Math.min(projected, incidence(-dir)) : projected;
    return Math.max(0.3, joined);
  }
  function fittedDepth(frame, dir, point3, t, value) {
    return Math.min(contourDepth(t, value) / normalIncidence(frame, dir, t, point3), contourRoom(frame, point3));
  }
  function contourMaximum(frame, dir) {
    const points = dir < 0 ? frame.upper : frame.lower;
    const maximum = dir < 0 ? 250 : 200;
    const limits = points.slice(12, 55).map((point3, i) => {
      const t = ticks[i + 12], weight = contourWeight(t);
      const room = contourRoom(frame, point3) * normalIncidence(frame, dir, t, point3);
      return 100 * (room - cornerWidth * (1 - weight)) / (eyeStroke * weight);
    }).sort((a, b) => a - b);
    return clamp(limits[Math.floor(limits.length / 2)], 50, maximum);
  }
  function lashCenters(count, spacing) {
    if (count === 0) return [];
    if (count === 1) return [0.83];
    const step = 0.077 + 0.047 * spacing / 100;
    return Array.from({ length: count }, (_, i) => 0.804 + (i - (count - 1) / 2) * step);
  }
  var rootIn = 0.043;
  var rootOut = 0.032;
  function lashWeight(t, center) {
    const root = t < center ? rootIn : rootOut;
    return Math.max(0, 1 - Math.abs(t - center) / root) ** 2;
  }
  function lashTicks(centers) {
    return [.../* @__PURE__ */ new Set([...ticks, ...centers.flatMap((center) => [center - rootIn, center, center + rootOut])])].sort((a, b) => a - b);
  }
  function lashMaximum(frame, contour2, centers) {
    if (centers.some((t) => frame.arc(-1, t)[0] <= 0)) return 0;
    const probes = centers.flatMap((center) => [center, ...ticks.filter((t) => t > center - rootIn && t < center + rootOut)]);
    return probes.reduce((cap, t) => {
      const weight = Math.max(...centers.map((center) => lashWeight(t, center)));
      if (weight < 1e-9) return cap;
      const p = frame.arc(-1, t);
      const usable = contourRoom(frame, p) - fittedDepth(frame, -1, p, t, contour2);
      return Math.min(cap, 100 * usable / (weight * frame.width));
    }, 15);
  }
  function lashOptions(frame, contour2, count, spacing, withSpacing = true) {
    if (count < 2) {
      const maximum = count === 1 ? lashMaximum(frame, contour2, lashCenters(count, 0)) : 0;
      return { spacing: [], maximum };
    }
    const cap = (value) => lashMaximum(frame, contour2, lashCenters(count, value));
    const current = cap(spacing);
    if (current >= 5 && !withSpacing) return { spacing: [], closest: spacing, maximum: current };
    const options2 = grids2.lashes.spacing.map((value) => ({ value, limit: cap(value) })).filter((entry) => entry.limit >= 5);
    if (!options2.length) return { spacing: [], maximum: 0 };
    const closest = current >= 5 ? spacing : options2.reduce((a, b) => Math.abs(b.value - spacing) < Math.abs(a.value - spacing) ? b : a).value;
    return { spacing: options2.map((entry) => entry.value), options: options2, closest, maximum: closest === spacing ? current : cap(closest) };
  }
  function contourPoint(frame, dir, value, t, flare = 0, widthRatio = 1) {
    const p = frame.arc(dir, t), direction = unit(p);
    const depth = fittedDepth(frame, dir, p, t, value) * widthRatio + flare;
    return [p[0] + direction[0] * depth, p[1] + direction[1] * depth];
  }
  function outerArc(frame, dir, value, lashes = null) {
    const centers = dir < 0 && lashes ? lashCenters(lashes.count, lashes.spacing) : [];
    const tValues = centers.length ? lashTicks(centers) : ticks;
    return tValues.map((t) => {
      const flare = centers.reduce((extra, center) => extra + lashWeight(t, center), 0) * frame.width * (lashes?.length ?? 0) / 100;
      return contourPoint(frame, dir, value, t, flare);
    });
  }
  function verticalRange(polygon3, x) {
    let top = Infinity, bottom = -Infinity;
    for (let i = 0, j = polygon3.length - 1; i < polygon3.length; j = i++) {
      const [a, y] = polygon3[j], [b, z] = polygon3[i];
      if (a <= x && x < b || b <= x && x < a) {
        const hit = y + (z - y) * (x - a) / (b - a);
        top = Math.min(top, hit);
        bottom = Math.max(bottom, hit);
      }
    }
    return [top, bottom];
  }
  function runWindow(frame, polygon3, dir, lashes) {
    const { region, lo, width } = frame;
    const firstRoot = dir < 0 && lashes.count ? frame.arc(-1, lashCenters(lashes.count, lashes.spacing)[0] - rootIn)[0] : Infinity;
    const start = lo + width * 0.105, end = Math.min(lo + width * 0.895, firstRoot - 0.13);
    const profile = (x) => verticalRange(polygon3, x)[dir < 0 ? 0 : 1];
    const ceiling = (x) => dir < 0 ? region.top : x < region.noseX ? Math.min(region.bottom, region.noseY) : region.bottom;
    const candidates2 = [];
    let run = [];
    for (const t of ticks) {
      const x = start + (end - start) * t;
      const room = dir * (ceiling(x) - profile(x)) - 0.14;
      if (room >= 0.42 && end > start) run.push({ x, room });
      else if (run.length) {
        candidates2.push(run);
        run = [];
      }
    }
    if (run.length) candidates2.push(run);
    const best = candidates2.sort((a, b) => b.length - a.length)[0];
    if (!best || best.length < 9) return null;
    const height = Math.min(width * (dir < 0 ? 0.29 : 0.35), ...best.map((p) => p.room));
    return { left: best[0].x, right: best.at(-1).x, height, profile, dir };
  }
  function foldCount(window2) {
    if (!window2) return 0;
    return window2.height >= 0.9 ? 2 : 1;
  }
  var below = (list2, max) => list2.filter((value) => value <= max + 1e-10);
  var fields = (values, enabled, keys2) => Object.fromEntries(keys2.map((key) => [key, enabled ? values[key] : null]));
  var countDomain = (max) => Array.from({ length: max + 1 }, (_, i) => i);
  function lashSetup(frame, contours, requested, withDomains) {
    const compute = (count2) => lashOptions(frame, contours.upper, count2, requested.spacing, withDomains);
    let applied = compute(requested.count), count = requested.count;
    while (count > 0 && applied.maximum < 5) applied = compute(--count);
    const effective = {
      count,
      length: count ? Math.min(requested.length, applied.maximum) : null,
      spacing: count >= 2 ? applied.closest : null
    };
    const direct = withDomains ? [0, ...[1, 2, 3].filter((n2) => (n2 === count ? applied : compute(n2)).maximum >= 5)] : [];
    return { effective, domains: withDomains ? {
      count: direct,
      length: count ? below(grids2.lashes.length, applied.maximum) : [],
      spacing: applied.options?.filter((entry) => entry.limit >= effective.length - 1e-9).map((entry) => entry.value) ?? []
    } : null };
  }
  function makeScene(frame, contours, lashes) {
    const polygon3 = [...outerArc(frame, -1, contours.upper, lashes), ...outerArc(frame, 1, contours.lower).reverse()];
    return { polygon: polygon3, upper: runWindow(frame, polygon3, -1, lashes), lower: runWindow(frame, polygon3, 1, lashes) };
  }
  function solveDetails(opening, value, withDomains = false) {
    const requested = normalizeDetails(value);
    if (!requested) return null;
    const frame = detailFrame(opening);
    const max = { upper: contourMaximum(frame, -1), lower: contourMaximum(frame, 1) };
    const contours = { upper: Math.min(requested.contours.upper, max.upper), lower: Math.min(requested.contours.lower, max.lower) };
    const lashes = lashSetup(frame, contours, requested.lashes, withDomains);
    const scene = makeScene(frame, contours, lashes.effective);
    const effective = { contours, lashes: lashes.effective };
    const domains = withDomains ? {
      contours: { upper: below(grids2.contours.upper, max.upper), lower: below(grids2.contours.lower, max.lower) },
      lashes: lashes.domains
    } : null;
    for (const key of ["upper", "lower"]) {
      const limit = foldCount(scene[key]);
      const count = Math.min(requested[key].count, limit), intensity = count ? requested[key].intensity : null;
      const active = !!(count && intensity);
      const geometry2 = ["distance", "length", "curve", "thickness"];
      effective[key] = { count, intensity, ...fields(requested[key], active, geometry2) };
      if (domains) domains[key] = {
        count: countDomain(limit),
        intensity: count ? grids2[key].intensity : [],
        ...Object.fromEntries(geometry2.map((axis7) => [axis7, active ? grids2[key][axis7] : []]))
      };
    }
    const hasLower = !!scene.lower, { shadows } = requested;
    effective.shadows = {
      intensity: hasLower ? shadows.intensity : 0,
      volume: hasLower ? shadows.volume : 0,
      ...fields(shadows, hasLower && shadows.intensity, ["width", "height"]),
      ...fields(shadows, hasLower && shadows.volume, ["puffWidth"])
    };
    if (domains) domains.shadows = Object.fromEntries(Object.keys(detailControls.shadows).map((key) => [key, hasLower && effective.shadows[key] !== null ? grids2.shadows[key] : []]));
    return { requested, effective, domains, frame, scene };
  }
  function detailsFor(input, eyes2, value, withDomains = false) {
    return solveDetails(eyesFor(input, eyes2), value, withDomains);
  }
  function drawDetails(input, eyes2, seed) {
    if (typeof seed !== "string") throw new TypeError("Graine textuelle requise.");
    const next = seededIndex(detailsDrawVersion + "\0" + seed);
    const choose = (domain2) => domain2[next(domain2.length)];
    const frame = detailFrame(eyesFor(input, eyes2)), result = normalizeDetails({});
    result.contours = {
      upper: choose(below(grids2.contours.upper, contourMaximum(frame, -1))),
      lower: choose(below(grids2.contours.lower, contourMaximum(frame, 1)))
    };
    const available2 = [1, 2, 3].map((n2) => lashOptions(frame, result.contours.upper, n2, 0));
    const count = choose([0, ...[1, 2, 3].filter((n2) => available2[n2 - 1].maximum >= 5)]);
    result.lashes.count = count;
    if (count >= 2) result.lashes.spacing = choose(available2[count - 1].spacing);
    if (count) {
      const maximum = lashMaximum(frame, result.contours.upper, lashCenters(count, result.lashes.spacing));
      result.lashes.length = choose(below(grids2.lashes.length, maximum));
    }
    const scene = makeScene(frame, result.contours, result.lashes);
    for (const key of ["upper", "lower"]) {
      const count2 = choose(countDomain(foldCount(scene[key])));
      result[key].count = count2;
      if (!count2) continue;
      for (const axis7 of ["intensity", "distance", "length", "curve", "thickness"]) result[key][axis7] = choose(grids2[key][axis7]);
    }
    if (scene.lower) {
      for (const key of ["intensity", "volume", "width", "height", "puffWidth"]) result.shadows[key] = choose(grids2.shadows[key]);
    }
    return result;
  }
  function skinDetailColour(skin, strength, desaturate) {
    const channels = rgb(skin).map((c) => c * 255);
    const mean = channels[0] * 0.25 + channels[1] * 0.6 + channels[2] * 0.15;
    const shadow2 = channels.map((c) => +((c + (mean - c) * desaturate * strength) * (1 - strength)).toFixed(3));
    return "rgb(" + shadow2.join(",") + ")";
  }
  var bandTicks = Array.from({ length: 29 }, (_, i) => i / 28);
  function ribbon(window2, span2, center, position, thickness) {
    const width = window2.right - window2.left, left = window2.left + width * center - width * span2 / 2;
    const near = [], far = [];
    for (const t of bandTicks) {
      const x = left + width * span2 * t, y = window2.profile(x), swell = Math.sin(Math.PI * t) ** 0.72;
      const depth = position(swell);
      near.push([x, y + window2.dir * window2.height * depth]);
      far.push([x, y + window2.dir * window2.height * (depth + thickness * swell)]);
    }
    return [...near, ...far.reverse()];
  }
  function folds(window2, value, skin, upper) {
    if (!value.intensity) return [];
    const span2 = value.length / 100, center = upper ? 0.5 + 0.21 * (1 - span2) : 0.5;
    const colour2 = skinDetailColour(skin, 0.37 * value.intensity / 100, 0.18);
    return Array.from({ length: value.count }, (_, i) => ({
      name: upper ? "upper-fold" : "lower-fold",
      colour: colour2,
      points: ribbon(
        window2,
        span2,
        center,
        (swell) => 0.11 + 0.33 * value.distance / 100 + 0.13 * value.curve / 100 * swell + 0.24 * i,
        0.165 * value.thickness / 100
      )
    }));
  }
  function shading(window2, value, skin) {
    const result = [];
    if (value.intensity) result.push({
      name: "dark-circle",
      colour: skinDetailColour(skin, 0.21 * value.intensity / 100, 0.48),
      points: ribbon(window2, value.width / 100, 0.5, () => 0.065, 0.29 * value.height / 100)
    });
    if (value.volume) result.push({
      name: "puff",
      colour: skinDetailColour(skin, 0.24 * (value.volume / 100) ** 0.7, 0.11),
      points: ribbon(window2, value.puffWidth / 100, 0.5, (swell) => 0.23 + 0.09 * swell, 0.48 * value.volume / 100)
    });
    return result;
  }
  function detailContourEdges({ frame, effective: { contours } }) {
    return { upper: outerArc(frame, -1, contours.upper), lower: outerArc(frame, 1, contours.lower) };
  }
  function detailFootprints(result) {
    if (!result) return [];
    const { frame, scene, effective } = result;
    const shapes2 = [
      scene.polygon,
      ...shading(scene.lower, effective.shadows, "#dbbf88").map((mark) => mark.points),
      ...folds(scene.lower, effective.lower, "#dbbf88", false).map((mark) => mark.points),
      ...folds(scene.upper, effective.upper, "#dbbf88", true).map((mark) => mark.points)
    ];
    return frame.envelopes.flatMap((eye) => shapes2.map((points) => {
      const xx = points.map(([x]) => eye.x + eye.side * x), yy = points.map(([, y]) => eye.y + y);
      return { left: Math.min(...xx), right: Math.max(...xx), top: Math.min(...yy), bottom: Math.max(...yy) };
    }));
  }
  function plot(points, eye) {
    return "M" + points.map(([x, y]) => [eye.x + eye.side * x, eye.y + y].map((n2) => +n2.toFixed(5)).join(",")).join("L") + "Z";
  }
  var lashInk = "#171713";
  function anatomicalEyeColours(skin) {
    const light = luminance(skin);
    return {
      upper: skinDetailColour(skin, 0.29 + 0.11 * light, 0.11),
      lower: skinDetailColour(skin, 0.17 + 0.1 * light, 0.11)
    };
  }
  function naturalEyeInk(frame, index, contours, lashes, { skin, smallScale }) {
    const eye = frame.envelopes[index];
    const colours2 = anatomicalEyeColours(skin);
    const upperRatio = smallScale ? 0.57 : 0.43;
    const lowerRatio = smallScale ? 0.36 : 0.25;
    const anatomical = (part, dir, ratio) => {
      const outer = ticks.map((t) => contourPoint(frame, dir, contours[part], t, 0, ratio));
      const aperture = ticks.map((t) => frame.arc(dir, t)).reverse();
      return `<path data-eye-anatomy="${part}" d="${plot([...outer, ...aperture], eye)}" fill="${colours2[part]}"/>`;
    };
    const centers = lashes ? lashCenters(lashes.count, lashes.spacing) : [];
    const tips = centers.map((center) => {
      const root = lashTicks([center]).filter((t) => t >= center - rootIn && t <= center + rootOut);
      const outer = root.map((t) => contourPoint(
        frame,
        -1,
        contours.upper,
        t,
        lashWeight(t, center) * frame.width * lashes.length / 100
      ));
      const inner = root.map((t) => contourPoint(
        frame,
        -1,
        contours.upper,
        t,
        0,
        1 - (1 - upperRatio) * Math.sqrt(lashWeight(t, center))
      )).reverse();
      return `<path data-eye-lash="" d="${plot([...outer, ...inner], eye)}" fill="${lashInk}"/>`;
    });
    return anatomical("upper", -1, upperRatio) + anatomical("lower", 1, lowerRatio) + (tips.length ? `<g data-lash-count="${tips.length}">${tips.join("")}</g>` : "");
  }
  function outsideEyeMarkup(frame, index, aperture, instance, tag, ink) {
    const eye = frame.envelopes[index];
    const { left, right, top, bottom, noseX, noseY } = frame.region;
    const notchX = clamp(noseX, left, right), notchY = clamp(noseY, top, bottom);
    const box = plot([[left, top], [right, top], [right, bottom], [notchX, bottom], [notchX, notchY], [left, notchY]], eye);
    const id = "details-" + instance;
    return `<g ${tag}="${index === 0 ? "left" : "right"}"><defs><clipPath id="${id}-safe"><path d="${box}"/></clipPath><clipPath id="${id}-outside"><path clip-rule="evenodd" d="${box} ${aperture}"/></clipPath></defs><g clip-path="url(#${id}-safe)"><g clip-path="url(#${id}-outside)">${ink}</g></g></g>`;
  }
  function detailContourMarkup({ frame, scene, effective }, index) {
    const contour2 = plot(scene.polygon, frame.envelopes[index]);
    return `<path data-eye-detail="contour" data-lash-count="${effective.lashes.count}" d="${contour2}" fill="${lashInk}"/>`;
  }
  function naturalOutlineMarkup(frame, index, aperture, instance, natural) {
    const contours = { upper: 100, lower: 72 };
    return outsideEyeMarkup(
      frame,
      index,
      aperture,
      instance,
      "data-eye-natural",
      naturalEyeInk(frame, index, contours, null, natural)
    );
  }
  function detailsMarkup(result, index, aperture, instance, skin, natural) {
    const { frame, scene, effective } = result, eye = frame.envelopes[index];
    const details2 = [
      ...shading(scene.lower, effective.shadows, skin),
      ...folds(scene.lower, effective.lower, skin, false),
      ...folds(scene.upper, effective.upper, skin, true)
    ];
    const marks = details2.map((mark) => `<path data-eye-detail="${mark.name}" d="${plot(mark.points, eye)}" fill="${mark.colour}"/>`).join("");
    const ink = natural ? naturalEyeInk(frame, index, effective.contours, effective.lashes, natural) : detailContourMarkup(result, index);
    return outsideEyeMarkup(frame, index, aperture, instance, "data-bio-details", marks + ink);
  }

  // bio-yeux-01/brows.mjs
  var axis2 = (label, min, max, neutral2, unit4 = "%") => Object.freeze({ label, min, max, neutral: neutral2, unit: unit4 });
  var browControls = Object.freeze({
    length: axis2("Longueur", 50, 125, 100),
    thickness: axis2("\xC9paisseur", 20, 220, 100),
    arc: axis2("Hauteur d\u2019arc", 0, 100, 35),
    summit: axis2("Position du sommet", 20, 80, 60),
    tilt: axis2("Inclinaison", -20, 20, 0, "\xB0"),
    angularity: axis2("Angularit\xE9", 0, 100, 20),
    height: axis2("Hauteur sur le visage", 0, 100, 50),
    taper: axis2("Affinement de la pointe", 0, 100, 65),
    spacing: axis2("\xC9cartement", 0, 100, 50)
  });
  var browColourModes = Object.freeze({
    linked: "Identique aux cheveux",
    darker: "Cheveux l\xE9g\xE8rement assombris",
    independent: "Ind\xE9pendante"
  });
  var browDrawVersion = "brows-xoshiro128ss-v1";
  var example = (label, values) => Object.freeze({ label, values: Object.freeze(values) });
  var browPresets = Object.freeze({
    straight: example("Droits", { arc: 0, thickness: 93, taper: 43 }),
    round: example("Arrondis", { arc: 64, summit: 51, angularity: 0, taper: 38 }),
    angular: example("Anguleux", { arc: 66, summit: 62, angularity: 100, taper: 60 }),
    rising: example("Ascendants", { arc: 10, tilt: 17, height: 40, taper: 57 }),
    falling: example("Descendants", { arc: 12, tilt: -16, height: 72, taper: 59 }),
    inflected: example("En S", { arc: 88, summit: 80, angularity: 10, height: 58, taper: 67 }),
    thick: example("\xC9pais", { arc: 30, thickness: 213, height: 64, taper: 17 }),
    fine: example("Effil\xE9s", { length: 115, thickness: 85, arc: 52, taper: 100, angularity: 24 }),
    short: example("Courts", { length: 60, thickness: 108, arc: 23, taper: 51 })
  });
  var axes5 = Object.entries(browControls);
  var grid2 = Object.fromEntries(axes5.map(([key, { min, max }]) => [key, Array.from({ length: max - min + 1 }, (_, i) => min + i)]));
  var traits = ["absent", "monobrow", "slit"];
  var baseTicks = Array.from({ length: 41 }, (_, i) => i / 40);
  var clamp2 = (value, lo, hi) => Math.max(lo, Math.min(hi, value));
  var lerp = (a, b, t) => a + (b - a) * t;
  function normalizeBrows(value) {
    if (value == null || value === "historical") return null;
    if (typeof value !== "object" || Array.isArray(value)) throw new TypeError("R\xE9glages de sourcils invalides.");
    const geometry2 = Object.fromEntries(axes5.map(([key, { min, max, neutral: neutral2 }]) => {
      const entry = value[key];
      return [key, Number.isFinite(entry) ? clamp2(entry, min, max) : neutral2];
    }));
    const colourMode = value.colourMode ?? "linked", colour2 = value.colour ?? "brun-chocolat";
    if (!Object.hasOwn(browColourModes, colourMode)) throw new RangeError("Mode chromatique des sourcils inconnu.");
    swatch(colour2);
    return { ...geometry2, ...Object.fromEntries(traits.map((key) => [key, value[key] === true])), colourMode, colour: colour2 };
  }
  function browFrame(face, opening) {
    const { head: { cx, rx, ry }, anchors: { browLeft, browRight } } = face.base;
    const { envelopes: envelopes2, reference } = opening.face;
    const historicTop = Math.min(...envelopes2.map((e) => e.y - reference.height / 2));
    const eyeTop = opening.shapes.length ? Math.min(...opening.shapes.map((s) => s.bounds[1][0])) : historicTop;
    const top = browRight[1] - 0.34 * ry;
    const bottom = Math.min(eyeTop, ...envelopes2.map((e) => e.top)) - 0.48;
    const edges = stripX(outlineCurves(face.outline), top, bottom);
    const halfWidth = Math.min(...edges.map((x) => Math.abs(x - cx))) - 2.35;
    const length = 1.7 * 0.26 * rx;
    return {
      cx,
      top,
      bottom,
      halfWidth,
      length,
      thickness: 2.2,
      arc: 0.125 * ry,
      root: (browRight[0] - browLeft[0] - length) / 2,
      low: bottom - 0.14,
      travel: 0.2 * ry
    };
  }
  var rootAt = (f, spacing) => f.root * (0.55 + 9e-3 * spacing);
  var bezierHeight = (a, b, t) => 3 * (1 - t) * t * ((1 - t) * a + t * b) + t ** 3;
  function browProfile(frame, value) {
    const length = frame.length * value.length / 100;
    const rise = frame.arc * value.arc / 100, summit = value.arc === 0 ? 0.6 : (value.summit ?? 60) / 100;
    const angle2 = (value.angularity ?? 20) / 100;
    const slope2 = -Math.tan(value.tilt * Math.PI / 180) * length;
    const recurve = clamp2((summit - 0.63) / 0.17, 0, 1) * (1 - angle2);
    const rootHandle = lerp(0.48, 1 / 3, angle2) - 1.88 * recurve;
    const crownHandle = lerp(1, 2 / 3, angle2);
    const tailHandle = lerp(0.48, 1 / 3, angle2);
    const thickness = frame.thickness * value.thickness / 200;
    const taper = value.taper / 100;
    const startHalf = thickness * 0.88;
    const section = (t) => {
      const elevation = t <= summit ? bezierHeight(rootHandle, crownHandle, t / summit) : bezierHeight(tailHandle, crownHandle, (1 - t) / (1 - summit));
      const y = slope2 * t - rise * elevation;
      const root = value.monobrow ? lerp(0.74, 1, Math.min(1, t / 0.12)) : Math.min(1, Math.sqrt(t / 0.077));
      const tip = Math.min(1, Math.sqrt((1 - t) / 0.085));
      const fullness = 0.88 + 0.12 * Math.sin(Math.PI * t);
      const half = thickness * fullness * root * tip * (1 - taper * 0.91 * t ** 1.24);
      return [length * t, y, half];
    };
    return { length, summit, section, startHalf: startHalf * 0.74 };
  }
  function profileTicks(profile, from = 0, to = 1) {
    return [.../* @__PURE__ */ new Set([
      from,
      ...baseTicks.filter((t) => t > from && t < to),
      ...profile.summit > from && profile.summit < to ? [profile.summit] : [],
      to
    ])].sort((a, b) => a - b);
  }
  var slitCenter = 0.76;
  var slitRatio = 0.058;
  function slitBounds(frame, profile) {
    const half = slitRatio * frame.length / (2 * profile.length);
    return [slitCenter - half, slitCenter + half];
  }
  function availableHeight(frame, value, profile = browProfile(frame, value)) {
    const ticks2 = profileTicks(profile);
    if (value.slit) ticks2.push(...slitBounds(frame, profile));
    let top = Infinity, bottom = -Infinity;
    for (const t of ticks2) {
      const [, y, half] = profile.section(t);
      top = Math.min(top, y - half);
      bottom = Math.max(bottom, y + half);
    }
    const low = Math.max(0, 100 * (frame.low + bottom - frame.bottom) / frame.travel);
    const high = Math.min(100, 100 * (frame.low + top - frame.top) / frame.travel);
    return low <= high ? [low, high] : null;
  }
  function fitsWidth(frame, value) {
    return rootAt(frame, value.spacing) + frame.length * value.length / 100 <= frame.halfWidth + 1e-10;
  }
  function fits2(frame, value) {
    if (!fitsWidth(frame, value)) return false;
    const range = availableHeight(frame, value);
    return !!range && value.height >= range[0] - 1e-10 && value.height <= range[1] + 1e-10;
  }
  function applyBounds(frame, requested) {
    const { length, halfWidth, root } = frame;
    const spacing = clamp2(((halfWidth - length * 0.5) / root - 0.55) / 9e-3, 0, 100);
    const applied = { ...requested, spacing: Math.min(requested.spacing, spacing) };
    applied.length = Math.min(requested.length, 100 * (halfWidth - rootAt(frame, applied.spacing)) / length);
    let heightRange = availableHeight(frame, applied);
    if (!heightRange) {
      Object.assign(applied, { tilt: 0, arc: 0, thickness: 20 });
      for (const key of ["thickness", "arc", "tilt"]) {
        const start = applied[key], goal = requested[key];
        let lo = 0, hi = 1;
        applied[key] = goal;
        if (availableHeight(frame, applied)) continue;
        for (let i = 0; i < 32; i++) {
          const middle = (lo + hi) / 2;
          applied[key] = lerp(start, goal, middle);
          if (availableHeight(frame, applied)) lo = middle;
          else hi = middle;
        }
        applied[key] = lerp(start, goal, lo);
      }
      heightRange = availableHeight(frame, applied);
    }
    if (!heightRange || applied.length < 50 - 1e-8) throw new Error("Enveloppe des sourcils insuffisante.");
    applied.height = clamp2(requested.height, ...heightRange);
    return applied;
  }
  function hasRenderedHair(source) {
    return /<g data-layer="(?:back|rear|front|volume|texture|lengths|sides)">(?!<\/g>)/.test(source);
  }
  function facialPigment(face, value, { hairColor, rememberedHairColor, source }) {
    if (value.colourMode === "independent") return { fill: swatch(value.colour).fill, source: "independent" };
    const applied = hairColor && hairColor !== "historical" ? hairColor : null;
    const visible = hasRenderedHair(source ?? character11(face.state, { hairColor }));
    const memory = rememberedHairColor || applied;
    const base = visible ? applied ? swatch(applied).fill : face.cut.color : memory ? swatch(memory).fill : palette2.hair;
    const fill = value.colourMode === "darker" ? "#" + rgb(base).map((c) => Math.round(c * 255 * 0.88).toString(16).padStart(2, "0")).join("") : base;
    return { fill, source: visible ? "hair" : memory ? "remembered" : "historical" };
  }
  function solveBrows(face, opening, value, colours2 = {}, withDomains = false) {
    const requested = normalizeBrows(value);
    if (!requested) return null;
    if (requested.absent) {
      const inactive = Object.fromEntries([...axes5.map(([key]) => key), "monobrow", "slit", "colourMode", "colour"].map((key) => [key, null]));
      return {
        requested,
        effective: { ...inactive, absent: true },
        pigment: null,
        frame: null,
        domains: withDomains ? Object.fromEntries(axes5.map(([key]) => [key, []])) : null
      };
    }
    const frame = browFrame(face, opening);
    const applied = applyBounds(frame, requested);
    const noArc = applied.arc === 0;
    const domains = withDomains ? Object.fromEntries(axes5.map(([key]) => [
      key,
      noArc && (key === "summit" || key === "angularity") ? [] : grid2[key].filter((n2) => fits2(frame, { ...applied, [key]: n2 }))
    ])) : null;
    const effective = {
      ...applied,
      summit: noArc ? null : applied.summit,
      angularity: noArc ? null : applied.angularity,
      colour: applied.colourMode === "independent" ? applied.colour : null
    };
    return { requested, effective, frame, domains, pigment: facialPigment(face, applied, colours2) };
  }
  function browsFor(input, eyes2, value, colours2 = {}, withDomains = false) {
    return solveBrows(model8(input), eyesFor(input, eyes2), value, colours2, withDomains);
  }
  function gridHeight(frame, value) {
    const range = availableHeight(frame, value);
    return range ? grid2.height.filter((n2) => n2 >= range[0] && n2 <= range[1]) : [];
  }
  function drawBrows(input, eyes2, seed) {
    if (typeof seed !== "string") throw new TypeError("Graine textuelle requise.");
    const next = seededIndex(browDrawVersion + "\0" + seed);
    const choose = (list2) => list2[next(list2.length)];
    const frame = browFrame(model8(input), eyesFor(input, eyes2));
    const trait = next(5);
    const value = normalizeBrows({
      absent: trait === 4,
      monobrow: trait === 1 || trait === 3,
      slit: trait === 2 || trait === 3,
      colourMode: choose(Object.keys(browColourModes)),
      colour: choose(palette).id,
      length: 50,
      thickness: 20,
      arc: 0,
      tilt: 0,
      taper: choose(grid2.taper),
      summit: choose(grid2.summit),
      angularity: choose(grid2.angularity)
    });
    for (const key of ["spacing", "length"]) {
      value[key] = choose(grid2[key].filter((n2) => fitsWidth(frame, { ...value, [key]: n2 })));
    }
    for (const key of ["tilt", "thickness", "arc"]) {
      value[key] = choose(grid2[key].filter((n2) => gridHeight(frame, { ...value, [key]: n2 }).length));
    }
    value.height = choose(gridHeight(frame, value));
    return value;
  }
  function silhouetteSegments(frame, effective) {
    const profile = browProfile(frame, effective);
    const root = rootAt(frame, effective.spacing);
    const base = frame.low - effective.height / 100 * frame.travel;
    const sample = (from, to, side) => {
      const points = profileTicks(profile, from, to).map((t) => profile.section(t));
      return {
        upper: points.map(([x, y, half]) => [frame.cx + side * (root + x), base + y - half]),
        lower: points.map(([x, y, half]) => [frame.cx + side * (root + x), base + y + half])
      };
    };
    const [a, b] = slitBounds(frame, profile);
    const left = sample(0, 1, -1), right = sample(0, effective.slit ? a : 1, 1);
    const closed = (p) => [...p.upper, ...p.lower.reverse()];
    const pieces = effective.slit ? [{ side: "right-tip", points: closed(sample(b, 1, 1)) }] : [];
    if (!effective.monobrow) return [{ side: "left", points: closed(left) }, { side: "right", points: closed(right) }, ...pieces];
    const bridge = (direction) => baseTicks.slice(1, -1).map((t) => {
      const x = 2 * t - 1;
      return [frame.cx + root * x, base + direction * profile.startHalf * (0.61 + 0.39 * x * x)];
    });
    const together = [
      ...left.upper.reverse(),
      ...bridge(-1),
      ...right.upper,
      ...right.lower.reverse(),
      ...bridge(1).reverse(),
      ...left.lower
    ];
    return [{ side: "joined", points: together }, ...pieces];
  }
  function browMarkup(result) {
    if (result.effective.absent) return '<g data-bio-brows="absent"/>';
    const pieces = silhouetteSegments(result.frame, result.effective);
    const fill = result.pigment.fill;
    const paths = pieces.map(({ side, points }) => {
      const d = "M" + points.map((p) => p.map((v) => +v.toFixed(6)).join(",")).join("L") + "Z";
      return `<path data-brow-side="${side}" d="${d}" fill="${fill}"/>`;
    }).join("");
    return `<g data-bio-brows="custom">${paths}</g>`;
  }

  // bio-yeux-01/mouth.mjs
  var axis3 = (label, min, max, neutral2) => Object.freeze({ label, min, max, neutral: neutral2 });
  var mouthControls = Object.freeze({
    width: axis3("Largeur", 60, 130, 100),
    upper: axis3("Volume sup\xE9rieur", 0, 200, 100),
    lower: axis3("Volume inf\xE9rieur", 0, 200, 100),
    cupid: axis3("Arc de Cupidon", 0, 100, 45),
    peaks: axis3("\xC9cartement des sommets", 15, 55, 35),
    corners: axis3("Hauteur des commissures", -100, 100, 0),
    curvature: axis3("Courbure de s\xE9paration", -100, 100, 0),
    intensity: axis3("Intensit\xE9 chromatique", 0, 100, 55),
    thickness: axis3("\xC9paisseur de s\xE9paration", 50, 200, 100)
  });
  var example2 = (label, values) => Object.freeze({ label, values: Object.freeze(values) });
  var mouthPresets = Object.freeze({
    fine: example2("Fine", { upper: 25, lower: 34, thickness: 79, intensity: 54, cupid: 34 }),
    full: example2("Charnue", { width: 100, upper: 173, lower: 174, thickness: 77, intensity: 68, cupid: 37 }),
    wide: example2("Large", { width: 130, upper: 84, lower: 85, cupid: 36, thickness: 91 }),
    small: example2("Petite", { width: 65, upper: 56, lower: 65, thickness: 82, cupid: 44 }),
    upper: example2("Sup\xE9rieure dominante", { upper: 169, lower: 42, cupid: 48, intensity: 66 }),
    lower: example2("Inf\xE9rieure dominante", { upper: 41, lower: 170, cupid: 42, intensity: 63 }),
    cupid: example2("Arc de Cupidon marqu\xE9", { upper: 156, lower: 74, cupid: 100, peaks: 28, intensity: 66 }),
    raised: example2("Commissures relev\xE9es", { corners: 88, upper: 76, lower: 90, curvature: 6, intensity: 54 }),
    lowered: example2("Commissures abaiss\xE9es", { corners: -89, upper: 77, lower: 85, curvature: 8, intensity: 56 })
  });
  var mouthDrawVersion = "mouth-xoshiro128ss-v1";
  var MouthFitError = class extends Error {
    constructor() {
      super("L\u2019enveloppe ne permet aucune bouche personnalis\xE9e \xE0 l\u2019ancrage actuel. Arbitrage anatomique requis.");
      this.name = "MouthFitError";
    }
  };
  var axes6 = Object.entries(mouthControls);
  var grids3 = Object.fromEntries(axes6.map(([key, { min, max }]) => [key, Array.from({ length: max - min + 1 }, (_, i) => min + i)]));
  var clamp3 = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  var precision = 1e-9;
  var reserve = 1e-5;
  var legacyStroke = 1.9;
  var empty = { width: 60, upper: 0, lower: 0, corners: 0, curvature: 0, thickness: 50 };
  var recoveryOrder = ["width", "thickness", "corners", "curvature", "upper", "lower"];
  function normalizeMouth(mouth) {
    if (mouth == null || mouth === "historical") return null;
    if (typeof mouth !== "object" || Array.isArray(mouth)) throw new TypeError("R\xE9glages de bouche invalides.");
    return Object.fromEntries(axes6.map(([key, { min, max, neutral: neutral2 }]) => [key, Number.isFinite(mouth[key]) ? clamp3(mouth[key], min, max) : neutral2]));
  }
  function inheritedNose(face, markup = headMarkup(face.base)) {
    const [anchorX, anchorY] = face.base.anchors.nose;
    const matches = [...markup.matchAll(/<path d="M([^, ]+),([^ ]+) l([^, ]+),([^ ]+) h([^ ]+)Z" fill="[^"]+" stroke="none"[^>]*\/>/g)].map(([tag2, ...coordinates]) => ({ tag: tag2, coordinates: coordinates.map(Number) })).filter(({ coordinates: [x2, y2, dx2, dy2, length2] }) => x2 === anchorX && y2 < anchorY && dx2 < 0 && dy2 > 0 && length2 > 0);
    if (matches.length !== 1) throw new Error("Limites du nez h\xE9rit\xE9 introuvables. Arbitrage anatomique requis.");
    const { tag, coordinates: [x, y, dx, dy, length] } = matches[0];
    return { tag, bounds: { left: x + dx, right: x + dx + length, top: y, bottom: y + dy } };
  }
  function inheritedNoseBounds(face, markup) {
    return inheritedNose(face, markup).bounds;
  }
  function inheritedMouth(face, markup = headMarkup(face.base)) {
    const [mx, my] = face.base.anchors.mouth;
    const start = mx - face.base.head.rx * 0.25;
    const candidates2 = [...markup.matchAll(/<path d="M([^, ]+),([^ ]+) Q([^, ]+),([^ ]+) ([^, ]+),([^"]+)" fill="none" stroke="[^"]+" stroke-width="([^"]+)"[^>]*\/>/g)].filter((match) => Number(match[1]) === start && Number(match[2]) === my - 1 && Number(match[5]) > mx);
    if (candidates2.length !== 1) throw new Error("Bouche historique introuvable.");
    const [tag, ...values] = candidates2[0];
    const [x, y, qx, qy, endX, endY, stroke2] = values.map(Number);
    const curve = [
      [x, y],
      [x + (qx - x) * 2 / 3, y + (qy - y) * 2 / 3],
      [endX + (qx - endX) * 2 / 3, endY + (qy - endY) * 2 / 3],
      [endX, endY]
    ];
    return { tag, curve, stroke: stroke2 };
  }
  function mouthFrame(face, opening, options2 = {}) {
    const { head: { rx, ry }, anchors: { mouth: [x, y] } } = face.base;
    const nose = options2.noseBounds ?? inheritedNoseBounds(face, options2.markup);
    if (!["left", "right", "top", "bottom"].every((k) => Number.isFinite(nose[k])) || nose.left > nose.right || nose.top > nose.bottom) throw new TypeError("Limites peintes du nez invalides.");
    const [left, right] = pigmentCenters(opening).map((p) => p.x);
    const outline3 = outlineCurves(face.outline).map((curve) => curve.map(([x2, y2]) => [y2, x2]));
    const faceGap = Math.max(0.65, ry * 0.015);
    const facePad = 4.2 / 2 + faceGap;
    const noseGap = Math.max(0.62, ry * 0.016);
    const cache = /* @__PURE__ */ new Map();
    const faceLimits = (lo, hi) => {
      const key = lo + ";" + hi;
      if (!cache.has(key)) {
        const samples = stripX(outline3, lo - facePad, hi + facePad);
        const above = samples.filter((at) => at < y), below2 = samples.filter((at) => at > y);
        cache.set(key, {
          top: above.length ? Math.max(...above) + facePad : Infinity,
          bottom: below2.length ? Math.min(...below2) - facePad : -Infinity
        });
      }
      return cache.get(key);
    };
    return {
      x,
      y,
      left,
      right,
      nose,
      noseGap,
      faceGap,
      faceLimits,
      width: rx * 0.5,
      upper: ry * 0.055,
      lower: ry * 0.067,
      corners: ry * 0.048,
      curvature: ry * 0.034,
      thickness: legacyStroke * 0.4
    };
  }
  var smooth = (t) => t * t * (3 - 2 * t);
  var smoothSlope = (t) => 6 * t * (1 - t);
  function mouthProfile(frame, value) {
    const { y } = frame;
    const half = frame.width * value.width / 200;
    const camber = frame.curvature * value.curvature / 100;
    const lift = frame.corners * value.corners / 100;
    const thickness = frame.thickness * value.thickness / 200;
    const upper = frame.upper * (value.upper ?? 0) / 100;
    const lower = frame.lower * (value.lower ?? 0) / 100;
    const cusp = (value.cupid ?? 0) / 100;
    const peak = (value.peaks ?? 35) / 100;
    const corner = (t) => Math.max(0, 2 * t - 1);
    const seam = (t) => y + camber * 6.75 * t * t * (1 - t) - lift * corner(t) ** 3;
    const seamSlope = (t) => camber * 6.75 * t * (2 - 3 * t) - 6 * lift * corner(t) ** 2;
    const halfLine = (t) => thickness * (1 - 0.38 * t * t - 0.62 * t ** 3);
    const halfSlope = (t) => -thickness * t * (0.76 + 1.86 * t);
    const upperBase = (t) => 1 - t * t;
    const upperBaseSlope = (t) => -2 * t;
    const sculpt = (t, inward) => inward ? 0.36 + 0.64 * smooth(t / peak) : 1 - ((t - peak) / (1 - peak)) ** 2;
    const sculptSlope = (t, inward) => inward ? 0.64 * smoothSlope(t / peak) / peak : -2 * (t - peak) / (1 - peak) ** 2;
    const lowerBase = (t) => 1 - 0.82 * t * t - 0.18 * t ** 3;
    const lowerBaseSlope = (t) => -t * (1.64 + 0.54 * t);
    const segment = (fn, slope2, a, b) => {
      const d = (b - a) / 3;
      const start = fn(a), end = fn(b);
      return [
        [frame.x + half * a, start],
        [frame.x + half * (a + d), start + d * slope2(a)],
        [frame.x + half * (b - d), end - d * slope2(b)],
        [frame.x + half * b, end]
      ];
    };
    const boundary = (sign, volume = 0) => {
      const upperSide = sign < 0;
      const knots = [0, ...new Set(upperSide && volume && cusp ? [0.5, peak] : [0.5]), 1].sort((a, b) => a - b);
      return knots.slice(1).map((b, i) => {
        const a = knots[i];
        const inward = b <= peak;
        const shape = (t) => upperSide ? (1 - cusp) * upperBase(t) + cusp * sculpt(t, inward) : lowerBase(t);
        const slope2 = (t) => upperSide ? (1 - cusp) * upperBaseSlope(t) + cusp * sculptSlope(t, inward) : lowerBaseSlope(t);
        return segment(
          (t) => seam(t) + sign * (halfLine(t) + volume * shape(t)),
          (t) => seamSlope(t) + sign * (halfSlope(t) + volume * slope2(t)),
          a,
          b
        );
      });
    };
    const top = boundary(-1), bottom = boundary(1);
    return {
      half,
      centre: [segment(seam, seamSlope, 0, 0.5), segment(seam, seamSlope, 0.5, 1)],
      top,
      bottom,
      upper: upper ? boundary(-1, upper) : null,
      lower: lower ? boundary(1, lower) : null
    };
  }
  function yRange(curves) {
    let low = Infinity, high = -Infinity;
    for (const curve of curves) {
      const a = curve[0][1], b = curve[1][1], c = curve[2][1], d = curve[3][1];
      for (const t of [0, 1, ...extrema(curve, 1)]) {
        const u = 1 - t, y = u ** 3 * a + 3 * u * u * t * b + 3 * u * t * t * c + t ** 3 * d;
        low = Math.min(low, y);
        high = Math.max(high, y);
      }
    }
    return [low, high];
  }
  function mouthBounds(frame, profile) {
    const [top, bottom] = yRange([...profile.upper ?? profile.top, ...profile.lower ?? profile.bottom]);
    return { left: frame.x - profile.half, right: frame.x + profile.half, top, bottom };
  }
  function mouthBreaches(frame, box) {
    const outside = [];
    if (box.left < frame.left + reserve - precision) outside.push("pupille-gauche");
    if (box.right > frame.right - reserve + precision) outside.push("pupille-droite");
    if (box.top < frame.nose.bottom + frame.noseGap + reserve - precision) outside.push("nez");
    const face = frame.faceLimits(box.left, box.right);
    if (box.top < face.top + reserve - precision || box.bottom > face.bottom - reserve + precision) outside.push("contour-facial");
    return outside;
  }
  function auditHistoricalMouth(face, opening, options2 = {}) {
    const frame = mouthFrame(face, opening, options2);
    const { curve, stroke: stroke2 } = inheritedMouth(face, options2.markup);
    const [[left, right], [top, bottom]] = bounds2([curve], stroke2 / 2);
    const box = { left, right, top, bottom };
    return { box, violations: mouthBreaches(frame, box) };
  }
  var visibleValues = (value) => value.intensity === 0 ? { ...value, upper: 0, lower: 0 } : value;
  var shapeBox = (frame, value) => mouthBounds(frame, mouthProfile(frame, visibleValues(value)));
  var fits3 = (frame, value) => mouthBreaches(frame, shapeBox(frame, value)).length === 0;
  function approach(frame, fitted, key, goal) {
    const start = fitted[key];
    fitted[key] = goal;
    if (fits3(frame, fitted)) return;
    let lo = 0, hi = 1;
    for (let i = 0; i < 34; i++) {
      const middle = (lo + hi) / 2;
      fitted[key] = start + (goal - start) * middle;
      if (fits3(frame, fitted)) lo = middle;
      else hi = middle;
    }
    fitted[key] = start + (goal - start) * lo;
  }
  function recover(frame, request, preserveMouth) {
    if (fits3(frame, request)) return { ...request };
    if (preserveMouth) {
      for (const [key, anchor] of [
        ["upper", 0],
        ["thickness", 50],
        ["corners", 0],
        ["curvature", 100],
        ["lower", 0],
        ["width", 60]
      ]) {
        const candidate = { ...request, [key]: anchor };
        if (!fits3(frame, candidate)) continue;
        approach(frame, candidate, key, request[key]);
        return candidate;
      }
    }
    const fitted = { ...request, ...empty };
    if (!fits3(frame, fitted)) throw new MouthFitError();
    for (const key of recoveryOrder) approach(frame, fitted, key, request[key]);
    if (preserveMouth) {
      for (const key of recoveryOrder) {
        if (fitted[key] !== request[key]) approach(frame, fitted, key, request[key]);
      }
    }
    return fitted;
  }
  function directDomain(frame, applied, key) {
    const allowed = (n2) => fits3(frame, { ...applied, [key]: n2 });
    const samples = [.../* @__PURE__ */ new Set([...grids3[key], applied[key]])].sort((a, b) => a - b);
    const points = [], intervals = [];
    const transition = (valid, invalid) => {
      for (let i = 0; i < 33; i++) {
        const mid = (valid + invalid) / 2;
        if (allowed(mid)) valid = mid;
        else invalid = mid;
      }
      return valid;
    };
    const add = (value) => {
      if (!points.length || Math.abs(points.at(-1) - value) > 1e-7) points.push(value);
    };
    let start = null;
    const flags = samples.map(allowed);
    for (const [i, value] of samples.entries()) {
      if (!flags[i]) continue;
      if (start === null) {
        start = i === 0 ? value : transition(value, samples[i - 1]);
        add(start);
      }
      add(value);
      if (i === samples.length - 1 || !flags[i + 1]) {
        const end = i === samples.length - 1 ? value : transition(value, samples[i + 1]);
        add(end);
        intervals.push([start, end]);
        start = null;
      }
    }
    return { points, intervals };
  }
  function solveMouth(face, opening, mouth, options2 = {}) {
    const requested = normalizeMouth(mouth);
    if (!requested) return null;
    const frame = mouthFrame(face, opening, options2);
    const recovered = recover(frame, requested, options2.preserveMouth);
    const applied = visibleValues(recovered);
    const upperVisible = applied.upper > 0, hasPigment = upperVisible || applied.lower > 0;
    const effective = {
      ...applied,
      upper: requested.intensity === 0 ? null : applied.upper,
      lower: requested.intensity === 0 ? null : applied.lower,
      cupid: upperVisible ? applied.cupid : null,
      peaks: upperVisible && applied.cupid > 0 ? applied.peaks : null,
      intensity: hasPigment || requested.intensity === 0 ? applied.intensity : null
    };
    const active = (key) => {
      if (key === "intensity") return hasPigment || requested.intensity === 0 && (requested.upper > 0 || requested.lower > 0);
      if (key === "upper" || key === "lower") return requested.intensity > 0;
      if (key === "cupid" || key === "peaks") return effective[key] !== null;
      return true;
    };
    const domains = options2.withDomains ? Object.fromEntries(axes6.map(([key, { min, max }]) => [
      key,
      !active(key) ? { points: [], intervals: [] } : key === "intensity" ? { points: grids3[key], intervals: [[min, max]] } : directDomain(frame, applied, key)
    ])) : null;
    const geometry2 = mouthProfile(frame, effective);
    return { requested, effective, frame, geometry: geometry2, domains, box: mouthBounds(frame, geometry2) };
  }
  function drawMouth(input, eyes2, seed, options2 = {}) {
    if (typeof seed !== "string") throw new TypeError("Graine textuelle requise.");
    const frame = mouthFrame(model8(input), eyesFor(input, eyes2), options2);
    const next = seededIndex(mouthDrawVersion + "\0" + seed);
    const choose = (values2) => values2[next(values2.length)];
    const tint = choose(grids3.intensity);
    const values = { ...empty, cupid: choose(grids3.cupid), peaks: choose(grids3.peaks), intensity: tint || 55 };
    if (!fits3(frame, values)) throw new MouthFitError();
    for (const key of recoveryOrder) values[key] = choose(grids3[key].filter((n2) => fits3(frame, { ...values, [key]: n2 })));
    return { ...values, intensity: tint };
  }
  function lipColours(skin, intensity) {
    const source = rgb(skin).map((v) => v * 255);
    const tint = (ratios, strength) => "rgb(" + source.map((c, i) => +(c * (1 - strength * (1 - ratios[i]))).toFixed(3)).join(",") + ")";
    return {
      upper: tint([0.82, 0.66, 0.66], intensity / 100),
      lower: tint([0.91, 0.79, 0.79], intensity / 100),
      line: tint([0.47, 0.38, 0.41], 1)
    };
  }
  var reverse = (curves) => [...curves].reverse().map((curve) => [...curve].reverse());
  function mirrored(curves, x) {
    const left = reverse(curves).map((curve) => curve.map(([xx, y]) => [2 * x - xx, y]));
    return [...left, ...curves];
  }
  function ribbon2(upper, lower, x) {
    const curves = [...mirrored(upper, x), ...reverse(mirrored(lower, x))];
    const format11 = (point3) => point3.map((n2) => +n2.toFixed(8)).join(",");
    return "M" + format11(curves[0][0]) + curves.map((curve) => " C" + curve.slice(1).map(format11).join(" ")).join("") + "Z";
  }
  function mouthMarkup(result, skin = palette2.skin) {
    const { effective, frame: { x }, geometry: geometry2 } = result;
    const colour2 = lipColours(skin, effective.intensity ?? 0);
    const path5 = (layer, top, bottom) => `<path data-mouth-part="${layer}" d="${ribbon2(top, bottom, x)}" fill="${colour2[layer]}"/>`;
    const upper = geometry2.upper ? path5("upper", geometry2.upper, geometry2.centre) : "";
    const lower = geometry2.lower ? path5("lower", geometry2.centre, geometry2.lower) : "";
    return `<g data-bio-mouth="custom">${upper}${lower}${path5("line", geometry2.top, geometry2.bottom)}</g>`;
  }

  // bio-yeux-01/nose.mjs
  var axis4 = (label, min, max, neutral2) => Object.freeze({ label, min, max, neutral: neutral2 });
  var noseControls = Object.freeze({
    length: axis4("Longueur", 55, 150, 100),
    bridge: axis4("Largeur de l\u2019ar\xEAte", 40, 180, 100),
    wings: axis4("Largeur des ailes", 60, 160, 100),
    tip: axis4("Volume de la pointe", 30, 180, 100),
    roundness: axis4("Arrondi de la pointe", 0, 100, 50),
    nostrils: axis4("Taille des narines", 0, 180, 100),
    tilt: axis4("Inclinaison des narines", -100, 100, 0),
    fills: axis4("Intensit\xE9 des aplats", 0, 100, 45),
    lines: axis4("Intensit\xE9 des traits", 0, 100, 40)
  });
  var example3 = (label, values) => Object.freeze({ label, values: Object.freeze(values) });
  var nosePresets = Object.freeze({
    thin: example3("Fin", { bridge: 51, wings: 66, tip: 68, roundness: 37, nostrils: 65 }),
    wide: example3("Large", { bridge: 113, wings: 153, tip: 125, roundness: 49, nostrils: 112 }),
    long: example3("Long", { length: 145, bridge: 81, wings: 90, tip: 92, roundness: 33 }),
    short: example3("Court", { length: 60, bridge: 111, wings: 98, tip: 86, nostrils: 78 }),
    rounded: example3("Arrondi", { tip: 152, roundness: 100, wings: 117, nostrils: 88 }),
    pointed: example3("Pointu", { tip: 107, roundness: 0, wings: 80, bridge: 83, nostrils: 60 }),
    flat: example3("\xC9pat\xE9", { length: 71, bridge: 124, wings: 158, tip: 126, roundness: 83, nostrils: 115 }),
    broadBridge: example3("Ar\xEAte large", { bridge: 177, wings: 102, tip: 93, roundness: 50 }),
    distinctNostrils: example3("Narines marqu\xE9es", { nostrils: 163, tilt: 56, wings: 125, lines: 79, fills: 43 })
  });
  var noseDetailPresets = Object.freeze({
    minimal: example3("Minimaliste", { fills: 28, lines: 0 }),
    discreet: example3("Discret", { fills: 45, lines: 40 }),
    defined: example3("Marqu\xE9", { fills: 77, lines: 83 })
  });
  var noseDrawVersion = "nose-xoshiro128ss-v1";
  var NoseFitError = class extends Error {
    constructor() {
      super("Le nez ne tient pas dans l\u2019enveloppe avec une bouche admissible \xE0 son ancrage. Arbitrage anatomique requis.");
      this.name = "NoseFitError";
    }
  };
  var axes7 = Object.entries(noseControls);
  var grids4 = Object.fromEntries(axes7.map(([key, { min, max }]) => [key, Array.from({ length: max - min + 1 }, (_, i) => min + i)]));
  var clamp4 = (value, min, max) => Math.max(min, Math.min(max, value));
  var lerp2 = (a, b, t) => a + (b - a) * t;
  var ease = (t) => t * t * (3 - 2 * t);
  var reserve2 = 1e-5;
  var geometryAxes = ["length", "bridge", "wings", "tip", "roundness", "nostrils", "tilt"];
  var minimumMouth = { width: 60, upper: 0, lower: 0, corners: 0, curvature: 0, intensity: 0, thickness: 50 };
  function normalizeNose(nose) {
    if (nose == null || nose === "historical") return null;
    if (typeof nose !== "object" || Array.isArray(nose)) throw new TypeError("R\xE9glages de nez invalides.");
    return Object.fromEntries(axes7.map(([key, { min, max, neutral: neutral2 }]) => [key, Number.isFinite(nose[key]) ? clamp4(nose[key], min, max) : neutral2]));
  }
  function eyeObstacles(opening, details2, painted) {
    const { width, height } = opening.face.reference;
    const openings = opening.face.envelopes.map(({ x, y }, i) => {
      const box = opening.shapes[i]?.bounds ?? [[x - width / 2, x + width / 2], [y - height / 2, y + height / 2]];
      return { left: box[0][0], right: box[0][1], top: box[1][0], bottom: box[1][1] };
    });
    return [...openings, ...detailFootprints(painted ?? solveDetails(opening, details2))];
  }
  function noseFrame(face, opening, options2 = {}) {
    const { head: { rx, ry }, anchors: { nose: [x, y] } } = face.base;
    const [left, right] = pigmentCenters(opening).map((p) => p.x);
    const inherited = mouthFrame(face, opening, { markup: options2.markup });
    const mouthTop = options2.mouth != null && options2.mouth !== "historical" ? solveMouth(face, opening, minimumMouth, { markup: options2.markup }).box.top : auditHistoricalMouth(face, opening, { markup: options2.markup }).box.top;
    const outline3 = outlineCurves(face.outline);
    const pad = 2.1 + Math.max(0.4, 0.012 * ry);
    const cache = /* @__PURE__ */ new Map();
    const faceSides = (top, bottom) => {
      const key = top + ";" + bottom;
      if (!cache.has(key)) {
        const spans = stripX(outline3, top - pad, bottom + pad);
        const l = spans.filter((value) => value < x), r = spans.filter((value) => value > x);
        cache.set(key, { left: l.length ? Math.max(...l) + pad : Infinity, right: r.length ? Math.min(...r) - pad : -Infinity });
      }
      return cache.get(key);
    };
    const length = 0.265 * ry, tip = 0.058 * ry;
    const broadFace = faceSides(y - 0.74 * length * 1.5, y + 0.42 * length * 1.5 + 0.8 * tip);
    return {
      x,
      y,
      left,
      right,
      faceSides,
      broadFace,
      eyes: eyeObstacles(opening, options2.details, options2.eyeDetails),
      mouthTop,
      mouthGap: inherited.noseGap,
      maxBottom: mouthTop - inherited.noseGap - reserve2,
      length,
      bridge: 0.08 * rx,
      wings: 0.165 * rx,
      tip,
      nostrilX: 0.022 * rx,
      nostrilY: 0.0105 * ry,
      eyeGap: Math.max(0.18, 6e-3 * ry)
    };
  }
  function noseProfile(frame, value) {
    const span2 = frame.length * value.length / 100;
    const top = frame.y - 0.74 * span2;
    const bottom = frame.y + 0.42 * span2 + frame.tip * (value.tip / 100 - 1);
    const height = bottom - top;
    const bridge = frame.bridge * value.bridge / 100;
    const wings = frame.wings * value.wings / 100;
    const volume = value.tip / 100, round = value.roundness / 100;
    const knots = [
      [0, 0],
      [0.17, bridge * 0.69],
      [0.42, bridge * 0.87],
      [0.62, lerp2(bridge, wings, 0.3)],
      [0.79, wings],
      [0.9, wings * (0.74 + 0.1 * round)],
      [0.967, wings * (0.24 + 0.3 * round + 0.075 * volume)],
      [1, 0]
    ];
    const y = (t2) => top + height * t2;
    const width = (t2) => {
      const i = knots.findIndex(([at]) => at >= t2);
      if (i <= 0) return 0;
      const [a, w] = knots[i - 1], [b, z] = knots[i];
      return lerp2(w, z, ease((t2 - a) / (b - a)));
    };
    const widthRange = (a, b) => {
      const samples = [width(a), width(b), ...knots.filter(([t2]) => t2 > a && t2 < b).map(([, w]) => w)];
      return [Math.min(...samples), Math.max(...samples)];
    };
    const curves = knots.slice(1).map(([b, z], i) => {
      const [a, w] = knots[i], d = (b - a) / 3;
      return [[frame.x + w, y(a)], [frame.x + w, y(a + d)], [frame.x + z, y(b - d)], [frame.x + z, y(b)]];
    });
    const half = Math.max(...knots.map(([, w]) => w));
    const anatomy = { left: frame.x - half, right: frame.x + half, top, bottom };
    const theta = value.tilt * Math.PI * 28 / 18e3;
    const rx = frame.nostrilX * value.nostrils / 100, ry = frame.nostrilY * value.nostrils / 100;
    const t = 0.825, dx = width(t) * 0.51;
    const ex = Math.hypot(rx * Math.cos(theta), ry * Math.sin(theta));
    const ey = Math.hypot(rx * Math.sin(theta), ry * Math.cos(theta));
    const t0 = t - ey / height, t1 = t + ey / height;
    const nostril = {
      dx,
      y: y(t),
      rx,
      ry,
      angle: value.tilt * 0.28,
      left: dx - ex,
      right: dx + ex,
      top: y(t) - ey,
      bottom: y(t) + ey
    };
    const nostrilFits = rx === 0 || t0 >= 0.63 && t1 < 0.964 && nostril.left >= 0.12 && nostril.right <= widthRange(t0, t1)[0] - 0.13;
    return { anatomy, top, bottom, height, width, widthRange, y, curves, nostril, nostrilFits, volume, round };
  }
  function noseBreaches(frame, shape) {
    const issues = [];
    const box = shape.anatomy;
    if (box.left < frame.left + reserve2 || box.right > frame.right - reserve2) issues.push("verticales-pupillaires");
    if (box.bottom > frame.maxBottom) issues.push("bouche");
    const within = (face) => box.left >= face.left + reserve2 && box.right <= face.right - reserve2;
    if (!within(frame.broadFace) && !within(frame.faceSides(box.top, box.bottom))) issues.push("contour-facial");
    if (frame.eyes.some((eye) => {
      if (box.left >= eye.right + frame.eyeGap || box.right <= eye.left - frame.eyeGap) return false;
      const top = Math.max(box.top, eye.top - frame.eyeGap), bottom = Math.min(box.bottom, eye.bottom + frame.eyeGap);
      if (top > bottom) return false;
      const half = shape.widthRange((top - box.top) / shape.height, (bottom - box.top) / shape.height)[1];
      return frame.x - half < eye.right + frame.eyeGap && frame.x + half > eye.left - frame.eyeGap;
    })) issues.push("yeux");
    if (!shape.nostrilFits) issues.push("narines");
    return issues;
  }
  function auditHistoricalNose(face, opening, options2 = {}) {
    const frame = noseFrame(face, opening, { ...options2, mouth: null });
    const box = inheritedNoseBounds(face, options2.markup);
    const height = box.bottom - box.top, half = (box.right - box.left) / 2;
    return noseBreaches(frame, { anatomy: box, height, widthRange: (a, b) => [half * a, half * b], nostrilFits: true });
  }
  var baseline = { length: 55, bridge: 40, wings: 60, tip: 30, roundness: 50, nostrils: 0, tilt: 0 };
  var fits4 = (frame, value) => noseBreaches(frame, noseProfile(frame, value)).length === 0;
  function withBounds(frame, requested) {
    if (fits4(frame, requested)) return { ...requested };
    const safe = { ...requested, ...baseline };
    if (!fits4(frame, safe)) throw new NoseFitError();
    for (const key of ["length", "bridge", "wings", "tip", "roundness", "tilt", "nostrils"]) {
      const start = safe[key], goal = requested[key];
      safe[key] = goal;
      if (fits4(frame, safe)) continue;
      let lo = 0, hi = 1;
      for (let i = 0; i < 33; i++) {
        const middle = (lo + hi) / 2;
        safe[key] = lerp2(start, goal, middle);
        if (fits4(frame, safe)) lo = middle;
        else hi = middle;
      }
      safe[key] = lerp2(start, goal, lo);
    }
    return safe;
  }
  function domain(frame, applied, key) {
    const allows = (n2) => fits4(frame, { ...applied, [key]: n2 });
    const samples = [.../* @__PURE__ */ new Set([...grids4[key], applied[key]])].sort((a, b) => a - b);
    const flags = samples.map(allows), points = [], intervals = [];
    const edge = (valid, invalid) => {
      for (let i = 0; i < 32; i++) {
        const mid = (valid + invalid) / 2;
        if (allows(mid)) valid = mid;
        else invalid = mid;
      }
      return valid;
    };
    const add = (value) => {
      if (!points.length || Math.abs(points.at(-1) - value) > 1e-7) points.push(value);
    };
    let start = null;
    for (const [i, n2] of samples.entries()) {
      if (!flags[i]) continue;
      if (start === null) {
        start = i === 0 ? n2 : edge(n2, samples[i - 1]);
        add(start);
      }
      add(n2);
      if (i === samples.length - 1 || !flags[i + 1]) {
        const stop = i === samples.length - 1 ? n2 : edge(n2, samples[i + 1]);
        add(stop);
        intervals.push([start, stop]);
        start = null;
      }
    }
    return { points, intervals };
  }
  function solveNose(face, opening, nose, options2 = {}) {
    const requested = normalizeNose(nose);
    if (!requested) return null;
    const frame = noseFrame(face, opening, options2), applied = withBounds(frame, requested);
    const visibility = applied.fills > 0 || applied.lines > 0;
    const effective = { ...applied };
    for (const key of geometryAxes) {
      if (!visibility || key === "nostrils" && !applied.lines || key === "tilt" && (!applied.lines || !applied.nostrils)) effective[key] = null;
    }
    const domains = options2.withDomains ? Object.fromEntries(axes7.map(([key, { min, max }]) => [
      key,
      effective[key] === null ? { points: [], intervals: [] } : geometryAxes.includes(key) ? domain(frame, applied, key) : { points: grids4[key], intervals: [[min, max]] }
    ])) : null;
    return { requested, applied, effective, geometry: noseProfile(frame, applied), frame, domains };
  }
  function drawNose(input, eyes2, seed, options2 = {}) {
    if (typeof seed !== "string") throw new TypeError("Graine textuelle requise.");
    const next = seededIndex(noseDrawVersion + "\0" + seed), choose = (list2) => list2[next(list2.length)];
    const frame = noseFrame(model8(input), eyesFor(input, eyes2), options2);
    const value = { ...baseline, fills: choose(grids4.fills), lines: choose(grids4.lines) };
    if (!fits4(frame, value)) throw new NoseFitError();
    for (const key of ["length", "bridge", "wings", "tip", "roundness", "tilt", "nostrils"]) {
      value[key] = choose(grids4[key].filter((n2) => fits4(frame, { ...value, [key]: n2 })));
    }
    return value;
  }
  function noseColours(skin, fills, lines2) {
    const source = rgb(skin).map((v) => v * 255);
    const tone = (ratios, level) => "rgb(" + source.map((c, i) => +Math.min(255, c * (1 + level / 100 * (ratios[i] - 1))).toFixed(3)).join(",") + ")";
    return {
      bridge: tone([0.95, 0.91, 0.88], fills),
      root: tone([1.035, 1.023, 1.013], fills),
      tip: tone([1.105, 1.074, 1.038], fills),
      wings: tone([0.91, 0.85, 0.8], fills),
      base: tone([0.76, 0.67, 0.62], lines2),
      nostrils: tone([0.53, 0.43, 0.4], lines2),
      ridge: tone([0.82, 0.74, 0.65], lines2)
    };
  }
  var format2 = (p) => p.map((value) => +value.toFixed(8)).join(",");
  var reverse2 = (curves) => [...curves].reverse().map((curve) => [...curve].reverse());
  function outline(profile, x) {
    const curves = [...profile.curves, ...reverse2(profile.curves).map((curve) => curve.map(([xx, y]) => [2 * x - xx, y]))];
    return "M" + format2(curves[0][0]) + curves.map((curve) => " C" + curve.slice(1).map(format2).join(" ")).join("") + "Z";
  }
  function noseMarkup(result, skin = palette2.skin) {
    const { applied, geometry: g, frame: { x } } = result;
    const pigments2 = noseColours(skin, applied.fills, applied.lines);
    const path5 = (region, d, fill) => `<path data-nose-region="${region}" d="${d}" fill="${fill}"/>`;
    const ellipse3 = (region, cx, cy, rx, ry, fill, tilt = 0) => `<ellipse data-nose-region="${region}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"${tilt ? ` transform="rotate(${tilt} ${cx} ${cy})"` : ""}/>`;
    const oval = (region, t, depth, wide, offset = 0) => {
      const room = g.widthRange(t - depth, t + depth)[0], rx = room * wide, ry = g.height * depth;
      return ellipse3(region, x + offset * room, g.y(t), rx, ry, pigments2[region]);
    };
    const layers2 = [];
    if (applied.fills) {
      layers2.push(
        path5("bridge", outline(g, x), pigments2.bridge),
        oval("root", 0.28, 0.126, 0.52),
        oval("wings", 0.81, 0.075, 0.22, -0.66),
        oval("wings", 0.81, 0.075, 0.22, 0.66),
        oval("tip", 0.747, 0.072 + 0.043 * g.round, 0.42 + 0.095 * g.volume)
      );
    }
    if (applied.lines) {
      const room = g.widthRange(0.911, 0.966)[0];
      const xx = 0.81 * room, y = g.y(0.926), depth = g.height * (0.012 + 9e-3 * g.round + 7e-3 * (g.volume - 1));
      const d = `M${format2([x - xx, y])} Q${format2([x, y + depth * 1.8])} ${format2([x + xx, y])} Q${format2([x, y + depth * 0.72])} ${format2([x - xx, y])}Z`;
      layers2.push(path5("base", d, pigments2.base));
      const ridge = (side) => {
        const a = 0.228, b = 0.599, room2 = g.widthRange(a, b)[0], u = side * room2;
        const d2 = `M${format2([x + u * 0.43, g.y(a)])} Q${format2([x + u * 0.55, g.y(0.41)])} ${format2([x + u * 0.82, g.y(b)])} Q${format2([x + u * 0.33, g.y(0.42)])} ${format2([x + u * 0.43, g.y(a)])}Z`;
        return path5("bridge", d2, pigments2.ridge);
      };
      layers2.push(ridge(-1), ridge(1));
      const n2 = g.nostril;
      if (n2.rx) layers2.push(...[-1, 1].map((side) => ellipse3("nostrils", x + side * n2.dx, n2.y, n2.rx, n2.ry, pigments2.nostrils, side * n2.angle)));
    }
    return `<g data-bio-nose="custom">${layers2.join("")}</g>`;
  }

  // bio-yeux-01/beard.mjs
  var beardZones = Object.freeze({
    sideburns: "Favoris",
    cheeks: "Joues",
    moustache: "Moustache",
    soulPatch: "Mouche",
    chin: "Menton",
    jaw: "M\xE2choire"
  });
  var zoneKeys = Object.keys(beardZones);
  var axis5 = (label, neutral2, min = 0) => Object.freeze({ label, neutral: neutral2, min, max: 100 });
  var beardControls = Object.freeze({
    length: axis5("Longueur de barbe", 30),
    volume: axis5("Volume de barbe", 50),
    density: axis5("Densit\xE9", 100),
    chinShape: axis5("Forme du menton", 25),
    moustacheWidth: axis5("Largeur de la moustache", 60),
    moustacheThickness: axis5("\xC9paisseur de la moustache", 50),
    moustacheCurl: axis5("Courbure de la moustache", 0, -100),
    sideburnLength: axis5("Longueur des favoris", 60),
    sideburnWidth: axis5("Largeur des favoris", 50)
  });
  var axes8 = Object.entries(beardControls);
  var example4 = (label, zones, values = {}) => Object.freeze({
    label,
    values: Object.freeze({ ...values, zones: Object.freeze(Object.fromEntries(zones.map((key) => [key, true]))) })
  });
  var beardPresets = Object.freeze({
    clean: example4("Imberbe", []),
    stubble: example4("Naissante", ["cheeks", "chin", "jaw"], { length: 0, volume: 29, density: 26, chinShape: 10 }),
    short: example4("Courte", ["sideburns", "cheeks", "chin", "jaw"], { length: 11, volume: 44, chinShape: 12 }),
    full: example4("Compl\xE8te", zoneKeys, { length: 35, volume: 67, moustacheWidth: 88 }),
    long: example4("Longue", zoneKeys, { length: 93, volume: 79, moustacheWidth: 85, chinShape: 15 }),
    pointed: example4("Pointue", ["sideburns", "cheeks", "chin", "jaw"], { length: 76, volume: 37, chinShape: 98 }),
    goatee: example4("Bouc", ["soulPatch", "chin"], { length: 35, volume: 35, chinShape: 48 }),
    patch: example4("Mouche", ["soulPatch"]),
    strap: example4("Collier", ["sideburns", "cheeks", "jaw"], { length: 3, volume: 6, sideburnWidth: 16, sideburnLength: 87 }),
    moustache: example4("Moustache", ["moustache"], { moustacheWidth: 70, moustacheThickness: 58, moustacheCurl: 35 }),
    circle: example4("Moustache et bouc", ["moustache", "soulPatch", "chin"], { length: 29, volume: 43, moustacheWidth: 56 }),
    sideburns: example4("Favoris", ["sideburns"], { sideburnLength: 78, sideburnWidth: 62 })
  });
  var beardDrawVersion = "beard-xoshiro128ss-v1";
  var beardStroke = 0.62;
  var clamp5 = (n2, min, max) => Math.min(max, Math.max(min, n2));
  var lerp3 = (a, b, t) => a + (b - a) * t;
  var ease2 = (t) => t * t * (3 - 2 * t);
  function beardCategoryOf(category2 = "H") {
    if (!["H", "F", "T"].includes(category2)) throw new RangeError("Cat\xE9gorie de pilosit\xE9 inconnue.");
    return category2;
  }
  function normalizeBeard(beard) {
    if (beard == null || beard === "historical") return null;
    if (typeof beard !== "object" || Array.isArray(beard)) throw new TypeError("R\xE9glages de pilosit\xE9 invalides.");
    const colour2 = swatch(beard.colour ?? "brun-sombre").id;
    const colourMode = beard.colourMode ?? "hair";
    if (!["hair", "darker", "independent"].includes(colourMode)) throw new RangeError("Mode de coloration inconnu.");
    return {
      zones: Object.fromEntries(zoneKeys.map((key) => [key, beard.zones?.[key] === true])),
      ...Object.fromEntries(axes8.map(([key, { min, max, neutral: neutral2 }]) => [
        key,
        Number.isFinite(beard[key]) ? clamp5(beard[key], min, max) : neutral2
      ])),
      colourMode,
      colour: colour2
    };
  }
  function expanded(box, pad) {
    return { left: box.left - pad, right: box.right + pad, top: box.top - pad, bottom: box.bottom + pad };
  }
  function cached(f) {
    const values = /* @__PURE__ */ new Map();
    return (key) => {
      if (!values.has(key)) values.set(key, f(key));
      return values.get(key);
    };
  }
  function faceFrame(face, opening, options2) {
    const { head: { cx, rx, ry } } = face.base;
    const chin = face.anchors.chin[1];
    const curves = outlineCurves(face.outline);
    const transpose = curves.map((curve) => curve.map(([x, y]) => [y, x]));
    const side = cached((y) => {
      const xs = stripX(curves, y);
      return Math.max(0, Math.min(cx - Math.min(...xs), Math.max(...xs) - cx));
    });
    const jaw = cached((x) => Math.min(
      Math.max(...stripX(transpose, cx + x)),
      Math.max(...stripX(transpose, cx - x))
    ));
    const gap = beardStroke / 2 + Math.max(0.27, 7e-3 * ry);
    const nose = options2.noseResult?.geometry.anatomy ?? inheritedNoseBounds(face, options2.markup);
    const mouth = options2.mouthResult?.box ?? auditHistoricalMouth(face, opening, { markup: options2.markup }).box;
    const eyes2 = eyeObstacles(opening, null, options2.detailResult).map((box) => expanded(box, eyeStroke / 2));
    const obstacles = [nose, mouth, ...eyes2].map((box) => expanded(box, gap));
    const top = nose.bottom + gap, bottom = mouth.top - gap;
    const strip = top < bottom ? stripX(curves, top, bottom) : [];
    const left = strip.filter((x) => x < cx), right = strip.filter((x) => x > cx);
    const moustacheSpan = left.length && right.length ? Math.min(0.62 * rx, cx - Math.max(...left) - gap, Math.min(...right) - cx - gap) : 0;
    return {
      cx,
      rx,
      ry,
      chin,
      side,
      jaw,
      gap,
      obstacles,
      nose,
      mouth,
      eyes: eyes2,
      hair: hasRenderedHair(options2.source),
      temple: face.hairAnchors.attachRight[1],
      moustacheSpan,
      top,
      bottom
    };
  }
  function band(top, bottom, crossSection, breaks = []) {
    if (top >= bottom) return [];
    const count = Math.ceil((bottom - top) / 0.62);
    const knots = [.../* @__PURE__ */ new Set([
      ...Array.from({ length: count + 1 }, (_, i) => lerp3(top, bottom, i / count)),
      ...breaks.filter((knot) => knot > top && knot < bottom)
    ])].sort((a, b) => a - b);
    const sections = knots.map((y, i) => crossSection(y, (y - top) / (bottom - top), i));
    return [...sections.map((section) => section[0]), ...sections.reverse().map((section) => section[1])];
  }
  function lateral(frame, top, bottom, profile) {
    const { cx, side, obstacles } = frame;
    const fade = 1.2;
    const breaks = obstacles.flatMap(({ top: top2, bottom: bottom2 }) => [top2 - fade, top2, bottom2, bottom2 + fade]);
    const half = band(top, bottom, (y, t) => {
      const edge = side(y);
      const guard = Math.max(0, ...obstacles.map((box) => {
        const distance = Math.max(box.top - y, y - box.bottom, 0);
        return (1 - clamp5(distance / fade, 0, 1)) * Math.max(cx - box.left, box.right - cx);
      }));
      const { depth, extension } = profile(edge, t);
      const inner = Math.max(guard, edge - depth);
      return [[cx + inner, y], [cx + Math.max(edge + extension, inner), y]];
    }, breaks);
    return [half, half.map(([x, y]) => [2 * cx - x, y])];
  }
  function sideburns(frame, value) {
    const { ry, temple, hair: hair2, eyes: eyes2, mouth } = frame;
    const top = Math.max(temple + (hair2 ? 0 : 0.045 * ry), Math.min(...eyes2.map((box) => box.top)) - 0.11 * ry);
    const bottom = lerp3(top + 0.1 * ry, Math.max(top + 0.12 * ry, mouth.bottom - 0.075 * ry), value.sideburnLength / 100);
    const depth = lerp3(0.041, 0.235, value.sideburnWidth / 100);
    return { bottom, tipDepth: depth * 0.8, polygons: lateral(frame, top, bottom, (edge, t) => ({
      depth: edge * depth * lerp3(0.8, 1, Math.sin(Math.PI * t)),
      extension: edge * lerp3(5e-3, 0.053, value.sideburnWidth / 100) * lerp3(0.78, 0.25, t)
    })) };
  }
  function beardLength(frame, value) {
    return frame.ry * value.length / 100;
  }
  function cheeks(frame, value, burns) {
    const { ry, eyes: eyes2, chin } = frame;
    const start = Math.max(...eyes2.map((box) => box.bottom)) + 0.023 * ry;
    const top = burns ? burns.bottom - 0.032 * ry : start;
    const bottom = chin - 0.105 * ry;
    const fullness = value.volume / 100;
    return lateral(frame, top, bottom, (edge, t) => ({
      depth: edge * lerp3(
        burns ? burns.tipDepth * 0.92 : 0.025,
        lerp3(0.085, 0.73, fullness) * lerp3(0.82, 1, t),
        ease2(clamp5(t / 0.24, 0, 1))
      ),
      extension: (frame.rx * 0.085 * fullness + beardLength(frame, value) * 0.085) * Math.sin(Math.PI * t) ** 1.5
    }));
  }
  function moustacheLimits(frame, width, thickness) {
    const { top, bottom, ry, moustacheSpan } = frame;
    const room = bottom - top;
    const minThickness = 0.22, nominal = 0.105 * ry;
    const maxThickness = Math.min(nominal, 0.86 * room);
    if (maxThickness <= minThickness || moustacheSpan <= 1.65) return null;
    const max = Math.floor(1e6 * 100 * clamp5((maxThickness - minThickness) / (nominal - minThickness), 0, 1)) / 1e6;
    const height = lerp3(minThickness, nominal, Math.min(thickness, max) / 100);
    const span2 = lerp3(moustacheSpan * 0.29, moustacheSpan, width / 100);
    const rise = 0.084 * ry * lerp3(0.48, 1, width / 100);
    const curl = Math.min(100, Math.floor(1e6 * 100 * (room - height) / (2 * rise)) / 1e6);
    return { max, span: span2, height, rise, curl };
  }
  function moustache(frame, value, limit) {
    const { cx, top, bottom } = frame;
    const middle = (top + bottom) / 2;
    const tilt = value.moustacheCurl / 100;
    return band(-limit.span, limit.span, (x) => {
      const t = Math.abs(x) / limit.span;
      const lobe = Math.sin(Math.PI * t) ** 0.73;
      const centre = middle - tilt * limit.rise * t * t;
      const half = limit.height / 2 * (0.65 * lobe + 0.35 * (1 - t));
      return [[cx + x, centre - half], [cx + x, centre + half]];
    }, [0]);
  }
  function chinTop(frame) {
    const { mouth, gap, chin, ry } = frame;
    return Math.min(chin - 0.038 * ry, Math.max(mouth.bottom + gap + 0.046 * ry, chin - 0.185 * ry));
  }
  function soulPatch(frame, value) {
    const { cx, rx, ry, mouth, gap } = frame;
    const top = mouth.bottom + gap;
    const bottom = value.zones.chin ? Math.max(top + 0.06 * ry, chinTop(frame) + 0.015 * ry) : top + 0.09 * ry;
    return band(top, bottom, (y, t) => {
      const half = rx * lerp3(0.107, 0.038, ease2(t));
      return [[cx - half, y], [cx + half, y]];
    });
  }
  function chinPatch(frame, value) {
    const { cx, rx, ry, chin, side } = frame;
    const top = chinTop(frame);
    const volume = value.volume / 100, point3 = value.chinShape / 100;
    const half = Math.min(side(top) * 0.86, rx * lerp3(0.24, 0.59, volume));
    const length = beardLength(frame, value);
    return band(-half, half, (x) => {
      const t = Math.abs(x) / half;
      const taper = lerp3(Math.sqrt(Math.max(0, 1 - t * t)), 1 - t, point3);
      return [
        [cx + x, top + ry * 0.027 * t * t],
        [cx + x, lerp3(top + ry * 0.04, chin + length * lerp3(0.19, 0.41, volume) + point3 * 0.038 * ry, taper)]
      ];
    }, [0]);
  }
  function jawBand(frame, value) {
    const { cx, rx, ry, mouth, side, jaw, gap } = frame;
    const floor = mouth.bottom + gap;
    const span2 = side(floor + 0.029 * ry) * 0.986;
    const fullness = value.volume / 100, point3 = value.chinShape / 100, length = beardLength(frame, value);
    return band(-span2, span2, (x) => {
      const t = Math.abs(x) / span2;
      const edge = jaw(Math.abs(x));
      const depth = ry * lerp3(0.061, 0.175, fullness) * lerp3(1, 0.68, t * t);
      const extension = (9e-3 * ry + length * lerp3(0.14, 0.32, fullness)) * lerp3(1 - t ** 2, 1 - t, point3);
      return [
        [cx + x * (1 - 0.1 * t * t), Math.max(floor, edge - depth)],
        [cx + x + Math.sign(x) * rx * (0.017 + 0.065 * fullness) * t * t, Math.max(floor + 0.019 * ry, edge) + extension]
      ];
    }, [0]);
  }
  function outline2(points) {
    const area = points.reduce((sum, [x, y], i) => {
      const [nx, ny] = points[(i + 1) % points.length];
      return sum + x * ny - y * nx;
    }, 0);
    if (Math.abs(area) < 1e-6) return "";
    const oriented = area > 0 ? points : [...points].reverse();
    return "M" + oriented.map(([x, y]) => x.toFixed(4) + "," + y.toFixed(4)).join("L") + "Z";
  }
  function mix(skin, ink, amount) {
    const base = rgb(skin);
    return "#" + rgb(ink).map((channel, i) => Math.round(lerp3(base[i], channel, amount) * 255).toString(16).padStart(2, "0")).join("");
  }
  function solveBeard(face, opening, beard, options2 = {}) {
    const requested = normalizeBeard(beard);
    if (!requested) return null;
    const category2 = beardCategoryOf(options2.category);
    const source = options2.source ?? character11(face.state, options2);
    const frame = faceFrame(face, opening, { ...options2, source });
    const effective = { ...requested, zones: { ...requested.zones } };
    if (category2 === "F") for (const key of zoneKeys) effective.zones[key] = false;
    const limit = moustacheLimits(frame, requested.moustacheWidth, requested.moustacheThickness);
    const zones = effective.zones;
    zones.moustache &&= !!limit;
    if (zones.moustache) {
      effective.moustacheThickness = Math.min(requested.moustacheThickness, limit.max);
      effective.moustacheCurl = clamp5(requested.moustacheCurl, -limit.curl, limit.curl);
    }
    const lower = zones.cheeks || zones.chin || zones.jaw;
    const active = Object.values(zones).includes(true);
    const hasVisibleDensity = requested.density > 0;
    const domain2 = (key, enabled, max = beardControls[key].max, min = beardControls[key].min) => hasVisibleDensity && enabled && max > min ? [min, max] : [];
    const domains = {
      length: domain2("length", lower),
      volume: domain2("volume", lower),
      density: active ? [0, 100] : [],
      chinShape: domain2("chinShape", zones.chin || zones.jaw),
      moustacheWidth: domain2("moustacheWidth", zones.moustache),
      moustacheThickness: domain2("moustacheThickness", zones.moustache, limit?.max),
      moustacheCurl: domain2("moustacheCurl", zones.moustache, limit?.curl, -(limit?.curl ?? 0)),
      sideburnLength: domain2("sideburnLength", zones.sideburns),
      sideburnWidth: domain2("sideburnWidth", zones.sideburns)
    };
    const burns = zones.sideburns && sideburns(frame, effective);
    const polygons = {
      sideburns: burns ? burns.polygons : [],
      cheeks: zones.cheeks ? cheeks(frame, effective, burns) : [],
      moustache: zones.moustache ? [moustache(frame, effective, limit)] : [],
      soulPatch: zones.soulPatch ? [soulPatch(frame, effective)] : [],
      chin: zones.chin ? [chinPatch(frame, effective)] : [],
      jaw: zones.jaw ? [jawBand(frame, effective)] : []
    };
    const path5 = hasVisibleDensity ? Object.values(polygons).flat().map(outline2).join("") : "";
    const base = facialPigment(face, effective, { ...options2, source });
    const pigment3 = { ...base, stroke: contour(base.fill) };
    const density = effective.density / 100;
    const paint2 = { fill: mix(palette2.skin, pigment3.fill, density), stroke: mix(palette2.skin, pigment3.stroke, density) };
    for (const [key, range] of Object.entries(domains)) if (!range.length) effective[key] = null;
    return { category: category2, requested, effective, pigment: pigment3, paint: paint2, domains, frame, polygons, path: path5, available: { moustache: !!limit } };
  }
  function context(input, eyes2, options2) {
    const face = model8(input), opening = eyesFor(input, eyes2);
    const detailResult = solveDetails(opening, options2.details);
    const noseResult = solveNose(face, opening, options2.nose, { mouth: options2.mouth, eyeDetails: detailResult });
    const mouthResult = solveMouth(face, opening, options2.mouth, { noseBounds: noseResult?.geometry.anatomy, preserveMouth: !!noseResult });
    return { face, opening, options: { ...options2, detailResult, noseResult, mouthResult } };
  }
  function beardFor(input, eyes2, beard, options2 = {}) {
    const portrait3 = context(input, eyes2, options2);
    return solveBeard(portrait3.face, portrait3.opening, beard, portrait3.options);
  }
  function drawBeard(input, eyes2, seed, options2 = {}) {
    if (beardCategoryOf(options2.category) === "F") throw new RangeError("Tirage de pilosit\xE9 indisponible pour F.");
    const { face, opening, options: resolved } = context(input, eyes2, options2);
    const frame = faceFrame(face, opening, { ...resolved, source: character11(input, options2) });
    const index = seededIndex(beardDrawVersion + "\0" + seed);
    const moustacheFits = !!moustacheLimits(frame, 0, 0);
    const zones = Object.fromEntries(zoneKeys.map((key) => [key, (key !== "moustache" || moustacheFits) && index(2) === 1]));
    const draw2 = Object.fromEntries(axes8.map(([key, { min, max }]) => [key, min + index(max - min + 1)]));
    if (zones.moustache) {
      const limit = moustacheLimits(frame, draw2.moustacheWidth, 0);
      draw2.moustacheThickness = index(Math.floor(limit.max) + 1);
      const curl = Math.floor(moustacheLimits(frame, draw2.moustacheWidth, draw2.moustacheThickness).curl);
      draw2.moustacheCurl = index(2 * curl + 1) - curl;
    }
    return normalizeBeard({ ...draw2, zones, colourMode: ["hair", "darker", "independent"][index(3)], colour: palette[index(palette.length)].id });
  }
  function beardMarkup(result) {
    if (!result?.path) return "";
    const { fill, stroke: stroke2 } = result.paint;
    return '<g data-bio-facial-hair=""><path d="' + result.path + '" fill="' + fill + '" stroke="' + stroke2 + '" stroke-width="' + beardStroke + '" stroke-linejoin="round" paint-order="stroke fill"/></g>';
  }

  // bio-yeux-01/surface.mjs
  var mix2 = (a, b, t) => a + (b - a) * t;
  function cutaneousSurface(outline3, rows, margin = 0.9) {
    const curves = outlineCurves(outline3);
    const sections = /* @__PURE__ */ new Map();
    function section(top, bottom = top) {
      const key = top + ";" + bottom;
      if (!sections.has(key)) {
        const points = stripX(curves, top, bottom);
        const middle = top === bottom ? points : stripX(curves, (top + bottom) / 2);
        const center = (Math.min(...middle) + Math.max(...middle)) / 2;
        const left = points.filter((x) => x <= center), right = points.filter((x) => x >= center);
        sections.set(key, top === bottom ? [Math.min(...points), Math.max(...points)] : [Math.max(...left), Math.min(...right)]);
      }
      return sections.get(key);
    }
    function vertical(v) {
      const i = rows.findIndex(([at]) => at >= v);
      if (i <= 0) return rows[0][1];
      const [a, top] = rows[i - 1], [b, bottom] = rows[i];
      return mix2(top, bottom, (v - a) / (b - a));
    }
    function point3(u, v) {
      const y = vertical(v), [left, right] = section(y);
      return [mix2(left, right, u / 100), y];
    }
    function coordinates(x, y) {
      const i = rows.findIndex(([, at]) => at >= y);
      if (i <= 0) return null;
      const [left, right] = section(y);
      if (x < left || x > right || left === right) return null;
      const [a, top] = rows[i - 1], [b, bottom] = rows[i];
      return [100 * (x - left) / (right - left), mix2(a, b, (y - top) / (bottom - top))];
    }
    function contains({ left, right, top, bottom }) {
      if (top < rows[0][1] + margin || bottom > rows.at(-1)[1] - margin) return false;
      const span2 = section(top, bottom);
      return left >= span2[0] + margin && right <= span2[1] - margin;
    }
    return { point: point3, coordinates, contains };
  }
  function sceneCoordinates(svg2, clientX, clientY, plane) {
    const transform = svg2.getScreenCTM();
    if (!transform) return null;
    const pointer = svg2.createSVGPoint();
    pointer.x = clientX;
    pointer.y = clientY;
    const { x, y } = pointer.matrixTransform(transform.inverse());
    return plane.coordinates(x, y);
  }

  // bio-yeux-01/marks.mjs
  var clamp6 = (n2, min = 0, max = 100) => Math.max(min, Math.min(max, n2));
  var mix3 = (a, b, t) => a + (b - a) * t;
  var precise = (n2) => +n2.toFixed(4);
  var rand = (index) => index(1 << 24) / (1 << 24);
  var random = (seed) => seededIndex("marks-surface-v1\0" + seed);
  var markShapes = Object.freeze({ circle: "Circulaire", oval: "Ovale", irregular: "Irr\xE9guli\xE8re", diffuse: "Diffuse" });
  var markTones = Object.freeze({ brown: "Brune", dark: "Fonc\xE9e", rose: "Ros\xE9e", light: "Claire" });
  var markZones = Object.freeze({
    forehead: "Front",
    temples: "Tempes",
    nose: "Nez",
    cheeks: "Joues",
    perioral: "Pourtour de la bouche",
    jaw: "Menton et m\xE2choire"
  });
  var markTypes = Object.freeze({
    mole: { label: "Grain de beaut\xE9", form: "individual", shape: "circle", tone: "dark", size: 28, x: 30, y: 70, radii: [0.31, 1.68] },
    birth: { label: "Tache de naissance", form: "individual", shape: "irregular", tone: "rose", size: 44, x: 76, y: 71, radii: [0.8, 6.4] },
    pigment: { label: "Tache pigmentaire", form: "individual", shape: "diffuse", tone: "light", size: 39, x: 27, y: 75, radii: [0.6, 5.4] },
    freckles: {
      label: "Groupe de taches de rousseur",
      form: "group",
      shape: "irregular",
      tone: "brown",
      size: 45,
      capacity: 44,
      radii: [0.25, 0.78],
      zones: ["nose", "cheeks"],
      density: 64,
      sizeVariation: 65,
      intensity: 58
    },
    pigmentGroup: {
      label: "Groupe de taches pigmentaires",
      form: "group",
      shape: "diffuse",
      tone: "light",
      size: 35,
      capacity: 12,
      radii: [0.36, 2.2],
      zones: ["temples", "cheeks"],
      density: 42,
      sizeVariation: 57,
      intensity: 64
    }
  });
  var individualMarkAxes = Object.freeze({
    x: "Position horizontale",
    y: "Position verticale",
    size: "Taille",
    elongation: "Allongement",
    irregularity: "Irr\xE9gularit\xE9",
    intensity: "Intensit\xE9 chromatique",
    angle: "Orientation"
  });
  var groupMarkAxes = Object.freeze({
    density: "Densit\xE9",
    extent: "\xC9tendue",
    size: "Taille moyenne",
    sizeVariation: "Variation des tailles",
    intensity: "Intensit\xE9 chromatique"
  });
  function option(table, key) {
    if (!Object.hasOwn(table, key)) throw new RangeError("R\xE9glage de marque inconnu.");
    return key;
  }
  function normalizeMarks(values) {
    if (values == null || values === "historical") return [];
    if (!Array.isArray(values) || values.length > 24) throw new RangeError("L\u2019atelier accepte jusqu\u2019\xE0 24 marques et groupes.");
    const identities = /* @__PURE__ */ new Set();
    return values.map((item) => {
      if (!item || typeof item !== "object" || typeof item.id !== "string" || !/^m[1-9]\d{0,8}$/.test(item.id) || identities.has(item.id)) {
        throw new RangeError("Identit\xE9 de marque invalide ou dupliqu\xE9e.");
      }
      identities.add(item.id);
      const { id, type } = item, spec = markTypes[option(markTypes, type)];
      const value = (key, neutral2, max = 100) => Number.isFinite(item[key]) ? clamp6(item[key], 0, max) : neutral2;
      const common = {
        id,
        type,
        shape: option(markShapes, item.shape ?? spec.shape),
        tone: option(markTones, item.tone ?? spec.tone),
        size: value("size", spec.size),
        intensity: value("intensity", spec.intensity ?? 68)
      };
      if (spec.form === "individual") return {
        ...common,
        x: value("x", spec.x),
        y: value("y", spec.y),
        elongation: value("elongation", 42),
        irregularity: value("irregularity", 57),
        angle: value("angle", 23, 180)
      };
      if (item.zones != null && (!Array.isArray(item.zones) || item.zones.some((zone) => !Object.hasOwn(markZones, zone)))) {
        throw new RangeError("Zone cutan\xE9e inconnue.");
      }
      if (item.seed != null && (typeof item.seed !== "string" || item.seed.length > 128)) throw new RangeError("Graine de marque invalide.");
      return {
        ...common,
        seed: item.seed ?? "Microcosme " + id,
        zones: Object.keys(markZones).filter((key) => (item.zones ?? spec.zones).includes(key)),
        density: value("density", spec.density),
        extent: value("extent", 72),
        sizeVariation: value("sizeVariation", spec.sizeVariation)
      };
    });
  }
  var expand = ({ left, right, top, bottom }, pad) => ({ left: left - pad, right: right + pad, top: top - pad, bottom: bottom + pad });
  var over = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  function marksFrame(face, opening, { noseResult, mouthResult, markup } = {}) {
    const { head: { rx, ry, cx }, anchors: { eyeLeft, nose, mouth } } = face.base;
    const rows = [[0, face.anchors.crown[1]], [48, eyeLeft[1]], [64, nose[1]], [82, mouth[1]], [100, face.anchors.chin[1]]];
    const plane = cutaneousSurface(face.outline, rows);
    const { width, height } = opening.face.reference;
    const eyes2 = opening.face.envelopes.map(({ x, y }, i) => {
      const [[left, right], [top, bottom]] = opening.shapes[i]?.bounds ?? [[x - width / 2, x + width / 2], [y - height / 2, y + height / 2]];
      return expand({ left, right, top, bottom }, eyeStroke / 2 + 0.13);
    });
    const lips2 = expand(mouthResult?.box ?? auditHistoricalMouth(face, opening, { markup }).box, 0.16);
    const g = noseResult?.geometry.nostril;
    const nostrils = g?.rx ? [
      expand({ left: cx + g.left, right: cx + g.right, top: g.top, bottom: g.bottom }, 0.12),
      expand({ left: cx - g.right, right: cx - g.left, top: g.top, bottom: g.bottom }, 0.12)
    ] : [];
    const obstacles = [...eyes2, lips2, ...nostrils];
    const obstruction = (box) => !plane.contains(box) ? "contour" : obstacles.some((ink) => over(ink, box)) ? "anatomie" : null;
    return { rx, ry, plane, obstruction, eyes: eyes2, lips: lips2, nostrils };
  }
  function cutaneousOutline(points) {
    const xy = ([x, y]) => precise(x) + "," + precise(y);
    const mid = ([x, y], [a, b]) => xy([(x + a) / 2, (y + b) / 2]);
    return "M" + mid(points.at(-1), points[0]) + points.map((p, i) => "Q" + xy(p) + " " + mid(p, points[(i + 1) % points.length])).join("") + "Z";
  }
  function cutaneousRim(w, h, irregularity, variation) {
    return variation.map((n2, i) => {
      const t = i * 2 * Math.PI / variation.length;
      const scale = 1 + irregularity / 100 * 0.51 * (n2 - 0.5);
      return [w * Math.cos(t) * scale, h * Math.sin(t) * scale];
    });
  }
  function silhouette(x, y, r, { shape, elongation, angle: angle2, irregularity }, variation) {
    const ratio = shape === "circle" ? 1 : mix3(1, 0.48, elongation / 100);
    const direction = shape === "irregular" && irregularity ? angle2 : angle2 % 180;
    const tilt = direction * Math.PI / 180, a = Math.cos(tilt), b = Math.sin(tilt);
    const w = r, h = r * ratio;
    const path5 = irregularity && shape === "irregular" ? cutaneousRim(w, h, irregularity, variation).map(([u, v]) => [x + a * u - b * v, y + b * u + a * v]) : null;
    const dx = Math.hypot(a * w, b * h), dy = Math.hypot(b * w, a * h);
    const box = path5 ? {
      left: Math.min(...path5.map((p) => p[0])),
      right: Math.max(...path5.map((p) => p[0])),
      top: Math.min(...path5.map((p) => p[1])),
      bottom: Math.max(...path5.map((p) => p[1]))
    } : { left: x - dx, right: x + dx, top: y - dy, bottom: y + dy };
    return { x, y, r, box, ink: (fill, scale = 1) => path5 ? `<path d="${cutaneousOutline(path5)}" fill="${fill}"/>` : `<ellipse cx="${precise(x)}" cy="${precise(y)}" rx="${precise(w * scale)}" ry="${precise(h * scale)}"${ratio !== 1 && direction ? ` transform="rotate(${precise(direction)} ${precise(x)} ${precise(y)})"` : ""} fill="${fill}"/>` };
  }
  var radii = (type, frame) => markTypes[type].radii.map((r) => r * Math.sqrt(frame.rx * frame.ry / (29 * 44)));
  var varies = (index) => Array.from({ length: 9 }, () => rand(index));
  function solveIndividual(frame, item, withDomains) {
    const { plane, obstruction } = frame;
    const dims = radii(item.type, frame);
    const variations = varies(random(item.id));
    const draw2 = (x, y, size2, style = item) => silhouette(...plane.point(x, y), mix3(...dims, size2 / 100), style, variations);
    const reason = obstruction(draw2(item.x, item.y, 0).box);
    let max = 100;
    if (!reason && obstruction(draw2(item.x, item.y, 100).box)) {
      let lo = 0, hi = 100;
      for (let i = 0; i < 17; i++) {
        const candidate = (lo + hi) / 2;
        if (obstruction(draw2(item.x, item.y, candidate).box)) hi = candidate;
        else lo = candidate;
      }
      max = Math.floor(lo * 1e3) / 1e3;
    }
    const active = !!item.intensity && !reason;
    const size = Math.min(item.size, max);
    const geometry2 = reason ? null : draw2(item.x, item.y, size);
    const applied = active ? geometry2 : null;
    const elongates = item.shape !== "circle";
    const rotates = elongates && (item.elongation > 0 || item.shape === "irregular" && item.irregularity > 0);
    const domains = {};
    if (withDomains) {
      const positions = (key, requested) => {
        const axis7 = (v) => key === "x" ? [v, item.y] : [item.x, v];
        const allowed = Array.from({ length: 101 }, (_, i) => i).filter((v) => !obstruction(draw2(...axis7(v), reason ? 0 : size).box));
        return allowed.length ? [.../* @__PURE__ */ new Set([...allowed, requested])].sort((a, b) => a - b) : null;
      };
      Object.assign(domains, {
        x: item.intensity ? positions("x", item.x) : [],
        y: item.intensity ? positions("y", item.y) : [],
        size: active ? [0, max] : [],
        elongation: active && elongates ? [0, 100] : [],
        irregularity: active && item.shape === "irregular" ? [0, 100] : [],
        angle: active && rotates ? [0, item.shape === "irregular" && item.irregularity > 0 ? 180 : 179] : [],
        intensity: intensitySteps(item, geometry2 ? [1] : [])
      });
    }
    const effective = {
      id: item.id,
      x: item.x,
      y: item.y,
      size: active ? size : null,
      elongation: active && elongates ? item.elongation : null,
      irregularity: active && item.shape === "irregular" ? item.irregularity : null,
      angle: active && rotates ? item.shape === "irregular" && item.irregularity > 0 ? item.angle : item.angle % 180 : null,
      reason: item.intensity ? reason : "intensit\xE9"
    };
    return { requested: item, effective, domains, points: applied ? [{ id: item.id, geometry: applied, strength: 1, variations }] : [] };
  }
  var regions2 = {
    forehead: [[50, 28, 36, 11, 0]],
    temples: [[12, 38, 9, 12, -0.18], [87, 39, 8, 12, 0.18]],
    nose: [[50, 57, 8.3, 9.4, 0.18]],
    cheeks: [[24, 64, 16, 9, 0.28], [77, 63, 16, 8, -0.31]],
    perioral: [[29, 80, 9, 10, -0.12], [71, 81, 9, 10, 0.12]],
    jaw: [[24, 88, 13, 7, 0.12], [51, 93, 22, 4, 0], [77, 88, 12, 7, -0.12]]
  };
  var zoneWeight = { forehead: 0.74, temples: 0.7, nose: 0.51, cheeks: 1.19, perioral: 0.67, jaw: 0.76 };
  function candidates(item) {
    const freckle = item.type === "freckles";
    const capacity = markTypes[item.type].capacity;
    const count = Math.round(item.density * capacity / 100);
    const extent = mix3(0.73, 1, item.extent / 100);
    const byZone = item.zones.flatMap((zone) => {
      const index = random(item.seed + "\0" + zone);
      const patches = regions2[zone];
      const phase = rand(index) * 0.85;
      const pool = [];
      for (let attempt = 0; attempt < capacity * 55 && pool.length < capacity; attempt++) {
        const [u, v, w, h, slope2] = patches[index(patches.length)];
        const theta = rand(index) * Math.PI * 2;
        const distance = rand(index) ** 0.68;
        const du = Math.cos(theta) * w * distance;
        const dv = Math.sin(theta) * h * distance + du * slope2;
        const x = u + du, y = v + dv;
        const min = freckle ? 1.41 : 3;
        if (pool.some((p) => Math.hypot((p.x - x) * 0.68, (p.y - y) * 0.77) < min)) continue;
        const rank = pool.length;
        pool.push({
          id: item.id + "-" + zone + "-" + (rank + 1),
          rank: (rank + phase) / zoneWeight[zone],
          x,
          y,
          du,
          dv,
          edge: distance,
          variation: rand(index) * 2 - 1,
          contrast: rand(index),
          direction: rand(index) * 180,
          elongation: rand(index),
          variations: varies(index)
        });
      }
      return pool;
    }).sort((a, b) => a.rank - b.rank);
    const selected = [];
    const separation = freckle ? 1.32 : 2.8;
    for (const site of byZone) {
      if (selected.some((other) => Math.hypot((other.x - site.x) * 0.68, (other.y - site.y) * 0.77) < separation)) continue;
      selected.push(site);
      if (selected.length === capacity) break;
    }
    return { sites: selected.map((site) => ({ ...site, x: site.x + (extent - 1) * site.du, y: site.y + (extent - 1) * site.dv })), count, capacity };
  }
  function solveGroup(frame, item, withDomains) {
    const { sites, count, capacity } = candidates(item);
    const { plane, obstruction } = frame;
    const dims = radii(item.type, frame);
    const mean = mix3(...dims, item.size / 100);
    const mapped = sites.map((site) => plane.point(site.x, site.y));
    const show = (site, i) => {
      const [x, y] = mapped[i];
      const near = Math.min(...mapped.map(([a, b], j) => i === j ? Infinity : Math.hypot(x - a, y - b)));
      const style = {
        shape: item.shape,
        elongation: 13 + 44 * site.elongation,
        angle: site.direction,
        irregularity: 30 + site.elongation * 32
      };
      const edge = mix3(1.13, 0.66, site.edge);
      const bump = style.shape === "irregular" ? 1 + 0.255 * style.irregularity / 100 : 1;
      const maximum = dims[1] * (1 + Math.max(0, site.variation) * 0.5) * edge * bump;
      const space = Math.min(1, near * 0.47 / maximum);
      const radius = space * mean * (1 + site.variation * item.sizeVariation / 100 * 0.5) * edge;
      const geometry2 = silhouette(x, y, radius, style, site.variations);
      return { ...site, geometry: geometry2, strength: mix3(0.75, 1.09, site.contrast) * mix3(1.1, 0.68, site.edge), reason: obstruction(geometry2.box) };
    };
    const surveyed = (withDomains ? sites : sites.slice(0, count)).map(show);
    const chosen = surveyed.slice(0, count);
    const points = item.intensity ? chosen.filter((p) => !p.reason) : [];
    const domains = {};
    if (withDomains) {
      const active = !!item.zones.length && !!item.intensity;
      const indices = surveyed.flatMap((p, i) => p.reason ? [] : [(i + 1) * 100 / capacity]);
      Object.assign(domains, {
        density: active ? [0, ...indices] : [],
        extent: active && count ? [0, 100] : [],
        size: active && count ? [0, 100] : [],
        sizeVariation: active && count ? [0, 100] : [],
        intensity: item.zones.length ? intensitySteps(item, chosen.filter((p) => !p.reason).map((p) => p.strength)) : []
      });
    }
    const effective = { id: item.id, count: chosen.length, visible: points.length, sites: chosen.map(({ id, x, y, reason }) => ({ id, x: precise(x), y: precise(y), reason })) };
    return { requested: item, effective, domains, points };
  }
  function solveMarks(face, opening, values, options2 = {}) {
    const requested = normalizeMarks(values);
    if (!requested.length) return null;
    const frame = marksFrame(face, opening, options2);
    const marks = requested.map((item) => {
      const withDomains = options2.withDomains && (!options2.domainId || options2.domainId === item.id);
      return markTypes[item.type].form === "individual" ? solveIndividual(frame, item, withDomains) : solveGroup(frame, item, withDomains);
    });
    return { requested, effective: marks.map((mark) => mark.effective), marks, frame };
  }
  function marksFor(input, eyes2, values, options2 = {}) {
    const face = model8(input), opening = eyesFor(input, eyes2);
    const noseResult = solveNose(face, opening, options2.nose, { mouth: options2.mouth, details: options2.details });
    const mouthResult = solveMouth(face, opening, options2.mouth, { noseBounds: noseResult?.geometry.anatomy, preserveMouth: !!noseResult });
    return solveMarks(face, opening, values, { ...options2, noseResult, mouthResult });
  }
  function markPigment(skin, tone, intensity) {
    const tones = { brown: [0.57, 0.37, 0.25], dark: [0.3, 0.23, 0.21], rose: [0.89, 0.41, 0.42], light: [1, 0.9, 0.79] };
    const base = rgb(skin);
    const target = tones[option(markTones, tone)];
    const values = base.map((channel, i) => {
      const ink = tone === "light" ? mix3(channel, 1, target[i] * 0.48) : channel * target[i];
      return Math.round(255 * mix3(channel, ink, clamp6(intensity, 0, 1)));
    });
    return "rgb(" + values.join(",") + ")";
  }
  var familyStrength = { mole: 0.63, birth: 0.56, pigment: 0.5, freckles: 0.53, pigmentGroup: 0.48 };
  function colourLevels(item, skin, strength, intensity) {
    const richness = item.type === "freckles" ? mix3(1.28, 1, clamp6((Math.max(...rgb(skin)) - 0.27) / 0.45, 0, 1)) : 1;
    const amount = familyStrength[item.type] * strength * intensity / 100 * richness;
    return (item.shape === "diffuse" ? [0.44, 0.79] : [1]).map((level) => markPigment(skin, item.tone, amount * level));
  }
  function intensitySteps(item, strengths) {
    if (!strengths.length) return [0, 100];
    const points = [0];
    let previous = strengths.flatMap((strength) => colourLevels(item, palette2.skin, strength, 0)).join();
    for (let v = 1; v <= 100; v++) {
      const colour2 = strengths.flatMap((strength) => colourLevels(item, palette2.skin, strength, v)).join();
      if (colour2 !== previous) points.push(v);
      else if (v === 100 && points.length > 1) points[points.length - 1] = 100;
      previous = colour2;
    }
    return points;
  }
  function marksMarkup(result, { skin = palette2.skin, scale = "head" } = {}) {
    if (!result) return "";
    const inner = result.marks.map(({ requested: item, points }) => {
      const freckle = item.type === "freckles";
      const detail = freckle && scale !== "head";
      const selected = detail ? [...points].sort((a, b) => b.geometry.r * b.strength - a.geometry.r * a.strength).slice(0, Math.ceil(points.length * (scale === "mini" ? 0.31 : 0.56))) : points;
      return selected.map(({ id, geometry: geometry2, strength, variations }) => {
        const build2 = (radius) => silhouette(geometry2.x, geometry2.y, radius, { ...item, shape: "circle" }, variations);
        if (detail && geometry2.r < (scale === "mini" ? 0.98 : 0.68)) {
          const reserve3 = Math.min(...selected.map((other) => other.id === id ? Infinity : Math.hypot(geometry2.x - other.geometry.x, geometry2.y - other.geometry.y) / 2));
          const larger = build2(Math.max(geometry2.r, Math.min(reserve3, scale === "mini" ? 0.98 : 0.68)));
          if (!result.frame.obstruction(larger.box)) geometry2 = larger;
        }
        const [outer, core] = colourLevels(item, skin, strength, item.intensity);
        const ink = geometry2.ink(outer) + (core ? geometry2.ink(core, 0.61) : "");
        return `<g data-mark-id="${id}" data-mark-family="${item.type}">${ink}</g>`;
      }).join("");
    }).join("");
    return inner ? `<g data-bio-marks="">${inner}</g>` : "";
  }

  // bio-yeux-01/scars.mjs
  var clamp7 = (n2, min, max) => Math.max(min, Math.min(max, n2));
  var mix4 = (a, b, t) => a + (b - a) * t;
  var \u03C4 = 2 * Math.PI;
  var axis6 = (label, min, max, initial) => Object.freeze({ label, min, max, initial });
  var scarAxes = Object.freeze({
    x: axis6("Position horizontale", 0, 100, 31),
    y: axis6("Position verticale", 0, 100, 63),
    length: axis6("Longueur", 0, 100, 46),
    width: axis6("Largeur", 0, 100, 24),
    angle: axis6("Orientation", 0, 360, 72),
    curve: axis6("Courbure", -100, 100, 0),
    irregularity: axis6("Irr\xE9gularit\xE9", 0, 100, 14),
    intensity: axis6("Intensit\xE9 chromatique", 0, 100, 67),
    traces: axis6("Nombre de traces", 1, 5, 1),
    spacing: axis6("Espacement des traces", 0, 100, 34),
    maturity: axis6("Maturation graphique", 0, 100, 47)
  });
  var axes9 = Object.entries(scarAxes);
  var example5 = (label, values) => Object.freeze({ label, values: Object.freeze(values) });
  var scarPresets = Object.freeze({
    linear: example5("Lin\xE9aire", { x: 27, y: 68, length: 48, width: 24, angle: 65, irregularity: 0 }),
    curved: example5("Courbe", { x: 65, y: 57, length: 59, width: 23, angle: 74, curve: 59, irregularity: 11 }),
    irregular: example5("Irr\xE9guli\xE8re", { x: 37, y: 59, length: 65, width: 28, angle: 112, curve: -20, irregularity: 81 }),
    multiple: example5("Multiple", { x: 67, y: 70, length: 38, width: 14, angle: 109, curve: -17, irregularity: 25, traces: 3, spacing: 40 }),
    sutured: example5("Sutur\xE9e", { x: 31, y: 69, length: 48, width: 28, angle: 48, curve: 25, irregularity: 19, sutures: true }),
    surface: example5("Surfacique", { mode: "patch", x: 71, y: 68, length: 39, width: 54, angle: 23, irregularity: 59 })
  });
  var scarStages = Object.freeze([[0, "R\xE9cente"], [34, "Interm\xE9diaire"], [72, "Ancienne"], [100, "Tr\xE8s ancienne"]]);
  var scarDrawVersion = "scar-uv-xoshiro128ss-v1";
  var dimensions = { line: { length: [3.8, 51], width: [0.32, 4.6] }, patch: { length: [3.9, 32], width: [1.3, 21] } };
  function normalizeScars(value) {
    if (value == null || value === "historical") return [];
    if (!Array.isArray(value) || value.length > 16) throw new RangeError("L\u2019atelier accepte jusqu\u2019\xE0 seize cicatrices.");
    const ids = /* @__PURE__ */ new Set();
    return value.map((scar) => {
      if (!scar || !/^s[1-9]\d{0,8}$/.test(scar.id) || typeof scar.id !== "string" || ids.has(scar.id)) {
        throw new RangeError("Identifiant de cicatrice invalide ou dupliqu\xE9.");
      }
      ids.add(scar.id);
      const { id, mode = "line", seed = "Microcosme " + id } = scar;
      if (!Object.hasOwn(dimensions, mode) || typeof seed !== "string" || seed.length > 128) throw new RangeError("Cicatrice invalide.");
      const values = Object.fromEntries(axes9.map(([key, { min, max, initial }]) => [
        key,
        Number.isFinite(scar[key]) ? clamp7(scar[key], min, max) : initial
      ]));
      return { id, mode, seed, ...values, traces: Math.round(values.traces), sutures: scar.sutures === true };
    });
  }
  var random2 = (seed) => seededIndex(scarDrawVersion + "\0" + seed);
  var entropy = (index) => index(1 << 24) / (1 << 24);
  var texture = (seed) => {
    const index = random2(seed);
    return { phase: entropy(index) * \u03C4, rim: Array.from({ length: 15 }, () => entropy(index)) };
  };
  function axisLength(value, key) {
    return mix4(...dimensions[value.mode][key], value[key] / 100);
  }
  function period(value) {
    if (value.irregularity || value.mode === "line" && value.curve) return 360;
    if (value.mode === "patch" && Math.abs(axisLength(value, "width") - axisLength(value, "length")) < 1e-5) return 0;
    return 180;
  }
  function chartTransform(value) {
    const modulus = period(value);
    const a = modulus ? value.angle % modulus * \u03C4 / 360 : 0;
    const c = Math.cos(a), s = Math.sin(a);
    return ([x, y]) => [value.x + (c * x - s * y) / 0.58, value.y + (s * x + c * y) / 0.88];
  }
  function tapered(spine) {
    return (fraction, shift = 0) => [
      ...spine.map(({ x, y, nx, ny, r }) => [x + nx * (shift + fraction) * r, y + ny * (shift + fraction) * r]),
      ...[...spine].reverse().map(({ x, y, nx, ny, r }) => [x + nx * (shift - fraction) * r, y + ny * (shift - fraction) * r])
    ];
  }
  function lineParts(value, detail, phase) {
    const L = axisLength(value, "length"), W = axisLength(value, "width");
    const amplitude = value.irregularity * 0.01 * L;
    const rise = value.curve * 0.01 * L * 0.255;
    const pitch = W * 1.06 + mix4(0.37, 3.7, value.spacing / 100);
    const wave = (s) => rise * s * s + amplitude * (0.043 * (Math.sin(s * 2.65 + phase) - Math.sin(phase)) + 0.018 * (Math.sin(s * 7.15 - phase) - Math.sin(-phase)));
    const steps = Math.max(14, Math.ceil(L / 1.2));
    const path5 = (s, lateral2) => {
      const dx = L / 2, dy = (wave(s + 1e-4) - wave(s - 1e-4)) / 2e-4;
      const theta = Math.atan2(dy, dx), nx = -Math.sin(theta), ny = Math.cos(theta);
      return { x: dx * s + nx * lateral2, y: wave(s) + ny * lateral2, nx, ny };
    };
    const parts = Array.from({ length: value.traces }, (_, i) => {
      const offset = (i - (value.traces - 1) / 2) * pitch;
      const spine = Array.from({ length: steps + 1 }, (_2, j) => {
        const t = j / steps, s = 2 * t - 1;
        const r = W * 0.5 * (0.09 + 0.91 * Math.sin(Math.PI * t) ** 0.63) * (1 + value.irregularity / 100 * 0.16 * Math.sin(s * 12 + phase));
        return { ...path5(s, offset), r };
      });
      return { band: tapered(spine)(1), spine };
    });
    const stitches = [];
    if (value.sutures) {
      const count = clamp7(Math.floor(L / 4.05), 2, 9);
      for (const { spine } of parts) for (let i = 0; i < count; i++) {
        const at = Math.round((0.16 + 0.68 * (i + 0.5) / count) * steps);
        const { x, y, nx, ny, r } = spine[at];
        const reach = Math.min(L * 0.175, Math.max(0.56, W * 0.77));
        const thickness = Math.max(0.16, Math.min(W * 0.17, 0.48));
        for (const sign of [-1, 1]) {
          const a = 0.72 * r, b = r + reach;
          const point3 = (displacement, width) => [x + nx * displacement * sign - ny * width, y + ny * displacement * sign + nx * width];
          stitches.push([
            point3(a, 0),
            point3((a + b) * 0.5, thickness),
            point3(b, 0),
            point3((a + b) * 0.5, -thickness * 0.76)
          ]);
        }
      }
    }
    const age = value.maturity / 100;
    return {
      rims: [...parts.map(({ band: band2 }) => band2), ...stitches],
      layers: detail ? {
        rim: parts.map(({ band: band2 }) => band2),
        centre: parts.map(({ spine }) => tapered(spine)(mix4(0.46, 0.57, age), -0.06)),
        light: parts.map(({ spine }) => tapered(spine)(mix4(0.15, 0.25, age), 0.35)),
        suture: stitches
      } : null
    };
  }
  function patchParts(value, detail, variation) {
    const rx = axisLength(value, "length") / 2, ry = axisLength(value, "width") / 2;
    const rim = cutaneousRim(rx, ry, value.irregularity, variation);
    const lift = value.maturity / 100;
    const inset = (w, h, dx, dy) => rim.map(([x, y]) => [x * w + rx * dx, y * h + ry * dy]);
    return { rims: [rim], layers: detail ? {
      rim: [rim],
      centre: [inset(0.72 + lift * 0.08, 0.65, -0.06, 0.04)],
      light: [inset(0.51 + lift * 0.12, 0.22 + lift * 0.05, 0.1, -0.29)],
      suture: []
    } : null };
  }
  function build(frame, value, grain, detail = false) {
    const transform = chartTransform(value);
    const local = value.mode === "line" ? lineParts(value, detail, grain.phase) : patchParts(value, detail, grain.rim);
    const rims = local.rims.map((rim) => rim.map(transform));
    if (rims.some((rim) => rim.some(([u, v]) => u <= 0 || v <= 0 || u >= 100 || v >= 100))) return null;
    const project = (rim) => rim.map(([u, v]) => frame.plane.point(u, v));
    const outlines = rims.map(project);
    const admissible = (box) => {
      const broad = { ...box, top: Math.floor(box.top), bottom: Math.ceil(box.bottom) };
      return frame.plane.contains(broad) || frame.plane.contains(box);
    };
    if (outlines.some((rim) => !admissible(span(rim)) && (rim.some((p) => !frame.plane.contains(span([p]))) || rim.some((_, i) => !admissible(span([rim[i], rim[(i + 1) % rim.length], rim[(i + 2) % rim.length]])))))) return null;
    if (!detail) return true;
    const layers2 = Object.fromEntries(Object.entries(local.layers).map(([key, rims2]) => [key, rims2.map((rim) => project(rim.map(transform)))]));
    return { rims: outlines, layers: layers2 };
  }
  function scarFrame(face, opening, options2 = {}) {
    return marksFrame(face, opening, options2);
  }
  function span(points) {
    const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
    return { left: Math.min(...xs), right: Math.max(...xs), top: Math.min(...ys), bottom: Math.max(...ys) };
  }
  var over2 = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  function meetsReserve(rim, area) {
    const x = (area.left + area.right) / 2, y = (area.top + area.bottom) / 2;
    let inside = false;
    for (const [i, p] of rim.entries()) {
      const q2 = rim[(i + 1) % rim.length];
      if (over2(span([p, q2]), area)) return true;
      if (p[1] > y !== q2[1] > y && x < p[0] + (q2[0] - p[0]) * (y - p[1]) / (q2[1] - p[1])) inside = !inside;
    }
    return inside;
  }
  function solve(frame, request, withDomains) {
    const grain = texture(request.seed);
    const value = { ...request };
    const line = value.mode === "line";
    const parallel = line && value.traces > 1;
    const fit = (props) => build(frame, props, grain);
    const proposals = ["length", "width", ...parallel ? ["spacing"] : []];
    const start = { ...value, ...Object.fromEntries(proposals.map((key) => [key, 0])) };
    let canDraw = fit(value);
    function maximum(base, key, max = 100) {
      if (fit({ ...base, [key]: max })) return max;
      if (!fit({ ...base, [key]: 0 })) return null;
      let lo = 0, hi = max;
      for (let i = 0; i < 10; i++) {
        const middle = (lo + hi) / 2;
        if (fit({ ...base, [key]: middle })) lo = middle;
        else hi = middle;
      }
      return Math.floor(lo * 100) / 100;
    }
    if (!canDraw && fit(start)) {
      Object.assign(value, start);
      for (const key of proposals) value[key] = maximum(value, key, request[key]);
      canDraw = true;
    }
    const geometry2 = canDraw && value.intensity ? build(frame, value, grain, true) : null;
    const anglePeriod = period(value);
    const domains = {};
    if (withDomains) {
      const active = !!geometry2;
      const allowed = (enabled, min, max) => enabled ? [min, max] : [];
      const placement = (key) => {
        if (!value.intensity) return [];
        const measured = Array.from({ length: 101 }, (_, i) => i);
        const usable = measured.filter((n2) => fit({ ...start, [key]: n2 }));
        return [.../* @__PURE__ */ new Set([...usable.length ? usable : measured, request[key]])].sort((a, b) => a - b);
      };
      Object.assign(domains, {
        x: placement("x"),
        y: placement("y"),
        length: active ? [0, maximum(value, "length")] : [],
        width: active ? [0, maximum(value, "width")] : [],
        angle: allowed(active && anglePeriod > 0, 0, anglePeriod - 1),
        curve: allowed(active && line, -100, 100),
        irregularity: allowed(active, 0, 100),
        intensity: [0, 100],
        maturity: allowed(active, 0, 100),
        traces: active && line ? [1, 2, 3, 4, 5].filter((traces) => traces === value.traces || fit({ ...start, traces })) : [],
        spacing: active && parallel ? [0, maximum(value, "spacing")] : [],
        sutures: active && line && (value.sutures || fit({ ...start, sutures: true }))
      });
    }
    const interruptions = geometry2 ? Object.entries({ yeux: frame.eyes, l\u00E8vres: [frame.lips], narines: frame.nostrils }).filter(([, areas]) => areas.some((area) => geometry2.rims.some((rim) => meetsReserve(rim, area)))).map(([key]) => key) : [];
    const applied = {
      ...value,
      angle: anglePeriod ? value.angle % anglePeriod : null,
      curve: line ? value.curve : null,
      traces: line ? value.traces : null,
      spacing: parallel ? value.spacing : null,
      sutures: line ? value.sutures : null
    };
    if (!geometry2) {
      for (const key of Object.keys(scarAxes)) if (!["x", "y", "intensity"].includes(key)) applied[key] = null;
    }
    return {
      requested: request,
      effective: { ...applied, reason: !request.intensity ? "intensit\xE9" : geometry2 ? null : "contour", interruptions },
      domains,
      geometry: geometry2
    };
  }
  function solveScars(face, opening, scars, options2 = {}) {
    const requested = normalizeScars(scars);
    if (!requested.length) return null;
    const frame = scarFrame(face, opening, options2);
    const items = requested.map((scar) => solve(frame, scar, options2.withDomains && (!options2.domainId || options2.domainId === scar.id)));
    return { requested, effective: items.map((item) => item.effective), items, frame };
  }
  function portrait(input, eyes2, options2) {
    const face = model8(input), opening = eyesFor(input, eyes2);
    const noseResult = solveNose(face, opening, options2.nose, { mouth: options2.mouth, details: options2.details });
    const mouthResult = solveMouth(face, opening, options2.mouth, { noseBounds: noseResult?.geometry.anatomy, preserveMouth: !!noseResult });
    return { face, opening, options: { ...options2, noseResult, mouthResult } };
  }
  function scarsFor(input, eyes2, scars, options2 = {}) {
    const context2 = portrait(input, eyes2, options2);
    return solveScars(context2.face, context2.opening, scars, context2.options);
  }
  function drawScar(input, eyes2, id, seed, options2 = {}) {
    if (typeof seed !== "string") throw new TypeError("Graine textuelle requise.");
    const index = random2(seed), presets4 = Object.values(scarPresets);
    const context2 = portrait(input, eyes2, options2);
    const frame = scarFrame(context2.face, context2.opening, context2.options);
    for (let attempt = 0; attempt < 96; attempt++) {
      const { values } = presets4[index(presets4.length)];
      const [request] = normalizeScars([{
        ...values,
        id,
        seed,
        x: 24 + index(53),
        y: 27 + index(58),
        angle: index(360),
        length: 17 + index(46),
        width: 10 + index(36),
        maturity: index(101),
        intensity: 39 + index(54)
      }]);
      const geometry2 = build(frame, request, texture(seed), true);
      if (!geometry2) continue;
      const covered = [...frame.eyes, frame.lips, ...frame.nostrils];
      if (!geometry2.rims.some((rim) => rim.some(([x, y]) => !covered.some((area) => x >= area.left && x <= area.right && y >= area.top && y <= area.bottom)))) continue;
      return request;
    }
    throw new RangeError("Aucun placement admissible pour cette graine.");
  }
  var pigment = [
    { at: 0, core: [0.083, -0.27, -0.25], edge: [-0.1, -0.18, -0.16], lift: [0.18, 0.048, 0.04] },
    { at: 34, core: [0.047, -0.16, -0.147], edge: [-0.08, -0.13, -0.12], lift: [0.2, 0.12, 0.083] },
    { at: 72, core: [0.21, 0.18, 0.132], edge: [-0.058, -0.09, -0.087], lift: [0.26, 0.22, 0.17] },
    { at: 100, core: [0.052, 0.056, 0.052], edge: [-0.025, -0.034, -0.032], lift: [0.078, 0.08, 0.071] }
  ];
  function scarColours(skin, maturity, intensity, scale = "head") {
    const base = rgb(skin);
    const stop = Math.max(1, pigment.findIndex((item) => item.at >= maturity));
    const a = pigment[stop - 1], b = pigment[stop];
    const progress = (maturity - a.at) / (b.at - a.at);
    const strength = intensity / 100 * (scale === "mini" ? 1.16 : 1);
    const colour2 = (key, factor = 1) => "rgb(" + base.map((channel, i) => {
      const change = mix4(a[key][i], b[key][i], progress) * strength * factor;
      return +(255 * clamp7(channel + (change < 0 ? channel : 1 - channel) * change, 0, 1)).toFixed(2);
    }).join(",") + ")";
    return { rim: colour2("edge"), centre: colour2("core"), light: colour2("lift"), suture: colour2("core", 0.73) };
  }
  function black(markup) {
    return markup.replace(/\bfill="(?!none)[^"]*"/g, 'fill="black"').replace(/\bstroke="(?!none)[^"]*"/g, 'stroke="black"');
  }
  function scarReserves(face, opening, { markup = headMarkup(face.base), mouthResult, noseResult } = {}) {
    const eyes2 = opening.shapes.length ? opening.shapes.map((shape) => `<path d="${shape.path}" fill="black" stroke="black" stroke-width=".12"/>`) : [...markup.matchAll(/<ellipse\b[^>]*\/>/g)].map(([tag]) => tag).filter((tag) => tag.includes('fill="' + palette2.white + '"')).map(black);
    const lips2 = mouthResult ? [...mouthMarkup(mouthResult).matchAll(/<path\b[^>]*\/>/g)].map(([tag]) => black(tag)) : [black(inheritedMouth(face, markup).tag)];
    const nose = noseResult ? { ...noseResult, applied: { ...noseResult.applied, fills: 0, lines: 1 } } : null;
    const nostrils = nose ? [...noseMarkup(nose).matchAll(/<ellipse data-nose-region="nostrils"[^>]*\/>/g)].map(([tag]) => black(tag)) : [];
    return { eyes: eyes2, lips: lips2, nostrils };
  }
  function scarsMarkup(result, { skin = palette2.skin, scale = "head", face, opening, instance, ...options2 }) {
    if (!result?.items.some((item) => item.geometry)) return "";
    const { cx, cy, rx, ry } = face.base.head;
    const left = cx - 2 * rx, top = cy - 2 * ry, width = 4 * rx, height = 4 * ry;
    const carve = Object.values(scarReserves(face, opening, options2)).flat().join("");
    let hash = 2166136261;
    for (const ch of carve + face.outline) hash = Math.imul(hash ^ ch.charCodeAt(0), 16777619);
    const key = "scar-" + String(instance ?? "default").replace(/[^a-z0-9_-]/gi, "-") + "-" + (hash >>> 0).toString(36);
    const mask = `<mask id="${key}" maskUnits="userSpaceOnUse" x="${left}" y="${top}" width="${width}" height="${height}" style="mask-type:luminance"><rect x="${left}" y="${top}" width="${width}" height="${height}" fill="white"/>${carve}</mask>`;
    const paths = result.items.filter((item) => item.geometry).map(({ requested, geometry: geometry2 }) => {
      const colours2 = scarColours(skin, requested.maturity, requested.intensity, scale);
      const ink = Object.entries(geometry2.layers).flatMap(([layer, parts]) => scale === "mini" && layer === "light" ? [] : parts.map((poly) => `<path data-scar-relief="${layer}" d="${cutaneousOutline(poly)}" fill="${colours2[layer]}"/>`));
      return `<g data-scar-id="${requested.id}" data-scar-mode="${requested.mode}">${ink.join("")}</g>`;
    }).join("");
    return `<g data-bio-scars=""><defs>${mask}</defs><g mask="url(#${key})">${paths}</g></g>`;
  }

  // bio-yeux-01/makeup.mjs
  var makeupPalette = Object.freeze([
    ["Naturelles", ["#e7c5a9", "#c89a7c", "#ae785e", "#85543d", "#684331", "#493026", "#c88e80", "#ad7467"]],
    ["Roses et rouges", ["#edb3ba", "#d78399", "#cf526f", "#a52f47", "#79243e", "#a83d30", "#db7452", "#733447"]],
    ["Fantaisie", ["#e0b43f", "#dc8437", "#829e4d", "#397e62", "#4d9eab", "#3f649b", "#79549e", "#ac65b2"]],
    ["Neutres et contrastes", ["#fff8e9", "#e5e2d9", "#b7b8bd", "#85858e", "#53545e", "#28272d", "#151519", "#b38b4f"]]
  ]);
  var pigments = makeupPalette.flatMap(([, colours2]) => colours2);
  var percent = (label, initial) => ({ label, initial, min: 0, max: 100, unit: "%" });
  var angle = (label, min, max) => ({ label, initial: 0, min, max, unit: "\xB0" });
  var pigment2 = (label, initial) => ({ label, initial, pigment: true });
  var makeupFamilies = {
    lips: { label: "L\xE8vres", fields: {
      colour: pigment2("Couleur", "#a52f47"),
      intensity: percent("Intensit\xE9", 66),
      coverage: percent("Couverture", 76),
      edge: percent("\xC9paisseur du contour", 0),
      edgeColour: pigment2("Couleur du contour", "#79243e")
    } },
    shadow: { label: "Fard \xE0 paupi\xE8res", fields: {
      colour: pigment2("Couleur principale", "#79549e"),
      accent: pigment2("Couleur secondaire", null),
      intensity: percent("Intensit\xE9", 57),
      height: percent("Hauteur", 66),
      extent: percent("\xC9tendue horizontale", 82),
      outer: percent("Concentration externe", 38)
    } },
    liner: { label: "Eyeliner", fields: {
      colour: pigment2("Couleur", "#151519"),
      top: percent("\xC9paisseur sup\xE9rieure", 43),
      bottom: percent("\xC9paisseur inf\xE9rieure", 0),
      wing: percent("Longueur de la pointe externe", 37),
      slant: angle("Inclinaison de la pointe", -45, 45),
      intensity: percent("Intensit\xE9", 89)
    } },
    blush: { label: "Fard \xE0 joues", fields: {
      colour: pigment2("Couleur", "#d78399"),
      intensity: percent("Intensit\xE9", 65),
      x: percent("Position horizontale", 50),
      y: percent("Position verticale", 35),
      extent: percent("\xC9tendue", 62),
      diffusion: percent("Diffusion", 72)
    } },
    paint: { label: "Peintures faciales", fields: {
      x: percent("Position horizontale", 28),
      y: percent("Position verticale", 62),
      size: percent("Taille", 35),
      stretch: percent("Allongement", 30),
      rotation: angle("Orientation", -180, 179),
      weight: percent("\xC9paisseur", 38),
      colour: pigment2("Couleur", "#397e62"),
      intensity: percent("Intensit\xE9", 84)
    } }
  };
  var paintShapes = {
    point: "Point",
    circle: "Cercle",
    ring: "Anneau",
    line: "Ligne",
    stripe: "Bande",
    triangle: "Triangle",
    diamond: "Losange",
    crescent: "Croissant",
    arc: "Arc",
    wave: "Vague",
    zigzag: "Zigzag",
    star: "\xC9toile"
  };
  var roundShapes = ["circle", "ring"];
  var variableWeight = ["ring", "line", "stripe", "crescent", "arc", "wave", "zigzag"];
  var maxPaintElements = 36;
  function fieldsFor(values, fields2) {
    return Object.fromEntries(Object.entries(fields2).map(([key, field]) => {
      const value = Object.hasOwn(values, key) ? values[key] : field.initial;
      const valid = field.pigment ? pigments.includes(value) || field.initial === null && value === null : Number.isFinite(value) && value >= field.min && value <= field.max;
      if (!valid) throw new RangeError(field.label + " hors du domaine du maquillage.");
      return [key, value];
    }));
  }
  function normalizeMakeup(value = {}) {
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new TypeError("Composition de maquillage invalide.");
    const result = {};
    for (const [key, { fields: fields2 }] of Object.entries(makeupFamilies)) {
      if (key === "paint") continue;
      const family = value[key] ?? {};
      if (typeof family !== "object" || Array.isArray(family)) throw new TypeError("Famille de maquillage invalide.");
      result[key] = { enabled: family.enabled === true, ...fieldsFor(family, fields2) };
    }
    const paint2 = value.paint ?? {};
    const elements2 = paint2.elements ?? [];
    if (typeof paint2 !== "object" || Array.isArray(paint2) || !Array.isArray(elements2) || elements2.length > maxPaintElements) {
      throw new RangeError("Liste de peintures faciales invalide (36 \xE9l\xE9ments au maximum).");
    }
    result.paint = { enabled: paint2.enabled === true, elements: elements2.map((item, index) => {
      const shape = item?.shape;
      if (!Object.hasOwn(paintShapes, shape)) throw new RangeError("Forme de peinture faciale inconnue.");
      return {
        shape,
        mirror: item.mirror === true,
        ...fieldsFor(item, makeupFamilies.paint.fields),
        ...!Object.hasOwn(item, "x") ? { x: 24 + index % 5 * 13 } : {}
      };
    }) };
    return result;
  }
  function inactiveFields(family, values) {
    if (family === "lips") return [
      ...values.intensity === 0 ? ["coverage", "edge"] : [],
      ...values.intensity === 0 || values.coverage === 0 ? ["colour"] : [],
      ...values.intensity === 0 || values.edge === 0 ? ["edgeColour"] : []
    ];
    if (family === "shadow") {
      if (values.intensity === 0) return ["colour", "accent", "height", "extent", "outer"];
      return values.height === 0 || values.extent === 0 ? ["colour", "accent", "outer"] : [];
    }
    if (family === "liner") return [
      ...values.intensity === 0 ? ["colour", "top", "bottom", "wing"] : [],
      ...values.intensity === 0 || values.wing === 0 ? ["slant"] : [],
      ...values.intensity > 0 && values.top === 0 && values.bottom === 0 && values.wing === 0 ? ["colour"] : []
    ];
    if (family === "blush") return values.intensity === 0 ? ["colour", "x", "y", "extent", "diffusion"] : [];
    return [
      ...values.intensity === 0 ? ["colour", "x", "y", "size"] : [],
      ...values.intensity === 0 || values.shape === "point" ? ["stretch"] : [],
      ...values.intensity === 0 || values.shape === "point" || roundShapes.includes(values.shape) && values.stretch === 0 ? ["rotation"] : [],
      ...values.intensity === 0 || !variableWeight.includes(values.shape) ? ["weight"] : []
    ];
  }
  function makeupMirrorUseful(item) {
    if (item.x !== 50) return true;
    const locked = inactiveFields("paint", { ...item, intensity: 100 }).includes("rotation");
    const symmetric = ["point", "circle", "ring", "triangle", "diamond", "arc", "star", "stripe", "line"].includes(item.shape);
    return !symmetric || !locked && item.rotation % 180 !== 0;
  }
  function hasMakeup(makeup) {
    return !!makeup && (makeup.lips.enabled && makeup.lips.intensity > 0 && (makeup.lips.coverage > 0 || makeup.lips.edge > 0) || makeup.shadow.enabled && makeup.shadow.intensity > 0 && makeup.shadow.height > 0 && makeup.shadow.extent > 0 || makeup.liner.enabled && makeup.liner.intensity > 0 && (makeup.liner.top > 0 || makeup.liner.bottom > 0 || makeup.liner.wing > 0) || makeup.blush.enabled && makeup.blush.intensity > 0 || makeup.paint.enabled && makeup.paint.elements.some((item) => item.intensity > 0));
  }
  var compositionSchema = "microcosme.makeup";
  function makeupDocument(value) {
    return { schema: compositionSchema, version: 1, makeup: normalizeMakeup(value) };
  }
  function parseMakeup(text) {
    const data = JSON.parse(text);
    if (data?.schema !== compositionSchema || data.version !== 1 || !data.makeup) {
      throw new Error("Composition de maquillage version 1 requise.");
    }
    return normalizeMakeup(data.makeup);
  }
  function drawMakeup(seed) {
    const choose = seededIndex("bio-maquillage-01-v1\0" + seed);
    const colour2 = pigments[8 + choose(16)];
    const contrast = pigments[choose(pigments.length)];
    const shapes2 = Object.keys(paintShapes);
    return normalizeMakeup({
      lips: { enabled: true, colour: colour2, intensity: 38 + choose(44), coverage: 53 + choose(42) },
      shadow: { enabled: true, colour: colour2, accent: contrast, intensity: 25 + choose(47), height: 18 + choose(65) },
      liner: { enabled: true, top: 16 + choose(58), wing: 16 + choose(57), slant: -25 + choose(51) },
      blush: { enabled: true, colour: colour2, intensity: 28 + choose(46), diffusion: 52 + choose(48) },
      paint: { enabled: true, elements: [{
        shape: shapes2[choose(shapes2.length)],
        x: 20 + choose(12),
        y: 59 + choose(11),
        size: 14 + choose(23),
        rotation: -35 + choose(71),
        colour: contrast,
        intensity: 47 + choose(44),
        mirror: choose(2) === 0
      }] }
    });
  }

  // bio-yeux-01/makeup-render.mjs
  var lerp4 = (a, b, t) => a + (b - a) * t;
  var n = (value) => +value.toFixed(5);
  var pair2 = (point3) => point3.map(n).join(",");
  var lines = (points) => "M" + points.map(pair2).join("L");
  var polygon2 = (points) => lines(points) + "Z";
  var tagPath = (tag) => tag.match(/\bd="([^"]+)"/)[1];
  var black2 = (tag) => tag.replace(/\b(fill|stroke)="(?!none")[^"]+"/g, '$1="black"');
  var tags = (markup, pattern) => [...markup.matchAll(pattern)].map(([tag]) => tag);
  var path4 = (d, attrs2) => `<path d="${d}" ${attrs2}/>`;
  var unit2 = (value) => value / 100;
  var paintPosition = (plane, u, v) => plane.point(lerp4(7, 93, unit2(u)), lerp4(11, 94, unit2(v)));
  function makeupCoordinates(x, y) {
    return [Math.round((x - 7) * 100 / 86), Math.round((y - 11) * 100 / 83)];
  }
  function lipGeometry(face, options2) {
    const { mouthResult, markup } = options2;
    if (mouthResult) {
      const mouth = mouthMarkup(mouthResult);
      const paths2 = tags(mouth, /<path data-mouth-part="(?:upper|lower)"[^>]*\/>/g).map(tagPath);
      const seam = tagPath(mouth.match(/<path data-mouth-part="line"[^>]*\/>/)[0]);
      const { frame, effective } = mouthResult;
      const volumes2 = ["upper", "lower"].filter((side) => mouthResult.geometry[side]).map((side) => frame[side] * unit2(effective[side]));
      return { paths: paths2, volumes: volumes2, separator: path4(seam, 'fill="black"'), box: mouthResult.box };
    }
    const { curve, tag, stroke: stroke2 } = inheritedMouth(face, markup);
    const { ry } = face.base.head;
    const samples = Array.from({ length: 25 }, (_, i) => {
      const t = i / 24, [x, y] = pointAt(curve, t);
      const ends = Math.sin(Math.PI * t) ** 0.73;
      const cupid = 0.81 + 0.19 * Math.sin(2 * Math.PI * t) ** 2;
      return {
        x,
        y,
        upper: y - ends * (stroke2 * 0.55 + ry * 0.032 * cupid),
        lower: y + ends * (stroke2 * 0.55 + ry * 0.048)
      };
    });
    const paths = [
      polygon2([...samples.map((p) => [p.x, p.upper]), ...samples.slice().reverse().map((p) => [p.x, p.y])]),
      polygon2([...samples.map((p) => [p.x, p.y]), ...samples.slice().reverse().map((p) => [p.x, p.lower])])
    ];
    return { paths, volumes: [ry * 0.032, ry * 0.048], separator: black2(tag), box: {
      left: samples[0].x,
      right: samples.at(-1).x,
      top: Math.min(...samples.map((p) => p.upper)),
      bottom: Math.max(...samples.map((p) => p.lower))
    } };
  }
  function eyeGeometry(face, opening, shadow2, liner2, detailResult) {
    const details2 = detailResult?.frame ?? detailFrame(opening);
    const { head, anchors } = face.base;
    const natural = detailResult ? detailContourEdges(detailResult) : null;
    const rail = (key, points) => natural?.[key] ?? points.map(([x, y]) => {
      const radius = Math.hypot(x, y);
      const offset = opening.shapes.length ? eyeStroke / 2 : 0;
      return [x * (1 + offset / radius), y * (1 + offset / radius)];
    });
    return details2.envelopes.map((eye, index) => {
      const { x, y, side } = eye;
      const brow = index === 0 ? anchors.browLeft : anchors.browRight;
      const scene = ([u, v]) => [x + side * u, y + v];
      const along = (dir, t) => scene(details2.arc(dir, t));
      const { region } = details2;
      const [baseX, baseY] = details2.arc(-1, 1);
      const availableWidth = Math.max(0, Math.min(head.rx * 0.29, region.right - baseX - 0.27));
      const radians = liner2.slant * Math.PI / 180;
      const slope2 = Math.tan(radians);
      const yLimit = slope2 >= 0 ? baseY - region.top : region.bottom - baseY;
      const wingLength = Math.max(0, Math.min(availableWidth, yLimit / Math.max(Math.abs(slope2), 1e-3))) * unit2(liner2.wing);
      const thicknessBase = head.ry * 0.059;
      const topWidth = thicknessBase * unit2(liner2.top);
      const bottomWidth = thicknessBase * 0.67 * unit2(liner2.bottom);
      const wingBase = Math.max(topWidth * 0.63, Math.min(thicknessBase * 0.48, wingLength * 0.37));
      const wing = [
        scene([baseX - wingBase * 0.58, baseY + wingBase * 0.14]),
        scene([baseX - wingBase * 0.38, baseY - wingBase]),
        scene([baseX + wingLength, baseY - wingLength * slope2])
      ];
      const count = 25;
      const extent = unit2(shadow2.extent);
      const outer = unit2(shadow2.outer);
      const start = (1 - extent) * lerp4(0.23, 0.93, outer);
      const end = start + extent;
      const eyelid = Array.from({ length: count }, (_, i) => {
        const fraction = i / (count - 1);
        const [lx, ly] = along(-1, lerp4(start, end, fraction));
        const room = Math.max(0, Math.min(head.ry * 0.145, ly - (brow[1] + 1.33)));
        const feather = Math.sin(Math.PI * fraction) ** 0.64;
        const weight = lerp4(1, 0.46 + 0.54 * fraction, outer);
        return { x: lx, y: ly, top: ly - room * unit2(shadow2.height) * feather * weight };
      });
      return {
        side,
        eyelid,
        upper: lines(rail("upper", details2.upper).map(scene)),
        lower: lines(rail("lower", details2.lower).map(scene)),
        topWidth,
        bottomWidth,
        wing,
        wingLength
      };
    });
  }
  function facePaint(frame, item) {
    const { plane, rx, ry } = frame;
    const position = paintPosition(plane, item.x, item.y);
    const [left] = paintPosition(plane, 0, item.y);
    const [right] = paintPosition(plane, 100, item.y);
    const diameter = Math.min(rx * 0.78, ry * 0.68, (right - left) * 0.64);
    const size = item.shape === "point" ? lerp4(0.34, 1.49, unit2(item.size)) : lerp4(diameter * 0.12, diameter * 0.5, unit2(item.size));
    const inactive = inactiveFields("paint", { ...item, intensity: 100 });
    const stretch = inactive.includes("stretch") ? 1 : 1 + 1.35 * unit2(item.stretch);
    const rotation = inactive.includes("rotation") ? 0 : item.rotation;
    const weight = inactive.includes("weight") ? null : lerp4(0.064, 0.49, unit2(item.weight));
    const mirror = item.mirror && makeupMirrorUseful(item);
    const transforms = [[...position, 1]];
    if (mirror) transforms.push([...paintPosition(plane, 100 - item.x, item.y), -1]);
    return { transforms, size, stretch, rotation, weight, mirror };
  }
  function cheekGeometry(frame, value) {
    const { plane, rx, ry } = frame;
    const distance = lerp4(16.8, 31.6, unit2(value.x));
    const vertical = lerp4(57.2, 72.2, unit2(value.y));
    return {
      positions: [plane.point(50 - distance, vertical), plane.point(50 + distance, vertical)],
      width: rx * lerp4(0.17, 0.43, unit2(value.extent)),
      height: ry * lerp4(0.058, 0.172, unit2(value.extent))
    };
  }
  function solveMakeup(face, opening, value, options2 = {}) {
    const requested = normalizeMakeup(value);
    const effective = {};
    const geometry2 = {};
    const { lips: lips2, shadow: shadow2, liner: liner2, blush: blush2, paint: paint2 } = requested;
    if (lips2.enabled && lips2.intensity && (lips2.coverage || lips2.edge)) {
      geometry2.lips = lipGeometry(face, options2);
      const { paths, box, volumes: volumes2 } = geometry2.lips;
      if (paths.length) effective.lips = {
        width: n(box.right - box.left),
        coverage: lips2.coverage,
        edges: volumes2.map((volume) => n(volume * 0.6 * unit2(lips2.edge)))
      };
    }
    if (shadow2.enabled && shadow2.intensity && shadow2.height && shadow2.extent || liner2.enabled && liner2.intensity && (liner2.top || liner2.bottom || liner2.wing)) {
      geometry2.eyes = eyeGeometry(face, opening, shadow2, liner2, options2.detailResult);
      if (shadow2.enabled && shadow2.intensity && shadow2.height && shadow2.extent) {
        effective.shadow = geometry2.eyes.map(({ eyelid }) => ({
          rise: n(Math.max(...eyelid.map(({ y, top }) => y - top))),
          span: n(Math.abs(eyelid[0].x - eyelid.at(-1).x))
        }));
      }
      if (liner2.enabled && liner2.intensity && (liner2.top || liner2.bottom || liner2.wing)) {
        effective.liner = geometry2.eyes.map(({ topWidth, bottomWidth, wingLength }) => ({ top: n(topWidth), bottom: n(bottomWidth), wing: n(wingLength) }));
      }
    }
    if (blush2.enabled && blush2.intensity || paint2.enabled && paint2.elements.some((item) => item.intensity)) {
      geometry2.cutaneous = marksFrame(face, opening, options2);
      if (blush2.enabled && blush2.intensity) {
        const { positions, width, height } = cheekGeometry(geometry2.cutaneous, blush2);
        effective.blush = { positions: positions.map((point3) => point3.map(n)), width: n(width), height: n(height) };
      }
      if (paint2.enabled) effective.paint = paint2.elements.map((item) => {
        if (!item.intensity) return null;
        const { transforms, size, stretch, rotation, weight, mirror } = facePaint(geometry2.cutaneous, item);
        return {
          transforms: transforms.map((point3) => point3.map(n)),
          size: n(size),
          stretch: n(stretch),
          rotation,
          weight: weight == null ? null : n(weight),
          mirror
        };
      });
    }
    return { requested, effective, geometry: geometry2 };
  }
  function makeupFor(input, eyes2, makeup, { details: details2, mouth, nose } = {}) {
    const face = model8(input), opening = eyesFor(input, eyes2);
    const detailResult = solveDetails(opening, details2);
    const noseResult = solveNose(face, opening, nose, { mouth, eyeDetails: detailResult });
    const mouthResult = solveMouth(face, opening, mouth, { noseBounds: noseResult?.geometry.anatomy, preserveMouth: !!noseResult });
    return solveMakeup(face, opening, makeup, { noseResult, mouthResult, detailResult });
  }
  function makeupPlane(input, eyes2) {
    return marksFrame(model8(input), eyesFor(input, eyes2)).plane;
  }
  function drawLips(result, id, mask) {
    const { requested: { lips: lips2 }, effective, geometry: geometry2 } = result;
    if (!effective.lips) return "";
    const { paths, box, separator } = geometry2.lips;
    const cx = (box.left + box.right) / 2, cy = (box.top + box.bottom) / 2;
    const coverage = unit2(lips2.coverage);
    const transform = `translate(${cx} ${cy}) scale(${lerp4(0.41, 1, coverage)} ${lerp4(0.49, 1, coverage)}) translate(${-cx} ${-cy})`;
    const ink = paths.map((d, i) => path4(d, `fill="${lips2.colour}" opacity="${i ? 0.82 : 0.96}"`)).join("");
    const outline3 = paths.map((d, i) => path4(
      d,
      `fill="none" stroke="${lips2.edgeColour}" stroke-width="${2 * effective.lips.edges[i]}" stroke-linejoin="round"`
    )).join("");
    return `<g data-makeup-family="lips" mask="url(#${id}-base)"><defs><clipPath id="${id}-lips">${paths.map((d) => path4(d, "")).join("")}</clipPath>
    ${mask(id + "-seam", separator)}</defs><g clip-path="url(#${id}-lips)"><g mask="url(#${id}-seam)" opacity="${unit2(lips2.intensity)}">
    ${lips2.coverage ? `<g transform="${transform}">${ink}</g>` : ""}${lips2.edge ? outline3 : ""}</g></g></g>`;
  }
  function drawShadow(eyes2, value, id, bounds3) {
    return eyes2.map(({ eyelid, side }, index) => {
      const key = id + "-shadow-" + index;
      const top = Math.min(...eyelid.map((p) => p.top)), bottom = Math.max(...eyelid.map((p) => p.y));
      if (top === bottom) return "";
      const ink = path4(
        polygon2([...eyelid.map((p) => [p.x, p.top]), ...eyelid.slice().reverse().map((p) => [p.x, p.y])]),
        `fill="url(#${key}-pigment)"`
      );
      const outer = unit2(value.outer), centre = 1 - outer * 0.66;
      return `<defs><linearGradient id="${key}-fade" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="${top}" y2="${bottom}">
      <stop stop-color="white" stop-opacity="0"/><stop offset=".36" stop-color="white" stop-opacity=".52"/><stop offset="1" stop-color="white"/>
      </linearGradient><mask id="${key}-soft" maskUnits="userSpaceOnUse" ${bounds3}><rect ${bounds3} fill="url(#${key}-fade)"/></mask>
      <linearGradient id="${key}-pigment" x1="${side < 0 ? 1 : 0}" x2="${side < 0 ? 0 : 1}" y1="0" y2="0">
      <stop stop-color="${value.colour}" stop-opacity="${centre}"/><stop offset=".38" stop-color="${value.colour}" stop-opacity="${lerp4(centre, 1, 0.5)}"/>
      <stop offset="1" stop-color="${value.accent ?? value.colour}"/></linearGradient></defs>
      <g mask="url(#${key}-soft)" opacity="${0.85 * unit2(value.intensity)}">${ink}</g>`;
    }).join("");
  }
  function drawLiner(eyes2, value) {
    return eyes2.map(({ upper, lower, topWidth, bottomWidth, wing, wingLength }) => {
      const trace2 = (d, width) => width ? path4(d, `fill="none" stroke="${value.colour}" stroke-width="${2 * width}" stroke-linejoin="round" stroke-linecap="round"`) : "";
      return `<g opacity="${unit2(value.intensity)}">${trace2(upper, topWidth)}${trace2(lower, bottomWidth)}
      ${wingLength > 0 ? path4(polygon2(wing), `fill="${value.colour}"`) : ""}</g>`;
    }).join("");
  }
  function drawBlush(geometry2, value, id) {
    const { width, height, positions } = geometry2;
    const diffusion = unit2(value.diffusion), centre = 0.61 * unit2(value.intensity);
    return `<defs><radialGradient id="${id}-cheek"><stop stop-color="${value.colour}" stop-opacity="${centre}"/>
    <stop offset="${lerp4(0.66, 0.1, diffusion)}" stop-color="${value.colour}" stop-opacity="${centre * 0.77}"/>
    <stop offset="${lerp4(0.88, 0.63, diffusion)}" stop-color="${value.colour}" stop-opacity="${centre * 0.26}"/>
    <stop offset="1" stop-color="${value.colour}" stop-opacity="0"/></radialGradient></defs>` + positions.map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="${width}" ry="${height}" transform="rotate(${i ? -23 : 23} ${x} ${y})" fill="url(#${id}-cheek)"/>`).join("");
  }
  var star2 = polygon2(Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 === 0 ? 0.97 : 0.41, angle2 = (i / 5 - 0.5) * Math.PI;
    return [radius * Math.cos(angle2), radius * Math.sin(angle2)];
  }));
  var closedPaint = {
    triangle: "M0,-.96 L.95,.75 L-.95,.75Z",
    diamond: "M0,-.98 L.77,0 L0,.98 L-.77,0Z",
    star: star2
  };
  var tracedPaint = {
    line: "M-.87,0 H.87",
    arc: "M-.83,.48 A.90,.95 0 0 1 .83,.48",
    wave: "M-.92,.29 C-.60,.29 -.62,-.51 -.29,-.51 S.02,.51 .32,.51 S.61,-.29 .92,-.29",
    zigzag: "M-.9,.39 L-.48,-.43 L-.05,.39 L.40,-.43 L.90,.39"
  };
  function paintPrimitive(item, geom) {
    const { shape, colour: colour2 } = item;
    const fill = `fill="${colour2}"`;
    const stroke2 = `fill="none" stroke="${colour2}" stroke-width="${geom.weight}" stroke-linejoin="round" stroke-linecap="round"`;
    if (shape === "point" || shape === "circle") return `<circle r=".95" ${fill}/>`;
    if (shape === "ring") return `<circle r="${n(0.95 - geom.weight / 2)}" ${stroke2}/>`;
    if (shape === "stripe") {
      const thickness = geom.weight * 2.16;
      return `<rect x="-.96" y="${-thickness / 2}" width="1.92" height="${thickness}" rx=".07" ${fill}/>`;
    }
    if (shape === "crescent") {
      const inner = n(lerp4(-0.64, 0.68, geom.weight / 0.49));
      return path4(`M.67,-.72 C-1.33,-1.59 -1.33,1.59 .67,.72 C${inner},.43 ${inner},-.43 .67,-.72Z`, fill);
    }
    if (closedPaint[shape]) return path4(closedPaint[shape], fill);
    return path4(tracedPaint[shape], stroke2);
  }
  function drawPaint(elements2, geometry2) {
    return elements2.map((item, i) => {
      const geom = geometry2[i];
      if (!geom) return "";
      const primitive = paintPrimitive(item, geom);
      const copies = geom.transforms.map(([x, y, side]) => `<g data-makeup-mirror="${side < 0}" transform="translate(${x} ${y}) scale(${side} 1) rotate(${geom.rotation}) scale(${geom.size * geom.stretch} ${geom.size})">${primitive}</g>`).join("");
      return `<g data-makeup-shape="${item.shape}" data-makeup-index="${i}" opacity="${unit2(item.intensity)}">${copies}</g>`;
    }).join("");
  }
  function makeupMarkup(face, opening, value, { instance, painted, ...options2 }) {
    if (!hasMakeup(value)) return "";
    const result = solveMakeup(face, opening, value, options2);
    const { requested, effective, geometry: geometry2 } = result;
    if (!Object.keys(effective).length) return "";
    const reserve3 = scarReserves(face, opening, options2);
    const details2 = options2.detailResult;
    const contour2 = details2 ? [0, 1].map((index) => black2(detailContourMarkup(details2, index))).join("") : "";
    const browPattern = painted.includes("data-bio-brows=") ? /<path data-brow-side="[^"]+"[^>]*\/>/g : /<path d="[^"]+" fill="none" stroke="[^"]+" stroke-width="2\.[26]"[^>]*\/>/g;
    const brows = tags(painted, browPattern).map(black2).join("");
    const openings = reserve3.eyes.join("");
    const nostrils = reserve3.nostrils.map((tag) => tag.replace("/>", ' stroke="black" stroke-width=".92"/>')).join("");
    const lipReserve = (geometry2.lips?.paths ?? lipGeometry(face, options2).paths).map((d) => path4(d, 'fill="black"')).join("");
    const border = path4(face.outline, 'fill="white" stroke="black" stroke-width="4.2" stroke-linejoin="round"');
    const { cx, cy, rx, ry } = face.base.head;
    const bounds3 = `x="${cx - 2 * rx}" y="${cy - 2 * ry}" width="${4 * rx}" height="${4 * ry}"`;
    let hash = 2166136261;
    for (const ch of face.outline + openings + nostrils + lipReserve + contour2 + brows + JSON.stringify(requested)) {
      hash = Math.imul(hash ^ ch.charCodeAt(0), 16777619);
    }
    const id = "bio-makeup-" + String(instance ?? "default").replace(/[^a-z0-9_-]/gi, "-") + "-" + (hash >>> 0).toString(36);
    const mask = (key, ink, base2 = `<rect ${bounds3} fill="white"/>`) => `<mask id="${key}" maskUnits="userSpaceOnUse" ${bounds3} style="mask-type:luminance">${base2}${ink}</mask>`;
    const family = (key, stencil, ink) => `<g data-makeup-family="${key}" mask="url(#${id}-${stencil})">${ink}</g>`;
    const base = openings + nostrils;
    const skin = base + lipReserve + reserve3.lips.join("") + contour2 + brows;
    return `<g data-bio-makeup="" pointer-events="none"><defs>${mask(id + "-base", base, border)}${mask(id + "-skin", skin, border)}
    ${mask(id + "-eye", base + contour2 + brows, border)}</defs>
    ${effective.blush ? family("blush", "skin", drawBlush(effective.blush, requested.blush, id)) : ""}
    ${effective.paint?.some(Boolean) ? family("paint", "skin", drawPaint(requested.paint.elements, effective.paint)) : ""}
    ${effective.shadow ? family("shadow", "eye", drawShadow(geometry2.eyes, requested.shadow, id, bounds3)) : ""}
    ${effective.liner ? family("liner", "eye", drawLiner(geometry2.eyes, requested.liner)) : ""}
    ${drawLips(result, id, mask)}</g>`;
  }

  // bio-yeux-01/render.mjs
  function clipId(path5, instance, index) {
    let hash = 2166136261;
    for (const character13 of path5) hash = Math.imul(hash ^ character13.charCodeAt(0), 16777619);
    const prefix = String(instance ?? "default").replace(/[^a-z0-9_-]/gi, "-");
    return "bio-yeux-" + prefix + "-" + index + "-" + (hash >>> 0).toString(36);
  }
  function ellipsePath(ellipse3) {
    const [, x, y, rx, ry] = ellipse3.match(/cx="([^"]+)" cy="([^"]+)" rx="([^"]+)" ry="([^"]+)"/);
    return `M${x},${y}m${-rx},0 a${rx},${ry} 0 1 0 ${2 * rx},0 a${rx},${ry} 0 1 0 ${-2 * rx},0Z`;
  }
  function replaceOpenings(face, geometry2, instance, drawIris2, details2, natural) {
    const { shapes: shapes2 } = geometry2;
    const outlineFrame = natural && !details2 ? detailFrame(geometry2) : null;
    let index = 0;
    const pairs = new RegExp(
      '(<ellipse [^>]*fill="' + palette2.white + '"[^>]*\\/>)(<ellipse [^>]*fill="' + palette2.pupil + '"[^>]*\\/>)',
      "g"
    );
    const result = face.replace(pairs, (_, white, pupil) => {
      const shape = shapes2[index];
      const ink = drawIris2 ? drawIris2(index) : pupil;
      const id = clipId(shape?.path ?? white, instance, index);
      const aperture = shape ? `<path d="${shape.path}"/>` : white;
      const opening = shape?.path ?? (details2 || natural ? ellipsePath(white) : null);
      const outside = details2 ? detailsMarkup(details2, index, opening, id, palette2.skin, natural) : outlineFrame ? naturalOutlineMarkup(outlineFrame, index, opening, id, natural) : "";
      index++;
      if (!shape) {
        if (!drawIris2) return outside + white + pupil;
        return `${outside}${white}<defs><clipPath id="${id}">${white}</clipPath></defs><g clip-path="url(#${id})">${ink}</g>`;
      }
      const stroke2 = details2 || natural ? "" : ` stroke="${palette2.pupil}" stroke-width="${eyeStroke}" stroke-linejoin="round"`;
      return `<g data-bio-eye="${index === 1 ? "left" : "right"}"><defs><clipPath id="${id}">${aperture}</clipPath></defs>${outside}<path d="${shape.path}" fill="${palette2.white}"${stroke2}/><g clip-path="url(#${id})">${ink}</g></g>`;
    });
    if (index !== 2) throw new Error("Ouvertures historiques introuvables");
    return result;
  }
  function replaceBrows(face, model9, markup) {
    const { head: { rx }, anchors: { browLeft, browRight }, parameters } = model9.base;
    const sharp = parameters.eyes === "sharp", width = rx * 0.26;
    const starts = [browLeft, browRight].map(([x, y], i) => sharp ? `${x - width},${y - 2 * (i === 0 ? 1 : -1)}` : `${x - width * 0.9},${y}`);
    let count = 0;
    const result = face.replace(/<path d="M([^ ]+) [^"]+" fill="none" stroke="[^"]+" stroke-width="2\.[26]"[^>]*\/>/g, (tag, start) => {
      if (!starts.includes(start)) return tag;
      return count++ === 0 ? markup : "";
    });
    if (count !== 2) throw new Error("Sourcils historiques introuvables.");
    return result;
  }
  function guides({ envelopes: envelopes2, nose, maxWidth, maxHeight }) {
    const lines2 = envelopes2.map(({ x, y, left, top, right, bottom }) => {
      const cross = `M${x - 1.6},${y}h3.2 M${x},${y - 1.6}v3.2`;
      const dimensions2 = `M${x - maxWidth / 2},${top - 1}h${maxWidth} M${left - 1},${y - maxHeight / 2}v${maxHeight}`;
      return `<rect x="${left}" y="${top}" width="${right - left}" height="${bottom - top}" stroke-dasharray="1.2 .8"/><path d="${cross} ${dimensions2}"/>`;
    }).join("");
    return `<g data-eye-envelopes="" aria-hidden="true" fill="none" stroke="#146b9c" stroke-width=".48" pointer-events="none">${lines2}<path d="M${nose.left},${nose.top + 2}v-2H${nose.right}v2" stroke-dasharray=".8 .6"/></g>`;
  }
  function character12(input = {}, options2 = {}) {
    const inheritedSvg = character11(input, options2);
    const adultFace = isAdultBody(input.body) ? model8(input) : null;
    const svg2 = adultFace ? inheritedSvg.replace(
      /<g class="body-shape">[^]*?<\/g>/,
      () => adultBodyMarkup(
        input.body,
        adultFace.anchors.chin,
        palette2,
        input.structure,
        input.corpulence,
        options2.beforeCorpulenceCorrection,
        input.chest,
        options2.chestStudySkin
      )
    ) : inheritedSvg;
    const selected = normalizeEyes(options2.eyes);
    const hasIris = options2.iris != null && options2.iris !== "historical";
    const hasDetails = options2.details != null && options2.details !== "historical";
    const hasBrows = options2.brows != null && options2.brows !== "historical";
    const hasMouth = options2.mouth != null && options2.mouth !== "historical";
    const hasNose = options2.nose != null && options2.nose !== "historical";
    const category2 = options2.beardCategory ?? input.beardCategory;
    const hasBeard = options2.beard != null && options2.beard !== "historical" && beardCategoryOf(category2) !== "F";
    const hasMarks = options2.marks != null && options2.marks !== "historical" && options2.marks.length !== 0;
    const hasScars = options2.scars != null && options2.scars !== "historical" && options2.scars.length !== 0;
    const makeup = options2.makeup && normalizeMakeup(options2.makeup);
    const hasCosmetics = hasMakeup(makeup);
    const natural = options2.naturalEyes ? { skin: options2.contourSkin ?? palette2.skin, smallScale: options2.smallScale === true } : null;
    if (!natural && !selected && !options2.eyeEnvelopes && !hasIris && !hasDetails && !hasBrows && !hasMouth && !hasNose && !hasBeard && !hasMarks && !hasScars && !hasCosmetics) return svg2;
    const geometry2 = eyesFor(input, selected);
    let result = svg2;
    if (natural || selected || hasIris || hasDetails || hasBrows || hasMouth || hasNose || hasBeard || hasMarks || hasScars || hasCosmetics) {
      const face = adultFace ?? model8(input);
      const originalFace = headMarkup(face.base).replace(/<path d="[^"]*"/, `<path d="${face.outline}"`);
      if (!svg2.includes(originalFace)) throw new Error("Visage historique introuvable");
      const iris = hasIris ? solveIris(geometry2, options2.iris) : null;
      const centers = iris ? pigmentCenters(geometry2) : [];
      const drawIris2 = iris ? (index) => irisMarkup(iris, centers[index], index) : null;
      const details2 = hasDetails ? solveDetails(geometry2, options2.details) : null;
      const brows = hasBrows ? solveBrows(face, geometry2, options2.brows, { ...options2, source: svg2 }) : null;
      let updatedFace = brows ? replaceBrows(originalFace, face, browMarkup(brows)) : originalFace;
      const nose = hasNose ? solveNose(face, geometry2, options2.nose, { mouth: options2.mouth, eyeDetails: details2, markup: originalFace }) : null;
      if (nose) updatedFace = updatedFace.replace(inheritedNose(face, originalFace).tag, noseMarkup(nose));
      const mouth = hasMouth ? solveMouth(
        face,
        geometry2,
        options2.mouth,
        { markup: originalFace, noseBounds: nose?.geometry.anatomy, preserveMouth: !!nose }
      ) : null;
      if (mouth) updatedFace = updatedFace.replace(inheritedMouth(face, originalFace).tag, mouthMarkup(mouth));
      if (natural || selected || hasIris || hasDetails) {
        updatedFace = replaceOpenings(updatedFace, geometry2, options2.instance, drawIris2, details2, natural);
      }
      if (hasMarks) updatedFace += marksMarkup(
        solveMarks(
          face,
          geometry2,
          options2.marks,
          { markup: originalFace, noseResult: nose, mouthResult: mouth }
        ),
        { skin: options2.markStudySkin, scale: options2.smallScale ? "mini" : options2.headOnly ? "head" : "body" }
      );
      if (hasScars) {
        const anatomy = { markup: originalFace, noseResult: nose, mouthResult: mouth };
        updatedFace += scarsMarkup(solveScars(face, geometry2, options2.scars, anatomy), {
          face,
          opening: geometry2,
          ...anatomy,
          instance: options2.instance,
          skin: options2.scarStudySkin,
          scale: options2.smallScale ? "mini" : options2.headOnly ? "head" : "body"
        });
      }
      if (hasCosmetics) updatedFace += makeupMarkup(face, geometry2, makeup, {
        markup: originalFace,
        painted: updatedFace,
        mouthResult: mouth,
        noseResult: nose,
        detailResult: details2,
        instance: options2.instance
      });
      if (hasBeard) updatedFace += beardMarkup(solveBeard(
        face,
        geometry2,
        options2.beard,
        { ...options2, category: category2, source: svg2, markup: originalFace, detailResult: details2, noseResult: nose, mouthResult: mouth }
      ));
      result = svg2.replace(originalFace, updatedFace);
    }
    if (options2.eyeEnvelopes) result = result.replace(/<\/svg>$/, guides(geometry2.face) + "</svg>");
    return result;
  }

  // bio-yeux-01/body-study.mjs
  function guidesMarkup(body, chin) {
    const { levels, ground } = adultBodyGeometry(body, chin);
    const pelvis = levels.at(-1);
    const rules = levels.map(({ id, y, width }, index) => `
    <g data-body-level="${id}">
      <line x1="14" y1="${y}" x2="146" y2="${y}" stroke-dasharray="3 2"/>
      <circle cx="${ground.x - width}" cy="${y}" r="1.7"/>
      <circle cx="${ground.x + width}" cy="${y}" r="1.7"/>
      <text x="6" y="${y}" dominant-baseline="middle">${index + 1}</text>
    </g>`).join("");
    return `<g class="body-guides" data-body-guides="" aria-hidden="true">
    ${rules}
    <path data-pawn-base="" d="M140,${pelvis.y}h6V${ground.y}h-6"/>
    <line x1="${ground.x}" y1="${ground.y}" x2="146" y2="${ground.y}" stroke-dasharray="3 2"/>
    <circle data-ground-anchor="" cx="${ground.x}" cy="${ground.y}" r="2.5"/>
  </g>`;
  }
  function renderBodyStudy(panel, { render, chin, bodies: bodies2, background }) {
    if (!panel.open) return;
    const diagrams = panel.querySelector("#body-diagrams");
    const comparisons = panel.querySelector("#body-comparison");
    diagrams.className = `body-diagrams ${background}`;
    comparisons.className = `body-comparison ${background}`;
    diagrams.innerHTML = Object.entries(adultBodies).map(([body, { name }]) => {
      const portrait3 = render({ body, view: "tile", frame: "-8 77 176 181" });
      return `<figure><div class="surface">${portrait3.replace("</svg>", guidesMarkup(body, chin) + "</svg>")}</div>
      <figcaption>${name}</figcaption></figure>`;
    }).join("");
    const scales = [["head", "T\xEAte", "300 px"], ["tile", "Corps", "178 px"], ["mini", "Miniature", "70 \xD7 70 px"]];
    comparisons.innerHTML = Object.entries({ ...adultBodies, ...bodies2 }).map(([body, { name }]) => `
    <article class="card" data-body-specimen="${body}">
      <h3>${name}</h3>
      <div class="body-scales">${scales.map(([view, caption, size]) => `
        <figure><div class="surface ${view}">${render({ body, view })}</div><figcaption>${caption}<span>${size}</span></figcaption></figure>
      `).join("")}</div>
    </article>`).join("");
  }
  function mountBodyStudy(panel, repaint) {
    panel.querySelector("#body-level-list").replaceChildren(...anatomyLevels.map(({ label }) => {
      const item = document.createElement("li");
      item.textContent = label;
      return item;
    }));
    mountStudyPanel(panel, repaint);
  }
  function mountStudyPanel(panel, repaint) {
    panel.addEventListener("toggle", () => {
      if (panel.open) repaint();
    });
    const fragment = "#" + panel.id;
    document.querySelector(`nav a[href="${fragment}"]`)?.addEventListener("click", () => {
      panel.open = true;
    });
    if (window.location.hash === fragment) panel.open = true;
  }

  // bio-yeux-01/structure-study.mjs
  var axes10 = Object.entries(structureControls);
  var profiles = [["adult-h", "H"], ["adult-f", "F"]];
  var percentages = (get) => Object.fromEntries(axes10.map(([key, range]) => [key, get(key, range)]));
  var structureCombinations = [
    ["reference", "R\xE9f\xE9rence", referenceStructure],
    ["fine", "Ossature fine", percentages((key) => key === "waist" ? 85 : 82)],
    ["wide", "Ossature large", percentages((key) => key === "waist" ? 115 : 118)],
    ["min", "Tous les minima", percentages((_, range) => range.min)],
    ["max", "Tous les maxima", percentages((_, range) => range.max)],
    ["upper", "Haut large, bassin \xE9troit", percentages((key, range) => ["neck", "shoulders", "thorax"].includes(key) ? range.max : range.min)],
    ["lower", "Haut \xE9troit, bassin large", percentages((key, range) => ["neck", "shoulders", "thorax"].includes(key) ? range.min : range.max)]
  ];
  function renderStructureStudy(panel, { render, background }) {
    const view = panel.querySelector("#structure-study-scale").value;
    const compare = (body, structure, caption) => `<figure data-structure-specimen="${body}">
    <div class="surface ${view}">${render({ body, structure, view })}</div><figcaption>${caption}</figcaption>
  </figure>`;
    const compound = panel.querySelector("#structure-combinations");
    compound.className = `structure-study-grid ${background}`;
    compound.innerHTML = structureCombinations.map(([id, label, structure]) => `
    <article class="card" data-structure-combination="${id}">
      <h4>${label}</h4><div class="structure-pair">${profiles.map(([body]) => compare(body, structure, adultBodies[body].name)).join("")}</div>
    </article>`).join("");
    const isolated = panel.querySelector("#structure-extremes");
    isolated.className = `structure-study-grid ${background}`;
    isolated.innerHTML = axes10.map(([key, { label, min, max }]) => `
    <article class="card" data-structure-extreme="${key}">
      <h4>${label}</h4><div class="structure-pair">${profiles.flatMap(([body, short]) => [min, max].map((value) => compare(body, { ...referenceStructure, [key]: value }, `${short} \xB7 ${value} %`))).join("")}</div>
    </article>`).join("");
  }

  // bio-yeux-01/corpulence-study.mjs
  var corpulenceStudyStructures = structureCombinations.map(([id, label]) => [id, id === "reference" ? "Ossature standard" : label]);
  var phases = [["before", "Avant \xB7 BIO-CORPS-03"], ["after", "Apr\xE8s \xB7 R01"]];
  var percentage = new Intl.NumberFormat("fr-FR");
  function renderCorpulenceStudy(panel, { render, background }) {
    const view = panel.querySelector("#corpulence-study-scale").value;
    const selected = panel.querySelector("#corpulence-study-structure").value;
    const [, , structure] = structureCombinations.find(([id]) => id === selected);
    const container = panel.querySelector("#corpulence-references");
    container.className = `structure-study-grid ${background}`;
    container.innerHTML = corpulenceStops.map(({ value, label }) => `
    <article class="card" data-corpulence-example="${value}">
      <h4>${percentage.format(value)} % \xB7 ${label}</h4>
      ${Object.entries(adultBodies).map(([body, { name }]) => `
        <section class="corpulence-study-pair" data-corpulence-specimen="${body}">
          <h5>${name}</h5>
          <div class="structure-pair">${phases.map(([phase, caption]) => `
            <figure data-corpulence-phase="${phase}">
              <div class="surface ${view}">${render({
      key: "shaved:U",
      body,
      structure,
      corpulence: value,
      view,
      beforeCorpulenceCorrection: phase === "before"
    })}</div>
              <figcaption>${caption}</figcaption>
            </figure>`).join("")}</div>
        </section>`).join("")}
    </article>`).join("");
  }

  // bio-yeux-01/marks-study.mjs
  var freckleCases = Object.freeze([
    { label: "Neutre \xB7 Miel \xB7 Amande", skin: "#dbbf88", seed: "Amande", face: { style: "p5-038" } },
    { label: "Visage long \xB7 Ros\xE9e \xB7 Iris", skin: "#f4cfb6", seed: "Iris", face: { ...presets2.tall.values, style: "shaved" } },
    { label: "Visage large \xB7 Cuivr\xE9e \xB7 Argile", skin: "#a57155", seed: "Argile", face: { ...presets2.broad.values, style: "p5-041" } },
    { label: "Pommettes marqu\xE9es \xB7 Brune \xB7 Sienne", skin: "#573222", seed: "Sienne", face: {
      cheek_width: 1.14,
      temple_width: 0.84,
      jaw_width: 0.83,
      skull_height: 1.14,
      skull_width: 0.92,
      style: "p5-024"
    } }
  ]);
  var freckleDensities = Object.freeze([[27, "Faible"], [59, "Moyenne"], [100, "Forte"]]);
  var freckleViews = Object.freeze([
    ["close", "Gros plan", "48 60 64 38", { headOnly: true }],
    ["head", "T\xEAte \xB7 300 px", "-30 -65 220 225", { headOnly: true }],
    ["body", "Corps \xB7 178 px", "-40 -85 240 355", {}],
    ["mini", "Miniature \xB7 70 \xD7 70 px", "-35 -68 230 245", { headOnly: true, smallScale: true }]
  ]);
  function studyPortrait(study, density, view, naturalEyes2 = false) {
    const [key, , frame, scale] = view;
    const marks = [{ id: "m1", type: "freckles", seed: study.seed, density }];
    const svg2 = character12(study.face, { ...scale, marks, markStudySkin: study.skin, naturalEyes: naturalEyes2, contourSkin: study.skin, instance: "planche-" + key }).replace(/viewBox="[^"]*"/, `viewBox="${frame}"`);
    return studySkin(svg2, study.skin);
  }
  function studySkin(svg2, skin) {
    if (skin === palette2.skin) return svg2;
    const reference = rgb(palette2.skin), next = rgb(skin);
    const tint = (hex) => "#" + rgb(hex).map((channel, i) => Math.round(255 * channel * next[i] / reference[i]).toString(16).padStart(2, "0")).join("");
    return svg2.replaceAll(palette2.skin, skin).replaceAll(palette2.contour, tint(palette2.contour));
  }
  function mountFreckleStudy(naturalEyes2 = false) {
    const list2 = document.getElementById("freckle-case"), gallery = document.getElementById("freckle-study");
    list2.append(...freckleCases.map((study, i) => new Option(study.label, String(i))));
    function refresh() {
      const study = freckleCases[Number(list2.value)];
      gallery.innerHTML = freckleDensities.map(([density, label]) => `<article class="freckle-row" data-density="${density}"><h3>Densit\xE9 ${label.toLowerCase()}</h3><div class="freckle-scales">` + freckleViews.map((view) => `<figure class="freckle-${view[0]}">${studyPortrait(study, density, view, naturalEyes2)}<figcaption>${view[1]}</figcaption></figure>`).join("") + "</div></article>").join("");
    }
    list2.addEventListener("change", refresh);
    refresh();
  }

  // bio-yeux-01/chest-study.mjs
  var volumes = [[26, "Petite"], [53, "Moyenne"], [88, "Grosse"]];
  var chestStudySkins = freckleCases.map(({ skin, label }) => [skin, label.split(" \xB7 ")[1]]);
  var cases = [
    ["chest-form-cases", [
      ...chestPresets.flatMap(([id, label, form]) => volumes.map(([volume, size]) => ({
        id: `${id}-${volume}`,
        label: `${label} \xB7 ${size}`,
        chest: { ...form, volume }
      }))),
      { id: "flat", label: "Plate \xB7 0 %", chest: referenceChest }
    ]],
    ["chest-corpulence-cases", [0, 50, 100].flatMap((corpulence) => volumes.map(([volume, size]) => ({
      id: `corpulence-${corpulence}-${volume}`,
      label: `${size} \xB7 Corpulence ${corpulence} %`,
      chest: { ...referenceChest, volume },
      corpulence
    })))],
    ["chest-structure-cases", structureCombinations.slice(0, 3).flatMap(([id, label, structure]) => volumes.map(([volume, size]) => ({
      id: `structure-${id}-${volume}`,
      label: `${size} \xB7 ${id === "reference" ? "Ossature standard" : label}`,
      chest: { ...referenceChest, volume },
      structure
    })))]
  ];
  function renderChestStudy(panel, { render, background }) {
    const choice2 = panel.querySelector("#chest-study-scale").value;
    const view = choice2 === "detail" ? "tile" : choice2;
    const frame = choice2 === "detail" ? "17 106 126 81" : void 0;
    const skin = panel.querySelector("#chest-study-skin").value;
    for (const [section, specimens] of cases) {
      const gallery = panel.querySelector("#" + section);
      gallery.className = `structure-study-grid ${background}`;
      gallery.innerHTML = specimens.map(({ id, label, chest, structure, corpulence }) => `<figure class="card chest-specimen" data-chest-case="${id}">
      <div class="surface ${view}">${studySkin(render({ key: "shaved:U", body: "adult-f", view, frame, structure, corpulence, chest, chestStudySkin: skin }), skin)}</div>
      <figcaption>${label}</figcaption>
    </figure>`).join("");
    }
  }

  // bio-yeux-01/appearance.mjs
  var appearanceSchema = "microcosme.appearance";
  var appearanceVersion = 1;
  var renderVersion = "bio-yeux-01-svg@1";
  var irisAppearanceVersion = 2;
  var irisRenderVersion = "bio-yeux-02-svg@1";
  var detailsAppearanceVersion = 3;
  var detailsRenderVersion = "bio-yeux-03-svg@1";
  var browAppearanceVersion = 4;
  var browRenderVersion = "bio-sourcils-01-svg@1";
  var mouthAppearanceVersion = 5;
  var mouthRenderVersion = "bio-bouche-01-svg@1";
  var noseAppearanceVersion = 6;
  var noseRenderVersion = "bio-nez-01-svg@1";
  var beardAppearanceVersion = 7;
  var beardRenderVersion = "bio-pilosite-01-svg@1";
  var marksAppearanceVersion = 8;
  var marksRenderVersion = "bio-marques-01-svg@1";
  var scarAppearanceVersion = 9;
  var scarRenderVersion = "bio-cicatrices-01-svg@1";
  var makeupAppearanceVersion = 10;
  var makeupRenderVersion = "bio-maquillage-01-svg@1";
  var bodyAppearanceVersion = 11;
  var bodyRenderVersion = "bio-corps-01-svg@1";
  var structureAppearanceVersion = 12;
  var structureRenderVersion = "bio-corps-02-svg@1";
  var corpulenceAppearanceVersion = 13;
  var corpulenceRenderVersion = "bio-corps-03-svg@1";
  var chestAppearanceVersion = 14;
  var chestRenderVersion = "bio-corps-04-a-svg@1";
  var renderers = { 1: renderVersion, 2: irisRenderVersion, 3: detailsRenderVersion, 4: browRenderVersion, 5: mouthRenderVersion, 6: noseRenderVersion, 7: beardRenderVersion, 8: marksRenderVersion, 9: scarRenderVersion, 10: makeupRenderVersion, 11: bodyRenderVersion, 12: structureRenderVersion, 13: corpulenceRenderVersion, 14: chestRenderVersion };
  function characterInput(selection2, key = selection2.key) {
    const { style, arrangement } = choice(key);
    return {
      ...selection2.state,
      style,
      arrangement: arrangement === "U" ? "G" : arrangement,
      accessories: selection2.raw.accessories !== false,
      contrast: selection2.raw.contrast !== false
    };
  }
  function validDraw(draw2) {
    return draw2 && typeof draw2.seed === "string" && [currentDraw, legacyDraw].includes(draw2.version);
  }
  function appearanceDocument(selection2, {
    eyes: eyes2,
    form,
    draw: draw2,
    colour: colour2,
    flat,
    iris,
    irisLatent,
    irisDraw,
    details: details2,
    detailsLatent,
    detailsDraw,
    brows,
    browsLatent,
    browsDraw,
    mouth,
    mouthLatent,
    mouthDraw,
    nose,
    noseLatent,
    noseDraw,
    beard,
    beardLatent,
    beardDraw,
    beardCategory,
    marks,
    marksLatent,
    scars,
    scarsLatent,
    makeup,
    makeupLatent
  }) {
    const entry = choice(selection2.key);
    const input = characterInput(selection2);
    const applied = normalize9(input);
    const result = eyesFor(input, eyes2);
    if (result.effective && !Object.hasOwn(eyePresets, form) && !["custom", "minimum", "maximum"].includes(form)) {
      throw new RangeError("Forme d\u2019yeux inconnue.");
    }
    swatch(colour2);
    if (draw2 && !validDraw(draw2)) throw new RangeError("M\xE9tadonn\xE9es du tirage invalides.");
    const pigment3 = solveIris(result, iris);
    const latent = !pigment3 && normalizeIris(irisLatent);
    if (irisDraw && (typeof irisDraw.seed !== "string" || irisDraw.version !== irisDrawVersion || !(pigment3 || latent))) {
      throw new RangeError("M\xE9tadonn\xE9es du tirage des iris invalides.");
    }
    const ink = pigment3 ? { mode: "custom", requested: pigment3.requested, effective: pigment3.effective } : latent ? { mode: "historical", latent } : null;
    if (ink && irisDraw) ink.draw = { seed: irisDraw.seed, version: irisDraw.version };
    const ornament = solveDetails(result, details2);
    const remembered = !ornament && normalizeDetails(detailsLatent);
    const eyeDetails = ornament ? { mode: "custom", requested: ornament.requested, effective: ornament.effective } : remembered ? { mode: "historical", latent: remembered } : null;
    if (detailsDraw) {
      if (typeof detailsDraw.seed !== "string" || detailsDraw.version !== detailsDrawVersion || !eyeDetails) {
        throw new RangeError("M\xE9tadonn\xE9es du tirage des d\xE9tails invalides.");
      }
      eyeDetails.draw = { seed: detailsDraw.seed, version: detailsDraw.version };
    }
    const browResult = brows == null || brows === "historical" ? null : solveBrows(
      model8(input),
      result,
      brows,
      { hairColor: flat ? colour2 : "historical", rememberedHairColor: colour2 }
    );
    const browMemory = !browResult && normalizeBrows(browsLatent);
    const browAppearance = browResult ? {
      mode: "custom",
      requested: browResult.requested,
      effective: browResult.effective,
      pigment: browResult.pigment
    } : browMemory ? { mode: "historical", latent: browMemory } : null;
    if (browsDraw) {
      if (typeof browsDraw.seed !== "string" || browsDraw.version !== browDrawVersion || !browAppearance) {
        throw new RangeError("M\xE9tadonn\xE9es du tirage des sourcils invalides.");
      }
      browAppearance.draw = { seed: browsDraw.seed, version: browsDraw.version };
    }
    const noseResult = nose == null || nose === "historical" ? null : solveNose(model8(input), result, nose, { mouth, eyeDetails: ornament });
    const noseMemory = !noseResult && normalizeNose(noseLatent);
    const noseAppearance = noseResult ? {
      mode: "custom",
      requested: noseResult.requested,
      effective: noseResult.effective,
      anatomy: noseResult.geometry.anatomy
    } : noseMemory ? { mode: "historical", latent: noseMemory } : null;
    if (noseDraw) {
      if (typeof noseDraw.seed !== "string" || noseDraw.version !== noseDrawVersion || !noseAppearance) {
        throw new RangeError("M\xE9tadonn\xE9es du tirage du nez invalides.");
      }
      noseAppearance.draw = { seed: noseDraw.seed, version: noseDraw.version };
    }
    const mouthResult = mouth == null || mouth === "historical" ? null : solveMouth(
      model8(input),
      result,
      mouth,
      { noseBounds: noseResult?.geometry.anatomy, preserveMouth: !!noseResult }
    );
    const mouthMemory = !mouthResult && normalizeMouth(mouthLatent);
    const mouthAppearance = mouthResult ? { mode: "custom", requested: mouthResult.requested, effective: mouthResult.effective } : mouthMemory ? { mode: "historical", latent: mouthMemory } : null;
    if (mouthDraw) {
      if (typeof mouthDraw.seed !== "string" || mouthDraw.version !== mouthDrawVersion || !mouthAppearance) {
        throw new RangeError("M\xE9tadonn\xE9es du tirage de la bouche invalides.");
      }
      mouthAppearance.draw = { seed: mouthDraw.seed, version: mouthDraw.version };
    }
    const category2 = beardCategoryOf(beardCategory);
    const beardResult = normalizeBeard(beard) && solveBeard(model8(input), result, beard, {
      category: category2,
      hairColor: flat ? colour2 : "historical",
      rememberedHairColor: colour2,
      detailResult: ornament,
      noseResult,
      mouthResult
    });
    const beardMemory = !beardResult && normalizeBeard(beardLatent);
    const facialHair = beardResult ? {
      mode: "custom",
      category: category2,
      requested: beardResult.requested,
      effective: beardResult.effective,
      pigment: beardResult.pigment
    } : beardMemory || category2 !== "H" ? { mode: "historical", category: category2, ...beardMemory ? { latent: beardMemory } : {} } : null;
    if (beardDraw) {
      if (typeof beardDraw.seed !== "string" || beardDraw.version !== beardDrawVersion || !(beardMemory || beardResult)) {
        throw new RangeError("M\xE9tadonn\xE9es du tirage de la pilosit\xE9 invalides.");
      }
      facialHair.draw = { seed: beardDraw.seed, version: beardDraw.version };
    }
    const marksResult = normalizeMarks(marks).length ? solveMarks(model8(input), result, marks, { noseResult, mouthResult }) : null;
    const marksMemory = marksResult ? [] : normalizeMarks(marksLatent);
    const cutaneousMarks = marksResult ? { mode: "custom", requested: marksResult.requested, effective: marksResult.effective } : marksMemory.length ? { mode: "historical", latent: marksMemory } : null;
    const scarResult = normalizeScars(scars).length ? solveScars(model8(input), result, scars, { noseResult, mouthResult }) : null;
    const scarMemory = scarResult ? [] : normalizeScars(scarsLatent);
    const healedScars = scarResult ? { mode: "custom", requested: scarResult.requested, effective: scarResult.effective } : scarMemory.length ? { mode: "historical", latent: scarMemory } : null;
    const cosmetics = makeup ? solveMakeup(model8(input), result, makeup, { noseResult, mouthResult, detailResult: ornament }) : null;
    const cosmeticAppearance = cosmetics ? { mode: "custom", requested: cosmetics.requested, effective: cosmetics.effective } : makeupLatent ? { mode: "historical", latent: normalizeMakeup(makeupLatent) } : null;
    const adult = isAdultBody(input.body);
    const structure = adult && input.structure;
    const corpulence = adult ? input.corpulence : void 0;
    const chest = input.body === "adult-f" ? input.chest : void 0;
    const version = chest ? chestAppearanceVersion : corpulence !== void 0 ? corpulenceAppearanceVersion : structure ? structureAppearanceVersion : adult ? bodyAppearanceVersion : cosmeticAppearance ? makeupAppearanceVersion : healedScars ? scarAppearanceVersion : cutaneousMarks ? marksAppearanceVersion : facialHair ? beardAppearanceVersion : noseAppearance ? noseAppearanceVersion : mouthAppearance ? mouthAppearanceVersion : browAppearance ? browAppearanceVersion : eyeDetails ? detailsAppearanceVersion : ink ? irisAppearanceVersion : appearanceVersion;
    return {
      schema: appearanceSchema,
      version,
      renderer: renderers[version],
      character: {
        style: entry.style,
        arrangement: entry.arrangement,
        body: adult ? input.body : applied.body,
        ...structure ? { structure: { ...structure } } : {},
        ...corpulence !== void 0 ? { corpulence } : {},
        ...chest ? { chest: { ...chest } } : {},
        morphology: Object.fromEntries(Object.keys(controls).map((key) => [key, applied[key]])),
        options: { accessories: input.accessories, contrast: input.contrast, monochrome: input.monochrome === true },
        effectiveOptions: {
          accessories: applied.accessories !== false,
          contrast: applied.contrast !== false,
          monochrome: applied.monochrome === true
        }
      },
      eyes: result.effective ? {
        mode: "custom",
        form,
        effective: { ...result.effective },
        requested: { ...result.requested },
        ...draw2 ? { draw: { seed: draw2.seed, version: draw2.version } } : {}
      } : { mode: "historical" },
      palette: { colour: colour2, mode: flat ? "flat" : "historical" },
      ...ink ? { iris: ink } : {},
      ...eyeDetails ? { details: eyeDetails } : {},
      ...browAppearance ? { brows: browAppearance } : {},
      ...mouthAppearance ? { mouth: mouthAppearance } : {},
      ...noseAppearance ? { nose: noseAppearance } : {},
      ...facialHair ? { facialHair } : {},
      ...cutaneousMarks ? { marks: cutaneousMarks } : {},
      ...healedScars ? { scars: healedScars } : {},
      ...cosmeticAppearance ? { makeup: cosmeticAppearance } : {},
      historicalSelection: structuredClone(selection2.raw)
    };
  }
  function identical(a, b) {
    if (a === b) return true;
    if (!a || !b || typeof a !== "object" || typeof b !== "object" || Array.isArray(a) !== Array.isArray(b)) return false;
    const keys2 = Object.keys(a);
    return keys2.length === Object.keys(b).length && keys2.every((key) => Object.hasOwn(b, key) && identical(a[key], b[key]));
  }
  function parseAppearance(text) {
    const data = JSON.parse(text);
    if (data?.schema !== appearanceSchema) throw new Error("Document d\u2019apparence requis. Utilisez la s\xE9lection historique pour un ancien JSON.");
    if (!Number.isInteger(data.version) || !Object.hasOwn(renderers, data.version) || data.version === irisAppearanceVersion && !data.iris || data.version === detailsAppearanceVersion && !data.details || data.version === browAppearanceVersion && !data.brows || data.version === mouthAppearanceVersion && !data.mouth || data.version === noseAppearanceVersion && !data.nose || data.version === beardAppearanceVersion && !data.facialHair || data.version === marksAppearanceVersion && !data.marks || data.version === scarAppearanceVersion && !data.scars || data.version === makeupAppearanceVersion && !data.makeup) {
      throw new Error("Version du document d\u2019apparence non prise en charge.");
    }
    if (data.renderer !== renderers[data.version]) throw new Error("Version de rendu non prise en charge.");
    const adultFormat = data.version >= bodyAppearanceVersion;
    const adultBody = adultFormat ? data.character?.body : void 0;
    if (adultFormat && !isAdultBody(adultBody)) {
      throw new Error("Base adulte du document d\u2019apparence inconnue.");
    }
    const hasStructure = data.version === structureAppearanceVersion || data.version >= corpulenceAppearanceVersion && Object.hasOwn(data.character, "structure");
    const structure = hasStructure ? validateStructure(data.character.structure) : void 0;
    const hasCorpulence = data.version === corpulenceAppearanceVersion || data.version === chestAppearanceVersion && Object.hasOwn(data.character, "corpulence");
    const corpulence = hasCorpulence ? validateCorpulence(data.character.corpulence) : void 0;
    if (data.version === chestAppearanceVersion && adultBody !== "adult-f") throw new Error("Poitrine indisponible pour cette base.");
    const chest = data.version === chestAppearanceVersion ? validateChest(data.character.chest) : void 0;
    const selection2 = restoreSelection2(data.historicalSelection, adultBody, structure, corpulence, chest);
    if (!data.eyes || !["historical", "custom"].includes(data.eyes.mode) || !data.palette || !["flat", "historical"].includes(data.palette.mode)) {
      throw new Error("Mode des yeux ou de la palette invalide.");
    }
    const settings = {
      eyes: data.eyes.mode === "historical" ? null : data.eyes.requested,
      form: data.eyes.mode === "historical" ? "historical" : data.eyes.form,
      draw: data.eyes.draw,
      colour: data.palette.colour,
      flat: data.palette.mode === "flat"
    };
    if (data.version >= irisAppearanceVersion && data.iris) {
      if (!data.iris || !["custom", "historical"].includes(data.iris.mode)) throw new Error("Mode des iris invalide.");
      settings.iris = data.iris.mode === "custom" ? data.iris.requested : null;
      settings.irisLatent = data.iris.mode === "historical" ? data.iris.latent : null;
      settings.irisDraw = data.iris.draw;
    }
    if (data.version >= detailsAppearanceVersion && data.details) {
      if (!["custom", "historical"].includes(data.details.mode)) throw new Error("Mode des d\xE9tails invalide.");
      settings.details = data.details.mode === "custom" ? data.details.requested : null;
      settings.detailsLatent = data.details.mode === "historical" ? data.details.latent : null;
      settings.detailsDraw = data.details.draw;
    }
    if (data.version >= browAppearanceVersion && data.brows) {
      if (!["custom", "historical"].includes(data.brows.mode)) throw new Error("Mode des sourcils invalide.");
      settings.brows = data.brows.mode === "custom" ? data.brows.requested : null;
      settings.browsLatent = data.brows.mode === "historical" ? data.brows.latent : null;
      settings.browsDraw = data.brows.draw;
    }
    if (data.version >= mouthAppearanceVersion && data.mouth) {
      if (!["custom", "historical"].includes(data.mouth.mode)) throw new Error("Mode de bouche invalide.");
      settings.mouth = data.mouth.mode === "custom" ? data.mouth.requested : null;
      settings.mouthLatent = data.mouth.mode === "historical" ? data.mouth.latent : null;
      settings.mouthDraw = data.mouth.draw;
    }
    if (data.version >= noseAppearanceVersion && data.nose) {
      if (!["custom", "historical"].includes(data.nose.mode)) throw new Error("Mode de nez invalide.");
      settings.nose = data.nose.mode === "custom" ? data.nose.requested : null;
      settings.noseLatent = data.nose.mode === "historical" ? data.nose.latent : null;
      settings.noseDraw = data.nose.draw;
    }
    if (data.version >= beardAppearanceVersion && data.facialHair) {
      if (!["historical", "custom"].includes(data.facialHair.mode)) throw new Error("Mode de pilosit\xE9 invalide.");
      settings.beard = data.facialHair.mode === "custom" ? data.facialHair.requested : null;
      settings.beardLatent = data.facialHair.mode === "historical" ? data.facialHair.latent : null;
      settings.beardDraw = data.facialHair.draw;
      settings.beardCategory = beardCategoryOf(data.facialHair.category);
    }
    if (data.version >= marksAppearanceVersion && data.marks) {
      if (!["historical", "custom"].includes(data.marks.mode)) throw new Error("Mode des marques cutan\xE9es invalide.");
      settings.marks = data.marks.mode === "custom" ? data.marks.requested : null;
      settings.marksLatent = data.marks.mode === "historical" ? data.marks.latent : null;
    }
    if (data.version >= scarAppearanceVersion && data.scars) {
      if (!["historical", "custom"].includes(data.scars.mode)) throw new Error("Mode des cicatrices invalide.");
      settings.scars = data.scars.mode === "custom" ? data.scars.requested : null;
      settings.scarsLatent = data.scars.mode === "historical" ? data.scars.latent : null;
    }
    if (data.version >= makeupAppearanceVersion && data.makeup) {
      if (!["historical", "custom"].includes(data.makeup.mode)) throw new Error("Mode de maquillage invalide.");
      settings.makeup = data.makeup.mode === "custom" ? data.makeup.requested : null;
      settings.makeupLatent = data.makeup.mode === "historical" ? data.makeup.latent : null;
    }
    const rebuilt = appearanceDocument(selection2, settings);
    if (!identical(rebuilt, data)) throw new Error("Donn\xE9es effectives incompatibles avec la s\xE9lection et les demandes.");
    return { selection: selection2, ...settings };
  }

  // bio-yeux-01/eye-domain.mjs
  function eyeDomains(face, values) {
    return Object.fromEntries(Object.entries(eyeControls).map(([key, { min, max }]) => {
      const integers = [], intervals = [];
      for (let candidate = min; candidate <= max; candidate++) {
        if (!acceptsEyes(face, { ...values, [key]: candidate })) continue;
        integers.push(candidate);
        const interval = intervals.at(-1);
        if (interval?.[1] === candidate - 1) interval[1] = candidate;
        else intervals.push([candidate, candidate]);
      }
      return [key, { intervals, points: integers }];
    }));
  }
  function eyeChanges(before, after) {
    if (!before || !after) return [];
    return Object.keys(eyeControls).filter((key) => before[key] !== after[key]).map((key) => ({
      key,
      before: before[key],
      after: after[key]
    }));
  }
  function eyeProposal(face, values) {
    const result = solveEyes(face, values);
    return { effective: result.effective, changes: eyeChanges(values, result.effective) };
  }

  // bio-yeux-01/availability.mjs
  var views = [{ headOnly: true }, { headOnly: false }, { headOnly: true, smallScale: true }];
  function availableOptions(input, hairColor) {
    const changes = (a, b, first = hairColor, second = first) => views.some((view) => character12(a, { ...view, instance: "check-options", hairColor: first }) !== character12(b, { ...view, instance: "check-options", hairColor: second }));
    const toggles = Object.fromEntries(["accessories", "contrast"].map((key) => [
      key,
      changes({ ...input, [key]: false }, { ...input, [key]: true })
    ]));
    const front = controls.forehead_height;
    return {
      ...toggles,
      palette: changes(input, input, "noir-profond", "blanc-ivoire"),
      arrangement: changes({ ...input, arrangement: "G" }, { ...input, arrangement: "D" }),
      forehead: changes({ ...input, forehead_height: front.min }, { ...input, forehead_height: front.max })
    };
  }

  // bio-yeux-01/iris-editor.mjs
  function mountIrisEditor({ input, eyes: eyes2, render }) {
    const q2 = (id) => document.getElementById(id);
    const number = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 });
    const neutral2 = normalizeIris({});
    let current = null, latent = null, origin = null, result = null;
    const points = {};
    const selectors = {
      pupilShape: q2("iris-shape"),
      heterochromia: q2("iris-hetero"),
      primary: q2("iris-primary"),
      secondary: q2("iris-secondary")
    };
    const options2 = (select, entries) => select.append(...entries.map(([id, label]) => new Option(label, id)));
    options2(selectors.pupilShape, Object.entries(pupilShapes));
    options2(selectors.heterochromia, Object.entries(heterochromias));
    for (const key of ["primary", "secondary"]) {
      for (const [family, label] of [["natural", "Naturelles"], ["fantasy", "Fantaisie"]]) {
        const group = document.createElement("optgroup");
        group.label = label;
        options2(group, irisPalette.filter((c) => c.family === family).map((c) => [c.id, c.label]));
        selectors[key].append(group);
      }
    }
    function set(values, draw2 = null) {
      current = values;
      origin = draw2;
      q2("iris-error").textContent = "";
      refresh();
      render();
    }
    for (const [key, control] of Object.entries(irisControls)) {
      const label = document.createElement("label");
      label.className = "slider";
      label.innerHTML = `<span>${control.label}<output id="iris-output-${key}" for="iris-${key}"></output></span><input id="iris-${key}" type="range" min="0" max="0" step="1" aria-label="${control.label}" aria-describedby="iris-domain-${key}"><small class="eye-domain" id="iris-domain-${key}"></small>`;
      label.querySelector("input").addEventListener("input", (event) => {
        const value = points[key]?.[event.target.valueAsNumber];
        if (!current || value === void 0) return;
        set({ ...current, [key]: value });
      });
      q2("iris-sliders").append(label);
    }
    for (const [key, select] of Object.entries(selectors)) {
      select.addEventListener("change", () => set({ ...current, [key]: select.value }));
    }
    const format11 = (value, key) => number.format(value) + (irisControls[key].unit ? " " + irisControls[key].unit : "");
    function refresh() {
      result = current ? irisFor(input(), eyes2(), current, true) : null;
      const requested = result?.requested ?? latent ?? neutral2;
      const effective = result?.effective;
      q2("iris-active").checked = !!current;
      q2("iris-parameters").disabled = !current;
      q2("iris-before-mode").disabled = !current;
      const central = requested.heterochromia === "central";
      const equal = requested.primary === requested.secondary;
      selectors.secondary.disabled = requested.heterochromia === "none";
      for (const [key, selector] of Object.entries(selectors)) selector.value = requested[key];
      for (const key of ["primary", "secondary"]) {
        const colour2 = irisPalette.find((c) => c.id === requested[key]);
        const chip = q2("iris-chip-" + key);
        chip.style.backgroundColor = colour2.fill;
        chip.style.borderColor = colour2.outline;
      }
      for (const [key, control] of Object.entries(irisControls)) {
        const slider = q2("iris-" + key);
        const inactive = key === "secondarySize" && (!central || equal);
        const domain2 = result?.domains[key] ?? [];
        const value = inactive || !effective ? requested[key] : effective[key];
        points[key] = domain2.includes(value) ? domain2 : [...domain2, value].sort((a, b) => a - b);
        slider.max = points[key].length - 1;
        slider.value = points[key].indexOf(value);
        slider.disabled = inactive || points[key].length < 2;
        const text = format11(value, key);
        const request = requested[key] !== value ? format11(requested[key], key) : null;
        q2("iris-output-" + key).textContent = request ? `${request} \u2192 ${text}` : text;
        slider.setAttribute("aria-valuetext", request ? `${request} demand\xE9, ${text} effectif` : text);
        const intervals = intervalsOf(domain2, control.step);
        q2("iris-domain-" + key).textContent = !result ? "" : inactive ? "R\xE9glage en m\xE9moire." : key === "secondarySize" && domain2.length <= 1 ? "Aucun accroissement visible sur cette ouverture." : intervals.map(([a, b]) => a === b ? format11(a, key) : number.format(a) + " \xE0 " + format11(b, key)).join(" ou ");
      }
      let message = "Pigments historiques actifs.";
      if (current) {
        if (requested.heterochromia !== "none" && equal) message = "Les deux nuances sont identiques. La seconde nuance reste en m\xE9moire.";
        else if (central && effective.heterochromia === "none") message = "La zone demand\xE9e est masqu\xE9e. Sa taille reste en m\xE9moire.";
        else if (central && effective.secondarySize !== requested.secondarySize) message = "Une portion de la zone est masqu\xE9e. La valeur appliqu\xE9e est indiqu\xE9e.";
        else if (effective.pupilSize !== requested.pupilSize) message = "La pupille a \xE9t\xE9 ajust\xE9e pour rester dans l\u2019iris.";
        else message = "Les r\xE9glages affich\xE9s sont appliqu\xE9s.";
      }
      q2("iris-status").textContent = message;
    }
    q2("iris-active").addEventListener("change", (event) => {
      if (event.target.checked) set(latent ?? neutral2, origin);
      else {
        latent = current;
        set(null, origin);
      }
    });
    q2("iris-reset").addEventListener("click", () => {
      latent = null;
      set(null);
    });
    q2("iris-random").addEventListener("click", () => {
      const seed = q2("iris-seed").value;
      try {
        set(drawIris(input(), eyes2(), seed), { seed, version: irisDrawVersion });
      } catch (error) {
        q2("iris-error").textContent = error.message;
      }
    });
    q2("iris-before-mode").addEventListener("change", render);
    return {
      value: () => current,
      refresh,
      archiveSettings: () => ({ iris: current, irisLatent: !current ? latent : null, irisDraw: origin }),
      restore(data) {
        current = data.iris ?? null;
        latent = data.irisLatent ?? null;
        origin = data.irisDraw ?? null;
        q2("iris-seed").value = origin?.seed ?? q2("iris-seed").defaultValue;
        q2("iris-error").textContent = "";
      }
    };
  }

  // bio-yeux-01/details-editor.mjs
  var format3 = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 });
  function mountDetailsEditor({ input, eyes: eyes2, render }) {
    const q2 = (id) => document.getElementById(id);
    let current = null, latent = null, origin = null;
    const neutral2 = normalizeDetails({});
    const fields2 = [];
    for (const [group, axes12] of Object.entries(detailControls)) {
      for (const [axis7, control] of Object.entries(axes12)) {
        const id = "detail-" + group + "-" + axis7;
        const label = document.createElement("label");
        label.className = "slider";
        label.innerHTML = `<span>${control.label}<output id="${id}-value" for="${id}"></output></span><input id="${id}" type="range" min="0" max="0" step="1" aria-label="${control.label}" aria-describedby="${id}-domain"><small class="eye-domain" id="${id}-domain"></small>`;
        q2("detail-axes-" + group).append(label);
        const field = { group, axis: axis7, control, input: q2(id), output: q2(id + "-value"), domain: q2(id + "-domain") };
        fields2.push(field);
        field.input.addEventListener("input", () => {
          const value = field.points[field.input.valueAsNumber];
          if (!current || value === void 0) return;
          set({ ...current, [group]: { ...current[group], [axis7]: value } });
        });
      }
    }
    function set(value, draw2 = null) {
      current = value;
      origin = draw2;
      q2("details-error").textContent = "";
      refresh();
      render();
    }
    function refresh() {
      const result = current ? detailsFor(input(), eyes2(), current, true) : null;
      const requested = result?.requested ?? latent ?? neutral2;
      q2("details-active").checked = !!current;
      q2("details-parameters").disabled = !current;
      q2("details-before-wrap").hidden = !current;
      let adjusted = false;
      for (const field of fields2) {
        const { group, axis: axis7, control, input: input2, output, domain: domain2 } = field;
        const request = requested[group][axis7];
        const effective = result?.effective[group][axis7] ?? null;
        const options2 = result?.domains[group][axis7] ?? [];
        const value = effective ?? request;
        field.points = options2.includes(value) ? options2 : [...options2, value].sort((a, b) => a - b);
        input2.max = field.points.length - 1;
        input2.value = field.points.indexOf(value);
        input2.disabled = options2.length === 0 || field.points.length < 2;
        const pretty3 = (n2) => format3.format(n2) + (control.unit ? " " + control.unit : "");
        const change = effective !== null && request !== effective;
        adjusted ||= change;
        output.textContent = change ? `${pretty3(request)} \u2192 ${pretty3(value)}` : pretty3(value);
        input2.setAttribute("aria-valuetext", change ? `${pretty3(request)} demand\xE9, ${pretty3(value)} effectif` : pretty3(value));
        const ranges = intervalsOf(options2, control.step);
        domain2.textContent = !result ? "" : !ranges.length ? "Valeur conserv\xE9e en m\xE9moire." : ranges.map(([a, b]) => a === b ? pretty3(a) : `${format3.format(a)} \xE0 ${pretty3(b)}`).join(" ou ");
      }
      const status = !current ? "Rendu des contours historiques actif." : adjusted ? "L\u2019enveloppe limite certains r\xE9glages. Les valeurs demand\xE9es restent en m\xE9moire." : "Les d\xE9tails actifs suivent l\u2019ouverture actuelle.";
      q2("details-status").textContent = status;
    }
    q2("details-active").addEventListener("change", (event) => {
      if (event.target.checked) set(latent ?? neutral2, origin);
      else {
        latent = current;
        set(null, origin);
      }
    });
    q2("details-reset").addEventListener("click", () => {
      latent = null;
      set(null);
    });
    q2("details-random").addEventListener("click", () => {
      const seed = q2("details-seed").value;
      try {
        set(drawDetails(input(), eyes2(), seed), { seed, version: detailsDrawVersion });
      } catch (error) {
        q2("details-error").textContent = error.message;
      }
    });
    q2("details-before-mode").addEventListener("change", render);
    return {
      value: () => current,
      refresh,
      archiveSettings: () => ({ details: current, detailsLatent: current ? null : latent, detailsDraw: origin }),
      restore(data) {
        current = data.details ?? null;
        latent = data.detailsLatent ?? null;
        origin = data.detailsDraw ?? null;
        q2("details-seed").value = origin?.seed ?? q2("details-seed").defaultValue;
        q2("details-error").textContent = "";
      }
    };
  }

  // bio-yeux-01/brows-editor.mjs
  var format4 = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 });
  var features = ["absent", "monobrow", "slit"];
  function mountBrowsEditor({ input, eyes: eyes2, colours: colours2, render }) {
    const q2 = (id) => document.getElementById(id);
    let current = null, latent = null, origin = null;
    const neutral2 = normalizeBrows({});
    const fields2 = [];
    const addOptions = (target, options2) => target.append(...options2.map(([value, label]) => new Option(label, value)));
    addOptions(q2("brows-preset"), [["custom", "Personnalis\xE9s"], ...Object.entries(browPresets).map(([key, preset]) => [key, preset.label])]);
    addOptions(q2("brows-colour-mode"), Object.entries(browColourModes));
    for (const [category2, label] of [["natural", "Naturelles"], ["fantasy", "Fantaisie"]]) {
      const group = document.createElement("optgroup");
      group.label = label;
      addOptions(group, palette.filter((c) => c.category === category2).map((c) => [c.id, c.name]));
      q2("brows-colour").append(group);
    }
    for (const [key, control] of Object.entries(browControls)) {
      const id = "brow-" + key;
      const label = document.createElement("label");
      label.className = "slider";
      label.innerHTML = `<span>${control.label}<output id="${id}-value" for="${id}"></output></span><input id="${id}" type="range" min="0" max="0" step="1" aria-label="${control.label}" aria-describedby="${id}-domain"><small class="eye-domain" id="${id}-domain"></small>`;
      q2("brow-axes").append(label);
      const field = { key, control, input: q2(id), output: q2(id + "-value"), domain: q2(id + "-domain") };
      fields2.push(field);
      field.input.addEventListener("input", () => {
        const v = field.points[field.input.valueAsNumber];
        if (current && v !== void 0) set({ ...current, [key]: v });
      });
    }
    function set(value, draw2 = null) {
      current = value;
      origin = draw2;
      q2("brows-error").textContent = "";
      refresh();
      render();
    }
    function refresh() {
      const result = current ? browsFor(input(), eyes2(), current, colours2(), true) : null;
      const requested = result?.requested ?? latent ?? neutral2;
      q2("brows-active").checked = !!current;
      q2("brows-parameters").disabled = !current;
      q2("brows-before-wrap").hidden = !current;
      for (const key of features) {
        q2("brows-" + key).checked = requested[key];
        q2("brows-" + key).disabled = key !== "absent" && requested.absent;
      }
      q2("brows-preset").disabled = requested.absent;
      const preset = Object.entries(browPresets).find(([, example6]) => {
        const values = normalizeBrows(example6.values);
        return fields2.every(({ key }) => values[key] === requested[key]);
      });
      q2("brows-preset").value = preset?.[0] ?? "custom";
      q2("brows-colour-mode").value = requested.colourMode;
      q2("brows-colour-mode").disabled = requested.absent;
      q2("brows-colour").value = requested.colour;
      q2("brows-colour").disabled = requested.absent || requested.colourMode !== "independent";
      const pigment3 = result?.pigment;
      q2("brow-chip").hidden = !pigment3;
      q2("brow-chip").style.backgroundColor = pigment3?.fill ?? "";
      q2("brows-pigment").textContent = pigment3?.source === "remembered" ? "Teinte capillaire m\xE9moris\xE9e." : pigment3?.source === "historical" ? "Teinte capillaire historique." : "";
      let adjusted = false;
      for (const field of fields2) {
        const { key, control, input: input2, output, domain: domain2 } = field;
        const request = requested[key], applied = result?.effective[key] ?? null;
        const options2 = result?.domains[key] ?? [];
        const value = applied ?? request;
        field.points = options2.includes(value) ? options2 : [...options2, value].sort((a, b) => a - b);
        input2.max = field.points.length - 1;
        input2.value = field.points.indexOf(value);
        input2.disabled = !options2.length || field.points.length < 2;
        const pretty3 = (n2) => format4.format(n2) + (control.unit === "\xB0" ? "\xB0" : " %");
        const change = applied !== null && request !== applied;
        adjusted ||= change;
        output.textContent = change ? `${pretty3(request)} \u2192 ${pretty3(value)}` : pretty3(value);
        input2.setAttribute("aria-valuetext", change ? `${pretty3(request)} demand\xE9, ${pretty3(value)} effectif` : pretty3(value));
        const ranges = intervalsOf(options2, 1);
        domain2.textContent = !result ? "" : !ranges.length ? "Valeur conserv\xE9e en m\xE9moire." : ranges.map(([a, b]) => a === b ? pretty3(a) : `${format4.format(a)} \xE0 ${pretty3(b)}`).join(" ou ");
      }
      q2("brows-status").textContent = !current ? "Sourcils historiques actifs." : requested.absent ? "Sourcils absents. Les autres r\xE9glages restent en m\xE9moire." : adjusted ? "L\u2019enveloppe limite certains r\xE9glages. Les demandes restent en m\xE9moire." : "Les r\xE9glages suivent l\u2019enveloppe du visage.";
    }
    for (const key of features) q2("brows-" + key).addEventListener("change", (event) => set({ ...current, [key]: event.target.checked }));
    q2("brows-colour-mode").addEventListener("change", (event) => set({ ...current, colourMode: event.target.value }));
    q2("brows-colour").addEventListener("change", (event) => set({ ...current, colour: event.target.value }));
    q2("brows-preset").addEventListener("change", (event) => {
      const preset = browPresets[event.target.value];
      if (!preset) return;
      const values = normalizeBrows(preset.values);
      set({ ...current, ...Object.fromEntries(fields2.map(({ key }) => [key, values[key]])) });
    });
    q2("brows-active").addEventListener("change", (event) => {
      if (event.target.checked) set(latent ?? neutral2, origin);
      else {
        latent = current;
        set(null, origin);
      }
    });
    q2("brows-reset").addEventListener("click", () => {
      latent = null;
      set(null);
    });
    q2("brows-random").addEventListener("click", () => {
      const seed = q2("brows-seed").value;
      try {
        set(drawBrows(input(), eyes2(), seed), { seed, version: browDrawVersion });
      } catch (error) {
        q2("brows-error").textContent = error.message;
      }
    });
    q2("brows-before-mode").addEventListener("change", render);
    return {
      value: () => current,
      refresh,
      archiveSettings: () => ({ brows: current, browsLatent: current ? null : latent, browsDraw: origin }),
      restore(data) {
        current = data.brows ?? null;
        latent = data.browsLatent ?? null;
        origin = data.browsDraw ?? null;
        q2("brows-seed").value = origin?.seed ?? q2("brows-seed").defaultValue;
        q2("brows-error").textContent = "";
      }
    };
  }

  // bio-yeux-01/mouth-editor.mjs
  var format5 = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 });
  var pretty = (value) => format5.format(value) + " %";
  function mountMouthEditor({ input, eyes: eyes2, noseBounds, noseBoundsForDraw, refreshNose, render }) {
    const q2 = (id) => document.getElementById(id);
    const neutral2 = normalizeMouth({});
    let current = null, latent = null, origin = null, blocked = false;
    const fields2 = [];
    q2("mouth-preset").append(new Option("Personnalis\xE9e", "custom"), ...Object.entries(mouthPresets).map(([key, { label }]) => new Option(label, key)));
    for (const [key, control] of Object.entries(mouthControls)) {
      const id = "mouth-" + key;
      const label = document.createElement("label");
      label.className = "slider";
      label.innerHTML = `<span>${control.label}<output id="${id}-value" for="${id}"></output></span><input id="${id}" type="range" min="0" max="0" step="1" aria-label="${control.label}" aria-describedby="${id}-domain"><small class="eye-domain" id="${id}-domain"></small>`;
      q2("mouth-axes").append(label);
      const field = { key, input: q2(id), output: q2(id + "-value"), domain: q2(id + "-domain") };
      fields2.push(field);
      field.input.addEventListener("input", () => {
        const value = field.points[field.input.valueAsNumber];
        if (current && value !== void 0) set({ ...current, [key]: value });
      });
    }
    function set(mouth, draw2 = null) {
      current = mouth;
      origin = draw2;
      refreshNose();
      refresh();
      render();
    }
    function refresh() {
      let result = null, historical = [], adjustedByNose = false;
      const face = model8(input()), opening = eyesFor(input(), eyes2());
      const nose = noseBounds();
      const fit = { noseBounds: nose, preserveMouth: !!nose };
      blocked = false;
      q2("mouth-error").textContent = "";
      try {
        if (current) {
          result = solveMouth(face, opening, current, { ...fit, withDomains: true });
          if (nose && fields2.some(({ key }) => result.effective[key] !== null && result.effective[key] !== result.requested[key])) {
            const previous = solveMouth(face, opening, current).effective;
            adjustedByNose = fields2.some(({ key }) => previous[key] !== result.effective[key]);
          }
        } else historical = auditHistoricalMouth(face, opening, fit).violations;
      } catch (error) {
        blocked = !!current;
        q2("mouth-error").textContent = error.message;
      }
      const requested = result?.requested ?? current ?? latent ?? neutral2;
      q2("mouth-active").checked = !!current;
      q2("mouth-parameters").disabled = !current;
      q2("mouth-before-wrap").hidden = !result;
      const preset = Object.entries(mouthPresets).find(([, example6]) => {
        const values = normalizeMouth(example6.values);
        return fields2.every(({ key }) => values[key] === requested[key]);
      });
      q2("mouth-preset").value = preset?.[0] ?? "custom";
      let adjusted = false;
      for (const field of fields2) {
        const { key, input: input2, output, domain: domain2 } = field;
        const request = requested[key], applied = result?.effective[key] ?? null;
        const options2 = result?.domains[key]?.points ?? [];
        const value = applied ?? request;
        const matching = options2.findIndex((n2) => Math.abs(n2 - value) < 1e-7);
        field.points = matching >= 0 ? options2 : [...options2, value].sort((a, b) => a - b);
        input2.max = field.points.length - 1;
        input2.value = matching >= 0 ? matching : field.points.indexOf(value);
        input2.disabled = !options2.length || field.points.length < 2;
        const change = applied !== null && request !== applied;
        adjusted ||= change;
        output.textContent = change ? `${pretty(request)} \u2192 ${pretty(value)}` : pretty(value);
        input2.setAttribute("aria-valuetext", change ? `${pretty(request)} demand\xE9, ${pretty(value)} effectif` : pretty(value));
        const ranges = result?.domains[key]?.intervals ?? [];
        domain2.textContent = !result ? "" : !ranges.length ? "Valeur conserv\xE9e en m\xE9moire." : ranges.map(([a, b]) => a === b ? pretty(a) : `${format5.format(a)} \xE0 ${pretty(b)}`).join(" ou ");
      }
      let status = "Bouche historique active.";
      if (historical.length) status = "Bouche historique conserv\xE9e. \xC9cart anatomique \xE0 arbitrer \xB7 " + historical.join(", ") + ".";
      if (result) {
        status = "La bouche respecte les limites du visage.";
        if (!result.geometry.upper && !result.geometry.lower) {
          status = "Trait seul. Une silhouette de r\xE9f\xE9rence permet de r\xE9tablir les aplats.";
        }
        if (adjusted) status = adjustedByNose ? "Le nez limite certains r\xE9glages de bouche. Les pr\xE9f\xE9rences restent en m\xE9moire." : "L\u2019enveloppe limite certains r\xE9glages. Les demandes restent en m\xE9moire.";
      }
      if (blocked) status = "Personnalisation suspendue. La bouche historique reste affich\xE9e.";
      q2("mouth-status").textContent = status;
    }
    q2("mouth-preset").addEventListener("change", (event) => {
      const preset = mouthPresets[event.target.value];
      if (preset) set(normalizeMouth(preset.values));
    });
    q2("mouth-active").addEventListener("change", (event) => {
      if (event.target.checked) set(latent ?? neutral2, origin);
      else {
        latent = current;
        set(null, origin);
      }
    });
    q2("mouth-reset").addEventListener("click", () => {
      latent = null;
      set(null);
    });
    q2("mouth-random").addEventListener("click", () => {
      const seed = q2("mouth-seed").value;
      try {
        set(drawMouth(input(), eyes2(), seed, { noseBounds: noseBoundsForDraw() }), { seed, version: mouthDrawVersion });
      } catch (error) {
        q2("mouth-error").textContent = error.message;
      }
    });
    q2("mouth-before-mode").addEventListener("change", render);
    return {
      value: () => blocked ? null : current,
      intent: () => current,
      refresh,
      archiveSettings: () => ({ mouth: blocked ? null : current, mouthLatent: blocked ? current : current ? null : latent, mouthDraw: origin }),
      restore(data) {
        current = data.mouth ?? null;
        latent = data.mouthLatent ?? null;
        origin = data.mouthDraw ?? null;
        q2("mouth-seed").value = origin?.seed ?? q2("mouth-seed").defaultValue;
        q2("mouth-error").textContent = "";
      }
    };
  }

  // bio-yeux-01/nose-editor.mjs
  var format6 = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 });
  var pretty2 = (value) => format6.format(value) + " %";
  function mountNoseEditor({ input, eyes: eyes2, details: details2, mouth, render }) {
    const q2 = (id) => document.getElementById(id);
    const neutral2 = normalizeNose({});
    let current = null, latent = null, origin = null, result = null;
    const fields2 = [];
    q2("nose-preset").append(new Option("Personnalis\xE9", "custom"));
    for (const [label, items] of [["Morphologies", nosePresets], ["Degr\xE9s de d\xE9tail", noseDetailPresets]]) {
      const group = document.createElement("optgroup");
      group.label = label;
      group.append(...Object.entries(items).map(([key, v]) => new Option(v.label, key)));
      q2("nose-preset").append(group);
    }
    for (const [key, control] of Object.entries(noseControls)) {
      const id = "nose-" + key;
      const label = document.createElement("label");
      label.className = "slider";
      label.innerHTML = `<span>${control.label}<output id="${id}-value" for="${id}"></output></span><input id="${id}" type="range" min="0" max="0" step="1" aria-label="${control.label}" aria-describedby="${id}-domain"><small class="eye-domain" id="${id}-domain"></small>`;
      q2("nose-axes").append(label);
      const field = { key, input: q2(id), output: q2(id + "-value"), domain: q2(id + "-domain") };
      fields2.push(field);
      field.input.addEventListener("input", () => {
        const value = field.points[field.input.valueAsNumber];
        if (current && value !== void 0) set({ ...current, [key]: value });
      });
    }
    function solve2(mouthMode, withDomains = false) {
      const portrait3 = input();
      return solveNose(
        model8(portrait3),
        eyesFor(portrait3, eyes2()),
        current,
        { details: details2(), mouth: mouthMode, withDomains }
      );
    }
    function refresh() {
      result = null;
      let issues = [];
      q2("nose-error").textContent = "";
      try {
        if (current) result = solve2(mouth(), true);
        else {
          const portrait3 = input();
          issues = auditHistoricalNose(model8(portrait3), eyesFor(portrait3, eyes2()), { details: details2() });
        }
      } catch (error) {
        q2("nose-error").textContent = error.message;
      }
      const requested = result?.requested ?? current ?? latent ?? neutral2;
      q2("nose-active").checked = !!current;
      q2("nose-parameters").disabled = !current;
      q2("nose-before-wrap").hidden = !result;
      const preset = Object.entries(nosePresets).find(([, example6]) => {
        const values = normalizeNose(example6.values);
        return fields2.every(({ key }) => values[key] === requested[key]);
      });
      q2("nose-preset").value = preset?.[0] ?? "custom";
      let adjusted = false;
      for (const field of fields2) {
        const { key, input: input2, output, domain: domain2 } = field;
        const request = requested[key], applied = result?.effective[key] ?? null;
        const options2 = result?.domains[key]?.points ?? [];
        const value = applied ?? request;
        const matching = options2.findIndex((n2) => Math.abs(n2 - value) < 1e-7);
        field.points = matching >= 0 ? options2 : [...options2, value].sort((a, b) => a - b);
        input2.max = field.points.length - 1;
        input2.value = matching >= 0 ? matching : field.points.indexOf(value);
        input2.disabled = !options2.length || field.points.length < 2;
        const change = applied !== null && request !== applied;
        adjusted ||= change;
        output.textContent = change ? `${pretty2(request)} \u2192 ${pretty2(value)}` : pretty2(value);
        input2.setAttribute("aria-valuetext", change ? `${pretty2(request)} demand\xE9, ${pretty2(value)} effectif` : pretty2(value));
        const ranges = result?.domains[key]?.intervals ?? [];
        domain2.textContent = !result ? "" : !ranges.length ? "Valeur conserv\xE9e en m\xE9moire." : ranges.map(([a, b]) => a === b ? pretty2(a) : `${format6.format(a)} \xE0 ${pretty2(b)}`).join(" ou ");
      }
      const status = q2("nose-status");
      if (!current) status.textContent = issues.length ? "Nez historique conserv\xE9. \xC9cart anatomique \xE0 arbitrer \xB7 " + issues.join(", ") + "." : "Nez historique actif.";
      else if (!result) status.textContent = "Personnalisation suspendue. Le nez historique reste affich\xE9.";
      else if (!requested.fills && !requested.lines) status.textContent = "Relief masqu\xE9. Les limites anatomiques restent actives.";
      else if (adjusted) status.textContent = "L\u2019enveloppe limite certains r\xE9glages. Les demandes restent en m\xE9moire.";
      else status.textContent = "Le nez respecte les limites du visage.";
    }
    function set(value, draw2 = null) {
      current = value;
      origin = draw2;
      refresh();
      render();
    }
    q2("nose-preset").addEventListener("change", (event) => {
      const key = event.target.value;
      if (nosePresets[key]) set(normalizeNose(nosePresets[key].values));
      else if (noseDetailPresets[key]) set({ ...current, ...noseDetailPresets[key].values });
    });
    q2("nose-active").addEventListener("change", (event) => {
      if (event.target.checked) set(latent ?? neutral2, origin);
      else {
        latent = current;
        set(null, origin);
      }
    });
    q2("nose-reset").addEventListener("click", () => {
      latent = null;
      set(null);
    });
    q2("nose-random").addEventListener("click", () => {
      const seed = q2("nose-seed").value;
      try {
        set(drawNose(input(), eyes2(), seed, { mouth: mouth(), details: details2() }), { seed, version: noseDrawVersion });
      } catch (error) {
        q2("nose-error").textContent = error.message;
      }
    });
    q2("nose-before-mode").addEventListener("change", render);
    return {
      value: () => result ? current : null,
      bounds: () => result?.geometry.anatomy,
      boundsForCustomMouth: () => current ? solve2({})?.geometry.anatomy : void 0,
      refresh,
      archiveSettings: () => ({ nose: result ? current : null, noseLatent: result ? null : current ?? latent, noseDraw: origin }),
      restore(data) {
        current = data.nose ?? null;
        latent = data.noseLatent ?? null;
        origin = data.noseDraw ?? null;
        q2("nose-seed").value = origin?.seed ?? q2("nose-seed").defaultValue;
      }
    };
  }

  // bio-yeux-01/beard-editor.mjs
  var format7 = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 6 });
  var percent2 = (value) => format7.format(value) + " %";
  function mountBeardEditor({ input, eyes: eyes2, context: context2, render }) {
    const q2 = (id) => document.getElementById("beard-" + id);
    const category2 = () => q2("category").value;
    const neutral2 = normalizeBeard(beardPresets.short.values);
    let current = null, latent = null, origin = null, result = null;
    let previousKey = null;
    const mode = q2("colour-mode"), colours2 = q2("colour"), preset = q2("preset");
    preset.append(new Option("Personnalis\xE9", "custom"), ...Object.entries(beardPresets).map(([key, item]) => new Option(item.label, key)));
    for (const [key, label] of [["natural", "Naturelles"], ["fantasy", "Fantaisie"]]) {
      const group = document.createElement("optgroup");
      group.label = label;
      group.append(...palette.filter((item) => item.category === key).map((item) => new Option(item.name, item.id)));
      colours2.append(group);
    }
    for (const [key, zone] of Object.entries(beardZones)) {
      const label = document.createElement("label");
      label.className = "check";
      label.innerHTML = '<input type="checkbox" id="beard-zone-' + key + '"> ' + zone;
      q2("zones").append(label);
      q2("zone-" + key).addEventListener("change", (event) => {
        set({ ...current, zones: { ...current.zones, [key]: event.target.checked } });
      });
    }
    const fields2 = Object.entries(beardControls).map(([key, control]) => {
      const id = "beard-" + key, label = document.createElement("label");
      label.className = "slider";
      label.innerHTML = `<span>${control.label}<output for="${id}" id="${id}-value"></output></span><input id="${id}" type="range" min="0" max="0" step="1" aria-label="${control.label}" aria-describedby="${id}-domain"><small class="eye-domain" id="${id}-domain"></small>`;
      q2("axes").append(label);
      const field = { key, input: q2(key), output: q2(key + "-value"), domain: q2(key + "-domain"), points: [] };
      field.input.addEventListener("input", () => {
        if (current) set({ ...current, [key]: field.points[field.input.valueAsNumber] });
      });
      return field;
    });
    function refresh() {
      const portrait3 = input(), opening = eyes2(), options2 = { ...context2(), category: category2() };
      const memo = JSON.stringify([portrait3, opening, options2, current, latent]);
      if (memo === previousKey) return;
      previousKey = memo;
      const allowed = category2() !== "F";
      try {
        result = current && allowed ? beardFor(portrait3, opening, current, options2) : null;
        q2("error").textContent = "";
      } catch (error) {
        result = null;
        q2("error").textContent = error.message;
      }
      const requested = current ?? latent ?? neutral2;
      q2("active").checked = !!current;
      q2("active").disabled = !allowed;
      q2("parameters").disabled = !current || !allowed;
      for (const name of ["seed", "random", "reset"]) q2(name).disabled = !allowed;
      q2("before-wrap").hidden = !result?.path;
      const match = Object.entries(beardPresets).find(([, item]) => {
        const profile = normalizeBeard(item.values);
        return fields2.every(({ key }) => profile[key] === requested[key]) && Object.keys(beardZones).every((key) => profile.zones[key] === requested.zones[key]);
      });
      preset.value = match?.[0] ?? "custom";
      mode.value = requested.colourMode;
      colours2.value = requested.colour;
      mode.disabled = !result?.path;
      colours2.disabled = mode.disabled || requested.colourMode !== "independent";
      for (const key of Object.keys(beardZones)) q2("zone-" + key).checked = requested.zones[key];
      let adjusted = false;
      for (const field of fields2) {
        const { key, input: input2, output, domain: domain2 } = field;
        const request = requested[key], applied = result?.effective[key] ?? request;
        const range = result?.domains[key] ?? [];
        const [min, max] = range;
        const points = range.length ? [min, max, ...Array.from(
          { length: Math.floor(max) - Math.ceil(min) + 1 },
          (_, i) => Math.ceil(min) + i
        ), applied] : [applied];
        field.points = [...new Set(points)].sort((a, b) => a - b);
        input2.max = field.points.length - 1;
        input2.value = field.points.indexOf(applied);
        input2.disabled = !range.length;
        adjusted ||= request !== applied;
        output.textContent = request !== applied ? `${percent2(request)} \u2192 ${percent2(applied)}` : percent2(applied);
        input2.setAttribute("aria-valuetext", request !== applied ? `${percent2(request)} demand\xE9, ${percent2(applied)} effectif` : percent2(applied));
        domain2.textContent = range.length ? `${format7.format(min)} \xE0 ${percent2(max)}` : current ? "Valeur conserv\xE9e en m\xE9moire." : "";
      }
      q2("status").textContent = !allowed ? "Pilosit\xE9 indisponible pour F. Les pr\xE9f\xE9rences restent en m\xE9moire." : !current ? "Rendu historique actif." : !result ? "Pilosit\xE9 suspendue." : requested.zones.moustache && !result.available.moustache ? "Espace insuffisant entre le nez et la bouche. La moustache reste en m\xE9moire." : adjusted ? "L\u2019espace entre le nez et la bouche limite la moustache. Les demandes restent en m\xE9moire." : !result.path ? "Aucune pilosit\xE9 visible." : "";
    }
    function set(value, draw2 = null) {
      current = value;
      origin = draw2;
      render();
    }
    q2("category").addEventListener("change", render);
    q2("active").addEventListener("change", (event) => {
      if (event.target.checked) set(latent ?? neutral2, origin);
      else {
        latent = current;
        set(null, origin);
      }
    });
    preset.addEventListener("change", () => {
      if (!beardPresets[preset.value]) return;
      const { values } = beardPresets[preset.value];
      set(normalizeBeard({ ...values, colour: current.colour, colourMode: current.colourMode }));
    });
    mode.addEventListener("change", () => set({ ...current, colourMode: mode.value }));
    colours2.addEventListener("change", () => set({ ...current, colour: colours2.value }));
    q2("random").addEventListener("click", () => {
      const seed = q2("seed").value;
      try {
        set(drawBeard(input(), eyes2(), seed, { ...context2(), category: category2() }), { seed, version: beardDrawVersion });
      } catch (error) {
        q2("error").textContent = error.message;
      }
    });
    q2("reset").addEventListener("click", () => {
      latent = null;
      set(null);
    });
    q2("before-mode").addEventListener("change", render);
    return {
      refresh,
      category: category2,
      value: () => result?.path ? current : null,
      archiveSettings: () => ({ beard: current, beardLatent: current ? null : latent, beardDraw: origin, beardCategory: category2() }),
      restore(data) {
        current = data.beard ?? null;
        latent = data.beardLatent ?? null;
        origin = data.beardDraw ?? null;
        q2("category").value = data.beardCategory ?? "H";
        q2("seed").value = origin?.seed ?? q2("seed").defaultValue;
      }
    };
  }

  // bio-yeux-01/marks-editor.mjs
  var format8 = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 3 });
  var percent3 = (value, key) => format8.format(value) + (key === "angle" ? "\xB0" : " %");
  function mountMarksEditor({ input, eyes: eyes2, context: context2, render }) {
    const q2 = (id) => document.getElementById("marks-" + id);
    const add = q2("type"), list2 = q2("list"), shape = q2("shape"), tone = q2("tone");
    const fields2 = /* @__PURE__ */ new Map();
    let values = [], shown = true, selected = null, nextId = 1, result = null, memo = null, placing = false;
    const active = () => values.find((item) => item.id === selected);
    const options2 = (select, table) => select.append(...Object.entries(table).map(([key, value]) => new Option(value.label ?? value, key)));
    options2(add, markTypes);
    options2(shape, markShapes);
    options2(tone, markTones);
    for (const [zone, label] of Object.entries(markZones)) {
      const field = document.createElement("label");
      field.className = "check";
      field.innerHTML = `<input type="checkbox" value="${zone}"> ${label}`;
      field.querySelector("input").addEventListener("change", () => {
        edit({ zones: [...q2("zones").querySelectorAll("input:checked")].map((input2) => input2.value) });
      });
      q2("zones").append(field);
    }
    const axisEntries = [...Object.entries(individualMarkAxes), ...Object.entries(groupMarkAxes).filter(([key]) => !Object.hasOwn(individualMarkAxes, key))];
    for (const [key, label] of axisEntries) {
      const field = document.createElement("label"), id = "marks-" + key;
      field.className = "slider";
      field.innerHTML = `<span><span>${label}</span><output for="${id}"></output></span><input type="range" id="${id}" min="0" max="0" step="1" aria-label="${label}" aria-describedby="${id}-range"><small id="${id}-range" class="eye-domain"></small>`;
      const input2 = field.querySelector("input"), output = field.querySelector("output");
      const data = { field, input: input2, output, range: field.querySelector("small"), points: [] };
      input2.addEventListener("input", () => {
        if (data.points[input2.valueAsNumber] !== void 0) edit({ [key]: data.points[input2.valueAsNumber] });
      });
      fields2.set(key, data);
      q2("axes").append(field);
    }
    function edit(changes) {
      values = normalizeMarks(values.map((item) => item.id === selected ? { ...item, ...changes } : item));
      render();
    }
    function refresh() {
      const portrait3 = input(), opening = eyes2(), settings = context2();
      const key = JSON.stringify([portrait3, opening, settings, values, shown, selected]);
      if (key === memo) return;
      memo = key;
      result = values.length ? marksFor(portrait3, opening, values, { ...settings, withDomains: true, domainId: selected }) : null;
      const item = active();
      const solved = result?.marks.find((mark) => mark.requested.id === selected);
      const grouped = !!item && markTypes[item.type].form === "group";
      const axes12 = grouped ? groupMarkAxes : individualMarkAxes;
      list2.replaceChildren(...values.map(({ id, type }) => new Option(markTypes[type].label + " \xB7 " + id.slice(1), id)));
      list2.value = selected ?? "";
      list2.disabled = !values.length;
      q2("show").checked = shown;
      q2("show").disabled = !values.length;
      q2("remove").disabled = !item;
      q2("add").disabled = values.length === 24;
      q2("reset").disabled = !values.length;
      q2("edit").disabled = !shown || !item;
      q2("edit").hidden = !item;
      q2("place").disabled = !shown || !item || grouped || !item.intensity;
      q2("seed-label").hidden = !grouped;
      q2("zones-wrap").hidden = !grouped;
      if (item) {
        shape.value = item.shape;
        tone.value = item.tone;
        if (grouped) {
          q2("seed").value = item.seed;
          for (const check of q2("zones").querySelectorAll("input")) check.checked = item.zones.includes(check.value);
        }
      }
      for (const [name, data] of fields2) {
        const { field, input: input2, output, range } = data;
        field.hidden = !item || !Object.hasOwn(axes12, name);
        if (field.hidden) continue;
        field.firstElementChild.firstElementChild.textContent = axes12[name];
        input2.setAttribute("aria-label", axes12[name]);
        const requested = item[name];
        const applied = solved.effective[name] ?? requested;
        const domain2 = solved.domains[name];
        const indexed = ["x", "y", "density", "intensity"].includes(name);
        const fallback = domain2 === null;
        const allowed = fallback ? Array.from({ length: 101 }, (_, i) => i) : domain2 ?? [];
        const [min, max] = allowed;
        const steps = indexed ? allowed : allowed.length ? [min, max, ...Array.from(
          { length: Math.floor(max) - Math.ceil(min) + 1 },
          (_, i) => Math.ceil(min) + i
        )] : [];
        data.points = [...new Set(steps)].sort((a, b) => a - b);
        const closest = name === "density" ? data.points.findLastIndex((step) => step <= solved.effective.count * 100 / markTypes[item.type].capacity) : data.points.reduce((best, step, i) => Math.abs(step - applied) < Math.abs(data.points[best] - applied) ? i : best, 0);
        input2.max = Math.max(0, data.points.length - 1);
        input2.value = Math.max(0, closest);
        input2.disabled = data.points.length < 2;
        const text = name === "density" ? `${solved.effective.visible} visible${solved.effective.visible > 1 ? "s" : ""} sur ${solved.effective.count}` : applied === requested ? percent3(applied, name) : `${percent3(requested, name)} \u2192 ${percent3(applied, name)}`;
        output.textContent = text;
        input2.setAttribute("aria-valuetext", text);
        range.textContent = fallback ? "D\xE9placez la marque sur les deux axes ou utilisez le placement sur le visage." : !steps.length ? "Valeur en m\xE9moire." : name === "density" ? "Chaque cran admissible affiche une marque de plus." : `${percent3(data.points[0], name)} \xE0 ${percent3(data.points.at(-1), name)}`;
      }
      let message = "";
      if (!shown) message = "Les marques sont masqu\xE9es et restent en m\xE9moire.";
      else if (!item) message = "Aucune marque cutan\xE9e.";
      else if (grouped && !item.zones.length) message = "Choisissez une zone pour afficher le groupe.";
      else if (!item.intensity) message = "Intensit\xE9 nulle. Les r\xE9glages restent en m\xE9moire.";
      else if (!grouped && solved.effective.reason) message = "Emplacement en m\xE9moire. La marque rencontre une limite du visage.";
      else if (!grouped && solved.effective.size !== item.size) message = "Taille ajust\xE9e \xE0 l\u2019espace disponible. La taille demand\xE9e reste en m\xE9moire.";
      else if (grouped && solved.effective.visible < solved.effective.count) message = "Les marques hors de l\u2019espace cutan\xE9 visible gardent leur emplacement.";
      q2("status").textContent = message;
    }
    function stopPlacing() {
      placing = false;
      q2("place").setAttribute("aria-pressed", "false");
      q2("zoom").classList.remove("placing");
    }
    q2("place").addEventListener("click", () => {
      if (placing) {
        stopPlacing();
        return;
      }
      placing = true;
      q2("place").setAttribute("aria-pressed", "true");
      q2("zoom").classList.add("placing");
      q2("zoom").scrollIntoView({ block: "nearest" });
    });
    q2("zoom").addEventListener("click", (event) => {
      const svg2 = q2("zoom").querySelector("svg");
      if (!placing || !svg2 || !result) return;
      const coords = sceneCoordinates(svg2, event.clientX, event.clientY, result.frame.plane);
      if (!coords) return;
      stopPlacing();
      edit({ x: Math.round(coords[0] * 10) / 10, y: Math.round(coords[1] * 10) / 10 });
    });
    q2("add").addEventListener("click", () => {
      let id;
      do {
        id = "m" + nextId;
        nextId = nextId % 999999999 + 1;
      } while (values.some((item) => item.id === id));
      values = normalizeMarks([...values, { id, type: add.value }]);
      shown = true;
      selected = id;
      stopPlacing();
      render();
      list2.focus({ preventScroll: true });
    });
    list2.addEventListener("change", () => {
      selected = list2.value;
      stopPlacing();
      render();
    });
    q2("remove").addEventListener("click", () => {
      const at = values.findIndex((item) => item.id === selected);
      values = values.filter((item) => item.id !== selected);
      selected = (values[at] ?? values.at(-1))?.id ?? null;
      stopPlacing();
      render();
      (selected ? list2 : q2("add")).focus({ preventScroll: true });
    });
    q2("reset").addEventListener("click", () => {
      values = [];
      shown = true;
      selected = null;
      nextId = 1;
      stopPlacing();
      render();
    });
    q2("show").addEventListener("change", (event) => {
      shown = event.target.checked;
      stopPlacing();
      render();
    });
    shape.addEventListener("change", () => edit({ shape: shape.value }));
    tone.addEventListener("change", () => edit({ tone: tone.value }));
    q2("seed").addEventListener("change", (event) => edit({ seed: event.target.value }));
    q2("before-mode").addEventListener("change", render);
    return {
      refresh,
      value: () => shown && result?.marks.some((mark) => mark.points.length) ? values : null,
      archiveSettings: () => ({ marks: shown ? values : null, marksLatent: shown ? null : values }),
      restore(data) {
        values = normalizeMarks(data.marks ?? data.marksLatent);
        shown = !data.marksLatent;
        selected = values[0]?.id ?? null;
        nextId = Math.max(0, ...values.map((item) => Number(item.id.slice(1)))) % 999999999 + 1;
        stopPlacing();
      }
    };
  }

  // bio-yeux-01/scars-editor.mjs
  var format9 = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 });
  var unit3 = (key, value) => format9.format(value) + (key === "angle" ? "\xB0" : key === "traces" ? "" : " %");
  function mountScarsEditor({ input, eyes: eyes2, context: context2, render }) {
    const q2 = (id) => document.getElementById("scars-" + id);
    const presets4 = q2("preset"), list2 = q2("list");
    presets4.append(...Object.entries(scarPresets).map(([key, { label }]) => new Option(label, key)));
    q2("apply").addEventListener("click", () => {
      if (active()) edit({ ...normalizeScars([{ id: selected, seed: active().seed, ...scarPresets[presets4.value].values }])[0] });
    });
    let values = [], shown = true, selected = null, nextId = 1, result = null, memo = null, placing = false, error = "";
    const active = () => values.find((item) => item.id === selected);
    const fields2 = Object.entries(scarAxes).map(([key, { label }]) => {
      const field = document.createElement("label"), id = "scars-" + key;
      field.className = "slider";
      field.innerHTML = `<span><span>${label}</span><output for="${id}"></output></span><input type="range" id="${id}" min="0" max="0" step="1" aria-label="${label}" aria-describedby="${id}-range"><small id="${id}-range" class="eye-domain"></small>`;
      q2("axes").append(field);
      const control = { key, input: field.querySelector("input"), output: field.querySelector("output"), range: field.querySelector("small"), points: [] };
      control.input.addEventListener("input", () => {
        if (control.points[control.input.valueAsNumber] !== void 0) edit({ [key]: control.points[control.input.valueAsNumber] });
      });
      return control;
    });
    function edit(changes) {
      values = normalizeScars(values.map((item) => item.id === selected ? { ...item, ...changes } : item));
      render();
    }
    function refresh() {
      const portrait3 = input(), opening = eyes2(), settings = context2();
      const key = JSON.stringify([portrait3, opening, settings, values, shown, selected, error]);
      if (key === memo) return;
      memo = key;
      result = values.length ? scarsFor(portrait3, opening, values, { ...settings, withDomains: true, domainId: selected }) : null;
      const item = active();
      const fit = result?.items.find((scar) => scar.requested.id === selected);
      list2.replaceChildren(...values.map(({ id, mode }) => new Option((mode === "patch" ? "Surfacique" : "Trac\xE9") + " \xB7 " + id.slice(1), id)));
      list2.value = selected ?? "";
      list2.disabled = !values.length;
      q2("show").checked = shown;
      q2("show").disabled = !values.length;
      q2("remove").disabled = !item;
      q2("add").disabled = values.length === 16;
      q2("draw").disabled = !item && values.length === 16;
      q2("apply").disabled = !item;
      q2("reset").disabled = !values.length;
      q2("edit").hidden = !item;
      q2("edit").disabled = !shown;
      q2("place").disabled = !shown || !item || !item.intensity;
      q2("error").textContent = error;
      if (item) {
        q2("mode").value = item.mode;
        q2("sutures").checked = item.sutures;
        q2("sutures").disabled = !fit.domains.sutures;
        q2("seed").value = item.seed;
      }
      const adjusted = [];
      for (const field of fields2) {
        const { key: key2, input: input2, output, range } = field;
        if (!item) continue;
        const request = item[key2], applied = fit.effective[key2];
        if (applied != null && applied !== request) adjusted.push(scarAxes[key2].label);
        const domain2 = fit.domains[key2] ?? [];
        const [min, max] = domain2;
        const indexed = ["x", "y", "traces"].includes(key2);
        const grid3 = indexed ? domain2 : domain2.length && max != null ? [
          min,
          max,
          ...Array.from({ length: Math.floor(max) - Math.ceil(min) + 1 }, (_, i) => Math.ceil(min) + i)
        ] : [];
        field.points = [.../* @__PURE__ */ new Set([...grid3, ...grid3.length && applied != null ? [applied] : []])].sort((a, b) => a - b);
        const value = applied ?? request;
        input2.max = Math.max(0, field.points.length - 1);
        input2.value = Math.max(0, field.points.indexOf(value));
        input2.disabled = field.points.length < 2;
        const text = value === request ? unit3(key2, value) : `${unit3(key2, request)} \u2192 ${unit3(key2, value)}`;
        output.textContent = text;
        input2.setAttribute("aria-valuetext", text);
        range.textContent = grid3.length ? `${unit3(key2, field.points[0])} \xE0 ${unit3(key2, field.points.at(-1))}` : "Valeur en m\xE9moire.";
      }
      q2("status").textContent = !shown ? "Les cicatrices sont masqu\xE9es et restent en m\xE9moire." : !fit ? "Aucune cicatrice." : fit.effective.reason === "contour" ? "Placement en m\xE9moire. Rapprochez le trac\xE9 du centre du visage." : fit.effective.reason === "intensit\xE9" ? "Intensit\xE9 nulle. Les r\xE9glages restent en m\xE9moire." : [
        adjusted.length ? "R\xE9glages ajust\xE9s avec demande conserv\xE9e \xB7 " + adjusted.join(", ") + "." : "",
        fit.effective.interruptions.length ? "R\xE9serves anatomiques rencontr\xE9es \xB7 " + fit.effective.interruptions.join(", ") + "." : ""
      ].filter(Boolean).join(" ");
    }
    function stopPlacing() {
      placing = false;
      q2("place").setAttribute("aria-pressed", "false");
      q2("zoom").classList.remove("placing");
    }
    q2("place").addEventListener("click", () => {
      if (placing) {
        stopPlacing();
        return;
      }
      placing = true;
      q2("place").setAttribute("aria-pressed", "true");
      q2("zoom").classList.add("placing");
      q2("zoom").scrollIntoView({ block: "nearest" });
    });
    q2("zoom").addEventListener("click", (event) => {
      const svg2 = q2("zoom").querySelector("svg");
      if (!placing || !svg2 || !result) return;
      const coords = sceneCoordinates(svg2, event.clientX, event.clientY, result.frame.plane);
      if (!coords) return;
      stopPlacing();
      edit({ x: Math.round(coords[0] * 10) / 10, y: Math.round(coords[1] * 10) / 10 });
    });
    function availableId() {
      let id;
      do {
        id = "s" + nextId;
        nextId = nextId % 999999999 + 1;
      } while (values.some((item) => item.id === id));
      return id;
    }
    function insert(scar) {
      values = normalizeScars([...values, scar]);
      shown = true;
      selected = scar.id;
      stopPlacing();
      render();
      list2.focus({ preventScroll: true });
    }
    q2("add").addEventListener("click", () => insert({ id: availableId(), ...scarPresets[presets4.value].values }));
    q2("draw").addEventListener("click", () => {
      const item = active(), id = item?.id ?? availableId();
      try {
        const seed = item?.seed ?? "Microcosme " + id;
        const sample = drawScar(input(), eyes2(), id, seed, context2());
        error = "";
        if (item) edit(sample);
        else insert(sample);
      } catch (e) {
        error = e.message;
        render();
      }
    });
    q2("seed").addEventListener("change", (event) => edit({ seed: event.target.value }));
    q2("sutures").addEventListener("change", (event) => edit({ sutures: event.target.checked }));
    q2("mode").addEventListener("change", (event) => edit({ mode: event.target.value }));
    list2.addEventListener("change", () => {
      selected = list2.value;
      stopPlacing();
      render();
    });
    q2("remove").addEventListener("click", () => {
      const at = values.findIndex((item) => item.id === selected);
      values = values.filter((item) => item.id !== selected);
      selected = (values[at] ?? values.at(-1))?.id ?? null;
      stopPlacing();
      render();
      (selected ? list2 : q2("add")).focus({ preventScroll: true });
    });
    q2("reset").addEventListener("click", () => {
      values = [];
      shown = true;
      selected = null;
      nextId = 1;
      error = "";
      stopPlacing();
      render();
    });
    q2("show").addEventListener("change", (event) => {
      shown = event.target.checked;
      stopPlacing();
      render();
    });
    q2("before-mode").addEventListener("change", render);
    return {
      refresh,
      value: () => shown && result?.items.some((item) => item.geometry) ? values : null,
      archiveSettings: () => ({ scars: shown ? values : null, scarsLatent: shown ? null : values }),
      restore(data) {
        values = normalizeScars(data.scars ?? data.scarsLatent);
        shown = !data.scarsLatent;
        selected = values[0]?.id ?? null;
        nextId = Math.max(0, ...values.map((item) => Number(item.id.slice(1)))) % 999999999 + 1;
        error = "";
        stopPlacing();
      }
    };
  }

  // bio-yeux-01/scars-study.mjs
  var scarCases = freckleCases;
  var scarViews = Object.freeze([["close", "Gros plan", "42 39 76 67", { headOnly: true }], ...freckleViews.slice(1)]);
  function scarCards(study) {
    const reference = { ...scarPresets.sutured.values, x: 28, y: 64, length: 52, width: 36, angle: 80 };
    return [
      ...Object.values(scarPresets).map(({ label, values }) => ({ label, values: { ...values, seed: study.seed } })),
      ...scarStages.map(([maturity, label]) => ({ label, values: { ...reference, maturity, intensity: 82, seed: study.seed } }))
    ];
  }
  function scarStudyPortrait(study, sample, view, naturalEyes2 = false) {
    const [key, , frame, scale] = view;
    const svg2 = character12(study.face, {
      ...scale,
      eyes: "almond",
      scarStudySkin: study.skin,
      naturalEyes: naturalEyes2,
      contourSkin: study.skin,
      scars: [{ id: "s1", ...sample.values }],
      instance: "planche-cicatrices-" + key
    }).replace(/viewBox="[^"]*"/, `viewBox="${frame}"`);
    return studySkin(svg2, study.skin);
  }
  function mountScarStudy(naturalEyes2 = false) {
    const list2 = document.getElementById("scar-study-case"), gallery = document.getElementById("scar-study");
    list2.append(...scarCases.map((study, i) => new Option(study.label, String(i))));
    function refresh() {
      const study = scarCases[Number(list2.value)];
      gallery.innerHTML = scarCards(study).map((sample, i) => `<article class="freckle-row" data-scar-study="${i}"><h3>${sample.label}</h3><div class="freckle-scales">` + scarViews.map((view) => `<figure class="freckle-${view[0]}">${scarStudyPortrait(study, sample, view, naturalEyes2)}<figcaption>${view[1]}</figcaption></figure>`).join("") + "</div></article>").join("");
    }
    const panel = document.getElementById("scar-study-panel");
    panel.addEventListener("toggle", () => {
      if (panel.open && !gallery.childElementCount) refresh();
    });
    list2.addEventListener("change", refresh);
    if (location.hash === "#planche-cicatrices") panel.open = true;
    window.addEventListener("hashchange", () => {
      if (location.hash === "#planche-cicatrices") panel.open = true;
    });
  }

  // bio-yeux-01/makeup-editor.mjs
  var storageKey = "microcosme.bio-maquillage-01.compositions";
  var references7 = {
    shadow: [
      ["Discret", { intensity: 35, height: 41, extent: 74, outer: 21, accent: null }],
      ["\xC9tendu", { intensity: 63, height: 89, extent: 98, outer: 14, accent: null }],
      ["Externe", { intensity: 67, height: 72, extent: 51, outer: 93, accent: null }],
      ["Bicolore", { intensity: 77, height: 79, extent: 93, outer: 56, accent: "#ac65b2" }]
    ],
    liner: [
      ["Fin", { top: 23, bottom: 0, wing: 0, slant: 0 }],
      ["\xC9pais", { top: 80, bottom: 0, wing: 15, slant: 8 }],
      ["Allong\xE9", { top: 48, bottom: 0, wing: 92, slant: 18 }],
      ["Complet", { top: 67, bottom: 55, wing: 40, slant: 11 }]
    ],
    blush: [
      ["Discret", { intensity: 37, x: 49, y: 36, extent: 48, diffusion: 82 }],
      ["Marqu\xE9", { intensity: 84, x: 49, y: 49, extent: 73, diffusion: 65 }],
      ["Pommettes hautes", { intensity: 66, x: 67, y: 8, extent: 58, diffusion: 73 }]
    ]
  };
  function mountMakeupEditor({ input, eyes: eyes2, context: context2, render }) {
    const q2 = (id) => document.getElementById("makeup-" + id);
    const family = q2("family"), show = q2("show"), enabled = q2("enabled"), zoom = q2("zoom");
    const paintPanel = q2("paint-panel"), kind = q2("paint-kind"), shape = q2("paint-shape"), list2 = q2("paint-list");
    const mirror = q2("mirror"), presets4 = q2("reference"), saved = q2("saved");
    const message = q2("message"), json = q2("json"), name = q2("name");
    const entries = Object.entries(makeupFamilies);
    let values = normalizeMakeup(), selected = 0, shown = true, placing = false, touched = false;
    family.append(...entries.map(([key, { label }]) => new Option(label, key)));
    for (const select of [kind, shape]) {
      select.append(...Object.entries(paintShapes).map(([value, label]) => new Option(label, value)));
    }
    const familyValue = () => values[family.value];
    const edited = () => family.value === "paint" ? values.paint.elements[selected] : familyValue();
    const commit = () => {
      touched = true;
      render();
    };
    function control(key, definition, group) {
      const { label, min, max, unit: unit4, pigment: pigment3, initial } = definition;
      const field = document.createElement("label"), id = "makeup-" + group + "-" + key;
      field.className = pigment3 ? "makeup-pigment" : "slider";
      const title = document.createElement("span");
      title.textContent = label;
      field.append(title);
      const element = document.createElement(pigment3 ? "select" : "input");
      element.id = id;
      element.setAttribute("aria-label", label);
      let output;
      if (pigment3) {
        output = document.createElement("span");
        output.className = "makeup-chip";
        output.setAttribute("aria-hidden", "true");
        title.append(output);
        if (initial === null) element.add(new Option("Aucune", ""));
        for (const [name2, colours2] of makeupPalette) {
          const options2 = document.createElement("optgroup");
          options2.label = name2;
          options2.append(...colours2.map((colour2) => new Option(colour2, colour2)));
          element.append(options2);
        }
      } else {
        element.type = "range";
        element.min = min;
        element.max = max;
        element.step = 1;
        output = document.createElement("output");
        output.htmlFor = id;
        title.append(output);
      }
      field.append(element);
      element.addEventListener(pigment3 ? "change" : "input", () => {
        edited()[key] = pigment3 ? element.value || null : element.valueAsNumber;
        commit();
      });
      return { key, field, element, output, pigment: pigment3, unit: unit4 };
    }
    const panels = Object.fromEntries(entries.map(([group, { fields: fields2 }]) => {
      const panel = document.createElement("div");
      const controls2 = Object.entries(fields2).map(([key, definition]) => control(key, definition, group));
      panel.append(...controls2.map(({ field }) => field));
      q2("controls").append(panel);
      return [group, { panel, controls: controls2 }];
    }));
    function stopPlacing() {
      placing = false;
      q2("place").setAttribute("aria-pressed", "false");
      zoom.classList.remove("placing");
    }
    function refresh() {
      const key = family.value, isPaint = key === "paint";
      const element = edited(), active = shown && familyValue().enabled;
      let off = element ? inactiveFields(key, element) : [];
      if (key === "lips" && active) {
        const layout = makeupFor(input(), eyes2(), { lips: { ...element, intensity: 100, coverage: 100 } }, context2());
        if (!layout.effective.lips) off = Object.keys(makeupFamilies.lips.fields);
      }
      show.checked = shown;
      enabled.checked = familyValue().enabled;
      q2("enabled-text").textContent = isPaint ? "Afficher les peintures faciales" : "Afficher cette famille";
      paintPanel.hidden = !isPaint;
      for (const [group, { panel, controls: controls2 }] of Object.entries(panels)) {
        panel.hidden = group !== key || !element;
        if (panel.hidden) continue;
        for (const { key: field, element: input2, output, pigment: pigment3, unit: unit4 } of controls2) {
          input2.value = element[field] ?? "";
          input2.disabled = !active || off.includes(field);
          if (pigment3) output.style.backgroundColor = element[field] ?? "";
          else {
            output.value = element[field] + (unit4 === "\xB0" ? "\xB0" : " %");
            input2.setAttribute("aria-valuetext", output.value);
          }
        }
      }
      presets4.parentElement.hidden = !references7[key];
      presets4.disabled = !active;
      if (isPaint) {
        const elements2 = values.paint.elements;
        list2.replaceChildren(...elements2.map((item, i) => new Option(i + 1 + " \xB7 " + paintShapes[item.shape], String(i))));
        list2.value = String(selected);
        list2.disabled = !elements2.length;
        q2("add").disabled = !shown || elements2.length >= maxPaintElements;
        q2("remove").disabled = !element;
        q2("down").disabled = !element || selected === 0;
        q2("up").disabled = !element || selected === elements2.length - 1;
        q2("place").disabled = !element || !active || element.intensity === 0;
        shape.disabled = !element || !active;
        mirror.disabled = !element || !active || element.intensity === 0 || !makeupMirrorUseful(element);
        if (element) {
          shape.value = element.shape;
          mirror.checked = element.mirror;
        }
      }
    }
    function updatePresets() {
      presets4.replaceChildren(new Option("Personnalis\xE9", ""), ...(references7[family.value] ?? []).map(([label], i) => new Option(label, String(i))));
    }
    family.addEventListener("change", () => {
      stopPlacing();
      updatePresets();
      refresh();
    });
    show.addEventListener("change", () => {
      shown = show.checked;
      stopPlacing();
      commit();
    });
    enabled.addEventListener("change", () => {
      familyValue().enabled = enabled.checked;
      stopPlacing();
      commit();
    });
    presets4.addEventListener("change", () => {
      if (presets4.value === "") return;
      Object.assign(familyValue(), references7[family.value][Number(presets4.value)][1]);
      commit();
    });
    q2("reset").addEventListener("click", () => {
      values[family.value] = normalizeMakeup()[family.value];
      selected = 0;
      stopPlacing();
      updatePresets();
      commit();
    });
    q2("remove-all").addEventListener("click", () => {
      shown = false;
      stopPlacing();
      commit();
    });
    q2("draw").addEventListener("click", () => {
      values = drawMakeup(q2("seed").value);
      shown = true;
      selected = 0;
      stopPlacing();
      updatePresets();
      commit();
    });
    q2("add").addEventListener("click", () => {
      const { elements: elements2 } = values.paint;
      if (elements2.length >= maxPaintElements) return;
      selected = elements2.length;
      values.paint = normalizeMakeup({ paint: { enabled: true, elements: [...elements2, { shape: kind.value }] } }).paint;
      stopPlacing();
      commit();
    });
    q2("remove").addEventListener("click", () => {
      const { elements: elements2 } = values.paint;
      elements2.splice(selected, 1);
      selected = Math.max(0, Math.min(selected, elements2.length - 1));
      stopPlacing();
      commit();
    });
    list2.addEventListener("change", () => {
      selected = Number(list2.value);
      stopPlacing();
      refresh();
    });
    shape.addEventListener("change", () => {
      edited().shape = shape.value;
      commit();
    });
    mirror.addEventListener("change", () => {
      edited().mirror = mirror.checked;
      commit();
    });
    for (const [button, step] of [["down", -1], ["up", 1]]) {
      q2(button).addEventListener("click", () => {
        const { elements: elements2 } = values.paint, next = selected + step;
        [elements2[selected], elements2[next]] = [elements2[next], elements2[selected]];
        selected = next;
        commit();
      });
    }
    q2("place").addEventListener("click", () => {
      if (placing) return stopPlacing();
      placing = true;
      q2("place").setAttribute("aria-pressed", "true");
      zoom.classList.add("placing");
      message.textContent = "Touchez la peau pour placer la forme.";
    });
    zoom.addEventListener("click", (event) => {
      const svg2 = zoom.querySelector("svg");
      if (!placing || !svg2 || !edited()) return;
      const location2 = sceneCoordinates(svg2, event.clientX, event.clientY, makeupPlane(input(), eyes2()));
      const position = location2 && makeupCoordinates(...location2);
      if (!position || position.some((value) => value < 0 || value > 100)) {
        message.textContent = "Choisissez une zone de peau \xE0 l\u2019int\xE9rieur du visage.";
        return;
      }
      [edited().x, edited().y] = position;
      stopPlacing();
      message.textContent = "Forme plac\xE9e.";
      commit();
    });
    const readLibrary = () => new Map(JSON.parse(localStorage.getItem(storageKey) ?? "[]"));
    function refreshLibrary(selection2 = saved.value) {
      const library = readLibrary();
      saved.replaceChildren(
        new Option("Choisir une composition", ""),
        ...[...library.keys()].sort((a, b) => a.localeCompare(b, "fr")).map((key) => new Option(key, key))
      );
      if (library.has(selection2)) saved.value = selection2;
      q2("apply").disabled = !saved.value;
    }
    function perform(action) {
      try {
        action();
      } catch (error) {
        message.textContent = error.message;
      }
    }
    function apply(composition, feedback) {
      values = composition;
      shown = true;
      selected = 0;
      stopPlacing();
      updatePresets();
      message.textContent = feedback;
      commit();
    }
    q2("save").addEventListener("click", () => perform(() => {
      const title = name.value.trim();
      if (!title) throw new Error("Indiquez un nom pour enregistrer la composition.");
      const library = readLibrary();
      library.set(title, makeupDocument(values));
      localStorage.setItem(storageKey, JSON.stringify([...library]));
      refreshLibrary(title);
      message.textContent = "Composition enregistr\xE9e sur cet appareil.";
    }));
    saved.addEventListener("change", () => {
      q2("apply").disabled = !saved.value;
    });
    q2("apply").addEventListener("click", () => perform(() => {
      const document2 = readLibrary().get(saved.value);
      apply(parseMakeup(JSON.stringify(document2)), "Composition appliqu\xE9e au visage actuel.");
    }));
    q2("export").addEventListener("click", () => {
      json.value = JSON.stringify(makeupDocument(values), null, 2);
      message.textContent = "Composition export\xE9e en JSON.";
    });
    q2("import").addEventListener("click", () => perform(() => apply(parseMakeup(json.value), "Composition import\xE9e et appliqu\xE9e au visage actuel.")));
    updatePresets();
    perform(() => refreshLibrary());
    return {
      refresh,
      value: () => shown && hasMakeup(values) ? values : null,
      archiveSettings: () => !touched ? {} : shown ? { makeup: values } : { makeupLatent: values },
      restore({ makeup, makeupLatent }) {
        touched = !!(makeup || makeupLatent);
        values = normalizeMakeup(makeup ?? makeupLatent ?? {});
        selected = 0;
        shown = !makeupLatent;
        stopPlacing();
        updatePresets();
      }
    };
  }

  // bio-yeux-01/makeup-study.mjs
  var [honey, rosy, copper, brown] = freckleCases;
  var lips = { enabled: true, colour: "#a52f47", intensity: 76, coverage: 91, edge: 33 };
  var shadow = { enabled: true, colour: "#79549e", accent: "#ac65b2", height: 89, intensity: 85, extent: 93 };
  var liner = { enabled: true, colour: "#151519", top: 59, bottom: 26, wing: 89, slant: 18 };
  var blush = { enabled: true, colour: "#cf526f", intensity: 71, x: 68, y: 13, diffusion: 77 };
  var elements = [
    { shape: "crescent", x: 27, y: 59, size: 30, stretch: 0, rotation: 23, mirror: true, colour: "#3f649b" },
    { shape: "diamond", x: 50, y: 27, size: 17, stretch: 0, colour: "#4d9eab" },
    { shape: "point", x: 19, y: 57, size: 59, mirror: true, colour: "#fff8e9" }
  ];
  function studyViews(study) {
    const { cx, cy, rx, ry } = model8(study.face).base.head;
    const focus = `${cx - rx * 1.18} ${cy - ry * 0.52} ${rx * 2.36} ${ry * 1.53}`;
    return [["detail", "D\xE9tail du maquillage", focus, { headOnly: true }], ...freckleViews.slice(1)];
  }
  var examples = [
    ["L\xE8vres \xB7 contour de prune", rosy, { lips }],
    ["Fard \xE0 paupi\xE8res \xB7 d\xE9grad\xE9 bicolore", honey, { shadow }],
    ["Eyeliner \xB7 pointe montante", copper, { liner }],
    ["Fard \xE0 joues \xB7 pommettes hautes", brown, { blush }],
    ["Peintures \xB7 croissants en miroir", rosy, { paint: { enabled: true, elements } }],
    ["L\xE8vres, paupi\xE8res, eyeliner et joues", honey, { lips, shadow, liner, blush }],
    ["Cinq familles \xB7 composition asym\xE9trique", brown, {
      lips: { ...lips, colour: "#db7452" },
      shadow: { ...shadow, colour: "#dc8437", accent: "#e0b43f" },
      liner: { ...liner, colour: "#493026" },
      blush: { ...blush, colour: "#a83d30" },
      paint: { enabled: true, elements: [
        { shape: "stripe", x: 29, y: 62, size: 43, stretch: 28, rotation: -25, colour: "#397e62", intensity: 92 },
        { shape: "wave", x: 30, y: 62, size: 28, rotation: -25, colour: "#fff8e9", intensity: 96 },
        { shape: "star", x: 74, y: 67, size: 23, stretch: 0, rotation: 17, colour: "#e0b43f" },
        { shape: "ring", x: 50, y: 26, size: 24, stretch: 0, colour: "#e0b43f" }
      ] }
    }]
  ];
  function mountMakeupStudy(naturalEyes2 = false) {
    const gallery = document.getElementById("makeup-study");
    const panel = document.getElementById("makeup-study-panel");
    const openFromLink = () => {
      if (location.hash === "#planche-maquillage") panel.open = true;
    };
    window.addEventListener("hashchange", openFromLink);
    openFromLink();
    document.getElementById("makeup-study-palette").innerHTML = makeupPalette.map(([label, colours2]) => `<div><span>${label}</span><div>${colours2.map((colour2) => `<span class="makeup-chip" title="${colour2}" aria-label="${colour2}" style="background:${colour2}"></span>`).join("")}</div></div>`).join("");
    function refresh() {
      if (gallery.firstElementChild || !panel.open) return;
      gallery.innerHTML = examples.map(([label, study, makeup], i) => `<article class="freckle-row" data-makeup-study="${i}"><header><h3>${label}</h3><p>${study.label.split(" \xB7 ").slice(0, 2).join(" \xB7 ")}</p></header>
      <div class="freckle-scales">${studyViews(study).map(([key, caption, frame, scale]) => {
        const svg2 = character12(study.face, {
          ...scale,
          eyes: ["almond", "round", "narrow"][i % 3],
          makeup,
          naturalEyes: naturalEyes2,
          contourSkin: study.skin,
          instance: "planche-maquillage-" + i + "-" + key
        }).replace(/viewBox="[^"]*"/, `viewBox="${frame}"`);
        return `<figure class="freckle-${key}">${studySkin(svg2, study.skin)}<figcaption>${caption}</figcaption></figure>`;
      }).join("")}</div></article>`).join("");
    }
    panel.addEventListener("toggle", refresh);
    refresh();
  }

  // bio-yeux-01/eye-contour-study.mjs
  var pale = { face: { style: "shaved", ...presets2.broad.values }, skin: "#f4cfb6", tone: "Ros\xE9e claire" };
  var honey2 = { face: { style: "p5-038" }, skin: "#dbbf88", tone: "Miel" };
  var copper2 = { face: { style: "p5-041", ...presets2.broad.values }, skin: "#a57155", tone: "Cuivr\xE9e" };
  var deep = { face: { style: "shaved", ...presets2.tall.values }, skin: "#573222", tone: "Brune profonde" };
  var dense = { lashes: { count: 3, length: 10, spacing: 50 } };
  var withLiner = (colour2) => ({
    liner: { enabled: true, colour: colour2, top: 63, bottom: 24, wing: 87, slant: 23, intensity: 100 }
  });
  var eyeContourCases = [
    { label: "Ouverture historique", ...honey2, eyes: null },
    { label: "Contour seul", ...pale, eyes: "round", details: { lashes: { count: 0 } } },
    { label: "Cils naturels \xB7 faible densit\xE9", ...copper2, eyes: "almond", details: { lashes: { count: 1, length: 9 } } },
    { label: "Cils naturels \xB7 forte densit\xE9", ...deep, eyes: "upturned", details: dense },
    { label: "Cils et eyeliner noir", ...deep, eyes: "upturned", details: dense, makeup: withLiner("#151519") },
    { label: "Eyeliner bleu", ...pale, eyes: "narrow", details: { lashes: { count: 0 } }, makeup: withLiner("#3f649b") }
  ];
  function views2(sample) {
    const { eyeLeft: [left, y], eyeRight: [right] } = model8(sample.face).base.anchors;
    return [
      ["eye-close", "D\xE9tail des yeux", `${left - 14} ${y - 15} ${right - left + 28} 31`, { headOnly: true }],
      ...freckleViews.slice(1)
    ];
  }
  function portrait2(sample, view, naturalEyes2, instance) {
    const [key, caption, frame, scale] = view;
    const svg2 = character12(sample.face, {
      ...scale,
      eyes: sample.eyes,
      details: sample.details,
      makeup: sample.makeup,
      naturalEyes: naturalEyes2,
      contourSkin: sample.skin,
      instance
    }).replace(/viewBox="[^"]*"/, `viewBox="${frame}"`);
    return `<figure class="freckle-${key}" data-eye-scale="${key}">${studySkin(svg2, sample.skin)}<figcaption>${caption}</figcaption></figure>`;
  }
  function mountEyeContourStudy() {
    const section = document.getElementById("planche-contours");
    const panel = document.getElementById("eye-contour-panel");
    const gallery = document.getElementById("eye-contour-study");
    section.hidden = false;
    document.querySelector('a[href="#planche-contours"]').hidden = false;
    function refresh() {
      if (gallery.firstElementChild || !panel.open) return;
      gallery.innerHTML = eyeContourCases.map((sample, i) => {
        const form = eyePresets[sample.eyes]?.label ?? "Historique";
        const pair3 = [["before", "Avant", false], ["after", "Apr\xE8s", true]].map(([key, label, revised]) => `<section data-eye-revision="${key}"><h4>${label}</h4><div class="eye-contour-views">${views2(sample).map((view) => portrait2(sample, view, revised, `contours-${i}-${key}-${view[0]}`)).join("")}</div></section>`).join("");
        return `<article data-eye-contour-case="${i}" class="freckle-row"><h3>${sample.label}</h3>
        <p><span class="makeup-chip" aria-hidden="true" style="background:${sample.skin}"></span> ${sample.tone} \xB7 ${form}</p>
        <div class="eye-contour-pair">${pair3}</div></article>`;
      }).join("");
    }
    function openFromLink() {
      if (location.hash === "#planche-contours") panel.open = true;
    }
    panel.addEventListener("toggle", refresh);
    window.addEventListener("hashchange", openFromLink);
    openFromLink();
    refresh();
  }

  // bio-yeux-01/app.mjs
  var q = (selector) => document.querySelector(selector);
  var naturalEyes = q("#atelier").hasAttribute("data-natural-eyes");
  var format10 = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 });
  var escape = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
  var neutral = normalizeEyes({});
  var eyeEntries = Object.entries(eyePresets);
  var otherLabels = { historical: "Historique", minimum: "Extr\xEAme minimum", maximum: "Extr\xEAme maximum", custom: "Personnalis\xE9" };
  var axes11 = Object.keys(controls);
  var extrema2 = (property) => Object.fromEntries(Object.entries(eyeControls).map(([key, range]) => [key, range[property]]));
  var morphs = {
    neutral: { name: "Neutre", values: {} },
    ipad: { name: "Cas iPad combin\xE9", values: Object.fromEntries(axes11.map((key) => [key, priorityCase[key]])) },
    tall: presets2.tall,
    broad: presets2.broad,
    min: { name: "Tous les minima", values: Object.fromEntries(axes11.map((key) => [key, controls[key].min])) },
    max: { name: "Tous les maxima", values: Object.fromEntries(axes11.map((key) => [key, controls[key].max])) }
  };
  var bodyPreferences = /* @__PURE__ */ new Map();
  var variety = [
    "p5-038:G",
    "p5-048:G",
    "curls:U",
    "waist_waves:U",
    "braids:U",
    "p5-041:G",
    "p5-056:D",
    "p5-061:D",
    "p5-071:G",
    "p5-029:G",
    "p5-034:G",
    "p5-051:G",
    "p5-058:G",
    "p5-068:G",
    "p5-024:D",
    "p5-058:D"
  ];
  var selection = restoreSelection2({ style: "p5-038", arrangement: "G", body: "standard", accessories: true, contrast: true });
  var eyes = null;
  var selectedForm = "historical";
  var colour = "chatain-clair";
  var category = "natural";
  var serial = 0;
  var draw = null;
  var morphForm = "neutral";
  var pending = null;
  var editingValues;
  var eyePoints = {};
  var available = {};
  var fullPrecision = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 16 });
  function options(selector, entries) {
    for (const [value, text] of entries) q(selector).add(new Option(text, value));
  }
  function sliders(selector, entries, step, changed, type) {
    for (const [key, range] of entries) {
      const label = document.createElement("label");
      label.className = "slider";
      label.innerHTML = `<span>${range.label}<output for="${type}-${key}"></output></span><input id="${type}-${key}" type="range" min="${range.min}" max="${range.max}" step="${step}" aria-label="${escape(range.label)}">`;
      const slider = label.querySelector("input");
      if (type === "eye") {
        const hint = document.createElement("small");
        hint.id = "eye-domain-" + key;
        hint.className = "eye-domain";
        label.append(hint);
        slider.setAttribute("aria-describedby", hint.id);
      }
      slider.addEventListener("input", (event) => changed(key, event.target.valueAsNumber));
      q(selector).append(label);
    }
  }
  function inputFor(key) {
    return characterInput(selection, key);
  }
  var frames = { head: "-30 -65 220 225", tile: "-40 -85 240 355", mini: "-35 -68 230 245" };
  function svg({ key, body, structure, corpulence, chest, chestStudySkin, beforeCorpulenceCorrection, view = "head", value = eyes, frame = frames[view], guides: guides2 = false, hair: hair2 = activeColour(), decorative = false, pigment: pigment3 = null, details: details2 = null, brows = null, mouth = null, nose = null, beard = null, beardCategory, marks = null, scars = null, makeup = null } = {}) {
    const input = inputFor(key);
    if (body !== void 0) {
      input.body = body;
      input.structure = structure;
      input.corpulence = corpulence;
      input.chest = chest;
    }
    const result = character12(input, {
      eyes: value,
      iris: pigment3,
      details: details2,
      brows,
      mouth,
      nose,
      beard,
      beardCategory,
      marks,
      scars,
      makeup,
      eyeEnvelopes: guides2,
      hairColor: hair2,
      rememberedHairColor: colour,
      headOnly: view !== "tile",
      smallScale: view === "mini",
      naturalEyes,
      beforeCorpulenceCorrection,
      chestStudySkin,
      instance: "atelier-yeux-" + ++serial
    }).replace(/viewBox="[^"]*"/, `viewBox="${frame}"`);
    return decorative ? result.replace("<svg ", '<svg aria-hidden="true" focusable="false" ') : result;
  }
  function activeColour() {
    return q("#flat-mode").checked ? colour : "historical";
  }
  function displayValue(key, value) {
    return format10.format(value) + (eyeControls[key].unit === "\xB0" ? "\xB0" : " %");
  }
  function clearProposal() {
    pending = null;
    q("#eye-proposal").hidden = true;
  }
  function showProposal(changes, apply, reason, trigger) {
    pending = { apply, trigger };
    q("#eye-proposal").hidden = false;
    q("#eye-proposal-status").textContent = reason;
    q("#eye-proposal-values").replaceChildren(...changes.map(({ key, before, after }) => {
      const item = document.createElement("li");
      const unit4 = eyeControls[key].unit === "\xB0" ? "\xB0" : " %";
      item.textContent = `${eyeControls[key].label} \xB7 ${fullPrecision.format(before)} \u2192 ${fullPrecision.format(after)}${unit4}`;
      return item;
    }));
    q("#eye-confirm").focus({ preventScroll: true });
    q("#eye-proposal").scrollIntoView({ block: "nearest" });
  }
  function setEyes(form, value, origin = null) {
    clearProposal();
    draw = origin;
    selectedForm = form;
    eyes = value;
    renderEyes();
  }
  function requestEyes(form, value, trigger, origin = null) {
    const face = eyesFor(inputFor(), null).face;
    const proposal = eyeProposal(face, value);
    const apply = () => setEyes(form, value, origin);
    if (!proposal.changes.length) {
      apply();
      return;
    }
    q("#eye-preset").value = selectedForm;
    showProposal(
      proposal.changes,
      apply,
      "La demande d\xE9passe les limites du visage. Voici les \xE9carts entre valeurs demand\xE9es et propos\xE9es.",
      trigger
    );
  }
  function intervalText(intervals, key) {
    return intervals.map(([min, max]) => min === max ? displayValue(key, min) : `${format10.format(min)} \xE0 ${displayValue(key, max)}`).join(" ou ");
  }
  function renderEyes() {
    q("#eye-preset").value = selectedForm;
    const result = eyesFor(inputFor(), eyes);
    editingValues = result.effective ?? eyeProposal(result.face, neutral).effective;
    const domains = eyeDomains(result.face, editingValues);
    if (!q("#eye-request-panel").open) syncRequest();
    for (const [key, range] of Object.entries(eyeControls)) {
      const { intervals, points } = domains[key];
      const current = editingValues[key];
      const slider = q("#eye-" + key);
      eyePoints[key] = points.includes(current) ? points : [...points, current].sort((a, b) => a - b);
      slider.min = 0;
      slider.max = eyePoints[key].length - 1;
      slider.value = eyePoints[key].indexOf(current);
      slider.disabled = eyePoints[key].length <= 1;
      q("#eye-domain-" + key).textContent = !intervals.length ? "Aucun pas entier direct \xB7 ajustement conjoint possible." : `Admissible en direct \xB7 ${intervalText(intervals, key)}${slider.disabled ? " \xB7 valeur unique" : ""}`;
      const shown = key === "taper" && current === range.min ? "Arrondi" : key === "taper" && current === range.max ? "Pointu" : displayValue(key, current);
      const adjusted = result.corrected.includes(key);
      const requested = adjusted ? displayValue(key, result.requested[key]) : null;
      slider.setAttribute("aria-valuetext", adjusted ? `${requested} demand\xE9, ${shown} effectif` : shown);
      q(`output[for="eye-${key}"]`).textContent = adjusted ? `${requested} \u2192 ${shown}` : shown;
    }
    const status = q("#eye-status");
    const text = !eyes ? "Rendu historique actif. D\xE9placer un curseur d\xE9marre une forme personnalis\xE9e." : result.corrected.length ? "Les valeurs \xE0 droite sont les valeurs appliqu\xE9es." : "Toutes les valeurs demand\xE9es sont appliqu\xE9es.";
    if (status.textContent !== text) status.textContent = text;
    for (const button of document.querySelectorAll("[data-eye-form]")) {
      button.setAttribute("aria-pressed", String(button.dataset.eyeForm === selectedForm));
    }
    irisEditor.refresh();
    detailsEditor.refresh();
    browsEditor.refresh();
    noseEditor.refresh();
    mouthEditor.refresh();
    renderComparison();
  }
  function renderComparison() {
    const guides2 = q("#eye-guides").checked;
    const comparison = q("#comparison");
    comparison.dataset.eyes = selectedForm;
    comparison.className = "comparison " + q("#background").value;
    q("#guide-note").hidden = !guides2;
    const pigment3 = irisEditor.value();
    const details2 = detailsEditor.value();
    const brows = browsEditor.value();
    const mouth = mouthEditor.value();
    const nose = noseEditor.value();
    beardEditor.refresh();
    const beard = beardEditor.value(), beardCategory = beardEditor.category();
    marksEditor.refresh();
    const marks = marksEditor.value();
    scarsEditor.refresh();
    const scars = scarsEditor.value();
    makeupEditor.refresh();
    const makeup = makeupEditor.value();
    const compareMakeup = makeup && q("#makeup-before-mode").value === "same";
    q("#makeup-before-wrap").hidden = !makeup;
    const compareScars = !!scars && q("#scars-before-mode").value === "same";
    q("#scars-before-wrap").hidden = !scars;
    const compareMarks = !scars && !!marks && q("#marks-before-mode").value === "same";
    q("#marks-before-wrap").hidden = !marks || !!scars;
    q("#beard-before-wrap").hidden = !beard || !!marks || !!scars;
    const compareBeard = !scars && !marks && !!beard && q("#beard-before-mode").value === "same";
    q("#nose-before-wrap").hidden = !nose || !!beard || !!marks || !!scars;
    const compareNose = !scars && !marks && !beard && !!nose && q("#nose-before-mode").value === "same";
    const compareMouth = !scars && !marks && !beard && !nose && !!mouth && q("#mouth-before-mode").value === "same";
    const compareBrows = !scars && !marks && !beard && !nose && !mouth && !!brows && q("#brows-before-mode").value === "same";
    const compareDetails = !scars && !marks && !beard && !nose && !mouth && !brows && !!details2 && q("#details-before-mode").value === "same";
    const sameOpening = !scars && !marks && !beard && !nose && !mouth && !brows && !details2 && !!pigment3 && q("#iris-before-mode").value === "same";
    q("#mouth-before-wrap").hidden = !mouth || !!nose || !!beard || !!marks || !!scars;
    q("#brows-before-wrap").hidden = !brows || !!mouth || !!nose || !!beard || !!marks || !!scars;
    q("#details-before-wrap").hidden = !details2 || !!brows || !!mouth || !!nose || !!beard || !!marks || !!scars;
    q("#iris-before-mode").parentElement.hidden = !!details2 || !!brows || !!mouth || !!nose || !!beard || !!marks || !!scars;
    const sizes = (settings) => [["head", "T\xEAte \xB7 300 px"], ["tile", "Corps \xB7 178 px"], ["mini", "Miniature \xB7 70 \xD7 70 px"]].map(([view, caption]) => `<figure><div class="surface ${view}">${svg({ view, guides: guides2, ...settings })}</div><figcaption>${caption}</figcaption></figure>`).join("");
    const title = makeup ? "Visage maquill\xE9" : scars ? "Cicatrices" : marks ? "Marques cutan\xE9es" : beard ? "Pilosit\xE9 personnalis\xE9e" : nose ? "Nez personnalis\xE9" : mouth ? "Bouche personnalis\xE9e" : brows ? "Sourcils personnalis\xE9s" : details2 ? "D\xE9tails personnalis\xE9s" : pigment3 ? "Iris personnalis\xE9s" : eyePresets[selectedForm]?.label ?? otherLabels[selectedForm];
    const before = compareMakeup ? "Visage actuel sans maquillage" : makeup ? "Historique" : compareScars ? "Visage actuel sans cicatrices" : compareMarks ? "Visage actuel sans marques" : compareBeard ? "Visage actuel, imberbe" : compareNose ? "Nez historique" : compareMouth ? "Bouche historique" : compareBrows ? "Sourcils historiques" : compareDetails ? "Contours historiques" : sameOpening ? "Pigments historiques" : "Historique";
    const comparisonReference = {
      value: compareScars || compareMarks || compareBeard || compareNose || compareMouth || compareBrows || compareDetails || sameOpening ? eyes : null,
      pigment: compareScars || compareMarks || compareBeard || compareNose || compareMouth || compareBrows || compareDetails ? pigment3 : null,
      details: compareScars || compareMarks || compareBeard || compareNose || compareMouth || compareBrows ? details2 : null,
      brows: compareScars || compareMarks || compareBeard || compareNose || compareMouth ? brows : null,
      mouth: compareScars || compareMarks || compareBeard || compareNose ? mouth : null,
      nose: compareScars || compareMarks || compareBeard ? nose : null,
      beard: compareScars || compareMarks ? beard : null,
      marks: compareScars ? marks : null,
      beardCategory
    };
    const current = { value: eyes, pigment: pigment3, details: details2, brows, mouth, nose, beard, beardCategory, marks, scars };
    const referenceSettings = compareMakeup ? current : makeup ? { value: null } : comparisonReference;
    comparison.innerHTML = `<article data-side="before"><h3>${before}</h3>${sizes(referenceSettings)}</article><article data-side="after"><h3>${title}</h3>${sizes({ ...current, makeup })}</article>`;
    const renderBody = (settings) => svg({ ...current, makeup, ...settings });
    const background = q("#background").value;
    if (isAdultBody(selection.state.body)) {
      const preview = q("#structure-live");
      preview.className = "surface tile " + background;
      preview.innerHTML = renderBody({ view: "tile" });
    }
    const bodyStudy = q("#planche-corps");
    if (bodyStudy.open) {
      renderBodyStudy(bodyStudy, { render: renderBody, chin: model8(inputFor()).anchors.chin, bodies, background });
    }
    const structureStudy = q("#planche-ossature");
    if (structureStudy.open) renderStructureStudy(structureStudy, { render: renderBody, background });
    const corpulenceStudy = q("#planche-corpulence");
    if (corpulenceStudy.open) renderCorpulenceStudy(corpulenceStudy, { render: renderBody, background });
    const chestStudy = q("#planche-poitrine");
    if (chestStudy.open) renderChestStudy(chestStudy, { render: renderBody, background });
    const { envelopes: [left, right], maxWidth, reference } = eyesFor(inputFor(), null).face;
    const x = left.x - maxWidth / 2 - 2, width = right.x + maxWidth / 2 + 2 - x;
    const zoom = q("#iris-zoom");
    zoom.className = "surface " + q("#background").value;
    zoom.innerHTML = svg({ frame: `${x} ${left.y - 8} ${width} 16`, pigment: pigment3 });
    const detailZoom = q("#details-zoom");
    detailZoom.className = "surface " + q("#background").value;
    const top = Math.min(left.top, right.top) - 1.5, bottom = Math.max(left.bottom, right.bottom) + 0.7;
    const pad = Math.max(maxWidth, reference.width) * 0.65 + 2.35;
    detailZoom.innerHTML = svg({ frame: `${left.x - pad} ${top} ${right.x - left.x + 2 * pad} ${bottom - top}`, pigment: pigment3, details: details2 });
    const browZoom = q("#brows-zoom");
    browZoom.className = "surface " + q("#background").value;
    const browTop = left.y - reference.height * 2.18, browBottom = left.y + reference.height * 0.36;
    browZoom.innerHTML = svg({ frame: `${left.x - pad} ${browTop} ${right.x - left.x + 2 * pad} ${browBottom - browTop}`, pigment: pigment3, details: details2, brows });
    const mouthZoom = q("#mouth-zoom");
    mouthZoom.className = "surface " + q("#background").value;
    const { base: { head, anchors }, anchors: { chin } } = model8(inputFor());
    const mouthTop = anchors.nose[1] - head.ry * 0.16, mouthBottom = chin[1] + 2.5, mouthPad = head.rx * 0.68;
    mouthZoom.innerHTML = svg({
      frame: `${anchors.mouth[0] - mouthPad} ${mouthTop} ${mouthPad * 2} ${mouthBottom - mouthTop}`,
      pigment: pigment3,
      details: details2,
      brows,
      mouth,
      nose
    });
    const noseZoom = q("#nose-zoom");
    noseZoom.className = "surface " + q("#background").value;
    const noseTop = anchors.nose[1] - head.ry * 0.36, noseBottom = anchors.mouth[1] + head.ry * 0.16;
    noseZoom.innerHTML = svg({
      frame: `${anchors.nose[0] - mouthPad} ${noseTop} ${mouthPad * 2} ${noseBottom - noseTop}`,
      pigment: pigment3,
      details: details2,
      brows,
      mouth,
      nose
    });
    const beardZoom = q("#beard-zoom");
    beardZoom.className = "surface " + q("#background").value;
    const beardTop = head.cy - head.ry * 0.27, beardBottom = chin[1] + head.ry * 0.52, beardHalf = head.rx * 1.25;
    beardZoom.innerHTML = svg({
      frame: `${head.cx - beardHalf} ${beardTop} ${beardHalf * 2} ${beardBottom - beardTop}`,
      pigment: pigment3,
      details: details2,
      brows,
      mouth,
      nose,
      beard,
      beardCategory
    });
    const markZoom = q("#marks-zoom");
    markZoom.classList.toggle("dark", q("#background").value === "dark");
    markZoom.classList.toggle("light", q("#background").value === "light");
    const markHalf = head.rx * 1.29, markTop = head.cy - head.ry * 1.03;
    markZoom.innerHTML = svg({
      frame: `${head.cx - markHalf} ${markTop} ${markHalf * 2} ${head.ry * 2.17}`,
      pigment: pigment3,
      details: details2,
      brows,
      mouth,
      nose,
      beard,
      beardCategory,
      marks
    });
    const scarZoom = q("#scars-zoom");
    scarZoom.classList.toggle("dark", q("#background").value === "dark");
    scarZoom.classList.toggle("light", q("#background").value === "light");
    scarZoom.innerHTML = svg({
      frame: `${head.cx - markHalf} ${markTop} ${markHalf * 2} ${head.ry * 2.17}`,
      pigment: pigment3,
      details: details2,
      brows,
      mouth,
      nose,
      beard,
      beardCategory,
      marks,
      scars
    });
    const makeupZoom = q("#makeup-zoom");
    makeupZoom.classList.toggle("dark", q("#background").value === "dark");
    makeupZoom.classList.toggle("light", q("#background").value === "light");
    makeupZoom.innerHTML = svg({ frame: `${head.cx - markHalf} ${markTop} ${markHalf * 2} ${head.ry * 2.17}`, ...current, makeup });
  }
  function renderChart() {
    const { envelopes: [left, right], maxWidth } = eyesFor(inputFor(), null).face;
    const x = left.x - maxWidth / 2 - 3;
    const width = right.x + maxWidth / 2 + 3 - x;
    const frame = `${x} ${left.y - 13} ${width} 26`;
    const cards = [
      ["historical", otherLabels.historical, null],
      ...eyeEntries.map(([id, preset]) => [id, preset.label, preset.values]),
      ["minimum", otherLabels.minimum, extrema2("min")],
      ["maximum", otherLabels.maximum, extrema2("max")]
    ];
    q("#shape-grid").innerHTML = cards.map(([id, label, value]) => `<button data-eye-form="${id}" type="button" aria-pressed="${id === selectedForm}">${svg({ value, frame, decorative: true })}<span class="caption">${label}</span></button>`).join("");
  }
  function rememberBody() {
    const { body, structure, corpulence, chest } = selection.state;
    if (!isAdultBody(body)) return;
    if (structure || corpulence !== void 0 || chest) bodyPreferences.set(body, { structure, corpulence, chest });
    else bodyPreferences.delete(body);
  }
  function syncBodyControls() {
    const active = isAdultBody(selection.state.body);
    q("#structure-panel").hidden = !active;
    const chestActive = selection.state.body === "adult-f";
    q("#chest-panel").hidden = !chestActive;
    if (chestActive) syncChestControls();
    if (!active) return;
    const corpulence = selection.state.corpulence ?? referenceCorpulence;
    const range = q("#corpulence");
    const stop = corpulenceStops.find(({ value }) => value === corpulence);
    const description = `${format10.format(corpulence)} %${stop ? " \xB7 " + stop.label : ""}`;
    range.value = corpulence;
    range.setAttribute("aria-valuetext", description);
    q("#corpulence-value").textContent = description;
    const values = selection.state.structure ?? referenceStructure;
    for (const [key, value] of Object.entries(values)) {
      const slider = q("#structure-" + key);
      slider.value = value;
      const percent4 = `${value} %`;
      slider.setAttribute("aria-valuetext", percent4);
      q(`output[for="structure-${key}"]`).textContent = percent4;
    }
  }
  function syncChestControls() {
    const chest = selection.state.chest ?? referenceChest;
    const preset = chestPresets.find(([, , values]) => Object.entries(values).every(([key, value]) => chest[key] === value));
    q("#chest-preset").value = preset?.[0] ?? "custom";
    q("#chest-flat-note").hidden = chest.volume !== 0;
    for (const [key, value] of Object.entries(chest)) {
      const slider = q("#chest-" + key);
      slider.value = value;
      slider.disabled = key !== "volume" && chest.volume === 0;
      const description = key === "volume" && value === 0 ? "0 % \xB7 Plate" : `${format10.format(value)} %`;
      slider.setAttribute("aria-valuetext", description);
      q(`output[for="chest-${key}"]`).textContent = description;
    }
  }
  function syncSelection(updateJSON = true) {
    const entry = choice(selection.key);
    q("#ordinary").value = selection.visibleKey;
    q("#historical").value = selection.key;
    const arrangements2 = entry.arrangement === "U" ? [new Option("Unique", "U")] : [new Option("G"), new Option("D")];
    q("#arrangement").replaceChildren(...arrangements2);
    q("#arrangement").value = entry.arrangement;
    const ordinary = selection.visibleKey === selection.key ? "" : ` \xB7 Entr\xE9e ordinaire ${choice(selection.visibleKey).label}`;
    q("#identity-note").textContent = `Identifiant ouvert \xB7 ${entry.label} \xB7 ${entry.name}${ordinary}`;
    q("#body").value = selection.state.body;
    syncBodyControls();
    q("#morph").value = morphForm;
    for (const key of ["accessories", "contrast"]) q("#" + key).checked = selection.raw[key] !== false;
    for (const key of axes11) {
      q("#morph-" + key).value = selection.state[key];
      q(`output[for="morph-${key}"]`).textContent = format10.format(selection.state[key]);
    }
    q("#adult-archive-note").hidden = !isAdultBody(selection.state.body);
    if (updateJSON) q("#selection-json").value = exportSelection(selection);
  }
  function refreshAvailability() {
    available = availableOptions(inputFor(), activeColour());
    for (const key of ["accessories", "contrast", "arrangement"]) {
      q("#" + key).disabled = !available[key];
      q("#" + key + "-note").hidden = available[key];
    }
    q("#morph-forehead_height").disabled = !available.forehead;
    q("#forehead-note").hidden = available.forehead;
    q("#flat-mode").disabled = !available.palette;
    q("#palette-note").hidden = available.palette;
    for (const tab of document.querySelectorAll("[data-category]")) tab.disabled = !available.palette;
    renderSwatches();
  }
  function refreshCharacter() {
    syncSelection();
    refreshAvailability();
    renderEyes();
    renderChart();
    renderPaletteStudies();
  }
  function setSelection(raw, form = morphForm, trigger = document.activeElement, {
    onApply,
    body = selection.state.body,
    structure = bodyPreferences.get(body)?.structure,
    corpulence = bodyPreferences.get(body)?.corpulence,
    chest = bodyPreferences.get(body)?.chest
  } = {}) {
    const next = restoreSelection2(raw, body, structure, corpulence, chest);
    const apply = () => {
      clearProposal();
      selection = next;
      rememberBody();
      morphForm = form;
      q("#selection-error").textContent = "";
      refreshCharacter();
      onApply?.();
    };
    const before = eyesFor(inputFor(), eyes).effective;
    const after = eyesFor(characterInput(next), eyes).effective;
    const changes = eyeChanges(before, after);
    if (!changes.length) {
      apply();
      return true;
    }
    syncSelection(false);
    showProposal(
      changes,
      apply,
      "Cette s\xE9lection change les valeurs effectives des yeux. Comparez les valeurs actuelles et propos\xE9es avant application.",
      trigger
    );
    return false;
  }
  function renderSwatches() {
    q("#swatches").innerHTML = palette.filter((p2) => p2.category === category).map((p2) => `<button type="button" data-colour="${p2.id}" ${available.palette === false ? "disabled" : ""} aria-pressed="${p2.id === colour}" style="--fill:${p2.fill};--stroke:${p2.stroke}"><span class="chip" aria-hidden="true"></span>${p2.name}</button>`).join("");
    for (const tab of document.querySelectorAll("[data-category]")) tab.setAttribute("aria-pressed", String(tab.dataset.category === category));
    const p = swatch(colour);
    q("#colour-info").textContent = `${p.name} \xB7 Aplat ${p.fill} \xB7 Contour ${p.stroke}`;
  }
  function chooseColour(id) {
    if (!available.palette) return;
    colour = id;
    category = swatch(id).category;
    q("#flat-mode").checked = true;
    refreshAvailability();
    browsEditor.refresh();
    renderComparison();
    renderChart();
    renderPaletteStudies();
  }
  function surface(view, settings, background = q("#background").value) {
    return `<div class="surface ${view} ${background}">${svg({ view, value: null, ...settings })}</div>`;
  }
  function renderPaletteStudies() {
    if (q("#series-panel").open) {
      q("#series-grid").innerHTML = palette.map((p) => {
        const settings = { hair: p.id };
        return `<article class="card"><h3>${p.name}</h3><p class="hint">${p.fill} \xB7 ${p.stroke}</p>${surface("tile", settings)}<div class="twins">${surface("mini", settings, "light")}${surface("mini", settings, "dark")}</div><button type="button" data-pick="${p.id}" ${available.palette ? "" : "disabled"}>Choisir ${p.name}</button></article>`;
      }).join("");
    }
    if (q("#variety-panel").open) {
      q("#variety-grid").innerHTML = variety.map((key) => {
        const entry = choice(key);
        return `<article class="card"><h3>${entry.label}</h3><p class="hint">${escape(entry.name)}</p>${surface("tile", { key })}${surface("mini", { key })}<button type="button" data-key="${key}">Inspecter ${entry.label}</button></article>`;
      }).join("");
    }
  }
  options("#eye-preset", [
    ["historical", otherLabels.historical],
    ...eyeEntries.map(([key, p]) => [key, p.label]),
    ...["minimum", "maximum", "custom"].map((key) => [key, otherLabels[key]])
  ]);
  q("#eye-preset option[value=custom]").disabled = true;
  options("#morph", [...Object.entries(morphs).map(([key, p]) => [key, p.name]), ["custom", "Combinaison libre"]]);
  q("#morph option[value=custom]").disabled = true;
  options("#ordinary", ordinaryChoices2.map((e) => [e.key, e.label + " \xB7 " + e.name]));
  options("#historical", choices2.map((e) => [e.key, e.label + " \xB7 " + e.name]));
  options("#body", Object.entries({ ...bodies, ...adultBodies }).map(([key, body]) => [key, body.name]));
  sliders("#eye-controls", Object.entries(eyeControls), "1", (key, index) => {
    const value = eyePoints[key]?.[index];
    if (value !== void 0) setEyes("custom", { ...editingValues, [key]: value });
  }, "eye");
  var morphControls = Object.entries(controls).map(([key, range]) => [
    key,
    key === "forehead_height" ? { ...range, label: "Implantation capillaire" } : range
  ]);
  sliders("#morph-controls", morphControls, ".01", (key, value) => {
    setSelection({ ...selection.raw, [key]: value }, "custom", q("#morph-" + key));
  }, "morph");
  q("#morph-forehead_height").setAttribute("aria-describedby", "forehead-note");
  sliders("#structure-controls", Object.entries(structureControls), "1", (key, value) => {
    const structure = { ...selection.state.structure ?? referenceStructure, [key]: value };
    setSelection(selection.raw, morphForm, q("#structure-" + key), { structure });
  }, "structure");
  q("#structure-reset").addEventListener("click", (event) => setSelection(selection.raw, morphForm, event.target, { structure: null }));
  q("#structure-study-scale").addEventListener("change", renderComparison);
  q("#corpulence-study-scale").addEventListener("change", renderComparison);
  options("#corpulence-study-structure", corpulenceStudyStructures);
  q("#corpulence-study-structure").addEventListener("change", renderComparison);
  for (const { label, value } of corpulenceStops) q("#corpulence-stops").append(new Option(label, value));
  q("#corpulence").addEventListener("input", (event) => setSelection(selection.raw, morphForm, event.target, { corpulence: event.target.valueAsNumber }));
  q("#corpulence-reset").addEventListener("click", (event) => setSelection(selection.raw, morphForm, event.target, { corpulence: null }));
  sliders("#chest-controls", Object.entries(chestControls), "any", (key, value) => setSelection(selection.raw, morphForm, q("#chest-" + key), { chest: { ...selection.state.chest ?? referenceChest, [key]: value } }), "chest");
  options("#chest-preset", [["custom", "Personnalis\xE9e"], ...chestPresets.map(([id, label]) => [id, label])]);
  q("#chest-preset").options[0].disabled = true;
  q("#chest-preset").addEventListener("change", (event) => {
    const preset = chestPresets.find(([id]) => id === event.target.value);
    if (!preset) {
      syncChestControls();
      return;
    }
    setSelection(selection.raw, morphForm, event.target, { chest: { ...preset[2], volume: selection.state.chest?.volume || 53 } });
  });
  q("#chest-reset").addEventListener("click", (event) => setSelection(selection.raw, morphForm, event.target, { chest: null }));
  options("#chest-study-skin", chestStudySkins);
  q("#chest-study-scale").addEventListener("change", renderComparison);
  q("#chest-study-skin").addEventListener("change", renderComparison);
  options("#eye-request-axis", Object.entries(eyeControls).map(([key, range]) => [key, range.label]));
  function syncRequest() {
    const key = q("#eye-request-axis").value;
    const { min, max, neutral: defaultValue } = eyeControls[key];
    const input = q("#eye-request-value");
    input.min = min;
    input.max = max;
    input.value = Math.round(editingValues?.[key] ?? defaultValue);
  }
  q("#eye-request-axis").addEventListener("change", syncRequest);
  q("#eye-request").addEventListener("submit", (event) => {
    event.preventDefault();
    const key = q("#eye-request-axis").value;
    requestEyes("custom", { ...editingValues, [key]: q("#eye-request-value").valueAsNumber }, event.submitter);
  });
  q("#eye-confirm").addEventListener("click", () => {
    const approval = pending;
    approval?.apply();
    approval?.trigger?.focus({ preventScroll: true });
  });
  q("#eye-cancel").addEventListener("click", () => {
    const trigger = pending?.trigger;
    clearProposal();
    if (trigger === q("#reload")) q("#selection-message").textContent = "Import annul\xE9.";
    trigger?.focus();
  });
  function chooseForm(form, trigger) {
    const value = form === "minimum" || form === "maximum" ? extrema2(form === "minimum" ? "min" : "max") : normalizeEyes(form);
    requestEyes(form, value, trigger);
  }
  q("#eye-preset").addEventListener("change", (event) => chooseForm(event.target.value, event.target));
  q("#shape-grid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-eye-form]");
    if (button) {
      q("#atelier").scrollIntoView();
      chooseForm(button.dataset.eyeForm, button);
    }
  });
  q("#reset-eyes").addEventListener("click", () => setEyes("historical", null));
  options("#draw-version", [[currentDraw, "Admissible \xB7 version actuelle"], [legacyDraw, "Historique \xB7 rejeu v1"]]);
  q("#random-eyes").addEventListener("click", () => {
    const seed = q("#seed").value, version = q("#draw-version").value;
    try {
      const result = drawEyes(inputFor(), seed, version);
      q("#draw-error").textContent = "";
      setEyes("custom", result.values, { seed, version });
    } catch (error) {
      q("#draw-error").textContent = error.message;
    }
  });
  q("#makeup-before-mode").addEventListener("change", renderComparison);
  q("#eye-guides").addEventListener("change", renderComparison);
  q("#background").addEventListener("change", () => {
    renderComparison();
    renderPaletteStudies();
  });
  q("#flat-mode").addEventListener("change", () => {
    refreshAvailability();
    browsEditor.refresh();
    renderComparison();
    renderChart();
    renderPaletteStudies();
  });
  function retainedArrangement(arrangement) {
    return arrangement === "U" ? selection.raw.arrangement === "D" ? "D" : "G" : arrangement;
  }
  function chooseOrdinary(event) {
    const entry = choice(q("#ordinary").value);
    const next = selectOrdinary2(entry.key, selection.raw);
    setSelection({ ...next.raw, arrangement: retainedArrangement(entry.arrangement) }, morphForm, event.currentTarget);
  }
  q("#ordinary").addEventListener("change", chooseOrdinary);
  q("#choose-ordinary").addEventListener("click", chooseOrdinary);
  function openKey(key, trigger) {
    const { style, arrangement } = choice(key);
    setSelection({ ...selection.raw, style, arrangement: retainedArrangement(arrangement) }, morphForm, trigger);
  }
  q("#load-history").addEventListener("click", (event) => openKey(q("#historical").value, event.currentTarget));
  q("#arrangement").addEventListener("change", (event) => openKey(selection.state.style + ":" + event.target.value, event.target));
  q("#body").addEventListener("change", (event) => {
    const body = event.target.value;
    const raw = isAdultBody(body) ? selection.raw : { ...selection.raw, body };
    setSelection(raw, morphForm, event.target, { body });
  });
  q("#morph").addEventListener("change", (event) => {
    const form = event.target.value;
    const raw = { ...selection.raw };
    for (const key of axes11) delete raw[key];
    setSelection({ ...raw, ...morphs[form].values }, form, event.target);
  });
  for (const flag of ["accessories", "contrast"]) {
    q("#" + flag).addEventListener("change", (event) => setSelection({ ...selection.raw, [flag]: event.target.checked }));
  }
  q("#palette-tabs").addEventListener("click", (event) => {
    const tab = event.target.closest("[data-category]");
    if (tab) {
      category = tab.dataset.category;
      renderSwatches();
    }
  });
  q("#swatches").addEventListener("click", (event) => {
    const button = event.target.closest("[data-colour]");
    if (button) chooseColour(button.dataset.colour);
  });
  q("#series-grid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-pick]");
    if (button) {
      chooseColour(button.dataset.pick);
      q("#atelier").scrollIntoView();
    }
  });
  q("#variety-grid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-key]");
    if (button) {
      openKey(button.dataset.key);
      q("#atelier").scrollIntoView();
    }
  });
  for (const panel of ["#series-panel", "#variety-panel"]) q(panel).addEventListener("toggle", renderPaletteStudies);
  q("#export").addEventListener("click", () => {
    q("#selection-json").value = exportSelection(selection);
    q("#selection-message").textContent = "S\xE9lection historique affich\xE9e.";
  });
  q("#reload").addEventListener("click", () => {
    try {
      const message = q("#selection-message");
      const applied = setSelection(JSON.parse(q("#selection-json").value), "custom", q("#reload"), {
        body: null,
        onApply: () => {
          message.textContent = "S\xE9lection historique relue.";
        }
      });
      if (!applied) message.textContent = "S\xE9lection en attente de confirmation.";
    } catch (error) {
      q("#selection-error").textContent = "S\xE9lection non charg\xE9e \xB7 " + error.message;
    }
  });
  q("#appearance-export").addEventListener("click", () => {
    const document2 = appearanceDocument(selection, { eyes, form: selectedForm, draw, colour, flat: q("#flat-mode").checked, ...irisEditor.archiveSettings(), ...detailsEditor.archiveSettings(), ...browsEditor.archiveSettings(), ...mouthEditor.archiveSettings(), ...noseEditor.archiveSettings(), ...beardEditor.archiveSettings(), ...marksEditor.archiveSettings(), ...scarsEditor.archiveSettings(), ...makeupEditor.archiveSettings() });
    q("#appearance-json").value = JSON.stringify(document2, null, 2);
    q("#appearance-error").textContent = "";
    q("#appearance-message").textContent = "Apparence compl\xE8te export\xE9e.";
  });
  q("#appearance-import").addEventListener("click", () => {
    try {
      const restored = parseAppearance(q("#appearance-json").value);
      clearProposal();
      irisEditor.restore(restored);
      detailsEditor.restore(restored);
      browsEditor.restore(restored);
      mouthEditor.restore(restored);
      noseEditor.restore(restored);
      beardEditor.restore(restored);
      marksEditor.restore(restored);
      scarsEditor.restore(restored);
      makeupEditor.restore(restored);
      ({ selection, eyes, form: selectedForm, draw, colour } = restored);
      rememberBody();
      q("#flat-mode").checked = restored.flat;
      q("#seed").value = draw?.seed ?? q("#seed").defaultValue;
      q("#draw-version").value = draw?.version ?? currentDraw;
      morphForm = "custom";
      category = swatch(colour).category;
      q("#appearance-error").textContent = "";
      q("#appearance-message").textContent = "Apparence compl\xE8te restaur\xE9e.";
      refreshCharacter();
    } catch (error) {
      q("#appearance-message").textContent = "";
      q("#appearance-error").textContent = "Apparence non charg\xE9e \xB7 " + error.message;
    }
  });
  var irisEditor = mountIrisEditor({ input: inputFor, eyes: () => eyes, render: renderComparison });
  var detailsEditor = mountDetailsEditor({ input: inputFor, eyes: () => eyes, render: () => {
    noseEditor.refresh();
    mouthEditor.refresh();
    renderComparison();
  } });
  var browsEditor = mountBrowsEditor({
    input: inputFor,
    eyes: () => eyes,
    colours: () => ({ hairColor: activeColour(), rememberedHairColor: colour }),
    render: renderComparison
  });
  var mouthEditor = mountMouthEditor({
    input: inputFor,
    eyes: () => eyes,
    noseBounds: () => noseEditor.bounds(),
    noseBoundsForDraw: () => noseEditor.boundsForCustomMouth(),
    refreshNose: () => noseEditor.refresh(),
    render: renderComparison
  });
  var noseEditor = mountNoseEditor({
    input: inputFor,
    eyes: () => eyes,
    details: () => detailsEditor.value(),
    mouth: () => mouthEditor.intent(),
    render: () => {
      mouthEditor.refresh();
      renderComparison();
    }
  });
  var beardEditor = mountBeardEditor({
    input: inputFor,
    eyes: () => eyes,
    context: () => ({
      details: detailsEditor.value(),
      nose: noseEditor.value(),
      mouth: mouthEditor.value(),
      hairColor: activeColour(),
      rememberedHairColor: colour
    }),
    render: renderComparison
  });
  var marksEditor = mountMarksEditor({
    input: inputFor,
    eyes: () => eyes,
    context: () => ({ details: detailsEditor.value(), nose: noseEditor.value(), mouth: mouthEditor.value() }),
    render: renderComparison
  });
  var scarsEditor = mountScarsEditor({
    input: inputFor,
    eyes: () => eyes,
    context: () => ({ details: detailsEditor.value(), nose: noseEditor.value(), mouth: mouthEditor.value() }),
    render: renderComparison
  });
  var makeupEditor = mountMakeupEditor({
    input: inputFor,
    eyes: () => eyes,
    context: () => ({ details: detailsEditor.value(), nose: noseEditor.value(), mouth: mouthEditor.value() }),
    render: renderComparison
  });
  mountMakeupStudy(naturalEyes);
  mountFreckleStudy(naturalEyes);
  mountScarStudy(naturalEyes);
  if (naturalEyes) mountEyeContourStudy();
  mountBodyStudy(q("#planche-corps"), renderComparison);
  mountStudyPanel(q("#planche-ossature"), renderComparison);
  mountStudyPanel(q("#planche-corpulence"), renderComparison);
  mountStudyPanel(q("#planche-poitrine"), renderComparison);
  refreshCharacter();
  q("#atelier").dataset.startup = "ready";
  q("#atelier-startup").hidden = true;
})();
