"use strict";
// Separate I1 suite; existing app tests, workflow and dependencies are unchanged.
const { chromium, webkit } = require("playwright");
const assert = require("node:assert/strict"),
  http = require("node:http"),
  fs = require("node:fs"),
  path = require("node:path");
const root = path.resolve(__dirname, "..");
const server = http.createServer((req, res) => {
  const name =
    decodeURIComponent(new URL(req.url, "http://localhost").pathname)
      .replace(/^\/Microcosme\//, "")
      .replace(/^\//, "") || "index.html";
  const file = path.resolve(root, name);
  if (
    !file.startsWith(root + path.sep) ||
    ![".html", ".js", ".css"].includes(path.extname(file)) ||
    !fs.existsSync(file)
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
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = "http://127.0.0.1:" + server.address().port + "/Microcosme/";
  try {
    for (const type of [chromium, webkit].filter(
      (b) =>
        !process.env.BROWSERS ||
        process.env.BROWSERS.split(",").includes(b.name()),
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
          deviceScaleFactor: 2,
        });
        const page = await context.newPage(),
          errors = [];
        page.on("pageerror", (e) => errors.push(e.message));
        await page.goto(base);
        const original = await page.evaluate(() => {
          const old = JSON.stringify(s);
          localStorage.setItem("microcosme-v03", old);
          localStorage.setItem("microcosme-v02", "ancienne clé conservée");
          return old;
        });
        await page.goto(base + "material-lab.html");
        assert.equal(await page.locator("#labMap button").count(), 108);
        const snapshot = () => page.evaluate(() => MaterialLab.snapshot());
        let initial = await snapshot();
        for (let i = 0; i < 3; i++) await page.locator("#step").click();
        const after = JSON.parse(await snapshot());
        assert.equal(after.tick, 3);
        assert.equal(after.ledger.ration.consumed, 2);
        assert.ok(
          after.agents.every((a) => a.lastResult.command.type === "INGEST"),
        );
        assert.match(
          await page.locator("#balance").textContent(),
          /10 présentes \+ 2 consommées = 12/,
        );
        assert.equal(
          await page.evaluate(() => localStorage.getItem("microcosme-v03")),
          original,
        );
        assert.equal(
          await page.evaluate(() => localStorage.getItem("microcosme-v02")),
          "ancienne clé conservée",
        );
        const beforeInspect = await snapshot();
        await page.locator("#labMap button").nth(40).tap();
        await page.locator("#agent").selectOption("2");
        await page.evaluate(() => MaterialLab.render());
        assert.equal(await snapshot(), beforeInspect);
        await page.locator("#export").click();
        const exported = await page.locator("#snapshot").inputValue();
        assert.equal(exported, beforeInspect);
        assert.equal(
          await page.locator("#download").getAttribute("download"),
          "microcosme-i1-tick-3.json",
        );
        const download = await Promise.all([
          page.waitForEvent("download"),
          page.locator("#download").click(),
        ]);
        assert.equal(
          download[0].suggestedFilename(),
          "microcosme-i1-tick-3.json",
        );
        await page.locator("#step").click();
        await page.locator("#snapshot").fill(exported);
        await page.locator("#import").click();
        assert.equal(await snapshot(), exported);
        const validState = await snapshot(),
          stored = await page.evaluate(() =>
            localStorage.getItem(MaterialStorage.KEY),
          );
        for (const bad of [
          "{broken",
          JSON.stringify({ ...JSON.parse(exported), schemaVersion: 2 }),
          JSON.stringify({ ...JSON.parse(exported), extra: 1 }),
        ]) {
          await page.locator("#snapshot").fill(bad);
          await page.locator("#import").click();
          assert.match(
            await page.locator("#status").textContent(),
            /Import refusé/,
          );
          assert.equal(await snapshot(), validState);
          assert.equal(
            await page.evaluate(() =>
              localStorage.getItem(MaterialStorage.KEY),
            ),
            stored,
          );
        }
        await page.reload();
        assert.equal(await snapshot(), exported);
        await page.locator("#run").click();
        assert.equal(await page.locator("#import").isDisabled(), true);
        await page.waitForFunction(
          () => JSON.parse(MaterialLab.snapshot()).tick >= 4,
        );
        await page.evaluate(() => {
          Object.defineProperty(document, "hidden", {
            configurable: true,
            get: () => true,
          });
          document.dispatchEvent(new Event("visibilitychange"));
        });
        const hidden = await snapshot();
        await page.waitForTimeout(800);
        assert.equal(await snapshot(), hidden);
        assert.equal(
          await page.locator("#run").getAttribute("aria-pressed"),
          "false",
        );
        await page.evaluate(() => {
          delete document.hidden;
          document.dispatchEvent(new Event("visibilitychange"));
        });
        await page.waitForTimeout(750);
        assert.equal(await snapshot(), hidden);
        for (const viewport of [
          { width: 1180, height: 820 },
          { width: 820, height: 1180 },
          { width: 390, height: 844 },
        ]) {
          await page.setViewportSize(viewport);
          assert.equal(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
            true,
          );
        }
        await page.context().setOffline(true);
        await page.locator("#step").click();
        await page.locator("#export").click();
        assert.ok((await page.locator("#snapshot").inputValue()).length > 0);
        await page.context().setOffline(false);
        await page
          .getByRole("link", { name: "Revenir à Microcosme", exact: false })
          .click();
        assert.equal(
          await page.evaluate(() => localStorage.getItem("microcosme-v03")),
          original,
        );
        assert.equal(await page.locator('script[src^="material-"]').count(), 0);
        await context.close();
        // Both getItem and setItem blocked: memory mode remains fully usable.
        const blocked = await browser.newContext({
          viewport: { width: 820, height: 1180 },
        });
        await blocked.addInitScript(() => {
          Storage.prototype.getItem = function () {
            throw new Error("stockage bloqué");
          };
          Storage.prototype.setItem = function () {
            throw new Error("stockage bloqué");
          };
        });
        const p = await blocked.newPage();
        p.on("pageerror", (e) => errors.push(e.message));
        await p.goto(base + "material-lab.html");
        assert.match(
          await p.locator("#storageStatus").textContent(),
          /Chargement impossible/,
        );
        await p.locator("#step").click();
        await p.locator("#export").click();
        assert.equal(
          JSON.parse(await p.locator("#snapshot").inputValue()).tick,
          1,
        );
        await p.locator("#import").click();
        assert.match(
          await p.locator("#storageStatus").textContent(),
          /Sauvegarde impossible/,
        );
        await blocked.close();
        // Invalid persisted snapshot is preserved rather than silently overwritten.
        const corrupt = await browser.newContext();
        await corrupt.addInitScript(() =>
          localStorage.setItem(
            "microcosme-material-lab-v1",
            "invalid original",
          ),
        );
        const c = await corrupt.newPage();
        c.on("pageerror", (e) => errors.push(e.message));
        await c.goto(base + "material-lab.html");
        await c.locator("#step").click();
        assert.equal(
          await c.evaluate(() => localStorage.getItem(MaterialStorage.KEY)),
          "invalid original",
        );
        await corrupt.close();
        assert.deepEqual(errors, []);
        console.log(
          type.name() +
            ": I1 autonome, bilan, inspection pure, export/import atomique, stockage bloqué/corrompu, pause visibilité, navigation et hors ligne OK",
        );
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
