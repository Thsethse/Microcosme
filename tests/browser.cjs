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
        "interface.js",
        "interface.css",
      ].includes(name)
    ) {
      res.writeHead(404).end();
      return;
    }
    res.setHeader(
      "Content-Type",
      name.endsWith(".js") ? "text/javascript" : name.endsWith(".css") ? "text/css" : "text/html",
    );
    res.end(fs.readFileSync(path.join(root, name)));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    for (const type of [chromium, webkit].filter(type => !process.env.BROWSERS || process.env.BROWSERS.split(",").includes(type.name()))) {
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
        assert.equal(await page.locator("#continue").isDisabled(),true);
        await page.getByRole("button",{name:"Nouvelle partie",exact:true}).click();
        await page.getByRole("button",{name:"Confirmer la nouvelle partie",exact:true}).click();
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
        await page.locator("#continue").click();
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
        // Reused actor elements must target the current inhabitant after the world changes.
        await page.locator('[data-tool="tree"]').click();
        await page.locator(".actor").first().click();
        assert.equal(await page.evaluate(() => s.tiles[10]), "tree");
        await page.locator('[data-tool="grass"]').click();
        await page.locator(".actor").first().click();
        assert.equal(await page.evaluate(() => s.tiles[10]), "grass");
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
        await page.locator("#continue").click();
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
        await page.locator("#continue").click();
        assert.equal(await page.locator("#roster img").count(), 0);
        await page.getByRole("button", {name:"Chroniques", exact:true}).click();
        await page
          .getByRole("button", { name: "Recommencer cette expérience" })
          .click();
        await page.getByRole("button", {name:"Confirmer la nouvelle partie",exact:true}).click();
        assert.equal(await page.locator(".actor").count(), 5);
        await verifyV08(page);
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

async function verifyV08(page) {
  const state = await page.evaluate(() => JSON.stringify(s));
  await page.locator('#roster button').first().click();
  const selectedId = await page.evaluate(() => selected);
  await page.getByRole('button', {name:'Habitants',exact:true}).click();
  assert.equal(await page.evaluate(() => JSON.stringify(s)),state);
  assert.match(await page.locator('#personDetails').textContent(),/Alix/);
  await page.getByRole('button',{name:'Ouvrir la fiche',exact:true}).click();
  const snapshot = await page.locator('dialog .window-body').textContent();
  await page.evaluate(() => { s.people[0].reason = 'modification après ouverture'; });
  assert.equal(await page.locator('dialog .window-body').textContent(),snapshot);
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.closest('dialog') !== null),true);
  await page.keyboard.press('Escape');
  await page.locator('dialog').waitFor({state:'detached'});
  assert.equal(await page.evaluate(() => document.activeElement.textContent),'Ouvrir la fiche');
  await page.getByRole('button',{name:'Ouvrir la fiche',exact:true}).click();
  await page.mouse.click(2,2);
  await page.locator('dialog').waitFor({state:'detached'});
  await page.getByRole('button',{name:'Village',exact:true}).click();
  assert.equal(await page.evaluate(() => selected),selectedId);
  await page.locator('#auto').click();
  await page.getByRole('button',{name:'Lois du monde',exact:true}).click();
  const paused = await page.evaluate(() => JSON.stringify(s));
  await page.waitForTimeout(750);
  assert.equal(await page.evaluate(() => JSON.stringify(s)),paused);
  await page.getByRole('button',{name:'Menu',exact:true}).click();
  await page.getByRole('button',{name:'Paramètres',exact:true}).click();
  await page.getByRole('button',{name:'À propos des sauvegardes',exact:true}).click();
  assert.equal(await page.locator('dialog').count(),2);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.querySelectorAll('dialog').length === 1);
  await page.keyboard.press('Escape');
  await page.locator('dialog').waitFor({state:'detached'});
  await page.getByRole('button',{name:'Nouvelle partie',exact:true}).click();
  await page.getByRole('button',{name:'Fermer la fenêtre',exact:true}).click();
  assert.equal(await page.evaluate(() => JSON.stringify(s)),paused);
  await page.locator('#continue').click();
  assert.equal(await page.evaluate(() => Boolean(clock)),true);
  await page.locator('#auto').click();
  await page.getByRole('button',{name:'Zoom avant',exact:true}).click();
  assert.equal(await page.locator('#zoomValue').textContent(),'125 %');
  await page.locator('[data-tool="tree"]').click();
  const beforeDrag = await page.evaluate(() => JSON.stringify(s));
  const box = await page.locator('#viewport').boundingBox();
  await page.mouse.move(box.x+box.width*.7,box.y+box.height*.7);
  await page.mouse.down(); await page.mouse.move(box.x+box.width*.4,box.y+box.height*.4,{steps:8}); await page.mouse.up();
  assert.equal(await page.evaluate(() => JSON.stringify(s)),beforeDrag);
  assert.ok(await page.evaluate(() => camera.x < 0));
  // Multi-touch pointer sequence exercises the same pinch handlers as touch hardware.
  await page.locator('#viewport').evaluate(el => {
    const event = (type,id,x) => el.dispatchEvent(new PointerEvent(type,{pointerId:id,clientX:x,clientY:150,button:0,pointerType:'touch',bubbles:true}));
    event('pointerdown',11,100); event('pointerdown',12,200);
    event('pointermove',12,250); event('pointerup',12,250); event('pointerup',11,100);
  });
  assert.ok(await page.evaluate(() => camera.zoom > 1.25));
  assert.equal(await page.evaluate(() => JSON.stringify(s)),beforeDrag);
  await page.getByRole('button',{name:'Recentrer',exact:true}).click();
  for (const viewport of [{width:1180,height:820},{width:820,height:1180}]) {
    await page.setViewportSize(viewport);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.locator('[data-tool="inspect"]').click();
    await page.locator('.actor').first().tap();
    assert.equal(await page.evaluate(() => selected),selectedId);
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.locator('.actor').first().evaluate(el => getComputedStyle(el).transitionDuration),'0s');
  await page.getByRole('button',{name:'Chroniques',exact:true}).click();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('microcosme-v03')));
  await page.reload();
  assert.deepEqual(await page.evaluate(() => JSON.parse(JSON.stringify(s))),saved);
  assert.equal(await page.evaluate(() => Boolean(clock)),false);
  await page.context().setOffline(true);
  await page.locator('#continue').click();
  await page.getByRole('button',{name:'Habitants',exact:true}).click();
  await page.getByRole('button',{name:'Ouvrir la fiche',exact:true}).click();
  await page.keyboard.press('Escape');
  await page.locator('dialog').waitFor({state:'detached'});
  await page.getByRole('button',{name:'Lois du monde',exact:true}).click();
  await page.getByRole('button',{name:'Chroniques',exact:true}).click();
  await page.context().setOffline(false);
}
