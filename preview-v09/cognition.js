(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.MicrocosmeCognition = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const W = 12,
    SIZE = 108;
  const kinds = { farm: "field", wood: "tree", rest: "home" };
  const labels = {
    farm: "Récolter de la nourriture",
    wood: "Récolter du bois",
    rest: "Récupérer",
    eat: "Se nourrir",
    explore: "Découvrir une région",
  };
  const needs = {
    eat: "Faim urgente",
    rest: "Fatigue",
    farm: "Réserves alimentaires",
    wood: "Stock communal de bois",
    explore: "Exploration",
  };
  const cell = (v) => Number.isInteger(v) && v >= 0 && v < SIZE;
  const distance = (a, b) =>
    Math.abs((a % W) - (b % W)) +
    Math.abs(Math.floor(a / W) - Math.floor(b / W));
  function legacyTerrain(memory, task, target) {
    const terrain = {};
    for (const i of memory.places || [])
      if (cell(i)) terrain[i] = { kind: null, observedAt: null, revision: 0 };
    if (kinds[task] && cell(target))
      terrain[target] = { kind: kinds[task], observedAt: null, revision: 0 };
    return terrain;
  }
  function dominant(p) {
    if (p.hunger >= 45 && p.food > 0) return "eat";
    if (p.energy < 25) return "rest";
    if ((p.hunger >= 40 && p.food === 0) || p.food < 2) return "farm";
    if (p.memory.stock.wood < 12) return "wood";
    return "explore";
  }
  function eligible(p, task, target) {
    if (!cell(target)) return false;
    if (task === "explore") return target !== p.pos;
    const seen = p.memory.terrain[target];
    if (!seen || seen.kind !== kinds[task]) return false;
    const result = p.memory.experiences[task + ":" + target];
    return !(
      result?.lastOutcome === "failure" && result.revision === seen.revision
    );
  }
  // Reads only personal state and memories; never receives the real map.
  function solutions(p, task) {
    let positions;
    if (task === "explore") {
      positions = Array.from({ length: SIZE }, (_, i) => i).filter(
        (i) =>
          i !== p.pos &&
          (!p.memory.terrain[i] || p.memory.terrain[i].kind === null),
      );
      if (!positions.length)
        positions = Array.from({ length: SIZE }, (_, i) => i).filter(
          (i) => i !== p.pos && !p.memory.visited.includes(i),
        );
      if (!positions.length)
        positions = Array.from({ length: SIZE }, (_, i) => i).filter(
          (i) => i !== p.pos,
        );
    } else
      positions = Object.keys(p.memory.terrain)
        .map(Number)
        .filter((i) => eligible(p, task, i));
    return positions
      .map((target) => {
        const steps = distance(p.pos, target);
        const result = p.memory.experiences[task + ":" + target];
        // One successful experience can offset at most one step; fatigue costs actual walking/work energy.
        const familiarity = result?.successes > 0 ? 1 : 0;
        const cost = steps + (task === "farm" || task === "wood" ? 3 : 0);
        const fatigue = task === "rest" ? 0 : Math.max(0, 25 + cost - p.energy);
        return {
          target,
          distance: steps,
          cost,
          score: steps + fatigue - familiarity,
        };
      })
      .sort((a, b) => a.score - b.score || a.target - b.target);
  }
  function pick(p, task, random) {
    const ranked = solutions(p, task);
    if (!ranked.length) return null;
    // Bounded indifference: at most 3 candidates within one walking step of the best score.
    const plausible = ranked
      .filter((c) => c.score <= ranked[0].score + 1)
      .slice(0, 3);
    return {
      ...plausible[Math.floor(random() * plausible.length)],
      alternatives: plausible.length,
    };
  }
  function choose(p, random) {
    const need = dominant(p),
      current = p.intention;
    const urgent =
      need === "eat" ||
      (need === "rest" && current?.task !== "rest") ||
      (need === "farm" &&
        p.food === 0 &&
        p.hunger >= 40 &&
        current?.task !== "farm" &&
        !(current?.task === "explore" && current.need === "farm"));
    const discovery =
      current?.task === "explore" &&
      need !== "explore" &&
      solutions(p, need).length > 0;
    if (
      current?.status === "active" &&
      !urgent &&
      !discovery &&
      ((current.task === "rest" && current.target === null) ||
        eligible(p, current.task, current.target)) &&
      !(current.task === "wood" && p.memory.stock.wood >= 12) &&
      !(current.task === "farm" && p.food >= 5)
    )
      return { ...current, need, retained: true };
    if (need === "eat")
      return {
        task: "eat",
        target: null,
        need,
        reason: "Faim urgente : mange sa réserve personnelle",
      };
    let task = need,
      candidate = pick(p, task, random);
    if (
      (task === "farm" || task === "wood") &&
      candidate &&
      p.energy - candidate.cost < 25 &&
      !(p.hunger >= 40 && p.food === 0)
    ) {
      const house = pick(p, "rest", random);
      if (house) {
        task = "rest";
        candidate = house;
      }
    }
    if (!candidate && task !== "rest") {
      task = "explore";
      candidate = pick(p, task, random);
    }
    if (task === "rest" && !candidate)
      return {
        task,
        target: null,
        need,
        reason:
          "Fatigue : aucune maison connue utilisable, se repose sur place",
      };
    const reason =
      task === "explore"
        ? need === "farm"
          ? "Cherche de la nourriture : aucun champ connu utilisable ; explore"
          : "Explore une région inconnue ou peu visitée"
        : (task === "rest" && need !== "rest"
            ? "Anticipe la fatigue du trajet ; "
            : "") +
          labels[task] +
          " : souvenir personnel, trajet de " +
          candidate.distance +
          " case(s), coût " +
          candidate.cost +
          ", " +
          candidate.alternatives +
          " solution(s) comparable(s)" +
          (p.memory.experiences[task + ":" + candidate.target]?.successes > 0
            ? ", réussite passée"
            : "");
    return { task, target: candidate.target, need, reason };
  }
  return {
    cell,
    legacyTerrain,
    distance,
    kinds,
    labels,
    needs,
    dominant,
    eligible,
    solutions,
    choose,
  };
});
