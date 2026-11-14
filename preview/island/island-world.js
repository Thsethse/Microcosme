/* Île V1: one authoritative world; no DOM, renderer, clock or storage. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.MicrocosmeIsland = factory();
})(globalThis, function () {
  "use strict";
  const W = 48,
    H = 36,
    RW = 16,
    RH = 12;
  const cave = {
    id: "cave",
    outside: { space: "surface", x: 33, y: 10 },
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
  const riverX = (y) => 25 + Math.round(Math.sin(y / 5) * 2);
  function terrain(x, y, space = "surface") {
    if (!Number.isInteger(x) || !Number.isInteger(y)) return "void";
    if (space === "cave") {
      if (
        x < 1 ||
        y < 1 ||
        x >= 15 ||
        y >= 11 ||
        (x === 4 && y > 2 && y < 8) ||
        (x === 11 && y > 4 && y < 9)
      )
        return "wall";
      return "floor";
    }
    if (space !== "surface" || x < 0 || y < 0 || x >= W || y >= H)
      return "void";
    const radius = ((x - 23) / 22) ** 2 + ((y - 17) / 16) ** 2;
    if (radius > 1 + Math.sin(y * 1.7) * 0.035) return "ocean";
    if (radius > 0.83) return "sand";
    // A ford preserves a connected walking route across the decorative river.
    if (Math.abs(x - riverX(y)) <= 0 && y !== 18) return "river";
    if (x > 29 && y < 16) return "mountain";
    return x < 20 && y < 26 ? "forest" : "plain";
  }
  const passable = (p) =>
    !["void", "wall", "ocean", "river"].includes(terrain(p.x, p.y, p.space));
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
      return { ...regions[scene.region], space: "surface" };
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
    { pos: { space: "surface", x: 20, y: 17 }, task: "Observe la plaine" },
    { pos: { space: "surface", x: 15, y: 18 }, task: "Explore la forêt" },
    { pos: cave.outside, task: "Rejoint la grotte" },
    { pos: { space: "cave", x: 8, y: 4 }, task: "Examine les cristaux" },
    { pos: cave.inside, task: "Revient vers la lumière" },
    {
      pos: { space: "surface", x: 32, y: 18 },
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
          pos: { space: "surface", x: 22, y: 17 },
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
    function sync() {
      const p = person(followed);
      if (!p) return;
      scene =
        p.pos.space === "cave"
          ? { kind: "interior" }
          : { kind: "local", region: regionAt(p.pos) };
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
