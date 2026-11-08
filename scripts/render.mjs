#!/usr/bin/env node
// Renders the harness templates into a target repository.
// Usage: node scripts/render.mjs --answers <file> --target <dir> [--dry-run] [--force] [--merge] [--submodule <url>] [--commit <hash>]
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HARNESS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const SKILL_DESCRIPTIONS = {
  "commit-and-push":
    "review, stage explicit files, write a Conventional Commit, commit and push.",
  "release-summary": "write a short user-facing summary of the latest release.",
  "release-cut": "trigger the release workflow, watch it and verify the result.",
  "github-pages": "publish a static site or generated documentation to GitHub Pages.",
  "add-skill": "propose a new reusable skill and apply it in the harness repository.",
};

const TYPE_TEXT = {
  web: "A web project. It runs in a browser and ships as a deployed site.",
  mobile: "A mobile project. It ships as an application for a mobile platform.",
  desktop: "A desktop project. It ships as an installer or archive.",
  library: "A library project. It ships as a reusable package, CLI or archive.",
  data: "A data project. The data files are the product and the source of truth.",
};

function arg(name, fallback = null) {
  const index = process.argv.indexOf(name);
  if (index !== -1 && process.argv[index + 1]) return process.argv[index + 1];
  const inline = process.argv.find((value) => value.startsWith(`${name}=`));
  return inline ? inline.slice(name.length + 1) : fallback;
}

function flag(name) {
  return process.argv.includes(name);
}

function read(file) {
  return readFileSync(file, "utf8");
}

// --- template engine -------------------------------------------------------

function getValue(context, key) {
  return key
    .split(".")
    .reduce((value, part) => (value == null ? value : value[part]), context);
}

const TOKEN =
  /(?<!\$)\{\{#(if|unless)\s+([\w.]+)\}\}|\{\{\/(if|unless)\}\}|\{\{else\}\}|(?<!\$)\{\{\s*([\w.]+)\s*\}\}/g;

function targetOf(parent) {
  if (!parent || parent.type !== "if") return parent.children;
  return parent.inElse ? parent.falsy : parent.truthy;
}

function parse(text) {
  const root = { type: "root", children: [] };
  const stack = [root];
  let last = 0;

  for (const match of text.matchAll(TOKEN)) {
    const index = match.index;
    if (index > last) {
      targetOf(stack[stack.length - 1]).push({
        type: "text",
        value: text.slice(last, index),
      });
    }

    if (match[1]) {
      const node = {
        type: "if",
        kind: match[1],
        key: match[2],
        truthy: [],
        falsy: [],
        inElse: false,
      };
      targetOf(stack[stack.length - 1]).push(node);
      stack.push(node);
    } else if (match[3]) {
      if (stack.length === 1) throw new Error(`Unbalanced {{/${match[3]}}}`);
      stack.pop();
    } else if (match[0] === "{{else}}") {
      const node = stack[stack.length - 1];
      if (!node || node.type !== "if") throw new Error("{{else}} outside a block");
      node.inElse = true;
    } else if (match[4]) {
      targetOf(stack[stack.length - 1]).push({ type: "var", key: match[4] });
    }
    last = index + match[0].length;
  }

  if (last < text.length) {
    targetOf(stack[stack.length - 1]).push({ type: "text", value: text.slice(last) });
  }
  if (stack.length !== 1) throw new Error("Unbalanced block in template");
  return root;
}

function renderNodes(nodes, context, output) {
  for (const node of nodes) {
    if (node.type === "text") {
      output.push(node.value);
    } else if (node.type === "var") {
      const value = getValue(context, node.key);
      output.push(value === undefined || value === null ? "" : String(value));
    } else {
      const value = Boolean(getValue(context, node.key));
      const condition = node.kind === "if" ? value : !value;
      renderNodes(condition ? node.truthy : node.falsy, context, output);
    }
  }
  return output;
}

function render(text, context) {
  const output = renderNodes(parse(text).children, context, []).join("");
  return output.replace(/\n{3,}/g, "\n\n");
}

function section(name, context) {
  return render(read(join(HARNESS_ROOT, "guidelines", `${name}.md`)), context).trim();
}

const HEADING_ALIASES = {
  "commits and pushes": ["committing and pushing", "commits", "git workflow", "git"],
  "versioning and releases": ["releases", "release", "versioning"],
  deploy: ["deployment", "deploying"],
  "secrets and safety": ["security", "safety", "secrets"],
  "ci and build": ["ci", "build", "ci/cd", "build and ci"],
  "language rules": ["language", "languages"],
  skills: ["agent skills"],
  commands: ["command reference", "build and test", "development"],
};

function canonicalHeading(heading) {
  const value = heading.trim().toLowerCase();
  for (const [canonical, aliases] of Object.entries(HEADING_ALIASES)) {
    if (value === canonical || aliases.includes(value)) return canonical;
  }
  return value;
}

function mergeAgents(existing, generated) {
  const headings = new Set(
    [...existing.matchAll(/^##\s+(.+)$/gm)].map((match) => canonicalHeading(match[1])),
  );
  const sections = [];
  let current = null;
  for (const line of generated.split(/\r?\n/)) {
    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      if (current) sections.push(current);
      current = { heading: heading[1].trim(), body: [] };
    } else if (current) {
      current.body.push(line);
    }
  }
  if (current) sections.push(current);

  const missing = sections.filter(
    (item) => !headings.has(canonicalHeading(item.heading)),
  );
  if (!missing.length) return existing;
  const appended = missing
    .map((item) => `## ${item.heading}\n\n${item.body.join("\n").trim()}`)
    .join("\n\n");
  return `${existing.trimEnd()}\n\n${appended}\n`;
}

// --- answers ---------------------------------------------------------------

function loadAnswers(path) {
  const answers = JSON.parse(read(path));
  for (const field of ["project", "git", "quality", "version", "release", "skills"]) {
    if (!answers[field]) throw new Error(`Answers are missing "${field}"`);
  }
  if (!TYPE_TEXT[answers.project.type]) {
    throw new Error(`Unknown project type: ${answers.project.type}`);
  }
  if (answers.quality.ciDepth === "full" && !answers.build?.command) {
    throw new Error("CI depth is 'full' but build.command is empty");
  }
  return answers;
}

function buildContext(answers, options) {
  const project = answers.project;
  const quality = answers.quality;
  const build = answers.build ?? {};
  const version = answers.version;
  const release = answers.release;
  const deploy = answers.deploy ?? { target: "none" };
  const hygiene = answers.hygiene ?? {};
  const checks = quality.checks ?? [];
  const osList = quality.os?.length ? quality.os : ["ubuntu-latest"];
  const ciDepth = quality.ciDepth;
  const hasCI = ciDepth === "ci" || ciDepth === "full";
  const hasBuild = ciDepth === "full";
  const isFile = version.source === "file";
  const deployEnabled = Boolean(deploy.target && deploy.target !== "none");
  const deployArtifact = deploy.artifact ?? build.artifacts?.[0] ?? "dist";
  const owner = project.owner ?? (project.repo ? project.repo.split("/")[0] : "");
  const repo = project.repo ?? (owner ? `${owner}/${project.slug}` : project.slug);

  const commitAutonomyText = {
    "commit-and-push-when-asked":
      "Commit and push only when the user asks. When they do, commit the intended changes and push to the current branch.",
    "commit-only-when-asked":
      "Commit only when the user asks. Never push unless the user explicitly requests it in a separate instruction.",
    strict: "Never commit or push without an explicit instruction for that specific action.",
  }[answers.git.commitAutonomy];

  const deployTriggerText = {
    "on-release": "after a successful `Release` workflow run",
    "on-push": "on every push to the default branch",
    manual: "manually through `workflow_dispatch`",
  }[deploy.trigger ?? "manual"];

  const deployTargetText =
    deploy.target === "github-pages" ? "GitHub Pages (`github-pages`)" : "a custom host";

  const commandRows = checks.map((check) => `| Check | \`${check}\` |`);
  if (!checks.length) commandRows.push("| Check | Not configured yet |");
  if (hasBuild) commandRows.push(`| Build | \`${build.command}\` |`);
  commandRows.push('| Release | `gh workflow run release.yml -f bump=minor -f summary="..."` |');

  return {
    ...answers,
    name: project.name,
    slug: project.slug,
    description: project.description,
    type: project.type,
    typeText: TYPE_TEXT[project.type],
    license: project.license ?? "MIT",
    owner,
    repo,
    defaultBranch: answers.git.defaultBranch ?? "main",
    firstTag: "v0.1.0",
    commitAutonomy: answers.git.commitAutonomy,
    commitAutonomyText,
    checks,
    hasChecks: checks.length > 0,
    checkBullets: checks.map((command) => `- \`${command}\``).join("\n"),
    checkRunIndented: checks.map((command) => `          ${command}`).join("\n"),
    commandsBlock: `| Purpose | Command |\n| --- | --- |\n${commandRows.join("\n")}`,
    ciDepth,
    hasCI,
    hasBuild,
    releaseOnly: ciDepth === "release-only",
    osList: osList.join(", "),
    osFirst: osList[0],
    osJson: JSON.stringify(osList),
    osMatrix: osList.length > 1,
    artifactName: osList.length > 1 ? "build-output-${{ matrix.os }}" : "build-output",
    artifactsIndented: (build.artifacts ?? [])
      .map((item) => `            ${item}`)
      .join("\n"),
    buildCommand: build.command ?? "",
    buildRunIndented: (build.command ?? "")
      .split("\n")
      .map((line) => `          ${line}`)
      .join("\n"),
    artifacts: build.artifacts ?? [],
    artifactList:
      (build.artifacts ?? []).map((item) => `\`${item}\``).join(", ") || "none",
    artifactsShell: (build.artifacts ?? []).map((item) => `"${item}"`).join(" "),
    attachArtifacts: Boolean(release.attachArtifacts && hasBuild),
    versionSource: version.source,
    versionIsFile: isFile,
    versionFile: version.file ?? "",
    versionPointer: version.pointer ?? "",
    notesLanguage: release.notesLanguage ?? "en",
    notesNotEnglish: (release.notesLanguage ?? "en") !== "en",
    deployEnabled,
    deployTarget: deploy.target ?? "none",
    deployTargetText,
    deployTriggerText,
    deployArtifact,
    deployOnRelease: deploy.trigger === "on-release",
    deployOnPush: deploy.trigger === "on-push",
    isWeb: project.type === "web",
    isMobile: project.type === "mobile",
    isDesktop: project.type === "desktop",
    isLibrary: project.type === "library",
    isData: project.type === "data",
    skills: answers.skills,
    skillsRoot: options.skillsRoot ?? ".agent/skills",
    isHarness: options.skillsRoot === "skills",
    skillBullets: answers.skills
      .map((id) => `- \`${id}\` - ${SKILL_DESCRIPTIONS[id] ?? "reusable workflow."}`)
      .join("\n"),
    flatSkills: answers.skills.join(", "),
    generatePr: hygiene.pullRequestTemplate !== false,
    generateCodeowners: hygiene.codeowners !== false,
    codeownersOwner: hygiene.codeownersOwner ?? `@${owner}`,
    harnessCommit: options.commit ?? answers.harness?.commit ?? "",
    harnessVersion: answers.harness?.version ?? 2,
    ignore: answers.ignore ?? [],
  };
}

function buildState(context) {
  const state = {
    harness: { version: context.harnessVersion, commit: context.harnessCommit },
    project: {
      name: context.name,
      slug: context.slug,
      description: context.description,
      type: context.type,
      license: context.license,
      owner: context.owner,
      repo: context.repo,
    },
    git: {
      commitAutonomy: context.commitAutonomy,
      defaultBranch: context.defaultBranch,
    },
    quality: {
      checks: context.checks,
      ciDepth: context.ciDepth,
      os: JSON.parse(context.osJson),
    },
    version: context.versionIsFile
      ? { source: "file", file: context.versionFile, pointer: context.versionPointer }
      : { source: "tags" },
    release: {
      trigger: "workflow_dispatch",
      notesLanguage: context.notesLanguage,
      sections: ["features", "fixes", "chores", "other", "known-issues"],
      attachArtifacts: context.attachArtifacts,
    },
    deploy: {
      target: context.deployTarget,
      trigger: context.deployOnRelease
        ? "on-release"
        : context.deployOnPush
          ? "on-push"
          : "manual",
      artifact: context.deployArtifact,
    },
    skills: context.skills,
    hygiene: {
      pullRequestTemplate: context.generatePr,
      codeowners: context.generateCodeowners,
      codeownersOwner: context.codeownersOwner,
    },
    ignore: context.ignore,
  };
  if (context.hasBuild) {
    state.build = {
      command: context.buildCommand,
      artifacts: context.artifacts,
      attachToRelease: context.attachArtifacts,
    };
  }
  return state;
}

// --- outputs ---------------------------------------------------------------

function buildOutputs(context) {
  const agents = render(read(join(HARNESS_ROOT, "templates", "AGENTS.md")), {
    ...context,
    sec_language: section("language", context),
    sec_commits: section("commits", context),
    sec_releases: section("releases", context),
    sec_build: section("build-ci", context),
    sec_skills: section("skills", context),
    sec_safety: section("safety", context),
    sec_data: context.isData ? section("data", context) : "",
    sec_harness: context.isHarness ? section("harness", context) : "",
  });

  const templateName = `RELEASE_TEMPLATE.${context.notesLanguage}.md`;
  const templatePath = join(HARNESS_ROOT, "templates", "docs", templateName);
  const fallbackPath = join(HARNESS_ROOT, "templates", "docs", "RELEASE_TEMPLATE.en.md");
  const releaseTemplate = render(
    read(existsSync(templatePath) ? templatePath : fallbackPath),
    context,
  );

  const outputs = [
    { path: "AGENTS.md", content: agents, merge: true },
    { path: "docs/RELEASE_TEMPLATE.md", content: releaseTemplate },
    {
      path: "scripts/release-notes.mjs",
      source: "templates/scripts/release-notes.mjs",
    },
  ];

  if (context.versionIsFile) {
    outputs.push({
      path: "scripts/bump-version.mjs",
      source: "templates/scripts/bump-version.mjs",
    });
  } else {
    outputs.push({
      path: "scripts/next-version.mjs",
      source: "templates/scripts/next-version.mjs",
    });
  }

  outputs.push({
    path: ".github/workflows/release.yml",
    source: "templates/.github/workflows/release.yml",
  });
  if (context.hasCI) {
    outputs.push({
      path: ".github/workflows/ci.yml",
      source: "templates/.github/workflows/ci.yml",
    });
  }
  if (context.hasBuild) {
    outputs.push({
      path: ".github/workflows/build.yml",
      source: "templates/.github/workflows/build.yml",
    });
  }
  if (context.deployEnabled && context.deployTarget === "github-pages") {
    outputs.push({
      path: ".github/workflows/deploy.yml",
      source: "templates/.github/workflows/deploy.yml",
    });
  }
  if (context.generatePr) {
    outputs.push({
      path: ".github/pull_request_template.md",
      source: "templates/.github/pull_request_template.md",
    });
  }
  if (context.generateCodeowners) {
    outputs.push({
      path: ".github/CODEOWNERS",
      content: `* ${context.codeownersOwner}\n`,
    });
  }

  outputs.push({
    path: ".harness.json",
    content: `${JSON.stringify(buildState(context), null, 2)}\n`,
  });

  return outputs;
}

// --- writes ----------------------------------------------------------------

function writeFile(target, relative, content, actions, options) {
  const path = join(target, relative);
  const exists = existsSync(path);

  if (exists && relative === ".harness.json") {
    if (!options.dryRun) writeFileSync(path, content);
    actions.push({ path: relative, action: "overwrite" });
    return;
  }
  if (exists && relative === "AGENTS.md" && options.merge) {
    const current = read(path);
    const merged = mergeAgents(current, content);
    if (merged === current) {
      actions.push({ path: relative, action: "unchanged" });
      return;
    }
    if (!options.dryRun) writeFileSync(path, merged);
    actions.push({ path: relative, action: "merged" });
    return;
  }
  if (exists && !options.force) {
    actions.push({ path: relative, action: "skipped (exists)" });
    return;
  }

  if (!options.dryRun) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
  }
  actions.push({ path: relative, action: exists ? "overwrite" : "create" });
}

function appendIgnore(target, lines, actions, options) {
  const path = join(target, ".gitignore");
  const current = existsSync(path) ? read(path) : "";
  const missing = lines.filter((line) => !current.split(/\r?\n/).includes(line));
  if (!missing.length) {
    actions.push({ path: ".gitignore", action: "unchanged" });
    return;
  }
  const prefix = current && !current.endsWith("\n") ? "\n" : "";
  const block = `${prefix}\n# Local-only files (harness)\n${missing.join("\n")}\n`;
  if (!options.dryRun) writeFileSync(path, current + block);
  actions.push({ path: ".gitignore", action: current ? "appended" : "created" });
}

function addSubmodule(root, url, options) {
  try {
    execFileSync("git", ["-C", root, "rev-parse", "--is-inside-work-tree"], {
      stdio: "ignore",
    });
  } catch {
    return "submodule skipped (target is not a git repository)";
  }
  if (existsSync(join(root, ".agent"))) {
    return "submodule skipped (.agent already exists)";
  }
  if (options.dryRun) return `submodule would be added from ${url}`;
  try {
    execFileSync(
      "git",
      [
        "-c",
        "protocol.file.allow=always",
        "-C",
        root,
        "submodule",
        "add",
        "--depth",
        "1",
        url,
        ".agent",
      ],
      { stdio: "ignore" },
    );
    execFileSync("git", ["-C", join(root, ".agent"), "sparse-checkout", "set", "skills"], {
      stdio: "ignore",
    });
    if (options.commit) {
      try {
        execFileSync(
          "git",
          ["-C", join(root, ".agent"), "checkout", "--quiet", options.commit],
          { stdio: "ignore" },
        );
      } catch {
        // The pinned commit may be unreachable in a shallow clone; HEAD stays.
      }
    }
    return `submodule added from ${url} (sparse: skills/)`;
  } catch {
    return `submodule could not be added from ${url}; add it manually`;
  }
}

// --- main ------------------------------------------------------------------

function main() {
  const answersPath = arg("--answers");
  const target = arg("--target");
  if (!answersPath || !target) {
    console.error(
      "Usage: node scripts/render.mjs --answers <file> --target <dir> [--dry-run] [--force] [--merge] [--submodule <url>] [--commit <hash>] [--skills-root <path>]",
    );
    process.exit(1);
  }

  const options = {
    dryRun: flag("--dry-run"),
    force: flag("--force"),
    merge: flag("--merge"),
    submoduleUrl: arg("--submodule"),
    commit: arg("--commit"),
    skillsRoot: arg("--skills-root"),
  };

  const answers = loadAnswers(resolve(answersPath));
  const context = buildContext(answers, options);
  const root = resolve(target);
  const actions = [];

  for (const output of buildOutputs(context)) {
    const content = output.content ?? render(read(join(HARNESS_ROOT, output.source)), context);
    writeFile(root, output.path, content, actions, options);
  }
  if (context.ignore.length) {
    appendIgnore(root, context.ignore, actions, options);
  }

  const submoduleResult = options.submoduleUrl
    ? addSubmodule(root, options.submoduleUrl, options)
    : null;

  console.log(`Harness render ${options.dryRun ? "(dry run)" : ""}`);
  console.log(`Target: ${root}`);
  for (const item of actions) {
    console.log(`- ${item.action.padEnd(18)} ${item.path}`);
  }
  if (submoduleResult) console.log(`- ${submoduleResult}`);
  console.log(`\n${options.dryRun ? "Would render" : "Rendered"} ${actions.length} files.`);
}

main();
