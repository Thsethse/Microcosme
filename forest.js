(async function () {
  "use strict";
  const I = MicrocosmeIsland,
    C = IslandCamera,
    M = IslandMotion,
    F = ForestModel,
    $ = (id) => document.getElementById(id);
  const world = I.create(),
    view = I.createView(world),
    motion = M.create(600),
    pref = matchMedia("(prefers-reduced-motion: reduce)");
  const viewport = $("viewport"),
    sheet = $("sheet"),
    actors = new Map(),
    pointers = new Map();
  let renderer,
    camera = C.center(F.area, 40, 30, 0.75),
    exterior = null,
    running = true,
    timer = null,
    frame = 0,
    lastTime = 0,
    lastFollow = null,
    lastRevision = -1,
    lastKind = "",
    gesture = null,
    suppressClick = false,
    miniVisible = true,
    opener = null;
  const now = () => performance.now();
  view.local(4);
  function kind() {
    return view.scene.kind;
  }
  function bounds() {
    return kind() === "global"
      ? { x: 0, y: 0, width: I.W, height: I.H, space: "surface" }
      : kind() === "interior"
        ? { x: 0, y: 0, width: 16, height: 12, space: "cave" }
        : { ...camera, space: "surface" };
  }
  function projection(pos) {
    const b = bounds();
    if (
      pos.space !== b.space ||
      pos.x + 0.5 < b.x ||
      pos.y + 0.5 < b.y ||
      pos.x + 0.5 > b.x + b.width ||
      pos.y + 0.5 > b.y + b.height
    )
      return null;
    return {
      x: (pos.x + 0.5 - b.x) / b.width,
      y: (pos.y + 0.5 - b.y) / b.height,
    };
  }
  function place(el, p) {
    el.style.left = p.x * 100 + "%";
    el.style.top = p.y * 100 + "%";
  }
  function schedule() {
    if (!frame && !document.hidden)
      frame = requestAnimationFrame(() => {
        frame = 0;
        render();
      });
  }
  function openPerson(id, source) {
    if (!view.select(id)) return;
    opener = source;
    render();
    if (!sheet.open) sheet.showModal();
  }
  function clearGesture() {
    for (const id of pointers.keys()) {
      try {
        viewport.releasePointerCapture(id);
      } catch {}
    }
    pointers.clear();
    gesture = null;
    suppressClick = false;
  }
  function showPlace(x, y, label) {
    clearGesture();
    view.local(I.regionAt({ space: "surface", x, y }));
    camera = C.center(F.area, x, y, camera.zoom);
    $("scene-title").textContent = label;
    render();
  }
  function updateActors(poses) {
    const ids = new Set(world.state.people.map((p) => p.id));
    for (const [id, node] of actors)
      if (!ids.has(id)) {
        node.remove();
        actors.delete(id);
      }
    for (const p of world.state.people) {
      let node = actors.get(p.id);
      if (!node) {
        node = document.createElement("button");
        node.className = "actor";
        node.dataset.id = p.id;
        node.onclick = () => openPerson(p.id, node);
        $("actors").append(node);
        actors.set(p.id, node);
      }
      const pose = poses.find((v) => v.id === p.id),
        p2 = projection(pose.pos);
      node.hidden = !p2;
      if (!p2) continue;
      place(node, p2);
      node.classList.toggle("selected", view.selected?.id === p.id);
      node.setAttribute("aria-label", p.name + " · ouvrir la fiche");
    }
  }
  function render() {
    if (!renderer) return;
    const time = now(),
      dt = lastTime ? Math.min(64, time - lastTime) : 16;
    lastTime = time;
    motion.sync(world.state.people, time, pref.matches || document.hidden);
    const poses = world.state.people.map((p) => ({
        id: p.id,
        ...motion.sample(p.id, time),
      })),
      followed = poses.find((p) => p.id === view.followed);
    if (view.followed && !followed) view.follow(null);
    view.sync(followed?.pos);
    const changed = lastKind !== kind();
    let cameraMoving = false;
    if (followed && kind() === "local") {
      const desired = C.center(
        F.area,
        followed.pos.x + 0.5,
        followed.pos.y + 0.5,
        camera.zoom,
      );
      camera =
        changed ||
        view.followed !== lastFollow ||
        followed.revision !== lastRevision ||
        pref.matches
          ? desired
          : M.damp(camera, desired, dt);
      cameraMoving = camera.x !== desired.x || camera.y !== desired.y;
      lastRevision = followed.revision;
    }
    lastFollow = view.followed;
    lastKind = kind();
    renderer.render({
      camera: bounds(),
      kind: kind(),
      poses,
      selected: view.selected?.id,
      time,
      reduced: pref.matches,
    });
    renderer.minimap($("mini-map"), camera, poses, kind());
    updateActors(poses);
    $("map-panel").hidden = !miniVisible || kind() === "global";
    $("mini-toggle").hidden = kind() === "global";
    $("mini-toggle").setAttribute("aria-expanded", String(miniVisible));
    $("mini-toggle").textContent = miniVisible
      ? "Masquer la minicarte"
      : "Afficher la minicarte";
    $("zoom-controls").hidden = kind() !== "local";
    $("zoom-reset").textContent = Math.round(camera.zoom * 100) + " %";
    $("outside").hidden = kind() !== "interior";
    if (changed)
      $("scene-title").textContent =
        kind() === "global"
          ? "L’île, vue d’ensemble"
          : kind() === "interior"
            ? "La grotte des sources"
            : "La Forêt des Sources";
    $("clearing").setAttribute(
      "aria-pressed",
      String(kind() === "local" && !view.followed),
    );
    $("following").textContent = view.followed
      ? "Dans les pas de " +
        world.state.people.find((p) => p.id === view.followed)?.name
      : "Vue libre · la vie continue hors champ";
    $("clock").textContent = "Temps du monde · " + world.state.tick;
    $("pause").textContent = running ? "Mettre en pause" : "Reprendre";
    $("activity").textContent = world.state.people
      .map((p) => p.name + " · " + p.activity)
      .join(" / ");
    const first = world.state.people[0];
    $("resident").textContent = first
      ? first.name + " · ouvrir la fiche"
      : "Aucun habitant";
    $("resident").disabled = !first;
    $("locate").disabled = !first;
    const portal =
      kind() === "local"
        ? projection(I.cave.outside)
        : kind() === "interior"
          ? projection(I.cave.inside)
          : null;
    $("portal").hidden = !portal;
    if (portal) {
      const b = viewport.getBoundingClientRect();
      place($("portal"), {
        x: Math.max(34 / b.width, Math.min(1 - 34 / b.width, portal.x)),
        y: Math.max(34 / b.height, Math.min(1 - 34 / b.height, portal.y)),
      });
      $("portal").textContent = kind() === "interior" ? "Sortir" : "Entrer";
    }
    const p = view.selected;
    if (p) {
      $("person-title").textContent = p.name;
      $("person-identity").textContent = "HABITANT · IDENTITÉ #" + p.id;
      $("details").textContent =
        p.activity +
        " · " +
        (p.pos.space === "cave" ? "Grotte" : "Île") +
        " · position logique (" +
        p.pos.x +
        ", " +
        p.pos.y +
        ") · temps " +
        world.state.tick;
      $("follow").textContent =
        view.followed === p.id ? "Arrêter le suivi" : "Suivre " + p.name;
    }
    if (
      !document.hidden &&
      (motion.active(time) ||
        cameraMoving ||
        (running && !pref.matches && kind() === "local"))
    )
      schedule();
    else lastTime = 0;
  }
  function start() {
    if (timer !== null) clearInterval(timer);
    timer = null;
    if (running && !document.hidden)
      timer = setInterval(() => {
        world.step();
        render();
      }, 600);
  }
  function global() {
    clearGesture();
    exterior = null;
    if (sheet.open) sheet.close();
    view.global();
    render();
    $("global").focus();
    viewport.scrollIntoView({ block: "nearest", behavior: "instant" });
  }
  $("global").onclick = global;
  $("sheet-world").onclick = global;
  $("clearing").onclick = () => showPlace(40, 30, "La clairière");
  $("river").onclick = () => showPlace(49, 28, "La rivière");
  $("cave").onclick = () => showPlace(66, 20, "La grotte");
  $("resident").onclick = () => {
    const p = world.state.people[0];
    if (p) openPerson(p.id, $("resident"));
  };
  $("locate").onclick = () => {
    const p = world.state.people[0];
    if (p) {
      view.follow(p.id);
      render();
      view.follow(null);
      render();
    }
  };
  $("follow").onclick = () => {
    if (view.selected) {
      view.follow(view.followed === view.selected.id ? null : view.selected.id);
      sheet.close();
      render();
    }
  };
  sheet.addEventListener("close", () => {
    if (opener && !opener.hidden) opener.focus();
    else $("resident").focus();
  });
  $("pause").onclick = () => {
    running = !running;
    start();
    render();
  };
  $("mini-toggle").onclick = () => {
    miniVisible = !miniVisible;
    render();
  };
  function exit() {
    clearGesture();
    view.exit();
    if (exterior) camera = { ...exterior };
    exterior = null;
    render();
  }
  $("outside").onclick = exit;
  $("portal").onclick = () => {
    if (kind() === "interior") exit();
    else {
      clearGesture();
      exterior = { ...camera };
      view.local(I.regionAt(I.cave.outside));
      view.enter();
      render();
    }
  };
  function zoom(factor) {
    if (kind() !== "local") return;
    const c = camera;
    camera = C.pinch(
      F.area,
      c,
      { x: c.x + c.width / 2, y: c.y + c.height / 2 },
      { x: 0.5, y: 0.5 },
      factor,
    );
    render();
  }
  $("zoom-in").onclick = () => zoom(1.25);
  $("zoom-out").onclick = () => zoom(0.8);
  $("zoom-reset").onclick = () => zoom(0.75 / camera.zoom);
  function point(e) {
    const b = viewport.getBoundingClientRect();
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
      viewport.setPointerCapture(id);
    } catch {}
  }
  viewport.addEventListener("pointerdown", (e) => {
    if (!pointers.size) suppressClick = false;
    if (kind() !== "local" || e.button > 0) return;
    pointers.set(e.pointerId, point(e));
    rebase();
    if (pointers.size > 1) {
      suppressClick = true;
      view.follow(null);
      for (const id of pointers.keys()) capture(id);
    }
  });
  viewport.addEventListener("pointermove", (e) => {
    if (!pointers.has(e.pointerId) || !gesture) return;
    pointers.set(e.pointerId, point(e));
    const a = [...pointers.values()];
    if (a.length > 1) {
      const mid = { x: (a[0].x + a[1].x) / 2, y: (a[0].y + a[1].y) / 2 },
        distance = Math.hypot(a[0].x - a[1].x, (a[0].y - a[1].y) * 0.75);
      camera = C.pinch(
        F.area,
        gesture.start,
        gesture.anchor,
        mid,
        distance / Math.max(0.001, gesture.distance),
      );
    } else {
      const dx = a[0].x - gesture.mid.x,
        dy = a[0].y - gesture.mid.y,
        b = viewport.getBoundingClientRect();
      if (!suppressClick && Math.hypot(dx * b.width, dy * b.height) < 8) return;
      camera = C.pan(F.area, gesture.start, dx, dy);
    }
    e.preventDefault();
    suppressClick = true;
    view.follow(null);
    capture(e.pointerId);
    schedule();
  });
  for (const type of ["pointerup", "pointercancel", "lostpointercapture"])
    viewport.addEventListener(type, (e) => {
      if (!pointers.has(e.pointerId)) return;
      if (suppressClick) e.preventDefault();
      if (type !== "pointerup") suppressClick = true;
      pointers.delete(e.pointerId);
      rebase();
    });
  viewport.addEventListener(
    "click",
    (e) => {
      if (suppressClick) {
        e.preventDefault();
        e.stopImmediatePropagation();
      } else if (kind() === "global" && e.target === $("land"))
        showPlace(40, 30, "La clairière");
    },
    true,
  );
  // Keep V3's short-touch / compatibility-click discrimination for Safari.
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
      !t.button.contains(e.target) ||
      (viewport.contains(t.button) && suppressClick)
    )
      return;
    e.preventDefault();
    lastTouch = { button: t.button, time: now() };
    t.button.click();
  });
  document.addEventListener("pointercancel", () => {
    touchTarget = null;
  });
  document.addEventListener(
    "click",
    (e) => {
      if (e.isTrusted && lastTouch && now() - lastTouch.time < 800) {
        e.preventDefault();
        e.stopImmediatePropagation();
        lastTouch = null;
      }
    },
    true,
  );
  viewport.addEventListener("keydown", (e) => {
    if (kind() !== "local" || sheet.open) return;
    const d = {
      ArrowLeft: [0.08, 0],
      ArrowRight: [-0.08, 0],
      ArrowUp: [0, 0.08],
      ArrowDown: [0, -0.08],
    }[e.key];
    if (!d) return;
    e.preventDefault();
    view.follow(null);
    camera = C.pan(F.area, camera, ...d);
    render();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      running = false;
      clearGesture();
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      start();
      render();
    }
  });
  pref.addEventListener("change", render);
  try {
    renderer = await ForestRenderer.create($("land"));
    $("loading").hidden = true;
    window.ForestDiagnostics = {
      snapshot: () =>
        JSON.parse(
          JSON.stringify({
            world: world.state,
            scene: view.scene,
            camera,
            visuals: world.state.people.map((p) => ({
              id: p.id,
              ...motion.sample(p.id, now()),
            })),
            selected: view.selected?.id,
            followed: view.followed,
            running,
            pointers: pointers.size,
            animationScheduled: !!frame,
            renderer: renderer.stats(),
            objects: renderer.objects,
          }),
        ),
    };
    if (new URLSearchParams(location.search).has("review"))
      window.ForestReview = {
        hide: (id, value = true) => {
          value ? renderer.hidden.add(id) : renderer.hidden.delete(id);
          render();
        },
        focus: (x, y) => showPlace(x, y, "Revue graphique"),
      };
    render();
    start();
  } catch (e) {
    running = false;
    $("loading").textContent =
      "Le décor n’a pas pu être chargé. Vérifiez la connexion puis rechargez la page.";
    console.error(e);
  }
})();
