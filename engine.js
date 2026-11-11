(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.MicrocosmeEngine = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
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
    function distance(a, b) {
      let [x, y] = xy(a),
        [u, v] = xy(b);
      return Math.abs(x - u) + Math.abs(y - v);
    }
    function prepare(p) {
      if (!p.memory) p.memory = { places: [], people: {}, events: [] };
      if (p.food === undefined) p.food = rand(3);
      if (p.personality === undefined)
        p.personality = { kindness: 20 + rand(80), curiosity: 20 + rand(80) };
      if (!p.goal) p.goal = "Explorer";
      if (!p.memory.visited) p.memory.visited = [];
      if (!p.memory.visited.includes(p.pos)) p.memory.visited.push(p.pos);
    }
    function remember(p, message) {
      p.memory.events.unshift(message);
      p.memory.events = p.memory.events.slice(0, 5);
    }
    function perceive(p) {
      if (!p.memory.visited.includes(p.pos)) p.memory.visited.push(p.pos);
      for (let i = 0; i < s.tiles.length; i++) {
        if (
          distance(p.pos, i) <= 2 &&
          ["tree", "field", "home"].includes(s.tiles[i]) &&
          !p.memory.places.includes(i)
        )
          p.memory.places.push(i);
      }
      for (let q of s.people) {
        if (q.id !== p.id && distance(p.pos, q.pos) <= 2) {
          if (!p.memory.people[q.id])
            p.memory.people[q.id] = { name: q.name, trust: 0, meetings: 0 };
        }
      }
    }
    function known(p, kind) {
      let opts = p.memory.places.filter((i) => s.tiles[i] === kind);
      opts.sort((a, b) => distance(p.pos, a) - distance(p.pos, b));
      return opts.length ? opts[0] : null;
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
    function chooseExploration(p) {
      let unexplored = [];
      for (let i = 0; i < W * H; i++) {
        if (!p.memory.visited.includes(i)) unexplored.push(i);
      }
      if (!unexplored.length) {
        unexplored = Array.from({ length: W * H }, (_, i) => i).filter(
          (i) => i !== p.pos,
        );
      }
      unexplored.sort((a, b) => distance(p.pos, a) - distance(p.pos, b));
      let nearby = unexplored.slice(0, Math.min(12, unexplored.length));
      p.target = nearby[rand(nearby.length)];
      p.task = "explore";
      p.goal = "Découvrir une région";
      p.reason =
        p.memory.visited.length === W * H
          ? "Revisite une région déjà découverte"
          : "Se rend vers une case qu’il n’a pas encore visitée";
    }
    function travel(p, target) {
      if (target === null || target === undefined) return false;
      let arrived = move(p, target);
      if (!p.memory.visited.includes(p.pos)) p.memory.visited.push(p.pos);
      return arrived;
    }
    function step() {
      s.hour++;
      if (s.hour >= 24) {
        s.hour = 0;
        s.day++;
        log("Un nouveau jour commence.");
      }
      for (let p of s.people) {
        prepare(p);
        p.hunger = Math.min(130, p.hunger + Number(s.laws.hunger));
        p.energy = Math.max(0, p.energy - 1);
        perceive(p);
        if (p.hunger >= 45 && p.food > 0) {
          p.food--;
          p.hunger = Math.max(0, p.hunger - 38);
          p.task = "eat";
          p.target = null;
          p.goal = "Se nourrir";
          p.reason = "Mange sa réserve personnelle";
          continue;
        }
        if (p.energy < 25) {
          p.task = "rest";
          p.goal = "Récupérer";
          p.reason = "Cherche une maison pour se reposer";
          if (
            p.target === null ||
            p.target === undefined ||
            s.tiles[p.target] !== "home"
          )
            p.target = known(p, "home");
          if (p.target === null) {
            p.energy = Math.min(100, p.energy + 6);
            p.reason = "Se repose sur place";
          } else if (travel(p, p.target))
            p.energy = Math.min(100, p.energy + 18);
          continue;
        }
        if (
          p.task === "farm" &&
          p.target !== null &&
          s.tiles[p.target] === "field" &&
          p.food < 5
        ) {
          p.reason = "Poursuit son trajet vers le champ choisi";
          if (travel(p, p.target)) {
            p.food += Number(s.laws.productivity);
            p.energy = Math.max(0, p.energy - 3);
            remember(p, "A récolté au champ");
            p.target = null;
            p.task = "done";
          }
          encounter(p);
          continue;
        }
        if ((p.hunger >= 40 && p.food === 0) || p.food < 2) {
          let field = known(p, "field");
          if (field !== null) {
            p.task = "farm";
            p.goal = "Récolter de la nourriture";
            p.target = field;
            p.reason = "A choisi un champ connu pour se nourrir";
            if (travel(p, field)) {
              remember(p, "A récolté au champ");
              p.food += Number(s.laws.productivity);
              p.energy = Math.max(0, p.energy - 3);
              p.target = null;
              p.task = "done";
            }
            encounter(p);
            continue;
          }
        }
        if (
          p.task === "wood" &&
          p.target !== null &&
          s.tiles[p.target] === "tree" &&
          s.wood < 12
        ) {
          p.reason = "Poursuit son trajet vers la forêt";
          if (travel(p, p.target)) {
            s.wood += Number(s.laws.productivity);
            p.energy = Math.max(0, p.energy - 3);
            p.target = null;
            p.task = "done";
          }
          encounter(p);
          continue;
        }
        if (s.wood < 12) {
          let forest = known(p, "tree");
          if (forest !== null) {
            p.task = "wood";
            p.goal = "Récolter du bois";
            p.target = forest;
            p.reason = "Va vers une forêt connue";
            if (travel(p, forest)) {
              s.wood += Number(s.laws.productivity);
              p.energy = Math.max(0, p.energy - 3);
              p.target = null;
              p.task = "done";
            }
            encounter(p);
            continue;
          }
        }
        if (
          p.task !== "explore" ||
          p.target === null ||
          p.target === undefined ||
          p.pos === p.target
        )
          chooseExploration(p);
        if (travel(p, p.target)) {
          remember(p, "A exploré une nouvelle zone");
          p.target = null;
        }
        encounter(p);
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
      log,
      initial,
      names,
    };
  }
  return { create, W, H, names };
});
