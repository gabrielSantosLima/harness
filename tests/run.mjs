#!/usr/bin/env node
// End-to-end tests for the harness renderer, verifier and release engine.
// Usage: node tests/run.mjs [--keep]
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const KEEP = process.argv.includes("--keep");
const TMP = mkdtempSync(join(tmpdir(), "harness-tests-"));
const NODE = process.execPath;

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`PASS  ${name}`);
  } catch (error) {
    failed += 1;
    console.log(`FAIL  ${name} — ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || "assertion failed");
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    ...options,
  });
  return result;
}

function node(script, args, options = {}) {
  return run(NODE, [join(ROOT, script), ...args], options);
}

function render(answers, target, extra = []) {
  const result = node("scripts/render.mjs", [
    "--answers",
    answers,
    "--target",
    target,
    ...extra,
  ]);
  assert(result.status === 0, result.stderr || result.stdout);
  return result;
}

function verify(target) {
  return node("scripts/verify-setup.mjs", [target]);
}

function fixture(name) {
  return join(ROOT, "tests", "fixtures", name, "answers.json");
}

function fresh(name) {
  const dir = join(TMP, name);
  mkdirSync(dir, { recursive: true });
  return dir;
}

function read(target, relative) {
  return readFileSync(join(target, relative), "utf8");
}

function expectFile(target, relative, expected = true) {
  assert(
    existsSync(join(target, relative)) === expected,
    `${relative} should ${expected ? "exist" : "not exist"}`,
  );
}

// --- fixture matrix --------------------------------------------------------

const fixtures = ["web", "mobile", "desktop", "library", "data"];

for (const name of fixtures) {
  test(`fixture ${name}: render and verify`, () => {
    const target = fresh(`fixture-${name}`);
    render(fixture(name), target);
    const result = verify(target);
    assert(result.status === 0, result.stdout || result.stderr);
    expectFile(target, "AGENTS.md");
    expectFile(target, ".harness.json");
    expectFile(target, "docs/RELEASE_TEMPLATE.md");
    expectFile(target, "scripts/release-notes.mjs");
    expectFile(target, ".github/workflows/release.yml");
  });
}

test("web: full CI, build, Pages on release", () => {
  const target = join(TMP, "fixture-web");
  expectFile(target, ".github/workflows/ci.yml");
  expectFile(target, ".github/workflows/build.yml");
  expectFile(target, ".github/workflows/deploy.yml");
  expectFile(target, ".github/pull_request_template.md");
  expectFile(target, ".github/CODEOWNERS");
  const deploy = read(target, ".github/workflows/deploy.yml");
  assert(deploy.includes("workflow_run"), "deploy should follow the release");
  assert(deploy.includes("path: dist"), "deploy should publish dist");
  const agents = read(target, "AGENTS.md");
  assert(agents.includes("GitHub Pages"), "AGENTS should document Pages");
  assert(!agents.includes("## Architecture"), "architecture is out of scope");
});

test("mobile: checks only, no deploy, pt-BR notes", () => {
  const target = join(TMP, "fixture-mobile");
  expectFile(target, ".github/workflows/ci.yml");
  expectFile(target, ".github/workflows/build.yml", false);
  expectFile(target, ".github/workflows/deploy.yml", false);
  assert(read(target, "docs/RELEASE_TEMPLATE.md").includes("Novidades"));
  assert(
    read(target, "AGENTS.md").includes("Never push unless the user explicitly"),
    "commit-only policy should be documented",
  );
});

test("desktop: multi-OS build and Spanish notes", () => {
  const target = join(TMP, "fixture-desktop");
  const ci = read(target, ".github/workflows/ci.yml");
  assert(ci.includes("windows-latest"), "CI should include the Windows runner");
  assert(ci.includes("dist/*.exe"), "build artifact should be uploaded");
  assert(read(target, "docs/RELEASE_TEMPLATE.md").includes("Novedades"));
  expectFile(target, ".github/pull_request_template.md", false);
});

test("library: release-only, no CI or build", () => {
  const target = join(TMP, "fixture-library");
  expectFile(target, ".github/workflows/ci.yml", false);
  expectFile(target, ".github/workflows/build.yml", false);
  assert(read(target, "AGENTS.md").includes("release-only"));
});

test("data: CI, Pages on push, data rules", () => {
  const target = join(TMP, "fixture-data");
  expectFile(target, ".github/workflows/ci.yml");
  expectFile(target, ".github/workflows/build.yml", false);
  const deploy = read(target, ".github/workflows/deploy.yml");
  assert(deploy.includes("push:"), "deploy should run on push");
  assert(read(target, "AGENTS.md").includes("## Data rules"));
});

// --- merge -----------------------------------------------------------------

test("adopt: merge preserves existing sections", () => {
  const target = fresh("merge");
  writeFileSync(
    join(target, "AGENTS.md"),
    "# Web Fixture\n\nExisting introduction.\n\n## Custom section\n\nKeep me.\n",
  );
  render(fixture("web"), target, ["--merge"]);
  const agents = read(target, "AGENTS.md");
  assert(agents.includes("Keep me."), "custom content must be preserved");
  assert(agents.includes("Existing introduction."), "intro must be preserved");
  assert(agents.includes("## Commits and pushes"), "missing sections must be added");
  assert(
    agents.match(/## Custom section/g).length === 1,
    "sections must not be duplicated",
  );
  const result = verify(target);
  assert(result.status === 0, result.stdout || result.stderr);
});

test("adopt: without --merge an existing AGENTS.md is skipped", () => {
  const target = fresh("no-merge");
  writeFileSync(join(target, "AGENTS.md"), "# Other\n\nDo not touch.\n");
  render(fixture("web"), target);
  assert(read(target, "AGENTS.md").includes("Do not touch."));
  assert(!read(target, "AGENTS.md").includes("## Commits and pushes"));
});

// --- version sources -------------------------------------------------------

test("version file: render, verify and bump", () => {
  const target = fresh("version-file");
  const answers = JSON.parse(readFileSync(fixture("library"), "utf8"));
  answers.version = { source: "file", file: "version.txt", pointer: "version" };
  const answersPath = join(target, "answers.json");
  writeFileSync(answersPath, JSON.stringify(answers, null, 2));
  writeFileSync(join(target, "version.txt"), "version=0.0.0\n");
  render(answersPath, target);
  expectFile(target, "scripts/bump-version.mjs");

  const bump = run(NODE, [join("scripts", "bump-version.mjs"), "--bump", "minor"], {
    cwd: target,
  });
  assert(bump.status === 0, bump.stderr || bump.stdout);
  assert(bump.stdout.trim() === "0.1.0", `unexpected version ${bump.stdout}`);
  assert(read(target, "version.txt").includes("version=0.1.0"));

  const result = verify(target);
  assert(result.status === 0, result.stdout || result.stderr);
});

test("next-version: bump semantics", () => {
  const cases = [
    [["--current", "1.2.3", "--bump", "patch"], "1.2.4"],
    [["--current", "1.2.3", "--bump", "minor"], "1.3.0"],
    [["--current", "1.2.3", "--bump", "major"], "2.0.0"],
    [["--current", "1.2.3", "--bump", "preminor", "--preid", "beta"], "1.3.0-beta.0"],
    [["--current", "1.2.3", "--bump", "prerelease", "--preid", "alpha"], "1.2.4-alpha.0"],
    [["--current", "1.2.4-alpha.0", "--bump", "prerelease", "--preid", "alpha"], "1.2.4-alpha.1"],
  ];
  for (const [args, expected] of cases) {
    const result = node("templates/scripts/next-version.mjs", args);
    assert(result.status === 0, result.stderr);
    assert(result.stdout.trim() === expected, `expected ${expected}, got ${result.stdout}`);
  }
});

// --- release notes ---------------------------------------------------------

test("release-notes: groups commits since the previous tag", () => {
  const repo = fresh("notes");
  mkdirSync(join(repo, "docs"), { recursive: true });
  cpSync(
    join(TMP, "fixture-web", "docs", "RELEASE_TEMPLATE.md"),
    join(repo, "docs", "RELEASE_TEMPLATE.md"),
  );
  writeFileSync(join(repo, ".harness.json"), JSON.stringify({ release: {} }));

  const git = (args) =>
    run("git", ["-C", repo, ...args], {
      env: { ...process.env, GIT_AUTHOR_NAME: "Test", GIT_AUTHOR_EMAIL: "t@example.com", GIT_COMMITTER_NAME: "Test", GIT_COMMITTER_EMAIL: "t@example.com" },
    });
  assert(git(["init", "-b", "main"]).status === 0);
  writeFileSync(join(repo, "a.txt"), "a");
  git(["add", "a.txt"]);
  git(["commit", "-m", "feat: add the first feature"]);
  writeFileSync(join(repo, "b.txt"), "b");
  git(["add", "b.txt"]);
  git(["commit", "-m", "fix: correct the first bug"]);
  git(["tag", "v0.1.0"]);
  writeFileSync(join(repo, "c.txt"), "c");
  git(["add", "c.txt"]);
  git(["commit", "-m", "feat: add the second feature"]);
  writeFileSync(join(repo, "d.txt"), "d");
  git(["add", "d.txt"]);
  git(["commit", "-m", "chore(release): v0.1.0"]);

  const result = node("templates/scripts/release-notes.mjs", [
    "--from",
    "v0.1.0",
    "--to",
    "HEAD",
    "--version",
    "0.2.0",
  ], { cwd: repo });
  assert(result.status === 0, result.stderr);
  assert(result.stdout.includes("add the second feature"), "missing new feature");
  assert(!result.stdout.includes("add the first feature"), "commits before the tag leaked");
  assert(!result.stdout.includes("chore(release)"), "release commit leaked");
  assert(result.stdout.includes("v0.1.0"), "previous tag missing");
});

// --- negative cases --------------------------------------------------------

test("verify: fails when a declared workflow is missing", () => {
  const target = fresh("negative");
  render(fixture("web"), target);
  rmSync(join(target, ".github/workflows/ci.yml"));
  const result = verify(target);
  assert(result.status !== 0, "verification should fail without ci.yml");
});

test("dry run: writes nothing", () => {
  const target = fresh("dry");
  render(fixture("library"), target, ["--dry-run"]);
  expectFile(target, "AGENTS.md", false);
  expectFile(target, ".harness.json", false);
});

test("render: rejects full CI without a build command", () => {
  const target = fresh("invalid");
  const answers = JSON.parse(readFileSync(fixture("web"), "utf8"));
  delete answers.build;
  const answersPath = join(target, "answers.json");
  writeFileSync(answersPath, JSON.stringify(answers));
  const result = node("scripts/render.mjs", ["--answers", answersPath, "--target", target]);
  assert(result.status !== 0, "render should reject an incomplete full CI setup");
});

console.log(`\n${passed}/${passed + failed} tests passed.`);
if (!KEEP) rmSync(TMP, { recursive: true, force: true });
else console.log(`Artifacts kept in ${TMP}`);
if (failed) process.exit(1);
