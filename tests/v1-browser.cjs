"use strict";
const { chromium, webkit } = require("playwright");
const assert = require("node:assert/strict"),
  http = require("node:http"),
  fs = require("node:fs"),
  path = require("node:path");
const root = path.resolve(__dirname, "..");
const server = http.createServer((req, res) => {
  const name = decodeURIComponent(
    new URL(req.url, "http://localhost").pathname,
  ).replace(/^\/Microcosme\//, "");
  const file = path.resolve(root, name);
  if (
    !file.startsWith(root + path.sep) ||
    !fs.existsSync(file) ||
    ![".html", ".js", ".css"].includes(path.extname(file))
  ) {
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
  res.end(fs.readFileSync(file));
});
(async () => {
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const base =
    process.env.V1_URL ??
    "http://127.0.0.1:" + server.address().port + "/Microcosme/v1.html";
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
        console.log(type.name() + " " + browser.version() + " · " + base);
        const context = await browser.newContext({
          viewport: { width: 820, height: 1180 },
          hasTouch: true,
          deviceScaleFactor: 2,
          acceptDownloads: true,
        });
        const errors = [],
          page = await context.newPage();
        page.on("pageerror", (e) => errors.push(e.message));
        await page.addInitScript(() => {
          for (const [k, v] of [
            ["microcosme-v03", "historical"],
            ["microcosme-v02", "older"],
            ["microcosme-material-lab-v1", "I1"],
          ])
            localStorage.setItem(k, v);
        });
        const responses = [];
        page.on("response", (r) => {
          if (
            ["script", "stylesheet", "document"].includes(
              r.request().resourceType(),
            )
          )
            responses.push({ url: r.url(), status: r.status() });
        });
        await page.goto(base);
        assert.equal(await page.locator("#map button").count(), 108);
        assert.equal(
          await page
            .locator(
              "script[src^='engine.'],script[src^='island-'],script[src^='storage.']",
            )
            .count(),
          0,
        );
        const snapshot = () => page.evaluate(() => V1Lab.snapshot());
        const read = async () => JSON.parse(await snapshot());
        for (let i = 0; i < 3; i++) await page.locator("#step").click();
        const after = await read();
        assert.equal(after.world.tick, 3);
        assert.equal(after.world.ledger.ration.consumed, 2);
        assert.match(
          await page.locator("#balance").textContent(),
          /10 présentes.*2 consommées.*12 initiales/,
        );
        assert.equal(await page.locator(".engine").count(), 6);
        const beforeInspection = await snapshot();
        await page.locator("#agent").selectOption("2");
        await page.locator("#map button").nth(40).tap();
        await page.locator(".engine").last().locator("button").click();
        await page.locator("#parents button").first().click();
        assert.match(await page.locator("#causal").textContent(), /conservé/);
        await page.evaluate(() => {
          V1Lab.render();
          V1Lab.render();
        });
        assert.equal(await snapshot(), beforeInspection);
        // Font metrics differ between the Cloud desktop and Ubuntu CI.
        const fontSweep = await page.addStyleTag({
          content: ':root { font-family: "DejaVu Sans", sans-serif; }',
        });
        for (const viewport of [
          { width: 1180, height: 820 },
          { width: 390, height: 844 },
          { width: 820, height: 1180 },
        ]) {
          await page.setViewportSize(viewport);
          const layout = await page.evaluate(() => ({
            document: document.documentElement.scrollWidth,
            viewport: innerWidth,
            overflowing: [...document.querySelectorAll("main *")]
              .filter((el) => el.getBoundingClientRect().right > innerWidth)
              .map((el) => el.tagName + "#" + el.id)
              .slice(0, 8),
          }));
          assert.ok(layout.document <= layout.viewport, JSON.stringify(layout));
          assert.ok(
            await page
              .locator("#map")
              .evaluate((el) => el.scrollWidth <= el.clientWidth),
          );
        }
        await fontSweep.evaluate((el) => el.remove());
        await page.locator("#export").click();
        const exported = await page.locator("#snapshot").inputValue();
        assert.equal(exported, beforeInspection);
        const downloadPromise = page.waitForEvent("download");
        await page.locator("#download").click();
        const download = await downloadPromise;
        assert.match(download.suggestedFilename(), /microcosme-v1-tick-3/);
        const downloaded = await download.path();
        assert.equal(fs.readFileSync(downloaded, "utf8"), exported);
        const localSave = await page.evaluate(() =>
          localStorage.getItem(V1Storage.KEY),
        );
        await page.locator("#snapshot").fill('{"version":"future"}');
        await page.locator("#import").click();
        assert.match(
          await page.locator("#status").textContent(),
          /Import refusé/,
        );
        assert.equal(await snapshot(), beforeInspection);
        assert.equal(
          await page.evaluate(() => localStorage.getItem(V1Storage.KEY)),
          localSave,
        );
        await page.locator("#step").click();
        await page.locator("#snapshot").fill(exported);
        await page.locator("#import").click();
        assert.equal(await snapshot(), beforeInspection);
        await page.reload();
        assert.equal(await snapshot(), beforeInspection);
        assert.equal(await page.evaluate(() => V1Lab.running()), false);
        // The actual autonomous learning fixture changes A's choice at tick 33.
        await page.locator("#scenario").selectOption("learning");
        page.once("dialog", (d) => d.accept());
        await page.locator("#reset").click();
        for (let i = 0; i < 33; i++) await page.locator("#step").click();
        const learned = await read();
        const decision = learned.trace.findLast(
          (e) => e.kind === "DECIDE" && e.actorId === 1,
        );
        assert.equal(decision.data.chosen.target, 40);
        assert.equal(decision.data.chosen.experience, 6);
        assert.match(
          await page.locator("#learningSummary").textContent(),
          /Préférences acquises/,
        );
        const learningShot = process.env.V1_SCREENSHOTS;
        if (learningShot) {
          await page.locator("#agent").selectOption("1");
          await page.screenshot({
            path: path.join(learningShot, type.name() + "-v1-portrait.png"),
            fullPage: true,
          });
          await page.setViewportSize({ width: 1180, height: 820 });
          await page.screenshot({
            path: path.join(learningShot, type.name() + "-v1-landscape.png"),
            fullPage: true,
          });
        }
        await page.locator("#run").click();
        await page.waitForTimeout(750);
        assert.equal(await page.locator("#import").isDisabled(), true);
        await page.evaluate(() => {
          Object.defineProperty(document, "hidden", {
            configurable: true,
            value: true,
          });
          document.dispatchEvent(new Event("visibilitychange"));
        });
        const paused = await snapshot();
        await page.waitForTimeout(800);
        assert.equal(await snapshot(), paused);
        assert.equal(await page.evaluate(() => V1Lab.running()), false);
        await page.evaluate(() => {
          Object.defineProperty(document, "hidden", {
            configurable: true,
            value: false,
          });
          document.dispatchEvent(new Event("visibilitychange"));
        });
        await page.waitForTimeout(700);
        assert.equal(await snapshot(), paused);
        await page.context().setOffline(true);
        await page.locator("#step").click();
        await page.locator("#export").click();
        assert.equal(
          (await read()).world.tick,
          JSON.parse(paused).world.tick + 1,
        );
        await page.context().setOffline(false);
        assert.deepEqual(
          await page.evaluate(() =>
            [
              "microcosme-v03",
              "microcosme-v02",
              "microcosme-material-lab-v1",
            ].map((k) => localStorage.getItem(k)),
          ),
          ["historical", "older", "I1"],
        );
        assert.equal(responses.length >= 7, true);
        assert.deepEqual(
          responses.filter((r) => r.status !== 200),
          [],
        );
        await context.close();
        for (const mode of ["blocked", "corrupt"]) {
          const c = await browser.newContext(),
            p = await c.newPage();
          p.on("pageerror", (e) => errors.push(e.message));
          await c.addInitScript((mode) => {
            if (mode === "blocked") {
              Storage.prototype.getItem = function () {
                throw new Error("blocked");
              };
              Storage.prototype.setItem = function () {
                throw new Error("blocked");
              };
            } else
              localStorage.setItem(
                "microcosme-six-engines-v1",
                "corrupt original",
              );
          }, mode);
          await p.goto(base);
          assert.match(
            await p.locator("#storageStatus").textContent(),
            /Chargement impossible/,
          );
          await p.locator("#step").click();
          await p.locator("#export").click();
          assert.equal(
            JSON.parse(await p.locator("#snapshot").inputValue()).world.tick,
            1,
          );
          if (mode === "corrupt")
            assert.equal(
              await p.evaluate(() => localStorage.getItem(V1Storage.KEY)),
              "corrupt original",
            );
          await p.locator("#import").click();
          if (mode === "blocked")
            assert.match(
              await p.locator("#storageStatus").textContent(),
              /Sauvegarde impossible/,
            );
          await c.close();
        }
        assert.deepEqual(errors, []);
        console.log(
          type.name() +
            ": V1 autonomy, learning, causal inspection, export/import, resume, isolation, viewport, visibility, offline and storage failures OK",
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
