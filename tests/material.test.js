"use strict";
const test = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs");
const W = require("../material-world.js"),
  A = require("../material-actions.js"),
  C = require("../material-cognition.js"),
  S = require("../material-storage.js");
const transfer = (actorId = 1, lotId = 1, cellId = 40, quantity = 1) => ({
  type: "TRANSFER",
  actorId,
  lotId,
  source: { cellId },
  destination: { holderAgentId: actorId },
  quantity,
});
const local = (quantity = 3) =>
  W.createLab({
    sources: [{ cellId: 40, quantity }],
    agents: [
      { pos: 40, hunger: 60, energy: 100 },
      { pos: 40, hunger: 60, energy: 100 },
    ],
  });
const material = (s) =>
  JSON.stringify({
    entities: s.entities,
    cells: s.cells,
    nextId: s.nextId,
    ledger: s.ledger,
    positions: s.agents.map((a) => a.pos),
    bodies: s.agents.map((a) => a.body),
  });
// Command-driven contract fixtures, not autonomy proofs: each command occupies a
// distinct tick with the same exposure phase as the normative tick (other agent idle).
function commandTick(s, command) {
  s.tick++;
  for (const a of s.agents) {
    const before = a.body.hunger;
    a.body.hunger = Math.min(130, before + 2);
    W.appendEvent(s, {
      id: s.tick + ":body:" + a.id,
      tick: s.tick,
      actorId: a.id,
      type: "EXPOSURE",
      before,
      after: a.body.hunger,
      causeCode: "HUNGER_TICK",
    });
  }
  return A.executeCommand(s, command);
}
function perceive(s, id) {
  const view = W.observeAgent(s, id),
    a = s.agents.find((a) => a.id === id);
  a.knowledge = view.knowledge;
  a.intention = view.intention;
  a.plan = view.plan;
  return view;
}
const carried = (s, id) =>
  W.inventory(s, id).reduce((n, e) => n + e.quantity, 0);
function refusedWithoutMutation(s, cmd, cause) {
  const before = material(s),
    result = A.executeCommand(s, cmd);
  assert.equal(result.causeCode, cause);
  assert.equal(material(s), before);
  assert.deepEqual(result.cost, { energy: 0 });
  assert.deepEqual(result.delta, {
    lots: [],
    position: null,
    body: [],
    consumed: 0,
  });
  return result;
}
function freeze(o) {
  if (o && typeof o === "object") {
    Object.freeze(o);
    Object.values(o).forEach(freeze);
  }
  return o;
}

test("T01 conservation : source3, transfert1, ingestion1", () => {
  const s = local();
  const r = commandTick(s, transfer());
  assert.equal(r.causeCode, "SUCCESS");
  assert.equal(s.entities[0].quantity, 2);
  assert.equal(carried(s, 1), 1);
  commandTick(s, {
    type: "INGEST",
    actorId: 1,
    lotId: W.inventory(s, 1)[0].id,
  });
  assert.equal(carried(s, 1), 0);
  assert.equal(s.ledger.ration.consumed, 1);
  W.validateState(s);
});
test("T02 dernier lot : transfert total conserve ID, concurrent EMPTY", () => {
  const s = local(1);
  assert.equal(A.executeCommand(s, transfer()).causeCode, "SUCCESS");
  const id = s.entities[0].id;
  assert.equal(id, 1);
  assert.equal(s.nextId, 2);
  refusedWithoutMutation(s, transfer(2), "EMPTY");
  assert.equal(s.entities.length, 1);
});
test("T03 concurrence autonome : snapshot commun et arbitrage tournant reproductible", () => {
  for (const initialTick of [0, 1]) {
    const s = local(1);
    s.tick = initialTick;
    const copy = W.clone(s);
    W.stepLab(s);
    W.stepLab(copy);
    assert.deepEqual(s, copy);
    const winner = s.agents.find((a) => a.lastResult.outcome === "success"),
      loser = s.agents.find((a) => a.lastResult.outcome === "failure");
    assert.equal(winner.id, initialTick === 0 ? 2 : 1);
    assert.equal(loser.lastResult.causeCode, "EMPTY");
    assert.equal(carried(s, winner.id), 1);
    assert.ok(
      loser.knowledge.find((k) => k.cellId === 40).observedQuantity === 1,
      "le refus ne réécrit pas le snapshot pré-commit",
    );
  }
});
test("T04 subjectivité : vérités cachées différentes, mêmes vues et décisions", () => {
  const agents = [{ pos: 0 }, { pos: 1 }],
    a = W.createLab({ agents, sources: [{ cellId: 100, quantity: 4 }] }),
    b = W.createLab({ agents, sources: [{ cellId: 107, quantity: 7 }] });
  const va = W.observeAgent(a, 1),
    vb = W.observeAgent(b, 1);
  assert.deepEqual(va, vb);
  const before = JSON.stringify(va);
  assert.deepEqual(
    C.decideAgent(freeze(va), () => 0.2),
    C.decideAgent(freeze(vb), () => 0.2),
  );
  assert.equal(JSON.stringify(va), before);
  assert.equal(Object.hasOwn(va, "entities"), false);
  assert.equal(Object.hasOwn(va, "world"), false);
});
test("T05 autonome : MOVE puis TRANSFER puis INGEST sans commandes de fixture", () => {
  for (const [pos, source] of [
    [39, 40],
    [14, 26],
    [83, 81],
  ]) {
    const s = W.createLab(
      {
        agents: [
          { pos, hunger: 60, energy: 75 },
          { pos: 107, hunger: 0, energy: 75 },
        ],
        sources: [{ cellId: source, quantity: 6 }],
      },
      75,
    );
    const history = [];
    for (let i = 0; i < 8; i++) {
      W.stepLab(s);
      history.push(s.agents[0].lastResult.command.type);
    }
    assert.ok(history.indexOf("MOVE") < history.indexOf("TRANSFER"));
    assert.ok(history.indexOf("TRANSFER") < history.indexOf("INGEST"));
    assert.ok(s.agents[0].body.hunger < 60);
    assert.ok(s.ledger.ration.consumed > 0);
  }
});
test("T06 épuisement : ni apport fantôme ni boucle, exploration/repos explicites", () => {
  const s = W.createLab({ sources: [] });
  for (let i = 0; i < 250; i++) W.stepLab(s);
  assert.equal(s.entities.length, 0);
  assert.equal(s.ledger.ration.initial, 0);
  assert.ok(s.agents.every((a) => a.lastDecision.reason.length > 0));
  W.validateState(s);
});
test("T07 refus atomique, porteur plein et source absente", () => {
  const s = W.createLab({
    agents: [{ pos: 40 }, { pos: 40 }],
    sources: [
      { cellId: 40, quantity: 3 },
      { cellId: 41, quantity: 4 },
    ],
  });
  s.entities[1].location = { holderAgentId: 1 };
  refusedWithoutMutation(s, transfer(), "CAPACITY");
  const empty = local();
  empty.nextId = 9;
  refusedWithoutMutation(empty, transfer(1, 8), "EMPTY");
});
test("T08 reprise exacte après transfert : état, ordre, RNG, connaissances et intentions", () => {
  const s = local(7);
  W.stepLab(s);
  const resumed = S.deserialize(S.serialize(s));
  for (let i = 0; i < 20; i++) {
    W.stepLab(s);
    W.stepLab(resumed);
  }
  assert.deepEqual(resumed, s);
});
test("T09 import rejette corruptions sans normaliser ni réparer le snapshot", () => {
  const s = local();
  perceive(s, 1);
  const text = S.serialize(s);
  const bad = [
    (s) => s.entities.push(W.clone(s.entities[0])),
    (s) => (s.entities[0].quantity = -1),
    (s) => (s.entities[0].quantity = 0),
    (s) => (s.entities[0].location = { holderAgentId: 99 }),
    (s) => s.ledger.ration.initial++,
    (s) => (s.nextId = 1),
    (s) => (s.schemaVersion = 2),
    (s) => (s.secret = 1),
    (s) => (s.agents[0].body.energy = -1),
    (s) => (s.config.maxLots = 17),
  ];
  for (const corrupt of bad) {
    const b = JSON.parse(text);
    corrupt(b);
    assert.throws(() => S.deserialize(JSON.stringify(b)));
    assert.equal(S.serialize(s), text);
  }
  const stale = JSON.parse(text);
  stale.agents[0].knowledge[0].observedLotIds = [50];
  stale.agents[0].knowledge[0].observedQuantity = 1;
  assert.throws(() => S.deserialize(JSON.stringify(stale)), /nextId/);
  assert.throws(() => S.deserialize("{ broken"));
  assert.throws(() => S.deserialize("x".repeat(2000001)));
});
function saturated() {
  return W.createLab({
    agents: [{ pos: 40 }, { pos: 40 }],
    sources: Array.from({ length: 16 }, (_, i) => ({
      cellId: i === 0 ? 40 : i,
      quantity: i === 0 ? 2 : 1,
    })),
  });
}
test("T10 saturation réelle : split 16→17 refusé sans effet", () => {
  const s = saturated();
  refusedWithoutMutation(s, transfer(), "CAPACITY");
  assert.equal(s.entities.length, 16);
});
test("T10-a transfert total à 16 conserve ID, compte et nextId", () => {
  const s = saturated(),
    nextId = s.nextId;
  assert.equal(A.executeCommand(s, transfer(1, 1, 40, 2)).causeCode, "SUCCESS");
  assert.equal(s.entities.length, 16);
  assert.equal(s.nextId, nextId);
  assert.equal(s.entities.find((e) => e.id === 1).location.holderAgentId, 1);
});
test("T11 coût causal : MOVE -1, REST +6 plafonné, faim +2 distincte", () => {
  const s = local();
  s.agents[0].body.energy = 98;
  commandTick(s, { type: "MOVE", actorId: 1, toCellId: 41 });
  assert.equal(s.agents[0].body.energy, 97);
  assert.equal(s.agents[0].body.hunger, 62);
  commandTick(s, { type: "REST", actorId: 1 });
  assert.equal(s.agents[0].body.energy, 100);
  assert.equal(s.agents[0].body.hunger, 64);
});
test("T12 inspection pure : raison de choix distincte du refus, aucun effet de lecture", () => {
  const s = local(1);
  W.stepLab(s);
  const loser = s.agents.find((a) => a.lastResult.causeCode === "EMPTY");
  assert.match(loser.lastDecision.reason, /personnellement observée/);
  assert.equal(loser.lastResult.outcome, "failure");
  const text = S.serialize(s);
  const inspect = W.inspect(s);
  inspect.world.agents[0].pos = 99;
  W.observeAgent(s, 1);
  assert.equal(S.serialize(s), text);
});
test("T13 indépendance : index et sauvegardes main non sollicités", () => {
  assert.equal(
    fs.readFileSync("index.html", "utf8").includes("material-"),
    false,
  );
  const keys = [],
    storage = {
      getItem(k) {
        keys.push(k);
        return null;
      },
      setItem(k) {
        keys.push(k);
      },
    };
  S.load(storage);
  S.save(storage, local());
  assert.deepEqual(keys, [S.KEY, S.KEY]);
});
test("T14 stockage bloqué : état jouable/exportable et avertissement", () => {
  const storage = {
    getItem() {
      throw Error("interdit");
    },
    setItem() {
      throw Error("quota");
    },
  };
  assert.equal(S.load(storage).blocked, true);
  const s = local();
  W.stepLab(s);
  assert.equal(S.save(storage, s).ok, false);
  assert.deepEqual(S.deserialize(S.serialize(s)), s);
});
test("T22-a énergie 0 : TRANSFER NO_CAPACITY avant portée/source/capacité, aucune mutation", () => {
  const s = local(2);
  s.agents[0].body.energy = 0;
  s.agents[0].body.hunger = 10;
  refusedWithoutMutation(s, transfer(), "NO_CAPACITY");
  assert.equal(s.agents[0].body.energy, 0);
  assert.equal(s.entities[0].quantity, 2);
  const next = local(2);
  next.agents[0].body.energy = 0;
  next.agents[0].body.hunger = 10;
  W.stepLab(next);
  assert.equal(next.agents[0].body.hunger, 12);
  const remote = local(2);
  remote.nextId = 901;
  remote.agents[0].body.energy = 0;
  refusedWithoutMutation(remote, transfer(1, 900, 0), "NO_CAPACITY");
});
test("T22-b énergie 1 : succès sans clamp, source1/porté1, exactement un ID", () => {
  const s = local(2);
  s.agents[0].body.energy = 1;
  const id = s.nextId;
  const result = A.executeCommand(s, transfer());
  assert.equal(result.causeCode, "SUCCESS");
  assert.equal(s.agents[0].body.energy, 0);
  assert.equal(s.entities[0].quantity, 1);
  assert.equal(carried(s, 1), 1);
  assert.equal(s.nextId, id + 1);
});
function cycles(restoreAt = null) {
  let s = local(40);
  const ids = [];
  for (let n = 1; n <= 20; n++) {
    assert.equal(commandTick(s, transfer()).causeCode, "SUCCESS");
    assert.equal(s.entities.length, 2);
    const id = W.inventory(s, 1)[0].id;
    ids.push(id);
    if (restoreAt === "transfer11" && n === 11)
      s = S.deserialize(S.serialize(s));
    assert.equal(
      commandTick(s, { type: "INGEST", actorId: 1, lotId: id }).causeCode,
      "SUCCESS",
    );
    assert.equal(s.entities.length, 1);
    if (restoreAt === "ingest11" && n === 11) s = S.deserialize(S.serialize(s));
  }
  return { s, ids };
}
test("T23-a 20 cycles réels : aucun lot vide/saturation/réemploi, énergie80", () => {
  const { s, ids } = cycles();
  assert.equal(s.entities[0].quantity, 20);
  assert.equal(s.ledger.ration.consumed, 20);
  assert.equal(s.agents[0].body.energy, 80);
  assert.equal(carried(s, 1), 0);
  assert.equal(new Set(ids).size, 20);
  assert.equal(s.nextId, 22);
  assert.equal(s.recentEvents.at(-1).delta.lots[0].removed, true);
});
test("T23-b reprise après transfert11 et ingestion11 identique au parcours continu", () => {
  assert.deepEqual(cycles("transfer11"), cycles());
  assert.deepEqual(cycles("ingest11"), cycles());
});
test("T23-c souvenir périmé admis sans résurrection, correction seulement locale", () => {
  const s = local(1);
  const b = s.agents[1];
  perceive(s, 2);
  b.intention = {
    id: "old",
    task: "acquire",
    targetCellId: 40,
    targetLotId: 1,
    status: "active",
    reason: "Source connue",
  };
  b.plan = [transfer(2)];
  b.pos = 0;
  commandTick(s, transfer());
  commandTick(s, { type: "INGEST", actorId: 1, lotId: 1 });
  assert.equal(s.entities.length, 0);
  const resumed = S.deserialize(S.serialize(s)),
    rb = resumed.agents[1];
  assert.equal(rb.intention.targetLotId, 1);
  assert.equal(rb.knowledge.find((k) => k.cellId === 40).observedQuantity, 1);
  rb.pos = 40;
  perceive(resumed, 2);
  const k = rb.knowledge.find((k) => k.cellId === 40);
  assert.equal(k.observedQuantity, 0);
  assert.deepEqual(k.observedLotIds, []);
  assert.equal(k.observedRevision, resumed.cells[40].resourceRevision);
  assert.equal(rb.intention.status, "failed");
  assert.deepEqual(rb.plan, []);
  W.stepLab(resumed);
  assert.notEqual(resumed.agents[1].intention.targetLotId, 1);
});
test("T23-d commande périmée : local EMPTY, distant NOT_REACHABLE sans révélation", () => {
  const localWorld = local(1);
  A.executeCommand(localWorld, transfer());
  refusedWithoutMutation(localWorld, transfer(2), "EMPTY");
  const remote = local(1);
  remote.agents[1].pos = 0;
  A.executeCommand(remote, transfer());
  const r = refusedWithoutMutation(remote, transfer(2), "NOT_REACHABLE");
  assert.deepEqual(r.checkedRevisions, []);
});
test("T23-e observations/journal/plans bornés après 300 ticks et export/reprise", () => {
  const s = local(40);
  for (let i = 0; i < 300; i++) W.stepLab(s);
  assert.equal(s.recentEvents.length, 256);
  for (const a of s.agents) {
    assert.ok(a.knowledge.length <= 108);
    assert.equal(
      new Set(a.knowledge.map((k) => k.cellId)).size,
      a.knowledge.length,
    );
    assert.ok(a.knowledge.every((k) => k.observedLotIds.length <= 16));
    assert.ok(a.plan.length <= 3);
    assert.deepEqual(a.practicalTraces, []);
  }
  assert.equal(Object.hasOwn(s, "removedLots"), false);
  assert.deepEqual(S.deserialize(S.serialize(s)), s);
});
test("Garde-fous : une primitive/tick, IDs/révisions sûrs et dépôt local conservatif", () => {
  const s = local();
  A.executeCommand(s, transfer());
  const before = S.serialize(s);
  assert.equal(
    A.executeCommand(s, { type: "REST", actorId: 1 }).causeCode,
    "INVALID",
  );
  assert.equal(S.serialize(s), before);
  const max = local();
  max.nextId = Number.MAX_SAFE_INTEGER;
  refusedWithoutMutation(max, transfer(), "CAPACITY");
  const revision = local();
  revision.cells[40].resourceRevision = Number.MAX_SAFE_INTEGER;
  refusedWithoutMutation(revision, transfer(), "CAPACITY");
  const drop = local(1);
  commandTick(drop, transfer());
  commandTick(drop, { type: "MOVE", actorId: 1, toCellId: 41 });
  const n = drop.nextId;
  commandTick(drop, {
    type: "TRANSFER",
    actorId: 1,
    lotId: 1,
    source: { holderAgentId: 1 },
    destination: { cellId: 41 },
    quantity: 1,
  });
  assert.equal(drop.entities[0].location.cellId, 41);
  assert.equal(drop.nextId, n);
  assert.equal(drop.cells[41].resourceRevision, 1);
});

test("Commandes externes malformées : refus sérialisable, aucune publication partielle", () => {
  const s = local();
  const before = S.serialize(s);
  assert.equal(
    A.executeCommand(s, { type: "REST", actorId: 99 }).causeCode,
    "INVALID",
  );
  assert.equal(S.serialize(s), before);
  const r = A.executeCommand(s, transfer(1, 999));
  assert.equal(r.causeCode, "INVALID");
  assert.equal(r.command, null);
  W.validateState(s);
  assert.deepEqual(S.deserialize(S.serialize(s)), s);
  const out = local();
  refusedWithoutMutation(
    out,
    { type: "MOVE", actorId: 1, toCellId: 108 },
    "OUT_OF_BOUNDS",
  );
});
