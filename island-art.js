/* Original orthographic pixel resources. No network, simulation or DOM dependency. */
(function (root, factory) {
  if (typeof module === "object")
    module.exports = factory(require("./graphics"));
  else root.IslandArt = factory(root.MicrocosmeGraphics);
})(globalThis, function (G) {
  "use strict";
  const biomes = {
    forest: {
      name: "Forêt tempérée",
      palette: ["#679957", "#36764c", "#b3cd78"],
      motif: "deciduous",
    },
    jungle: {
      name: "Jungle tropicale",
      palette: ["#357951", "#175b49", "#94c75c"],
      motif: "broadleaf",
    },
    swamp: {
      name: "Marécages",
      palette: ["#748b5a", "#385e61", "#b4bd77"],
      motif: "reeds",
    },
    plain: {
      name: "Plaines et prairies",
      palette: ["#91b666", "#527d4e", "#eedf9c"],
      motif: "flowers",
    },
    sand: {
      name: "Plages",
      palette: ["#e3ca8c", "#bda36e", "#f9edc3"],
      motif: "shells",
    },
    cliff: {
      name: "Falaises côtières",
      palette: ["#a0a79a", "#5b7176", "#d7d7bb"],
      motif: "coastal-rock",
    },
    mountain: {
      name: "Montagnes",
      palette: ["#939782", "#58666b", "#d3c8a0"],
      motif: "peaks",
    },
    snow: {
      name: "Sommets enneigés et glaciers",
      palette: ["#dcece4", "#79abbc", "#f8fff2"],
      motif: "ice",
    },
    volcano: {
      name: "Volcan",
      palette: ["#554a52", "#292f3b", "#f49c47"],
      motif: "lava",
    },
    desert: {
      name: "Désert et dunes",
      palette: ["#d8ad6b", "#ac784e", "#f2cf8d"],
      motif: "dunes",
    },
    canyon: {
      name: "Canyons",
      palette: ["#c4825c", "#784b49", "#edb080"],
      motif: "strata",
    },
    heath: {
      name: "Landes et collines",
      palette: ["#9b9c67", "#65784d", "#c6a2bf"],
      motif: "heather",
    },
    tundra: {
      name: "Toundra alpine",
      palette: ["#a6b5a0", "#798f85", "#e2d7b6"],
      motif: "lichen",
    },
    mangrove: {
      name: "Mangroves",
      palette: ["#519287", "#286755", "#add093"],
      motif: "roots",
    },
  };
  function tile(c, kind, x, y) {
    const b = biomes[kind],
      n = G.hash(x + y * 96),
      p =
        b?.palette ||
        (["river", "water", "ocean"].includes(kind)
          ? ["#397c98", "#286078", "#96d7d7"]
          : ["#75776e", "#51575d", "#acb9a9"]);
    const r = (x, y, w, h, color) => {
      c.fillStyle = color;
      c.fillRect(x, y, w, h);
    };
    r(0, 0, 32, 32, p[0]);
    for (let j = 0; j < 18; j++) {
      const a = G.hash(n, j);
      r(
        a % 31,
        (a >>> 8) % 31,
        1 + (a % 3),
        1,
        j % 3 ? p[1] + "55" : p[2] + "88",
      );
    }
    const k = n % 4,
      a = 3 + (n % 5);
    const tree = (tropical = false, roots = false) => {
      r(14, 12, 4, 17, "#685339");
      if (roots) {
        r(8, 24, 5, 2, "#b2a77c");
        r(20, 23, 6, 2, "#b2a77c");
        r(10, 21, 2, 5, "#685339");
      }
      r(5, 5 + k, 23, 13, p[1]);
      r(9, 2 + k, 15, 17, p[1]);
      r(7, 6 + k, 14, 7, p[2]);
      r(11, 3 + k, 10, 3, "#b9d87b");
      if (tropical) {
        r(2, 10, 28, 4, p[1]);
        r(12, 0, 6, 20, p[1]);
        r(13, 1, 2, 14, p[2]);
      }
      r(19, 14, 7, 5, p[1]);
    };
    // Open patches and sparse landmarks break the all-cells-identical motif grid.
    if (
      ["forest", "jungle", "mountain", "cliff", "heath", "tundra"].includes(
        kind,
      ) &&
      n % 4 === 0
    )
      return;
    if (kind === "volcano" && n % 3 !== 0) {
      r(3, 8 + k, 12, 1, p[1]);
      r(17, 19 - k, 11, 1, p[1]);
      if (n % 3 === 1) {
        r(13, 3, 1, 17, "#c55c3b");
        r(13, 19, 8, 1, p[2]);
      }
      return;
    }
    if (kind === "snow" && n % 3 !== 0) {
      r(4, 13 + k, 19, 1, "#bad9de");
      r(16, 14 + k, 1, 9, p[1]);
      return;
    }
    switch (kind) {
      case "forest":
        tree();
        if (k === 0) {
          r(3, 26, 3, 2, "#d7bda0");
          r(2, 24, 5, 2, "#aa6c56");
        }
        break;
      case "jungle":
        tree(true);
        r(5, 16, 1, 11, "#9ebd58");
        r(22, 18, 1, 10, "#9ebd58");
        r(2, 25, 6, 3, p[1]);
        r(3, 24, 2, 2, "#e8b276");
        break;
      case "mangrove":
        r(0, 20, 32, 12, "#397f8c");
        r(3, 27, 9, 1, "#94d0c1");
        tree(false, true);
        break;
      case "swamp":
        r(2, 8, 27, 15, p[1]);
        r(4, 10, 17, 2, "#759e91");
        for (let i = 0; i < 5; i++) {
          r(3 + i * 6, 16 - (i % 2) * 7, 1, 12, p[2]);
          r(2 + i * 6, 14 - (i % 2) * 7, 3, 4, "#88744e");
        }
        break;
      case "plain":
        for (let i = 0; i < 5; i++) {
          let v = G.hash(n, i + 30),
            x = 2 + (v % 26),
            y = 5 + ((v >>> 8) % 23);
          r(x, y, 1, 5, p[1]);
          r(x - 1, y + 2, 3, 1, p[1]);
          r(x - 1, y, 3, 2, i % 2 ? p[2] : "#e9bbbf");
        }
        break;
      case "sand":
        r(0, 25 + k, 32, 1, p[1]);
        r(3, 26 + k, 23, 1, p[2]);
        r(a, 9, 5, 3, p[2]);
        r(a + 1, 8, 3, 1, "#faf4db");
        r(24, 17, 2, 2, p[1]);
        break;
      case "mountain":
      case "cliff":
        r(3, 13, 26, 15, p[1]);
        r(7, 7 + k, 18, 18, p[0]);
        r(11, 2 + k, 10, 21, p[2]);
        r(16, 8, 8, 17, p[0]);
        r(5, 27, 24, 2, p[1]);
        if (kind === "cliff") {
          r(0, 29, 32, 3, "#488b9e");
          r(9, 18, 15, 2, p[1]);
          r(7, 23, 20, 1, p[2]);
        }
        break;
      case "snow":
        r(0, 19, 32, 5, "#bddbdc");
        r(5, 6, 21, 13, p[2]);
        r(9, 2, 12, 19, p[2]);
        r(11, 22, 2, 10, p[1]);
        r(13, 21, 8, 2, p[1]);
        r(21, 17, 2, 6, p[1]);
        break;
      case "volcano":
        r(3, 9, 27, 19, p[1]);
        r(9, 4, 14, 8, "#796058");
        r(12, 5, 8, 4, "#e46c3d");
        r(16, 11, 3, 10, p[2]);
        r(13, 18, 5, 3, "#e86838");
        r(13, 21, 2, 9, "#ffb75a");
        break;
      case "desert":
        for (let j = 0; j < 3; j++) {
          let y = 4 + j * 10;
          r(0, y + 3 + k, 32, 1, p[1]);
          r(a, y, 21, 2, p[2]);
          r(a + 4, y - 2, 13, 2, p[2]);
        }
        if (k === 0) {
          r(24, 12, 3, 12, "#66835a");
          r(21, 14, 3, 3, "#66835a");
          r(21, 11, 1, 4, "#66835a");
        }
        break;
      case "canyon":
        r(0, 12 + k, 32, 11, p[1]);
        r(0, 9 + k, 32, 3, p[2]);
        r(0, 22 + k, 32, 2, "#d49e73");
        r(4, 4, 2, 5, p[1]);
        r(20, 26, 2, 6, p[1]);
        r(5, 5, 15, 1, p[2]);
        break;
      case "heath":
        r(2, 18, 27, 10, p[1]);
        r(7, 14, 18, 4, p[1]);
        for (let j = 0; j < 5; j++) {
          r(4 + j * 5, 18 + (j % 2) * 4, 3, 4, p[2]);
          r(4 + j * 5, 22 + (j % 2) * 4, 1, 3, "#a9bd7b");
        }
        break;
      case "tundra":
        r(a, 13, 16, 10, p[1]);
        r(a + 2, 10, 11, 5, p[2]);
        for (let j = 0; j < 4; j++) {
          r(3 + j * 7, 26 - (j % 2) * 3, 4, 2, "#c8ca87");
          r(5 + j * 7, 25 - (j % 2) * 3, 2, 2, "#e0cfb1");
        }
        break;
      default:
        for (let j = 0; j < 3; j++) {
          r(2 + j * 11, 8 + j * 7, 8, 1, p[2]);
          r(5 + j * 9, 10 + j * 7, 5, 1, p[1]);
        }
    }
  }
  return { biomes, tile };
});
