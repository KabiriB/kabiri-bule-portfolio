import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";

const browser = process.env.CHROME_BINARY || "google-chrome";
const root = "http://127.0.0.1:4173/kabiri-bule-portfolio/";
const port = 9334;
const profile = mkdtempSync(join(tmpdir(), "kb-browser-"));
const proc = spawn(browser, ["--headless", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--no-first-run", "--remote-debugging-port=" + port, "--user-data-dir=" + profile, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function waitFor(getValue, message, max = 90) {
  for (let i = 0; i < max; i++) {
    try { const value = await getValue(); if (value) return value; } catch { /* browser not ready */ }
    await sleep(130);
  }
  throw new Error("Timed out waiting for " + message);
}
let socket;
try {
  const target = await waitFor(async () => {
    const response = await fetch("http://127.0.0.1:" + port + "/json/list");
    const list = await response.json();
    return list.find((item) => item.type === "page" && item.webSocketDebuggerUrl);
  }, "browser debugger");
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
  let nextId = 0;
  const pending = new Map();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (!message.id) return;
    const item = pending.get(message.id);
    if (!item) return;
    pending.delete(message.id);
    if (message.error) item.reject(new Error(JSON.stringify(message.error)));
    else item.resolve(message.result);
  });
  async function call(method, params = {}) {
    const id = ++nextId;
    const response = new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
    socket.send(JSON.stringify({ id, method, params }));
    return response;
  }
  async function evaluate(expression) {
    const result = await call("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
  await call("Page.enable");
  await call("Runtime.enable");
  await call("Page.navigate", { url: root });
  await waitFor(() => evaluate("Boolean(document.querySelector('#kb-threshold'))"), "React portfolio");
  assert.match(await evaluate("document.title"), /Kabiri Bule/);

  const initial = await evaluate("document.querySelector('#kb-threshold').value");
  assert.equal(initial, "0.5", "Threshold initial value");
  await evaluate("document.querySelector('#kb-threshold').focus()");
  await call("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowRight", code: "ArrowRight", windowsVirtualKeyCode: 39, nativeVirtualKeyCode: 39 });
  await call("Input.dispatchKeyEvent", { type: "keyUp", key: "ArrowRight", code: "ArrowRight", windowsVirtualKeyCode: 39, nativeVirtualKeyCode: 39 });
  await waitFor(() => evaluate("document.querySelector('#kb-threshold').value !== '0.5'"), "threshold keyboard response");
  const thresholdOutput = await evaluate("document.querySelector('.kb-control-top output').textContent");
  assert.equal(thresholdOutput, "0.55", "Rendered output follows threshold keyboard input");

  await evaluate("Array.from(document.querySelectorAll('.kb-group-field button')).find((x)=>x.textContent.includes('Group B')).click()");
  await waitFor(() => evaluate("document.querySelector('.kb-plot-head span:last-child')?.textContent === '80 cases'"), "subgroup filtering");
  const selectedCount = await evaluate("document.querySelector('.kb-plot-head span:last-child').textContent");
  assert.equal(selectedCount, "80 cases");

  await evaluate("Array.from(document.querySelectorAll('.kb-filter-buttons button')).find((x)=>x.textContent === 'Research').click()");
  await waitFor(() => evaluate("document.querySelectorAll('.kb-project').length === 3"), "research collection filter");
  assert.equal(await evaluate("document.querySelectorAll('.kb-project').length"), 3);

  await evaluate("document.querySelector('.kb-studio-read button').click()");
  await waitFor(() => evaluate("Boolean(document.querySelector('#kb-studio-panel'))"), "studio rendering");
  assert.equal(await evaluate("document.querySelector('#kb-studio-panel h2')?.textContent.includes('urban pressure')"), true);

  // Verify that the redesigned hero uses the provenance-backed locator and not the old ward silhouette.
  assert.equal(await evaluate("document.querySelector('.kb-hero-figure img')?.getAttribute('src')?.includes('research-geographies.svg')"), true);
  assert.equal(await evaluate("document.querySelector('.kb-hero-figure img')?.naturalWidth > 0"), true);
  assert.equal(await evaluate("document.querySelectorAll('.kb-entrance-grid a').length"), 3);

  // Route 1: an independently functioning multi-district decision dashboard.
  await evaluate("window.location.hash = '#/dashboard'");
  await waitFor(() => evaluate("Boolean(document.querySelector('#ex-capacity'))"), "dashboard route");
  assert.match(await evaluate("document.title"), /Signals Room/);
  const backlog0 = await evaluate("document.querySelector('.ex-kpi-accent strong').textContent");
  assert.equal(await evaluate("document.querySelectorAll('.ex-impact-metric').length"), 3, "Scenario comparison has three analytical metrics");
  assert.equal(await evaluate("document.querySelector('.ex-impact-accounting p')?.textContent?.includes('reconciles exactly')"), true, "Stock-flow accounting balances at baseline");
  await evaluate("document.querySelector('#ex-capacity').focus()");
  await call("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowRight", code: "ArrowRight", windowsVirtualKeyCode: 39, nativeVirtualKeyCode: 39 });
  await call("Input.dispatchKeyEvent", { type: "keyUp", key: "ArrowRight", code: "ArrowRight", windowsVirtualKeyCode: 39, nativeVirtualKeyCode: 39 });
  await waitFor(() => evaluate("document.querySelector('#ex-capacity').value === '5'"), "capacity scenario slider");
  const backlog1 = await evaluate("document.querySelector('.ex-kpi-accent strong').textContent");
  assert.notEqual(backlog0, backlog1, "Capacity scenario updates aggregate backlog");
  assert.equal(await evaluate("document.querySelector('.ex-impact-assumptions')?.textContent?.includes('Capacity +5%')"), true, "Scenario comparison reflects input change");
  assert.equal(await evaluate("document.querySelectorAll('.ex-impact-metric .ex-impact-bar-row').length"), 6, "Baseline and scenario bars render for all three metrics");
  assert.equal(await evaluate("Boolean(document.querySelector('.ex-chart-key-reference'))"), true, "Baseline reference overlays current trend");
  assert.equal(await evaluate("document.querySelector('.ex-impact-accounting p')?.textContent?.includes('reconciles exactly')"), true, "Adjusted scenario stock flow still reconciles");
  assert.equal(await evaluate("Boolean(document.querySelector('.ex-export'))"), true, "Synthetic CSV export control exists");
  assert.equal(await evaluate("document.querySelectorAll('.ex-pressure-grid svg g[role=button]').length"), 6);
  await evaluate("document.querySelector('.ex-pressure-grid svg g[aria-label*=Central]').dispatchEvent(new MouseEvent('click',{bubbles:true}))");
  await waitFor(() => evaluate("document.querySelector('select[aria-label=\"Select synthetic district\"]')?.value === 'central'"), "scatterplot linked district selection");
  await evaluate("Array.from(document.querySelectorAll('.ex-zone-table button')).find(x=>x.textContent.includes('North')).click()");
  await waitFor(() => evaluate("document.querySelector('select[aria-label=\"Select synthetic district\"]')?.value === 'north'"), "district filter");
  await evaluate("Array.from(document.querySelectorAll('.ex-chart-switch button')).find(x=>x.textContent==='Flow').click()");
  await waitFor(() => evaluate("document.querySelector('#signals-history')?.textContent.includes('Flow')"), "chart view switch");

  // Route 2: weighted-average reversal plus standardization.
  await evaluate("window.location.hash = '#/experiment'");
  await waitFor(() => evaluate("Boolean(document.querySelector('#sim-treated'))"), "Simpson experiment");
  assert.equal(await evaluate("document.querySelector('.ex-delta strong')?.textContent?.includes('-16.0')"), true, "Starting pooled reversal");
  await evaluate("document.querySelector('#sim-treated').focus()");
  await call("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowRight", code: "ArrowRight", windowsVirtualKeyCode: 39, nativeVirtualKeyCode: 39 });
  await call("Input.dispatchKeyEvent", { type: "keyUp", key: "ArrowRight", code: "ArrowRight", windowsVirtualKeyCode: 39, nativeVirtualKeyCode: 39 });
  await waitFor(() => evaluate("document.querySelector('#sim-treated')?.value === '25'"), "statistical experiment slider");
  assert.equal(await evaluate("document.querySelector('.ex-delta strong')?.textContent?.includes('-14.0')"), true);
  const std = await evaluate("document.querySelector('.ex-standard-result strong')?.textContent");
  assert.match(std, /8\.0/);

  // Route 3: budget/output/outcome pipeline and design reading.
  await evaluate("window.location.hash = '#/monitoring'");
  await waitFor(() => evaluate("Boolean(document.querySelector('#mel-completion'))"), "M&E lab");
  const before = await evaluate("Array.from(document.querySelectorAll('.ex-funnel-stage strong')).map(x=>x.textContent)");
  await evaluate("document.querySelector('#mel-completion').focus()");
  await call("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowRight", code: "ArrowRight", windowsVirtualKeyCode: 39, nativeVirtualKeyCode: 39 });
  await call("Input.dispatchKeyEvent", { type: "keyUp", key: "ArrowRight", code: "ArrowRight", windowsVirtualKeyCode: 39, nativeVirtualKeyCode: 39 });
  await waitFor(() => evaluate("document.querySelector('#mel-completion')?.value === '73'"), "M&E completion slider");
  const after = await evaluate("Array.from(document.querySelectorAll('.ex-funnel-stage strong')).map(x=>x.textContent)");
  assert.notDeepEqual(after, before, "Completion changes downstream results");
  await evaluate("Array.from(document.querySelectorAll('.ex-design-choices button')).find(x=>x.textContent.includes('Randomized')).click()");
  await waitFor(() => evaluate("document.querySelector('.ex-evaluation-reading')?.textContent.includes('assignment effect')"), "M&E design selection");

  // Reloading a deep link directly must work on static hosting.
  await call("Page.navigate", { url: root + "#/dashboard" });
  await waitFor(() => evaluate("Boolean(document.querySelector('#ex-capacity'))"), "dashboard deep link after reload");

  await call("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await sleep(450);
  const mobile = await evaluate("({scrollWidth:document.documentElement.scrollWidth,innerWidth:window.innerWidth})");
  assert.ok(mobile.scrollWidth <= mobile.innerWidth + 2, "Mobile layout has no horizontal page overflow: " + JSON.stringify(mobile));
  console.log("PASS: provenance map, React hash routes, three functioning laboratory controls, output recalculation, studio controls, deep-link reload and mobile overflow.");
} finally {
  try { socket?.close(); } catch { /* empty */ }
  proc.kill("SIGTERM");
  await sleep(150);
  rmSync(profile, { recursive: true, force: true });
}
