/* Canvas compositor: static ground cache, individually removable volumes, actors. */
(function (root) {
  "use strict";
  const F = root.ForestModel,
    I = root.MicrocosmeIsland,
    G = root.MicrocosmeGraphics;
  async function create(canvas) {
    const ctx = canvas.getContext("2d"),
      images = new Map(),
      hidden = new Set(),
      all = F.objects();
    await Promise.all(
      F.assets.map(
        (key) =>
          new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
              // Rasterize each independent illustration once at its native
              // pixel size. Navigation only scales small cached bitmaps.
              const bitmap = document.createElement("canvas");
              bitmap.width = image.naturalWidth;
              bitmap.height = image.naturalHeight;
              const painter = bitmap.getContext("2d");
              painter.imageSmoothingEnabled = false;
              painter.drawImage(image, 0, 0);
              images.set(key, bitmap);
              resolve();
            };
            image.onerror = () =>
              reject(new Error("Ressource indisponible : " + key));
            image.src = "assets/forest/" + key + ".svg?v=v4-i1-1";
          }),
      ),
    );
    const cache = document.createElement("canvas");
    cache.width = F.area.width * 32;
    cache.height = F.area.height * 32;
    const g = cache.getContext("2d");
    g.imageSmoothingEnabled = false;
    const terrain = [];
    function paintTile(c, t, px, py) {
      c.drawImage(images.get(`${t.ground}-${t.variant}`), px, py);
      // All edges depend exclusively on neighbors in the unmodified world.
      if (t.banks) {
        c.fillStyle = "#987a48";
        for (let i = 0; i < 4; i++)
          if (t.banks & (1 << i)) {
            if (i === 0) c.fillRect(px, py, 32, 3);
            if (i === 1) c.fillRect(px + 29, py, 3, 32);
            if (i === 2) c.fillRect(px, py + 29, 32, 3);
            if (i === 3) c.fillRect(px, py, 3, 32);
            c.fillStyle = "#d1ba7b";
            for (let j = 0; j < 8; j++) {
              const n = F.hash(t.x * 32 + j, t.y + i),
                a = j * 4,
                b = 1 + (n % 2);
              if (i === 0) c.fillRect(px + a, py, 3, b);
              if (i === 1) c.fillRect(px + 32 - b, py + a, b, 3);
              if (i === 2) c.fillRect(px + a, py + 32 - b, 3, b);
              if (i === 3) c.fillRect(px, py + a, b, 3);
            }
            c.fillStyle = "#987a48";
          }
      }
      if (t.fringe && ["grass", "forest"].includes(t.ground)) {
        const dirs = [
            [0, -1],
            [1, 0],
            [0, 1],
            [-1, 0],
          ],
          colors = {
            grass: "#87ae40",
            forest: "#63933c",
            soil: "#c29f65",
            stone: "#879182",
            snow: "#dae4d3",
          };
        for (let i = 0; i < 4; i++)
          if (t.fringe & (1 << i)) {
            const [dx, dy] = dirs[i];
            c.fillStyle = colors[F.ground(I.terrain(t.x + dx, t.y + dy))];
            for (let j = 0; j < 16; j++)
              for (let depth = 0; depth < 10; depth += 2) {
                if (
                  F.hash(t.x * 64 + j * 2 + depth, t.y * 8 + i) % 12 <
                  depth + 2
                )
                  continue;
                const a = j * 2;
                if (i === 0) c.fillRect(px + a, py + depth, 2, 2);
                if (i === 1) c.fillRect(px + 30 - depth, py + a, 2, 2);
                if (i === 2) c.fillRect(px + a, py + 30 - depth, 2, 2);
                if (i === 3) c.fillRect(px + depth, py + a, 2, 2);
              }
          }
      }
      // A small beveled margin joins diagonal river turns. The logical water
      // cells/passability are untouched; this is the neighbor-derived shoreline.
      if (t.ground !== "water") {
        const wet = [
          [0, -1],
          [1, 0],
          [0, 1],
          [-1, 0],
        ].map(([dx, dy]) => F.water(I.terrain(t.x + dx, t.y + dy)));
        for (let corner = 0; corner < 4; corner++)
          if (wet[corner] && wet[(corner + 1) % 4]) {
            for (let a = 0; a < 12; a += 2) {
              const length = 12 - a;
              c.fillStyle = "#987a48";
              const right = corner === 0 || corner === 1,
                bottom = corner === 1 || corner === 2;
              c.fillRect(
                px + (right ? 32 - length : 0),
                py + (bottom ? 30 - a : a),
                length,
                2,
              );
              if (length > 4) {
                c.fillStyle = "#2985a8";
                c.fillRect(
                  px + (right ? 34 - length : 0),
                  py + (bottom ? 30 - a : a),
                  length - 2,
                  2,
                );
              }
            }
          }
      }
    }
    for (let y = F.area.y; y < F.area.y + F.area.height; y++)
      for (let x = F.area.x; x < F.area.x + F.area.width; x++) {
        const t = F.tile(x, y);
        terrain.push(t);
        paintTile(g, t, (x - F.area.x) * 32, (y - F.area.y) * 32);
      }
    const map = document.createElement("canvas");
    map.width = I.W;
    map.height = I.H;
    const mg = map.getContext("2d"),
      colors = {
        grass: "#91a65d",
        forest: "#486f42",
        soil: "#b59e6a",
        stone: "#858b7b",
        snow: "#ccdbc6",
        water: "#438b9d",
      };
    for (let y = 0; y < I.H; y++)
      for (let x = 0; x < I.W; x++) {
        mg.fillStyle = colors[F.ground(I.terrain(x, y))];
        mg.fillRect(x, y, 1, 1);
      }
    const actor = document.createElement("canvas");
    actor.width = 16;
    actor.height = 24;
    let lastLayers = [],
      frames = 0,
      lastTime = 0;
    function drawObject(o, part) {
      const p = o.worldPosition,
        s = o.scale,
        w = o.visualBounds.width,
        h = o.visualBounds.height;
      const x = (p.x + 0.5) * 32 - o.anchor.x,
        y = (p.y + 0.5) * 32 - o.anchor.y;
      if (part === "shadow") {
        ctx.fillStyle = "#264d323b";
        ctx.fillRect(
          (p.x + 0.5) * 32 - w * 0.27,
          (p.y + 0.5) * 32 - 3,
          w * 0.54,
          5,
        );
        return;
      }
      const key =
        o.assetKey === "oak"
          ? `oak-${o.variantSeed % 3}-${part}`
          : o.assetKey === "pine"
            ? `pine-${part}`
            : o.assetKey;
      if (key === "cave") {
        // Dark entrance is a conventionally frontal facade over the real portal.
        ctx.fillStyle = "#202d2b";
        ctx.fillRect(
          (p.x + 0.5) * 32 - 29 * s,
          (p.y + 0.5) * 32 - 60 * s,
          58 * s,
          59 * s,
        );
      }
      ctx.drawImage(images.get(key), x, y, w, h);
    }
    function drawPerson(p, selected) {
      const a = actor.getContext("2d");
      a.clearRect(0, 0, 16, 24);
      G.person(a, p.id, 0, 0, p.direction, p.frame);
      const x = (p.pos.x + 0.5) * 32,
        y = (p.pos.y + 0.5) * 32;
      if (selected === p.id) {
        ctx.strokeStyle = "#fff2b2";
        ctx.lineWidth = 1;
        ctx.strokeRect(x - 9, y - 3, 18, 5);
      }
      ctx.drawImage(actor, x - 10, y - 29, 20, 30);
    }
    function render({ camera, kind, poses, selected, time, reduced }) {
      frames++;
      lastTime = time;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "#192f2b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const scale = canvas.width / (camera.width * 32);
      ctx.setTransform(
        scale,
        0,
        0,
        scale,
        -camera.x * 32 * scale,
        -camera.y * 32 * scale,
      );
      if (kind === "global") {
        ctx.drawImage(map, 0, 0, I.W * 32, I.H * 32);
        ctx.strokeStyle = "#f7d98c";
        ctx.lineWidth = 20;
        ctx.strokeRect(
          F.area.x * 32,
          F.area.y * 32,
          F.area.width * 32,
          F.area.height * 32,
        );
        for (const p of poses)
          if (p.pos.space === "surface") {
            ctx.fillStyle = "#ffce79";
            ctx.fillRect(
              (p.pos.x + 0.5) * 32 - 24,
              (p.pos.y + 0.5) * 32 - 24,
              48,
              48,
            );
          }
        lastLayers = [];
        return;
      }
      if (kind === "interior") {
        for (let y = 0; y < 12; y++)
          for (let x = 0; x < 16; x++) {
            const wall = I.terrain(x, y, "cave") === "wall";
            ctx.drawImage(
              images.get("stone-" + (F.hash(x, y) % 4)),
              x * 32,
              y * 32,
            );
            if (wall) {
              ctx.fillStyle = "#243f3cba";
              ctx.fillRect(x * 32, y * 32, 32, 32);
            }
          }
        ctx.fillStyle = "#cfba73";
        ctx.fillRect(
          I.cave.inside.x * 32 + 6,
          I.cave.inside.y * 32 + 7,
          20,
          22,
        );
        poses
          .filter((p) => p.pos.space === "cave")
          .forEach((p) => drawPerson(p, selected));
        lastLayers = [];
        return;
      }
      ctx.drawImage(cache, F.area.x * 32, F.area.y * 32);
      // Surface currents are presentation-only and stop with reduced motion.
      const phase = reduced ? 0 : Math.floor(time / 300) % 4;
      ctx.fillStyle = "#a2ded0";
      for (const t of terrain)
        if (
          t.ground === "water" &&
          t.x >= camera.x - 1 &&
          t.x <= camera.x + camera.width &&
          t.y >= camera.y - 1 &&
          t.y <= camera.y + camera.height
        ) {
          for (let j = 0; j < 2; j++) {
            const px = 7 + (F.hash(t.x, j + t.y) % 14),
              py = 6 + ((phase * 3 + j * 10) % 20);
            ctx.fillRect(t.x * 32 + px, t.y * 32 + py, 3 + j, 1);
          }
        }
      const layers = F.layers(
        all,
        poses.filter((p) => p.pos.space === "surface"),
        hidden,
      );
      const visible = (e) => {
        const o = e.object;
        if (!o) return true;
        const p = o.worldPosition;
        return (
          p.x > camera.x - 5 &&
          p.x < camera.x + camera.width + 5 &&
          p.y > camera.y - 1 &&
          p.y < camera.y + camera.height + 5
        );
      };
      layers.ground
        .filter(visible)
        .forEach((e) => drawObject(e.object, "shadow"));
      lastLayers = layers.volumes.filter(visible);
      for (const e of lastLayers) {
        if (e.type === "person") drawPerson(e.person, selected);
        else drawObject(e.object, e.type === "object" ? "volume" : e.type);
      }
    }
    function minimap(canvas, camera, poses, kind) {
      const c = canvas.getContext("2d");
      c.imageSmoothingEnabled = false;
      c.fillStyle = "#203c35";
      c.fillRect(0, 0, 192, 120);
      if (kind === "interior") {
        c.fillStyle = "#a6af93";
        c.fillRect(8, 8, 176, 104);
        return;
      }
      c.drawImage(
        map,
        F.area.x,
        F.area.y,
        F.area.width,
        F.area.height,
        0,
        0,
        192,
        120,
      );
      c.strokeStyle = "#fff3bf";
      c.lineWidth = 1;
      c.strokeRect(
        (camera.x - F.area.x) * 4,
        (camera.y - F.area.y) * 4,
        camera.width * 4,
        camera.height * 4,
      );
      c.fillStyle = "#ffca79";
      for (const p of poses)
        if (p.pos.space === "surface")
          c.fillRect(
            (p.pos.x - F.area.x + 0.5) * 4 - 2,
            (p.pos.y - F.area.y + 0.5) * 4 - 2,
            4,
            4,
          );
    }
    return {
      render,
      minimap,
      hidden,
      objects: all,
      stats: () => ({
        assets: images.size,
        spriteBytes: [...images.values()].reduce(
          (n, c) => n + c.width * c.height * 4,
          0,
        ),
        groundCaches: 2,
        groundBytes:
          cache.width * cache.height * 4 + map.width * map.height * 4,
        objects: all.length,
        frames,
        lastTime,
        layers: lastLayers.map((e) => ({
          type: e.type,
          id: e.object?.id ?? e.person.id,
          depth: e.depth,
        })),
      }),
    };
  }
  root.ForestRenderer = { create };
})(globalThis);
