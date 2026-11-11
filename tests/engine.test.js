const { test } = require("node:test");
const assert = require("node:assert/strict");
const { create } = require("../engine");
const storage = require("../storage");
function world() {
  const e = create(null, () => 0.5),
    s = e.state;
  s.tiles.fill("grass");
  s.wood = 12;
  s.laws.hunger = 0;
  s.laws.social = 0;
  s.people = s.people.slice(0, 1);
  const p = s.people[0];
  Object.assign(p, {
    pos: 0,
    food: 3,
    hunger: 0,
    energy: 100,
    task: "observe",
    target: null,
    memory: { places: [], visited: [0], people: {}, events: [] },
  });
  return { e, s, p };
}
test("la population et les identités restent stables pendant 2000 heures", () => {
  const e = create(null, () => 0.5);
  const ids = e.state.people.map((p) => p.id);
  for (let i = 0; i < 2000; i++) {
    e.step();
    for (const p of e.state.people) {
      assert.ok(p.pos >= 0 && p.pos < 108);
      assert.ok(p.memory.events.length <= 5);
      assert.ok(p.memory.visited.length <= 108);
    }
  }
  assert.deepEqual(
    e.state.people.map((p) => p.id),
    ids,
  );
});
test("un trajet agricole conserve sa destination et récolte seulement à arrivée", () => {
  const { e, s, p } = world();
  s.tiles[4] = "field";
  p.food = 0;
  p.memory.places = [4];
  e.step();
  assert.equal(p.target, 4);
  assert.equal(p.pos, 1);
  s.tiles[12] = "field";
  p.memory.places.push(12);
  for (let i = 0; i < 2; i++) {
    e.step();
    assert.equal(p.target, 4);
    assert.equal(p.food, 0);
  }
  e.step();
  assert.equal(p.pos, 4);
  assert.equal(p.food, 2);
  assert.equal(p.target, null);
  assert.ok(p.memory.events.includes("A récolté au champ"));
});
test("un trajet vers le bois reste cohérent et une faim urgente le préempte", () => {
  const { e, s, p } = world();
  s.wood = 0;
  s.tiles[5] = "tree";
  p.memory.places = [5];
  e.step();
  assert.equal(p.target, 5);
  e.step();
  assert.equal(p.pos, 2);
  assert.equal(p.target, 5);
  p.hunger = 60;
  e.step();
  assert.equal(p.task, "eat");
  assert.equal(p.pos, 2);
  assert.equal(p.target, null);
});
test("une destination transformée est abandonnée sans récolte fantôme", () => {
  const { e, s, p } = world();
  s.tiles[5] = "field";
  p.food = 0;
  p.memory.places = [5];
  e.step();
  s.tiles[5] = "tree";
  e.step();
  assert.equal(p.food, 0);
  assert.equal(p.task, "explore");
});
test("le repos conserve sa maison et récupère seulement à arrivée", () => {
  const { e, s, p } = world();
  s.tiles[4] = "home";
  p.memory.places = [4];
  p.energy = 24;
  for (let i = 0; i < 4; i++) e.step();
  assert.equal(p.pos, 4);
  assert.equal(p.task, "rest");
  assert.equal(p.energy, 38);
  assert.equal(p.target, 4);
});
test("exploration persistante, déplacements unitaires et mémoire conservée après tour complet", () => {
  const { e, s, p } = world();
  p.task = "explore";
  p.target = 7;
  for (let i = 0; i < 7; i++) {
    const before = p.pos;
    e.step();
    assert.equal(p.pos, before + 1);
    if (i < 6) assert.equal(p.target, 7);
  }
  p.memory.visited = Array.from({ length: 108 }, (_, i) => i);
  e.step();
  assert.equal(p.memory.visited.length, 108);
  assert.notEqual(p.target, p.pos);
});
test("mémoire de perception et relations de partage réciproques", () => {
  const { e, s, p } = world();
  s.tiles[1] = "field";
  e.perceive(p);
  assert.ok(p.memory.places.includes(1));
  const q = {
    ...p,
    id: 2,
    name: "Ami",
    food: 3,
    personality: { kindness: 100, curiosity: 50 },
    memory: { places: [], visited: [0], people: {}, events: [] },
  };
  q.pos = 1;
  s.people.push(q);
  p.task = "explore";
  p.target = 1;
  p.hunger = 60;
  p.food = 0;
  s.tiles.fill("grass");
  p.energy = 100;
  q.energy = 100;
  e.step();
  assert.ok(p.memory.people[2]);
  assert.equal(p.memory.people[2].trust, 3);
  assert.equal(q.memory.people[1].trust, 3);
  assert.ok(p.memory.events.some((t) => t.includes("donné")));
});
test("destination hors carte refusée", () => {
  const { e, p } = world();
  for (const target of [-1, 108, NaN, 1.5, null])
    assert.equal(e.travel(p, target), false);
  assert.equal(p.pos, 0);
});
function memoryStore(entries = {}) {
  const data = new Map(Object.entries(entries));
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, v),
    data,
  };
}
test("migration v02, normalisation et aller-retour complet des souvenirs et destinations", () => {
  const { s, p } = world();
  p.target = 7;
  p.memory.events = ["Souvenir"];
  const store = memoryStore({ [storage.LEGACY]: JSON.stringify(s) });
  const loaded = storage.load(store).state;
  assert.equal(loaded.people[0].target, 7);
  assert.equal(storage.save(store, loaded).ok, true);
  assert.deepEqual(storage.load(store).state, loaded);
  assert.ok(store.data.has(storage.LEGACY));
});
test("anciens habitants incomplets réparés sans perte des identités", () => {
  const { s } = world();
  delete s.people[0].memory;
  delete s.people[0].food;
  delete s.laws;
  const loaded = storage.normalize(s);
  assert.deepEqual(loaded.people[0].memory.events, []);
  assert.equal(loaded.people[0].id, 1);
  assert.equal(loaded.laws.hunger, 2);
  create(loaded).step();
});
test("JSON corrompu sauvegardé avant récupération du v02", () => {
  const { s } = world();
  const store = memoryStore({
    [storage.KEY]: "{cassé",
    [storage.LEGACY]: JSON.stringify(s),
  });
  assert.ok(storage.load(store).state);
  assert.equal(store.data.get(storage.KEY + "-recovery"), "{cassé");
});
test("stockage indisponible et quota ne font pas tomber la simulation", () => {
  const store = {
    getItem() {
      throw Error("privé");
    },
    setItem() {
      throw Error("quota");
    },
  };
  assert.equal(storage.load(store).blocked, true);
  assert.equal(storage.save(store, world().s).ok, false);
});
test("validation rejette les identités dupliquées et les positions invalides", () => {
  const { s } = world();
  s.people.push({ ...s.people[0] });
  assert.throws(() => storage.normalize(s));
  s.people.pop();
  s.people[0].pos = 108;
  assert.throws(() => storage.normalize(s));
});

test("une copie de récupération impossible bloque les écritures de la session", () => {
  const store = {
    getItem: () => "{invalide",
    setItem: () => {
      throw Error("quota");
    },
  };
  const result = storage.load(store);
  assert.equal(result.blocked, true);
  assert.equal(result.state, null);
});
test("journaux et souvenirs restent bornés et les lois sont normalisées", () => {
  const { e, s, p } = world();
  for (let i = 0; i < 100; i++) {
    e.log("événement " + i);
    e.remember(p, "souvenir " + i);
  }
  assert.equal(s.events.length, 35);
  assert.equal(p.memory.events.length, 5);
  s.laws = { hunger: 999, productivity: -5, social: NaN };
  assert.deepEqual(storage.normalize(s).laws, {
    hunger: 4,
    productivity: 1,
    social: 30,
  });
});
