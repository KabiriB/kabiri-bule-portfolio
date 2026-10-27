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

  await call("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await sleep(450);
  const mobile = await evaluate("({scrollWidth:document.documentElement.scrollWidth,innerWidth:window.innerWidth})");
  assert.ok(mobile.scrollWidth <= mobile.innerWidth + 2, "Mobile layout has no horizontal page overflow: " + JSON.stringify(mobile));
  console.log("PASS: threshold keyboard response, subgroup recalculation, project filtering, studio mounting and mobile overflow.");
} finally {
  try { socket?.close(); } catch { /* empty */ }
  proc.kill("SIGTERM");
  await sleep(150);
  rmSync(profile, { recursive: true, force: true });
}
