(function (root, factory) {
  if (typeof module === "object" && module.exports)
    module.exports = factory(require("./cognition"));
  else root.MicrocosmeEngine = factory(root.MicrocosmeCognition);
})(typeof globalThis !== "undefined" ? globalThis : this, function (cognition) {
  "use strict";
  const W = 12,
    H = 9;
  const names = [
    "Alix",
    "Basile",
    "Céleste",
    "Dorian",
    "Éloïse",
    "Félix",
    "Gaëlle",
    "Hugo",
    "Iris",
    "Jules",
    "Lina",
    "Milo",
  ];
  function create(state, random = Math.random) {
    let s = state;
    const idx = (x, y) => y * W + x;
    const xy = (i) => [i % W, Math.floor(i / W)];
    const rand = (n) => Math.floor(random() * n);
    function initial() {
      let tiles = Array.from({ length: W * H }, (_, i) =>
        random() < 0.2 ? "tree" : random() < 0.13 ? "field" : "grass",
      );
      [39, 40, 41, 51, 52, 53].forEach((i) => (tiles[i] = "grass"));
      tiles[40] = "home";
      tiles[52] = "home";
      return {
        hour: 8,
        day: 1,
        food: 20,
        wood: 3,
        tiles,
        people: names.slice(0, 5).map((name, i) => ({
          id: i + 1,
          name,
          pos: 39 + i * 3,
          energy: 75,
          hunger: 15,
          task: "observe",
          target: null,
          reason: "Découvre le village",
          social: 40 + rand(50),
        })),
        laws: { hunger: 2, productivity: 2, social: 30 },
        events: ["Le village s’éveille."],
      };
    }
    function log(t) {
      s.events.unshift("Jour " + s.day + " : " + t);
      s.events = s.events.slice(0, 35);
    }
    function move(p, t) {
      if (!Number.isInteger(t) || t < 0 || t >= W * H) return false;
      if (p.pos === t) return true;
      let [x, y] = xy(p.pos),
        [a, b] = xy(t);
      if (x !== a) x += Math.sign(a - x);
      else if (y !== b) y += Math.sign(b - y);
      p.pos = idx(x, y);
      return p.pos === t;
    }
    const distance = cognition.distance;
    const now = () => (s.day - 1) * 24 + s.hour;
    function prepare(p) {
      if (!p.memory) p.memory = { places: [], people: {}, events: [] };
      const m = p.memory;
      if (!m.visited) m.visited = [];
      if (!m.terrain) {
        // v0.6 stored indices, not terrain types. Never reconstruct them from the hidden map.
        m.terrain = cognition.legacyTerrain(m, p.task, p.target);
      }
      if (!m.experiences) m.experiences = {};
      if (!m.journal) m.journal = [];
      if (!m.stock) m.stock = { wood: 12 };
      if (p.food === undefined) p.food = rand(3);
      if (p.personality === undefined)
        p.personality = { kindness: 20 + rand(80), curiosity: 20 + rand(80) };
      if (!p.goal) p.goal = "Explorer";
      if (!m.visited.includes(p.pos)) m.visited.push(p.pos);
      if (p.intention === undefined) {
        p.intention =
          cognition.cell(p.target) &&
          ["farm", "wood", "rest", "explore"].includes(p.task)
            ? {
                task: p.task,
                target: p.target,
                need: p.task,
                reason: p.reason || "Poursuit son intention précédente",
                chosenAt: now(),
                status: "active",
              }
            : null;
      }
    }
    function remember(p, message) {
      p.memory.events.unshift(message);
      p.memory.events = p.memory.events.slice(0, 5);
    }
    function note(p, type, message) {
      p.memory.journal.unshift({ at: now(), type, message });
      p.memory.journal = p.memory.journal.slice(0, 12);
    }
    function perceive(p) {
      prepare(p);
      // The communal wood counter is public accounting, already visible in v0.6; no terrain is disclosed by it.
      p.memory.stock.wood = s.wood;
      if (!p.memory.visited.includes(p.pos)) p.memory.visited.push(p.pos);
      let discoveries = 0;
      for (let i = 0; i < W * H; i++) {
        if (distance(p.pos, i) > 2) continue;
        const previous = p.memory.terrain[i],
          kind = s.tiles[i];
        if (previous && previous.kind !== null && previous.kind !== kind)
          note(
            p,
            "revision",
            "Case " +
              i +
              " : souvenir " +
              previous.kind +
              " remplacé par " +
              kind,
          );
        if (!previous || previous.kind === null) discoveries++;
        p.memory.terrain[i] = {
          kind,
          observedAt: now(),
          revision:
            (previous?.revision || 0) + (previous?.kind === kind ? 0 : 1),
        };
        if (!p.memory.places.includes(i)) p.memory.places.push(i);
      }
      if (discoveries)
        note(
          p,
          "discovery",
          discoveries + " case(s) observée(s) pour la première fois",
        );
      for (const q of s.people) {
        if (
          q.id !== p.id &&
          distance(p.pos, q.pos) <= 2 &&
          !p.memory.people[q.id]
        )
          p.memory.people[q.id] = { name: q.name, trust: 0, meetings: 0 };
      }
    }
    function known(p, kind) {
      const task = Object.keys(cognition.kinds).find(
        (key) => cognition.kinds[key] === kind,
      );
      return task ? (cognition.solutions(p, task)[0]?.target ?? null) : null;
    }
    function encounter(p) {
      for (let q of s.people) {
        if (p.id === q.id || p.pos !== q.pos) continue;
        prepare(q);
        let rel =
          p.memory.people[q.id] ||
          (p.memory.people[q.id] = { name: q.name, trust: 0, meetings: 0 });
        let back =
          q.memory.people[p.id] ||
          (q.memory.people[p.id] = { name: p.name, trust: 0, meetings: 0 });
        if (
          p.hunger > 45 &&
          p.food === 0 &&
          q.food > 1 &&
          q.personality.kindness > 30
        ) {
          q.food--;
          p.food++;
          rel.trust += 3;
          back.trust += 3;
          remember(p, q.name + " lui a donné de la nourriture");
          remember(q, "A partagé avec " + p.name);
          log(q.name + " partage sa nourriture avec " + p.name);
          return true;
        }
        if (rand(100) < s.laws.social / 8) {
          rel.meetings++;
          back.meetings++;
          rel.trust = Math.min(100, rel.trust + 1);
          back.trust = Math.min(100, back.trust + 1);
          if (rel.meetings % 4 === 0) {
            remember(p, "A discuté avec " + q.name);
            log(p.name + " et " + q.name + " se retrouvent.");
          }
          return true;
        }
      }
      return false;
    }
    function travel(p, target) {
      if (!cognition.cell(target)) return false;
      const arrived = move(p, target);
      if (!p.memory.visited.includes(p.pos)) p.memory.visited.push(p.pos);
      return arrived;
    }
    function result(p, intention, outcome, cause) {
      if (intention.target === null) return;
      const key = intention.task + ":" + intention.target;
      const old = p.memory.experiences[key] || { successes: 0, failures: 0 };
      p.memory.experiences[key] = {
        successes: old.successes + (outcome === "success" ? 1 : 0),
        failures: old.failures + (outcome === "failure" ? 1 : 0),
        lastOutcome: outcome,
        lastAt: now(),
        revision: p.memory.terrain[intention.target]?.revision || 0,
        cause,
      };
      if (outcome === "failure") note(p, "failure", cause);
    }
    function reconsiderInvalid(p) {
      const current = p.intention;
      if (
        current?.status !== "active" ||
        current.target === null ||
        current.task === "explore"
      )
        return;
      // A remote change is not visible here: eligibility uses only the observer's memory.
      if (!cognition.eligible(p, current.task, current.target)) {
        result(
          p,
          current,
          "failure",
          "Destination " +
            current.target +
            " inadéquate : terrain observé " +
            (p.memory.terrain[current.target]?.kind || "inconnu"),
        );
        current.status = "failed";
      }
    }
    function decide(p) {
      reconsiderInvalid(p);
      const choice = cognition.choose(p, random);
      p.need = choice.need;
      if (!choice.retained) {
        const old = p.intention;
        p.intention = { ...choice, chosenAt: now(), status: "active" };
        if (
          !old ||
          old.task !== choice.task ||
          old.target !== choice.target ||
          old.status === "failed"
        )
          note(
            p,
            "decision",
            cognition.labels[choice.task] +
              " → " +
              (choice.target === null ? "sur place" : "case " + choice.target) +
              " : " +
              choice.reason,
          );
      }
      p.task = p.intention.task;
      p.target = p.intention.target;
      p.goal = cognition.labels[p.task];
      p.reason = p.intention.reason;
      return p.intention;
    }
    function act(p) {
      const intent = p.intention,
        task = intent.task;
      if (task === "eat") {
        p.food--;
        p.hunger = Math.max(0, p.hunger - 38);
        intent.status = "completed";
        return;
      }
      if (task === "rest" && intent.target === null) {
        p.energy = Math.min(100, p.energy + 6);
        intent.status = "completed";
        return;
      }
      const arrived = travel(p, intent.target);
      // Update local knowledge on arrival/movement, then validate consequences against reality.
      perceive(p);
      reconsiderInvalid(p);
      if (intent.status === "failed") {
        decide(p);
        return;
      }
      if (arrived) {
        if (
          cognition.kinds[task] &&
          s.tiles[intent.target] !== cognition.kinds[task]
        ) {
          result(p, intent, "failure", "Terrain inadéquat à arrivée");
          intent.status = "failed";
          p.target = null;
          return;
        }
        if (task === "farm") {
          p.food += Number(s.laws.productivity);
          p.energy = Math.max(0, p.energy - 3);
          remember(p, "A récolté au champ");
        } else if (task === "wood") {
          s.wood += Number(s.laws.productivity);
          p.energy = Math.max(0, p.energy - 3);
        } else if (task === "rest") p.energy = Math.min(100, p.energy + 18);
        else remember(p, "A exploré une nouvelle zone");
        result(
          p,
          intent,
          "success",
          task === "explore" ? "Destination explorée" : "Action réussie",
        );
        intent.status = "completed";
        if (task !== "rest") {
          p.target = null;
          p.task = task === "explore" ? "explore" : "done";
        }
      }
      if (task !== "rest") encounter(p);
    }
    function step() {
      s.hour++;
      if (s.hour >= 24) {
        s.hour = 0;
        s.day++;
        log("Un nouveau jour commence.");
      }
      for (const p of s.people) {
        prepare(p);
        p.hunger = Math.min(130, p.hunger + Number(s.laws.hunger));
        p.energy = Math.max(0, p.energy - 1);
        perceive(p);
        decide(p);
        act(p);
      }
    }

    if (!s) s = initial();
    s.people.forEach(prepare);
    return {
      get state() {
        return s;
      },
      step,
      prepare,
      perceive,
      travel,
      remember,
      known,
      decide,
      log,
      initial,
      names,
    };
  }
  return { create, W, H, names };
});
