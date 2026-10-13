# Percoso Post Studio v1.0

A standalone, local React + Vite tool for turning reviewed Italian exercises into **three consistent 1080 × 1350 Instagram carousel slides**.

## Install

Place this folder anywhere inside your Percoso repository, for example:

```
percoso/tools/instagram-studio/
```

Requires Node.js 20.19+ or 22.12+ (for Vite 6, Node 18+ also works in many environments; Node 20 LTS is recommended).

From this folder run:

```bash
npm install
npm run dev
```

Open the local address printed by Vite (typically http://127.0.0.1:5173).

## Workflow

1. Start with the included Challenge #001.
2. Replace the JSON in the left editor with your reviewed exercise content.
3. Click **Update preview**. The editor validates the JSON and reports errors.
4. Review the Challenge, Answers, and Grammar Tip tabs.
5. Click **Export all 3 PNGs**. Your browser downloads three separate 1080 × 1350 images.
6. Upload all three to **one** Instagram post using Instagram's multiple-image selection. Instagram creates the carousel automatically.
7. Click **Copy** to copy the Instagram caption.

**Note:** Some browsers ask permission for multiple downloads. Allow them for your local studio. Use Chrome or Edge if your browser has trouble exporting. The first export may take a moment to load web fonts. The design also has local font fallbacks for offline use.

## Content format

See `src/sample.json`. Each exercise includes:
- `challengeNumber`, `level`, `activity`, `headline`, `instruction`
- `questions`: 1–5 objects with `prompt`, `answer`, and `note`
- `tipTitle`, `tipIntro`, `tipRows`: 1–5 objects with `form`, `meaning`, and `example`
- `caption`

The sample JSON is illustrative, not the native Percoso exercise schema. The v1 template is designed for **short fill-in-the-blank challenges**. Keep sentences short enough to fit. For long dialogues or other activity types, add dedicated templates rather than overloading this layout.

## Brand consistency

All colours, spacing, shapes, typography and slide layouts are defined in `src/styles.css`. The `Brand` component in `src/App.tsx` currently draws a **stylised Percoso text/logo mark** in CSS; replace it with your official SVG/PNG asset once available.

The slide HTML is rendered at its actual export size, **1080 × 1350**, and scaled down only for the editor preview. All three exports share the same master styling.

## Development

```bash
npm run build
```

This tool has no backend, database, account system or publishing integration. It runs locally; JSON is only held in browser memory until you export or copy it. Save your exercise JSON elsewhere if you want a reusable archive.
