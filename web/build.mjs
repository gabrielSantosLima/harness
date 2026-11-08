#!/usr/bin/env node
// Builds the static documentation site into web/dist.
// Usage: node web/build.mjs [--check]
import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const WEB = dirname(fileURLToPath(import.meta.url));
const CONTENT = join(WEB, "content");
const THEME = join(WEB, "theme");
const ASSETS = join(WEB, "assets");
const OUT = join(WEB, "dist");
const BASE_URL = "https://gabrielSantosLima.github.io/harness/";
const CHECK = process.argv.includes("--check");
const REPO_URL = "https://github.com/gabrielSantosLima/harness";
const linkTargets = new Set();

// --- utilities -------------------------------------------------------------

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function walk(dir, base = dir) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) entries.push(...walk(path, base));
    else if (name.endsWith(".md")) entries.push(relative(base, path).split(sep).join("/"));
  }
  return entries.sort();
}

function parseFrontmatter(text) {
  if (!text.startsWith("---\n")) return { data: {}, body: text };
  const end = text.indexOf("\n---", 4);
  if (end === -1) return { data: {}, body: text };
  const data = {};
  for (const line of text.slice(4, end).split("\n")) {
    const match = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!match) continue;
    data[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
  return { data, body: text.slice(text.indexOf("\n", end + 1) + 1) };
}

function stripMarkdown(value) {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function version() {
  try {
    return execFileSync("git", ["describe", "--tags", "--abbrev=0"], {
      cwd: WEB,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "main";
  }
}

// --- markdown --------------------------------------------------------------

function currentPageDepth(outRel) {
  const directory = dirname(outRel);
  if (directory === ".") return 0;
  return directory.split("/").length;
}

function rewriteLink(href, sourceRel, prefix) {
  if (!href || /^(https?:|mailto:|#|data:)/.test(href)) return href;
  if (href.endsWith(".md")) {
    const [path, hash] = href.split("#");
    const resolved = relative(CONTENT, resolve(CONTENT, dirname(sourceRel), path))
      .split(sep)
      .join("/")
      .replace(/\.md$/, ".html");
    linkTargets.add(resolved);
    return `${prefix}${resolved}${hash ? `#${hash}` : ""}`;
  }
  return href;
}

function inline(value, sourceRel, prefix) {
  let output = escapeHtml(value);
  output = output.replace(/`([^`]+)`/g, "<code>$1</code>");
  output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  output = output.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  output = output.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (_, alt, src) => `<img src="${rewriteLink(src, sourceRel, prefix)}" alt="${alt}">`,
  );
  output = output.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_, label, href) => `<a href="${rewriteLink(href, sourceRel, prefix)}">${label}</a>`,
  );
  return output;
}

function renderMarkdown(body, sourceRel, prefix) {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  const toc = [];
  let index = 0;

  const isBlockStart = (line) =>
    /^(#{1,4})\s|^```|^>\s?|^[-*]\s|^\d+\.\s|^\|/.test(line) || line.startsWith("<");

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const code = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        code.push(lines[index]);
        index += 1;
      }
      index += 1;
      html.push(
        `<pre><code${language ? ` class="language-${escapeHtml(language)}"` : ""}>${escapeHtml(code.join("\n"))}</code></pre>`,
      );
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2];
      const id = slugify(text);
      html.push(
        `<h${level} id="${id}">${inline(text, sourceRel, prefix)}</h${level}>`,
      );
      if (level === 2 || level === 3) toc.push({ level, id, text: stripMarkdown(text) });
      index += 1;
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      html.push("<hr>");
      index += 1;
      continue;
    }

    if (line.startsWith("<")) {
      const raw = [];
      while (index < lines.length && lines[index].trim()) {
        raw.push(lines[index]);
        index += 1;
      }
      html.push(raw.join("\n"));
      continue;
    }

    if (line.startsWith(">")) {
      const quote = [];
      while (index < lines.length && lines[index].startsWith(">")) {
        quote.push(lines[index].replace(/^>\s?/, ""));
        index += 1;
      }
      html.push(`<blockquote><p>${inline(quote.join(" "), sourceRel, prefix)}</p></blockquote>`);
      continue;
    }

    if (line.trim().startsWith("|")) {
      const rows = [];
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        rows.push(lines[index].trim());
        index += 1;
      }
      const cells = (row) =>
        row.replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
      const header = cells(rows[0]);
      const bodyRows = rows.slice(2).map(cells);
      html.push("<table><thead><tr>");
      for (const cell of header) html.push(`<th>${inline(cell, sourceRel, prefix)}</th>`);
      html.push("</tr></thead><tbody>");
      for (const row of bodyRows) {
        html.push("<tr>");
        for (const cell of row) html.push(`<td>${inline(cell, sourceRel, prefix)}</td>`);
        html.push("</tr>");
      }
      html.push("</tbody></table>");
      continue;
    }

    if (/^[-*]\s/.test(line)) {
      const items = [];
      while (index < lines.length && /^[-*]\s/.test(lines[index])) {
        items.push(lines[index].replace(/^[-*]\s/, ""));
        index += 1;
        while (index < lines.length && /^\s{2,}\S/.test(lines[index])) {
          items[items.length - 1] += ` ${lines[index].trim()}`;
          index += 1;
        }
      }
      html.push(`<ul>${items.map((item) => `<li>${inline(item, sourceRel, prefix)}</li>`).join("")}</ul>`);
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (index < lines.length && /^\d+\.\s/.test(lines[index])) {
        items.push(lines[index].replace(/^\d+\.\s/, ""));
        index += 1;
      }
      html.push(`<ol>${items.map((item) => `<li>${inline(item, sourceRel, prefix)}</li>`).join("")}</ol>`);
      continue;
    }

    const paragraph = [];
    while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index])) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    if (paragraph.length) {
      html.push(`<p>${inline(paragraph.join(" "), sourceRel, prefix)}</p>`);
    }
  }

  return { html: html.join("\n"), toc };
}

// --- site ------------------------------------------------------------------

function loadPages() {
  const navigation = JSON.parse(readFileSync(join(CONTENT, "navigation.json"), "utf8"));
  const pages = [];

  const home = parseFrontmatter(readFileSync(join(CONTENT, "index.md"), "utf8"));
  pages.push({
    sourceRel: "index.md",
    outRel: "index.html",
    url: "",
    title: home.data.title ?? "Harness",
    description: home.data.description ?? "",
    section: "",
    sectionTitle: "",
    body: home.body,
  });

  for (const section of navigation) {
    for (const slug of section.pages) {
      const sourceRel = `${section.slug}/${slug}.md`;
      const path = join(CONTENT, sourceRel);
      if (!existsSync(path)) throw new Error(`Navigation references a missing page: ${sourceRel}`);
      const parsed = parseFrontmatter(readFileSync(path, "utf8"));
      pages.push({
        sourceRel,
        outRel: `${section.slug}/${slug}.html`,
        url: `${section.slug}/${slug}.html`,
        title: parsed.data.title ?? slug,
        description: parsed.data.description ?? "",
        section: section.slug,
        sectionTitle: section.title,
        body: parsed.body,
      });
    }
  }
  return pages;
}

function sidebarHtml(pages, current, prefix) {
  const sections = [];
  for (const page of pages) {
    if (!page.section) continue;
    let section = sections.find((item) => item.slug === page.section);
    if (!section) {
      section = { slug: page.section, title: page.sectionTitle, pages: [] };
      sections.push(section);
    }
    section.pages.push(page);
  }

  const parts = [];
  const homeActive = current.sourceRel === "index.md" ? ' class="active"' : "";
  parts.push(`<a href="${prefix}index.html"${homeActive}>Home</a>`);
  for (const section of sections) {
    parts.push(`<div class="nav-group"><span class="nav-title">${escapeHtml(section.title)}</span>`);
    for (const page of section.pages) {
      const active = page.sourceRel === current.sourceRel ? ' class="active"' : "";
      parts.push(`<a href="${prefix}${page.outRel}"${active}>${escapeHtml(page.title)}</a>`);
    }
    parts.push("</div>");
  }
  return parts.join("\n");
}

function tocHtml(toc) {
  if (!toc.length) return "";
  return `<nav class="toc"><span class="nav-title">On this page</span>${toc
    .map(
      (item) =>
        `<a class="toc-${item.level}" href="#${item.id}">${escapeHtml(item.text)}</a>`,
    )
    .join("")}</nav>`;
}

function prevNext(pages, current, prefix) {
  const index = pages.findIndex((page) => page.sourceRel === current.sourceRel);
  const previous = pages[index - 1];
  const next = pages[index + 1];
  const parts = ['<nav class="pager">'];
  if (previous) {
    parts.push(
      `<a class="prev" href="${prefix}${previous.outRel}"><span>Previous</span>${escapeHtml(previous.title)}</a>`,
    );
  } else {
    parts.push("<span></span>");
  }
  if (next) {
    parts.push(
      `<a class="next" href="${prefix}${next.outRel}"><span>Next</span>${escapeHtml(next.title)}</a>`,
    );
  }
  parts.push("</nav>");
  return parts.join("");
}

function layout(page, site) {
  const template = readFileSync(join(THEME, "layout.html"), "utf8");
  const values = {
    lang: "en",
    title: page.title === "Harness" ? "Harness" : `${page.title} · Harness`,
    description: page.description || "Universal, stack-agnostic project setup harness.",
    root: site.prefix,
    sidebar: site.sidebar,
    content: site.html,
    toc: site.toc,
    pager: site.pager,
    version: site.version,
    year: String(new Date().getFullYear()),
    editUrl: `${REPO_URL}/edit/main/web/content/${page.sourceRel}`,
    repoUrl: REPO_URL,
    releasesUrl: `${REPO_URL}/releases`,
    docsUrl: BASE_URL,
    searchUrl: `${site.prefix}search-index.json`,
  };
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? "");
}

function writeFile(relativePath, content) {
  const path = join(OUT, relativePath);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function main() {
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });

  const pages = loadPages();
  const siteVersion = version();
  const search = [];

  for (const page of pages) {
    const prefix = "../".repeat(currentPageDepth(page.outRel));
    const rendered = renderMarkdown(page.body, page.sourceRel, prefix);
    const site = {
      prefix,
      version: siteVersion,
      sidebar: sidebarHtml(pages, page, prefix),
      html: rendered.html,
      toc: tocHtml(rendered.toc),
      pager: prevNext(pages, page, prefix),
    };
    writeFile(page.outRel, layout(page, site));
    search.push({
      title: page.title,
      section: page.sectionTitle,
      url: page.outRel,
      text: stripMarkdown(page.body).slice(0, 1200),
    });
  }

  writeFile("search-index.json", JSON.stringify(search));
  writeFile("assets/styles.css", readFileSync(join(THEME, "styles.css"), "utf8"));
  writeFile("assets/app.js", readFileSync(join(THEME, "app.js"), "utf8"));

  if (existsSync(ASSETS)) {
    for (const name of readdirSync(ASSETS)) {
      mkdirSync(join(OUT, "assets"), { recursive: true });
      copyFileSync(join(ASSETS, name), join(OUT, "assets", name));
    }
  }

  const urls = pages
    .map((page) => `  <url><loc>${BASE_URL}${page.outRel}</loc></url>`)
    .join("\n");
  writeFile(
    "sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  writeFile("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${BASE_URL}sitemap.xml\n`);

  const notFound = pages[0];
  const notFoundSite = {
    prefix: "",
    version: siteVersion,
    sidebar: sidebarHtml(pages, notFound, ""),
    html: '<h1 id="not-found">Page not found</h1><p>The page you are looking for does not exist. <a href="index.html">Go to the documentation home</a>.</p>',
    toc: "",
    pager: "",
  };
  writeFile(
    "404.html",
    layout({ ...notFound, title: "Page not found", description: "Page not found." }, notFoundSite),
  );

  const missing = [...linkTargets].filter((target) => !existsSync(join(OUT, target)));
  if (CHECK && missing.length) {
    console.error(`Broken internal links:\n${missing.map((item) => `  - ${item}`).join("\n")}`);
    process.exit(1);
  }

  console.log(
    `Docs built: ${pages.length} pages, ${search.length} search entries${CHECK ? ", links verified" : ""}.`,
  );
  console.log(`Output: ${OUT}`);
}

main();
