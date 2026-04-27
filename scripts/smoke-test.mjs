#!/usr/bin/env node
// MADE Med Spa — post-deploy smoke test
//
// Add this line to package.json under "scripts":
//   "smoke": "node scripts/smoke-test.mjs"
//
// Then run: npm run smoke -- https://mademedspa.com
// Or directly: node scripts/smoke-test.mjs https://mademedspa.com
//
// !! KNOWN SIDE EFFECT !!
// Probe 9 POSTs a real lead into Pabau (firstName: SMOKETEST, lastName: DELETE-ME).
// The created leadId is printed to stdout. An operator should delete the test
// lead from Pabau after each run, or filter it out of CRM workflows.
//
// Usage:
//   node scripts/smoke-test.mjs [baseUrl]
//   node scripts/smoke-test.mjs --help
//
// Env:
//   PABAU_WEBHOOK_SECRET — if set, enables probe 11 (signed webhook test)

const HELP = `
MADE Med Spa smoke test

Usage:
  node scripts/smoke-test.mjs [baseUrl]
  node scripts/smoke-test.mjs --help

Arguments:
  baseUrl    Target URL (default: http://localhost:3000)

Environment:
  PABAU_WEBHOOK_SECRET    If set, runs the signed-webhook probe (probe 11).
                          Otherwise that probe is skipped.

WARNING: Probe 9 creates a real lead in Pabau on every run.
The lead uses firstName "SMOKETEST" and lastName "DELETE-ME" and
the leadId is printed for manual cleanup.

Exit codes:
  0    All probes passed
  1    One or more probes failed
`;

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  process.stdout.write(HELP);
  process.exit(0);
}

const baseUrlRaw = args[0] ?? "http://localhost:3000";
const baseUrl = baseUrlRaw.replace(/\/+$/, "");

console.log(`MADE smoke test → ${baseUrl}`);
console.log(
  "WARNING: probe 9 will create a real lead in Pabau (SMOKETEST DELETE-ME). Manual cleanup required.",
);
console.log("");

/**
 * @typedef {Object} ProbeResult
 * @property {string} label
 * @property {"pass"|"fail"|"skip"} status
 * @property {string} [reason]
 * @property {number} [ms]
 * @property {number} [code]
 */

/** @type {ProbeResult[]} */
const results = [];

/**
 * @param {string} label
 * @param {() => Promise<{ ok: boolean, reason?: string, code?: number }>} fn
 */
async function probe(label, fn) {
  const t0 = Date.now();
  try {
    const out = await fn();
    const ms = Date.now() - t0;
    if (out.ok) {
      console.log(`[PASS] ${label} → ${out.code ?? "?"} (${ms}ms)`);
      results.push({ label, status: "pass", ms, code: out.code });
    } else {
      console.log(
        `[FAIL] ${label} → ${out.code ?? "?"} ${out.reason ?? ""} (${ms}ms)`,
      );
      results.push({
        label,
        status: "fail",
        reason: out.reason,
        ms,
        code: out.code,
      });
    }
  } catch (err) {
    const ms = Date.now() - t0;
    const reason = err instanceof Error ? err.message : String(err);
    console.log(`[FAIL] ${label} → threw: ${reason} (${ms}ms)`);
    results.push({ label, status: "fail", reason, ms });
  }
}

/**
 * @param {string} path
 * @param {RequestInit} [init]
 */
async function req(path, init) {
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "user-agent": "made-smoke-test/1.0",
      ...(init?.headers ?? {}),
    },
  });
  const text = await res.text();
  /** @type {any} */
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = undefined;
  }
  return { res, text, json };
}

// ── Probe 1: GET / ─────────────────────────────────────────────────────────
await probe("GET /", async () => {
  const { res, text } = await req("/");
  if (res.status !== 200)
    return { ok: false, code: res.status, reason: `expected 200` };
  if (!/MADE/i.test(text))
    return {
      ok: false,
      code: res.status,
      reason: `body missing "MADE" marker`,
    };
  return { ok: true, code: res.status };
});

// ── Probe 2: GET /contact ──────────────────────────────────────────────────
await probe("GET /contact", async () => {
  const { res, text } = await req("/contact");
  if (res.status !== 200)
    return { ok: false, code: res.status, reason: `expected 200` };
  const hasCopy =
    /Tell us a little about you/i.test(text) ||
    /book a consultation/i.test(text) ||
    /contact/i.test(text);
  if (!hasCopy)
    return { ok: false, code: res.status, reason: `body missing form copy` };
  return { ok: true, code: res.status };
});

// ── Probe 3: GET /services ─────────────────────────────────────────────────
await probe("GET /services", async () => {
  const { res } = await req("/services");
  if (res.status !== 200)
    return { ok: false, code: res.status, reason: `expected 200` };
  return { ok: true, code: res.status };
});

// ── Probe 4: GET /testimonials ─────────────────────────────────────────────
await probe("GET /testimonials", async () => {
  const { res } = await req("/testimonials");
  if (res.status !== 200)
    return { ok: false, code: res.status, reason: `expected 200` };
  return { ok: true, code: res.status };
});

// ── Probe 5: GET /sitemap.xml ──────────────────────────────────────────────
await probe("GET /sitemap.xml", async () => {
  const { res } = await req("/sitemap.xml");
  if (res.status !== 200)
    return { ok: false, code: res.status, reason: `expected 200` };
  const ct = res.headers.get("content-type") ?? "";
  if (!/xml/i.test(ct))
    return {
      ok: false,
      code: res.status,
      reason: `content-type "${ct}" missing xml`,
    };
  return { ok: true, code: res.status };
});

// ── Probe 6: GET /robots.txt ───────────────────────────────────────────────
await probe("GET /robots.txt", async () => {
  const { res } = await req("/robots.txt");
  if (res.status !== 200)
    return { ok: false, code: res.status, reason: `expected 200` };
  return { ok: true, code: res.status };
});

// ── Probe 7: GET /api/pabau/lead-sources ───────────────────────────────────
await probe("GET /api/pabau/lead-sources", async () => {
  const { res, json } = await req("/api/pabau/lead-sources");
  if (res.status !== 200)
    return {
      ok: false,
      code: res.status,
      reason: json?.error ?? `expected 200`,
    };
  if (!json || json.ok !== true)
    return {
      ok: false,
      code: res.status,
      reason: `response.ok !== true`,
    };
  return { ok: true, code: res.status };
});

// ── Probe 8: POST /api/pabau/leads with bad payload → 400 ──────────────────
await probe("POST /api/pabau/leads (invalid)", async () => {
  const { res, json } = await req("/api/pabau/leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  if (res.status !== 400)
    return { ok: false, code: res.status, reason: `expected 400` };
  if (!json || json.success !== false || !json.fieldErrors) {
    return {
      ok: false,
      code: res.status,
      reason: `expected success:false + fieldErrors`,
    };
  }
  return { ok: true, code: res.status };
});

// ── Probe 9: POST /api/pabau/leads with VALID test payload → 200 ───────────
//    !! creates a real lead in Pabau !!
await probe("POST /api/pabau/leads (valid SMOKETEST lead)", async () => {
  const payload = {
    firstName: "SMOKETEST",
    lastName: "DELETE-ME",
    email: "smoketest@example.com",
    phone: "555-0100",
    message: "Automated smoke test — please delete this lead",
    marketingConsent: false,
    source: "smoke_test",
  };
  const { res, json } = await req("/api/pabau/leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.status !== 200)
    return {
      ok: false,
      code: res.status,
      reason: json?.error ?? `expected 200`,
    };
  if (!json || json.success !== true || !json.leadId) {
    return {
      ok: false,
      code: res.status,
      reason: `expected success:true + leadId`,
    };
  }
  console.log(
    `       ↳ created Pabau lead id=${json.leadId} (delete from Pabau when convenient)`,
  );
  return { ok: true, code: res.status };
});

// ── Probe 10: POST webhook with wrong token → 401 ──────────────────────────
await probe("POST /api/pabau/webhooks/wrong-token-12345", async () => {
  const { res } = await req("/api/pabau/webhooks/wrong-token-12345", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ event: "test", data: {} }),
  });
  if (res.status !== 401)
    return { ok: false, code: res.status, reason: `expected 401` };
  return { ok: true, code: res.status };
});

// ── Probe 11 (optional): signed webhook with correct token → 200 ───────────
const webhookSecret = process.env.PABAU_WEBHOOK_SECRET;
if (!webhookSecret) {
  console.log(
    "[SKIP] Probe 11 — set PABAU_WEBHOOK_SECRET env var to enable signed webhook test",
  );
  results.push({ label: "POST /api/pabau/webhooks/<token>", status: "skip" });
} else {
  await probe(
    `POST /api/pabau/webhooks/${webhookSecret.slice(0, 4)}...`,
    async () => {
      const { res, json } = await req(
        `/api/pabau/webhooks/${encodeURIComponent(webhookSecret)}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            event: "smoke_test",
            data: { source: "smoke-test.mjs" },
          }),
        },
      );
      if (res.status !== 200)
        return { ok: false, code: res.status, reason: `expected 200` };
      if (!json || json.ok !== true)
        return {
          ok: false,
          code: res.status,
          reason: `response.ok !== true`,
        };
      return { ok: true, code: res.status };
    },
  );
}

// ── Summary ────────────────────────────────────────────────────────────────
console.log("");
const passed = results.filter((r) => r.status === "pass").length;
const failed = results.filter((r) => r.status === "fail");
const skipped = results.filter((r) => r.status === "skip").length;
const total = results.length;

if (failed.length === 0) {
  console.log(
    `✓ All ${passed} smoke tests passed${skipped ? ` (${skipped} skipped)` : ""}`,
  );
  process.exit(0);
} else {
  console.log(`✗ ${failed.length} of ${total} smoke tests failed:`);
  for (const f of failed) {
    console.log(`  - ${f.label}: ${f.reason ?? "no reason"}`);
  }
  process.exit(1);
}
