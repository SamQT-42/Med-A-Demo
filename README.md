# Med-A — interface prototype

A clickable, frontend-only prototype for the RMIT Accessibility Design Contest 2026 mock pitch.

**Find support that fits you.** Explore information, professional support and sensory tools at your own pace.

The centre of the product is a **searchable library**. A scripted assistant helps
people navigate it. It does not diagnose ADHD or any other condition.

> Interactive prototype · Sample data. No backend, no AI, no accounts, no
> transmission of anything to anyone.

## Start it locally

```bash
npm install
npm run dev
```

Open **http://localhost:5173**.

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the build on http://localhost:4173 |
| `npm run verify` | 78 browser checks against the preview server |

Built for 1440×900, and verified to work at 1366×768 with no horizontal scroll.

## Hosted version

A hosted copy of this build is live — the link is in the handover message.

To republish after changing anything (for example after filling in the clinic
details below):

```bash
npm run build:artifact
```

That writes `artifact/` — `index.html` plus `assets/app.js` and
`assets/app.css` — which is what gets published. The build uses a relative
base, so the same `dist/` also drops straight onto GitHub Pages, Netlify or any
static host if the team wants a permanent URL of their own.

## The demonstration sequence

**Explore a work difficulty → read a relevant resource → inspect a support
option → view a sample provider/vendor → save the option or prepare a
workplace request.**

The click-by-click version is in [DEMO_SEQUENCE.md](DEMO_SEQUENCE.md).

## What is on each screen

**Library** — three tabs over one search field.
- *Learn* — six resource cards. Opening one shows a short summary, the source
  link, a scope note, Save, and "Ask about this resource", which hands the
  question to the assistant.
- *Professional support* — four listings, filtered by area, service and
  consultation format. Includes a sample enquiry you can copy; nothing is sent.
- *Sensory pantry* — six options across noise reduction, tactile tools and
  workspace comfort. Products carry an example vendor. A quieter workspace is
  marked as a workplace adjustment, not a product, and offers a request draft
  instead of a vendor.

**Assistant** — two complete scripted paths:
1. *Understanding difficulties* → information, assessment options, or practical support.
2. *Sensory support at work* → tools, a workplace adjustment, or both.

Practical support is reachable without discussing diagnosis first. Free text
works through a small keyword map; anything outside the scripted paths gets an
honest "this prototype demonstrates a few guided conversations" rather than an
improvised answer.

**Saved** — resources, listings, sensory options and drafts saved this session.
No duplicates. Cleared by reload or Reset demo.

## The four annotations, applied

| Your note | What changed |
| --- | --- |
| Header is visual clutter | **There is no header bar.** No breadcrumbs. The persistent prototype badge and Reset demo moved to the foot of the sidebar, visually secondary. Verified: the DOM contains no `header` element. |
| Remove "Talk with a person" from the sidebar | Removed. The sidebar is exactly Library / Assistant / Saved. The human route still exists where it belongs — as an assistant starter that opens the professional support directory. |
| Real clinic data instead of Clinic A/B/C/D | The two organisations you supplied are in the directory, linking to their own websites. See the caveat below. |
| Green → black and white | Fully monochrome. Verified programmatically: no element in the app renders a colour whose RGB channels differ by more than 24. Nothing uses colour alone to carry meaning. |

## ⚠️ One thing needs five minutes from the team

`src/data/providers.ts` contains the two real organisations you asked for:
`tamlyhoasung.com` and `bvdaihoc.com.vn`.

**Neither website could be reached from the build environment** — this session's
network policy blocks both domains. So nothing about them has been verified
beyond the address itself.

Rather than guess, every unverified field renders in the UI as *"To be confirmed
from the official website"*, and each listing links out to the real site. Making
up a location, a service list or a consultation format for a real medical
provider is exactly the kind of fabrication the brief rules out.

To finish them: open each site and fill in the fields marked `UNVERIFIED` at the
top of `src/data/providers.ts`. Leave anything the site does not state as
`UNVERIFIED`. Do not add phone numbers, practitioner credentials, prices,
appointment availability, or any claim of partnership.

The two `Sample Clinic` entries are clearly labelled fictional and exist so the
area / service / format filters can be demonstrated while the real entries are
incomplete. Delete them once real data is in.

## Project layout

```
src/
  types.ts            shared record types + the UNVERIFIED sentinel
  data/resources.ts   six Learn cards
  data/providers.ts   directory — real entries and sample entries  ← needs team input
  data/sensory.ts     six sensory options + three example vendors
  data/script.ts      the scripted assistant: intent map, both paths, fallback
  state/store.tsx     all interaction state, in memory only
  content/copy.ts     persistent UI wording
  styles/tokens.css   every colour, space, font and asset reference
  components/         sidebar, drawer, save button, detail views, request draft
  views/              Library, Assistant, Saved
verify/               the browser walkthrough
```

Colours and spacing live only in `src/styles/tokens.css`; wording lives only in
`src/content/copy.ts`. Swapping the palette or the logo changes no behaviour.

## What was verified

`npm run verify` drives real Chromium through the app: **78 checks, all passing,
no uncaught page errors.**

- App starts; all three Library tabs render; six / four / six records.
- Search filters the active tab; filters combine; empty states appear and
  "Clear filters" restores everything.
- Both scripted paths complete, with the exact wording from the brief.
- Chat recommendations open the same drawers the library uses.
- Saving works, a record cannot be saved twice, removal works, Reset clears it.
- The request draft is seeded, editable and copyable, and no send/submit control
  exists anywhere in the DOM.
- Real listings invent no area, service or format, carry no phone number, and
  state that there is no partnership.
- Practical support is reachable without the diagnosis path.
- Unsupported free text gets the honest fallback, not an improvised answer.
- Across every screen: no claim of anonymity, clinical validation, certification,
  partnership, or any booking confirmation.
- Escape closes drawers and returns focus to the opening control; Tab reaches the
  skip link; every input is labelled; every icon-only button has a name.
- No horizontal scroll at 1366×768, 1440×900, or 683px (200% zoom).
- The theme is monochrome.

## Not in this version

No backend, API, model, authentication, database, payments, live maps,
geolocation, appointment integration or deployment. No manager dashboards,
company analytics or task-management modules. No screening questionnaire,
diagnostic score, or clinical test of any kind.

See [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md).
