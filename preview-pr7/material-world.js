/* I1 experimental material world. No imports from the application engine. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object") module.exports = api;
  else root.MaterialWorld = api;
})(globalThis, function () {
  "use strict";
  const CONFIG = Object.freeze({
    width: 12,
    height: 9,
    agents: 2,
    maxLots: 16,
    capacity: 4,
    vision: 2,
    moveCost: 1,
    transferCost: 1,
    intake: 38,
    rest: 6,
    hungerPerTick: 2,
    maxEnergy: 100,
    maxHunger: 130,
    maxEvents: 256,
  });
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const distance = (a, b) =>
    Math.abs((a % 12) - (b % 12)) +
    Math.abs(Math.floor(a / 12) - Math.floor(b / 12));
  const cellId = (n) => Number.isSafeInteger(n) && n >= 0 && n < 108;
  function check(ok, message) {
    if (!ok) throw new Error(message);
  }
  function integer(n, min = 0, max = Number.MAX_SAFE_INTEGER) {
    return Number.isSafeInteger(n) && n >= min && n <= max;
  }
  function shape(o, keys, label) {
    check(
      o && typeof o === "object" && !Array.isArray(o),
      label + ": objet attendu",
    );
    check(
      Object.keys(o).every((k) => keys.includes(k)),
      label + ": champ inconnu",
    );
    check(
      keys.every((k) => Object.hasOwn(o, k)),
      label + ": champ manquant",
    );
  }
  function location(l, agents) {
    check(l && Object.keys(l).length === 1, "emplacement unique requis");
    if (Object.hasOwn(l, "cellId")) check(cellId(l.cellId), "cellule invalide");
    else
      check(
        Object.hasOwn(l, "holderAgentId") &&
          agents.some((a) => a.id === l.holderAgentId),
        "porteur orphelin",
      );
  }
  function command(c) {
    check(c && typeof c === "object" && !Array.isArray(c), "commande invalide");
    const fields = {
      MOVE: ["type", "actorId", "toCellId"],
      TRANSFER: [
        "type",
        "actorId",
        "lotId",
        "source",
        "destination",
        "quantity",
      ],
      INGEST: ["type", "actorId", "lotId"],
      REST: ["type", "actorId"],
    };
    check(Object.hasOwn(fields, c.type), "primitive I1 inconnue");
    shape(c, fields[c.type], "commande");
    check(integer(c.actorId, 1), "acteur invalide");
    if (c.type === "MOVE")
      check(Number.isSafeInteger(c.toCellId), "destination non entière");
    if (c.type === "INGEST" || c.type === "TRANSFER")
      check(integer(c.lotId, 1), "lot invalide");
    if (c.type === "TRANSFER") {
      check(integer(c.quantity, 1), "quantité invalide");
      for (const l of [c.source, c.destination])
        location(l, [{ id: c.actorId }]);
    }
  }
  function intention(i) {
    if (i === null) return;
    shape(
      i,
      ["id", "task", "targetCellId", "targetLotId", "status", "reason"],
      "intention",
    );
    check(typeof i.id === "string" && i.id.length <= 80, "id intention");
    check(
      ["acquire", "eat", "rest", "explore"].includes(i.task),
      "tâche inconnue",
    );
    check(cellId(i.targetCellId), "cible intention");
    check(
      i.targetLotId === null || integer(i.targetLotId, 1),
      "référence de lot",
    );
    check(
      ["active", "completed", "failed"].includes(i.status),
      "statut intention",
    );
    check(
      typeof i.reason === "string" && i.reason.length <= 300,
      "raison intention",
    );
  }
  function appendEvent(s, event) {
    s.recentEvents.push(clone(event));
    if (s.recentEvents.length > 256)
      s.recentEvents.splice(0, s.recentEvents.length - 256);
  }
  function rng(s) {
    let x = s.rngState;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    s.rngState = x >>> 0;
    return s.rngState / 4294967296;
  }
  function createLab(options = {}, seed = 1) {
    check(
      Object.keys(options).every((k) => ["sources", "agents"].includes(k)),
      "configuration initiale inconnue",
    );
    check(integer(seed, 1, 4294967295), "seed entier non nul requis");
    const sources = options.sources ?? [{ cellId: 40, quantity: 12 }];
    const agents = options.agents ?? [
      { pos: 39, hunger: 60, energy: 75 },
      { pos: 41, hunger: 60, energy: 75 },
    ];
    const state = {
      schemaVersion: 1,
      tick: 0,
      nextId: 1,
      seed,
      rngState: seed,
      config: { ...CONFIG },
      cells: Array.from({ length: 108 }, (_, id) => ({
        id,
        basePassable: true,
        resourceRevision: 0,
      })),
      entities: [],
      agents: agents.map((a, i) => ({
        id: i + 1,
        pos: a.pos,
        body: { hunger: a.hunger ?? 60, energy: a.energy ?? 75 },
        knowledge: [],
        intention: null,
        plan: [],
        practicalTraces: [],
        lastDecision: null,
        lastResult: null,
        lastActedTick: -1,
      })),
      projects: [],
      ledger: {
        ration: { initial: 0, divineAdded: 0, divineRemoved: 0, consumed: 0 },
      },
      recentEvents: [],
    };
    for (const source of sources) {
      shape(source, ["cellId", "quantity"], "source");
      state.entities.push({
        id: state.nextId++,
        material: "ration",
        quantity: source.quantity,
        location: { cellId: source.cellId },
        unitMass: 1,
        blocking: false,
        revision: 0,
        lastChange: null,
      });
      state.ledger.ration.initial += source.quantity;
    }
    validateState(state);
    return state;
  }
  function inventory(s, id) {
    return s.entities.filter((e) => e.location.holderAgentId === id);
  }
  function observeAgent(s, id) {
    const a = s.agents.find((a) => a.id === id);
    check(a, "acteur inconnu");
    const knowledge = clone(a.knowledge);
    for (const cell of s.cells)
      if (distance(a.pos, cell.id) <= s.config.vision) {
        const lots = s.entities.filter((e) => e.location.cellId === cell.id);
        const observation = {
          cellId: cell.id,
          material: "ration",
          observedQuantity: lots.reduce((n, e) => n + e.quantity, 0),
          observedLotIds: lots.map((e) => e.id),
          observedAt: s.tick,
          observedRevision: cell.resourceRevision,
        };
        const i = knowledge.findIndex(
          (k) => k.cellId === cell.id && k.material === "ration",
        );
        if (i < 0) knowledge.push(observation);
        else knowledge[i] = observation;
      }
    let intent = clone(a.intention),
      plan = clone(a.plan);
    if (intent?.targetLotId !== null && intent) {
      const seen = knowledge.find(
        (k) => k.cellId === intent.targetCellId && k.observedAt === s.tick,
      );
      if (seen && !seen.observedLotIds.includes(intent.targetLotId)) {
        intent.status = "failed";
        plan = [];
      }
    }
    return clone({
      id: a.id,
      pos: a.pos,
      body: a.body,
      inventory: inventory(s, id),
      knowledge,
      intention: intent,
      plan,
      lastResult: a.lastResult,
      tick: s.tick,
      config: s.config,
    });
  }
  function stepLab(s) {
    validateState(s);
    check(s.tick < Number.MAX_SAFE_INTEGER, "limite tick atteinte");
    // Work on a copy so even unexpected exceptions publish no partial tick.
    const next = clone(s);
    next.tick++;
    for (const a of next.agents) {
      const before = a.body.hunger;
      a.body.hunger = Math.min(130, before + 2);
      appendEvent(next, {
        id: next.tick + ":body:" + a.id,
        tick: next.tick,
        actorId: a.id,
        type: "EXPOSURE",
        before,
        after: a.body.hunger,
        causeCode: "HUNGER_TICK",
      });
    }
    const views = next.agents.map((a) => observeAgent(next, a.id));
    const cognition =
      typeof module === "object"
        ? require("./material-cognition.js")
        : globalThis.MaterialCognition;
    const actions =
      typeof module === "object"
        ? require("./material-actions.js")
        : globalThis.MaterialActions;
    const commands = views
      .map((view) => {
        const a = next.agents.find((a) => a.id === view.id),
          decision = cognition.decideAgent(view, () => rng(next));
        a.knowledge = clone(view.knowledge);
        a.intention = decision.intention;
        a.plan = decision.plan;
        a.lastDecision = {
          tick: next.tick,
          reason: decision.reason,
          command: clone(decision.command),
        };
        return decision.command;
      })
      .sort((a, b) => a.actorId - b.actorId);
    const start = next.tick % commands.length;
    for (let i = 0; i < commands.length; i++) {
      const cmd = commands[(i + start) % commands.length],
        result = actions.executeCommand(next, cmd);
      const a = next.agents.find((a) => a.id === cmd.actorId);
      if (result.outcome === "failure") {
        if (a.intention) a.intention.status = "failed";
        a.plan = [];
      } else if (cmd.type !== "MOVE") {
        if (a.intention) a.intention.status = "completed";
        a.plan = [];
      }
    }
    validateState(next);
    Object.assign(s, next);
    return s;
  }
  function validateState(s) {
    shape(
      s,
      [
        "schemaVersion",
        "tick",
        "nextId",
        "seed",
        "rngState",
        "config",
        "cells",
        "entities",
        "agents",
        "projects",
        "ledger",
        "recentEvents",
      ],
      "monde",
    );
    check(s.schemaVersion === 1, "version de schéma non supportée");
    check(
      integer(s.tick) &&
        integer(s.nextId, 1) &&
        integer(s.seed, 1, 4294967295) &&
        integer(s.rngState, 1, 4294967295),
      "horloge/identifiants/RNG invalides",
    );
    shape(s.config, Object.keys(CONFIG), "configuration");
    for (const k of Object.keys(CONFIG))
      check(s.config[k] === CONFIG[k], "paramètre I1 invalide: " + k);
    check(
      Array.isArray(s.cells) && s.cells.length === 108,
      "108 cellules requises",
    );
    s.cells.forEach((c, i) => {
      shape(c, ["id", "basePassable", "resourceRevision"], "cellule");
      check(
        c.id === i && c.basePassable === true && integer(c.resourceRevision),
        "cellule I1 invalide",
      );
    });
    check(
      Array.isArray(s.agents) && s.agents.length === 2,
      "deux habitants requis",
    );
    const ids = new Set();
    for (const a of s.agents) {
      shape(
        a,
        [
          "id",
          "pos",
          "body",
          "knowledge",
          "intention",
          "plan",
          "practicalTraces",
          "lastDecision",
          "lastResult",
          "lastActedTick",
        ],
        "habitant",
      );
      check(
        integer(a.id, 1, 2) && !ids.has(a.id) && cellId(a.pos),
        "identité/position habitant invalide",
      );
      ids.add(a.id);
      shape(a.body, ["hunger", "energy"], "corps");
      check(
        integer(a.body.hunger, 0, 130) && integer(a.body.energy, 0, 100),
        "corps hors bornes",
      );
      check(integer(a.lastActedTick, -1, s.tick), "frontière action invalide");
      check(
        Array.isArray(a.knowledge) && a.knowledge.length <= 108,
        "mémoire hors borne",
      );
      const seen = new Set();
      for (const k of a.knowledge) {
        shape(
          k,
          [
            "cellId",
            "material",
            "observedQuantity",
            "observedLotIds",
            "observedAt",
            "observedRevision",
          ],
          "observation",
        );
        check(
          cellId(k.cellId) && k.material === "ration" && !seen.has(k.cellId),
          "observation dupliquée/invalide",
        );
        seen.add(k.cellId);
        check(
          integer(k.observedQuantity) &&
            integer(k.observedAt, 0, s.tick) &&
            integer(k.observedRevision),
          "observation numérique invalide",
        );
        check(
          Array.isArray(k.observedLotIds) &&
            k.observedLotIds.length <= 16 &&
            new Set(k.observedLotIds).size === k.observedLotIds.length &&
            k.observedLotIds.every((n) => integer(n, 1)),
          "lots observés invalides",
        );
        check(
          (k.observedQuantity === 0) === (k.observedLotIds.length === 0),
          "observation vide incohérente",
        );
      }
      intention(a.intention);
      check(Array.isArray(a.plan) && a.plan.length <= 3, "plan hors borne");
      a.plan.forEach(command);
      check(
        Array.isArray(a.practicalTraces) && a.practicalTraces.length === 0,
        "traces C3 exclues",
      );
      if (a.lastDecision !== null) {
        shape(a.lastDecision, ["tick", "reason", "command"], "décision");
        check(
          integer(a.lastDecision.tick, 0, s.tick) &&
            typeof a.lastDecision.reason === "string" &&
            a.lastDecision.reason.length <= 300,
          "décision invalide",
        );
        command(a.lastDecision.command);
        check(
          a.lastDecision.command.actorId === a.id,
          "décision d’un autre acteur",
        );
      }
    }
    check(
      Array.isArray(s.entities) && s.entities.length <= 16,
      "capacité lots dépassée",
    );
    const lots = new Set();
    let total = 0;
    for (const e of s.entities) {
      shape(
        e,
        [
          "id",
          "material",
          "quantity",
          "location",
          "unitMass",
          "blocking",
          "revision",
          "lastChange",
        ],
        "lot",
      );
      check(integer(e.id, 1) && !lots.has(e.id), "ID lot dupliqué/invalide");
      lots.add(e.id);
      check(
        e.material === "ration" &&
          integer(e.quantity, 1) &&
          e.unitMass === 1 &&
          e.blocking === false &&
          integer(e.revision),
        "lot I1 invalide",
      );
      location(e.location, s.agents);
      total += e.quantity;
      check(integer(total), "somme matérielle non sûre");
      if (e.lastChange !== null) {
        shape(e.lastChange, ["eventId", "causeCode"], "cause du lot");
        check(
          typeof e.lastChange.eventId === "string" &&
            e.lastChange.eventId.length <= 100 &&
            e.lastChange.causeCode === "SUCCESS",
          "cause du lot invalide",
        );
      }
    }
    for (const a of s.agents)
      check(
        inventory(s, a.id).reduce((n, e) => n + e.quantity, 0) <= 4,
        "capacité portée dépassée",
      );
    check(
      Array.isArray(s.projects) && s.projects.length === 0,
      "projets exclus de I1",
    );
    shape(s.ledger, ["ration"], "ledger");
    shape(
      s.ledger.ration,
      ["initial", "divineAdded", "divineRemoved", "consumed"],
      "ledger ration",
    );
    const l = s.ledger.ration;
    check(
      Object.values(l).every((n) => integer(n)),
      "ledger invalide",
    );
    check(
      l.divineAdded === 0 && l.divineRemoved === 0,
      "édition divine exclue de I1",
    );
    check(
      integer(total + l.consumed) && total + l.consumed === l.initial,
      "bilan matériel faux",
    );
    check(
      Array.isArray(s.recentEvents) && s.recentEvents.length <= 256,
      "journal hors borne",
    );
    const eventIds = new Set();
    for (const event of s.recentEvents) {
      validateEvent(event, s.tick);
      check(!eventIds.has(event.id), "événement dupliqué");
      eventIds.add(event.id);
    }
    for (const a of s.agents)
      if (a.lastResult !== null) {
        validateEvent(a.lastResult, s.tick);
        check(
          a.lastResult.actorId === a.id &&
            a.lastResult.type === undefined &&
            a.lastResult.tick === a.lastActedTick,
          "résultat acteur invalide",
        );
      }
    // Historical IDs may be stale; they must still precede the persisted counter.
    let maxId = Math.max(0, ...lots);
    function refs(value, key = "") {
      if (key === "lotId" || key === "targetLotId") {
        if (value !== null) {
          check(integer(value, 1), "référence de lot invalide");
          maxId = Math.max(maxId, value);
        }
        return;
      }
      if (key === "observedLotIds") {
        value.forEach((id) => {
          maxId = Math.max(maxId, id);
        });
        return;
      }
      if (value && typeof value === "object")
        for (const [k, v] of Object.entries(value)) refs(v, k);
    }
    refs(s.agents);
    refs(s.recentEvents);
    check(s.nextId > maxId, "nextId doit dépasser les IDs actifs et mémorisés");
    return true;
  }
  function validateEvent(e, tick) {
    if (e?.type === "EXPOSURE") {
      shape(
        e,
        ["id", "tick", "actorId", "type", "before", "after", "causeCode"],
        "exposition",
      );
      check(
        integer(e.before, 0, 130) &&
          e.after === Math.min(130, e.before + 2) &&
          e.causeCode === "HUNGER_TICK",
        "exposition invalide",
      );
    } else {
      shape(
        e,
        [
          "id",
          "tick",
          "actorId",
          "intentId",
          "command",
          "outcome",
          "causeCode",
          "checkedRevisions",
          "delta",
          "cost",
          "causalParents",
        ],
        "résultat",
      );
      check(
        e.command === null || typeof e.command === "object",
        "commande résultat",
      );
      if (e.command !== null) command(e.command);
      check(
        ["success", "failure"].includes(e.outcome) &&
          [
            "SUCCESS",
            "INVALID",
            "NO_CAPACITY",
            "NOT_REACHABLE",
            "EMPTY",
            "INCOMPATIBLE",
            "CAPACITY",
            "BLOCKED",
            "OUT_OF_BOUNDS",
            "CONFLICT",
          ].includes(e.causeCode),
        "cause résultat invalide",
      );
      check(
        (e.outcome === "success") === (e.causeCode === "SUCCESS"),
        "issue contradictoire",
      );
      check(
        e.intentId === null ||
          (typeof e.intentId === "string" && e.intentId.length <= 80),
        "intention résultat invalide",
      );
      shape(e.cost, ["energy"], "coût");
      check(integer(e.cost.energy, 0, 1), "coût invalide");
      check(
        Array.isArray(e.checkedRevisions) && e.checkedRevisions.length <= 3,
        "révisions hors borne",
      );
      e.checkedRevisions.forEach((r) => {
        shape(r, ["kind", "id", "revision"], "révision");
        check(
          ["cell", "lot"].includes(r.kind) &&
            integer(r.id) &&
            integer(r.revision),
          "révision invalide",
        );
      });
      check(
        Array.isArray(e.causalParents) &&
          e.causalParents.length <= 2 &&
          e.causalParents.every(
            (p) => typeof p === "string" && p.length <= 100,
          ),
        "parents invalides",
      );
      shape(e.delta, ["lots", "position", "body", "consumed"], "delta");
      check(
        Array.isArray(e.delta.lots) && e.delta.lots.length <= 2,
        "delta lots invalide",
      );
      e.delta.lots.forEach((d) => {
        shape(
          d,
          [
            "lotId",
            "beforeQuantity",
            "afterQuantity",
            "from",
            "to",
            "removed",
            "created",
          ],
          "delta lot",
        );
        check(
          integer(d.lotId, 1) &&
            integer(d.beforeQuantity) &&
            integer(d.afterQuantity) &&
            typeof d.removed === "boolean" &&
            typeof d.created === "boolean",
          "delta lot invalide",
        );
        for (const loc of [d.from, d.to])
          if (loc !== null) location(loc, [{ id: 1 }, { id: 2 }]);
      });
      if (e.delta.position !== null) {
        shape(e.delta.position, ["from", "to"], "déplacement");
        check(
          cellId(e.delta.position.from) && cellId(e.delta.position.to),
          "delta position invalide",
        );
      }
      check(
        Array.isArray(e.delta.body) && e.delta.body.length <= 2,
        "delta corps invalide",
      );
      e.delta.body.forEach((d) => {
        shape(d, ["field", "before", "after"], "delta corps");
        check(
          ["energy", "hunger"].includes(d.field) &&
            integer(d.before, 0, d.field === "energy" ? 100 : 130) &&
            integer(d.after, 0, d.field === "energy" ? 100 : 130),
          "delta corps invalide",
        );
      });
      check(integer(e.delta.consumed, 0, 1), "delta ingestion invalide");
      if (e.outcome === "failure")
        check(
          e.cost.energy === 0 &&
            e.delta.lots.length === 0 &&
            e.delta.position === null &&
            e.delta.body.length === 0 &&
            e.delta.consumed === 0,
          "échec non atomique",
        );
    }
    check(
      typeof e.id === "string" &&
        e.id.length <= 100 &&
        integer(e.tick, 0, tick) &&
        integer(e.actorId, 1, 2),
      "événement invalide",
    );
  }
  function inspect(s) {
    validateState(s);
    return clone({
      world: s,
      balance: {
        current: s.entities.reduce((n, e) => n + e.quantity, 0),
        consumed: s.ledger.ration.consumed,
        initial: s.ledger.ration.initial,
      },
      historyNote:
        "Les parents purgés du journal : détail historique non conservé.",
    });
  }
  return {
    CONFIG,
    clone,
    distance,
    cellId,
    integer,
    check,
    command,
    validateState,
    appendEvent,
    rng,
    createLab,
    inventory,
    observeAgent,
    stepLab,
    inspect,
  };
});
