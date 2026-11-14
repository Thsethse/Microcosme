(function () {
  "use strict";
  const I = MicrocosmeIsland,
    G = MicrocosmeGraphics,
    world = I.create(),
    view = I.createView(world);
  const $ = (id) => document.getElementById(id),
    canvas = $("land"),
    ctx = canvas.getContext("2d");
  const sheet = $("sheet"),
    actorNodes = new Map();
  let backgroundKey = "",
    running = true,
    timer = null,
    opener = null;
  let camera = null,
    previousScene = "",
    toastTimer = null,
    drag = null,
    suppressClick = false;
  function displayScene() {
    return view.scene.kind === "local" ? { ...view.scene, camera } : view.scene;
  }
  const colors = {
    jungle: "#256647",
    swamp: "#637e65",
    cliff: "#858e91",
    snow: "#dbe9de",
    volcano: "#654948",
    desert: "#c7a269",
    canyon: "#b67352",
    heath: "#92936b",
    tundra: "#a7b6a0",
    mangrove: "#447e70",
    water: "#438da2",

    ocean: "#24566e",
    sand: "#d2bf85",
    river: "#65b6c5",
    mountain: "#84897c",
    forest: "#56804b",
    plain: "#82a85a",
    wall: "#3c4249",
    floor: "#76756b",
  };
  function rect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }
  function background() {
    const b = I.bounds(displayScene()),
      size = canvas.width / b.width;
    ctx.imageSmoothingEnabled = false;
    for (let y = 0; y < b.height; y++)
      for (let x = 0; x < b.width; x++) {
        const wx = b.x + x,
          wy = b.y + y,
          kind = I.terrain(wx, wy, b.space),
          n = G.hash(wx + wy * I.W),
          px = x * size,
          py = y * size;
        rect(px, py, size, size, colors[kind]);
        for (let j = 0; j < (view.scene.kind === "global" ? 1 : 4); j++) {
          const a = G.hash(n, j);
          rect(
            px + (a % (size - 3)),
            py + ((a >>> 8) % (size - 3)),
            2,
            1,
            kind === "ocean" || kind === "river" ? "#79b9be55" : "#d7dba42d",
          );
        }
        if (
          view.scene.kind !== "global" &&
          ["forest", "jungle", "mangrove"].includes(kind) &&
          n % 3 !== 0
        ) {
          // Reuse the original pixel tree at local scale, miniaturized on the island.
          ctx.save();
          ctx.translate(px, py);
          ctx.scale(size / 32, size / 32);
          G.tile(ctx, "tree", 0);
          ctx.restore();
        }
        if (
          [
            "desert",
            "canyon",
            "heath",
            "swamp",
            "mangrove",
            "volcano",
            "snow",
            "jungle",
          ].includes(kind)
        ) {
          const u = size / 8;
          if (kind === "desert") {
            rect(px + u, py + u * 3, u * 6, u, "#e9c88c");
            rect(px + u * 3, py + u * 4, u * 4, u, "#aa895a");
          }
          if (kind === "canyon") {
            rect(px, py + u * 3, size, u * 2, "#734c46");
            rect(px, py + u * 2, size, u, "#e5ab78");
          }
          if (kind === "volcano") {
            rect(px + u, py + u * 2, u * 6, u * 5, "#4a4246");
            rect(px + u * 3, py + u, u * 2, u * 3, "#e88145");
          }
          if (kind === "snow") {
            rect(px + u, py + u * 3, u * 6, u, "#aad0d6");
            rect(px + u * 2, py + u * 2, u * 3, u, "#f2f4df");
          }
          if (["heath", "swamp", "mangrove", "jungle"].includes(kind)) {
            rect(px + u * 2, py + u * 3, u, u * 3, "#345b49");
            rect(
              px + u * 4,
              py + u * 2,
              u * 2,
              u * 2,
              kind === "heath" ? "#bea1c4" : "#7da776",
            );
          }
        }
        if (kind === "plain" && n % 4 === 0) {
          rect(px + size * 0.4, py + size * 0.5, 2, 3, "#48774d");
          rect(px + size * 0.4, py + size * 0.5, 2, 1, "#eee2a3");
        }
        if (
          ["mountain", "snow", "tundra", "cliff"].includes(kind) &&
          (view.scene.kind !== "global" || n % 4 === 0)
        ) {
          const u = size / 8;
          rect(px + u, py + u * 2, u * 6, u * 5, "#555f60");
          rect(px + u * 2, py + u, u * 4, u * 5, "#9fa490");
          rect(px + u * 3, py, u * 2, u * 3, "#d8d6b6");
          rect(px + u * 5, py + u * 3, u * 2, u * 4, "#747d76");
        }
        if (kind === "wall" && n % 3 === 0)
          rect(px + 3, py + 3, size - 6, 3, "#69747b");
        if (kind === "floor" && wx === 8 && wy === 3) {
          rect(
            px + size * 0.3,
            py + size * 0.2,
            size * 0.3,
            size * 0.6,
            "#88d6cf",
          );
          rect(
            px + size * 0.5,
            py + size * 0.1,
            size * 0.2,
            size * 0.7,
            "#c7f2db",
          );
        }
      }
    // Detailed objects only in the camera window; no island-wide object Canvas/cache.
    if (view.scene.kind === "local")
      for (const f of I.features) {
        const p = I.project(f, displayScene());
        if (!p) continue;
        const x = p.x * canvas.width,
          y = p.y * canvas.height,
          u = size / 16;
        const box = (a, b, w, h, c) =>
          rect(x + a * u, y + b * u, w * u, h * u, c);
        if (f.category === "water") {
          box(-7, -4, 14, 8, "#3f91b0");
          box(-5, -3, 9, 2, "#a1dce0");
          if (f.name === "Cascade")
            for (let j = 0; j < (view.scene.kind === "global" ? 1 : 4); j++)
              box(-3, -8 + j * 3, 5, 2, "#d1f4ed");
          if (f.name === "Source chaude")
            for (let j = 0; j < 3; j++) box(-4 + j * 3, -8, 1, 3, "#ece6d8");
        } else if (f.category === "relief") {
          box(-7, -5, 14, 11, "#626f70");
          box(-4, -3, 8, 8, "#273943");
          if (f.name === "Arche naturelle") {
            box(-3, -6, 6, 7, colors.plain);
            box(-6, -8, 12, 3, "#b7aa83");
          }
          if (f.name === "Champ de lave") {
            box(-6, -3, 12, 7, "#cf613b");
            box(-4, -1, 7, 2, "#ffba66");
          }
          if (f.name === "Grotte de glace") box(-6, -7, 12, 3, "#c6ece8");
          if (f.name === "Crête" || f.name === "Plateau")
            box(-6, -7, 12, 3, "#c3bea0");
        } else if (f.category === "plants") {
          if (f.name.includes("Arbre")) {
            ctx.save();
            ctx.translate(x - size / 2, y - size / 2);
            ctx.scale(size / 32, size / 32);
            G.tile(ctx, "tree", 0);
            ctx.restore();
            if (f.name === "Arbre fruitier") box(-3, -3, 3, 3, "#ed9470");
          } else {
            const stone = ["Roche", "Gisement", "Bois mort"].includes(f.name);
            box(-5, -1, 11, 5, stone ? "#9b9b86" : "#4b7648");
            for (let j = 0; j < 3; j++)
              box(
                -4 + j * 4,
                -4,
                2,
                4,
                stone
                  ? "#ccb688"
                  : f.name === "Fleurs" || f.name === "Plante rare"
                    ? "#ebadd1"
                    : "#c2cc83",
              );
          }
        } else {
          box(-6, 3, 13, 3, "#5b6256");
          box(-5, -5, 4, 8, "#c3b58c");
          box(3, -8, 3, 12, "#a0a28b");
          if (f.name === "Épave") box(-7, 0, 14, 4, "#9d714f");
          if (f.name === "Arbre monumental") {
            box(-2, -8, 4, 12, "#8a6449");
            box(-8, -12, 16, 9, "#38765a");
          }
          if (f.name === "Cratère ancien") {
            box(-8, -5, 16, 10, "#ab8f72");
            box(-5, -3, 10, 6, "#67574e");
          }
        }
      }
    const entrance = I.project(I.cave.outside, displayScene());
    if (entrance) {
      const x = entrance.x * canvas.width,
        y = entrance.y * canvas.height;
      rect(x - size * 0.5, y - size * 0.5, size, size, "#b5ad8a");
      rect(x - size * 0.3, y - size * 0.3, size * 0.6, size * 0.8, "#202f36");
    }
    if (view.scene.kind === "interior") {
      const p = I.project(I.cave.inside, view.scene);
      rect(
        p.x * canvas.width - size * 0.4,
        p.y * canvas.height - size * 0.4,
        size * 0.8,
        size * 0.8,
        "#e8d79b",
      );
    }
  }
  function at(el, p) {
    el.style.left = p.x * 100 + "%";
    el.style.top = p.y * 100 + "%";
  }
  function openPerson(id, source) {
    view.select(id);
    opener = source;
    render();
    if (!sheet.open) sheet.showModal();
  }
  I.regions.forEach((region) => {
    const button = document.createElement("button");
    button.textContent = "";
    button.setAttribute("aria-label", "Observer " + region.name);
    button.onclick = () => {
      view.local(region.id);
      render();
    };
    $("regions").append(button);
  });
  function render() {
    view.sync();
    const sceneKey = JSON.stringify(view.scene);
    if (sceneKey !== previousScene) {
      previousScene = sceneKey;
      if (view.scene.kind === "local") {
        const r = I.regions[view.scene.region],
          p =
            view.scene.region === I.regionAt(I.cave.outside)
              ? I.cave.outside
              : { x: r.x + 16, y: r.y + 12 };
        camera = I.cameraFor(r.id, p.x, p.y);
        $("region-toast").textContent = r.name;
        $("region-toast").hidden = false;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          $("region-toast").hidden = true;
        }, 2200);
      } else $("region-toast").hidden = true;
    }
    if (view.followed && view.scene.kind === "local") {
      const p = world.state.people.find((p) => p.id === view.followed);
      camera = I.cameraFor(view.scene.region, p.pos.x, p.pos.y);
    }
    const scene = displayScene(),
      key = JSON.stringify(scene),
      local = scene.kind === "local";
    if (backgroundKey !== key) {
      backgroundKey = key;
      background();
      $("viewport").classList.remove("transition");
      void $("viewport").offsetWidth;
      $("viewport").classList.add("transition");
    }
    $("viewport").classList.toggle("local", local);
    $("regions").hidden = scene.kind !== "global";
    $("outside").hidden = scene.kind !== "interior";
    $("scene-title").textContent =
      scene.kind === "global"
        ? "L’île entière"
        : local
          ? "Observation locale"
          : "La grotte des sources";
    $("scene-help").textContent =
      scene.kind === "global"
        ? "Touchez une région pour l’observer."
        : local
          ? "Touchez un habitant ou l’entrée de la grotte."
          : "Un plan intérieur, dans le même monde.";
    $("clock").textContent = "Temps du monde · " + world.state.tick;
    const ids = new Set(world.state.people.map((p) => p.id));
    for (const [id, node] of actorNodes)
      if (!ids.has(id)) {
        node.remove();
        actorNodes.delete(id);
      }
    for (const p of world.state.people) {
      let node = actorNodes.get(p.id);
      if (!node) {
        node = document.createElement("button");
        node.className = "actor";
        node.dataset.id = p.id;
        const c = document.createElement("canvas");
        c.width = 16;
        c.height = 24;
        node.append(c);
        node.onclick = () => openPerson(p.id, node);
        $("actors").append(node);
        actorNodes.set(p.id, node);
      }
      const projected = I.project(p.pos, scene);
      node.hidden = !projected;
      if (!projected) continue;
      at(node, projected);
      node.classList.toggle("mini", scene.kind === "global");
      node.classList.toggle("selected", view.selected?.id === p.id);
      node.setAttribute("aria-label", p.name + " · ouvrir la fiche");
      const c = node.firstChild,
        cctx = c.getContext("2d");
      cctx.clearRect(0, 0, 16, 24);
      G.person(
        cctx,
        p.id,
        0,
        0,
        0,
        matchMedia("(prefers-reduced-motion: reduce)").matches
          ? 0
          : world.state.tick % 2
            ? 1
            : 2,
      );
    }
    const portal =
      scene.kind === "interior"
        ? I.project(I.cave.inside, scene)
        : local
          ? I.project(I.cave.outside, scene)
          : null;
    $("portal").hidden = !portal;
    if (portal) {
      at($("portal"), portal);
      $("portal").textContent =
        scene.kind === "interior" ? "↥ Sortir" : "↓ Entrer dans la grotte";
    }
    const p = world.state.people[0];
    $("activity").textContent = p.name + " · " + p.activity;
    $("following").textContent = view.followed
      ? "Suivi d’Alix actif · la vue accompagne ses déplacements."
      : "Observation libre · Alix continue son activité hors écran.";
    $("pause").textContent = running ? "Mettre en pause" : "Reprendre";
    $("follow").textContent = view.followed
      ? "Arrêter le suivi"
      : "Suivre Alix";
    if (view.selected) {
      const a = view.selected;
      $("details").textContent =
        a.activity +
        " · " +
        (a.pos.space === "cave"
          ? "Grotte"
          : I.regions[I.regionAt(a.pos)].name) +
        " · position (" +
        a.pos.x +
        ", " +
        a.pos.y +
        ") · temps " +
        world.state.tick;
    }
  }
  $("viewport").addEventListener("pointerdown", (e) => {
    suppressClick = false;
    if (view.scene.kind !== "local" || e.button !== 0) return;
    drag = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      camera: { ...camera },
      moved: false,
    };
    suppressClick = false;
  });
  $("viewport").addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x,
      dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 8) return;
    drag.moved = true;
    suppressClick = true;
    view.follow(null);
    $("viewport").setPointerCapture(e.pointerId);
    const box = $("viewport").getBoundingClientRect();
    camera = I.cameraFor(
      view.scene.region,
      drag.camera.x + 8 - (dx / box.width) * 16,
      drag.camera.y + 6 - (dy / box.height) * 12,
    );
    render();
  });
  for (const event of ["pointerup", "pointercancel"])
    $("viewport").addEventListener(event, (e) => {
      if (drag?.id === e.pointerId) drag = null;
    });
  $("viewport").addEventListener(
    "click",
    (e) => {
      if (suppressClick) {
        e.preventDefault();
        e.stopImmediatePropagation();
        suppressClick = false;
      }
    },
    true,
  );
  document.addEventListener("keydown", (e) => {
    if (sheet.open || view.scene.kind !== "local") return;
    const d = {
      ArrowLeft: [-2, 0],
      ArrowRight: [2, 0],
      ArrowUp: [0, -2],
      ArrowDown: [0, 2],
    }[e.key];
    if (!d) return;
    e.preventDefault();
    view.follow(null);
    camera = I.cameraFor(
      view.scene.region,
      camera.x + 8 + d[0],
      camera.y + 6 + d[1],
    );
    render();
  });
  for (const f of I.features) {
    const b = document.createElement("button");
    b.textContent = f.name;
    b.onclick = () => {
      view.local(I.regionAt(f));
      render();
      camera = I.cameraFor(view.scene.region, f.x, f.y);
      render();
    };
    $("atlas").append(b);
  }
  $("biomes").textContent = I.biomes.map((b) => b.name).join(" · ");
  $("global").onclick = () => {
    view.global();
    render();
  };
  $("outside").onclick = () => {
    view.exit();
    render();
  };
  $("portal").onclick = () => {
    if (view.scene.kind === "interior") view.exit();
    else view.enter();
    render();
  };
  $("resident").onclick = () => openPerson(1, $("resident"));
  $("locate").onclick = () => {
    const p = world.state.people[0];
    view.follow(p.id);
    view.follow(null);
    render();
  };
  $("follow").onclick = () => {
    view.follow(view.followed ? null : 1);
    sheet.close();
    render();
  };
  sheet.addEventListener("close", () => {
    if (opener && !opener.hidden) opener.focus();
    else $("resident").focus();
  });
  sheet.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const buttons = [...sheet.querySelectorAll("button")],
      first = buttons[0],
      last = buttons.at(-1);
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
  function schedule() {
    clearInterval(timer);
    timer = null;
    if (running && !document.hidden)
      timer = setInterval(() => {
        world.step();
        render();
      }, 600);
  }
  $("pause").onclick = () => {
    running = !running;
    schedule();
    render();
  };
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      running = false;
      $("status").textContent =
        "Onglet masqué : simulation arrêtée. Touchez Reprendre au retour ; aucun rattrapage.";
    }
    schedule();
    render();
  });
  window.addEventListener("pagehide", () => clearInterval(timer));
  window.addEventListener("pageshow", () => schedule());
  render();
  schedule();
  // Read-only diagnostics: detached snapshots, never the authoritative object.
  window.IslandDiagnostics = {
    snapshot: () => ({
      world: JSON.parse(JSON.stringify(world.state)),
      scene: { ...view.scene },
      followed: view.followed,
      camera: camera ? { ...camera } : null,
      viewport: I.bounds(displayScene()),
    }),
  };
})();
