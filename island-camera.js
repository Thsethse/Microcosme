/* Pure continuous camera geometry. Coordinates are world cells, zoom 1 = V2 scale. */
(function (root, factory) {
  if (typeof module === "object") module.exports = factory();
  else root.IslandCamera = factory();
})(globalThis, function () {
  "use strict";
  function clamp(region, c) {
    const zoom = Math.max(0.75, Math.min(3, c.zoom || 16 / c.width || 1)),
      width = 16 / zoom,
      height = 12 / zoom;
    return {
      x: Math.max(region.x, Math.min(region.x + region.width - width, c.x)),
      y: Math.max(region.y, Math.min(region.y + region.height - height, c.y)),
      width,
      height,
      zoom,
    };
  }
  function center(region, x, y, zoom = 1) {
    return clamp(region, { x: x - 8 / zoom, y: y - 6 / zoom, zoom });
  }
  function pan(region, start, dx, dy) {
    return clamp(region, {
      ...start,
      x: start.x - dx * start.width,
      y: start.y - dy * start.height,
    });
  }
  function pinch(region, start, anchor, mid, ratio) {
    const zoom = Math.max(0.75, Math.min(3, start.zoom * ratio));
    return clamp(region, {
      x: anchor.x - (mid.x * 16) / zoom,
      y: anchor.y - (mid.y * 12) / zoom,
      zoom,
    });
  }
  return { clamp, center, pan, pinch };
});
