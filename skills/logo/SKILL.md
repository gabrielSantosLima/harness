---
name: Logo design
description: Design a logo system for an app or system interactively, presenting five distinct versions before writing any SVG. Use when the user asks to create, redesign or explore a logo, icon, mark, favicon or brand mark.
---

# Logo design

Design a logo system through a short, interactive process. The rule that matters:
**present five distinct versions and get approval before writing any SVG.**

## 1. Understand the project

Ask, or infer from the repository:

- name and one-line purpose;
- audience and tone: technical, playful, premium, minimal, bold;
- existing colors, typography and brand assets;
- constraints: must work at 16 px, single color, dark background, no text;
- where it will appear: app icon, docs header, README, favicon, social preview;
- words, symbols or competitors to avoid.

If the user gives nothing, ask only these four and state the defaults you will
use:

1. What is the product, in one sentence?
2. Who is it for?
3. Which tone: technical, playful, premium or minimal?
4. Any color, symbol or cliché to avoid?

## 2. Offer concept directions

When the user has no idea, present **6 to 8 short directions** before any
drawing. For each:

- name;
- metaphor or construction;
- one or two sentences describing the visual;
- why it fits the product;
- main risk.

Use the starters in `references/concepts.md`. Ask the user to pick one or two,
combine them, or say "surprise me". Do not start the five versions until the
direction is clear.

## 3. Present five versions

Always present exactly **five labeled versions** before creating files:
`V1` to `V5`.

Each version must be genuinely different, not a color swap. Cover at least:

- one symbol-led mark;
- one monogram or letterform;
- one abstract or metaphorical mark;
- one negative-space or minimal mark;
- one wordmark-led or lockup-led direction.

For each version, include:

| Field | Content |
| --- | --- |
| Name | Short, memorable |
| Concept | The idea in one sentence |
| Geometry | Shapes, grid, strokes, proportions |
| Palette | Hex values and roles |
| Type | Wordmark font direction or "symbol only" |
| Small size | How it reads at 16–32 px |
| Risk | What could go wrong |

Present them as a compact comparison table or a short list. Then ask:

- which version to build;
- whether to combine elements;
- whether to run another round.

Do not write SVG until the user explicitly picks a version. If the user insists
on skipping the comparison, present five one-line versions and ask for a choice;
never skip the step silently.

## 4. Build the SVG system

After approval, create:

| File | Purpose |
| --- | --- |
| `logo.svg` | Primary mark, light background |
| `logo-dark.svg` | Dark-background variant |
| `logo-mono.svg` | Single color, `currentColor` |
| `favicon.svg` | Square tile for 16–64 px |
| `logo-wordmark.svg` | Optional horizontal lockup |

Rules:

- Use a square `viewBox` (64×64 or 24×24) with no fixed `width`/`height`.
- Build the mark from paths, not `<text>`.
- For a wordmark, convert letters to paths or document the exact font; never rely
  on an installed font.
- No embedded raster images, external references, scripts or filters that break
  at small sizes.
- Keep strokes consistent and align shapes to a grid. Use round caps and joins
  deliberately.
- Keep each file under ~10 KB and trim excessive decimals.
- Use `role="img"` and a meaningful `aria-label` only when the SVG is a
  standalone image. Decorative marks get an empty `alt`.
- Document the palette and the intended background for each variant.

## 5. Validate

Check the chosen mark:

- at 16, 24, 32, 64 and 200 px;
- in one color and in the full palette;
- on white, black, the primary color and a photo or gradient;
- with and without the wordmark;
- that it does not rely on color alone;
- that it is recognizable without text;
- that it is valid XML and opens in a browser;
- that it does not resemble an existing trademark you know of.

If a variant fails at small sizes, simplify the geometry rather than adding
detail. A logo is not an illustration.

## 6. Integrate only when asked

- Replace the favicon and header mark.
- Add the mark to README files with light/dark `<picture>` variants.
- Add app-icon exports at the sizes the platform requires.
- Never overwrite an existing brand without approval.
- Never commit, push or tag unless the user asks.

## Boundaries

- Never skip the five-version comparison.
- Never trace or closely copy an existing trademark.
- Never ship a raster image or AI-generated bitmap as the final logo.
- Never embed text, fonts, secrets or absolute paths in the SVG.
- Never add a logo to a project without explicit approval.

## References

- `references/concepts.md` — concept starters and when to use each.
- `references/svg-checklist.md` — technical checklist and snippets.
