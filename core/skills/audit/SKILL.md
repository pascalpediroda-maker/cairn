---
name: audit
description: >
  Run a full, multi-axis audit of a codebase. Claude itself acts as Audit Orchestrator and
  coordinates specialized auditors across up to seven axes — security, performance, tests, UI
  consistency, AI-agent quality, code quality, and architecture & observability — then produces a
  consolidated, severity-ranked report with a prioritized action plan. Use when the user wants to
  audit the code, check quality, prep for a release, or says things like "audit this", "check the
  code", "is this clean", "code quality", "give me a full review".
---

# Skill: Audit

## Why this skill exists

A quality audit spans axes that are largely independent — security, performance, test coverage,
UI consistency, AI-agent quality, code cleanliness, architecture & observability conformance —
each needing different expertise. No single agent covers all of them in depth. This skill has
**Claude itself** orchestrate several specialized auditors in parallel, then consolidates their
reports into a prioritized action plan.

## Architectural principle — Claude = Audit Orchestrator

**The main Claude thread orchestrates directly.** It spawns the auditors, receives their reports,
consolidates, prioritizes, and delivers. No orchestrator sub-agent in between — an intermediate
layer just adds a hop that can go idle between events.

## The seven auditors

Adapt the exact roster to whatever specialized auditor agents the project has available. A common
split, and the one this skill assumes by default when an agent of that name exists:

| Axis | Role | Model (default) |
|------|------|------------------|
| **Security** | OWASP Top 10, auth, access control, XSS, headers | **opus** |
| **Performance** | Bundle size, queries, framework patterns, API latency | sonnet |
| **Tests** | Coverage, test quality, untested critical paths | sonnet |
| **UI Consistency** | Design-system adherence, locale/copy consistency | sonnet |
| **AI Agents** | Prompts, temperature, tool config, anti-hallucination, compliance | **opus** |
| **Code Quality** | Dead code, refactor candidates, duplication, inconsistencies | sonnet |
| **Architecture & Observability** | Multi-tenant isolation, real-time, API conventions, server/client boundaries, logging | **opus** |

If the project only has some of these auditor agents, run only those — don't invent an agent that
doesn't exist. A generic auditor can also be pointed at a single axis with a tight brief if no
specialized agent exists for it.

### Model tiering — delegate the mechanical, keep judgment expensive
Cost isn't uniform. Axes that are **reasoning-heavy** — tracing a security exploit chain,
multi-tenant isolation (including any LLM context leakage), prompt/agent design quality — carry a
high cost for a false negative → **opus**. Axes that are mostly **scanning/pattern-matching** —
test inventory, design-system lint, dead-code grep, query/bundle checks → sonnet is enough. Use
high reasoning effort on every auditor by default (audit correctness matters more than audit
speed); the consolidation pass (you) runs on the session's own model.

**Overrides the requester can ask for**: "opus everywhere" (more expensive, maximizes recall on
every axis); a single axis on a different, unusually strong model for one hard pass — but be aware
some safety classifiers can false-positive on security-audit content itself, so reserve that for
non-security axes. If the requester names a model explicitly, it overrides this table.

## Workflow — what Claude does

### Step 0 — Pick the right audit base (MANDATORY before spawning anything)

An audit is only as good as its base. **The reference code is the project's trunk branch**
(`main`/`master` — whatever everyone else's work is measured against). Never blindly audit
whatever branch happens to be checked out: it can be stale and/or full of uncommitted WIP, which
produces false findings (files that moved since, local scratch files that don't exist in
production).

Before Step 1, check:
```bash
git fetch origin --quiet
git rev-list --left-right --count origin/<trunk>...HEAD   # left = behind, right = ahead
git status --porcelain | wc -l                             # uncommitted files
```
- **Branch is current and clean** (behind ~0, little/no uncommitted work) → audit the current
  branch, that's fine.
- **Branch is stale (behind by more than a few commits) OR the working tree is dirty (dozens of
  uncommitted files)** → **do NOT** `git checkout <trunk>` (risks losing the WIP). Create a
  **clean worktree on `origin/<trunk>`** and point every auditor at it (pass its absolute path in
  each prompt). Clean up the worktree afterward (`git worktree remove`).
- If the requester explicitly wants a specific branch/PR audited (e.g. pre-merge), audit that
  one — but say so.

**Always state, in the final report, which base (branch + commit) the audit ran against.**

### Step 1 — Spawn the auditors in parallel

In **a single message** with one `Agent` call per axis. Pass `model` per the tiering above (unless
overridden), and repeat the **audit base decided in Step 0** in every prompt (the worktree path if
auditing the trunk):

```
Agent(subagent_type: "audit-security",       model: "opus",   prompt: "[base + audit scope]")
Agent(subagent_type: "audit-architecture",   model: "opus",   prompt: "[same]")
Agent(subagent_type: "audit-ai",             model: "opus",   prompt: "[same]")
Agent(subagent_type: "audit-performance",    model: "sonnet", prompt: "[same]")
Agent(subagent_type: "audit-tests",          model: "sonnet", prompt: "[same]")
Agent(subagent_type: "audit-ui",             model: "sonnet", prompt: "[same]")
Agent(subagent_type: "code-quality-auditor", model: "sonnet", prompt: "[same]")
```

### Step 2 — Consolidation (Claude)

Claude receives the reports and consolidates into a single one:
- **Executive summary** (findings by severity: CRITICAL / WARNING / INFO)
- **Top 10 priority actions** (across all axes)
- **Detail per axis** (security / perf / tests / UI / AI / code quality / architecture &
  observability)
- **Action plan in waves** (security first, then perf + UI, then tests)

### Step 3 — Present the result

Present the consolidated report. STOP. Wait for a decision before acting on it.

## Modes of use

### Mode 1: Full audit (default)
Runs every available auditor. Takes several minutes. Exhaustive report.

### Mode 2: Targeted audit
If the requester names one axis ("audit security", "audit perf"), run **only** that auditor and
produce a single-axis report.

### Mode 3: Audit + fix
If the requester says "audit and fix it", chain:
1. Audit phase (as Mode 1).
2. Fix phase: hand the findings to the project's implementation skill/workflow, fixing by wave
   (security first).

## Rules
- Report privately-relevant findings without naming real customers/clients or other people, even
  when the codebase itself contains such names.
- Act, don't ask, when a fix is obvious and low-risk; flag and wait when it isn't.
- A finding is what an auditor actually read, not what a lint tool implied — the same rule that
  governs the code-quality axis applies to every axis: open the file, don't trust the grep hit
  alone.
