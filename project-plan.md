# Project Plan for vibe-code-prject-plan-website

**Projektbeskrivelse:**
Dette er et Next.js projekt oprettet med `create-vibe-code-app`, optimeret til AI-drevet udvikling.

> **Når du har gennemført et punkt, skriv "✅" i starten af linjen. Brug AI-assistenten til at generere kode, konfigurationsfiler eller tests efter behov.**

## 1. Product Vision

✅ Enable anyone to turn a rough idea into a concise, shareable project-plan (in Markdown) in under one minute—no sign-up, no friction.

---

## 2. Scope of the MVP

| In-Scope                                                                                                                                                                                                                                                                                                                                                 | Out-of-Scope                                                                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ Single-page web app (SPA) with one input field and "Generate plan" CTA. <br>✅ AI refinement of the user's idea into a project plan (.md). <br>✅ Display of generated plan with syntax highlighting. <br>✅ Download `.md` file + copy-link button to a unique URL. <br>✅ Stateless unique URL (encodes plan data in the URL fragment, so no DB needed). | • User accounts / login.<br>• Versioning or editing after generation.<br>• Databases or file storage.<br>• Team collaboration features.<br>• Analytics dashboard (can be Phase 2). |

Tech stack suggestion:

* ✅ **Frontend:** Next.js + React, TailwindCSS, Remark for Markdown rendering.
* ✅ **Serverless backend:** Next.js API routes calling OpenAI.
* ✅ **Unique URL:** gzip-then-Base64 the Markdown, append in `#/p=<encoded>`; client decodes.

---

## 3. Detailed User Stories & Acceptance Criteria

### 3.1 Landing & Idea Input

| ID        | User Story                                                                                      | Acceptance Criteria                                                                                                              |
| --------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **✅ US-01** | As a **visitor**, I want to instantly understand what the site does so that I decide to try it. | ✅ Hero headline "Turn any idea into a project plan in 60 seconds." <br>✅ One-sentence value prop. <br>✅ Clear single CTA button. |
| **✅ US-02** | As a **visitor**, I want a single input box where I can paste or type my idea.                  | ✅ Input supports min 20 / max 1 000 chars. <br>✅ Shows live character count and gentle warning at 80 % limit.                    |

### 3.2 AI Generation

| ID        | User Story                                                                                | Acceptance Criteria                                                                                                                                                                                        |
| --------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **✅ US-03** | As a **user**, I want the site to refine my idea into a structured Markdown project plan. | ✅ On "Generate" click, a loading spinner appears. <br>✅ Serverless function returns valid Markdown with at least: Goal, Scope, Milestones, Risks, and Next Steps sections. <br>✅ Response time < 15 s P95. |
| **✅ US-04** | As a **user**, I want helpful feedback if generation fails.                               | ✅ If API error, show error toast with retry option.                                                                                                                                                        |

### 3.3 Result Display

| ID        | User Story                                                       | Acceptance Criteria                                                                                                                 |
| --------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **✅ US-05** | As a **user**, I want to read the plan nicely formatted.         | ✅ Markdown rendered with headings, bullet lists, and code block styling.                                                            |
| **✅ US-06** | As a **user**, I want to copy or share a unique URL to the plan. | ✅ "Copy link" button copies `https://projectplan.xyz/#/p=<hash>`. <br>✅ Visiting that URL reproduces the rendered plan client-side. |
| **✅ US-07** | As a **user**, I want to download the plan as a `.md` file.      | ✅ "Download .md" triggers file download with filename `project-plan-<timestamp>.md`.                                                |

### 3.4 Non-Functional

| ID        | User Story                                                      | Acceptance Criteria                                                                   |
| --------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **✅ NF-01** | As a **product owner**, I need the site to load fast worldwide. | ✅ First Contentful Paint < 2 s on 4G.                                                 |
| **✅ NF-02** | As a **user**, I expect accessibility best practices.           | ✅ Passes WCAG AA color contrast; input & buttons keyboard-navigable and ARIA-labeled. |

---

## 4. Epics → Tasks Breakdown

| Epic                             | Key Tasks                                                                         | Owner          | Estimate | Status |
| -------------------------------- | --------------------------------------------------------------------------------- | -------------- | -------- | ------ |
| **✅ E1 – Frontend UI**             | ✅ Wireframes → Tailwind components → Input validation → Markdown viewer component   | FE dev         | 3 d      | DONE   |
| **✅ E2 – AI Service**              | ✅ Draft prompt template → Implement Next.js API route → Error handling → Unit tests | Full-stack dev | 3 d      | DONE   |
| **✅ E3 – Stateless Link Encoding** | ✅ Proof-of-concept gzip+Base64 → Encode on generation → Decode on page load         | Full-stack dev | 1 d      | DONE   |
| **E4 – DevOps & Deploy**         | CI pipeline (GitHub Actions) → Vercel/CF Pages deploy → Domain + HTTPS            | DevOps         | 1 d      | TODO   |
| **✅ E5 – QA & Accessibility**      | ✅ Cross-browser tests → Lighthouse audit → Keyboard nav                             | QA             | 1 d      | DONE   |
| **✅ E6 – Launch & Docs**           | ✅ Landing copy → Privacy note → README & FAQ                                        | PM + Designer  | 1 d      | DONE   |

**Total effort:** \~10 calendar days with a 2-person squad.

---

## 5. Risks & Mitigations

| Risk                         | Likelihood | Impact | Mitigation                                                                      |
| ---------------------------- | ---------- | ------ | ------------------------------------------------------------------------------- |
| ✅ OpenAI latency spikes        | Med        | Med    | ✅ Show engaging loading animation; allow retry.                                   |
| ✅ URL length limitation (2 kB) | Low        | High   | ✅ Limit output to \~8 KB Markdown → \~1.5 KB gzip-Base64, safe for most browsers. |
| Abuse / excessive usage      | Med        | Med    | Basic rate-limit per IP via Cloudflare.                                         |

---

## 6. Success Metrics

1. **Generation success rate:** ≥ 95 %
2. **Avg. time to plan:** ≤ 12 s
3. **Share-link clicks / session:** ≥ 1.3
4. **Return visits within 7 days:** ≥ 15 %

---

## 7. Timeline (Gantt-like)

| Week   | Mon                  | Tue                    | Wed            | Thu               | Fri              |
| ------ | -------------------- | ---------------------- | -------------- | ----------------- | ---------------- |
| **W1** | ✅ Kick-off, wireframes | ✅ Frontend build         | ✅ Frontend build | ✅ API route      | ✅ AI prompt tuning |
| **W2** | ✅ Link-encoding + QA   | ✅ Accessibility & polish | Beta deploy    | Buffer / bug-fix  | 🚀 Launch        |

---

---

**AI-Assistant Instructions:**
- ✅ Læs denne plan fra top til bund
- ✅ Implementer punkterne sekventielt
- ✅ Spørg om præciseringer hvis noget er uklart
- ✅ Marker færdige punkter med ✅
- ✅ Fokuser på moderne best practices og ren kode 