const { chromium, webkit } = require("playwright"),
  assert = require("node:assert/strict"),
  http = require("node:http"),
  fs = require("node:fs"),
  path = require("node:path");
const files = [
  "island.html",
  "island.css",
  "island.js",
  "graphics.js",
  "island-world.js",
  "island-camera.js",
  "island-art.js",
  "island-motion.js",
];
(async () => {
  const server = http.createServer((req, res) => {
    const file = req.url.split("?")[0].replace(/^\/Microcosme\//, "");
    if (!files.includes(file)) {
      res.writeHead(404).end();
      return;
    }
    res.setHeader(
      "Content-Type",
      file.endsWith(".js")
        ? "text/javascript"
        : file.endsWith(".css")
          ? "text/css"
          : "text/html",
    );
    res.end(fs.readFileSync(path.join(__dirname, "..", file)));
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  try {
    for (const type of [chromium, webkit].filter(
      (t) =>
        !process.env.BROWSERS ||
        process.env.BROWSERS.split(",").includes(t.name()),
    )) {
      const browser = await type.launch({ headless: true });
      try {
        const page = await browser.newPage({
          viewport: { width: 820, height: 1180 },
          hasTouch: true,
          ignoreHTTPSErrors:
            process.env.ISLAND_MOTION_IGNORE_CERT_ERRORS === "1",
        });
        const errors = [];
        page.on("pageerror", (e) => errors.push(e.message));
        // Test fixture only: eight real agents updated by the unchanged production step.
        await page.addInitScript(() => {
          Object.defineProperty(window, "MicrocosmeIsland", {
            configurable: true,
            set(api) {
              Object.defineProperty(window, "MicrocosmeIsland", {
                configurable: true,
                value: {
                  ...api,
                  create() {
                    const w = api.create(),
                      alix = w.state.people[0];
                    for (let i = 2; i <= 8; i++) {
                      const p = JSON.parse(JSON.stringify(alix));
                      p.id = i;
                      p.name = "Habitant " + i;
                      p.pos.x = 41 + (i % 3);
                      p.pos.y = 34 + Math.floor(i / 3);
                      w.state.people.push(p);
                    }
                    window.__motionWorld = w;
                    return w;
                  },
                },
              });
            },
          });
        });
        await page.goto(
          process.env.ISLAND_MOTION_URL ||
            "http://127.0.0.1:" +
              server.address().port +
              "/Microcosme/island.html",
        );
        await page.bringToFront();
        await page.locator("#resident").tap();
        await page.locator("#follow").tap();
        const samples = await page.evaluate(async () => {
          const a = [],
            start = performance.now();
          await new Promise((resolve) => {
            function frame() {
              const s = IslandDiagnostics.snapshot();
              a.push({
                time: performance.now(),
                tick: s.world.tick,
                world: JSON.stringify(s.world),
                visual: s.visuals[0].pos.x,
                camera: s.camera.x,
                left: document.querySelector('.actor[data-id="1"]').style.left,
              });
              if (performance.now() - start >= 2200) resolve();
              else requestAnimationFrame(frame);
            }
            requestAnimationFrame(frame);
          });
          return a;
        });
        assert.ok(samples.length >= 4, "real RAF frames are rendered");
        const groups = new Map();
        for (const p of samples) {
          if (!groups.has(p.tick)) groups.set(p.tick, []);
          groups.get(p.tick).push(p);
        }
        assert.ok(
          [...groups.values()].some(
            (g) =>
              new Set(g.map((s) => s.world)).size === 1 &&
              new Set(g.map((s) => s.visual.toFixed(4))).size >= 2 &&
              new Set(g.map((s) => s.left)).size >= 2 &&
              new Set(g.map((s) => s.camera.toFixed(4))).size >= 2,
          ),
          "sprite and camera move on real RAF frames while logical state is unchanged",
        );
        for (let i = 1; i < samples.length; i++)
          if (samples[i].time - samples[i - 1].time < 100)
            assert.ok(
              Math.abs(samples[i].camera - samples[i - 1].camera) < 0.35,
              "no camera jumps at consecutive short frames",
            );
        await page.waitForFunction(
          () => IslandDiagnostics.snapshot().visuals.some((v) => v.moving),
          null,
          { polling: 10 },
        );
        const pauseState = await page.evaluate(() => {
          document.getElementById("pause").click();
          return JSON.stringify(IslandDiagnostics.snapshot().world);
        });
        await page.waitForFunction(
          () => !IslandDiagnostics.snapshot().animationScheduled,
          {},
          { timeout: 4000 },
        );
        let s = await page.evaluate(() => IslandDiagnostics.snapshot());
        assert.equal(s.motionTracks, 8);
        assert.equal(await page.locator(".actor").count(), 8);
        for (const p of s.world.people) {
          const v = s.visuals.find((v) => v.id === p.id);
          assert.deepEqual(v.pos, p.pos);
          assert.equal(v.moving, false);
        }
        const stopped = JSON.stringify(s.world);
        assert.equal(stopped, pauseState);
        await page.waitForTimeout(200);
        assert.equal(
          JSON.stringify(
            (await page.evaluate(() => IslandDiagnostics.snapshot())).world,
          ),
          stopped,
        );
        // Discontinuous test fixture relocation must snap, never cross unrelated terrain.
        await page.evaluate(() => {
          __motionWorld.state.people[0].pos = { space: "cave", x: 8, y: 10 };
          document.getElementById("mini-toggle").click();
        });
        s = await page.evaluate(() => IslandDiagnostics.snapshot());
        assert.equal(s.scene.kind, "interior");
        assert.deepEqual(s.visuals[0].pos, s.world.people[0].pos);
        await page.locator("#global").tap();
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.locator("#pause").tap();
        const before = s.world.tick;
        await page.waitForFunction(
          (t) => IslandDiagnostics.snapshot().world.tick > t,
          before,
        );
        s = await page.evaluate(() => IslandDiagnostics.snapshot());
        for (const v of s.visuals)
          assert.deepEqual(
            v.pos,
            s.world.people.find((p) => p.id === v.id).pos,
          );
        assert.equal(s.animationScheduled, false);
        assert.deepEqual(errors, []);
        console.log(
          type.name() +
            ": real RAF interpolation, damped camera, pause settling, 8 agents, teleport/interior and reduced motion OK",
        );
      } finally {
        await browser.close();
      }
    }
  } finally {
    await new Promise((r) => server.close(r));
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
