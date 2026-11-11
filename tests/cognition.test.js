const { test } = require("node:test");
const assert = require("node:assert/strict");
const { create } = require("../engine");
const cognition = require("../cognition");
const storage = require("../storage");
function world(random = () => 0) {
  const e = create(null, random),
    s = e.state;
  s.tiles.fill("grass");
  s.wood = 12;
  s.laws.hunger = 0;
  s.laws.social = 0;
  s.people = s.people.slice(0, 1);
  const p = s.people[0];
  Object.assign(p, {
    pos: 0,
    energy: 100,
    hunger: 0,
    food: 3,
    task: "observe",
    target: null,
    intention: null,
    memory: { places: [], people: {}, visited: [0], events: [] },
  });
  e.prepare(p);
  return { e, s, p };
}
function observe(e, p, pos) {
  const before = p.pos;
  p.pos = pos;
  e.perceive(p);
  p.pos = before;
}
function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

test("champ disparu : retour fondé sur un souvenir obsolète, correction seulement à portée de vue", () => {
  const { e, s, p } = world();
  s.tiles[2] = "field";
  e.perceive(p);
  const remembered = clone(p.memory.terrain[2]);
  assert.equal(remembered.kind, "field");
  assert.equal(remembered.observedAt, 8);
  p.pos = 10;
  e.perceive(p);
  s.tiles[2] = "grass";
  p.food = 0;
  p.hunger = 60;
  e.decide(p);
  assert.equal(p.target, 2);
  assert.equal(p.memory.terrain[2].kind, "field");
  while (p.pos > 5) {
    e.step();
    assert.equal(p.target, 2);
    assert.deepEqual(p.memory.terrain[2], remembered);
    assert.equal(p.memory.experiences["farm:2"], undefined);
  }
  e.step();
  assert.equal(p.pos, 4);
  assert.equal(p.memory.terrain[2].kind, "grass");
  assert.ok(p.memory.terrain[2].observedAt > remembered.observedAt);
  assert.equal(p.memory.experiences["farm:2"].lastOutcome, "failure");
  assert.equal(p.task, "explore");
  assert.notEqual(p.target, 2);
  assert.equal(p.food, 0);
  assert.ok(p.memory.journal.some((event) => event.type === "revision"));
  assert.ok(p.memory.journal.some((event) => event.type === "failure"));
});

test("le décideur et les solutions ne lisent pas la carte réelle, même pour une intention active", () => {
  const { e, s, p } = world();
  s.tiles[6] = "field";
  observe(e, p, 6);
  p.food = 0;
  p.hunger = 50;
  s.tiles = new Proxy(s.tiles, {
    get() {
      throw Error("Lecture interdite hors perception/action");
    },
  });
  assert.equal(e.known(p, "field"), 6);
  assert.equal(cognition.solutions(p, "farm")[0].target, 6);
  e.decide(p);
  assert.equal(p.target, 6);
  e.decide(p);
  assert.equal(p.target, 6);
});

test("les prairies sont observées en Manhattan et une révision change seulement la connaissance locale", () => {
  const { e, s, p } = world();
  p.pos = 26;
  e.perceive(p);
  assert.equal(Object.keys(p.memory.terrain).length, 13);
  assert.equal(p.memory.terrain[28].kind, "grass");
  assert.equal(p.memory.terrain[40], undefined); // (4,3) à distance 3.
  const first = clone(p.memory.terrain[28]);
  s.hour++;
  s.tiles[28] = "tree";
  s.tiles[40] = "field";
  e.perceive(p);
  assert.equal(p.memory.terrain[28].kind, "tree");
  assert.equal(p.memory.terrain[28].revision, first.revision + 1);
  assert.equal(p.memory.terrain[28].observedAt, 9);
  assert.equal(p.memory.terrain[40], undefined);
  s.hour++;
  e.perceive(p);
  assert.equal(p.memory.terrain[28].revision, first.revision + 1);
  assert.equal(p.memory.terrain[28].observedAt, 10);
});

test("plusieurs solutions plausibles, choix imparfait borné et reproductible sous hasard injecté", () => {
  function decision(random) {
    const { e, s, p } = world(random);
    s.tiles[3] = "field";
    s.tiles[4] = "field";
    s.tiles[11] = "field";
    observe(e, p, 3);
    observe(e, p, 11);
    p.food = 0;
    e.perceive(p);
    return { choice: cognition.choose(p, random), p };
  }
  const first = decision(() => 0),
    second = decision(() => 0.99),
    repeat = decision(() => 0.99);
  assert.equal(first.choice.target, 3);
  assert.equal(second.choice.target, 4);
  assert.deepEqual(second.choice, repeat.choice);
  assert.equal(second.choice.task, "farm");
  assert.notEqual(second.choice.target, 11);
});

test("une réussite influence le classement sans imposer une destination éloignée", () => {
  const { e, s, p } = world();
  s.tiles[3] = "field";
  s.tiles[4] = "field";
  observe(e, p, 3);
  p.food = 0;
  p.memory.experiences["farm:4"] = {
    successes: 1,
    failures: 0,
    lastOutcome: "success",
    lastAt: 8,
    revision: 1,
    cause: "Action réussie",
  };
  const options = cognition.solutions(p, "farm");
  assert.equal(options.find((c) => c.target === 4).score, 3);
  assert.equal(options.find((c) => c.target === 3).score, 3);
});

test("une nouvelle alternative proche ne provoque pas de changement d’intention", () => {
  const { e, s, p } = world();
  s.tiles[6] = "field";
  observe(e, p, 6);
  p.food = 0;
  e.perceive(p);
  e.decide(p);
  const intent = clone(p.intention);
  s.tiles[1] = "field";
  e.perceive(p);
  e.decide(p);
  assert.deepEqual(p.intention, intent);
  assert.equal(p.target, 6);
});

test("une découverte utile interrompt une exploration sans solution connue", () => {
  const { e, s, p } = world();
  p.food = 0;
  e.perceive(p);
  e.decide(p);
  assert.equal(p.task, "explore");
  s.tiles[1] = "field";
  e.perceive(p);
  e.decide(p);
  assert.equal(p.task, "farm");
  assert.equal(p.target, 1);
});

test("fatigue et faim urgentes interrompent le trajet sans modifier les seuils", () => {
  const { e, s, p } = world();
  s.tiles[8] = "tree";
  observe(e, p, 8);
  s.wood = 0;
  e.perceive(p);
  e.decide(p);
  assert.equal(p.task, "wood");
  p.food = 1;
  p.hunger = 45;
  e.decide(p);
  assert.equal(p.task, "eat");
  assert.equal(p.target, null);
  p.intention = null;
  p.food = 3;
  p.hunger = 0;
  p.energy = 24;
  e.decide(p);
  assert.equal(p.task, "rest");
  assert.equal(p.target, null);
  p.intention = null;
  p.energy = 25;
  e.decide(p);
  assert.notEqual(p.task, "rest");
});

test("l’anticipation utilise le coût réel et la maison connue, sans détour pour une faim urgente", () => {
  const { e, s, p } = world();
  s.tiles[8] = "field";
  s.tiles[1] = "home";
  observe(e, p, 8);
  observe(e, p, 1);
  p.food = 0;
  p.energy = 30;
  p.hunger = 0;
  e.perceive(p);
  e.decide(p);
  assert.equal(p.task, "rest");
  assert.equal(p.target, 1);
  assert.match(p.reason, /Anticipe/);
  p.hunger = 60;
  e.decide(p);
  assert.equal(p.task, "farm");
  assert.equal(p.target, 8);
});

test("un échec est évité tant que la même information subsiste, puis reconsidéré après observation nouvelle", () => {
  const { e, s, p } = world();
  s.tiles[2] = "field";
  e.perceive(p);
  p.food = 0;
  const seen = p.memory.terrain[2];
  p.memory.experiences["farm:2"] = {
    successes: 0,
    failures: 1,
    lastOutcome: "failure",
    lastAt: 8,
    revision: seen.revision,
    cause: "Échec observé",
  };
  assert.equal(e.known(p, "field"), null);
  e.decide(p);
  assert.equal(p.task, "explore");
  s.tiles[2] = "grass";
  e.perceive(p);
  s.tiles[2] = "field";
  s.hour++;
  e.perceive(p);
  e.decide(p);
  assert.equal(p.task, "farm");
  assert.equal(p.target, 2);
  assert.equal(p.memory.experiences["farm:2"].failures, 1);
});

test("une action réussie enregistre sa destination et son résultat", () => {
  const { e, s, p } = world();
  s.tiles[1] = "field";
  p.food = 0;
  e.step();
  const outcome = p.memory.experiences["farm:1"];
  assert.equal(outcome.successes, 1);
  assert.equal(outcome.lastOutcome, "success");
  assert.equal(p.food, 2);
  assert.equal(p.pos, 1);
});

test("l’exploration ignore entièrement la nature cachée des cases", () => {
  function run(hidden) {
    const { e, s, p } = world(() => 0.5);
    s.tiles.fill(hidden);
    p.memory.terrain = { 0: { kind: "grass", observedAt: 8, revision: 1 } };
    e.decide(p);
    return clone(p.intention);
  }
  assert.deepEqual(run("field"), run("tree"));
});

test("migration v0.6 sans reconstruire de connaissances omniscientes, conservation des relations", () => {
  const { s, p } = world();
  p.memory = {
    places: [2, 80],
    visited: [0],
    people: { 2: { name: "Ami", trust: 17, meetings: 4 } },
    events: ["Souvenir ancien"],
  };
  p.task = "farm";
  p.target = 2;
  delete p.intention;
  s.tiles[2] = "grass";
  s.tiles[80] = "field";
  s.version = 6;
  const migrated = storage.normalize(clone(s));
  assert.equal(migrated.version, 7);
  assert.deepEqual(migrated.people[0].memory.terrain[2], {
    kind: "field",
    observedAt: null,
    revision: 0,
  });
  assert.equal(migrated.people[0].memory.terrain[80].kind, null);
  assert.deepEqual(migrated.people[0].memory.people, p.memory.people);
  assert.deepEqual(migrated.people[0].memory.events, p.memory.events);
});

test("sauvegarde v0.7 : intentions, connaissances, expériences et journal traversent un aller-retour", () => {
  const { e, s, p } = world();
  s.tiles[1] = "field";
  p.food = 0;
  e.step();
  e.step();
  const normalized = storage.normalize(s);
  const recovered = storage.normalize(clone(normalized));
  assert.deepEqual(recovered, normalized);
  const resumed = create(recovered, () => 0);
  const original = create(clone(normalized), () => 0);
  for (let i = 0; i < 20; i++) {
    resumed.step();
    original.step();
  }
  assert.deepEqual(resumed.state, original.state);
});

test("les mémoires restent bornées, la population et les identités restent stables dans plusieurs mondes", () => {
  for (let seed = 1; seed <= 4; seed++) {
    let value = seed;
    const random = () => {
      value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
      return value / 4294967296;
    };
    const e = create(null, random),
      ids = e.state.people.map((p) => p.id);
    for (let t = 0; t < 300; t++) {
      e.step();
      for (const p of e.state.people) {
        assert.ok(Object.keys(p.memory.terrain).length <= 108);
        assert.ok(Object.keys(p.memory.experiences).length <= 432);
        assert.ok(p.memory.journal.length <= 12);
        assert.ok(p.memory.visited.length <= 108);
      }
    }
    assert.deepEqual(
      e.state.people.map((p) => p.id),
      ids,
    );
  }
});
