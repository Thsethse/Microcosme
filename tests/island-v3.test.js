const { test } = require("node:test"),
  assert = require("node:assert/strict");
const C = require("../island-camera"),
  A = require("../island-art"),
  I = require("../island-world");
test("V3 continuous pan and anchored pinch, repeated zoom and bounds", () => {
  const r = I.regions[4];
  let c = C.center(r, 48, 36);
  const p = C.pan(r, c, 0.001, 0.002);
  assert.ok(p.x !== Math.round(p.x));
  assert.equal(p.x, c.x - 0.001 * 16);
  const mid = { x: 0.3, y: 0.4 },
    anchor = { x: c.x + mid.x * c.width, y: c.y + mid.y * c.height };
  const z = C.pinch(r, c, anchor, mid, 1.5);
  assert.ok(Math.abs(z.x + mid.x * z.width - anchor.x) < 1e-9);
  assert.ok(Math.abs(z.y + mid.y * z.height - anchor.y) < 1e-9);
  for (let j = 0; j < 100; j++) {
    c = C.pinch(
      r,
      c,
      { x: c.x + c.width / 2, y: c.y + c.height / 2 },
      { x: 0.5, y: 0.5 },
      j % 2 ? 0.8 : 1.25,
    );
    assert.ok(c.zoom >= 0.75 && c.zoom <= 3);
    assert.ok(c.x >= r.x && c.x + c.width <= r.x + r.width + 1e-9);
  }
  for (const factor of [0, 100]) {
    const a = C.pinch(r, c, anchor, { x: 0, y: 1 }, factor);
    assert.ok(
      a.x >= r.x &&
        a.y >= r.y &&
        a.x + a.width <= r.x + r.width + 1e-9 &&
        a.y + a.height <= r.y + r.height + 1e-9,
    );
  }
});
test("V3 14 original biome resources are deterministic and visually distinct", () => {
  const signatures = new Set();
  for (const b of I.biomes) {
    assert.ok(A.biomes[b.id]);
    const commands = [];
    const ctx = {
      fillStyle: "",
      fillRect(...args) {
        commands.push([this.fillStyle, ...args]);
      },
    };
    A.tile(ctx, b.id, 15, 22);
    const before = JSON.stringify(commands);
    commands.length = 0;
    A.tile(ctx, b.id, 15, 22);
    assert.equal(JSON.stringify(commands), before);
    signatures.add(before);
    commands.length = 0;
    A.tile(ctx, b.id, 16, 22);
    assert.notEqual(JSON.stringify(commands), before);
  }
  assert.equal(signatures.size, 14);
});
