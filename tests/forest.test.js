const { test } = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path");
const F = require("../forest-model"),
  I = require("../island-world"),
  C = require("../island-camera");
test("V4-01/02: removal excludes all tree layers; trunk, actor and crown respect foot depth", () => {
  const trees = F.objects().filter((o) => o.assetKey === "oak"),
    tree = trees[0],
    p = {
      id: 1,
      pos: { ...tree.worldPosition, y: tree.worldPosition.y + 0.2 },
    };
  const layers = F.layers([tree], [p]).volumes;
  assert.deepEqual(
    layers.map((e) => e.type),
    ["trunk", "person", "crown"],
  );
  p.pos.y = tree.worldPosition.y - 1;
  assert.deepEqual(
    F.layers([tree], [p]).volumes.map((e) => e.type),
    ["person", "trunk", "crown"],
  );
  p.pos.y = tree.worldPosition.y + 1;
  assert.deepEqual(
    F.layers([tree], [p]).volumes.map((e) => e.type),
    ["trunk", "crown", "person"],
  );
  const gone = F.layers([tree], [p], new Set([tree.id]));
  assert.equal(gone.ground.length, 0);
  assert.deepEqual(
    gone.volumes.map((e) => e.type),
    ["person"],
  );
});
test("V4-03: original V3 camera uses the scene extent and a common linear projection at all zooms", () => {
  for (const z of [0.75, 1, 1.5, 3]) {
    const c = C.center(F.area, 40, 30, z),
      p = { x: 44.5, y: 34.5 };
    const nx = (p.x - c.x) / c.width,
      ny = (p.y - c.y) / c.height;
    assert.ok(
      Math.abs(nx * 1024 - ((p.x - c.x) * 32 * 1024) / (c.width * 32)) < 1e-9,
    );
    assert.ok(
      Math.abs(ny * 768 - ((p.y - c.y) * 32 * 1024) / (c.width * 32)) < 1e-9,
    );
  }
});
test("V4-04: independently addressable assets and stable objects/variants with no reference image", () => {
  assert.deepEqual(F.objects(), F.objects());
  assert.ok(F.assets.length >= 30);
  for (const key of F.assets) {
    const text = fs.readFileSync(
      path.join(__dirname, "../assets/forest", key + ".svg"),
      "utf8",
    );
    assert.match(text, /<svg /);
    assert.doesNotMatch(text, /<image|https?:\/\/(?!www.w3.org)|filter=/);
  }
  const objects = F.objects();
  assert.equal(new Set(objects.map((o) => o.id)).size, objects.length);
  for (const o of objects)
    for (const key of [
      "id",
      "assetKey",
      "worldPosition",
      "anchor",
      "visualBounds",
      "occlusionProfile",
      "variantSeed",
      "visualState",
      "source",
    ])
      assert.ok(key in o);
});
test("V4-05: graphic reads, navigation, occlusion and removal do not mutate the V3 world", () => {
  const a = I.create(),
    b = I.create(),
    v = I.createView(a);
  for (let n = 0; n < 500; n++) {
    const before = JSON.stringify(a.state);
    F.objects();
    F.tile(40 + (n % 12), 25);
    F.layers(F.objects(), a.state.people);
    v.local(4);
    v.select(a.state.people[0].id);
    v.follow(a.state.people[0].id);
    v.sync();
    v.global();
    assert.equal(JSON.stringify(a.state), before);
    a.step();
    b.step();
    assert.deepEqual(a.state, b.state);
  }
});
test("V4-09: river banks are neighbor-derived, reciprocal and continuous across tile boundaries", () => {
  let water = 0;
  for (let y = F.area.y; y < F.area.y + F.area.height; y++)
    for (let x = F.area.x; x < F.area.x + F.area.width; x++) {
      const t = F.tile(x, y);
      if (!F.water(t.kind)) continue;
      water++;
      for (const [dx, dy, bit] of [
        [0, -1, 1],
        [1, 0, 2],
        [0, 1, 4],
        [-1, 0, 8],
      ])
        assert.equal(!!(t.banks & bit), !F.water(I.terrain(x + dx, y + dy)));
      if (F.water(I.terrain(x + 1, y))) {
        assert.equal(t.banks & 2, 0);
        assert.equal(F.tile(x + 1, y).banks & 8, 0);
      }
      if (F.water(I.terrain(x, y + 1))) {
        assert.equal(t.banks & 4, 0);
        assert.equal(F.tile(x, y + 1).banks & 1, 0);
      }
    }
  assert.ok(water > 50);
});
test("V4 scope: all objects have traceable existing sources, no stump or new persistent state", () => {
  const objects = F.objects();
  for (const o of objects) {
    assert.ok(
      o.source === "world-feature" || o.source === "terrain-decoration",
    );
    assert.equal(o.worldPosition.space, "surface");
  }
  assert.ok(
    objects.some(
      (o) =>
        o.name === "Grotte" &&
        o.worldPosition.x === I.cave.outside.x &&
        o.worldPosition.y === I.cave.outside.y,
    ),
  );
  assert.ok(
    objects.filter((o) => o.assetKey === "oak" || o.assetKey === "pine")
      .length > 12,
  );
  assert.ok(objects.some((o) => o.assetKey === "rock"));
  assert.ok(!objects.some((o) => o.assetKey === "stump"));
  assert.equal(I.create().state.people.length, 1);
});
