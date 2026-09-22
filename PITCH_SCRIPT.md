# Med-A — pitch defence brief

For the person answering technical questions. `DEMO_SEQUENCE.md` is the click
path; this is what to say around it.

---

## 0. If you only get one answer

> "Med-A is a searchable library of neurodiversity support — information,
> clinics, and sensory tools — with a guided assistant that helps you navigate
> it. The prototype is a React and TypeScript single-page app with two
> dependencies and no backend, so it runs anywhere in about four seconds. What
> we're proving in this round is the interface and the information design, not a
> service."

---

## 1. Tech stack

**The 30-second answer:** React 19 and TypeScript, built with Vite. Plain CSS
with one token file. Two runtime dependencies — `react` and `react-dom`. No
backend, no database, no authentication, and no AI in this build.

### Numbers you can state, because they're verifiable

| | |
| --- | --- |
| Runtime dependencies | **2** (react, react-dom) |
| Total packages installed | 41 |
| Source | 17 files, ~2,200 lines of TypeScript |
| Production bundle | **83 KB gzipped** (262 KB JS + 12 KB CSS raw) |
| Build time | ~4 seconds |
| Runtime network calls | **zero** — runs fully offline |
| Automated browser checks | **78**, all passing |

### Why these choices — this is the part judges actually score

- **Vite, not Next.js.** We need a static bundle, not a server. Next would add a
  Node runtime we don't use and can't deploy as simply.
- **Two dependencies on purpose.** Every dependency is something that can break
  the morning of a pitch. A component library would have saved a day of CSS and
  cost us control over contrast, focus states, and the monochrome constraint.
- **TypeScript is doing real work, not decoration.** Our honesty rules are in the
  type system rather than in comments:
  - `UNVERIFIED` is a literal-typed constant, so an unverified clinic field has a
    *representation* instead of being an empty string that renders as nothing.
  - `kind: 'product' | 'adjustment'` is a discriminated union, so "a workplace
    adjustment has no vendor and offers a request draft instead" is enforced by
    the compiler, not by an `if` somebody can forget.
- **`useReducer` + Context, not Redux or Zustand.** One reducer, about fifteen
  actions. A state library at this size is ceremony.
- **In-memory state on purpose.** Reload resets everything. No storage means no
  consent question, no retention question, and a demo that cannot get stuck in a
  bad state mid-pitch.

---

## 2. User flow

Three sections in the sidebar: **Library, Assistant, Saved.** The library is the
product; the assistant is a way into it.

**Demo path:** explore a difficulty → read a resource → inspect a support option
→ view a provider or vendor → save it, or draft a workplace request.

### Two flow decisions worth defending

1. **Practical help does not require the diagnosis conversation.** Most products
   in this space front-load a screening quiz. Ours has no quiz at all, and the
   assistant says so out loud.
2. **One record, one drawer, everywhere.** Whether you reach a clinic from the
   library, from chat, or from Saved, it is the same component reading the same
   record. That is *why* the information stays consistent — it isn't three
   screens kept in sync by discipline.

---

## 3. Pain points — say these as hypotheses, not findings

1. **"I googled my symptoms and got a quiz and three ads."** Searching this topic
   is adversarial. Med-A is a small curated library where every card names its
   source and states how far it applies — and nothing in the product diagnoses.
2. **"I'm struggling, but I'm not ready to call it a condition."** Support is
   usually gated behind identifying as a patient. We put practical help ahead of
   diagnosis and never require the latter.
3. **"I don't know what to ask."** Every provider listing carries *questions to
   ask before arranging an assessment*, plus a sample enquiry you can copy. That
   is the concrete thing someone walks away with.
4. **"Asking for help at work makes me look incapable."** The request draft gives
   wording that stays about the work, not about the person — and it is editable,
   because we are not putting words in anyone's mouth.
5. **"Is this for me, or is it selling me something?"** Sensory items are
   described by preference — "for people who prefer a lower level of background
   sound" — never by condition. No prices, no ratings, no efficacy claims.

**State the evidence base honestly:** one ADHD participant interview and one
industry expert conversation on 22 September. These are design hypotheses, not
validated findings. The prototype exists to test them.

---

## 4. As a technical judge — delivery and deployment

### How it ships

A static single-page app. `npm run build` emits `dist/` — three files. The build
uses a relative base, so `dist/` drops onto any static host with no config:

- **GitHub Pages** — free, straight from the repo, one workflow file.
- **Netlify / Vercel / Cloudflare Pages** — drag the folder in.
- **A USB stick.** It runs from `file://`. No server required.

**Risk profile:** no secrets, no environment variables, no backend, no database,
no runtime network calls. There is nothing to misconfigure and nothing to leak.
For a health-adjacent product, that is not a small thing.

### How easy is it to run

```bash
git clone <repo>
npm install     # 41 packages
npm run dev     # http://localhost:5173
```

Two commands after clone. Node 18+. Cold build about four seconds.

And `npm run verify` runs 78 browser checks against the built app. If a judge
asks "how do you know it works" — that is the answer, and you can run it live.

### What I would push on, if I were judging

- It is a UI over fixtures. The hard problems — sourcing and maintaining the
  directory, content governance, data protection — are all ahead of you.
- Two of four clinic listings are real but unverified. Honest, but incomplete.
- With no backend there is no story yet for accounts, persistence, content
  updates without a redeploy, or analytics.

Know these before they say them. Naming your own weakness first is worth more
than defending it afterwards.

---

## 5. Questions and counters

### Q1 · "This is just a frontend with hardcoded data. What's technically hard here?"
*Testing whether you understand your own build.*

> "You're right that nothing here is computationally hard, and we chose that
> deliberately for this round. The hard part in this product isn't rendering,
> it's the information rules — what the product is allowed to claim, and making
> that structural rather than a promise. That's why the unverified-field sentinel
> and the product-versus-adjustment split are enforced by the type system. The
> backend is next round's work, and I'd rather show you a defensible interface
> than a half-built API."

### Q2 · "Why not just use ChatGPT for this?"

> "Because the failure mode matters more than the capability. A general model
> asked 'do I have ADHD' will produce something that reads like an answer. Our
> assistant is scripted precisely so it can't — it says it cannot determine that,
> and routes you to information or to a clinician. We've already prototyped the
> validator for when we do add a model: it rejects a draft containing clinical
> language, and rebuilds task facts from the user's own notes so the model can't
> invent one."

### Q3 · "The assistant is scripted. Isn't that faking the product?"

> "It's labelled 'Scripted assistant demo' on every single message, and off-script
> input gets told the truth instead of an improvised answer. We'd rather show a
> demo that's honest about what's simulated than one that quietly implies a model.
> The scripts are also the specification — they're the exact conversations we'd
> want a real model to have."

### Q4 · "How do you keep the library accurate and current?"

> "Today it's a typed fixture file, so updating content means a redeploy. That's a
> real limitation and it's in our known-limitations doc. The structure is already
> right for a CMS — every record has an id, title, summary, source name, source
> URL and scope note. The next step is moving those behind an editor with a named
> human reviewer per record. We deliberately did not fake a review process: every
> card says 'prototype summary based on public guidance', because claiming a
> clinical reviewer we don't have would be the worst thing we could do."

### Q5 · "You list two real clinics. Did you get permission? Is that data correct?"
*The sharpest question in the set. Do not bluff.*

> "We list them the way a directory does — name and official link — and the card
> states we have no relationship with them. Every field we couldn't verify says
> 'to be confirmed from the official website' rather than being filled in. We
> couldn't reach either site from our build environment, so rather than guess at
> their services we left it visibly incomplete. Before any public launch a
> directory listing needs their consent and a verification process. That's on the
> roadmap, not in this build."

### Q6 · "Health data in Vietnam. What's your privacy story?"

> "In this build the question doesn't arise: no backend, no account, no storage.
> State lives in the browser tab and is gone on reload. That's not a privacy
> architecture, it's the absence of one — and it's the honest position for a
> prototype. A real version stores personal reflections, which needs a lawful
> basis, residency, retention limits and deletion under Vietnam's personal data
> protection rules. We'd design for data minimisation first: the library and the
> directory need no personal data at all, so the only thing needing protection is
> saved items and drafts."

### Q7 · "Who pays for this?"

> "We haven't validated a model and I won't invent one. Three plausible payers:
> employers buying it as a workplace tool, clinics paying for directory placement
> — which we'd be cautious about, because paid placement corrupts a directory —
> or a public-health or university partnership. Our expert conversation pointed at
> employers, because the cost they feel is training and turnover."

### Q8 · "How much of this did AI write?"

> "A lot of the code, and I'll be specific about what that means. The architecture
> decisions, the honesty constraints and what the product refuses to do are ours;
> those are the parts we can defend line by line. The 78 automated checks exist
> precisely so that 'AI wrote it' doesn't mean 'nobody verified it'. Ask me about
> any file and I'll tell you why it's shaped that way."

### Q9 · "What's your biggest technical risk?"

> "Content governance, not code. The moment this carries real clinic data and real
> summaries, we need a named reviewer, a review date, and a process for removing
> something that becomes wrong. That's an organisational problem, and it's harder
> than anything in the frontend."

### Q10 · "Show me that it doesn't diagnose."
*Answer with a click, not a sentence.*

Assistant → **"Could my difficulties be related to ADHD?"** → read the reply off
the screen. It says it cannot determine that, then offers three routes.

### Q11 · "What if the wifi dies?"

> "It doesn't matter. The app makes zero network requests at runtime — it runs
> from a local build, offline."

### Q12 · "Accessibility — you're in an accessibility contest."

> "Keyboard first: Tab reaches a skip link, Escape closes drawers and returns
> focus to the control that opened them, every input is labelled, every icon-only
> button has an accessible name. Nothing uses colour alone to carry state, which
> is partly why the theme is monochrome. It reflows to 683 pixels, which is 200%
> zoom at 1366. All of that is in the automated checks, not just claimed."

---

## 6. Lines to avoid

Never say:

- **"anonymous"** — you have no anonymity guarantee.
- **"clinically validated"**, **"certified"**, **"reviewed by"** — you have none.
- **"our partner clinics"** — you have no partners.
- **"AI-powered"** — there is no AI in this build.
- Any promise of a diagnosis or referral pathway you don't have.

And the strongest answer you have when cornered:

> "I don't know — that's in our known-limitations doc."

In an accessibility contest, judges reward calibration. A team that knows the
edge of its own evidence is more credible than one that answers everything.
