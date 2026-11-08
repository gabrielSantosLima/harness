# SVG checklist

## Structure

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" role="img" aria-label="Name">
  <g stroke-linecap="round" stroke-linejoin="round" stroke-width="4.5">
    <path d="..." stroke="#2A4BD7"/>
  </g>
</svg>
```

- Square `viewBox`; no fixed `width` or `height`.
- Paths, not `<text>`, for the mark.
- `currentColor` for the monochrome variant.
- No `<image>`, `<script>`, external `href`, filters or masks that fail at 16 px.
- Keep stroke caps and joins consistent.
- Trim decimals to two places unless precision requires more.
- Keep each file under ~10 KB.

## Required variants

| File | Background | Color |
| --- | --- | --- |
| `logo.svg` | light | full palette |
| `logo-dark.svg` | dark | lightened palette |
| `logo-mono.svg` | any | `currentColor` |
| `favicon.svg` | tile | high contrast, simplified |
| `logo-wordmark.svg` | light/dark | optional lockup |

## Favicon

- Use a filled rounded square or a high-contrast mark.
- Remove detail that disappears below 32 px.
- Keep at least 1 px of padding per side at 16 px.
- Do not rely on thin strokes.

## Accessibility

- Standalone image: `role="img"` plus `aria-label`.
- Decorative: empty `alt` when embedded in HTML.
- Contrast: do not rely on color alone; test grayscale.
- Avoid flashing, animation or motion in the logo.

## Test matrix

| Size | Check |
| --- | --- |
| 16 px | Still recognizable; no muddy gaps |
| 24 px | Favicon and toolbar |
| 32 px | App icon preview |
| 64 px | Docs header |
| 200 px | README and social |

Also test on white, black, the primary color and a busy background.

## Integration snippets

HTML header:

```html
<picture>
  <source srcset="logo-dark.svg" media="(prefers-color-scheme: dark)">
  <img src="logo.svg" alt="" width="26" height="26">
</picture>
```

README:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://example.com/logo-dark.svg">
  <img src="https://example.com/logo.svg" alt="Name" width="112" />
</picture>
```

## Final check

- [ ] Five versions were presented and one was approved.
- [ ] All required variants exist.
- [ ] Valid XML and renders in a browser.
- [ ] Readable at 16 px.
- [ ] Works in one color.
- [ ] No trademark resemblance.
- [ ] No text, external fonts or raster inside the SVG.
- [ ] Integration approved by the user.
