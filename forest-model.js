/* V4 presentation adapter. All coordinates come from V3; no world writes. */
(function (root, factory) {
  if (typeof module === "object")
    module.exports = factory(require("./island-world"));
  else root.ForestModel = factory(root.MicrocosmeIsland);
})(globalThis, function (I) {
  "use strict";
  const TILE = 32,
    area = Object.freeze({
      x: 24,
      y: 12,
      width: 48,
      height: 30,
      space: "surface",
    });
  function hash(x, y = 0) {
    let n = Math.imul(x + 31, 374761393) ^ Math.imul(y + 7, 668265263);
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return (n ^ (n >>> 16)) >>> 0;
  }
  const water = (k) => ["water", "river", "ocean"].includes(k);
  function ground(kind) {
    return water(kind)
      ? "water"
      : ["forest", "jungle", "swamp", "mangrove"].includes(kind)
        ? "forest"
        : ["mountain", "cliff", "volcano", "wall", "floor"].includes(kind)
          ? "stone"
          : ["sand", "desert", "canyon"].includes(kind)
            ? "soil"
            : ["snow", "tundra"].includes(kind)
              ? "snow"
              : "grass";
  }
  const directions = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];
  function tile(x, y, space = "surface") {
    const kind = I.terrain(x, y, space),
      neighbors = directions.map(([dx, dy]) =>
        I.terrain(x + dx, y + dy, space),
      );
    return {
      x,
      y,
      kind,
      ground: ground(kind),
      variant: hash(x, y) % 4,
      banks: water(kind)
        ? neighbors.reduce((m, k, i) => m | (!water(k) ? 1 << i : 0), 0)
        : 0,
      fringe: !water(kind)
        ? neighbors.reduce(
            (m, k, i) =>
              m | (ground(k) !== ground(kind) && !water(k) ? 1 << i : 0),
            0,
          )
        : 0,
    };
  }
  function object(id, assetKey, x, y, source, seed = hash(x, y), scale = 1) {
    const pine = assetKey === "pine",
      tree = pine || assetKey === "oak",
      cave = assetKey === "cave";
    const width =
      (tree
        ? pine
          ? 80
          : 96
        : cave
          ? 160
          : assetKey === "rock" || assetKey === "log"
            ? 64
            : assetKey === "bush"
              ? 40
              : 32) * scale;
    const height =
      (tree
        ? pine
          ? 128
          : 112
        : cave
          ? 128
          : assetKey === "rock" || assetKey === "reeds"
            ? 48
            : 32) * scale;
    return {
      id,
      assetKey,
      worldPosition: { space: "surface", x, y },
      anchor: { x: width / 2, y: height - 2 * scale },
      visualBounds: { width, height },
      occlusionProfile: tree ? "trunk-and-canopy" : "volume",
      variantSeed: seed,
      visualState: "existing",
      source,
      scale,
    };
  }
  function objects() {
    const all = [];
    for (let y = area.y; y < area.y + area.height; y++)
      for (let x = area.x; x < area.x + area.width; x++) {
        const k = I.terrain(x, y),
          n = hash(x, y),
          wet = water(k);
        if (wet) continue;
        // These instances describe the existing terrain's vegetation/stone texture.
        // They are NOT new persistent objects, obstacles, resources or traces.
        if (["forest", "jungle"].includes(k) && x % 3 === n % 2 && y % 3 === 0)
          all.push(
            object(
              `terrain:tree:${x}:${y}`,
              n % 7 === 0 ? "pine" : "oak",
              x,
              y,
              "terrain-decoration",
              n,
              0.86 + (n % 4) * 0.08,
            ),
          );
        else if (k === "mountain" && x % 4 === 0 && y % 3 === 0 && n % 3 !== 0)
          all.push(
            object(
              `terrain:rock:${x}:${y}`,
              "rock",
              x,
              y,
              "terrain-decoration",
              n,
              0.7 + (n % 3) * 0.15,
            ),
          );
        else if (
          ["plain", "forest", "heath", "jungle"].includes(k) &&
          n % 23 === 0
        )
          all.push(
            object(
              `terrain:plants:${x}:${y}`,
              n % 2 ? "flowers" : "bush",
              x,
              y,
              "terrain-decoration",
              n,
            ),
          );
        if (
          ["plain", "forest"].includes(k) &&
          directions.some(([dx, dy]) => water(I.terrain(x + dx, y + dy))) &&
          n % 3 === 0
        )
          all.push(
            object(
              `terrain:reeds:${x}:${y}`,
              "reeds",
              x,
              y,
              "terrain-decoration",
              n,
            ),
          );
      }
    const keys = {
      "Arbre individuel": "oak",
      "Arbre fruitier": "oak",
      "Arbre monumental": "oak",
      Roche: "rock",
      Gisement: "rock",
      "Bois mort": "log",
      Fleurs: "flowers",
      Herbes: "flowers",
      Buisson: "bush",
      Roseaux: "reeds",
      Grotte: "cave",
    };
    I.features.forEach((f, index) => {
      if (
        f.x < area.x ||
        f.y < area.y ||
        f.x >= area.x + area.width ||
        f.y >= area.y + area.height ||
        !keys[f.name]
      )
        return;
      // Replace a coincident decorative instance with the named logical feature.
      for (let i = all.length - 1; i >= 0; i--)
        if (all[i].worldPosition.x === f.x && all[i].worldPosition.y === f.y)
          all.splice(i, 1);
      all.push({
        ...object(
          `feature:${index}`,
          keys[f.name],
          f.x,
          f.y,
          "world-feature",
          hash(index, 51),
          f.name === "Arbre monumental" ? 1.25 : 1,
        ),
        name: f.name,
      });
    });
    return all;
  }
  function layers(all, poses, hidden = new Set()) {
    const ground = [],
      volumes = [];
    for (const o of all) {
      if (hidden.has(o.id)) continue;
      ground.push({ type: "shadow", object: o, depth: o.worldPosition.y });
      if (o.occlusionProfile === "trunk-and-canopy") {
        volumes.push({
          type: "trunk",
          object: o,
          depth: o.worldPosition.y + 0.5,
        });
        volumes.push({
          type: "crown",
          object: o,
          depth: o.worldPosition.y + 0.85,
        });
      } else
        volumes.push({
          type: "object",
          object: o,
          depth: o.worldPosition.y + 0.5,
        });
    }
    for (const p of poses)
      volumes.push({ type: "person", person: p, depth: p.pos.y + 0.5 });
    volumes.sort(
      (a, b) =>
        a.depth - b.depth ||
        (a.object?.id || `person:${a.person.id}`).localeCompare(
          b.object?.id || `person:${b.person.id}`,
        ) ||
        a.type.localeCompare(b.type),
    );
    return { ground, volumes };
  }
  const assets = [];
  for (const kind of ["grass", "forest", "soil", "stone", "snow", "water"])
    for (let i = 0; i < 4; i++) assets.push(`${kind}-${i}`);
  for (let i = 0; i < 3; i++) assets.push(`oak-${i}-trunk`, `oak-${i}-crown`);
  assets.push(
    "pine-trunk",
    "pine-crown",
    "rock",
    "bush",
    "flowers",
    "reeds",
    "log",
    "cave",
  );
  return { TILE, area, hash, water, ground, tile, objects, layers, assets };
});
