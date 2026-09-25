---
name: implement
description: Build a feature, a change or a fix that is not a one-line edit. Triages the work into three sizes, reads before asking, delegates to specialist agents when the size justifies it, and verifies every delegated delivery by reopening the files. Use when asked to add, change or wire something up — not for diagnosing a reported bug, which is /debug.
---

# Implement

Three sizes, because the cost of ceremony should match the size of the change. A one-file tweak
put through a six-agent pipeline wastes an hour; a schema change made casually costs a week.

---

## Step 0 — Read before asking

Non-negotiable, and it comes before the first question.

1. Locate the zone: search for the feature, the route, the component, the table.
2. Read the files that matter, not a sample of them.
3. Read the project memory for that zone (see `/orient`).

**Then** ask — and only what the code cannot answer. A question whose answer is in a file you
have not opened costs trust, and it is the fastest way to be told to go and read.

## Step 0.5 — The working base

Before writing anything:

```bash
git fetch origin
git status --porcelain
git rev-list --left-right --count HEAD...origin/<default-branch>
```

A dirty tree may belong to another session. **Never `git checkout` over it** — use a worktree.
And if a working tree turns out to hold someone else's work, say so and stop; do not fold it
into yours.

> Two sessions in the same repository, one `cd` that did not persist, and a commit landed on the
> wrong branch carrying another session's uncommitted work under a message that described
> neither. For any git command, pass the directory explicitly (`git -C <path>`) rather than
> trusting the current one — and remember that file edits take absolute paths, so they drift the
> same way and more quietly.

---

## Step 1 — Triage

State the size and why, then proceed. Do not ask permission for TRIVIAL.

| Size | Shape | How it runs |
|---|---|---|
| **TRIVIAL** | one file, under ~30 lines, no new interface | read → edit → done |
| **SMALL** | two or three files, no new table and no new public route | one or two specialist agents, then Step 3 |
| **FEATURE** | new table, new route, several layers, or an unclear blast radius | the full team, orchestrated — see below |

The triage is a claim about blast radius, not about effort. **A new table is never TRIVIAL**,
however few lines it takes.

---

## Step 2 — Delegation, when the size justifies it

Order matters, because each layer consumes the previous one's contract:

```
db-engineer                    (blocking — schema and policies first)
   ↓
backend-dev · devsecops · ai-engineer      (parallel)
   ↓
frontend-dev
   ↓
qa-engineer
```

**The orchestrator is you, not a sub-agent.** This was tried the other way twice and failed the
same way both times: a delegated orchestrator goes quiet between events and the work stalls with
nobody watching. You stay awake, you hold the thread.

Spawn parallel agents **in a single message**. And brief them properly — a careless agent is
usually a careless brief. A good brief carries: the verified facts with `file:line`, the files
they must read, numbered questions, the output format, and what they must **not** do.

---

## Step 3 — Verify what came back

**Non-negotiable, and the reason this step has a number.**

An agent's report is an **intention**, not a proof. Reopen the files. Grep for the thing it said
it added. Run the thing it said it ran.

> A delivery was reported complete, in detail and convincingly. Opening the files showed an
> entire pipeline missing. The report was not dishonest — it described what the agent meant to
> do.

Build the checklist from your own brief, not from their summary, and walk it item by item.

---

## Step 4 — Hand over

The `Stop` hook runs the gates a script can run — lint, types, commit scope, credential-shaped
strings — and states the three it cannot. Answer those three: **what was not tested**, **what the
human must check**, and **the report**.

Commit freely; **push only on an explicit instruction**. A commit is local and reversible; a push
is a deployment and often a surprise for whoever else is working in the repository. Stage named
paths — never `git add -A`, never `git add .`.

---

## What not to do

- **Do not patch a symptom.** If the fix is a time window, a heuristic comparison, a swallowed
  exception, or "we handle it case by case", the cause has not been found. Logic that recurs
  across several call sites belongs in one place, not in each of them.
- **Do not hand an architectural decision back** as an open question. Decide, and justify.
- **Do not re-open a decision already made.** Asking again instils doubt where there was none.
- **Do not green-light yourself** after being told to hold. A constraint stands until it is
  lifted by the person who set it.
- **Do not duplicate before checking.** The thing very often already exists one directory away.
