// npm run test:browser; install browsers once with npx playwright install chromium webkit.
const { chromium, webkit } = require("playwright");
const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
(async () => {
  const root = path.resolve(__dirname, "..");
  const server = http.createServer((req, res) => {
    const requestPath = req.url.replace(/^\/Microcosme/, "");
    const name = requestPath === "/" ? "index.html" : requestPath.slice(1);
    if (
      ![
        "index.html",
        "cognition.js",
        "engine.js",
        "storage.js",
        "ui.js",
      ].includes(name)
    ) {
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
        page.setDefaultTimeout(10000);
        const errors = [];
        page.on("pageerror", (e) => errors.push(e.message));
        await page.goto(
          "http://127.0.0.1:" + server.address().port + "/Microcosme/",
        );
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
        // Reference experiment through the actual touch tools and hour button.
        await page.evaluate(() => {
          engine = MicrocosmeEngine.create(null, () => 0);
          s = engine.state;
          s.tiles.fill("grass");
          s.tiles[2] = "field";
          s.wood = 12;
          s.laws.hunger = 0;
          s.laws.social = 0;
          s.people = s.people.slice(0, 1);
          const p = s.people[0];
          Object.assign(p, {
            pos: 0,
            food: 0,
            hunger: 60,
            energy: 100,
            task: "observe",
            target: null,
            intention: null,
            memory: { places: [], visited: [0], people: {}, events: [] },
          });
          engine.perceive(p);
          p.pos = 10;
          engine.perceive(p);
          render();
        });
        await page.locator('[data-tool="grass"]').click();
        await page.locator(".tile").nth(2).click();
        assert.equal(await page.evaluate(() => s.tiles[2]), "grass");
        assert.equal(
          await page.evaluate(() => s.people[0].memory.terrain[2].kind),
          "field",
        );
        await page.locator("#roster button").first().click();
        const observerBefore = await page.evaluate(() => JSON.stringify(s));
        for (let i = 0; i < 3; i++)
          await page.locator("#roster button").first().click();
        assert.equal(
          await page.evaluate(() => JSON.stringify(s)),
          observerBefore,
        );
        for (let i = 0; i < 5; i++) {
          await page
            .getByRole("button", { name: "+ 1 heure", exact: true })
            .click();
          assert.equal(await page.evaluate(() => s.people[0].target), 2);
          assert.equal(
            await page.evaluate(() => s.people[0].memory.terrain[2].kind),
            "field",
          );
        }
        assert.match(
          await page.locator("#inspect").textContent(),
          /Besoin dominant : Réserves alimentaires/,
        );
        assert.match(
          await page.locator("#inspect").textContent(),
          /souvenir personnel/,
        );
        await page
          .getByRole("button", { name: "+ 1 heure", exact: true })
          .click();
        assert.equal(
          await page.evaluate(() => s.people[0].memory.terrain[2].kind),
          "grass",
        );
        assert.equal(
          await page.evaluate(
            () => s.people[0].memory.experiences["farm:2"].lastOutcome,
          ),
          "failure",
        );
        assert.match(
          await page.locator("#inspect").textContent(),
          /inadéquate/,
        );
        const cognitionSaved = await page.evaluate(() =>
          JSON.stringify(s.people[0].memory),
        );
        await page.reload();
        assert.deepEqual(
          await page.evaluate(() => s.people[0].memory),
          JSON.parse(cognitionSaved),
        );
        // Once resources are loaded the simulation runs without any network connection.
        const offlineHour = await page.evaluate(() => s.hour);
        await page.context().setOffline(true);
        await page
          .getByRole("button", { name: "+ 1 heure", exact: true })
          .click();
        assert.equal(await page.evaluate(() => s.hour), (offlineHour + 1) % 24);
        await page.context().setOffline(false);
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
            ": interface tactile sous /Microcosme/, champ disparu, inspecteur sans mutation, mémoire restaurée, hors ligne et non-régression OK",
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
