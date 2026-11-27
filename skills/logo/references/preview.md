# HTML preview

`logo-preview.html` is the artifact that presents the five versions. It is a
single file with inline CSS and inline SVG. No fonts, scripts, images, CDNs or
network requests.

## Rules

- Exactly five cards, labeled `V1` to `V5`.
- Each card has one inline SVG sketch inside a square `viewBox`; the sketch shows
  the idea, not the final asset.
- Mark sketches as concept artwork so nobody mistakes them for production files.
- Show every mark on a light and on a dark surface.
- Repeat each mark at 16, 24, 32, 64 and 200 px with CSS sizes.
- List name, concept, geometry, typography direction, small-size behavior and
  risk beside each sketch.
- Show the palette as swatches with hex values and roles.
- Keep the comparison table above the cards.
- Use system fonts, a readable measure, visible focus states and sufficient
  contrast.
- No secrets, absolute paths, telemetry, timestamps or external URLs.
- The document must render when opened directly from disk.

## Skeleton

Replace the names, copy, colors and SVG paths. Keep the structure.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Logo preview — PROJECT</title>
  <style>
    :root {
      color-scheme: light dark;
      --bg: #f6f7fb;
      --surface: #ffffff;
      --text: #11131a;
      --muted: #5b6172;
      --line: #dfe3ec;
      --accent: #2a4bd7;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #0d1017;
        --surface: #151a24;
        --text: #eef1f7;
        --muted: #9aa2b4;
        --line: #2a3140;
      }
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 32px 20px 64px;
      background: var(--bg);
      color: var(--text);
      font: 16px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif;
    }
    main { max-width: 1120px; margin: 0 auto; }
    h1, h2, h3 { line-height: 1.2; }
    h1 { margin: 0 0 4px; font-size: 1.8rem; }
    .lede { margin: 0 0 28px; color: var(--muted); }
    .compare { width: 100%; border-collapse: collapse; margin-bottom: 32px; font-size: .9rem; }
    .compare th, .compare td { border-bottom: 1px solid var(--line); padding: 8px 10px; text-align: left; vertical-align: top; }
    .compare th { color: var(--muted); font-weight: 600; }
    .grid { display: grid; gap: 20px; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
    .card { background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding: 18px; }
    .card h3 { margin: 0; font-size: 1.1rem; }
    .tag { color: var(--accent); font-size: .8rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
    .note { margin: 4px 0 14px; color: var(--muted); font-size: .85rem; }
    .stage { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
    .surface { display: grid; place-items: center; min-height: 150px; border: 1px solid var(--line); border-radius: 10px; }
    .surface.light { background: #ffffff; }
    .surface.dark { background: #10131a; }
    .surface svg { width: 96px; height: 96px; }
    .sizes { display: flex; align-items: end; gap: 14px; margin-bottom: 16px; color: var(--muted); font-size: .75rem; }
    .sizes figure { margin: 0; text-align: center; }
    .sizes svg { display: block; margin: 0 auto 4px; }
    .palette { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 14px; padding: 0; list-style: none; }
    .palette li { display: flex; align-items: center; gap: 6px; font-size: .78rem; color: var(--muted); }
    .swatch { width: 16px; height: 16px; border-radius: 50%; border: 1px solid var(--line); }
    dl { display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; margin: 0; font-size: .85rem; }
    dt { color: var(--muted); }
    dd { margin: 0; }
    .risk { color: #b42318; }
    @media (prefers-color-scheme: dark) { .risk { color: #ff9c8f; } }
  </style>
</head>
<body>
  <main>
    <h1>PROJECT — logo versions</h1>
    <p class="lede">Five concept directions. Sketches are for comparison only; no final asset exists yet.</p>

    <table class="compare">
      <thead>
        <tr><th>Version</th><th>Name</th><th>Concept</th><th>Geometry</th><th>Type</th><th>Risk</th></tr>
      </thead>
      <tbody>
        <tr><td>V1</td><td>NAME</td><td>One-sentence idea.</td><td>Shapes and grid.</td><td>Symbol only.</td><td>What could fail.</td></tr>
      </tbody>
    </table>

    <section class="grid">
      <article class="card">
        <span class="tag">V1</span>
        <h3>NAME</h3>
        <p class="note">Concept sketch, not final artwork.</p>
        <div class="stage">
          <div class="surface light">
            <svg viewBox="0 0 64 64" role="img" aria-label="V1 on light"><path d="M32 8 56 56H8Z" fill="#2a4bd7"/></svg>
          </div>
          <div class="surface dark">
            <svg viewBox="0 0 64 64" role="img" aria-label="V1 on dark"><path d="M32 8 56 56H8Z" fill="#8fa6ff"/></svg>
          </div>
        </div>
        <div class="sizes" aria-label="Size test">
          <figure><svg viewBox="0 0 64 64" width="16" height="16"><path d="M32 8 56 56H8Z" fill="currentColor"/></svg><figcaption>16</figcaption></figure>
          <figure><svg viewBox="0 0 64 64" width="24" height="24"><path d="M32 8 56 56H8Z" fill="currentColor"/></svg><figcaption>24</figcaption></figure>
          <figure><svg viewBox="0 0 64 64" width="32" height="32"><path d="M32 8 56 56H8Z" fill="currentColor"/></svg><figcaption>32</figcaption></figure>
          <figure><svg viewBox="0 0 64 64" width="64" height="64"><path d="M32 8 56 56H8Z" fill="currentColor"/></svg><figcaption>64</figcaption></figure>
          <figure><svg viewBox="0 0 64 64" width="200" height="200"><path d="M32 8 56 56H8Z" fill="currentColor"/></svg><figcaption>200</figcaption></figure>
        </div>
        <ul class="palette">
          <li><span class="swatch" style="background:#2a4bd7"></span>#2A4BD7 primary</li>
          <li><span class="swatch" style="background:#11131a"></span>#11131A ink</li>
        </ul>
        <dl>
          <dt>Geometry</dt><dd>Shapes, grid, strokes.</dd>
          <dt>Type</dt><dd>Symbol only.</dd>
          <dt>Small size</dt><dd>Reads at 16 px.</dd>
          <dt>Risk</dt><dd class="risk">What could go wrong.</dd>
        </dl>
      </article>
      <!-- repeat the card for V2 through V5 -->
    </section>
  </main>
</body>
</html>
```

## After the choice

Once the user picks a version, build the real SVG files from `SKILL.md` step 4
and `references/svg-checklist.md`. Offer to refresh the preview with the final
assets, and never overwrite the user's approved files without permission.
