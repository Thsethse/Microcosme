(function () {
  "use strict";
  const I = MicrocosmeIsland,
    G = MicrocosmeGraphics,
    C = IslandCamera,
    A = IslandArt,
    M = IslandMotion,
    motion = M.create(600),
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
    exteriorCamera = null,
    suppressClick = false;
  let visualTime = 0,
    lastVisualTime = 0,
    cameraMoving = false,
    lastFollow = null,
    lastRevision = -1;
  const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
  function visual(id) {
    return motion.sample(id, visualTime);
  }
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
  const tiles = new Map();
  const terrainRegion = document.createElement("canvas");
  let terrainRegionId = null;
  function tileAt(kind, x, y) {
    const key = kind + ":" + (G.hash(x + y * 96) % 8);
    let tile = tiles.get(key);
    if (!tile) {
      tile = document.createElement("canvas");
      tile.width = tile.height = 32;
      A.tile(tile.getContext("2d"), kind, x, y);
      tiles.set(key, tile);
    }
    return tile;
  }
  function background() {
    const scene = displayScene(),
      b = I.bounds(scene),
      size = canvas.width / b.width;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (scene.kind === "local") {
      const r = I.regions[scene.region];
      if (terrainRegionId !== r.id) {
        terrainRegionId = r.id;
        terrainRegion.width = r.width * 32;
        terrainRegion.height = r.height * 32;
        const g = terrainRegion.getContext("2d");
        g.imageSmoothingEnabled = false;
        for (let y = 0; y < r.height; y++)
          for (let x = 0; x < r.width; x++)
            g.drawImage(
              tileAt(I.terrain(r.x + x, r.y + y), r.x + x, r.y + y),
              x * 32,
              y * 32,
            );
      }
      ctx.drawImage(
        terrainRegion,
        (b.x - r.x) * 32,
        (b.y - r.y) * 32,
        b.width * 32,
        b.height * 32,
        0,
        0,
        canvas.width,
        canvas.height,
      );
    } else
      for (let y = Math.floor(b.y); y < Math.ceil(b.y + b.height); y++)
        for (let x = Math.floor(b.x); x < Math.ceil(b.x + b.width); x++)
          ctx.drawImage(
            tileAt(I.terrain(x, y, b.space), x, y),
            (x - b.x) * size,
            (y - b.y) * size,
            size + 0.2,
            size + 0.2,
          );
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
  let miniVisible = true,
    miniKey = "";
  const miniGround = document.createElement("canvas");
  miniGround.width = 192;
  miniGround.height = 144;
  function renderMinimap(scene) {
    const active = scene.kind !== "global";
    $("mini-toggle").hidden = !active;
    $("mini-panel").hidden = !active || !miniVisible;
    $("mini-toggle").textContent = miniVisible
      ? "Masquer la minicarte"
      : "Afficher la minicarte";
    $("mini-toggle").setAttribute("aria-expanded", String(miniVisible));
    if (!active || !miniVisible) return;
    const interior = scene.kind === "interior",
      r = interior
        ? { x: 0, y: 0, width: 16, height: 12, space: "cave" }
        : { ...I.regions[scene.region], space: "surface" },
      key = interior ? "cave" : String(scene.region);
    const sx = 192 / r.width,
      sy = 144 / r.height;
    if (key !== miniKey) {
      miniKey = key;
      const g = miniGround.getContext("2d");
      for (let y = 0; y < r.height; y++)
        for (let x = 0; x < r.width; x++) {
          const k = I.terrain(r.x + x, r.y + y, r.space);
          g.fillStyle = A.biomes[k]?.palette[0] || colors[k] || "#455b60";
          g.fillRect(x * sx, y * sy, sx, sy);
        }
    }
    const c = $("mini-map").getContext("2d");
    c.imageSmoothingEnabled = false;
    c.drawImage(miniGround, 0, 0);
    const b = I.bounds(scene),
      x = (b.x - r.x) * sx,
      y = (b.y - r.y) * sy,
      w = b.width * sx,
      h = b.height * sy;
    c.fillStyle = "#fff4bd22";
    c.fillRect(x, y, w, h);
    c.strokeStyle = "#fff4b6";
    c.lineWidth = 2;
    c.strokeRect(x + 1, y + 1, w - 2, h - 2);
    const cx = x + w / 2,
      cy = y + h / 2;
    c.strokeStyle = "#ffffff";
    c.beginPath();
    c.moveTo(cx - 4, cy);
    c.lineTo(cx + 4, cy);
    c.moveTo(cx, cy - 4);
    c.lineTo(cx, cy + 4);
    c.stroke();
    let resident = false;
    for (const residentPerson of world.state.people) {
      const p = { pos: visual(residentPerson.id).pos };
      if (
        p.pos.space !== r.space ||
        p.pos.x < r.x ||
        p.pos.x >= r.x + r.width ||
        p.pos.y < r.y ||
        p.pos.y >= r.y + r.height
      )
        continue;
      resident = true;
      c.fillStyle = "#f9aa73";
      c.fillRect(
        (p.pos.x - r.x + 0.5) * sx - 2,
        (p.pos.y - r.y + 0.5) * sy - 2,
        4,
        4,
      );
    }
    $("mini-title").textContent = interior
      ? "Repère intérieur · Grotte"
      : "Repère local · " + r.name;
    $("mini-position").textContent =
      "Vue (" +
      (b.x + b.width / 2).toFixed(1) +
      ", " +
      (b.y + b.height / 2).toFixed(1) +
      ")" +
      (resident ? " · Alix ●" : "");
    $("mini-map").setAttribute(
      "aria-label",
      $("mini-title").textContent +
        ". Cadre : fenêtre observée ; croix : centre de la vue ; point orange : Alix si présente. " +
        $("mini-position").textContent,
    );
  }
  $("mini-toggle").onclick = () => {
    miniVisible = !miniVisible;
    render();
  };
  function render() {
    visualTime = performance.now();
    const dt = lastVisualTime ? Math.min(64, visualTime - lastVisualTime) : 16;
    lastVisualTime = visualTime;
    motion.sync(
      world.state.people,
      visualTime,
      motionPreference.matches || document.hidden,
    );
    const followedVisual = visual(view.followed);
    if (view.followed && !followedVisual) view.follow(null);
    view.sync(followedVisual?.pos);
    const sceneKey = JSON.stringify(view.scene);
    const sceneChanged = sceneKey !== previousScene;
    if (sceneChanged) {
      previousScene = sceneKey;
      if (view.scene.kind === "local") {
        const r = I.regions[view.scene.region],
          p =
            view.scene.region === I.regionAt(I.cave.outside)
              ? I.cave.outside
              : { x: r.x + 16, y: r.y + 12 };
        camera = C.center(r, p.x, p.y, camera?.zoom || 1);
        if (exteriorCamera && sceneKey === exteriorCamera.scene) {
          camera = { ...exteriorCamera.camera };
          exteriorCamera = null;
        }
        $("region-toast").textContent = r.name;
        $("region-toast").hidden = false;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          $("region-toast").hidden = true;
        }, 2200);
      } else $("region-toast").hidden = true;
    }
    cameraMoving = false;
    if (view.followed && view.scene.kind === "local") {
      const v = followedVisual,
        desired = C.center(
          I.regions[view.scene.region],
          v.pos.x,
          v.pos.y,
          camera?.zoom || 1,
        );
      const snap =
        sceneChanged ||
        view.followed !== lastFollow ||
        v.revision !== lastRevision ||
        motionPreference.matches ||
        document.hidden;
      camera = snap ? desired : M.damp(camera, desired, dt);
      cameraMoving = camera.x !== desired.x || camera.y !== desired.y;
      lastRevision = v.revision;
    }
    lastFollow = view.followed;
    const scene = displayScene(),
      key = JSON.stringify(scene),
      local = scene.kind === "local";
    if (backgroundKey !== key) {
      backgroundKey = key;
      background();
      if (sceneChanged) {
        $("viewport").classList.remove("transition");
        void $("viewport").offsetWidth;
        $("viewport").classList.add("transition");
      }
    }
    $("viewport").classList.toggle("local", local);
    $("zoom-controls").hidden = !local;
    $("zoom-reset").textContent = Math.round((camera?.zoom || 1) * 100) + "%";
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
    renderMinimap(scene);
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
      const pose = visual(p.id);
      const projected = I.project(pose.pos, scene);
      node.hidden = !projected;
      if (!projected) continue;
      at(node, projected);
      node.firstChild.style.width =
        (scene.kind === "global" ? 9 : 32 * (scene.camera?.zoom || 1)) + "px";
      node.firstChild.style.height =
        (scene.kind === "global" ? 14 : 48 * (scene.camera?.zoom || 1)) + "px";
      node.classList.toggle("mini", scene.kind === "global");
      node.classList.toggle("selected", view.selected?.id === p.id);
      node.setAttribute("aria-label", p.name + " · ouvrir la fiche");
      const c = node.firstChild,
        key = pose.direction + ":" + pose.frame;
      if (node.dataset.pose !== key) {
        node.dataset.pose = key;
        const cctx = c.getContext("2d");
        cctx.clearRect(0, 0, 16, 24);
        G.person(cctx, p.id, 0, 0, pose.direction, pose.frame);
      }
    }
    const portal =
      scene.kind === "interior"
        ? I.project(I.cave.inside, scene)
        : local
          ? I.project(I.cave.outside, scene)
          : null;
    $("portal").hidden = !portal;
    if (portal) {
      const box = $("viewport").getBoundingClientRect();
      at($("portal"), {
        x: Math.max(34 / box.width, Math.min(1 - 34 / box.width, portal.x)),
        y: Math.max(34 / box.height, Math.min(1 - 34 / box.height, portal.y)),
      });
      $("portal").textContent =
        scene.kind === "interior" ? "↥ Sortir" : "↓ Entrer";
    }
    const p = world.state.people[0];
    $("activity").textContent = p.name + " · " + p.activity;
    $("following").textContent = view.followed
      ? "Suivi de " +
        world.state.people.find((p) => p.id === view.followed)?.name +
        " actif · la vue accompagne ses déplacements."
      : "Observation libre · Alix continue son activité hors écran.";
    $("pause").textContent = running ? "Mettre en pause" : "Reprendre";
    $("follow").textContent = view.followed
      ? "Arrêter le suivi"
      : "Suivre " + (view.selected?.name || "Alix");
    if (view.selected) {
      const a = view.selected;
      $("person-title").textContent = a.name;
      $("person-identity").textContent = "HABITANT · IDENTITÉ #" + a.id;
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
    if (
      !document.hidden &&
      !motionPreference.matches &&
      (motion.active(visualTime) || cameraMoving)
    )
      scheduleRender();
    else if (!frame) lastVisualTime = 0;
  }
  const pointers = new Map();
  let gesture = null,
    frame = 0;
  function scheduleRender() {
    if (!frame)
      frame = requestAnimationFrame(() => {
        frame = 0;
        render();
      });
  }
  function point(e) {
    const b = $("viewport").getBoundingClientRect();
    return { x: (e.clientX - b.x) / b.width, y: (e.clientY - b.y) / b.height };
  }
  function rebase() {
    const a = [...pointers.values()];
    if (!a.length) {
      gesture = null;
      return;
    }
    const mid =
      a.length > 1
        ? { x: (a[0].x + a[1].x) / 2, y: (a[0].y + a[1].y) / 2 }
        : a[0];
    gesture = {
      start: { ...camera },
      mid,
      anchor: {
        x: camera.x + mid.x * camera.width,
        y: camera.y + mid.y * camera.height,
      },
      distance:
        a.length > 1
          ? Math.hypot(a[0].x - a[1].x, (a[0].y - a[1].y) * 0.75)
          : 0,
    };
  }
  function capture(id) {
    try {
      $("viewport").setPointerCapture(id);
    } catch {
      /* pointer was cancelled */
    }
  }
  $("viewport").addEventListener("pointerdown", (e) => {
    if (!pointers.size) suppressClick = false;
    if (view.scene.kind !== "local" || e.button > 0) return;
    pointers.set(e.pointerId, point(e));
    rebase();
    if (pointers.size > 1) {
      suppressClick = true;
      view.follow(null);
      for (const id of pointers.keys()) capture(id);
    }
  });
  $("viewport").addEventListener("pointermove", (e) => {
    if (!pointers.has(e.pointerId) || !gesture) return;
    pointers.set(e.pointerId, point(e));
    const a = [...pointers.values()],
      r = I.regions[view.scene.region];
    if (a.length > 1) {
      const mid = { x: (a[0].x + a[1].x) / 2, y: (a[0].y + a[1].y) / 2 },
        distance = Math.hypot(a[0].x - a[1].x, (a[0].y - a[1].y) * 0.75);
      camera = C.pinch(
        r,
        gesture.start,
        gesture.anchor,
        mid,
        distance / Math.max(0.001, gesture.distance),
      );
    } else {
      const dx = a[0].x - gesture.mid.x,
        dy = a[0].y - gesture.mid.y,
        box = $("viewport").getBoundingClientRect();
      if (!suppressClick && Math.hypot(dx * box.width, dy * box.height) < 8)
        return;
      camera = C.pan(r, gesture.start, dx, dy);
    }
    e.preventDefault();
    suppressClick = true;
    view.follow(null);
    capture(e.pointerId);
    scheduleRender();
  });
  function end(e) {
    if (suppressClick && pointers.has(e.pointerId)) e.preventDefault();
    if (!pointers.has(e.pointerId)) return;
    if (e.type !== "pointerup") suppressClick = true;
    pointers.delete(e.pointerId);
    rebase();
  }
  for (const name of ["pointerup", "pointercancel", "lostpointercapture"])
    $("viewport").addEventListener(name, end);
  $("viewport").addEventListener(
    "click",
    (e) => {
      if (suppressClick) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    },
    true,
  );
  function zoomBy(factor) {
    if (view.scene.kind !== "local") return;
    const start = camera;
    camera = C.pinch(
      I.regions[view.scene.region],
      start,
      { x: start.x + start.width / 2, y: start.y + start.height / 2 },
      { x: 0.5, y: 0.5 },
      factor,
    );
    render();
  }
  $("zoom-in").onclick = () => zoomBy(1.25);
  $("zoom-out").onclick = () => zoomBy(0.8);
  $("zoom-reset").onclick = () => {
    if (view.scene.kind === "local") {
      const c = camera;
      camera = C.center(
        I.regions[view.scene.region],
        c.x + c.width / 2,
        c.y + c.height / 2,
      );
      render();
    }
  };
  document.addEventListener("keydown", (e) => {
    if (sheet.open || view.scene.kind !== "local") return;
    const d = {
      ArrowLeft: [-0.1, 0],
      ArrowRight: [0.1, 0],
      ArrowUp: [0, -0.1],
      ArrowDown: [0, 0.1],
    }[e.key];
    if (!d) return;
    e.preventDefault();
    view.follow(null);
    camera = C.pan(I.regions[view.scene.region], camera, -d[0], -d[1]);
    render();
  });
  for (const f of I.features) {
    const b = document.createElement("button");
    b.textContent = f.name;
    b.onclick = () => {
      view.local(I.regionAt(f));
      render();
      camera = C.center(
        I.regions[view.scene.region],
        f.x,
        f.y,
        camera?.zoom || 1,
      );
      render();
    };
    $("atlas").append(b);
  }
  $("biomes").textContent = I.biomes.map((b) => b.name).join(" · ");
  function returnToWorld() {
    for (const id of pointers.keys()) {
      try {
        $("viewport").releasePointerCapture(id);
      } catch {}
    }
    pointers.clear();
    gesture = null;
    suppressClick = false;
    exteriorCamera = null;
    if (sheet.open) {
      opener = $("global");
      sheet.close();
    }
    view.global();
    render();
    $("viewport").scrollIntoView({ block: "nearest", behavior: "instant" });
  }
  $("global").onclick = returnToWorld;
  $("sheet-world").onclick = returnToWorld;
  $("outside").onclick = () => {
    view.exit();
    render();
  };
  $("portal").onclick = () => {
    if (view.scene.kind === "interior") view.exit();
    else {
      exteriorCamera = {
        scene: JSON.stringify(view.scene),
        camera: { ...camera },
      };
      view.enter();
    }
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
    view.follow(view.followed ? null : view.selected?.id || 1);
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
  // Activate a short touch on pointerup; swallow its compatibility click only.
  // This avoids the lost/delayed compatibility click after a captured Safari pan.
  let touchTarget = null,
    lastTouch = null;
  document.addEventListener("pointerdown", (e) => {
    lastTouch = null;
    if (e.pointerType !== "touch") return;
    const button = e.target.closest("button");
    touchTarget = button
      ? { button, id: e.pointerId, x: e.clientX, y: e.clientY }
      : null;
  });
  document.addEventListener("pointerup", (e) => {
    const t = touchTarget;
    if (!t || t.id !== e.pointerId) return;
    touchTarget = null;
    if (
      e.pointerType !== "touch" ||
      Math.hypot(e.clientX - t.x, e.clientY - t.y) >= 8 ||
      !t.button.contains(e.target)
    )
      return;
    if ($("viewport").contains(t.button) && suppressClick) return;
    e.preventDefault();
    lastTouch = { button: t.button, time: performance.now() };
    t.button.click();
  });
  document.addEventListener("pointercancel", () => {
    touchTarget = null;
  });
  document.addEventListener(
    "click",
    (e) => {
      if (
        e.isTrusted &&
        lastTouch &&
        performance.now() - lastTouch.time < 700
      ) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    },
    true,
  );
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
      cancelAnimationFrame(frame);
      frame = 0;
      lastVisualTime = 0;
      motion.sync(world.state.people, performance.now(), true);
      running = false;
      $("status").textContent =
        "Onglet masqué : simulation arrêtée. Touchez Reprendre au retour ; aucun rattrapage.";
    }
    schedule();
    render();
  });
  window.addEventListener("pagehide", () => {
    clearInterval(timer);
    cancelAnimationFrame(frame);
    frame = 0;
    lastVisualTime = 0;
  });
  window.addEventListener("pageshow", () => {
    lastVisualTime = 0;
    render();
    schedule();
  });
  motionPreference.addEventListener("change", () => render());
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
      tileCache: tiles.size,
      pointers: pointers.size,
      minimapVisible: miniVisible,
      visuals: world.state.people.map((p) => ({
        id: p.id,
        ...motion.sample(p.id, performance.now()),
      })),
      animationScheduled: Boolean(frame),
      motionTracks: motion.size,
    }),
  };
})();
