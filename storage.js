(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.MicrocosmeStorage = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const KEY = "microcosme-v03",
    LEGACY = "microcosme-v02";
  const tileTypes = ["grass", "tree", "field", "home"];
  const cell = (v) => Number.isInteger(v) && v >= 0 && v < 108;
  const number = (v, fallback, min, max) =>
    Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback;
  function normalize(raw) {
    if (
      !raw ||
      !Array.isArray(raw.tiles) ||
      raw.tiles.length !== 108 ||
      !raw.tiles.every((t) => tileTypes.includes(t)) ||
      !Array.isArray(raw.people) ||
      raw.people.length > 30
    )
      throw new Error("Monde invalide");
    const ids = new Set();
    const people = raw.people.map((p) => {
      if (
        !p ||
        !Number.isInteger(p.id) ||
        p.id < 1 ||
        ids.has(p.id) ||
        !cell(p.pos)
      )
        throw new Error("Habitant invalide");
      ids.add(p.id);
      const m = p.memory || {},
        relations = {};
      for (const [id, r] of Object.entries(m.people || {})) {
        if (r && typeof r.name === "string")
          relations[id] = {
            name: r.name,
            trust: number(r.trust, 0, 0, 100),
            meetings: number(r.meetings, 0, 0, Number.MAX_SAFE_INTEGER),
          };
      }
      return {
        ...p,
        name: typeof p.name === "string" ? p.name : "Habitant " + p.id,
        energy: number(p.energy, 75, 0, 100),
        hunger: number(p.hunger, 15, 0, 130),
        food: number(p.food, 0, 0, 1000),
        target: cell(p.target) ? p.target : null,
        task: typeof p.task === "string" ? p.task : "observe",
        goal: typeof p.goal === "string" ? p.goal : "Explorer",
        reason: typeof p.reason === "string" ? p.reason : "Découvre le village",
        personality: {
          kindness: number(p.personality?.kindness, 50, 0, 100),
          curiosity: number(p.personality?.curiosity, 50, 0, 100),
        },
        memory: {
          places: [
            ...new Set(Array.isArray(m.places) ? m.places.filter(cell) : []),
          ],
          visited: [
            ...new Set(Array.isArray(m.visited) ? m.visited.filter(cell) : []),
          ],
          people: relations,
          events: Array.isArray(m.events)
            ? m.events.filter((e) => typeof e === "string").slice(0, 5)
            : [],
        },
      };
    });
    const laws = raw.laws || {};
    return {
      ...raw,
      version: 6,
      tiles: raw.tiles.slice(),
      people,
      hour: Math.floor(number(raw.hour, 8, 0, 23)),
      day: Math.floor(number(raw.day, 1, 1, Number.MAX_SAFE_INTEGER)),
      food: number(raw.food, 20, 0, Number.MAX_SAFE_INTEGER),
      wood: number(raw.wood, 3, 0, Number.MAX_SAFE_INTEGER),
      laws: {
        hunger: number(laws.hunger, 2, 0, 4),
        productivity: number(laws.productivity, 2, 1, 5),
        social: number(laws.social, 30, 0, 100),
      },
      events: Array.isArray(raw.events)
        ? raw.events.filter((e) => typeof e === "string").slice(0, 35)
        : [],
    };
  }
  function load(storage) {
    let damaged = false;
    try {
      for (const key of [KEY, LEGACY]) {
        const text = storage.getItem(key);
        if (text === null) continue;
        try {
          return {
            state: normalize(JSON.parse(text)),
            message: damaged ? "Ancienne sauvegarde récupérée." : "",
          };
        } catch (error) {
          // Retain the original bytes before any later save can replace them.
          storage.setItem(key + "-recovery", text);
          damaged = true;
        }
      }
      return {
        state: null,
        message: damaged
          ? "Sauvegarde invalide conservée dans une copie de récupération."
          : "",
      };
    } catch (error) {
      return {
        state: null,
        blocked: true,
        message:
          "Stockage inaccessible : la sauvegarde existante est préservée. La partie reste temporaire.",
      };
    }
  }
  function save(storage, state) {
    try {
      storage.setItem(KEY, JSON.stringify(normalize(state)));
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: "Sauvegarde impossible : la partie continue en mémoire.",
      };
    }
  }
  return { KEY, LEGACY, normalize, load, save };
});
