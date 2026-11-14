(function (root, factory) {
  const api = factory();
  if (typeof module === "object") module.exports = api;
  else root.MaterialCognition = api;
})(globalThis, function () {
  "use strict";
  const copy = (v) => JSON.parse(JSON.stringify(v));
  const distance = (a, b) =>
    Math.abs((a % 12) - (b % 12)) +
    Math.abs(Math.floor(a / 12) - Math.floor(b / 12));
  function decideAgent(personalView, rng) {
    const v = copy(personalView),
      food = v.inventory.reduce((n, e) => n + e.quantity, 0);
    const choose = (list) =>
      list[Math.min(list.length - 1, Math.floor(rng() * list.length))];
    function decision(task, target, lotId, reason, command, plan = [command]) {
      const old = v.intention;
      const stable =
        old?.status === "active" &&
        old.task === task &&
        old.targetCellId === target &&
        old.targetLotId === lotId;
      return {
        reason,
        command,
        intention: {
          id: stable ? old.id : v.tick + ":intent:" + v.id,
          task,
          targetCellId: target,
          targetLotId: lotId,
          status: "active",
          reason,
        },
        plan,
      };
    }
    if (v.body.hunger >= 45 && food > 0)
      return decision(
        "eat",
        v.pos,
        v.inventory[0].id,
        "Faim : ingérer une ration portée.",
        { type: "INGEST", actorId: v.id, lotId: v.inventory[0].id },
      );
    if (v.body.energy < 3)
      return decision(
        "rest",
        v.pos,
        null,
        "Énergie faible : repos avant une nouvelle dépense.",
        { type: "REST", actorId: v.id },
      );
    if ((food < 2 || (v.body.hunger >= 40 && food === 0)) && food < 4) {
      const sources = v.knowledge.filter(
        (k) =>
          k.observedQuantity > 0 &&
          !(
            v.lastResult?.causeCode === "EMPTY" &&
            v.lastResult.command?.source?.cellId === k.cellId &&
            k.observedAt < v.lastResult.tick
          ),
      );
      if (sources.length) {
        sources.sort(
          (a, b) =>
            distance(v.pos, a.cellId) - distance(v.pos, b.cellId) ||
            a.cellId - b.cellId,
        );
        const retained = sources.find(
          (k) =>
            v.intention?.status === "active" &&
            v.intention.task === "acquire" &&
            k.cellId === v.intention.targetCellId,
        );
        const source =
          retained ??
          choose(
            sources
              .filter(
                (k) =>
                  distance(v.pos, k.cellId) <=
                  distance(v.pos, sources[0].cellId) + 1,
              )
              .slice(0, 3),
          );
        const lotId = source.observedLotIds[0],
          take = {
            type: "TRANSFER",
            actorId: v.id,
            lotId,
            source: { cellId: source.cellId },
            destination: { holderAgentId: v.id },
            quantity: 1,
          };
        if (v.pos === source.cellId)
          return decision(
            "acquire",
            source.cellId,
            lotId,
            "Prélever une ration dans une source personnellement observée.",
            take,
          );
        const next =
          v.pos % 12 !== source.cellId % 12
            ? v.pos + Math.sign((source.cellId % 12) - (v.pos % 12))
            : v.pos +
              12 *
                Math.sign(
                  Math.floor(source.cellId / 12) - Math.floor(v.pos / 12),
                );
        const move = { type: "MOVE", actorId: v.id, toCellId: next };
        return decision(
          "acquire",
          source.cellId,
          lotId,
          "Approcher une source connue ; aucun prélèvement avant arrivée.",
          move,
          [move, take],
        );
      }
    }
    const neighbors = [
      v.pos % 12 > 0 ? v.pos - 1 : -1,
      v.pos % 12 < 11 ? v.pos + 1 : -1,
      v.pos - 12,
      v.pos + 12,
    ].filter((n) => n >= 0 && n < 108);
    const age = (n) =>
      v.knowledge.find((k) => k.cellId === n)?.observedAt ?? -1;
    neighbors.sort((a, b) => age(a) - age(b) || a - b);
    if (!neighbors.length)
      return decision(
        "rest",
        v.pos,
        null,
        "Aucun voisin accessible : attente.",
        { type: "REST", actorId: v.id },
      );
    const target = choose(
      neighbors.filter((n) => age(n) === age(neighbors[0])).slice(0, 3),
    );
    return decision(
      "explore",
      target,
      null,
      "Aucune acquisition prioritaire : explorer une frontière ou un voisin moins récemment observé.",
      { type: "MOVE", actorId: v.id, toCellId: target },
    );
  }
  return { decideAgent };
});
