/* Original scanline pixel art: no remote image, no clothing or explicit anatomy. */
(function (root) {
  'use strict';
  const M = typeof module !== 'undefined' ? require('./model.js') : root.BioMorphB2;
  function render(canvas, body, mode = 'front', options = {}) {
    const portrait = mode === 'portrait', back = mode === 'back', profile = mode === 'profile';
    canvas.width = portrait ? 128 : 80; canvas.height = portrait ? 144 : 128;
    const c = canvas.getContext('2d'); c.imageSmoothingEnabled = false;
    const {geometry: g, palette: k, description: {params: p}, hair, zones, marks} = body;
    const rect = (x, y, w, h, color) => { c.fillStyle = color; c.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h))); };
    const oval = (x, y, rx, ry, color) => {
      for (let j = -Math.floor(ry); j <= Math.floor(ry); j++) {
        const half = rx * Math.sqrt(Math.max(0, 1 - j * j / (ry * ry)));
        if (half > .1) rect(x - half, y + j, half * 2, 1, color);
      }
    };
    function segment(a, b, r1, r2, color, roundness = .5) {
      const steps = Math.max(1, Math.ceil(b[1] - a[1]));
      for (let i = 0; i <= steps; i++) {
        const t = i / steps, x = a[0] + (b[0] - a[0]) * t;
        const radius = (r1 + (r2 - r1) * t) * (1 - .12 * roundness * Math.cos(t * Math.PI * 2));
        rect(x - radius, a[1] + i, radius * 2, 1, color);
      }
      oval(a[0], a[1], r1, r1 * .6, color); oval(b[0], b[1], r2, r2 * .6, color);
    }
    function fur(cx, y, rx, ry, density, scale = 1, count = 35) {
      if (density <= 0) return;
      const composite = c.globalCompositeOperation; c.globalCompositeOperation = 'source-atop';
      for (let i = 0; i < count; i++) {
        const [u, v] = marks[i];
        if (marks[(i + 63) % marks.length][0] > density) continue;
        const x = (u * 2 - 1), z = (v * 2 - 1);
        if (x * x + z * z > 1) continue;
        rect(cx + x * rx, y + z * ry, Math.max(1, scale * .3), scale * hair.visibleLength * (1 + p.texture), k.hair);
      }
      c.globalCompositeOperation = composite;
    }
    function rearHair(cx, top, s) {
      if (p.density <= .04 || options.anatomyOnly) return;
      const hw = g.headW * s, hh = g.headH * s;
      segment([cx, top + hh * .25], [cx + hair.direction * hw * .06, top + hh * (1 + hair.nape * .82)], hw * .47, hw * (.23 + .22 * p.density), k.hair, .8);
    }
    function head(cx, top, s) {
      const hw = g.headW * s, hh = g.headH * s, bottom = top + hh;
      const left = cx - hw / 2, right = cx + hw / 2;
      const sideLength = hh * hair.sides * .85, napeLength = hh * hair.nape * .82;
      const volume = hh * hair.volume * .36;
      rect(cx - hw * .18, bottom - 3 * s, hw * .36, 7 * s, k.shade);
      // Skull and jaw share one uninterrupted contour; no head-shape categories.
      for (let j = 0; j <= Math.ceil(hh); j++) {
        const t = j / hh;
        const upper = .5 * hw * M.contour(Math.min(1, t / .85), p.skullShape);
        let half = Math.max(s, upper);
        if (t > .48) {
          const q = Math.min(1, (t - .48) / .52);
          const chin = g.jaw * s * .35;
          half = (hw * .49 * (1 - q) + chin * q) * (1 - .14 * p.skullShape * Math.sin(q * Math.PI));
        }
        if (profile) {
          const rear = cx - half * .6, front = cx + half * .55;
          rect(rear, top + j, front - rear, 1, k.skin);
          if (t > .42 && t < .64) rect(front - 1, top + j, s * (1 + 2.4 * p.nose) * Math.sin((t - .42) / .22 * Math.PI), 1, k.skin);
        } else rect(cx - half, top + j, half * 2, 1, k.skin);
      }
      oval(profile ? cx - hw * .15 : left, top + hh * .51, s * 1.1, s * 1.8, k.shade);
      if (!profile) oval(right, top + hh * .51, s, s * 1.7, k.skin);
      if (!back) {
        c.globalCompositeOperation = 'source-atop';
        const ey = top + hh * .45, spacing = hw * .22 * p.eyeSpacing;
        for (const side of profile ? [1] : [-1, 1]) {
          const ex = profile ? cx + hw * .20 : cx + side * spacing, offset = side * p.asymmetry * s * .25;
          rect(ex - 1.4 * s, ey + offset, 2.8 * s, (.65 + p.eyeShape) * s, k.light);
          rect(ex - .2 * s, ey + offset, s, (1 + .5 * p.eyeShape) * s, k.iris);
          rect(ex - 1.5 * s, ey - 1.2 * s + offset, 3 * s, .5 * s, k.hair);
        }
        if (!profile) { rect(cx, ey + s, (.6 + p.nose) * s, 2.3 * s, k.shade); rect(cx - .5 * s, ey + s, .5 * s, s, k.skin); }
        const mouthX = profile ? cx + hw * .10 : cx;
        rect(mouthX - (1 + p.mouth) * s, top + hh * .77, (2 + 2 * p.mouth) * s, (.45 + .5 * p.mouth) * s, k.shade);
        if (!options.anatomyOnly) {
          fur(cx, top + hh * .86, hw * .30, hh * .14, zones.face, s, 50);
          fur(mouthX, top + hh * .71, hw * .20, s * .7, zones.face, s, 15);
          fur(profile ? cx - hw * .2 : left + s, top + hh * .6, s * .7, hh * .13, zones.face, s, 15);
        }
      }
      c.globalCompositeOperation = 'source-over';
      if (p.density <= .04 || options.anatomyOnly) return;
      const lineY = top + hh * (.13 + .12 * p.hairline), fringe = hh * hair.top * .20;
      // Scalp cap: density affects coverage, length affects volume, curl affects edge.
      for (let j = -Math.ceil(volume); j <= Math.ceil(lineY - top); j++) {
        const q = (j + volume) / (lineY - top + volume + 1);
        const half = hw * (.13 + .39 * Math.sin(Math.min(1, q * 1.7) * Math.PI / 2));
        rect(cx - half, top + j, half * 2, 1, k.hair);
      }
      // Roots lean from the part, ends turn downward: no rigid horizontal spikes.
      const count = 11, start = cx + hair.direction * hw * .28;
      for (let i = 0; i < count; i++) {
        const u = i / (count - 1), x = left + hw * (.04 + .92 * u);
        const curl = Math.sin(i * 2.3) * p.texture * s;
        const y = lineY + fringe * (.25 + .75 * Math.abs(u - .5) * 2) + curl;
        segment([start + (x - start) * .4, top + s], [x + hair.direction * s, y], s * (.55 + p.density * .35), s * .5, k.hair, p.texture);
        if (portrait) segment([start + (x - start) * .4, top + s], [x, y - s], .35, .35, p.hairColor > .5 ? '#675047' : '#b89b67');
      }
      for (const side of profile ? [-1] : [-1, 1]) {
        const x = cx + side * hw * .45, end = top + hh * .48 + sideLength;
        segment([x, lineY - s], [x + side * hw * .06 + hair.direction * s, end], s * (1 + p.density), s * (.6 + p.texture), k.hair, p.texture);
        if (p.texture > .45) for (let i = 0; i < 7; i++) {
          const yy = lineY + (end - lineY) * i / 7;
          oval(x + Math.sin(i * 2) * s, yy, s * (1 + p.texture), s * 1.3, k.hair);
        }
      }
      if (back) {
        segment([cx, top + hh * .3], [cx, bottom + napeLength], hw * .45, hw * .37, k.hair, p.texture);
        for (let i = 0; i < 6; i++) segment([left + hw * (.15 + .13 * i), top + hh * .35], [left + hw * (.15 + .13 * i) + hair.direction * s, bottom + napeLength - s], .35, .35, p.hairColor > .5 ? '#675047' : '#b89b67');
      }
    }
    if (portrait) {
      // Bare shoulders and a modest upper-bust crop, with no intimate details.
      rearHair(64, 18, 3.3);
      const shoulderStart = Math.floor(18 + g.headH * 3.3 + 8);
      for (let y = shoulderStart; y < 144; y++) {
        const half = Math.min(64, (y - shoulderStart) * 1.5 + g.shoulders * .7);
        rect(64 - half, y, half * 2, 1, k.skin);
      }
      head(64, 18, 3.3);
    } else {
      const cx = 40, bottom = 119, top = bottom - g.height, neck = top + g.headH;
      rearHair(cx, top, 1);
      const shoulderY = neck + 4, pelvisY = neck + g.trunk;
      const shoulders = g.shoulders * (profile ? .52 : 1), hips = g.hips * (profile ? .65 : 1), waist = g.waist * (profile ? .7 : 1);
      // Limbs overlap torso/pelvis at shared anchors, using tapered capsules.
      for (const side of profile ? [1] : [-1, 1]) {
        const hipX = cx + side * hips * .24, kneeX = hipX + side * 1.2;
        const kneeY = pelvisY + g.legs * .52, ankleX = hipX + side * 1.8;
        segment([hipX, pelvisY - 3], [kneeX, kneeY], g.legWidth * .57, g.legWidth * .36, k.skin, g.limbRoundness);
        segment([kneeX, kneeY], [ankleX, bottom - 3], g.legWidth * .42, g.legWidth * .28, k.skin, g.limbRoundness);
        oval(ankleX + (profile ? 2 : side * .8), bottom - 1, g.foot * .58, 2.2, k.skin);
        rect(ankleX - 1, bottom, g.foot * .6, 1, k.shade);
      }
      for (let y = Math.floor(neck); y <= Math.ceil(pelvisY + 4); y++) {
        const t = (y - neck) / (pelvisY + 4 - neck);
        let width;
        if (t < .18) width = shoulders * (.63 + .37 * t / .18);
        else if (t < .63) width = shoulders + (waist - shoulders) * ((t - .18) / .45);
        else width = waist + (hips - waist) * ((t - .63) / .37);
        width *= 1 + .09 * p.torsoShape * Math.sin(t * Math.PI * 2);
        if (t > .75) width *= 1 - p.pelvisShape * .22 * Math.pow((t - .75) / .25, 2);
        if (!profile && !back) width += g.chestDepth * .45 * Math.exp(-Math.pow((t - .33) * 8, 2));
        const shift = profile ? g.chestDepth * Math.exp(-Math.pow((t - .33) * 8, 2)) : 0;
        rect(cx - width / 2, y, width + shift, 1, k.skin);
        rect(cx - width / 2, y, 1, 1, k.shade);
      }
      if (!back && p.chest > .05) {
        if (profile) oval(cx + shoulders * .36 + g.chestDepth * .5, shoulderY + g.trunk * .27, 1 + g.chestDepth * .65, 2 + p.chest * 3, k.skin);
        else for (const side of [-1, 1]) {
          const x = cx + side * shoulders * .22, yy = shoulderY + g.trunk * .27;
          // A lower volume contour only: no nipples or explicit detail.
          const rx = 1.5 + g.chestDepth * .55, ry = .8 + g.chestDepth * (.48 - .15 * p.muscle);
          oval(x, yy, rx, ry, k.shade);
          oval(x, yy - 1, rx, Math.max(.8, ry - .4), k.skin);
        }
      }
      for (const side of profile ? [1] : [-1, 1]) {
        const x = cx + side * shoulders * .47, y = shoulderY + side * p.asymmetry * .5;
        const elbow = [x + side * 3, y + g.armLength * .48], wrist = [x + side * 4, y + g.armLength];
        segment([x, y], elbow, g.armWidth * .6, g.armWidth * .4, k.skin, g.limbRoundness);
        segment(elbow, wrist, g.armWidth * .43, g.armWidth * .28, k.skin, g.limbRoundness);
        oval(wrist[0], wrist[1] + 1.7, g.hand * .55, g.hand * .8, k.skin);
        rect(wrist[0] + side, wrist[1] + 1, 1, g.hand, k.shade);
      }
      if (!options.anatomyOnly) {
        if (!back) {
          fur(cx, shoulderY + g.trunk * .30, shoulders * .27, g.trunk * .14, zones.torso);
          fur(cx, neck + g.trunk * .72, waist * .22, g.trunk * .16, zones.abdomen);
          fur(cx, pelvisY, hips * .18, 2, zones.pubic, .7, 22);
        } else fur(cx, neck + g.trunk * .4, shoulders * .25, g.trunk * .23, zones.torso * .3);
        for (const side of profile ? [1] : [-1, 1]) {
          fur(cx + side * shoulders * .52, shoulderY + g.armLength * .65, g.armWidth * .3, g.armLength * .20, zones.arms);
          fur(cx + side * shoulders * .39, shoulderY + 4, 1.1, 1.9, zones.axilla, .7, 14);
          fur(cx + side * hips * .24, pelvisY + g.legs * .60, g.legWidth * .25, g.legs * .27, zones.legs);
        }
      }
      head(cx, top, 1);
    }
    if (!options.transparent) {
      c.globalCompositeOperation = 'destination-over';
      rect(0, 0, canvas.width, canvas.height, '#eae6da');
      c.globalCompositeOperation = 'source-over';
    }
    return canvas;
  }
  const api = {render};
  if (typeof module !== 'undefined') module.exports = api;
  root.BioRenderB2 = api;
})(globalThis);
