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
  const colors = {
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
    const b = I.bounds(view.scene),
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
        for (let j = 0; j < 4; j++) {
          const a = G.hash(n, j);
          rect(
            px + (a % (size - 3)),
            py + ((a >>> 8) % (size - 3)),
            2,
            1,
            kind === "ocean" || kind === "river" ? "#79b9be55" : "#d7dba42d",
          );
        }
        if (kind === "forest" && n % 3 !== 0) {
          // Reuse the original pixel tree at local scale, miniaturized on the island.
          ctx.save();
          ctx.translate(px, py);
          ctx.scale(size / 32, size / 32);
          G.tile(ctx, "tree", 0);
          ctx.restore();
        }
        if (kind === "plain" && n % 4 === 0) {
          rect(px + size * 0.4, py + size * 0.5, 2, 3, "#48774d");
          rect(px + size * 0.4, py + size * 0.5, 2, 1, "#eee2a3");
        }
        if (kind === "mountain") {
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
    const entrance = I.project(I.cave.outside, view.scene);
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
    button.textContent = region.name;
    button.setAttribute("aria-label", "Observer " + region.name);
    button.onclick = () => {
      view.local(region.id);
      render();
    };
    $("regions").append(button);
  });
  function render() {
    view.sync();
    const scene = view.scene,
      key = JSON.stringify(scene),
      local = scene.kind === "local";
    if (backgroundKey !== key) {
      backgroundKey = key;
      background();
      $("viewport").classList.remove("transition");
      void $("viewport").offsetWidth;
      $("viewport").classList.add("transition");
    }
    $("regions").hidden = scene.kind !== "global";
    $("outside").hidden = scene.kind !== "interior";
    $("scene-title").textContent =
      scene.kind === "global"
        ? "L’île entière"
        : local
          ? I.regions[scene.region].name
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
    }),
  };
})();
