// Diagnostic de rendu, indépendant de l'atelier. Node + Playwright du dépôt.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {resolve, extname, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium, webkit} from 'playwright';

const root = resolve(fileURLToPath(new URL('../../../../', import.meta.url)));
const out = resolve(process.argv[2] ?? '/tmp/microcosme-bio-inv-01');
const engineName = process.env.AUDIT_ENGINE || 'chromium';
const engine = {chromium, webkit}[engineName];
assert(engine, 'AUDIT_ENGINE=chromium ou webkit');
await mkdir(out, {recursive: true});
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/__audit') return res.writeHead(200, {'Content-Type':'text/html'}).end('<!doctype html><title>Audit</title>');
    const file = resolve(root, '.' + decodeURIComponent(url.pathname) + (url.pathname.endsWith('/') ? 'index.html' : ''));
    if (!file.startsWith(root + sep)) throw new Error('Path outside checkout');
    const type = {'.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript', '.css': 'text/css'};
    res.writeHead(200, {'Content-Type': type[extname(file)] ?? 'application/octet-stream'}).end(await readFile(file));
  } catch {
    if (!res.headersSent) res.writeHead(404);
    res.end();
  }
});
await new Promise(ok => server.listen(0, '127.0.0.1', ok));
const base = 'http://127.0.0.1:' + server.address().port;
const browser = await engine.launch();
try {
  const page = await browser.newPage({viewport: {width: 1180, height: 850}, deviceScaleFactor: 1});
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base + '/bio-yeux-01/');
  await page.locator('#comparison svg').first().waitFor();
  const visibleDigest = () => page.locator('[data-side=after] .head svg').evaluate(async svg => {
    const normalized = svg.outerHTML.replace(/atelier-yeux-\d+/g, 'inv');
    const image = new Image(); image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(normalized);
    await image.decode();
    const c = document.createElement('canvas'); c.width = c.height = 300;
    const ctx = c.getContext('2d'); ctx.drawImage(image, 0, 0, 300, 300);
    return [...new Uint8Array(await crypto.subtle.digest('SHA-256', ctx.getImageData(0,0,300,300).data))]
      .map(x => x.toString(16).padStart(2, '0')).join('');
  });
  await page.locator('#historical').selectOption('p5-061:G');
  await page.locator('#load-history').click();
  await page.locator('#body').selectOption('bust');
  await page.locator('#morph').selectOption('tall');
  await page.locator('[data-category=fantasy]').click();
  await page.locator('[data-colour=bleu-vif]').click();
  await page.locator('#seed').fill('archive-bio-inv');
  await page.locator('#random-eyes').click();
  await page.locator('#json-panel summary').click();
  await page.locator('#export').click();
  const json = await page.locator('#selection-json').inputValue();
  const before = await visibleDigest();
  await page.locator('#reload').click();
  const memoryReload = await visibleDigest();
  assert.equal(memoryReload, before);
  await page.reload();
  await page.locator('#json-panel summary').click();
  await page.locator('#selection-json').fill(json);
  await page.locator('#reload').click();
  const coldReload = await visibleDigest();
  assert.notEqual(coldReload, before);
  assert.equal(await page.locator('#historical').inputValue(), 'p5-061:G');
  assert.deepEqual(errors, []);
  const persistenceUI = {json: JSON.parse(json), before, memoryReload, coldReload,
    formAfterReload: await page.locator('#eye-preset').inputValue(),
    paletteAfterReload: await page.locator('#flat-mode').isChecked(), errors};
  await page.close();
  const rasterPage = await browser.newPage({viewport: {width: 1180, height: 850}, deviceScaleFactor: 1});
  await rasterPage.goto(base + '/__audit');
  const data = await rasterPage.evaluate(async mode => {
    const {character} = await import('/bio-yeux-01/render.mjs');
    const {eyeControls, eyePresets, normalizeEyes} = await import('/bio-yeux-01/eyes.mjs');
    const {choices, groups, choice} = await import('/bio-col-01/catalogue.mjs');
    const {palette} = await import('/bio-col-01/palette.mjs');
    const {bodies, controls, presets} = await import('/preview/bio-vis-p5-i6/model.mjs');
    const {priorityCase} = await import('/preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs');
    const scales = {
      head: {size: 300, frame: '-30 -65 220 225', headOnly: true},
      body: {size: 178, frame: '-40 -85 240 355', headOnly: false},
      mini: {size: 70, frame: '-35 -68 230 245', headOnly: true, smallScale: true}
    };
    const defaultBG = '#fffdf8';
    const mkInput = key => {
      const {style, arrangement} = choice(key);
      return {style, arrangement: arrangement === 'U' ? 'G' : arrangement};
    };
    const canvases = Object.fromEntries(Object.entries(scales).map(([scale, {size}]) => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      return [scale, canvas];
    }));
    function drawText(input, options, scale) {
      const {headOnly, smallScale, size, frame} = scales[scale];
      return character(input, {headOnly, smallScale, instance: 'inv-audit', ...options})
        .replace(/viewBox="[^"]*"/, 'viewBox="' + frame + '" width="' + size + '" height="' + size + '"');
    }
    async function pixels(input, options, scale, background = defaultBG) {
      const canvas = canvases[scale], ctx = canvas.getContext('2d', {willReadFrequently: true});
      const image = new Image();
      image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(drawText(input, options, scale));
      await image.decode();
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      return ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    }
    async function digest(array) {
      return [...new Uint8Array(await crypto.subtle.digest('SHA-256', array))].map(x => x.toString(16).padStart(2, '0')).join('');
    }
    const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
    const paddedROI = (scale, xMin, yMin, xMax, yMax) => {
      const {size, frame} = scales[scale], [x, y, w, h] = frame.split(' ').map(Number);
      const factor = Math.min(size / w, size / h);
      const dx = (size - w * factor) / 2, dy = (size - h * factor) / 2;
      return [Math.floor(dx + (xMin - x) * factor), Math.floor(dy + (yMin - y) * factor),
        Math.ceil(dx + (xMax - x) * factor), Math.ceil(dy + (yMax - y) * factor)];
    };
    // Inspect changes in sRGB, using a separate exact RGBA hash for equality.
    function distance(a, b, scale, background = defaultBG, roi) {
      const size = scales[scale].size;
      const [left, top, right, bottom] = roi ?? [0, 0, size, size];
      const [r, g, blue] = rgb(background);
      let changed = 0, foreground = 0, absolute = 0;
      for (let y = top; y < bottom; y++) for (let x = left; x < right; x++) {
        const i = 4 * (y * size + x);
        const diff = Math.max(Math.abs(a[i] - b[i]), Math.abs(a[i + 1] - b[i + 1]), Math.abs(a[i + 2] - b[i + 2]));
        const visible = Math.max(Math.abs(a[i] - r), Math.abs(a[i + 1] - g), Math.abs(a[i + 2] - blue),
          Math.abs(b[i] - r), Math.abs(b[i + 1] - g), Math.abs(b[i + 2] - blue)) >= 16;
        if (visible || roi) foreground++;
        if (diff >= 16) changed++;
        absolute += diff;
      }
      return {changed, foreground, fraction: +(changed / Math.max(1, foreground)).toFixed(6), absolute};
    }
    async function bank(items, scalesToRun = Object.keys(scales)) {
      const result = {};
      for (const scale of scalesToRun) {
        result[scale] = [];
        for (const {id, input, options, background} of items) {
          const data = await pixels(input, options, scale, background);
          result[scale].push({id, data, hash: await digest(data)});
        }
      }
      return result;
    }
    function pairs(input, {all = false, bg = defaultBG, eyeROI = false, selected = []} = {}) {
      const result = {};
      for (const [scale, items] of Object.entries(input)) {
        const exact = [], best = [];
        const roi = eyeROI ? paddedROI(scale, 57, 58, 103, 82) : undefined;
        for (let i = 0; i < items.length - 1; i++) {
          for (let j = i + 1; j < items.length; j++) {
            const a = items[i], b = items[j], equality = a.hash === b.hash;
            if (equality) exact.push([a.id, b.id]);
            if (!all && !selected.some(pair => pair.includes(a.id) && pair.includes(b.id))) continue;
            best.push({a: a.id, b: b.id, exact: equality, ...distance(a.data, b.data, scale, bg, roi)});
          }
        }
        best.sort((a, b) => a.fraction - b.fraction || a.absolute - b.absolute);
        result[scale] = {count: items.length, unique: new Set(items.map(x => x.hash)).size,
          exact, near: best.filter(x => !x.exact && x.fraction <= .01).length,
          nearest: all ? best.filter(pair => !pair.exact).slice(0, 15) : best};
      }
      return result;
    }
    const history = choices.map(e => ({id: e.key, input: mkInput(e.key)}));
    const allHair = mode === 'chromium' ? history : history.filter(e => [
      'p5-056:G', 'p5-061:G', 'p5-019:G', 'p5-021:G', 'p5-028:G', 'p5-059:G', 'p5-064:G', 'p5-070:G',
      'p5-047:G', 'p5-050:G', 'p5-049:G', 'p5-062:D', 'p5-054:G', 'p5-069:G'].includes(e.id));
    const known = groups.map(group => [group.primary, group.secondary]);
    known.push(['p5-054:G', 'p5-069:G']);
    const hairBank = await bank(allHair);
    const hair = pairs(hairBank, {all: mode === 'chromium', selected: known});
    const pairOnly = Object.fromEntries(Object.entries(hairBank).map(([scale, items]) => [
      scale, known.map(([a, b]) => {
        const x = items.find(item => item.id === a), y = items.find(item => item.id === b);
        return {a, b, exact: x.hash === y.hash, ...distance(x.data, y.data, scale)};
      })
    ]));
    const baseInput = {style: 'shaved'};
    const body = pairs(await bank(Object.keys(bodies).map(id => ({id, input: {...baseInput, body: id}}))), {all: true});
    const morphInputs = {
      neutral: {}, tall: presets.tall.values, broad: presets.broad.values, ipad: priorityCase,
      min: Object.fromEntries(Object.entries(controls).map(([key, v]) => [key, v.min])),
      max: Object.fromEntries(Object.entries(controls).map(([key, v]) => [key, v.max]))
    };
    const face = pairs(await bank(Object.entries(morphInputs).map(([id, input]) => ({id, input: {...input, ...baseInput}}))), {all: true});
    const eyes = pairs(await bank(['historical', ...Object.keys(eyePresets)].map(id => ({
      id, input: baseInput, options: {eyes: id}
    }))), {all: true, eyeROI: true});
    const paletteCases = mode === 'chromium' ? ['shaved:U', 'p5-063:G', 'p5-050:G', 'p5-038:G'] : ['p5-038:G'];
    const palettes = {};
    for (const key of paletteCases) {
      palettes[key] = {};
      for (const background of [defaultBG, '#474c55']) {
        const items = [{id: 'historical', input: mkInput(key), background}, ...palette.map(p =>
          ({id: p.id, input: mkInput(key), options: {hairColor: p.id}, background}))];
        palettes[key][background] = pairs(await bank(items), {all: true, bg: background});
      }
    }
    const flags = {};
    for (const [key, names] of [
      ['p5-038:G', ['contrast','accessories']], ['p5-050:G', ['contrast']], ['p5-050:D', ['contrast']],
      ['p5-062:D', ['contrast']], ['p5-063:G', ['accessories']], ['shaved:U',['contrast','accessories']]
    ]) {
      flags[key] = {};
      for (const flag of names) {
        const input = mkInput(key);
        const samples = await bank([true,false].map(value => ({id:value, input:{...input,[flag]:value}})));
        flags[key][flag] = Object.fromEntries(Object.entries(samples).map(([scale, [a,b]]) => [
          scale, {exact:a.hash===b.hash, ...distance(a.data,b.data,scale)}
        ]));
      }
    }
    async function sweep({ranges, mode, style, values, step}) {
      const result = {};
      for (const [key, {min, max}] of Object.entries(ranges)) {
        const inputs = Array.from({length: Math.round((max - min) / step) + 1}, (_, i) => +(min + i * step).toFixed(4));
        const items = inputs.map(value => mode === 'face' ?
          {id: value, input: {style, ...values, [key]: value}} :
          {id: value, input: {style}, options: {eyes: {...values, [key]: value}}});
        const all = await bank(items);
        result[key] = Object.fromEntries(Object.entries(all).map(([scale, samples]) => {
          const roi = mode === 'eye' ? paddedROI(scale, 57, 58, 103, 82) : undefined;
          const differences = samples.slice(1).map((current, i) => {
            const before = samples[i];
            const delta = distance(before.data, current.data, scale, defaultBG, roi);
            return [before.id, current.id, before.hash === current.hash, delta.changed];
          });
          return [scale, {
            samples: samples.length, unique: new Set(samples.map(sample => sample.hash)).size,
            exactSteps: differences.filter(x => x[2]).length,
            zeroThresholdSteps: differences.filter(x => x[3] === 0).length,
            minimum: differences.slice().sort((a, b) => a[3] - b[3]).slice(0, 3),
            extremes: distance(samples[0].data, samples.at(-1).data, scale, defaultBG, roi)
          }];
        }));
      }
      return result;
    }
    const faceSweep = {}, eyeSweep = {};
    if (mode === 'chromium') {
      for (const style of ['shaved','classic','p5-063','p5-071']) {
        faceSweep[style] = await sweep({ranges: controls, mode: 'face', style, values: {}, step: .01});
      }
      const neutral = normalizeEyes({});
      for (const [id, values] of Object.entries({admissible: {...neutral, width: 80, height: 52}, standard: neutral})) {
        eyeSweep[id] = await sweep({ranges: eyeControls, mode: 'eye', style: 'shaved', values, step: 1});
      }
    }

    const examples = [
      ['56-G / 61-G', mkInput('p5-056:G'), {}, mkInput('p5-061:G'), {}],
      ['54-G / 69-G', mkInput('p5-054:G'), {}, mkInput('p5-069:G'), {}],
      ['Noir ébène / Brun sombre', mkInput('p5-038:G'), {hairColor:'noir-ebene'}, mkInput('p5-038:G'), {hairColor:'brun-sombre'}],
      ['Sommet supérieur · 0 % / 1 %', baseInput, {eyes:{...normalizeEyes({}),width:80,height:52}},
        baseInput, {eyes:{...normalizeEyes({}),width:80,height:52,upperPeak:1}}]
    ];
    const nodes = ['Tête · 300 px','Corps · 178 px','Miniature · 70 × 70 px'].map(label => '<h2>' + label + '</h2>');
    for (const [title, a, oa, b, ob] of examples) {
      nodes.push('<h3>' + title + '</h3>');
      for (const scale of Object.keys(scales)) nodes.push('<div class="pair ' + scale + '">' + drawText(a, oa, scale) + drawText(b, ob, scale) + '</div>');
    }
    if (mode === 'webkit') document.body.innerHTML = '<style>body{margin:12px;background:#fffdf8;color:#373023;font:14px system-ui}h1{margin:4px 0}h2,h3{margin:4px;font-size:14px;align-self:center}section{display:grid;grid-template-columns:602px 358px 148px;gap:4px 11px}.pair{display:flex;gap:1px;border:1px solid #ded4c0;justify-content:center;align-self:start}h3{grid-column:1/-1;padding:4px;background:#f0eadb}</style><h1>BIO-INV-01 · comparaisons aux échelles historiques</h1><section>' + nodes.join('') + '</section>';
    return {hair, pairOnly, body, face, eyes, palettes, flags, faceSweep, eyeSweep};
  }, engineName);
  if (engineName === 'webkit') await rasterPage.screenshot({path: resolve(out, 'webkit-comparaisons.png'), fullPage: true});
  await writeFile(resolve(out, engineName + '-rendus.json'), JSON.stringify({
    engine: engineName, version: browser.version(), ...data, persistenceUI
  }, null, 2) + '\n');
} finally {
  await browser.close();
  server.close();
}
