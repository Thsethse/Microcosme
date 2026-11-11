// npm run test:browser; install browsers once with npx playwright install chromium webkit.
const { chromium, webkit } = require("playwright");
const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
(async () => {
  const root = path.resolve(__dirname, "..");
  const server = http.createServer((req, res) => {
    const name = req.url === "/" ? "index.html" : req.url.slice(1);
    if (!["index.html", "engine.js", "storage.js", "ui.js"].includes(name)) {
      res.writeHead(404).end();
      return;
    }
    res.setHeader(
      "Content-Type",
      name.endsWith(".js") ? "text/javascript" : "text/html",
    );
    res.end(fs.readFileSync(path.join(root, name)));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    for (const type of process.env.BROWSERS === "chromium"
      ? [chromium]
      : [chromium, webkit]) {
      const options = { headless: true };
      if (type === chromium && process.env.CHROMIUM_PATH)
        options.executablePath = process.env.CHROMIUM_PATH;
      const browser = await type.launch(options);
      try {
        const page = await browser.newPage({
          viewport: { width: 820, height: 1180 },
          hasTouch: true,
        });
        const errors = [];
        page.on("pageerror", (e) => errors.push(e.message));
        await page.goto("http://127.0.0.1:" + server.address().port);
        assert.equal(await page.locator(".tile").count(), 108);
        assert.equal(await page.locator(".actor").count(), 5);
        await page.locator("#roster button").first().click();
        assert.match(await page.locator("#inspect").textContent(), /Alix/);
        const before = await page.evaluate(() => JSON.stringify(s));
        await page.locator("#roster button").first().click();
        assert.equal(await page.evaluate(() => JSON.stringify(s)), before);
        const actor = await page.locator(".actor").first().elementHandle();
        await page
          .getByRole("button", { name: "+ 1 heure", exact: true })
          .click();
        assert.ok(await actor.evaluate((el) => el.isConnected));
        await page.locator('[data-tool="tree"]').click();
        await page.locator(".tile").nth(0).click();
        assert.equal(await page.evaluate(() => s.tiles[0]), "tree");
        await page.locator('[data-tool="food"]').click();
        await page.locator(".tile").nth(1).click();
        assert.equal(await page.evaluate(() => s.tiles[1]), "field");
        await page.locator('[data-tool="person"]').click();
        page.once("dialog", (d) => d.accept());
        await page.locator(".tile").nth(2).click();
        assert.equal(await page.locator(".actor").count(), 6);
        await page.locator("#hunger").evaluate((el) => {
          el.value = "4";
          el.dispatchEvent(new Event("input", { bubbles: true }));
        });
        assert.equal(await page.evaluate(() => s.laws.hunger), 4);
        await page.getByRole("button", { name: "Vitesse" }).click();
        await page.locator("#auto").click();
        await page.waitForTimeout(750);
        await page.locator("#auto").click();
        const saved = await page.evaluate(() =>
          JSON.parse(localStorage.getItem("microcosme-v03")),
        );
        await page.reload();
        assert.equal(await page.evaluate(() => s.people.length), 6);
        assert.equal(await page.evaluate(() => s.hour), saved.hour);
        // Saved text is displayed as text, never executed as markup.
        await page.evaluate(() => {
          s.people[0].name = '<img src=x onerror="window.injected=1">';
          save();
        });
        await page.reload();
        assert.equal(await page.locator("#roster img").count(), 0);
        page.once("dialog", (d) => d.accept());
        await page
          .getByRole("button", { name: "Recommencer cette expérience" })
          .click();
        assert.equal(await page.locator(".actor").count(), 5);
        assert.deepEqual(errors, []);
        console.log(
          type.name() +
            ": interface tactile, outils, lois, inspecteur, minuterie, sauvegarde et reset OK",
        );
      } finally {
        await browser.close();
      }
    }
  } finally {
    server.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
