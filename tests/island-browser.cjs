/* Touch UI integration, served at /Microcosme/ like GitHub Pages. */
const { chromium, webkit } = require("playwright");
const assert = require("node:assert/strict");
const http = require("node:http"),
  fs = require("node:fs"),
  path = require("node:path");
const files = [
  "island.html",
  "island.css",
  "island.js",
  "island-world.js",
  "graphics.js",
  "island-camera.js",
  "island-art.js",
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
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
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
        // Deterministic clock: the production timer still drives every step.
        await context.addInitScript(() => {
          window.__intervals = [];
          window.setInterval = (fn) => {
            window.__intervals.push(fn);
            return window.__intervals.length;
          };
          window.clearInterval = (id) => {
            window.__intervals[id - 1] = null;
          };
        });
        const page = await context.newPage(),
          errors = [];
        page.on("pageerror", (e) => errors.push(e.message));
        await page.goto(
          "http://127.0.0.1:" +
            server.address().port +
            "/Microcosme/island.html",
        );
        const snap = () => page.evaluate(() => IslandDiagnostics.snapshot());
        const tick = (n) =>
          page.evaluate((n) => {
            for (let i = 0; i < n; i++)
              window.__intervals.filter(Boolean).forEach((fn) => fn());
          }, n);
        await page.evaluate(() => {
          localStorage.setItem("microcosme-v03", "historical sentinel");
          localStorage.setItem(
            "microcosme-material-lab-v1",
            "material sentinel",
          );
        });
        assert.equal((await snap()).scene.kind, "global");
        assert.equal(await page.locator("#regions button").count(), 9);
        assert.equal(
          await page
            .locator("#regions button")
            .allTextContents()
            .then((a) => a.join("")),
          "",
        );
        await page
          .getByRole("button", { name: "Observer La plaine", exact: true })
          .tap();
        assert.ok(await page.locator("#region-toast").isVisible());
        await page.waitForTimeout(2300);
        assert.equal(await page.locator("#region-toast").isVisible(), false);
        const camBefore = (await snap()).camera,
          box = await page.locator("#viewport").boundingBox();
        await page.mouse.move(
          box.x + box.width * 0.7,
          box.y + box.height * 0.7,
        );
        await page.mouse.down();
        await page.mouse.move(
          box.x + box.width * 0.2,
          box.y + box.height * 0.2,
          { steps: 8 },
        );
        await page.mouse.up();
        const camAfter = (await snap()).camera;
        assert.notDeepEqual(camAfter, camBefore);
        assert.equal(camAfter.width, 16);
        assert.equal(camAfter.height, 12);
        const region = (await snap()).scene.region;
        assert.ok(
          camAfter.x >= (region % 3) * 32 &&
            camAfter.x + 16 <= (region % 3) * 32 + 32,
        );
        if (type === chromium) {
          const cdp = await context.newCDPSession(page),
            beforeTouch = (await snap()).camera;
          const x = box.x + box.width * 0.2,
            y = box.y + box.height * 0.2;
          await cdp.send("Input.dispatchTouchEvent", {
            type: "touchStart",
            touchPoints: [{ x, y }],
          });
          for (let i = 1; i <= 5; i++)
            await cdp.send("Input.dispatchTouchEvent", {
              type: "touchMove",
              touchPoints: [
                { x: x + box.width * 0.1 * i, y: y + box.height * 0.1 * i },
              ],
            });
          await cdp.send("Input.dispatchTouchEvent", {
            type: "touchEnd",
            touchPoints: [],
          });
          assert.notDeepEqual((await snap()).camera, beforeTouch);
          for (let cycle = 0; cycle < 4; cycle++) {
            const b = await page.locator("#viewport").boundingBox(),
              cx = b.x + b.width * 0.5,
              cy = b.y + b.height * 0.5;
            const gesture = async (from, to) => {
              await cdp.send("Input.dispatchTouchEvent", {
                type: "touchStart",
                touchPoints: [
                  { id: 1, x: cx - from, y: cy },
                  { id: 2, x: cx + from, y: cy },
                ],
              });
              for (let j = 1; j <= 6; j++) {
                const d = from + ((to - from) * j) / 6;
                await cdp.send("Input.dispatchTouchEvent", {
                  type: "touchMove",
                  touchPoints: [
                    { id: 1, x: cx - d, y: cy },
                    { id: 2, x: cx + d, y: cy },
                  ],
                });
              }
              await cdp.send("Input.dispatchTouchEvent", {
                type: "touchEnd",
                touchPoints: [],
              });
            };
            const z = (await snap()).camera.zoom;
            await gesture(50, 80);
            assert.ok((await snap()).camera.zoom > z);
            await gesture(80, 50);
            assert.ok(Math.abs((await snap()).camera.zoom - z) < 0.001);
          }
          assert.equal((await snap()).pointers, 0);
          await cdp.detach();
        }
        for (let i = 0; i < 4; i++) {
          await page.locator("#zoom-in").tap();
          await page.locator("#zoom-out").tap();
        }
        assert.ok(Math.abs((await snap()).camera.zoom - 1) < 0.001);
        await page.locator("#zoom-reset").tap();
        await page.locator("#global").tap();
        const start = (await snap()).world;
        await tick(2);
        assert.notDeepEqual(
          (await snap()).world.people[0].pos,
          start.people[0].pos,
        );
        // Touch the sprite, follow its original identity, then release to inspect another region.
        await page.locator(".actor").tap();
        assert.ok(await page.locator("#sheet").isVisible());
        await page.locator("#follow").tap();
        assert.equal((await snap()).followed, 1);
        assert.equal((await snap()).scene.region, 4);
        await page.locator("#global").tap();
        await page
          .getByRole("button", { name: "Observer Les pins", exact: true })
          .tap();
        const before = (await snap()).world;
        await tick(20);
        assert.ok((await snap()).world.tick > before.tick);
        assert.equal(await page.locator(".actor:visible").count(), 0);
        // A distant sheet and follow recover the same resident, not a scene-local copy.
        await page.locator("#resident").tap();
        await page.locator("#follow").tap();
        assert.equal((await snap()).world.people[0].id, 1);
        let entered = false,
          exited = false;
        for (let i = 0; i < 250; i++) {
          await tick(1);
          const s = await snap();
          if (s.scene.kind === "local") {
            const p = s.world.people[0].pos,
              c = s.camera;
            assert.ok(
              p.x >= c.x && p.x < c.x + 16 && p.y >= c.y && p.y < c.y + 12,
            );
          }
          if (s.scene.kind === "interior") entered = true;
          else if (entered) {
            exited = true;
            break;
          }
        }
        assert.ok(
          entered && exited,
          "follow enters and exits the interior autonomously",
        );
        // Explicit observer navigation, pause and return mapping.
        await page.locator("#pause").tap();
        await page.locator("#global").tap();
        await page
          .getByRole("button", { name: "Observer Les sommets", exact: true })
          .tap();
        const frozen = JSON.stringify((await snap()).world);
        const exteriorCamera = (await snap()).camera;
        assert.ok(await page.locator("#portal").isVisible());
        await page.locator("#portal").tap();
        assert.equal((await snap()).scene.kind, "interior");
        await page.locator("#portal").tap();
        assert.equal((await snap()).scene.region, 2);
        assert.deepEqual((await snap()).camera, exteriorCamera);
        await page.locator("#portal").tap();
        await page.locator("#outside").tap();
        assert.equal((await snap()).scene.region, 2);
        assert.deepEqual((await snap()).camera, exteriorCamera);
        await page.locator("#global").tap();
        await tick(5);
        assert.equal(JSON.stringify((await snap()).world), frozen);
        assert.equal(await page.locator(".actor").count(), 1);
        assert.deepEqual(
          await page.evaluate(() => [
            localStorage.getItem("microcosme-v03"),
            localStorage.getItem("microcosme-material-lab-v1"),
          ]),
          ["historical sentinel", "material sentinel"],
        );
        // Permanent screen navigation: no dependency on camera, zoom, scroll or minimap.
        for (let round = 0; round < 3; round++) {
          await page
            .getByRole("button", { name: "Observer La plaine", exact: true })
            .tap();
          assert.ok(await page.locator("#mini-panel").isVisible());
          assert.match(
            await page.locator("#mini-title").textContent(),
            /La plaine/,
          );
          const worldBefore = JSON.stringify((await snap()).world);
          const miniBefore = await page.locator("#mini-position").textContent();
          for (let j = 0; j < 5; j++) await page.locator("#zoom-in").tap();
          const box = await page.locator("#viewport").boundingBox();
          await page.mouse.move(
            box.x + box.width * 0.65,
            box.y + box.height * 0.6,
          );
          await page.mouse.down();
          await page.mouse.move(
            box.x + box.width * 0.25,
            box.y + box.height * 0.25,
            { steps: 30 },
          );
          await page.mouse.up();
          await page.waitForFunction(
            (before) =>
              document.getElementById("mini-position").textContent !== before,
            miniBefore,
          );
          await page.locator("#mini-toggle").tap();
          assert.equal(await page.locator("#mini-panel").isVisible(), false);
          assert.equal(
            await page.locator("#mini-toggle").getAttribute("aria-expanded"),
            "false",
          );
          const fixedBefore = await page.locator("#global").boundingBox();
          await page.evaluate(() =>
            scrollTo(0, document.documentElement.scrollHeight),
          );
          const fixedAfter = await page.locator("#global").boundingBox();
          assert.equal(fixedBefore.y, fixedAfter.y);
          assert.equal(fixedBefore.x, fixedAfter.x);
          assert.ok(fixedAfter.width >= 44 && fixedAfter.height >= 48);
          assert.ok(
            await page.locator("#global").evaluate((el) => {
              const b = el.getBoundingClientRect();
              return el.contains(
                document.elementFromPoint(
                  b.x + b.width / 2,
                  b.y + b.height / 2,
                ),
              );
            }),
          );
          await page
            .getByRole("button", { name: "Carte du monde", exact: true })
            .tap();
          assert.equal((await snap()).scene.kind, "global");
          assert.equal((await snap()).pointers, 0);
          assert.equal(JSON.stringify((await snap()).world), worldBefore);
          await page
            .getByRole("button", { name: "Observer Les sommets", exact: true })
            .tap();
          assert.equal(await page.locator("#mini-panel").isVisible(), false);
          await page.locator("#mini-toggle").tap();
          assert.ok(await page.locator("#mini-panel").isVisible());
          await page.locator("#portal").tap();
          assert.equal((await snap()).scene.kind, "interior");
          assert.match(
            await page.locator("#mini-title").textContent(),
            /intérieur/,
          );
          await page.locator("#mini-toggle").tap();
          await page.locator("#global").tap();
          assert.equal((await snap()).scene.kind, "global");
          assert.equal(JSON.stringify((await snap()).world), worldBefore);
          await page
            .getByRole("button", { name: "Observer La plaine", exact: true })
            .tap();
          await page.locator("#mini-toggle").tap();
          await page.locator("#global").tap();
        }
        await page.locator("#resident").tap();
        await page.locator("#sheet-world").tap();
        assert.equal(await page.locator("#sheet").isVisible(), false);
        assert.equal((await snap()).scene.kind, "global");
        assert.equal(JSON.stringify((await snap()).world), frozen);
        // Portrait and landscape: no document overflow, entire map visible, 44px targets.
        for (const viewport of [
          { width: 820, height: 1180 },
          { width: 1180, height: 820 },
          { width: 390, height: 844 },
        ]) {
          await page.setViewportSize(viewport);
          assert.ok(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          );
          const map = await page.locator("#viewport").boundingBox();
          assert.ok(map.x >= 0 && map.x + map.width <= viewport.width + 1);
          assert.ok(
            map.y + map.height <= viewport.height + 1,
            "entire island fits on screen",
          );
          const target = await page.locator(".actor").boundingBox();
          assert.ok(target.width >= 44 && target.height >= 44);
        }
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.locator("#resident").tap();
        await page.keyboard.press("Escape");
        assert.equal(await page.locator("#sheet").isVisible(), false);
        // After initial load all scene transitions remain available offline.
        await context.setOffline(true);
        await page.locator("#global").tap();
        await page
          .getByRole("button", { name: "Observer Les sommets", exact: true })
          .tap();
        await page.locator("#portal").tap();
        assert.equal((await snap()).scene.kind, "interior");
        await page.evaluate(() => {
          Object.defineProperty(document, "hidden", {
            configurable: true,
            value: true,
          });
          document.dispatchEvent(new Event("visibilitychange"));
        });
        const hiddenTick = (await snap()).world.tick;
        await tick(3);
        assert.equal((await snap()).world.tick, hiddenTick);
        await page.evaluate(() => {
          Object.defineProperty(document, "hidden", {
            configurable: true,
            value: false,
          });
          document.dispatchEvent(new Event("visibilitychange"));
        });
        await tick(3);
        assert.equal((await snap()).world.tick, hiddenTick);
        await page.locator("#pause").tap();
        await tick(1);
        assert.equal((await snap()).world.tick, hiddenTick + 1);
        await page.screenshot({
          path:
            process.env.ISLAND_SCREENSHOT ||
            "/tmp/microcosme-island-" + type.name() + ".png",
          fullPage: true,
        });
        assert.deepEqual(errors, []);
        console.log(
          type.name() +
            ": island touch navigation, follow, offscreen activity, interiors, storage isolation, viewport and offline OK",
        );
        await context.close();
        // Independently verify the real (unmodified) browser timer and pause.
        const real = await browser.newPage();
        await real.goto(
          "http://127.0.0.1:" +
            server.address().port +
            "/Microcosme/island.html",
        );
        await real.waitForFunction(
          () => IslandDiagnostics.snapshot().world.tick >= 2,
        );
        await real.locator("#pause").click();
        const stopped = await real.evaluate(
          () => IslandDiagnostics.snapshot().world.tick,
        );
        await real.waitForTimeout(750);
        assert.equal(
          await real.evaluate(() => IslandDiagnostics.snapshot().world.tick),
          stopped,
        );
        await real.close();
      } finally {
        await browser.close();
      }
    }
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
