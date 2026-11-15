const { test } = require("node:test");
const assert = require("node:assert/strict");
const I = require("../island-world");
test("identity, reachability, autonomous interior visits and population stay stable for 3000 ticks", () => {
  const w = I.create(),
    person = w.state.people[0],
    visited = new Set();
  for (let t = 0; t < 3000; t++) {
    const old = { ...person.pos };
    w.step();
    visited.add(person.pos.space);
    visited.add(I.regionAt(person.pos));
    assert.equal(w.state.people.length, 1);
    assert.equal(new Set(w.state.people.map((p) => p.id)).size, 1);
    assert.equal(w.state.people[0], person);
    assert.equal(person.id, 1);
    assert.ok(I.passable(person.pos));
    if (old.space === person.pos.space)
      assert.ok(
        Math.abs(old.x - person.pos.x) + Math.abs(old.y - person.pos.y) <= 1,
      );
    else {
      assert.deepEqual(
        old,
        old.space === "surface" ? I.cave.outside : I.cave.inside,
      );
      assert.deepEqual(
        person.pos,
        old.space === "surface" ? I.cave.inside : I.cave.outside,
      );
    }
  }
  assert.ok(visited.has("cave"));
  assert.ok(visited.has(3));
  assert.ok(visited.has(5));
});
test("global and local projections invert to exactly the same world cell", () => {
  for (let y = 0; y < I.H; y++)
    for (let x = 0; x < I.W; x++) {
      const p = { x, y, space: "surface" },
        g = I.project(p, { kind: "global" }),
        region = I.regionAt(p),
        l = I.project(p, { kind: "local", region }),
        b = I.regions[region];
      assert.equal(g.x * I.W - 0.5, x);
      assert.equal(g.y * I.H - 0.5, y);
      assert.equal(l.x * b.width + b.x - 0.5, x);
      assert.equal(l.y * b.height + b.y - 0.5, y);
      assert.equal(I.project(p, { kind: "interior" }), null);
    }
});
test("navigation global → local → interior → exterior → global never changes the world", () => {
  const w = I.create(),
    v = I.createView(w),
    initial = JSON.stringify(w.state),
    region = I.regionAt(I.cave.outside);
  assert.equal(v.enter(), false);
  assert.equal(v.local(-1), false);
  v.local(4);
  assert.equal(v.enter(), false);
  v.local(region);
  const exterior = I.project(I.cave.outside, v.scene);
  assert.ok(exterior);
  assert.equal(v.enter(), true);
  assert.equal(v.scene.kind, "interior");
  assert.ok(I.project(I.cave.inside, v.scene));
  assert.equal(v.exit(), true);
  assert.equal(v.scene.region, region);
  assert.deepEqual(I.project(I.cave.outside, v.scene), exterior);
  v.global();
  assert.equal(v.scene.kind, "global");
  assert.equal(JSON.stringify(w.state), initial);
});
test("activity offscreen matches a world observed locally at every tick", () => {
  const a = I.create(),
    b = I.create(),
    va = I.createView(a),
    vb = I.createView(b);
  va.local(0);
  vb.follow(1);
  for (let i = 0; i < 500; i++) {
    a.step();
    b.step();
    vb.sync();
    assert.deepEqual(a.state, b.state);
  }
  assert.equal(va.scene.region, 0);
  assert.equal(a.state.tick, 500);
});
test("follow crosses region and interior boundaries with the original identity and releases on manual navigation", () => {
  const w = I.create(),
    v = I.createView(w);
  assert.equal(v.select(99), false);
  assert.equal(v.follow(99), false);
  v.select(1);
  v.follow(1);
  let interior = false,
    returned = false;
  for (let i = 0; i < 600; i++) {
    w.step();
    v.sync();
    assert.equal(v.selected, w.state.people[0]);
    assert.ok(I.project(v.selected.pos, v.scene));
    if (v.scene.kind === "interior") interior = true;
    else if (interior) returned = true;
  }
  assert.ok(interior && returned);
  v.global();
  assert.equal(v.followed, null);
  assert.equal(v.scene.kind, "global");
});

test("V2: all 14 biomes occupy cells and geography contains every placed category", () => {
  const kinds = new Set();
  for (let y = 0; y < I.H; y++)
    for (let x = 0; x < I.W; x++) kinds.add(I.terrain(x, y));
  assert.equal(I.biomes.length, 14);
  for (const b of I.biomes) assert.ok(kinds.has(b.id), b.name);
  assert.equal(I.features.length, 41);
  for (const [category, names] of Object.entries(I.featureGroups))
    for (const name of names) {
      const f = I.features.find(
        (f) => f.name === name && f.category === category,
      );
      assert.ok(f, name);
      assert.ok(f.x >= 0 && f.x < I.W && f.y >= 0 && f.y < I.H);
    }
  assert.equal(I.interiors[0], I.cave);
});
test("V2: enlarged regions, fixed viewport scale, clamped camera and world projection", () => {
  for (const r of I.regions) {
    assert.equal(r.width, 32);
    assert.equal(r.height, 24);
    for (const [x, y] of [
      [-100, -100],
      [999, 999],
      [r.x + 12, r.y + 8],
    ]) {
      const c = I.cameraFor(r.id, x, y);
      assert.equal(c.width, 16);
      assert.equal(c.height, 12);
      assert.ok(c.x >= r.x && c.x + 16 <= r.x + 32);
      assert.ok(c.y >= r.y && c.y + 12 <= r.y + 24);
      const p = { space: "surface", x: c.x + 5, y: c.y + 5 },
        projection = I.project(p, { kind: "local", region: r.id, camera: c });
      assert.equal(projection.x * 16 + c.x - 0.5, p.x);
      assert.equal(projection.y * 12 + c.y - 0.5, p.y);
    }
  }
});
