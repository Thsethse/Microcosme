/* Île V2: one authoritative world; no DOM, renderer, clock or storage. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.MicrocosmeIsland = factory();
})(globalThis, function () {
  "use strict";
  const W = 96,
    H = 72,
    RW = 32,
    RH = 24;
  const cave = {
    id: "cave",
    outside: { space: "surface", x: 66, y: 20 },
    inside: { space: "cave", x: 8, y: 10 },
    width: 16,
    height: 12,
  };
  const names = [
    "Les pins",
    "Les sources",
    "Les sommets",
    "La forêt",
    "La plaine",
    "Les contreforts",
    "La crique",
    "Les rives",
    "Le cap",
  ];
  const regions = names.map((name, id) => ({
    id,
    name,
    x: (id % 3) * RW,
    y: Math.floor(id / 3) * RH,
    width: RW,
    height: RH,
  }));
  const biomes = [
    ["forest", "Forêt tempérée", 29, 23],
    ["jungle", "Jungle tropicale", 27, 49],
    ["swamp", "Marécages", 41, 51],
    ["plain", "Plaines et prairies", 46, 34],
    ["sand", "Plages", 45, 65],
    ["cliff", "Falaises côtières", 79, 42],
    ["mountain", "Montagnes", 65, 24],
    ["snow", "Sommets enneigés et glaciers", 64, 12],
    ["volcano", "Volcan", 76, 28],
    ["desert", "Désert et dunes", 67, 49],
    ["canyon", "Canyons", 76, 52],
    ["heath", "Landes et collines", 44, 19],
    ["tundra", "Toundra alpine", 55, 15],
    ["mangrove", "Mangroves", 35, 60],
  ].map(([id, name, x, y]) => ({ id, name, x, y }));
  const interiors = [cave];
  const featureGroups = {
    water: [
      "Rivière",
      "Ruisseau",
      "Lac",
      "Étang",
      "Mare",
      "Cascade",
      "Lagune",
      "Source",
      "Source chaude",
      "Mer côtière explorable",
    ],
    relief: [
      "Grotte",
      "Grande caverne",
      "Arche naturelle",
      "Gorge",
      "Plateau",
      "Crête",
      "Îlot secondaire",
      "Baie",
      "Crique",
      "Champ de lave",
      "Gouffre",
      "Grotte de glace",
    ],
    plants: [
      "Arbre individuel",
      "Buisson",
      "Herbes",
      "Fleurs",
      "Arbre fruitier",
      "Champignons",
      "Roseaux",
      "Bois mort",
      "Roche",
      "Gisement",
      "Sol fertile",
      "Plante rare",
    ],
    landmark: [
      "Ruines",
      "Monolithe",
      "Sanctuaire naturel",
      "Fossiles",
      "Épave",
      "Arbre monumental",
      "Cratère ancien",
    ],
  };
  const spots = [
    [50, 35],
    [53, 28],
    [46, 24],
    [40, 44],
    [35, 37],
    [56, 22],
    [40, 60],
    [54, 20],
    [73, 29],
    [88, 34],
    [66, 20],
    [64, 25],
    [72, 48],
    [68, 44],
    [63, 31],
    [63, 17],
    [86, 56],
    [73, 59],
    [22, 56],
    [77, 31],
    [70, 51],
    [64, 13],
    [27, 25],
    [39, 32],
    [43, 38],
    [42, 34],
    [28, 47],
    [31, 30],
    [40, 50],
    [26, 28],
    [61, 28],
    [65, 26],
    [44, 36],
    [32, 51],
    [57, 43],
    [43, 20],
    [29, 48],
    [73, 50],
    [21, 56],
    [28, 23],
    [75, 33],
  ];
  let spotIndex = 0;
  const features = Object.entries(featureGroups).flatMap(([category, names]) =>
    names.map((name) => {
      const [x, y] = spots[spotIndex++];
      return { name, category, x, y, space: "surface" };
    }),
  );
  function terrain(x, y, space = "surface") {
    if (!Number.isInteger(x) || !Number.isInteger(y)) return "void";
    if (space === "cave")
      return x < 1 ||
        y < 1 ||
        x >= 15 ||
        y >= 11 ||
        (x === 4 && y > 2 && y < 8) ||
        (x === 11 && y > 4 && y < 9)
        ? "wall"
        : "floor";
    if (space !== "surface" || x < 0 || y < 0 || x >= W || y >= H)
      return "void";
    const r = ((x - 46) / 43) ** 2 + ((y - 34) / 31) ** 2;
    // Secondary islands, bays and a continuous irregular coast.
    if (((x - 86) / 5) ** 2 + ((y - 56) / 4) ** 2 < 1) return "sand";
    if (((x - 14) / 4) ** 2 + ((y - 47) / 3) ** 2 < 1) return "cliff";
    if (r > 1 + Math.sin(y * 0.55) * 0.035) return "ocean";
    if (r > 0.87) return x > 73 && y < 46 ? "cliff" : "sand";
    if (
      ((x - 46) / 5) ** 2 + ((y - 24) / 3) ** 2 < 1 ||
      ((x - 40) / 3) ** 2 + ((y - 60) / 2) ** 2 < 1
    )
      return "water";
    // A ford at y=36 keeps east/west paths connected.
    if (x === 50 + Math.round(Math.sin(y / 9) * 3) && y !== 36) return "river";
    let best = Infinity,
      kind = "plain";
    for (const b of biomes) {
      if (b.id === "sand" || b.id === "cliff") continue;
      const d =
        ((x - b.x) / 1.15) ** 2 +
        (y - b.y) ** 2 +
        Math.sin(x * 0.28 + b.x) * Math.cos(y * 0.33 + b.y) * 35;
      if (d < best) {
        best = d;
        kind = b.id;
      }
    }
    return kind;
  }
  function cameraFor(region, x, y) {
    const r = regions[region];
    return {
      x: Math.max(r.x, Math.min(r.x + r.width - 16, Math.round(x - 8))),
      y: Math.max(r.y, Math.min(r.y + r.height - 12, Math.round(y - 6))),
      width: 16,
      height: 12,
    };
  }
  const passable = (p) =>
    !["void", "wall", "ocean", "river", "water"].includes(
      terrain(p.x, p.y, p.space),
    );
  const regionAt = (p) =>
    p.space === "surface"
      ? Math.floor(p.y / RH) * 3 + Math.floor(p.x / RW)
      : null;
  const same = (a, b) => a.space === b.space && a.x === b.x && a.y === b.y;
  // Pure projection used by both rendering and hit targets. No positions are copied into scenes.
  function bounds(scene) {
    if (scene.kind === "interior")
      return {
        x: 0,
        y: 0,
        width: cave.width,
        height: cave.height,
        space: "cave",
      };
    if (scene.kind === "local")
      return { ...(scene.camera || regions[scene.region]), space: "surface" };
    return { x: 0, y: 0, width: W, height: H, space: "surface" };
  }
  function project(p, scene) {
    const b = bounds(scene);
    if (
      p.space !== b.space ||
      p.x < b.x ||
      p.y < b.y ||
      p.x >= b.x + b.width ||
      p.y >= b.y + b.height
    )
      return null;
    return { x: (p.x - b.x + 0.5) / b.width, y: (p.y - b.y + 0.5) / b.height };
  }
  function nextStep(from, to) {
    const queue = [from],
      visited = new Set([from.x + "," + from.y]);
    for (let i = 0; i < queue.length; i++) {
      const p = queue[i];
      if (same(p, to)) {
        let n = p;
        while (n.parent && n.parent !== from) n = n.parent;
        return { space: n.space, x: n.x, y: n.y };
      }
      for (const [dx, dy] of [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
      ]) {
        const n = { space: from.space, x: p.x + dx, y: p.y + dy, parent: p },
          key = n.x + "," + n.y;
        if (!visited.has(key) && passable(n)) {
          visited.add(key);
          queue.push(n);
        }
      }
    }
    return { ...from };
  }
  const route = [
    { pos: { space: "surface", x: 40, y: 34 }, task: "Observe la plaine" },
    { pos: { space: "surface", x: 30, y: 36 }, task: "Explore la forêt" },
    { pos: cave.outside, task: "Rejoint la grotte" },
    { pos: { space: "cave", x: 8, y: 4 }, task: "Examine les cristaux" },
    { pos: cave.inside, task: "Revient vers la lumière" },
    {
      pos: { space: "surface", x: 64, y: 36 },
      task: "Observe les contreforts",
    },
  ];
  function create() {
    const state = {
      tick: 0,
      people: [
        {
          id: 1,
          name: "Alix",
          pos: { space: "surface", x: 44, y: 34 },
          activity: "Observe la plaine",
          routeIndex: 0,
          wait: 0,
        },
      ],
    };
    function step() {
      state.tick++;
      // All agents are updated here regardless of the observed region. A future scheduler
      // can replace this traversal without giving scenes their own simulation.
      for (const p of state.people) {
        if (p.wait > 0) {
          p.wait--;
          continue;
        }
        const target = route[p.routeIndex];
        p.activity = target.task;
        if (p.pos.space !== target.pos.space) {
          const portal = p.pos.space === "surface" ? cave.outside : cave.inside;
          if (same(p.pos, portal))
            p.pos = {
              ...(p.pos.space === "surface" ? cave.inside : cave.outside),
            };
          else p.pos = nextStep(p.pos, portal);
        } else if (!same(p.pos, target.pos))
          p.pos = nextStep(p.pos, target.pos);
        else {
          p.routeIndex = (p.routeIndex + 1) % route.length;
          p.wait = 3;
        }
      }
    }
    return { state, step };
  }
  function createView(world) {
    let scene = { kind: "global" },
      selected = null,
      followed = null;
    const person = (id) => world.state.people.find((p) => p.id === id);
    function sync(observedPosition) {
      const p = person(followed);
      if (!p) return;
      const pos = observedPosition || p.pos;
      scene =
        pos.space === "cave"
          ? { kind: "interior" }
          : { kind: "local", region: regionAt(pos) };
    }
    return {
      get scene() {
        return scene;
      },
      get selected() {
        return person(selected) || null;
      },
      get followed() {
        return followed;
      },
      select(id) {
        if (!person(id)) return false;
        selected = id;
        return true;
      },
      follow(id) {
        if (id !== null && !person(id)) return false;
        followed = id;
        sync();
        return true;
      },
      global() {
        followed = null;
        scene = { kind: "global" };
      },
      local(id) {
        if (!regions[id]) return false;
        followed = null;
        scene = { kind: "local", region: id };
        return true;
      },
      enter() {
        if (scene.kind !== "local" || scene.region !== regionAt(cave.outside))
          return false;
        followed = null;
        scene = { kind: "interior" };
        return true;
      },
      exit() {
        if (scene.kind !== "interior") return false;
        followed = null;
        scene = { kind: "local", region: regionAt(cave.outside) };
        return true;
      },
      sync,
    };
  }
  return {
    biomes,
    features,
    featureGroups,
    interiors,
    cameraFor,
    W,
    H,
    regions,
    cave,
    terrain,
    passable,
    regionAt,
    project,
    bounds,
    create,
    createView,
  };
});
