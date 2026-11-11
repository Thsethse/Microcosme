"use strict";
const W = 12,
  H = 9,
  names = MicrocosmeEngine.names;
let clock = null,
  rate = 1,
  active = "inspect",
  selected = null;
let storage;
try {
  storage = window.localStorage;
} catch (error) {}
let loaded = MicrocosmeStorage.load(storage);
let engine = MicrocosmeEngine.create(loaded.state),
  s = engine.state;
function save() {
  const result = loaded.blocked
    ? { ok: false, message: loaded.message }
    : MicrocosmeStorage.save(storage, s);
  document.getElementById("saveStatus").textContent = result.ok
    ? ""
    : result.message;
}
function log(message) {
  engine.log(message);
}
function step() {
  if (typeof scene !== "undefined" && scene !== "village") return;
  engine.step();
  save();
  render();
}
function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}
function tool(v) {
  active = v;
  document
    .querySelectorAll("[data-tool]")
    .forEach((b) => b.classList.toggle("selected", b.dataset.tool === v));
}
function selectPerson(id) {
  selected = id;
  let p = s.people.find((q) => q.id === id);
  if (p) document.getElementById("inspect").textContent = details(p);
  render();
  if (typeof refreshPeople === "function") refreshPeople();
}
function tap(i) {
  let p = s.people.find((p) => p.pos === i);
  if (active === "inspect") {
    selected = p?.id || null;
    document.getElementById("inspect").textContent = p
      ? details(p)
      : "Case " +
        s.tiles[i] +
        " : " +
        (s.tiles[i] === "field"
          ? "culture"
          : s.tiles[i] === "tree"
            ? "forêt"
            : "terrain");
    render();
    return;
  }
  if (active === "person") {
    if (
      !confirm(
        "Faire apparaître un nouvel habitant ? La population augmentera de 1.",
      )
    )
      return;
    if (s.people.length >= 30) {
      alert("Limite de 30 habitants atteinte.");
      return;
    }
    let id = Math.max(0, ...s.people.map((p) => p.id)) + 1;
    let name =
      names.find((n) => !s.people.some((p) => p.name === n)) ||
      "Habitant " + id;
    s.people.push({
      id,
      name,
      pos: i,
      energy: 85,
      hunger: 10,
      task: "new",
      target: null,
      reason: "Vient d’arriver",
      social: 50,
    });
    engine.prepare(s.people[s.people.length - 1]);
    log(name + " arrive au village.");
  } else {
    s.tiles[i] =
      active === "tree" ? "tree" : active === "grass" ? "grass" : "field";
    log(
      active === "tree"
        ? "Un arbre apparaît."
        : active === "grass"
          ? "Le terrain devient une prairie."
          : "Une culture apparaît.",
    );
  }
  save();
  render();
}
function details(p) {
  const friends =
    Object.values(p.memory.people)
      .sort((a, b) => b.trust - a.trust)
      .slice(0, 3)
      .map((r) => r.name + " (confiance " + r.trust + ")")
      .join(", ") || "Personne";
  const target = p.intention?.target,
    seen = p.memory.terrain[target];
  const date = (at) =>
    at === null
      ? "date inconnue (ancienne partie)"
      : "J" + (Math.floor(at / 24) + 1) + " " + (at % 24) + "h";
  const location = (value) =>
    "colonne " + ((value % W) + 1) + ", ligne " + (Math.floor(value / W) + 1);
  const experience = p.memory.experiences[p.intention?.task + ":" + target];
  return [
    p.name +
      " — Besoin dominant : " +
      (MicrocosmeCognition.needs[p.need] || "À évaluer"),
    "Intention : " +
      p.goal +
      (p.intention
        ? " (" +
          { active: "en cours", completed: "achevée", failed: "échec" }[
            p.intention.status
          ] +
          ")"
        : "") +
      ". Destination : " +
      (p.target === null || p.target === undefined
        ? "aucune"
        : location(p.target)),
    "Raison : " + p.reason,
    "Faim " +
      p.hunger +
      " / énergie " +
      p.energy +
      " / nourriture personnelle " +
      p.food,
    "Connaissance de la destination : " +
      (seen
        ? (seen.kind || "nature inconnue") +
          ", dernière observation : " +
          date(seen.observedAt)
        : "terrain inconnu"),
    "Expérience de cette destination : " +
      (experience
        ? experience.successes +
          " réussite(s), " +
          experience.failures +
          " échec(s) — " +
          experience.cause
        : "aucune"),
    "Cases mémorisées : " +
      Object.keys(p.memory.terrain).length +
      " / visitées : " +
      p.memory.visited.length +
      ". Relations : " +
      friends,
    "Souvenirs : " + (p.memory.events.join(" ; ") || "Aucun encore"),
    "Décisions et observations récentes :",
    ...p.memory.journal.slice(0, 5).map((e) => date(e.at) + " — " + e.message),
  ].join("\n");
}
function law(k, v) {
  s.laws[k] = Number(v);
  save();
  document.getElementById(k + "Value").textContent = v;
}
function toggle() {
  if (typeof scene !== "undefined" && scene !== "village") return;
  if (clock) {
    clearInterval(clock);
    clock = null;
  } else clock = setInterval(step, 600 / rate);
  render();
}
function speed() {
  rate = rate === 1 ? 2 : rate === 2 ? 4 : 1;
  if (clock) {
    clearInterval(clock);
    clock = setInterval(step, 600 / rate);
  }
  render();
}
function render() {
  document.getElementById("stats").innerHTML =
    "<span>📅 J" +
    s.day +
    " · " +
    s.hour +
    "h</span><span>👥 " +
    s.people.length +
    "</span><span>🍞 " +
    s.food +
    "</span><span>🪵 " +
    s.wood +
    "</span>";
  document.getElementById("auto").textContent = clock ? "⏸ Pause" : "▶ Temps";
  document.getElementById("speed").textContent = rate;
  const map = document.getElementById("map");
  if (!map.children.length) {
    s.tiles.forEach((_, i) => {
      const tile = document.createElement("button");
      tile.innerHTML = '<span aria-hidden="true"></span>';
      tile.onclick = () => tap(i);
      map.append(tile);
    });
  }
  s.tiles.forEach((type, i) => {
    const tile = map.children[i];
    tile.className = 'tile ' + type;
    tile.setAttribute('aria-label', 'Case ' + (i + 1) + ' : ' + ({tree:'forêt',field:'culture',home:'maison',grass:'prairie'}[type]));
  });
  let layer = document.getElementById("actors");
  let ids = new Set(s.people.map((p) => String(p.id)));
  layer.querySelectorAll(".actor").forEach((el) => {
    if (!ids.has(el.dataset.id)) el.remove();
  });
  const colors = [
    "#b84a49",
    "#377cc1",
    "#9a52bd",
    "#c47b25",
    "#288b72",
    "#b44f89",
    "#627c25",
    "#6464ba",
  ];
  s.people.forEach((p, i) => {
    let el = layer.querySelector('[data-id="' + p.id + '"]');
    if (!el) {
      el = document.createElement("button");
      el.className = "actor";
      el.dataset.id = p.id;
      el.innerHTML = "<b></b>";
      layer.appendChild(el);
    }
    el.onclick = () => (active === "inspect" ? selectPerson(p.id) : tap(p.pos));
    el.style.transitionDuration = 520 / rate + "ms";
    el.style.setProperty("--color", colors[(p.id - 1) % colors.length]);
    el.style.setProperty("--x", (p.pos % W) * 100 + "%");
    el.style.setProperty("--y", Math.floor(p.pos / W) * 100 + "%");
    el.querySelector("b").textContent = p.name.charAt(0);
    el.setAttribute("aria-label", p.name);
    el.title = p.name + " : " + p.reason;
    el.classList.toggle("chosen", selected === p.id);
  });
  let oldTarget = document.getElementById("targetMarker");
  if (oldTarget) oldTarget.remove();
  let chosen = s.people.find((p) => p.id === selected);
  if (chosen && chosen.target !== null && chosen.target !== undefined) {
    let mark = document.createElement("div");
    mark.id = "targetMarker";
    mark.style.cssText =
      "position:absolute;pointer-events:none;border:3px solid #ffe071;border-radius:6px;box-sizing:border-box;width:8.333333%;height:11.111111%;left:" +
      ((chosen.target % W) / W) * 100 +
      "%;top:" +
      (Math.floor(chosen.target / W) / H) * 100 +
      "%;z-index:2";
    layer.appendChild(mark);
  }
  document.getElementById("roster").innerHTML =
    "<p>Habitants présents : " +
    s.people.length +
    " (aucune naissance automatique)</p>" +
    s.people
      .map(
        (p, i) =>
          '<button style="background:' +
          colors[(p.id - 1) % colors.length] +
          ';color:white" onclick="selectPerson(' +
          p.id +
          ')">' +
          escapeHTML(p.name) +
          "</button>",
      )
      .join("");
  document.getElementById("log").innerHTML = s.events
    .map((e) => "<p>" + escapeHTML(e) + "</p>")
    .join("");
  for (let k of ["hunger", "productivity", "social"]) {
    document.getElementById(k).value = s.laws[k];
    document.getElementById(k + "Value").textContent = s.laws[k];
  }
  if (selected) {
    let p = s.people.find((p) => p.id === selected);
    if (p) document.getElementById("inspect").textContent = details(p);
  }
}
render();

if (loaded.message)
  document.getElementById("saveStatus").textContent = loaded.message;
