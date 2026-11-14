const { test } = require("node:test"),
  assert = require("node:assert/strict");
const M = require("../island-motion"),
  I = require("../island-world");
const agent = (id, x = 20, y = 20, space = "surface") => ({
  id,
  pos: { x, y, space },
});
test("motion: fractional visual steps, no logical writes, stable stop and direction change", () => {
  const p = agent(1),
    m = M.create();
  m.sync([p], 0);
  p.pos.x++;
  const state = JSON.stringify(p);
  m.sync([p], 600);
  assert.equal(m.sample(1, 750).pos.x, 20.25);
  assert.equal(m.sample(1, 900).pos.x, 20.5);
  assert.equal(m.sample(1, 900).direction, 2);
  assert.equal(JSON.stringify(p), state);
  assert.equal(m.sample(1, 1200).pos.x, 21);
  assert.equal(m.sample(1, 1200).moving, false);
  assert.equal(m.sample(1, 1200).frame, 0);
  assert.equal(m.active(1200), false);
  p.pos.y--;
  m.sync([p], 1200);
  assert.deepEqual(m.sample(1, 1500).pos, { x: 21, y: 19.5, space: "surface" });
  assert.equal(m.sample(1, 1500).direction, 3);
  p.pos.y++;
  const before = m.sample(1, 1600).pos;
  m.sync([p], 1600);
  assert.deepEqual(m.sample(1, 1600).pos, before);
  assert.ok(m.sample(1, 1700).pos.y > before.y);
});
test("motion: teleport, plan changes, reduced motion, deletion and 20 simultaneous identities", () => {
  const people = Array.from({ length: 20 }, (_, i) => agent(i + 1, i + 10, 20)),
    m = M.create();
  m.sync(people, 0);
  people.forEach((p) => p.pos.x++);
  m.sync(people, 600);
  for (const p of people)
    assert.equal(m.sample(p.id, 900).pos.x, p.pos.x - 0.5);
  assert.equal(m.size, 20);
  people[0].pos.x += 8;
  m.sync(people, 950);
  assert.deepEqual(m.sample(1, 950).pos, people[0].pos);
  assert.equal(m.sample(1, 950).revision, 1);
  people[1].pos = { x: 8, y: 10, space: "cave" };
  m.sync(people, 1000);
  assert.deepEqual(m.sample(2, 1000).pos, people[1].pos);
  m.sync(people, 1000, true);
  assert.equal(m.active(1000), false);
  m.sync(people.slice(2), 1100);
  assert.equal(m.size, 18);
  assert.equal(m.sample(1, 1100), null);
});
test("camera: bounded monotonic damping with controlled lag and frame-rate independence", () => {
  for (const dt of [1000 / 30, 1000 / 60, 1000 / 120]) {
    let current = { x: 0, y: 0, zoom: 1 },
      previous = 0,
      maxLag = 0;
    for (let t = dt; t < 1200; t += dt) {
      const target = { x: Math.min(1, t / 600), y: 0, zoom: 1 };
      current = M.damp(current, target, dt);
      assert.ok(current.x >= previous && current.x <= target.x);
      previous = current.x;
      maxLag = Math.max(maxLag, target.x - current.x);
    }
    assert.ok(maxLag < 0.09);
    assert.equal(current.x, 1);
    assert.equal(current.y, 0);
  }
});
test("presentation follow can use a visual position without advancing or moving the world", () => {
  const w = I.create(),
    v = I.createView(w),
    before = JSON.stringify(w.state);
  v.follow(1);
  v.sync({ space: "surface", x: 30, y: 36 });
  assert.equal(v.scene.region, 3);
  assert.equal(JSON.stringify(w.state), before);
  v.sync({ space: "cave", x: 8, y: 5 });
  assert.equal(v.scene.kind, "interior");
  assert.equal(JSON.stringify(w.state), before);
});
