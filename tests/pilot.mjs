#!/usr/bin/env node
// Pilots the harness against real git repositories in a temporary directory.
// Usage: node tests/pilot.mjs [--keep]
import { spawnSync } from "node:child_process";
import {
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
const TMP = mkdtempSync(join(tmpdir(), "harness-pilots-"));
const NODE = process.execPath;
const HARNESS_HEAD = git(["rev-parse", "HEAD"], ROOT).trim();

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

function git(args, cwd) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  assert(result.status === 0, result.stderr || result.stdout);
  return result.stdout;
}

function node(script, args, options = {}) {
  return spawnSync(NODE, [join(ROOT, script), ...args], {
    encoding: "utf8",
    ...options,
  });
}

function newRepo(name) {
  const dir = join(TMP, name);
  mkdirSync(dir, { recursive: true });
  git(["init", "-b", "main"], dir);
  git(["config", "user.name", "Pilot"], dir);
  git(["config", "user.email", "pilot@example.com"], dir);
  return dir;
}

function commitAll(dir, message) {
  git(["add", "-A"], dir);
  git(["commit", "-m", message], dir);
}

function writeAnswers(path, overrides = {}) {
  const answers = {
    harness: { version: 2, commit: "" },
    project: {
      name: "Pilot Web",
      slug: "pilot-web",
      description: "A pilot web project.",
      type: "web",
      license: "MIT",
      owner: "gabrielSantosLima",
      repo: "gabrielSantosLima/pilot-web",
    },
    git: {
      commitAutonomy: "commit-and-push-when-asked",
      defaultBranch: "main",
    },
    quality: {
      checks: ["node check.mjs"],
      ciDepth: "ci",
      os: ["ubuntu-latest"],
    },
    version: { source: "tags" },
    release: {
      trigger: "workflow_dispatch",
      notesLanguage: "en",
      sections: ["features", "fixes", "chores", "other", "known-issues"],
      attachArtifacts: false,
    },
    deploy: { target: "none" },
    skills: ["commit-and-push", "release-summary"],
    hygiene: {
      pullRequestTemplate: true,
      codeowners: true,
      codeownersOwner: "@gabrielSantosLima",
    },
    ignore: ["PLAN.md", ".env"],
    ...overrides,
  };
  writeFileSync(path, `${JSON.stringify(answers, null, 2)}\n`);
  return path;
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

// --- pilot 1: brand-new repository ----------------------------------------

test("new repository: render, submodule, sparse checkout, verify", () => {
  const repo = newRepo("new");
  writeFileSync(join(repo, "check.mjs"), "process.exit(0);\n");
  commitAll(repo, "chore: initial commit");
  const commitsBefore = git(["rev-list", "--count", "HEAD"], repo).trim();

  const answers = writeAnswers(join(TMP, "new-answers.json"));
  render(answers, repo, [
    "--submodule",
    ROOT,
    "--commit",
    HARNESS_HEAD,
  ]);

  assert(existsSync(join(repo, ".agent/skills/commit-and-push/SKILL.md")), "skill missing");
  assert(!existsSync(join(repo, ".agent/templates")), "sparse checkout should hide templates");
  assert(existsSync(join(repo, ".gitmodules")), ".gitmodules missing");

  const state = JSON.parse(readFileSync(join(repo, ".harness.json"), "utf8"));
  assert(state.harness.commit === HARNESS_HEAD, "harness commit not pinned");

  const result = verify(repo);
  assert(result.status === 0, result.stdout || result.stderr);

  const commitsAfter = git(["rev-list", "--count", "HEAD"], repo).trim();
  assert(commitsAfter === commitsBefore, "the pilot must not create commits");
});

// --- pilot 2: adopt an existing repository --------------------------------

test("existing repository: preserve AGENTS.md and adopt", () => {
  const repo = newRepo("adopt");
  writeFileSync(join(repo, "package.json"), '{\n  "name": "pilot-web"\n}\n');
  writeFileSync(join(repo, "check.mjs"), "process.exit(0);\n");
  writeFileSync(
    join(repo, "AGENTS.md"),
    "# Pilot Web\n\nExisting introduction written by the maintainer.\n\n## Custom workflow\n\nKeep this section.\n",
  );
  commitAll(repo, "chore: initial commit");

  const answers = writeAnswers(join(TMP, "adopt-answers.json"));
  render(answers, repo, ["--merge", "--submodule", ROOT, "--commit", HARNESS_HEAD]);

  const agents = readFileSync(join(repo, "AGENTS.md"), "utf8");
  assert(agents.includes("Keep this section."), "custom section lost");
  assert(agents.includes("Existing introduction"), "introduction lost");
  assert(agents.includes("## Commits and pushes"), "harness sections missing");
  assert(
    agents.match(/## Custom workflow/g).length === 1,
    "custom section duplicated",
  );
  assert(
    readFileSync(join(repo, "package.json"), "utf8").includes('"name": "pilot-web"'),
    "application file changed",
  );

  const result = verify(repo);
  assert(result.status === 0, result.stdout || result.stderr);
});

// --- pilot 3: update is idempotent ---------------------------------------

test("update: re-render is idempotent and never commits", () => {
  const repo = join(TMP, "new");
  const answers = join(TMP, "new-answers.json");
  const commitsBefore = git(["rev-list", "--count", "HEAD"], repo).trim();

  const result = render(answers, repo, [
    "--merge",
    "--submodule",
    ROOT,
    "--commit",
    HARNESS_HEAD,
  ]);
  assert(result.stdout.includes("unchanged") || result.stdout.includes("skipped"), "no unchanged files");
  assert(
    git(["rev-list", "--count", "HEAD"], repo).trim() === commitsBefore,
    "re-render created a commit",
  );

  const verifyResult = verify(repo);
  assert(verifyResult.status === 0, verifyResult.stdout || verifyResult.stderr);
});

console.log(`\n${passed}/${passed + failed} pilots passed.`);
if (!KEEP) rmSync(TMP, { recursive: true, force: true });
else console.log(`Pilot artifacts kept in ${TMP}`);
if (failed) process.exit(1);
