/* This page never reads or writes the application's save keys. */
(function () {
  "use strict";
  const W = MaterialWorld,
    S = MaterialStorage,
    $ = (id) => document.getElementById(id);
  let storage;
  try {
    storage = localStorage;
  } catch {}
  const loaded = S.load(storage);
  let state = loaded.state ?? W.createLab(),
    blocked = loaded.blocked,
    clock = null,
    cell = 40,
    downloadURL = null;
  $("storageStatus").textContent = loaded.message;
  function storageNotice(result) {
    $("storageStatus").textContent = result.message;
    $("storageStatus").classList.toggle("error", !result.ok);
  }
  function save() {
    if (!blocked) storageNotice(S.save(storage, state));
  }
  function stop(message = "Simulation en pause.") {
    if (clock) clearInterval(clock);
    clock = null;
    $("status").textContent = message;
    render();
  }
  function step() {
    if (document.hidden) return;
    try {
      W.stepLab(state);
      save();
      $("status").textContent =
        "Tick terminé : une primitive au maximum par habitant.";
      render();
    } catch (e) {
      stop("Simulation arrêtée : " + e.message);
    }
  }
  function render() {
    const inspection = W.inspect(state); // Snapshot only; rendering cannot consume RNG.
    $("time").textContent = "Tick " + state.tick;
    $("run").textContent = clock ? "Pause" : "Démarrer";
    $("run").setAttribute("aria-pressed", String(Boolean(clock)));
    $("import").disabled = Boolean(clock);
    $("step").disabled = Boolean(clock);
    const l = state.ledger.ration,
      current = inspection.balance.current;
    $("balance").textContent =
      current +
      " présentes + " +
      l.consumed +
      " consommées = " +
      l.initial +
      " initiales · bilan conservé";
    const rows = [];
    for (const e of state.entities)
      rows.push(
        "Lot " +
          e.id +
          " · " +
          e.quantity +
          " ration(s) · " +
          (e.location.cellId !== undefined
            ? "case " + e.location.cellId
            : "porteur " + e.location.holderAgentId),
      );
    $("places").textContent =
      rows.join(" | ") ||
      "Aucun lot actif. Les rations ingérées restent comptabilisées.";
    const map = $("labMap");
    if (!map.children.length)
      state.cells.forEach((c) => {
        const b = document.createElement("button");
        b.onclick = () => {
          cell = c.id;
          render();
        };
        map.append(b);
      });
    state.cells.forEach((c) => {
      const b = map.children[c.id],
        qty = state.entities
          .filter((e) => e.location.cellId === c.id)
          .reduce((n, e) => n + e.quantity, 0),
        people = state.agents
          .filter((a) => a.pos === c.id)
          .map((a) => (a.id === 1 ? "A" : "B"))
          .join("");
      b.textContent = (qty ? "R" + qty : "") + (people ? " " + people : "");
      b.setAttribute(
        "aria-label",
        "Case " +
          c.id +
          " : " +
          qty +
          " rations" +
          (people ? ", habitants " + people : ""),
      );
      b.setAttribute("aria-pressed", String(c.id === cell));
      b.className = (qty ? "source " : "") + (people ? "resident" : "");
    });
    const lots = state.entities.filter((e) => e.location.cellId === cell);
    $("cellDetails").textContent =
      "Case " +
      cell +
      " · révision " +
      state.cells[cell].resourceRevision +
      " · " +
      lots.reduce((n, e) => n + e.quantity, 0) +
      " ration(s) au sol.";
    const a = state.agents.find((a) => a.id === Number($("agent").value));
    $("agentDetails").textContent =
      "Position " +
      a.pos +
      " · faim " +
      a.body.hunger +
      "/130 · énergie " +
      a.body.energy +
      "/100 · porté " +
      W.inventory(state, a.id).reduce((n, e) => n + e.quantity, 0) +
      "/4";
    $("beliefs").textContent = JSON.stringify(
      { knowledge: a.knowledge, intention: a.intention, plan: a.plan },
      null,
      2,
    );
    $("results").replaceChildren();
    for (const p of state.agents) {
      const line = document.createElement("p");
      line.textContent =
        (p.id === 1 ? "A" : "B") +
        " — Choix : " +
        (p.lastDecision?.reason ?? "Pas encore de choix.") +
        " Résultat : " +
        (p.lastResult
          ? p.lastResult.command?.type +
            " · " +
            p.lastResult.causeCode +
            " · coût énergie " +
            p.lastResult.cost.energy
          : "aucun.");
      $("results").append(line);
    }
    $("events").textContent = JSON.stringify(state.recentEvents, null, 2);
    $("worldDetails").textContent = JSON.stringify(inspection, null, 2);
  }
  $("step").onclick = step;
  $("run").onclick = () => {
    if (clock) return stop();
    if (document.hidden) return;
    $("status").textContent = "Simulation autonome active.";
    clock = setInterval(step, 600);
    render();
  };
  $("agent").onchange = render;
  $("reset").onclick = () => {
    if (!confirm("Remplacer uniquement cette expérience du laboratoire ?"))
      return;
    stop();
    state = W.createLab();
    blocked = false;
    save();
    render();
  };
  $("export").onclick = () => {
    const text = S.serialize(state);
    $("snapshot").value = text;
    if (downloadURL) URL.revokeObjectURL(downloadURL);
    downloadURL = URL.createObjectURL(
      new Blob([text], { type: "application/json" }),
    );
    $("download").href = downloadURL;
    $("download").download = "microcosme-i1-tick-" + state.tick + ".json";
    $("download").hidden = false;
    $("status").textContent =
      "Export prêt. Le JSON contient le snapshot complet.";
  };
  $("import").onclick = () => {
    if (clock) {
      $("status").textContent = "Mets la simulation en pause avant import.";
      return;
    }
    try {
      const candidate = S.deserialize($("snapshot").value);
      state = candidate;
      blocked = false;
      save();
      $("status").textContent =
        "Import valide : snapshot restauré atomiquement.";
      render();
    } catch (e) {
      $("status").textContent =
        "Import refusé : " + e.message + ". Session conservée.";
    }
  };
  document.addEventListener("visibilitychange", () => {
    if (document.hidden)
      stop("Pause : document masqué. Reprise manuelle, sans rattrapage.");
  });
  window.addEventListener("pagehide", () => {
    stop("Pause : sortie du laboratoire.");
    if (downloadURL) {
      URL.revokeObjectURL(downloadURL);
      downloadURL = null;
      $("download").hidden = true;
    }
  });
  window.addEventListener("pageshow", () => render());
  render();
  // Narrow, read-only hooks for browser verification; mutations remain UI commands.
  globalThis.MaterialLab = { snapshot: () => S.serialize(state), render };
})();
