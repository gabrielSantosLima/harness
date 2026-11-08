#!/usr/bin/env node
// Resolves the next Semantic Versioning version from a current one.
// Usage: node scripts/next-version.mjs --current <v> --bump <type> [--preid <id>]
const PREID_DEFAULT = "alpha";

function arg(name, fallback = "") {
  const index = process.argv.indexOf(name);
  if (index !== -1 && process.argv[index + 1]) return process.argv[index + 1];
  return fallback;
}

function parse(version) {
  const core = version.includes("-") ? version.slice(0, version.indexOf("-")) : version;
  const pre = version.includes("-") ? version.slice(version.indexOf("-") + 1) : "";
  const parts = core.split(".").map((part) => parseInt(part, 10) || 0);
  return {
    major: parts[0] || 0,
    minor: parts[1] || 0,
    patch: parts[2] || 0,
    pre,
  };
}

function nextPre(pre, preid) {
  const pieces = pre.split(".");
  if (pieces[0] !== preid) return `${preid}.0`;
  const number = parseInt(pieces[pieces.length - 1], 10);
  if (Number.isNaN(number)) return `${preid}.0`;
  return `${preid}.${number + 1}`;
}

const current = arg("--current", "0.0.0").replace(/^v/, "");
const bump = arg("--bump", "patch");
const preid = arg("--preid", PREID_DEFAULT);
const parsed = parse(current);
let { major, minor, patch, pre } = parsed;
let next;

switch (bump) {
  case "major":
    next = `${major + 1}.0.0`;
    break;
  case "minor":
    next = `${major}.${minor + 1}.0`;
    break;
  case "patch":
    next = `${major}.${minor}.${patch + 1}`;
    break;
  case "premajor":
    next = `${major + 1}.0.0-${nextPre("", preid)}`;
    break;
  case "preminor":
    next = `${major}.${minor + 1}.0-${nextPre("", preid)}`;
    break;
  case "prepatch":
    next = `${major}.${minor}.${patch + 1}-${nextPre("", preid)}`;
    break;
  case "prerelease":
    if (!pre) {
      next = `${major}.${minor}.${patch + 1}-${nextPre("", preid)}`;
    } else {
      next = `${major}.${minor}.${patch}-${nextPre(pre, preid)}`;
    }
    break;
  default:
    console.error(`Unknown bump type: ${bump}`);
    process.exit(1);
}

process.stdout.write(`${next}\n`);
