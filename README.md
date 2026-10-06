# Engagement Invitation

A luxury digital invitation: a gatefold opening card, an arched invitation hero,
countdown, event details, venue map, timeline, gallery with lightbox, and an RSVP form.
Built with React, TypeScript, Vite, and Framer Motion.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173
```

`npm run build` creates the production site in `dist/`, and `npm run preview` serves that build.

Add `?open` to the address (for example `http://localhost:5173/?open#rsvp`) to skip the opening card.
This is handy while editing, or for sending someone straight to the RSVP form.

## Personalise it

Everything shown on the page lives in **`src/data/invitation.ts`**. You only need to edit that file.

| What | Where in `invitation.ts` |
| --- | --- |
| Names, parents' names, tagline | `couple` |
| Date, time, venue, address (as displayed) | `event` |
| Exact start time for the countdown and calendar file | `countdownDate` (keep the timezone offset, such as `+05:30`) |
| Order of events | `timeline` |
| Quote, message, RSVP wording | `quote`, `message`, `rsvp` |
| Browser title and link preview text | `meta` |

### Photos

1. Put your images in `src/assets/images/`. Use `gallery/` for the gallery and `couple/` for the two portraits.
2. Reference them by path in `invitation.ts`, for example `photo: "couple/tharani.jpg"` or `{ file: "gallery/09.jpg", alt: "…" }`.

Upload the largest originals you have. The build makes small, medium, and large WebP copies automatically, so phones download only what they need.
Until a portrait photo is set, its card shows an elegant monogram instead.

- `layout` on a gallery photo (`"hero"`, `"tall"`, `"wide"`, `"square"`) controls its shape in the grid.
- `focus` (for example `"center 30%"`) keeps faces in frame.
- The photos currently in `gallery/` are free Unsplash placeholders. Replace them with your own.

### Music

Drop an `.mp3` (or `.m4a`/`.ogg`) into `src/assets/music/` and set `music.file` to its file name.
Until you do, a soft music-box version of Pachelbel's Canon plays. It is generated in the browser, so there is no file to download.
Music starts when a guest taps **Open Invitation**, because browsers block autoplay before a tap. It pauses when they switch tabs.

### Map

The map shows an illustrated preview until `event.address` holds a real address.
Then it switches to an embedded Google Map, and the **Get Directions** button points there too.
If the address doesn't find the right place, set `event.mapQuery` to something Google Maps does find, such as the venue's name and city.

### RSVP responses

As built, the form validates entries and shows the thank-you message, but **responses are not saved anywhere**.
To collect them, set `rsvp.endpoint` to any URL that accepts a JSON `POST`. Formspree, a Google Apps Script web app writing to a Google Sheet, or your own API all work.
Each response includes `name`, `phone`, `attending`, `guests`, `message`, and `submittedAt`.

### Look and feel

- Colours and fonts are design tokens at the top of `src/styles/base.css`.
- `--photo-grade` gives every photo a gentle warm grade so it sits in the ivory palette. Set it to `none` to show original colours.
- Leaf, flower, and ornament colours are in `src/styles/botanicals.css`.

## Deploy (Vercel, Netlify, any static host)

The site is fully static. Vercel detects it as a Vite project: the build command is `npm run build` and the output folder is `dist`.
After deploying, set `meta.siteUrl` to the final address so WhatsApp and other apps show the preview photo (`public/og-image.jpg`).

`@img/sharp-win32-x64` is listed under `optionalDependencies` on purpose.
It is the Windows build of the image optimiser, so Linux build servers skip it and use their own build from the lockfile.

## Project layout

```
src/
  data/invitation.ts      ← all content
  components/             ← one file per section, plus decorations/Botanicals.tsx (SVG olive branches)
  hooks/                  ← countdown, music, active section, scroll lock
  lib/                    ← images, maps, calendar (.ics), music engine
  styles/                 ← tokens + section styles (plain CSS)
  assets/images|music/    ← your photos and song
public/                   ← favicon, link-preview image
```
