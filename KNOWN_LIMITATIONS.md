# Known limitations

## Implemented and verified

Real behaviour, covered by the 78 browser checks in `npm run verify`:

- Library with three tabs, one search field, working filters, and empty states.
- Detail drawers shared by Library, Assistant and Saved, so the same record is
  consistent wherever it appears.
- Two complete scripted assistant paths, plus an honest fallback for anything else.
- Saving with no duplicates, removal, and a session-only Saved section.
- An editable, copyable support-request draft that is never sent.
- Keyboard navigation, focus return from drawers, labelled controls, monochrome
  theme with no colour-only meaning, and reflow down to 683px.

## Simulated

| What you see | What it is |
| --- | --- |
| Assistant replies | Hand-written scripts behind a deterministic intent map. Labelled "Scripted assistant demo" on every message. Not a model. |
| Free-text input | A small keyword map onto the existing paths. Anything it cannot place gets the fallback. |
| "Central area" / "North area" | Sample labels for demonstrating filters. No map, no geolocation, no distance calculation. |
| Sample Clinic A / Sample Centre B | Invented, labelled "Fictional listing". Not contactable. |
| Example Vendor One/Two/Three | Placeholder supplier records. No price, rating, stock or purchase route. |
| Sample enquiry, support-request draft | Text you can copy and send yourself. Nothing is transmitted, and no employer approval is simulated. |
| Saved items | In-memory only, for this browser tab. Not an account, not storage. |

## Not verified — needs the team

**The two real organisations in `src/data/providers.ts`.** Neither website could
be reached from the build environment (network policy blocked both domains), so
only their addresses are asserted. Every other field is marked "To be confirmed
from the official website" in the UI. Five minutes with each site closes this.

## Deliberately absent

- **No diagnosis, screening, scoring or clinical test.** There is no
  questionnaire anywhere in the build.
- No fabricated research findings, quotations, medical reviewers, credentials,
  partner endorsements or certification badges.
- No real phone numbers, prices, appointment availability or booking confirmations.
- No efficacy or medical claim about any sensory option.
- No backend, API, model, authentication, database, payments, live maps,
  geolocation, appointment integration, or deployment.
- No manager dashboards, company analytics or task-management modules.
- The prototype is never described as anonymous, clinically validated, medically
  certified, or connected to real partners.

## Honest next steps

1. Fill in the two real listings from their official websites.
2. Delete the two sample listings once real data covers the filters.
3. Replace the placeholder vendor records with real suppliers, or keep them
   labelled as placeholders.
4. Team artwork goes in `public/assets/`; palette lives in `src/styles/tokens.css`.
