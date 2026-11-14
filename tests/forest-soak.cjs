/* Five REAL minutes of navigation; no accelerated clock and no world fixture. */
const { chromium, webkit } = require("playwright"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path");
const duration = Number(process.env.FOREST_SOAK_MS || 300000);
const url = process.env.FOREST_URL || "http://127.0.0.1:8765/forest.html";
async function run(type) {
  const browser = await type.launch({ headless: true });
  try {
    const context = await browser.newContext({
        viewport: { width: 1024, height: 900 },
        hasTouch: true,
      }),
      page = await context.newPage(),
      errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(url);
    await page.waitForFunction(() => window.ForestDiagnostics);
    const cdp = type === chromium ? await context.newCDPSession(page) : null;
    if (cdp) await cdp.send("Performance.enable");
    await page.evaluate(() => {
      window.__soak = {
        bins: [],
        last: performance.now(),
        started: performance.now(),
        cycle: 0,
        active: true,
      };
      function frame(t) {
        const s = __soak;
        if (!s.active) return;
        const i = Math.floor((t - s.started) / 30000);
        if (!s.bins[i]) s.bins[i] = [];
        s.bins[i].push(t - s.last);
        s.last = t;
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
      __soak.timer = setInterval(() => {
        const places = ["clearing", "river", "cave", "clearing"];
        document.getElementById(places[__soak.cycle % 4]).click();
        document
          .getElementById(__soak.cycle % 2 ? "zoom-out" : "zoom-in")
          .click();
        document.getElementById("viewport").dispatchEvent(
          new KeyboardEvent("keydown", {
            key: __soak.cycle % 2 ? "ArrowLeft" : "ArrowRight",
            bubbles: true,
          }),
        );
        __soak.cycle++;
      }, 650);
    });
    const checkpoints = [],
      begin = Date.now();
    async function checkpoint() {
      const s = await page.evaluate(() => {
        const d = ForestDiagnostics.snapshot();
        return {
          tick: d.world.tick,
          objects: d.renderer.objects,
          assets: d.renderer.assets,
          groundBytes: d.renderer.groundBytes,
          tracks: d.visuals.length,
          domNodes: document.querySelectorAll("*").length,
          actorNodes: document.querySelectorAll(".actor").length,
        };
      });
      if (cdp) {
        await cdp.send("HeapProfiler.collectGarbage");
        const m = await cdp.send("Performance.getMetrics");
        s.heapBytes = m.metrics.find((x) => x.name === "JSHeapUsedSize")?.value;
      }
      checkpoints.push({ elapsed: Date.now() - begin, ...s });
    }
    await checkpoint();
    let nextCheckpoint = 60000;
    while (Date.now() - begin < duration) {
      await page.waitForTimeout(1000);
      if (Date.now() - begin >= nextCheckpoint) {
        await checkpoint();
        console.log(
          type.name() +
            ": navigation " +
            Math.round((Date.now() - begin) / 1000) +
            "s",
        );
        nextCheckpoint += 60000;
      }
    }
    await checkpoint();
    const samples = await page.evaluate(() => {
      __soak.active = false;
      clearInterval(__soak.timer);
      return {
        bins: __soak.bins,
        cycles: __soak.cycle,
        elapsed: performance.now() - __soak.started,
      };
    });
    const bins = samples.bins
      .filter((a) => a.length)
      .map((a) => {
        const sorted = [...a].sort((a, b) => a - b);
        return {
          frames: a.length,
          medianMs: sorted[Math.floor(sorted.length * 0.5)],
          p95Ms: sorted[Math.floor(sorted.length * 0.95)],
          meanFps: 1000 / (a.reduce((s, v) => s + v, 0) / a.length),
        };
      });
    assert.ok(samples.elapsed >= duration);
    assert.deepEqual(errors, []);
    for (const s of checkpoints) {
      assert.equal(s.objects, checkpoints[0].objects);
      assert.equal(s.assets, checkpoints[0].assets);
      assert.equal(s.groundBytes, checkpoints[0].groundBytes);
      assert.equal(s.actorNodes, 1);
      assert.ok(s.domNodes <= checkpoints[0].domNodes + 2);
    }
    if (cdp)
      assert.ok(
        checkpoints.at(-1).heapBytes <
          checkpoints[0].heapBytes + 5 * 1024 * 1024,
        "retained JS heap growth <5MiB",
      );
    return {
      browser: type.name(),
      version: browser.version(),
      url,
      elapsedMs: samples.elapsed,
      navigationCycles: samples.cycles,
      bins,
      checkpoints,
      errors,
      note: "Linux VM, two headless engines may contend for CPU; frame intervals are observational, not certified iPad performance. JS heap excludes native image/GPU memory; WebKit heap unavailable.",
    };
  } finally {
    await browser.close();
  }
}
Promise.all(
  [chromium, webkit]
    .filter(
      (t) =>
        !process.env.BROWSERS ||
        process.env.BROWSERS.split(",").includes(t.name()),
    )
    .map(run),
)
  .then((report) => {
    const destination =
      process.env.FOREST_SOAK_REPORT ||
      path.join(__dirname, "../test-results/forest-soak.json");
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, JSON.stringify(report, null, 2) + "\n");
    console.log(
      JSON.stringify(
        report.map((r) => ({
          browser: r.browser,
          elapsed: r.elapsedMs,
          cycles: r.navigationCycles,
          first: r.bins[0],
          last: r.bins.at(-1),
          checkpoints: r.checkpoints,
        })),
      ),
    );
  })
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
