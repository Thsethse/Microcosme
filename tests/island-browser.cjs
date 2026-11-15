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
];
(async () => {
  const server = http.createServer((req, res) => {
    const file = req.url.replace(/^\/Microcosme\//, "");
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
        assert.ok(await page.locator("#portal").isVisible());
        await page.locator("#portal").tap();
        assert.equal((await snap()).scene.kind, "interior");
        await page.locator("#portal").tap();
        assert.equal((await snap()).scene.region, 2);
        await page.locator("#portal").tap();
        await page.locator("#outside").tap();
        assert.equal((await snap()).scene.region, 2);
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
