#!/usr/bin/env node
// governance.mjs — project invariant gate. Exits non-zero on any finding.
// Starter set; extend per project (brand rules, a11y, perf budgets, etc.).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = process.cwd();
// Content rules scan product code only; tooling under scripts/ is excluded so the
// gate doesn't match its own pattern definitions. Key-material files are scanned
// across the whole tree separately (scanKeyFiles).
const SCAN_DIRS = ["app", "components", "lib"];
const CODE_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".css"]);
const findings = [];

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".next") continue;
      walk(p);
    } else if (CODE_EXT.has(extname(e.name))) {
      lint(p, readFileSync(p, "utf8"));
    }
  }
}

function lint(file, src) {
  const rel = file.slice(ROOT.length + 1);
  if (/dangerouslySetInnerHTML/.test(src))
    findings.push(`${rel}: dangerouslySetInnerHTML — sanitize or remove`);
  if (/-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(src))
    findings.push(`${rel}: private key material in source`);
  if (/\bsk-ant-[A-Za-z0-9_-]{20,}/.test(src) || /\bAKIA[0-9A-Z]{16}\b/.test(src))
    findings.push(`${rel}: hardcoded API key`);
  // Encourage the lazy env reader: no direct process.env access outside lib/env.*
  if (/\bprocess\.env\.[A-Z]/.test(src) && !/(^|\/)lib\/env\./.test(rel))
    findings.push(`${rel}: direct process.env access — use lib/env lazy reader`);
}

// No key-material files committed anywhere in the tree.
function scanKeyFiles(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.name === "node_modules" || e.name === ".next" || e.name === ".git") continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) scanKeyFiles(p);
    else if (/\.(pem|der|key|p12|pfx)$/.test(e.name))
      findings.push(`${p.slice(ROOT.length + 1)}: key-material file must not be committed`);
  }
}

for (const d of SCAN_DIRS) {
  try {
    if (statSync(join(ROOT, d)).isDirectory()) walk(join(ROOT, d));
  } catch {
    /* dir absent — fine */
  }
}
scanKeyFiles(ROOT);

if (findings.length) {
  console.error(`governance: ${findings.length} issue(s)`);
  for (const f of findings) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("governance: 0 issues");
