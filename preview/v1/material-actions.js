(function (root, factory) {
  const api = factory(
    typeof module === "object"
      ? require("./material-world.js")
      : root.MaterialWorld,
  );
  if (typeof module === "object") module.exports = api;
  else root.MaterialActions = api;
})(globalThis, function (W) {
  "use strict";
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const blank = () => ({ lots: [], position: null, body: [], consumed: 0 });
  function executeCommand(state, input) {
    W.validateState(state);
    let valid = true;
    try {
      W.command(input);
      if (input.lotId !== undefined && input.lotId >= state.nextId)
        valid = false;
    } catch {
      valid = false;
    }
    const actor = state.agents.find((a) => a.id === input?.actorId);
    // Invalid/unknown commands are not allowed to inject arbitrary data into saves.
    if (!actor)
      return {
        id: state.tick + ":invalid",
        tick: state.tick,
        actorId: W.integer(input?.actorId, 1) ? input.actorId : null,
        intentId: null,
        command: null,
        outcome: "failure",
        causeCode: "INVALID",
        checkedRevisions: [],
        delta: blank(),
        cost: { energy: 0 },
        causalParents: [],
      };
    const result = {
      id: state.tick + ":action:" + actor.id,
      tick: state.tick,
      actorId: actor.id,
      intentId: actor.intention?.id ?? null,
      command: valid ? W.clone(input) : null,
      outcome: "failure",
      causeCode: "INVALID",
      checkedRevisions: [],
      delta: blank(),
      cost: { energy: 0 },
      causalParents: [],
    };
    if (actor.lastActedTick === state.tick) return W.clone(result); // No second primitive or journal write.
    const draft = W.clone(state),
      a = draft.agents.find((a) => a.id === actor.id);
    function finish(cause) {
      result.causeCode = cause;
      result.outcome = cause === "SUCCESS" ? "success" : "failure";
      const target = cause === "SUCCESS" ? draft : W.clone(state),
        person = target.agents.find((p) => p.id === actor.id);
      person.lastActedTick = target.tick;
      person.lastResult = W.clone(result);
      W.appendEvent(target, result);
      W.validateState(target);
      if (target !== state) Object.assign(state, target);
      return W.clone(result);
    }
    if (!valid) return finish("INVALID");
    const cmd = input;
    function body(field, value) {
      result.delta.body.push({ field, before: a.body[field], after: value });
      a.body[field] = value;
    }
    function energy(cost) {
      body("energy", a.body.energy - cost);
      result.cost.energy = cost;
    }
    function revision(cell) {
      const c = draft.cells[cell];
      if (c.resourceRevision === Number.MAX_SAFE_INTEGER) return false;
      c.resourceRevision++;
      return true;
    }
    if (cmd.type === "MOVE") {
      if (!W.cellId(cmd.toCellId)) return finish("OUT_OF_BOUNDS");
      if (W.distance(a.pos, cmd.toCellId) !== 1) return finish("NOT_REACHABLE");
      if (a.body.energy < 1) return finish("NO_CAPACITY");
      result.delta.position = { from: a.pos, to: cmd.toCellId };
      a.pos = cmd.toCellId;
      energy(1);
    } else if (cmd.type === "REST")
      body("energy", Math.min(100, a.body.energy + 6));
    else {
      if (cmd.type === "TRANSFER" && a.body.energy < 1)
        return finish("NO_CAPACITY");
      const local = (loc) =>
        Object.hasOwn(loc, "cellId")
          ? loc.cellId === a.pos
          : loc.holderAgentId === a.id;
      if (
        cmd.type === "TRANSFER" &&
        (!local(cmd.source) || !local(cmd.destination))
      )
        return finish("NOT_REACHABLE");
      const e = draft.entities.find((e) => e.id === cmd.lotId);
      const expected =
        cmd.type === "INGEST" ? { holderAgentId: a.id } : cmd.source;
      if (!e || !same(e.location, expected) || e.quantity < (cmd.quantity ?? 1))
        return finish("EMPTY");
      result.checkedRevisions.push({
        kind: "lot",
        id: e.id,
        revision: e.revision,
      });
      if (e.lastChange) result.causalParents.push(e.lastChange.eventId);
      if (e.revision === Number.MAX_SAFE_INTEGER) return finish("CAPACITY");
      const before = W.clone(e),
        q = cmd.type === "INGEST" ? 1 : cmd.quantity;
      if (cmd.type === "TRANSFER") {
        if (same(cmd.source, cmd.destination)) return finish("INCOMPATIBLE");
        const carried = W.inventory(draft, a.id).reduce(
          (n, e) => n + e.quantity,
          0,
        );
        if (cmd.destination.holderAgentId === a.id && carried + q > 4)
          return finish("CAPACITY");
        const split = q < e.quantity;
        if (
          split &&
          (draft.entities.length >= 16 ||
            draft.nextId === Number.MAX_SAFE_INTEGER)
        )
          return finish("CAPACITY");
        for (const cell of new Set(
          [cmd.source.cellId, cmd.destination.cellId].filter(
            (n) => n !== undefined,
          ),
        )) {
          result.checkedRevisions.push({
            kind: "cell",
            id: cell,
            revision: draft.cells[cell].resourceRevision,
          });
          if (!revision(cell)) return finish("CAPACITY");
        }
        if (split) {
          e.quantity -= q;
          e.revision++;
          e.lastChange = { eventId: result.id, causeCode: "SUCCESS" };
          const fragment = {
            ...W.clone(e),
            id: draft.nextId++,
            quantity: q,
            location: W.clone(cmd.destination),
            revision: 0,
          };
          draft.entities.push(fragment);
          result.delta.lots.push({
            lotId: e.id,
            beforeQuantity: before.quantity,
            afterQuantity: e.quantity,
            from: before.location,
            to: e.location,
            removed: false,
            created: false,
          });
          result.delta.lots.push({
            lotId: fragment.id,
            beforeQuantity: 0,
            afterQuantity: q,
            from: null,
            to: fragment.location,
            removed: false,
            created: true,
          });
        } else {
          e.location = W.clone(cmd.destination);
          e.revision++;
          e.lastChange = { eventId: result.id, causeCode: "SUCCESS" };
          result.delta.lots.push({
            lotId: e.id,
            beforeQuantity: q,
            afterQuantity: q,
            from: before.location,
            to: e.location,
            removed: false,
            created: false,
          });
        }
        energy(1);
      } else {
        if (e.material !== "ration") return finish("INCOMPATIBLE");
        e.quantity--;
        e.revision++;
        e.lastChange = { eventId: result.id, causeCode: "SUCCESS" };
        if (e.quantity === 0)
          draft.entities = draft.entities.filter((lot) => lot.id !== e.id);
        draft.ledger.ration.consumed++;
        result.delta.consumed = 1;
        result.delta.lots.push({
          lotId: e.id,
          beforeQuantity: before.quantity,
          afterQuantity: e.quantity,
          from: before.location,
          to: e.quantity ? e.location : null,
          removed: e.quantity === 0,
          created: false,
        });
        body("hunger", Math.max(0, a.body.hunger - 38));
      }
    }
    // No material/state publication until all invariants on the complete delta hold.
    return finish("SUCCESS");
  }
  return { executeCommand };
});
