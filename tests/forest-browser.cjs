/* Real Canvas pixels + touch/navigation. WebKit Linux is not physical iPad. */
const { chromium, webkit } = require("playwright"),
  assert = require("node:assert/strict");
const http = require("node:http"),
  fs = require("node:fs"),
  path = require("node:path");
const root = path.resolve(__dirname, "..");
const types = {
  ".js": "text/javascript",
  ".css": "text/css",
  ".html": "text/html",
  ".svg": "image/svg+xml",
};
const server = http.createServer((req, res) => {
  const file = path.resolve(
    root,
    "." +
      decodeURIComponent(req.url.split("?")[0]).replace(/^\/Microcosme/, ""),
  );
  if (
    !file.startsWith(root + path.sep) ||
    !fs.existsSync(file) ||
    !fs.statSync(file).isFile()
  ) {
    res.writeHead(404).end();
    return;
  }
  res.setHeader(
    "Content-Type",
    types[path.extname(file)] || "application/octet-stream",
  );
  res.end(fs.readFileSync(file));
});
async function signature(page) {
  return page.evaluate(() => {
    const c = document.getElementById("land"),
      d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    let h = 2166136261;
    for (let i = 0; i < d.length; i++) h = Math.imul(h ^ d[i], 16777619);
    return h >>> 0;
  });
}
async function pixels(page) {
  return page.evaluate(() => document.getElementById("land").toDataURL());
}
async function setup(context, fixture = false) {
  await context.addInitScript(
    ({ fixture }) => {
      window.__visualTime = 1000;
      performance.now = () => window.__visualTime;
      window.__intervals = [];
      window.setInterval = (fn) => {
        __intervals.push(fn);
        return __intervals.length;
      };
      window.clearInterval = (id) => {
        __intervals[id - 1] = null;
      };
      if (fixture) {
        let island;
        Object.defineProperty(window, "MicrocosmeIsland", {
          configurable: true,
          get: () => island,
          set: (value) => {
            island = {
              ...value,
              create: () => {
                const w = value.create();
                window.__fixtureWorld = w;
                return w;
              },
            };
          },
        });
      }
    },
    { fixture },
  );
}
(async () => {
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const local =
    "http://127.0.0.1:" + server.address().port + "/Microcosme/forest.html";
  const base = process.env.FOREST_URL || local,
    report = [];
  try {
    for (const type of [chromium, webkit].filter(
      (t) =>
        !process.env.BROWSERS ||
        process.env.BROWSERS.split(",").includes(t.name()),
    )) {
      const browser = await type.launch({
        headless: true,
        ...(type === chromium && process.env.CHROMIUM_PATH
          ? { executablePath: process.env.CHROMIUM_PATH }
          : {}),
      });
      try {
        const context = await browser.newContext({
          viewport: { width: 820, height: 1180 },
          hasTouch: true,
        });
        await setup(context);
        await context.addInitScript(() => {
          localStorage.setItem("microcosme-v03", "historical sentinel");
          localStorage.setItem(
            "microcosme-material-lab-v1",
            "material sentinel",
          );
        });
        const p = await context.newPage(),
          errors = [];
        p.on("pageerror", (e) => errors.push(e.message));
        const url = new URL(base);
        url.searchParams.set("review", "1");
        await p.goto(url.href);
        await p.waitForFunction(() => window.ForestDiagnostics);
        await p.locator("#pause").tap();
        const snap = () => p.evaluate(() => ForestDiagnostics.snapshot());
        const tick = (n) =>
          p.evaluate((n) => {
            for (let j = 0; j < n; j++) {
              __visualTime += 600;
              __intervals.filter(Boolean).forEach((fn) => fn());
            }
          }, n);
        let s = await snap();
        const initialWorld = JSON.stringify(s.world),
          initialObjects = JSON.stringify(s.objects);
        const tree =
          s.objects.find(
            (o) =>
              o.assetKey === "oak" &&
              o.worldPosition.x === 34 &&
              o.worldPosition.y === 30,
          ) || s.objects.find((o) => o.assetKey === "oak");
        await p.evaluate(
          (o) => ForestReview.focus(o.worldPosition.x, o.worldPosition.y),
          tree,
        );
        const before = await pixels(p);
        await p.evaluate((id) => ForestReview.hide(id), tree.id);
        const hidden = await pixels(p);
        assert.notEqual(hidden, before, "01: tree removal changes real pixels");
        assert.ok(
          !(await snap()).renderer.layers.some((e) => e.id === tree.id),
          "01: no remaining shadow/trunk/crown",
        );
        await p.evaluate((id) => ForestReview.hide(id, false), tree.id);
        assert.equal(
          await pixels(p),
          before,
          "01: exact restoration, no residues",
        );
        await p.evaluate((id) => ForestReview.hide(id), tree.id);
        assert.equal(
          await pixels(p),
          hidden,
          "01: exact recomposition after repeated removal",
        );
        await p.evaluate((id) => ForestReview.hide(id, false), tree.id);
        await p.locator("#clearing").tap();
        const stable = await signature(p);
        await p.reload();
        await p.waitForFunction(() => window.ForestDiagnostics);
        await p.locator("#pause").tap();
        assert.equal(
          JSON.stringify((await snap()).objects),
          initialObjects,
          "04: stable identities/variants",
        );
        assert.equal(
          await signature(p),
          stable,
          "04: identical rendered pixels on reload",
        );
        await p.locator("#resident").tap();
        assert.ok(await p.locator("#sheet").isVisible());
        await p.locator("#follow").tap();
        assert.equal((await snap()).followed, 1);
        const box = await p.locator("#viewport").boundingBox();
        await p.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.6);
        await p.mouse.down();
        await p.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.4, {
          steps: 6,
        });
        await p.mouse.up();
        await p.waitForTimeout(50);
        assert.equal((await snap()).followed, null);
        const cam = (await snap()).camera;
        await p.locator("#zoom-in").tap();
        assert.ok((await snap()).camera.zoom > cam.zoom);
        await p.locator("#zoom-reset").tap();
        assert.equal((await snap()).camera.zoom, 0.75);
        async function aligned() {
          const a = await p.evaluate(() => {
            const s = ForestDiagnostics.snapshot(),
              v = s.visuals[0],
              c = s.camera,
              n = document.querySelector(".actor");
            return {
              left: parseFloat(n.style.left),
              top: parseFloat(n.style.top),
              x: ((v.pos.x + 0.5 - c.x) / c.width) * 100,
              y: ((v.pos.y + 0.5 - c.y) / c.height) * 100,
            };
          });
          // CSSOM serializes percentages with fewer digits than JS doubles.
          assert.ok(Math.abs(a.left - a.x) < 0.001, JSON.stringify(a));
          assert.ok(Math.abs(a.top - a.y) < 0.001, JSON.stringify(a));
        }
        await p.locator("#locate").tap();
        await aligned();
        await p.locator("#zoom-in").tap();
        await aligned();
        await p.locator("#zoom-reset").tap();
        if (type === chromium) {
          const cdp = await context.newCDPSession(p),
            b = await p.locator("#viewport").boundingBox(),
            cx = b.x + b.width * 0.5,
            cy = b.y + b.height * 0.5;
          const z = (await snap()).camera.zoom;
          await cdp.send("Input.dispatchTouchEvent", {
            type: "touchStart",
            touchPoints: [
              { id: 1, x: cx - 35, y: cy },
              { id: 2, x: cx + 35, y: cy },
            ],
          });
          for (let j = 1; j <= 5; j++)
            await cdp.send("Input.dispatchTouchEvent", {
              type: "touchMove",
              touchPoints: [
                { id: 1, x: cx - 35 - j * 5, y: cy },
                { id: 2, x: cx + 35 + j * 5, y: cy },
              ],
            });
          await cdp.send("Input.dispatchTouchEvent", {
            type: "touchEnd",
            touchPoints: [],
          });
          await p.waitForTimeout(50);
          assert.ok((await snap()).camera.zoom > z);
          assert.equal((await snap()).pointers, 0);
          await cdp.detach();
        }
        await p.locator("#zoom-reset").tap();
        await p.locator("#cave").tap();
        const exterior = (await snap()).camera;
        await p.locator("#portal").tap();
        assert.equal((await snap()).scene.kind, "interior");
        await p.locator("#outside").tap();
        assert.deepEqual((await snap()).camera, exterior);
        await p.locator("#mini-toggle").tap();
        await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        assert.ok(await p.locator("#global").isVisible());
        await p.locator("#global").tap();
        assert.equal((await snap()).scene.kind, "global");
        assert.equal(
          JSON.stringify((await snap()).world),
          initialWorld,
          "03/05: all navigation leaves world untouched",
        );
        await p.locator("#clearing").tap();
        await p.locator("#resident").tap();
        await p.locator("#follow").tap();
        await p.locator("#pause").tap();
        let entered = false,
          exited = false;
        for (let i = 0; i < 320; i++) {
          await tick(1);
          s = await snap();
          assert.equal(s.world.people.length, 1);
          assert.equal(s.world.people[0].id, 1);
          if (s.scene.kind === "interior") entered = true;
          else if (entered) {
            exited = true;
            break;
          }
        }
        assert.ok(
          entered && exited,
          "05: same autonomous resident visits and exits real cave",
        );
        await p.locator("#pause").tap();
        await p.evaluate(() => {
          __visualTime += 700;
          document.getElementById("mini-toggle").click();
        });
        await p.waitForFunction(
          () => !ForestDiagnostics.snapshot().animationScheduled,
        );
        s = await snap();
        assert.deepEqual(s.visuals[0].pos, s.world.people[0].pos);
        const stopped = JSON.stringify(s.world);
        await p.waitForTimeout(150);
        assert.equal(JSON.stringify((await snap()).world), stopped);
        await p.emulateMedia({ reducedMotion: "reduce" });
        await p.locator("#pause").tap();
        await tick(2);
        s = await snap();
        assert.deepEqual(s.visuals[0].pos, s.world.people[0].pos);
        assert.equal(s.animationScheduled, false);
        await p.locator("#pause").tap();
        for (const viewport of [
          { width: 1180, height: 820 },
          { width: 390, height: 844 },
        ]) {
          await p.setViewportSize(viewport);
          assert.ok(
            await p.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth + 1,
            ),
            "responsive width",
          );
          await p.locator("#clearing").tap();
          const actor = await p.locator(".actor").first().boundingBox();
          if (actor) {
            assert.ok(actor.width >= 44);
            assert.ok(actor.height >= 44);
          }
        }
        assert.deepEqual(
          await p.evaluate(() => [
            localStorage.getItem("microcosme-v03"),
            localStorage.getItem("microcosme-material-lab-v1"),
          ]),
          ["historical sentinel", "material sentinel"],
        );
        const activeUrl = p.url();
        await context.setOffline(true);
        await p.locator("#river").tap();
        assert.equal(p.url(), activeUrl);
        assert.ok(await p.evaluate(() => !!ForestDiagnostics));
        await context.setOffline(false);
        assert.deepEqual(errors, []);
        if (process.env.FOREST_CAPTURE) {
          await p.setViewportSize({ width: 1180, height: 1180 });
          await p.locator("#clearing").tap();
          await p.screenshot({
            path: path.join(
              process.env.FOREST_CAPTURE,
              type.name() + "-clearing.png",
            ),
            fullPage: true,
          });
          await p.locator("#cave").tap();
          await p.screenshot({
            path: path.join(
              process.env.FOREST_CAPTURE,
              type.name() + "-cave.png",
            ),
            fullPage: true,
          });
        }
        // Isolated test fixture only: real actor pixels on both sides of one tree.
        const fc = await browser.newContext({
          viewport: { width: 820, height: 1180 },
          hasTouch: true,
        });
        await setup(fc, true);
        const q = await fc.newPage();
        q.on("pageerror", (e) => errors.push(e.message));
        await q.goto(url.href);
        await q.waitForFunction(() => window.ForestDiagnostics);
        await q.locator("#pause").tap();
        await q.emulateMedia({ reducedMotion: "reduce" });
        const behind = await q.evaluate(() => {
          const o = ForestDiagnostics.snapshot().objects.find(
            (o) =>
              o.assetKey === "oak" &&
              o.worldPosition.x === 34 &&
              o.worldPosition.y === 30,
          );
          __fixtureWorld.state.people[0].pos = {
            ...o.worldPosition,
            y: o.worldPosition.y - 1.5,
          };
          ForestReview.focus(o.worldPosition.x, o.worldPosition.y);
          return o;
        });
        let order = await q.evaluate(
          (id) =>
            ForestDiagnostics.snapshot()
              .renderer.layers.filter((e) => e.id === id || e.type === "person")
              .map((e) => e.type),
          behind.id,
        );
        assert.deepEqual(order, ["person", "trunk", "crown"]);
        const obscured = await pixels(q);
        await q.evaluate((id) => ForestReview.hide(id), behind.id);
        assert.notEqual(
          await pixels(q),
          obscured,
          "02: foliage masks actual actor pixels",
        );
        await q.evaluate((o) => {
          __fixtureWorld.state.people[0].pos = {
            ...o.worldPosition,
            y: o.worldPosition.y + 1,
          };
          ForestReview.hide(o.id, false);
        }, behind);
        order = await q.evaluate(
          (id) =>
            ForestDiagnostics.snapshot()
              .renderer.layers.filter((e) => e.id === id || e.type === "person")
              .map((e) => e.type),
          behind.id,
        );
        assert.deepEqual(order, ["trunk", "crown", "person"]);
        const masked = await q.evaluate(async (tree) => {
          const c = document.createElement("canvas");
          c.width = 1024;
          c.height = 768;
          const r = await ForestRenderer.create(c),
            ctx = c.getContext("2d");
          for (const o of r.objects) r.hidden.add(o.id);
          const camera = IslandCamera.center(
              ForestModel.area,
              tree.worldPosition.x,
              tree.worldPosition.y,
              1,
            ),
            p = {
              id: 1,
              pos: { ...tree.worldPosition, y: tree.worldPosition.y - 1.5 },
              direction: 0,
              frame: 0,
            };
          const draw = (poses) => {
            r.render({ camera, kind: "local", poses, time: 0, reduced: true });
            return ctx.getImageData(0, 0, 1024, 768).data;
          };
          const bg = draw([]),
            actor = draw([p]);
          r.hidden.delete(tree.id);
          const volume = draw([]),
            both = draw([p]);
          let intersection = 0,
            covered = 0;
          for (let i = 0; i < bg.length; i += 4) {
            const diff = (a, b) =>
              a[i] !== b[i] || a[i + 1] !== b[i + 1] || a[i + 2] !== b[i + 2];
            if (diff(actor, bg) && diff(volume, bg)) {
              intersection++;
              if (!diff(both, volume)) covered++;
            }
          }
          return { intersection, covered };
        }, behind);
        assert.ok(
          masked.intersection > 10 &&
            masked.covered / masked.intersection > 0.95,
          "02: overlapping actor pixels are actually covered by tree pixels",
        );
        assert.deepEqual(errors, []);
        await fc.close();
        await context.close();
        report.push({
          browser: type.name(),
          version: browser.version(),
          url: base,
          result: "passed",
        });
        console.log(
          type.name() +
            ": V4 Canvas pixels, removal, occlusion, deterministic reload, real touch selection, camera/pinch, cave, world identity, responsive, offline and isolation OK",
        );
      } finally {
        await browser.close();
      }
    }
  } finally {
    await new Promise((r) => server.close(r));
  }
  if (process.env.FOREST_REPORT)
    fs.writeFileSync(
      process.env.FOREST_REPORT,
      JSON.stringify(report, null, 2) + "\n",
    );
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
