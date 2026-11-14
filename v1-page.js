(function () {
  "use strict";
  const V = MicrocosmeV1,
    W = MaterialWorld,
    S = V1Storage,
    $ = (id) => document.getElementById(id);
  let storage;
  try {
    storage = localStorage;
  } catch {}
  const loaded = S.load(storage);
  let state = loaded.state ?? V.create(),
    blocked = loaded.blocked,
    clock = null,
    cell = 40,
    url = null,
    selectedEvent = null;
  $("storageStatus").textContent = loaded.message;
  function save() {
    if (blocked) return;
    const r = S.save(storage, state);
    $("storageStatus").textContent = r.message;
    $("storageStatus").classList.toggle("error", !r.ok);
  }
  function stop(message = "En pause.") {
    if (clock) clearInterval(clock);
    clock = null;
    $("status").textContent = message;
    render();
  }
  function step() {
    if (document.hidden) return;
    try {
      V.step(state);
      save();
      $("status").textContent =
        "Tick terminé. Les deux habitants ont choisi et tenté leur action.";
      render();
    } catch (e) {
      stop("Arrêt : " + e.message);
    }
  }
  const labels = {
    M1: [
      "M1 · Réguler",
      "Actualise la faim et les capacités. Ne choisit aucune action.",
    ],
    M2: [
      "M2 · Percevoir",
      "Copie les signaux personnels et les observations locales avant les actions.",
    ],
    M3: [
      "M3 · Comprendre",
      "Interprète observations et souvenirs ; une hypothèse ne garantit pas le vrai.",
    ],
    EVALUATE: [
      "M4 · Décider",
      "Évalue les options puis choisit. Les scores et le tirage sont conservés séparément.",
    ],
    ATTEMPT: [
      "M5 · Agir",
      "Tente une primitive ; le monde I1 arbitre les effets réels et les refus.",
    ],
    M6: [
      "M6 · Apprendre",
      "Consolide les observations et révise une préférence à partir du résultat personnel.",
    ],
  };
  function selectEvent(id) {
    selectedEvent = id;
    renderCause();
  }
  function eventButton(id, label) {
    const b = document.createElement("button");
    b.textContent = label ?? id;
    b.onclick = () => {
      selectEvent(id);
      $("causal").scrollIntoView({ block: "nearest" });
    };
    return b;
  }
  function renderCause() {
    const events = state.trace;
    if (!selectedEvent) selectedEvent = events.at(-1)?.id;
    $("event").replaceChildren();
    if (selectedEvent && !events.some((e) => e.id === selectedEvent)) {
      const o = document.createElement("option");
      o.value = selectedEvent;
      o.textContent = selectedEvent + " · détail non conservé";
      $("event").append(o);
    }
    for (const e of [...events].reverse()) {
      const o = document.createElement("option");
      o.value = e.id;
      o.textContent =
        e.id +
        " · tick " +
        e.tick +
        " · " +
        e.kind +
        " · " +
        (e.actorId === 1 ? "A" : "B");
      $("event").append(o);
    }
    if (selectedEvent) $("event").value = selectedEvent;
    const found = selectedEvent
      ? V.cause(state, selectedEvent)
      : { status: "Aucun événement : avance d’un tick." };
    $("causal").textContent = JSON.stringify(found, null, 2);
    $("parents").replaceChildren();
    for (const id of found.event?.parents ?? [])
      $("parents").append(eventButton(id, "Cause " + id));
  }
  function render() {
    const w = state.world,
      id = Number($("agent").value),
      a = w.agents.find((a) => a.id === id),
      m = state.minds.find((m) => m.actorId === id);
    $("time").textContent = "Tick " + w.tick;
    $("run").textContent = clock ? "Pause" : "Démarrer";
    $("run").setAttribute("aria-pressed", String(Boolean(clock)));
    $("step").disabled = Boolean(clock);
    $("import").disabled = Boolean(clock);
    const current = w.entities.reduce((n, e) => n + e.quantity, 0),
      l = w.ledger.ration;
    $("balance").textContent =
      current +
      " présentes + " +
      l.consumed +
      " consommées = " +
      l.initial +
      " initiales · matière conservée";
    if (!$("map").children.length)
      for (const c of w.cells) {
        const b = document.createElement("button");
        b.onclick = () => {
          cell = c.id;
          render();
        };
        $("map").append(b);
      }
    for (const c of w.cells) {
      const b = $("map").children[c.id],
        qty = w.entities
          .filter((e) => e.location.cellId === c.id)
          .reduce((n, e) => n + e.quantity, 0);
      const residents = w.agents
        .filter((a) => a.pos === c.id)
        .map((a) => (a.id === 1 ? "A" : "B"))
        .join("");
      b.textContent =
        (qty ? "R" + qty : "") + (residents ? " " + residents : "");
      b.setAttribute(
        "aria-label",
        "Case " +
          c.id +
          " : " +
          qty +
          " rations" +
          (residents ? ", habitants " + residents : ""),
      );
      b.setAttribute("aria-pressed", String(cell === c.id));
      b.className = (qty ? "source " : "") + (residents ? "resident" : "");
    }
    const real = w.entities
      .filter((e) => e.location.cellId === cell)
      .reduce((n, e) => n + e.quantity, 0);
    $("cellDetails").textContent =
      "Case " +
      cell +
      " · vérité : " +
      real +
      " rations · révision " +
      w.cells[cell].resourceRevision;
    $("lots").textContent = JSON.stringify(w.entities, null, 2);
    $("body").textContent =
      "Position " +
      a.pos +
      " · faim " +
      a.body.hunger +
      "/130 · énergie " +
      a.body.energy +
      "/100 · porté " +
      W.inventory(w, id).reduce((n, e) => n + e.quantity, 0) +
      "/4";
    const belief = m.beliefs.find((b) => b.cellId === cell);
    $("beliefSummary").textContent = belief
      ? "Case " +
        cell +
        " · croyance : " +
        belief.observedQuantity +
        " rations, observées au tick " +
        belief.observedAt +
        ". La vérité peut avoir changé depuis."
      : "Case " + cell + " : cet habitant ne l’a pas observée.";
    $("learningSummary").textContent = m.preferences.length
      ? "Préférences acquises : " +
        m.preferences
          .map(
            (p) =>
              "case " + p.cellId + " / " + (p.value >= 0 ? "+" : "") + p.value,
          )
          .join(" ; ") +
        ". Ce score exprime une expérience, pas une garantie."
      : "Aucune préférence acquise pour le moment.";
    $("beliefs").textContent = JSON.stringify(m, null, 2);
    $("intention").textContent = JSON.stringify(
      { intention: a.intention, plan: a.plan },
      null,
      2,
    );
    $("engines").replaceChildren();
    for (const [kind, [title, description]] of Object.entries(labels)) {
      const card = document.createElement("article");
      card.className = "engine";
      const h = document.createElement("h3");
      h.textContent = title;
      card.append(h);
      const p = document.createElement("p");
      p.textContent = description;
      card.append(p);
      const types =
        kind === "EVALUATE"
          ? ["EVALUATE", "DECIDE"]
          : kind === "ATTEMPT"
            ? ["ATTEMPT", "RESULT"]
            : [kind];
      for (const type of types) {
        const e = state.trace.findLast(
          (e) => e.actorId === id && e.kind === type,
        );
        if (e) {
          const label =
            type === "DECIDE"
              ? e.data.reason
              : type === "RESULT"
                ? e.data.command.type + " · " + e.data.causeCode
                : type + " · tick " + e.tick + " · " + e.id;
          card.append(eventButton(e.id, label));
        }
      }
      $("engines").append(card);
    }
    renderCause();
  }
  $("step").onclick = step;
  $("run").onclick = () => {
    if (clock) return stop();
    if (document.hidden) return;
    clock = setInterval(step, 650);
    $("status").textContent = "Simulation autonome en cours.";
    render();
  };
  $("agent").onchange = render;
  $("event").onchange = () => selectEvent($("event").value);
  $("reset").onclick = () => {
    if (!confirm("Remplacer cette expérience V1 ?")) return;
    stop();
    const kind = $("scenario").value;
    const options =
      kind === "contest"
        ? {
            sources: [
              { cellId: 40, quantity: 1 },
              { cellId: 28, quantity: 8 },
            ],
          }
        : kind === "learning"
          ? {
              sources: [
                { cellId: 40, quantity: 24 },
                { cellId: 42, quantity: 24 },
              ],
            }
          : {};
    state = V.create(options, 7);
    selectedEvent = null;
    blocked = false;
    save();
    render();
    $("status").textContent =
      kind === "learning"
        ? "Laisse évoluer les habitants : les prélèvements révisent leur préférence de source. Les facteurs sont visibles dans M4."
        : "Nouvelle expérience en pause.";
  };
  $("export").onclick = () => {
    const text = S.serialize(state);
    $("snapshot").value = text;
    if (url) URL.revokeObjectURL(url);
    url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
    $("download").href = url;
    $("download").download = "microcosme-v1-tick-" + state.world.tick + ".json";
    $("download").hidden = false;
    $("status").textContent =
      "Export complet prêt. Copie le JSON ou télécharge le fichier.";
  };
  $("import").onclick = () => {
    if (clock) return;
    try {
      const candidate = S.deserialize($("snapshot").value);
      state = candidate;
      blocked = false;
      selectedEvent = null;
      save();
      render();
      $("status").textContent = "Import valide : reprise exacte, en pause.";
    } catch (e) {
      $("status").textContent =
        "Import refusé : " + e.message + ". Session conservée.";
    }
  };
  document.addEventListener("visibilitychange", () => {
    if (document.hidden)
      stop("Pause : document masqué. Reprise manuelle sans rattrapage.");
  });
  window.addEventListener("pagehide", () => {
    stop("Pause : sortie de la page.");
    if (url) URL.revokeObjectURL(url);
    url = null;
    $("download").hidden = true;
  });
  window.V1Lab = Object.freeze({
    snapshot: () => S.serialize(state),
    render,
    running: () => Boolean(clock),
  });
  render();
})();
