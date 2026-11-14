/* Original pixel illustrations for V4-I1. Run with Node; no art package or network. */
const fs = require("node:fs"),
  crypto = require("node:crypto"),
  path = require("node:path");
const out = path.join(__dirname, "../assets/forest");
fs.mkdirSync(out, { recursive: true });
function hash(x, y = 0) {
  let n = Math.imul(x + 31, 374761393) ^ Math.imul(y + 7, 668265263);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return (n ^ (n >>> 16)) >>> 0;
}
function asset(name, w, h, draw) {
  const groups = new Map();
  const r = (x, y, w, h, c) => {
    if (!groups.has(c)) groups.set(c, []);
    groups.get(c).push(`M${x} ${y}h${w}v${h}h-${w}z`);
  };
  draw(r);
  const body = [...groups]
    .map(([c, d]) => `<path fill="${c}" d="${d.join("")}"/>`)
    .join("");
  fs.writeFileSync(
    path.join(out, name + ".svg"),
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${body}</svg>\n`,
  );
}
const palettes = {
  grass: ["#78a23a", "#7da83c", "#87ae40", "#94b648", "#a9c856", "#5e8d35"],
  forest: ["#517e35", "#588938", "#63933c", "#72a443", "#91b54a", "#3e7134"],
  soil: ["#b18b52", "#b99358", "#c29f65", "#d0af76", "#dcbd87", "#a17c48"],
  stone: ["#727d74", "#7c877b", "#879182", "#9aa38f", "#aeb69b", "#626f69"],
  snow: ["#bdcfbd", "#cbd9c8", "#dae4d3", "#e8edda", "#f4f2dd", "#a5bcb0"],
  water: ["#257d9f", "#2985a8", "#328eac", "#4098b0", "#69b5c0", "#206f92"],
};
for (const [kind, colors] of Object.entries(palettes))
  for (let v = 0; v < 4; v++)
    asset(`${kind}-${v}`, 32, 32, (r) => {
      r(0, 0, 32, 32, colors[0]);
      for (let j = 0; j < (kind === "water" ? 90 : 55); j++) {
        const n = hash(j, v + kind.length * 17);
        const x = n % 32,
          y = (n >>> 8) % 32;
        r(
          x,
          y,
          Math.min(32 - x, kind === "water" ? 2 + (n % 4) : 1 + (n % 2)),
          1,
          colors[1 + ((n >>> 16) % 5)],
        );
        if (kind === "grass" || kind === "forest") {
          if (j % 7 === 0) {
            r(x, Math.max(0, y - 2), 1, 3, colors[5]);
            if (x < 30) r(x + 2, Math.max(0, y - 1), 1, 2, colors[3]);
          }
        }
      }
    });
for (let v = 0; v < 3; v++) {
  asset(`oak-${v}-trunk`, 96, 112, (r) => {
    r(43, 48, 13, 58, "#493e29");
    r(46, 49, 8, 57, "#78512d");
    r(47, 51, 3, 54, "#ad7940");
    r(38, 100, 22, 8, "#58462b");
    r(31, 108, 36, 3, "#635032");
    r(39, 103, 5, 6, "#99723b");
    r(53, 101, 5, 7, "#a68142");
    for (let j = 0; j < 24; j++) {
      const n = hash(j, v);
      r(
        44 + (n % 10),
        55 + ((n >>> 8) % 48),
        1,
        2 + (n % 7),
        j % 2 ? "#473a27" : "#b08748",
      );
    }
    for (let k = 0; k < 9; k++) {
      r(45 - k * 2, 67 - k * 2, 3, 4, "#6d492c");
      r(53 + k * 2, 70 - k * 3, 3, 5, "#78502d");
    }
  });
  asset(`oak-${v}-crown`, 96, 112, (r) => {
    const clumps = [
      [45, 18, 20],
      [25, 32, 21],
      [64, 29, 23],
      [17, 49, 15],
      [44, 44, 27],
      [74, 48, 18],
      [30, 62, 22],
      [58, 62, 22],
    ];
    const cols = [
      "#173f35",
      "#21563b",
      "#306b3d",
      "#43813c",
      "#609a3c",
      "#8aba3d",
      "#b3d34c",
      "#d2e56b",
    ];
    for (let y = 0; y < 86; y += 2)
      for (let x = 2; x < 94; x += 2) {
        let best = null,
          score = Infinity;
        for (const [cx, cy, radius] of clumps) {
          const d = ((x - cx) / radius) ** 2 + ((y - cy) / radius) ** 2;
          if (d < 1 && d < score) {
            score = d;
            best = [cx, cy, radius];
          }
        }
        if (!best) continue;
        const n = hash(x + y * 101, v + 1),
          [cx, cy, rad] = best;
        if (score > 0.87 && n % 7 < 2) continue;
        const light =
          (1 - score) * 2.2 + ((cy - y) / rad) * 1.5 + ((cx - x) / rad) * 0.7;
        const cluster =
          ((hash(Math.floor(x / 6), Math.floor(y / 6) + v) % 3) - 1) * 0.65;
        const c = Math.max(
          0,
          Math.min(7, Math.floor(2.4 + light + cluster + ((n % 3) - 1) * 0.2)),
        );
        r(x, y, 2, 2, cols[c]);
        if (n % 11 === 0 && c > 3) r(x, y, 2, 1, cols[Math.min(7, c + 1)]);
      }
  });
}
asset("pine-trunk", 80, 128, (r) => {
  r(36, 67, 9, 58, "#443c2e");
  r(38, 70, 4, 53, "#926139");
  r(30, 123, 22, 3, "#604a30");
});
asset("pine-crown", 80, 128, (r) => {
  const colors = [
    "#183e37",
    "#215541",
    "#2c6e4b",
    "#3d8553",
    "#599b5b",
    "#80b969",
  ];
  for (let y = 2; y < 112; y += 2)
    for (let x = 0; x < 80; x += 2) {
      let inside = false,
        light = 0;
      for (const [top, bottom, wide] of [
        [2, 42, 21],
        [21, 64, 29],
        [41, 88, 35],
        [65, 110, 39],
      ]) {
        const half = (wide * (y - top)) / (bottom - top);
        if (y >= top && y <= bottom && Math.abs(x - 40) < half) {
          inside = true;
          light = ((bottom - y) / (bottom - top)) * 2;
        }
      }
      if (inside) {
        const n = hash(x + y * 83, 9);
        if (n % 19 === 0 && Math.abs(x - 40) > 25) continue;
        r(
          x,
          y,
          2,
          2,
          colors[
            Math.max(
              0,
              Math.min(
                5,
                Math.floor(2 + light + (40 - x) / 25 + ((n % 3) - 1)),
              ),
            )
          ],
        );
      }
    }
});
asset("rock", 64, 48, (r) => {
  for (let y = 6; y < 44; y += 2)
    for (let x = 2; x < 62; x += 2) {
      let a = ((x - 32) / 29) ** 2 + ((y - 27) / 20) ** 2;
      if (a > 1) continue;
      const n = hash(x, y);
      const c =
        x < 23 && y < 25
          ? "#b4b79c"
          : x > 43
            ? "#66776b"
            : y > 36
              ? "#56685f"
              : n % 5 === 0
                ? "#929d86"
                : "#8b9480";
      r(x, y, 2, 2, c);
    }
  r(22, 10, 17, 2, "#d0c9a5");
  r(16, 14, 8, 3, "#bec2a0");
  r(33, 19, 2, 15, "#596e63");
  r(35, 31, 10, 2, "#6a796b");
  r(10, 37, 15, 3, "#7c9b48");
  r(17, 35, 9, 2, "#b1c365");
  r(39, 8, 8, 2, "#a7b88a");
});
asset("bush", 40, 32, (r) => {
  for (let y = 2; y < 30; y += 2)
    for (let x = 0; x < 40; x += 2) {
      if (((x - 20) / 19) ** 2 + ((y - 18) / 14) ** 2 > 1) continue;
      const n = hash(x, y);
      r(
        x,
        y,
        2,
        2,
        ["#234f35", "#397438", "#619b3c", "#9bc546"][
          Math.min(3, Math.max(0, Math.floor((30 - y) / 10 + (n % 2))))
        ],
      );
      if (n % 17 === 0) r(x, y, 2, 2, "#eecb5a");
    }
});
asset("flowers", 32, 32, (r) => {
  for (let i = 0; i < 9; i++) {
    let n = hash(i, 81),
      x = 3 + (n % 26),
      y = 4 + ((n >>> 8) % 22);
    r(x, y, 1, 7, "#3d7939");
    r(x - 2, y + 3, 5, 1, "#6e9b3c");
    if (i % 2) {
      r(x - 2, y - 1, 5, 1, "#eee8be");
      r(x, y - 3, 1, 5, "#fff5d2");
      r(x, y - 1, 1, 1, "#e3ad37");
    } else {
      r(x - 1, y - 4, 3, 4, i % 3 ? "#ae7fc6" : "#f6cc5e");
      r(x, y - 3, 1, 2, "#e2b8da");
    }
  }
});
asset("reeds", 32, 48, (r) => {
  for (let i = 0; i < 9; i++) {
    const n = hash(i, 67),
      x = 2 + (n % 28),
      y = 8 + ((n >>> 8) % 19);
    r(x, y, 1, 46 - y, "#4c8c43");
    r(x - 1, y - 6, 3, 10, "#a17530");
    r(x, y - 6, 1, 9, "#dab548");
    r(x - 3, 29 + (n % 8), 1, 10, "#92b64a");
  }
});
asset("log", 64, 32, (r) => {
  r(6, 12, 49, 16, "#533e2c");
  r(8, 10, 45, 13, "#936339");
  r(9, 11, 43, 3, "#b38348");
  r(10, 20, 42, 2, "#69462f");
  r(52, 9, 7, 19, "#d7b16e");
  r(54, 12, 3, 12, "#a27b48");
  r(55, 15, 1, 5, "#deb778");
  r(20, 9, 3, 17, "#745132");
  r(34, 9, 2, 17, "#bd8a4c");
});
asset("cave", 160, 128, (r) => {
  for (let y = 4; y < 124; y += 2)
    for (let x = 4; x < 156; x += 2) {
      const outer = ((x - 80) / 75) ** 2 + ((y - 80) / 76) ** 2 < 1.05;
      const hole =
        (y > 64 && ((x - 80) / 29) ** 2 + ((y - 98) / 41) ** 2 < 1) ||
        (y > 91 && x > 51 && x < 110);
      if (!outer || hole) continue;
      const n = hash(Math.floor(x / 15), Math.floor(y / 16));
      const seam = (x + (Math.floor(y / 16) % 2) * 8) % 16 < 2 || y % 16 < 2;
      r(
        x,
        y,
        2,
        2,
        seam ? "#505f59" : ["#758176", "#8b9380", "#a3a78e", "#b7b59a"][n % 4],
      );
      if (y % 16 === 2) r(x, y, 2, 2, "#c0bda2");
      if (y < 32 && hash(x, y) % 4 < 2)
        r(x, y, 2, 2, ["#547f38", "#7fa23e", "#a9c34e"][hash(x, y) % 3]);
    }
  r(55, 119, 52, 5, "#a28957");
  r(61, 116, 41, 3, "#c3a16b");
  for (let j = 0; j < 35; j++) {
    let n = hash(j, 68),
      x = j % 2 ? 22 + (n % 18) : 118 + (n % 17),
      y = 23 + ((n >>> 8) % 88);
    r(x, y, 2, 4, "#517f39");
    r(x - 2, y, 5, 2, "#8cab45");
  }
});
fs.writeFileSync(
  path.join(out, "LICENSE.txt"),
  "Original Microcosme V4-I1 pixel illustrations, generated by tools/build-forest-assets.cjs.\nDedicated to the public domain under CC0 1.0 (https://creativecommons.org/publicdomain/zero/1.0/).\nNo pixels from the V4-S2 reference are included. No external font or image dependency.\n",
);
console.log("Forest illustrations rebuilt deterministically.");
const inventory = fs
  .readdirSync(out)
  .filter((name) => name.endsWith(".svg"))
  .sort()
  .map((name) => {
    const data = fs.readFileSync(path.join(out, name));
    const [, width, height] = data
      .toString()
      .match(/width="(\d+)" height="(\d+)"/);
    return {
      key: name.slice(0, -4),
      path: "assets/forest/" + name,
      width: Number(width),
      height: Number(height),
      bytes: data.length,
      sha256: crypto.createHash("sha256").update(data).digest("hex"),
    };
  });
fs.writeFileSync(
  path.join(out, "manifest.json"),
  JSON.stringify(
    {
      license: "CC0-1.0",
      generator: "tools/build-forest-assets.cjs",
      assets: inventory,
    },
    null,
    2,
  ) + "\n",
);
