/* V1 adapters, isolated from the historical app and from the unchanged I1 lab. */
(function (root, factory) {
  const api = factory(
    typeof module === "object"
      ? require("./material-world.js")
      : root.MaterialWorld,
    typeof module === "object"
      ? require("./material-actions.js")
      : root.MaterialActions,
  );
  if (typeof module === "object") module.exports = api;
  else root.MicrocosmeV1 = api;
})(globalThis, function (W, A) {
  "use strict";
  const copy = W.clone,
    check = W.check,
    LIMIT = 512;
  const kinds = [
    "M1",
    "M2",
    "M3",
    "EVALUATE",
    "DECIDE",
    "ATTEMPT",
    "RESULT",
    "M6",
  ];
  function shape(o, keys) {
    check(
      o &&
        typeof o === "object" &&
        !Array.isArray(o) &&
        Object.keys(o).length === keys.length &&
        keys.every((k) => Object.hasOwn(o, k)),
      "Schéma V1 invalide",
    );
  }
  function create(options = {}, seed = 7) {
    const s = {
      version: "microcosme-six-1",
      world: W.createLab(options, seed),
      minds: [1, 2].map((actorId) => ({
        actorId,
        beliefs: [],
        preferences: [],
        lastLearning: null,
      })),
      nextEvent: 1,
      trace: [],
    };
    validate(s);
    return s;
  }
  // M1 owns only the experimental body's exposure. It never chooses.
  function regulate(body) {
    return { hunger: Math.min(130, body.hunger + 2), energy: body.energy };
  }
  // M2 copies accessible signals only; hidden world entities never leave here.
  function perceive(world, actorId, external = true) {
    const local = copy(world),
      a = local.agents.find((a) => a.id === actorId);
    a.knowledge = [];
    a.intention = null;
    a.plan = [];
    const view = W.observeAgent(local, actorId);
    return {
      actorId,
      tick: world.tick,
      pos: view.pos,
      body: view.body,
      inventory: view.inventory,
      observations: external ? view.knowledge : [],
      external,
    };
  }
  // M3 interprets temporary observations and acquired beliefs without consolidating.
  function understand(signals, memory) {
    const beliefs = copy(memory.beliefs);
    for (const o of signals.observations) {
      const i = beliefs.findIndex((b) => b.cellId === o.cellId);
      const b = { ...copy(o), evidence: signals.eventId };
      if (i < 0) beliefs.push(b);
      else beliefs[i] = b;
    }
    return {
      ...copy(signals),
      beliefs,
      hypotheses: beliefs
        .filter((b) => b.observedQuantity > 0)
        .map((b) => ({
          cellId: b.cellId,
          lotId: b.observedLotIds[0],
          observedAt: b.observedAt,
          evidence: b.evidence,
          uncertainty:
            b.observedAt < signals.tick
              ? "souvenir non revérifié"
              : "observation avant actions",
        })),
      preferences: copy(memory.preferences),
    };
  }
  // M4 EVALUATE: all factors used by DECIDE are captured before any effect.
  function evaluate(v) {
    const food = v.inventory.reduce((n, e) => n + e.quantity, 0);
    const options = [];
    const add = (
      task,
      target,
      lot,
      command,
      base,
      experience = 0,
      evidence = [],
    ) => {
      options.push({
        task,
        target,
        lot,
        command,
        base,
        experience,
        score: base + experience,
        evidence,
      });
    };
    add(
      "rest",
      v.pos,
      null,
      { type: "REST", actorId: v.actorId },
      v.body.energy < 3 ? 1000 : -100,
    );
    if (food && v.body.hunger >= 45)
      add(
        "eat",
        v.pos,
        v.inventory[0].id,
        { type: "INGEST", actorId: v.actorId, lotId: v.inventory[0].id },
        2000,
      );
    if (food < 2 && food < 4)
      for (const h of v.hypotheses) {
        const preference = v.preferences.find((p) => p.cellId === h.cellId);
        const target = h.cellId;
        const toCellId =
          v.pos % 12 !== target % 12
            ? v.pos + Math.sign((target % 12) - (v.pos % 12))
            : v.pos +
              12 * Math.sign(Math.floor(target / 12) - Math.floor(v.pos / 12));
        const command =
          v.pos === target
            ? {
                type: "TRANSFER",
                actorId: v.actorId,
                lotId: h.lotId,
                source: { cellId: target },
                destination: { holderAgentId: v.actorId },
                quantity: 1,
              }
            : { type: "MOVE", actorId: v.actorId, toCellId };
        add(
          "acquire",
          target,
          h.lotId,
          command,
          100 - W.distance(v.pos, target),
          preference?.value ?? 0,
          [h.evidence, ...(preference ? [preference.evidence] : [])],
        );
      }
    for (const target of [
      v.pos % 12 ? v.pos - 1 : -1,
      v.pos % 12 < 11 ? v.pos + 1 : -1,
      v.pos - 12,
      v.pos + 12,
    ].filter(W.cellId)) {
      const age = v.beliefs.find((b) => b.cellId === target)?.observedAt ?? -1;
      add(
        "explore",
        target,
        null,
        { type: "MOVE", actorId: v.actorId, toCellId: target },
        age < 0 ? 10 : Math.min(9, v.tick - age),
      );
    }
    return {
      actorId: v.actorId,
      tick: v.tick,
      body: copy(v.body),
      food,
      options,
    };
  }
  // M4 DECIDE: uses exactly the recorded scores and controlled tie draw.
  function decide(evaluation, random) {
    const best = Math.max(...evaluation.options.map((o) => o.score));
    const tied = evaluation.options.filter((o) => o.score === best);
    const draw = tied.length > 1 ? random() : null;
    const chosen = copy(
      tied[draw === null ? 0 : Math.floor(draw * tied.length)],
    );
    return {
      chosen,
      draw,
      tied: tied.length,
      reason:
        chosen.task +
        " : score " +
        chosen.score +
        " = base " +
        chosen.base +
        " + expérience personnelle " +
        chosen.experience,
    };
  }
  // M6 owns consolidation and the bounded, revisable source preference.
  // A failure means this attempt failed, never that the entire distant cell is empty.
  function learn(memory, interpretation, result, eventId) {
    const next = copy(memory),
      changes = [];
    for (const o of interpretation.observations) {
      const b = { ...copy(o), evidence: interpretation.eventId };
      const i = next.beliefs.findIndex((b) => b.cellId === o.cellId);
      if (i < 0) next.beliefs.push(b);
      else next.beliefs[i] = b;
    }
    if (
      result?.command?.type === "TRANSFER" &&
      result.command.source.cellId !== undefined
    ) {
      const cellId = result.command.source.cellId;
      const i = next.preferences.findIndex((p) => p.cellId === cellId);
      const before = i < 0 ? 0 : next.preferences[i].value;
      const after = Math.max(
        -6,
        Math.min(6, before + (result.outcome === "success" ? 4 : -6)),
      );
      const p = { cellId, value: after, evidence: eventId };
      if (i < 0) next.preferences.push(p);
      else next.preferences[i] = p;
      changes.push({ cellId, before, after, accessibleResult: result.id });
    }
    next.lastLearning = eventId;
    return { memory: next, changes };
  }
  function emit(s, kind, actorId, parents, data) {
    check(s.nextEvent < Number.MAX_SAFE_INTEGER, "Limite événements V1");
    const e = {
      id: "v1:" + s.nextEvent++,
      tick: s.world.tick,
      kind,
      actorId,
      parents: [...new Set(parents.filter(Boolean))],
      data: copy(data),
    };
    s.trace.push(e);
    if (s.trace.length > LIMIT) s.trace.splice(0, s.trace.length - LIMIT);
    return e.id;
  }
  // One *demonstration* scheduler. External perception and decisions can independently
  // skip an activation. No six-phase clock is required by the logical interfaces.
  function step(state, activation = {}) {
    validate(state);
    check(
      Object.keys(activation).every((k) =>
        ["perceiveIds", "decideIds"].includes(k),
      ),
      "Activation inconnue",
    );
    for (const ids of Object.values(activation))
      check(
        Array.isArray(ids) &&
          new Set(ids).size === ids.length &&
          ids.every((id) => id === 1 || id === 2),
        "Acteurs activation invalides",
      );
    const s = copy(state),
      w = s.world;
    check(w.tick < Number.MAX_SAFE_INTEGER, "Limite tick");
    w.tick++;
    const pending = [],
      perceptions = new Map();
    for (const a of w.agents) {
      const mind = s.minds.find((m) => m.actorId === a.id),
        before = copy(a.body);
      a.body = regulate(a.body);
      const previousResult = s.trace.findLast(
        (e) => e.kind === "RESULT" && e.actorId === a.id,
      );
      const bodyId = emit(s, "M1", a.id, [previousResult?.id], {
        before,
        after: a.body,
        trigger: "temps commun",
      });
      W.appendEvent(w, {
        id: w.tick + ":body:" + a.id,
        tick: w.tick,
        actorId: a.id,
        type: "EXPOSURE",
        before: before.hunger,
        after: a.body.hunger,
        causeCode: "HUNGER_TICK",
      });
      const signals = perceive(
        w,
        a.id,
        (activation.perceiveIds ?? [1, 2]).includes(a.id),
      );
      signals.eventId = emit(s, "M2", a.id, [bodyId], signals);
      perceptions.set(a.id, signals);
      if (!(activation.decideIds ?? [1, 2]).includes(a.id)) continue;
      const interpretation = understand(signals, mind);
      const interpretationId = emit(
        s,
        "M3",
        a.id,
        [signals.eventId, ...interpretation.hypotheses.map((h) => h.evidence)],
        interpretation,
      );
      const evaluation = evaluate(interpretation);
      const evaluationId = emit(
        s,
        "EVALUATE",
        a.id,
        [
          bodyId,
          interpretationId,
          ...evaluation.options.flatMap((o) => o.evidence),
        ],
        evaluation,
      );
      const decision = decide(evaluation, () => W.rng(w));
      const decisionId = emit(s, "DECIDE", a.id, [evaluationId], decision);
      const c = decision.chosen,
        old = a.intention;
      a.intention = {
        id:
          old?.status === "active" &&
          old.task === c.task &&
          old.targetCellId === c.target
            ? old.id
            : w.tick + ":intent:" + a.id,
        task: c.task,
        targetCellId: c.target,
        targetLotId: c.lot,
        status: "active",
        reason: decision.reason,
      };
      a.plan = [copy(c.command)];
      a.lastDecision = {
        tick: w.tick,
        reason: decision.reason,
        command: copy(c.command),
      };
      pending.push({ actorId: a.id, decisionId, command: c.command });
    }
    // Same rotating I1 arbitration; all choices precede the first transaction.
    pending.sort((a, b) => a.actorId - b.actorId);
    const offset = pending.length ? w.tick % pending.length : 0,
      results = new Map();
    for (let i = 0; i < pending.length; i++) {
      const p = pending[(i + offset) % pending.length];
      const attemptId = emit(s, "ATTEMPT", p.actorId, [p.decisionId], {
        command: p.command,
      });
      const result = A.executeCommand(w, p.command);
      const materialParents = result.causalParents.map(
        (id) =>
          s.trace.find((e) => e.kind === "RESULT" && e.data.id === id)?.id,
      );
      const resultId = emit(
        s,
        "RESULT",
        p.actorId,
        [attemptId, ...materialParents],
        result,
      );
      results.set(p.actorId, { result, resultId });
      // executeCommand publishes a copy: reacquire the actor reference after commit.
      const a = w.agents.find((a) => a.id === p.actorId);
      if (result.outcome === "failure" || p.command.type !== "MOVE") {
        a.intention.status =
          result.outcome === "failure" ? "failed" : "completed";
        a.plan = [];
      }
    }
    for (let i = 0; i < s.minds.length; i++) {
      const m = s.minds[i],
        signals = perceptions.get(m.actorId),
        r = results.get(m.actorId);
      const learningId = "v1:" + s.nextEvent;
      const learned = learn(m, signals, r?.result, learningId);
      emit(s, "M6", m.actorId, [signals.eventId, r?.resultId, m.lastLearning], {
        observations: signals.observations.length,
        changes: learned.changes,
        previousLearning: m.lastLearning,
      });
      s.minds[i] = learned.memory;
    }
    validate(s);
    Object.assign(state, s);
    return state;
  }
  function validate(s) {
    shape(s, ["version", "world", "minds", "nextEvent", "trace"]);
    check(s.version === "microcosme-six-1", "Version V1 non supportée");
    W.validateState(s.world);
    check(
      W.integer(s.nextEvent, 1) &&
        Array.isArray(s.trace) &&
        s.trace.length <= LIMIT,
      "Journal V1 invalide",
    );
    const refNumber = (id) =>
      typeof id === "string" && /^v1:[1-9]\d*$/.test(id)
        ? Number(id.slice(3))
        : NaN;
    const ref = (id) =>
      check(
        W.integer(refNumber(id), 1, s.nextEvent - 1),
        "Référence causale invalide",
      );
    let last = 0;
    const events = new Map();
    for (const e of s.trace) {
      shape(e, ["id", "tick", "kind", "actorId", "parents", "data"]);
      ref(e.id);
      check(
        refNumber(e.id) > last &&
          W.integer(e.tick, 1, s.world.tick) &&
          kinds.includes(e.kind) &&
          [1, 2].includes(e.actorId),
        "Événement V1 invalide",
      );
      last = refNumber(e.id);
      check(
        Array.isArray(e.parents) &&
          e.parents.length <= 220 &&
          new Set(e.parents).size === e.parents.length,
        "Parents invalides",
      );
      for (const id of e.parents) {
        ref(id);
        check(refNumber(id) < last, "Cause future ou cyclique");
      }
      check(
        e.data && typeof e.data === "object" && !Array.isArray(e.data),
        "Données causales invalides",
      );
      const schemas = {
        M1: ["before", "after", "trigger"],
        M2: [
          "actorId",
          "tick",
          "pos",
          "body",
          "inventory",
          "observations",
          "external",
        ],
        M3: [
          "actorId",
          "tick",
          "pos",
          "body",
          "inventory",
          "observations",
          "external",
          "eventId",
          "beliefs",
          "hypotheses",
          "preferences",
        ],
        EVALUATE: ["actorId", "tick", "body", "food", "options"],
        DECIDE: ["chosen", "draw", "tied", "reason"],
        ATTEMPT: ["command"],
        RESULT: [
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
        M6: ["observations", "changes", "previousLearning"],
      };
      shape(e.data, schemas[e.kind]);
      if (e.kind === "ATTEMPT") W.command(e.data.command);
      if (e.kind === "EVALUATE") {
        check(
          Array.isArray(e.data.options) &&
            e.data.options.length <= 110 &&
            e.data.options.length > 0,
          "Options invalides",
        );
        for (const o of e.data.options) {
          shape(o, [
            "task",
            "target",
            "lot",
            "command",
            "base",
            "experience",
            "score",
            "evidence",
          ]);
          W.command(o.command);
          check(
            Number.isSafeInteger(o.base) &&
              W.integer(o.experience, -6, 6) &&
              o.score === o.base + o.experience,
            "Score invalide",
          );
        }
      }
      if (e.kind === "DECIDE") {
        const evaluation = events.get(e.parents[0]);
        if (evaluation) {
          const options = evaluation.data.options,
            d = e.data;
          const tied = options.filter(
            (o) => o.score === Math.max(...options.map((o) => o.score)),
          );
          check(
            d.tied === tied.length &&
              (d.draw === null
                ? tied.length === 1
                : typeof d.draw === "number" && d.draw >= 0 && d.draw < 1),
            "Tirage invalide",
          );
          check(
            JSON.stringify(d.chosen) ===
              JSON.stringify(
                tied[d.draw === null ? 0 : Math.floor(d.draw * tied.length)],
              ),
            "Choix infidèle à l'évaluation",
          );
        }
      }
      events.set(e.id, e);
    }
    // Reuse I1's strict result validator, including failure deltas, costs and IDs.
    W.validateState({
      ...s.world,
      recentEvents: s.trace
        .filter((e) => e.kind === "RESULT")
        .map((e) => e.data),
    });
    for (const e of s.trace) {
      for (const id of e.parents) {
        const parent = events.get(id);
        if (parent) check(parent.tick <= e.tick, "Cause temporelle future");
      }
      if (e.kind === "M1")
        check(
          JSON.stringify(regulate(e.data.before)) ===
            JSON.stringify(e.data.after),
          "Régulation infidèle",
        );
      if (["M2", "M3", "EVALUATE"].includes(e.kind))
        check(
          e.data.actorId === e.actorId && e.data.tick === e.tick,
          "Provenance personnelle invalide",
        );
      if (e.kind === "RESULT")
        check(
          e.data.actorId === e.actorId && e.data.tick === e.tick,
          "Provenance résultat invalide",
        );
      if (e.kind === "M6") {
        check(
          W.integer(e.data.observations, 0, 108) &&
            Array.isArray(e.data.changes) &&
            e.data.changes.length <= 1,
          "Apprentissage invalide",
        );
        for (const c of e.data.changes) {
          shape(c, ["cellId", "before", "after", "accessibleResult"]);
          check(
            W.cellId(c.cellId) &&
              W.integer(c.before, -6, 6) &&
              W.integer(c.after, -6, 6),
            "Révision invalide",
          );
          const r = e.parents
            .map((id) => events.get(id))
            .find((p) => p?.kind === "RESULT");
          if (r)
            check(
              r.actorId === e.actorId &&
                r.data.id === c.accessibleResult &&
                r.data.command?.type === "TRANSFER" &&
                r.data.command.source.cellId === c.cellId &&
                c.after ===
                  Math.max(
                    -6,
                    Math.min(
                      6,
                      c.before + (r.data.outcome === "success" ? 4 : -6),
                    ),
                  ),
              "Apprentissage d'un résultat inaccessible",
            );
        }
      }
    }
    check(
      s.nextEvent === 1 ? s.trace.length === 0 : last === s.nextEvent - 1,
      "Compteur causal invalide",
    );
    check(
      Array.isArray(s.minds) && s.minds.length === 2,
      "Deux mémoires requises",
    );
    s.minds.forEach((m, i) => {
      shape(m, ["actorId", "beliefs", "preferences", "lastLearning"]);
      check(
        m.actorId === i + 1 &&
          Array.isArray(m.beliefs) &&
          m.beliefs.length <= 108 &&
          Array.isArray(m.preferences) &&
          m.preferences.length <= 108,
        "Mémoire invalide",
      );
      if (m.lastLearning !== null) {
        ref(m.lastLearning);
        const e = events.get(m.lastLearning);
        if (e)
          check(
            e.kind === "M6" && e.actorId === m.actorId,
            "Auteur apprentissage invalide",
          );
      }
      const seen = new Set();
      for (const b of m.beliefs) {
        shape(b, [
          "cellId",
          "material",
          "observedQuantity",
          "observedLotIds",
          "observedAt",
          "observedRevision",
          "evidence",
        ]);
        check(
          W.cellId(b.cellId) &&
            !seen.has(b.cellId) &&
            b.material === "ration" &&
            W.integer(b.observedQuantity) &&
            W.integer(b.observedAt, 0, s.world.tick) &&
            W.integer(b.observedRevision),
          "Croyance invalide",
        );
        seen.add(b.cellId);
        ref(b.evidence);
        const source = events.get(b.evidence);
        if (source) {
          const { evidence, ...observation } = b;
          check(
            source.kind === "M2" &&
              source.actorId === m.actorId &&
              source.tick === b.observedAt &&
              source.data.observations.some(
                (o) => JSON.stringify(o) === JSON.stringify(observation),
              ),
            "Croyance sans observation personnelle",
          );
        }
        check(
          Array.isArray(b.observedLotIds) &&
            b.observedLotIds.length <= 16 &&
            new Set(b.observedLotIds).size === b.observedLotIds.length &&
            b.observedLotIds.every((id) =>
              W.integer(id, 1, s.world.nextId - 1),
            ) &&
            (b.observedQuantity === 0) === (b.observedLotIds.length === 0),
          "Lots crus invalides",
        );
      }
      const cells = new Set();
      for (const p of m.preferences) {
        shape(p, ["cellId", "value", "evidence"]);
        check(
          W.cellId(p.cellId) &&
            !cells.has(p.cellId) &&
            W.integer(p.value, -6, 6),
          "Préférence invalide",
        );
        cells.add(p.cellId);
        ref(p.evidence);
        const source = events.get(p.evidence);
        if (source)
          check(
            source.kind === "M6" &&
              source.actorId === m.actorId &&
              source.data.changes.some(
                (c) => c.cellId === p.cellId && c.after === p.value,
              ),
            "Préférence sans expérience personnelle",
          );
      }
    });
    return true;
  }
  function inspect(s) {
    validate(s);
    return copy(s);
  }
  function cause(s, id) {
    const event = s.trace.find((e) => e.id === id);
    return event
      ? { status: "conservé", event: copy(event) }
      : { status: "détail non conservé", id };
  }
  return {
    create,
    step,
    validate,
    inspect,
    cause,
    regulate,
    perceive,
    understand,
    evaluate,
    decide,
    learn,
    LIMIT,
  };
});
