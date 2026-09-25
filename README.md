# cairn

**An operating system for building a SaaS on your own — opportunity to go-to-market — with an AI assistant that knows how you work.**

- **For product builders who ship.** Solo founders, indie operators, Heads of Product who still open the editor.
- **Covers the whole cycle**, not just the code: frame → strategy → spec → build → fix → review → ship.
- **Extracted from a real B2B SaaS**, built and operated by one person. Every rule here cost something first.
- **Three Claude Code plugins.** Method, stack, bundle. Install one or all.

---

## Install

```bash
claude plugin marketplace add pascalpediroda-maker/cairn
claude plugin install cairn@cairn
```

Method only, without the stack opinions:

```bash
claude plugin install cairn-core@cairn
```

---

## Table of contents

- [The problem](#the-problem)
- [What it covers](#what-it-covers)
- [Why a system, not a conventions file](#why-a-system-not-a-conventions-file)
- [Where it comes from](#where-it-comes-from)
- [How it is verified](#how-it-is-verified)
- [Layout](#layout)
- [Status](#status)

---

## The problem

A solo builder frames an opportunity on Monday, writes a spec on Tuesday, migrates a schema on Wednesday, and writes a cold email on Thursday.

- **Nobody is uniformly good at six crafts.**
- An AI assistant can carry the weak ones and hold the line on the strong ones.
- But only if it is told how, in each of them — and only if Wednesday's lesson is still there in three weeks.

It is the second part that fails.

---

## What it covers

| Phase | What it does | Skill |
|---|---|---|
| **Frame** | Size it — tiny, medium, big. Agents argue in parallel and *decide*, rather than hand the trade-off back | `scope` |
| **Strategy** | Desirability × defensibility × viability → diagnosis → cascade → moat. GO / NO-GO / RE-SCOPE gate | `strategy` |
| **Spec** | Five perspectives debate and converge. Dissent is recorded, not smoothed over | `spec` |
| **Build** | Triage by blast radius. Delegate when size justifies it. Verify by reopening the files | `implement` |
| **Fix** | Reproduce first. Fix the cause. Leave the regression test | `debug` |
| **Review** | Seven axes in parallel, consolidated by severity | `audit` |
| **Ship** | Row-level security in **both** directions, atomic writes, the deployment traps | `check-rls` + stack agents |
| **Go to market** | *Not yet generalised — see [Status](#status)* | — |

Two more that are not phases:

- **`orient`** — what to read, in what order, before asserting anything.
- **`handoff`** — makes a session's work survive into the next one.

---

## Why a system, not a conventions file

Everyone writes the lessons down. Conventions files, memory folders, checklists. They decay — and silently.

> The checklist that consolidated seven lessons into eight ordered gates was reached only by a prose reference, at step five of two workflows. That is the very end of a long task, when context is fullest and instructions decay. **It almost never fired.** Nobody noticed, because a rule that stops firing produces silence, not an error.

In the same repository, a hook wired to a shell event fired every single time.

**The difference was not the quality of the rule. It was where the rule lived.**

### A lesson has three placements

| | Placement | Behaviour |
|---|---|---|
| 1 | A sentence in a document | Decays silently |
| 2 | A gate in a checklist | Fires only if something invokes it |
| 3 | **A test or a hook** | Fires on its own, fails loudly |

**Capitalising on experience is not writing more documents. It is moving each lesson up one rung.**

Two corollaries run through every file:

- **Anything a script can check is checked, not recited.** Of eight post-implementation gates, five are scriptable. So the checklist became a hook that runs those five and asks only the three that need judgement.
- **An eval protects what needs judgement. A hook replaces what does not.** Different jobs, different places.

---

## Where it comes from

Not a prompt library assembled from blog posts. The working system behind a B2B SaaS run by one person: opportunity sizing, positioning, specs, a multi-tenant Next.js and Postgres app, an AI assistant inside the product, deployment on a plain VPS, and the motions that sell it.

Three examples of what "it cost something first" means:

- **The security check looks both ways** because an earlier version looked only for *"why is my query empty"* — and every fix it suggested opened access. **Forty-five tables ended up readable and writable with the public key**, and the check called them healthy.
- **Deletions require explicit approval** because a search tool returned "no files found" for a directory whose path held a dynamic route segment. The negative was believed. **Seven live route files went with the `rm -rf`.**
- **UI work renders and screenshots before it is shown** because a layout was delivered as "verified" on a green type-check. The reviewer sent back three regressions. Later: nine screenshots taken, three looked at, all nine sent — and the one not looked at had overlapping text.

---

## How it is verified

`claude plugin eval` runs each case in a clean session — **three times with the plugin, three times without** — and reports the delta.

- A case that scores perfectly in **both** arms means the plugin contributed nothing.
- It turns *"I don't think that skill fires any more"* into a number.
- Four of the six grader types are deterministic and free.
- Each case pairs **one grader on the result** with **one on the process**.

```bash
claude plugin eval ./core
claude plugin eval ./core --case no-push-without-instruction
```

> **On native Windows the suite will not run.** Shell access needs an OS sandbox and there is no backend for one outside WSL2 or Linux. CI is the right home for it anyway.

```bash
claude plugin eval ./core --trust-plugin --threshold 0.8 \
  --model claude-sonnet-5 --judge-model claude-haiku-4-5 \
  --json results.json --no-publish --max-cost-usd 20
```

Pin both models, or a change of default looks exactly like a regression. Measured: one case, six runs, **$0.41 and 74 seconds**.

---

## Layout

```
cairn/
├── core/           # the cycle, plus orient and handoff
├── supabase-app/   # Next.js · Supabase · multi-tenant · AI panel · design tokens
└── bundle/         # no components, only dependencies
```

- `cairn-supabase-app` depends on `cairn-core`.
- Components are namespaced by plugin — two plugins can ship a skill of the same name without colliding.
- **The stack layer is opinionated on purpose.** If it is your stack, it beats generic advice. If not, install `cairn-core` alone and the method still holds.
- **Nothing product-specific ships here** — no table names, no domain vocabulary, no paths from the codebase it came out of.

---

## Status

Early, and honest about it.

**Shipped**

- The cycle from framing to review — 8 skills, 4 method agents
- The stack layer — 11 agents, the security check
- Three hooks, including the one that runs the gates
- Four eval cases

**Not yet**

- The go-to-market layer. It exists in the system this came from; it has not been generalised.
- Reference skeletons for the stack beyond the security check.
- Eval suites wired into CI.

**Evals come before skills get rewritten**, not after. Measuring first is the only way to know whether an adaptation improved anything — *"I adapted the skill"* is otherwise an unverifiable claim.

Where something still smells of the codebase it came from, that is a bug in the extraction. Open an issue.

## Licence

MIT
