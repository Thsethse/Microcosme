/* Presentation-only samples: never writes a person, world, view or saved state. */
(function (root, factory) {
  if (typeof module === "object") module.exports = factory();
  else root.IslandMotion = factory();
})(globalThis, function () {
  "use strict";
  const copy = (p) => ({ space: p.space, x: p.x, y: p.y });
  const same = (a, b) => a.space === b.space && a.x === b.x && a.y === b.y;
  function create(duration = 600) {
    const tracks = new Map();
    function sample(id, time) {
      const t = tracks.get(id);
      if (!t) return null;
      const progress = Math.max(0, Math.min(1, (time - t.start) / duration));
      const moving = progress < 1 && !same(t.from, t.to);
      return {
        pos: {
          space: t.to.space,
          x: t.from.x + (t.to.x - t.from.x) * progress,
          y: t.from.y + (t.to.y - t.from.y) * progress,
        },
        moving,
        direction: t.direction,
        frame: moving ? 1 + (Math.floor(time / 150) % 2) : 0,
        revision: t.revision,
      };
    }
    function sync(people, time, snap = false) {
      const ids = new Set(people.map((p) => p.id));
      for (const id of tracks.keys()) if (!ids.has(id)) tracks.delete(id);
      for (const p of people) {
        let t = tracks.get(p.id);
        if (!t) {
          tracks.set(p.id, {
            from: copy(p.pos),
            to: copy(p.pos),
            start: time,
            direction: 0,
            revision: 0,
          });
          continue;
        }
        if (!same(t.to, p.pos)) {
          const old = t.to,
            visual = sample(p.id, time).pos,
            dx = p.pos.x - old.x,
            dy = p.pos.y - old.y;
          const discontinuous =
            old.space !== p.pos.space || Math.abs(dx) + Math.abs(dy) > 1.001;
          t.direction =
            Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : dy < 0 ? 3 : 0;
          t.from = copy(discontinuous || snap ? p.pos : visual);
          t.to = copy(p.pos);
          t.start = time;
          if (discontinuous) t.revision++;
        }
        if (snap) {
          t.from = copy(t.to);
          t.start = time - duration;
        }
      }
    }
    function active(time) {
      for (const id of tracks.keys()) if (sample(id, time).moving) return true;
      return false;
    }
    return {
      sync,
      sample,
      active,
      get size() {
        return tracks.size;
      },
    };
  }
  function damp(current, target, dt) {
    const a = 1 - Math.exp(-Math.max(0, Math.min(64, dt)) / 45),
      next = { ...target };
    for (const axis of ["x", "y"]) {
      const value = current[axis] + (target[axis] - current[axis]) * a;
      next[axis] =
        Math.abs(target[axis] - value) < 0.001 ? target[axis] : value;
    }
    return next;
  }
  return { create, damp };
});
