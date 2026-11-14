"use strict";
const test = require("node:test"),
  assert = require("node:assert/strict");
const V = require("../v1-engines"),
  W = require("../material-world"),
  S = require("../v1-storage");
const clone = W.clone;
const last = (s, kind, actorId = 1) =>
  s.trace.findLast((e) => e.kind === kind && e.actorId === actorId);
const run = (s, ticks) => {
  for (let i = 0; i < ticks; i++) V.step(s);
  return s;
};
const local = () => ({
  sources: [{ cellId: 40, quantity: 1 }],
  agents: [
    { pos: 40, energy: 100 },
    { pos: 40, energy: 100 },
  ],
});

// These seven IDs are operational V1 acceptance cases defined by this prototype;
// no V1-01…07 specification existed on the inspected documentary branch.
test("V1-01 — autonomous complete M1→M2→M3→M4→M5→M6 chain", () => {
  for (const source of [40, 65, 89]) {
    const s = V.create({
      sources: [{ cellId: source, quantity: 12 }],
      agents: [{ pos: source - 1 }, { pos: source + 1 }],
    });
    for (const primitive of ["MOVE", "TRANSFER", "INGEST"]) {
      V.step(s);
      assert.deepEqual(
        s.world.agents.map((a) => a.lastResult.command.type),
        [primitive, primitive],
      );
      for (const id of [1, 2]) {
        const events = s.trace.filter(
          (e) => e.tick === s.world.tick && e.actorId === id,
        );
        assert.deepEqual(
          events.map((e) => e.kind),
          ["M1", "M2", "M3", "EVALUATE", "DECIDE", "ATTEMPT", "RESULT", "M6"],
        );
        for (const [child, parent] of [
          [1, 0],
          [2, 1],
          [3, 2],
          [4, 3],
          [5, 4],
          [6, 5],
          [7, 6],
        ])
          assert.ok(events[child].parents.includes(events[parent].id));
      }
    }
    assert.equal(s.world.ledger.ration.consumed, 2);
    assert.equal(
      s.world.entities.reduce((n, e) => n + e.quantity, 0),
      10,
    );
    assert.equal(s.minds[0].preferences[0].value, 4);
    W.validateState(s.world);
  }
});

test("V1-02 — false belief persists without observation; no hidden learning", () => {
  const s = V.create(local());
  V.step(s);
  assert.equal(
    s.world.entities.some((e) => e.location.cellId === 40),
    false,
  );
  assert.equal(
    s.minds[0].beliefs.find((b) => b.cellId === 40).observedQuantity,
    1,
  );
  const belief = clone(s.minds[0].beliefs),
    preferences = clone(s.minds[0].preferences);
  V.step(s, { perceiveIds: [], decideIds: [] });
  assert.deepEqual(s.minds[0].beliefs, belief);
  assert.deepEqual(s.minds[0].preferences, preferences);
  V.step(s, { perceiveIds: [1], decideIds: [] });
  assert.equal(
    s.minds[0].beliefs.find((b) => b.cellId === 40).observedQuantity,
    0,
  );
  assert.equal(
    s.minds[1].beliefs.find((b) => b.cellId === 40).observedQuantity,
    1,
  );
  // M3/M4 cannot distinguish two different hidden worlds from the same acquired view.
  const a = V.create({ sources: [{ cellId: 107, quantity: 1 }] });
  const b = V.create({ sources: [{ cellId: 107, quantity: 99 }] });
  const pa = V.perceive(a.world, 1),
    pb = V.perceive(b.world, 1);
  pa.eventId = pb.eventId = "v1:1";
  assert.deepEqual(pa, pb);
  const memory = a.minds[0],
    ea = V.evaluate(V.understand(pa, memory)),
    eb = V.evaluate(V.understand(pb, memory));
  assert.deepEqual(
    V.decide(ea, () => 0.4),
    V.decide(eb, () => 0.4),
  );
  const frozen = JSON.stringify({ pa, memory });
  V.understand(pa, memory);
  assert.equal(JSON.stringify({ pa, memory }), frozen);
});

test("V1-03 — personal experience changes a real future decision (counterfactual)", () => {
  const s = V.create(
    {
      sources: [
        { cellId: 40, quantity: 24 },
        { cellId: 42, quantity: 24 },
      ],
    },
    7,
  );
  run(s, 32);
  const withoutExperience = clone(s);
  withoutExperience.minds[0].preferences = [];
  const evidence = s.minds[0].preferences.find((p) => p.cellId === 40).evidence;
  assert.equal(V.cause(s, evidence).event.kind, "M6");
  const learning = V.cause(s, evidence).event;
  const result = learning.parents
    .map((id) => V.cause(s, id).event)
    .find((e) => e?.kind === "RESULT");
  assert.equal(result.actorId, 1);
  assert.equal(result.data.outcome, "success");
  V.step(s);
  V.step(withoutExperience);
  const learned = last(s, "DECIDE").data.chosen,
    plain = last(withoutExperience, "DECIDE").data.chosen;
  assert.equal(s.world.tick, 33);
  assert.equal(learned.target, 40);
  assert.equal(learned.command.type, "MOVE");
  assert.equal(plain.target, 42);
  assert.equal(plain.command.type, "TRANSFER");
  assert.equal(learned.experience, 6);
  assert.ok(last(s, "EVALUATE").parents.includes(evidence));
  assert.deepEqual(last(s, "M2").data, last(withoutExperience, "M2").data);
  assert.equal(
    last(s, "EVALUATE").data.body.energy,
    last(withoutExperience, "EVALUATE").data.body.energy,
  );
});

test("V1-04 — contested last quantum, rotating arbitration and atomic refusal", () => {
  for (const delay of [0, 1]) {
    const s = V.create(local());
    if (delay) V.step(s, { decideIds: [] });
    V.step(s);
    const winner = delay ? 1 : 2,
      loser = delay ? 2 : 1;
    const win = s.world.agents.find((a) => a.id === winner),
      lose = s.world.agents.find((a) => a.id === loser);
    assert.equal(win.lastResult.outcome, "success");
    assert.equal(lose.lastResult.causeCode, "EMPTY");
    assert.equal(lose.body.energy, 100);
    assert.equal(win.body.energy, 99);
    assert.deepEqual(lose.lastResult.delta, {
      lots: [],
      position: null,
      body: [],
      consumed: 0,
    });
    assert.equal(s.world.entities.length, 1);
    assert.equal(s.world.entities[0].id, 1);
    assert.equal(s.world.entities[0].location.holderAgentId, winner);
    assert.equal(s.world.nextId, 2);
    assert.equal(
      s.minds.find((m) => m.actorId === loser).preferences[0].value,
      -6,
    );
    assert.equal(last(s, "DECIDE", loser).data.chosen.task, "acquire");
    assert.equal(last(s, "RESULT", loser).data.causeCode, "EMPTY");
    assert.ok(
      !last(s, "DECIDE", loser).parents.includes(last(s, "RESULT", loser).id),
    );
    W.validateState(s.world);
  }
});

test("V1-05 — exact saves at action boundaries, controlled randomness and import refusal", () => {
  for (const boundary of [1, 2, 32]) {
    const continuous = run(V.create({}, 123), boundary);
    const resumed = S.deserialize(S.serialize(continuous));
    run(continuous, 40);
    run(resumed, 40);
    assert.equal(S.serialize(resumed), S.serialize(continuous));
  }
  const s = run(V.create(), 3),
    original = S.serialize(s);
  for (const mutate of [
    (x) => (x.version = "future"),
    (x) => (x.extra = true),
    (x) => x.world.ledger.ration.consumed++,
    (x) => (x.world.entities[0].quantity = -1),
    (x) => (x.trace[0].parents = [x.trace[1].id]),
    (x) => x.nextEvent++,
    (x) => (x.minds[0].preferences[0].evidence = "v1:99999"),
    (x) => (x.minds[0].beliefs[0].observedAt = 999),
    (x) => x.trace.find((e) => e.kind === "EVALUATE").data.options[0].score++,
    (x) =>
      (x.trace.find((e) => e.kind === "DECIDE").data.chosen.command.type =
        "REST"),
  ]) {
    const corrupt = JSON.parse(original);
    mutate(corrupt);
    assert.throws(() => S.deserialize(JSON.stringify(corrupt)));
    assert.equal(S.serialize(s), original);
  }
});

test("V1-06 — faithful consultable causal graph, pure inspection and explicit pruning", () => {
  const s = run(V.create(local()), 2),
    before = S.serialize(s);
  const inspection = V.inspect(s);
  inspection.world.tick = 500;
  assert.equal(S.serialize(s), before);
  const learned = last(s, "M6"),
    ancestry = new Set();
  function visit(id) {
    if (ancestry.has(id)) return;
    ancestry.add(id);
    const e = V.cause(s, id).event;
    if (e) e.parents.forEach(visit);
  }
  visit(learned.id);
  for (const kind of [
    "M1",
    "M2",
    "M3",
    "EVALUATE",
    "DECIDE",
    "ATTEMPT",
    "RESULT",
    "M6",
  ])
    assert.ok([...ancestry].some((id) => V.cause(s, id).event?.kind === kind));
  const old = s.trace[0].id;
  run(s, 40);
  assert.equal(s.trace.length, V.LIMIT);
  assert.deepEqual(V.cause(s, old), { status: "détail non conservé", id: old });
  const restored = S.deserialize(S.serialize(s));
  assert.deepEqual(restored, s);
});

test("V1-07 — independent activations, interrupted intention, bounded empty world", () => {
  const s = V.create();
  V.step(s);
  const intent = clone(s.world.agents[0].intention),
    plan = clone(s.world.agents[0].plan);
  V.step(s, { perceiveIds: [2], decideIds: [2] });
  assert.deepEqual(s.world.agents[0].intention, intent);
  assert.deepEqual(s.world.agents[0].plan, plan);
  assert.equal(
    s.trace.filter(
      (e) =>
        e.tick === 2 &&
        e.actorId === 1 &&
        ["M3", "EVALUATE", "DECIDE", "ATTEMPT", "RESULT"].includes(e.kind),
    ).length,
    0,
  );
  assert.equal(last(s, "M2").data.external, false);
  assert.equal(last(s, "M6").tick, 2);
  const resumed = S.deserialize(S.serialize(s));
  V.step(s);
  V.step(resumed);
  assert.deepEqual(s, resumed);
  const before = S.serialize(s);
  assert.throws(() => V.step(s, { decideIds: [99] }));
  assert.equal(S.serialize(s), before);
  const empty = V.create({ sources: [] });
  const random = Math.random;
  try {
    Math.random = () => {
      throw new Error("Uncontrolled random");
    };
    run(empty, 200);
  } finally {
    Math.random = random;
  }
  assert.equal(empty.world.entities.length, 0);
  assert.equal(empty.world.ledger.ration.consumed, 0);
  assert.ok(
    empty.trace.length <= V.LIMIT &&
      empty.minds.every((m) => m.beliefs.length <= 108),
  );
  assert.equal(empty.world.nextId, 1);
  V.validate(empty);
});

test("V1 storage — own key, blocked/corrupt storage preserved", () => {
  const data = new Map([
    ["microcosme-v03", "old"],
    ["microcosme-material-lab-v1", "I1"],
  ]);
  const storage = {
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => data.set(k, v),
  };
  const s = V.create();
  assert.equal(S.save(storage, s).ok, true);
  assert.deepEqual(S.load(storage).state, s);
  assert.equal(data.get("microcosme-v03"), "old");
  assert.equal(data.get("microcosme-material-lab-v1"), "I1");
  storage.setItem(S.KEY, "corrupt");
  assert.equal(S.load(storage).blocked, true);
  assert.equal(data.get(S.KEY), "corrupt");
  assert.equal(
    S.save(
      {
        setItem() {
          throw new Error("blocked");
        },
      },
      s,
    ).ok,
    false,
  );
  assert.equal(S.load(undefined).blocked, true);
});
