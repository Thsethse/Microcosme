"use strict";
// Navigation owns only presentation and the clock; the engine remains shared.
let scene = "menu", resumeVillage = false;
function navigate(next) {
  if (!['menu','village','people','chronicles','laws'].includes(next)) return;
  if (scene === 'village' && next !== scene) {
    resumeVillage = Boolean(clock);
    if (clock) { clearInterval(clock); clock = null; }
    save();
  }
  const previous = scene;
  scene = next;
  document.querySelectorAll('[data-scene]').forEach(el => el.hidden = el.dataset.scene !== next);
  document.querySelectorAll('nav button').forEach((el, i) => el.setAttribute('aria-current', ['menu','village','people','chronicles','laws'][i] === next ? 'page' : 'false'));
  if (next === 'village' && previous !== next && resumeVillage) {
    clock = setInterval(step, 600 / rate); resumeVillage = false;
  }
  if (next === "village") document.getElementById("continue").disabled = false;
  render(); refreshPeople();
  const target = document.querySelector('[data-scene="'+next+'"]');
  target.setAttribute('tabindex','-1'); target.focus();
}
function refreshPeople() {
  const list = document.getElementById('peopleList');
  const ids = new Set(s.people.map(p => String(p.id)));
  list.querySelectorAll('button').forEach(button => { if (!ids.has(button.dataset.id)) button.remove(); });
  s.people.forEach(p => {
    let button = list.querySelector('[data-id="'+p.id+'"]');
    if (!button) { button = document.createElement('button'); button.dataset.id = p.id; list.append(button); }
    button.textContent = p.name;
    button.setAttribute('aria-pressed', String(selected === p.id));
    button.onclick = () => selectPerson(p.id);
  });
  const person = s.people.find(p => p.id === selected);
  document.getElementById('personDetails').textContent = person ? details(person) : 'Sélectionne un habitant pour lire ses besoins, intentions et souvenirs.';
}
// Native modal dialogs provide inert background, stacking, Escape and focus containment.
function windowPanel(title, content, actions = [], outside = true) {
  const opener = document.activeElement, dialog = document.createElement('dialog');
  const heading = document.createElement('h2'); heading.textContent = title;
  heading.id = 'window-' + (++windowPanel.serial); dialog.setAttribute('aria-labelledby', heading.id);
  const body = document.createElement('div');
  if (typeof content === 'string') body.textContent = content; else body.append(content);
  body.className = 'window-body';
  const close = document.createElement('button'); close.textContent = 'Fermer'; close.setAttribute('aria-label','Fermer la fenêtre'); close.onclick = () => dialog.close();
  dialog.append(heading, body, close);
  actions.forEach(action => {
    const button = document.createElement('button'); button.textContent = action.label;
    button.onclick = () => { dialog.close(); action.run(); }; dialog.append(button);
  });
  dialog.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]')];
    const first = controls[0], last = controls[controls.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  dialog.addEventListener('click', e => {
    const r = dialog.getBoundingClientRect();
    if (outside && e.target === dialog && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => { dialog.remove(); if (opener?.isConnected) opener.focus(); });
  document.body.append(dialog); dialog.showModal(); close.focus(); return dialog;
}
windowPanel.serial = 0;
function personWindow() {
  const p = s.people.find(p => p.id === selected);
  windowPanel(p ? p.name : 'Habitants', p ? details(p) : 'Sélectionne d’abord un habitant.');
}
function settings() {
  const body = document.createElement('div');
  body.append('Les animations suivent la préférence de mouvement réduit de ton appareil. Les lois du monde règlent la simulation.');
  const button = document.createElement('button'); button.textContent = 'À propos des sauvegardes';
  button.onclick = () => windowPanel('Sauvegarde locale', 'La partie est enregistrée après chaque heure, intervention et sortie du village. Elle reste sur ce navigateur.');
  body.append(button); windowPanel('Paramètres', body, [{label:'Modifier les lois du monde', run:() => navigate('laws')}]);
}
function restart() {
  windowPanel('Nouvelle partie', 'Remplacer la partie actuelle et sa sauvegarde locale ? Cette action est irréversible.', [{label:'Confirmer la nouvelle partie', run() {
    if (clock) clearInterval(clock); clock = null; resumeVillage = false;
    engine = MicrocosmeEngine.create(); s = engine.state; selected = null;
    resetCamera(); save(); navigate('village');
  }}], false);
}
const viewport = document.getElementById('viewport'), world = viewport.querySelector('.world');
const camera = { zoom: 1, x: 0, y: 0 }, pointers = new Map();
let gesture = null, suppressTap = false;
function applyCamera() {
  const maxX = viewport.clientWidth * (camera.zoom - 1), maxY = viewport.clientHeight * (camera.zoom - 1);
  camera.x = Math.max(-maxX, Math.min(0, camera.x)); camera.y = Math.max(-maxY, Math.min(0, camera.y));
  world.style.transform = `translate(${camera.x}px,${camera.y}px) scale(${camera.zoom})`;
  document.getElementById('zoomValue').textContent = Math.round(camera.zoom * 100) + ' %';
}
function zoomBy(factor) { camera.zoom = Math.max(1, Math.min(3, camera.zoom * factor)); applyCamera(); }
function resetCamera() { Object.assign(camera, {zoom:1,x:0,y:0}); applyCamera(); }
const distance = () => { const [a,b] = [...pointers.values()]; return b ? Math.hypot(a.x-b.x,a.y-b.y) : 0; };
viewport.addEventListener('pointerdown', e => {
  if (e.button !== 0) return;
  if (!pointers.size) { suppressTap = false; gesture = {x:e.clientX,y:e.clientY,cx:camera.x,cy:camera.y}; }
  pointers.set(e.pointerId, {x:e.clientX,y:e.clientY});
  if (pointers.size === 2) { gesture.distance = distance(); gesture.zoom = camera.zoom; suppressTap = true; }
});
viewport.addEventListener('pointermove', e => {
  if (!pointers.has(e.pointerId)) return;
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if (pointers.size > 1) {
    if (gesture.distance) camera.zoom = Math.max(1,Math.min(3,gesture.zoom * distance()/gesture.distance));
  } else {
    const dx = e.clientX-gesture.x, dy = e.clientY-gesture.y;
    if (Math.hypot(dx,dy)>8) suppressTap = true;
    if (suppressTap) { camera.x = gesture.cx+dx; camera.y = gesture.cy+dy; }
  }
  if (suppressTap) { if (e.isTrusted) viewport.setPointerCapture(e.pointerId); e.preventDefault(); applyCamera(); }
});
function endPointer(e) {
  pointers.delete(e.pointerId);
  if (pointers.size) { const [p] = pointers.values(); gesture = {x:p.x,y:p.y,cx:camera.x,cy:camera.y}; }
  if (e.type === 'pointercancel') suppressTap = true;
}
window.addEventListener('pointerup',endPointer); window.addEventListener('pointercancel',endPointer);
viewport.addEventListener('click',e => { if (suppressTap && e.detail !== 0) { e.preventDefault(); e.stopImmediatePropagation(); } },true);
window.addEventListener('resize',applyCamera);
document.getElementById('continue').disabled = !loaded.state;
navigate('menu');
