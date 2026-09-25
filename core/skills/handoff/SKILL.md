---
name: handoff
description: Write a plan or a handoff that another session — or the same one after a compaction — can actually pick up. Covers where the file goes, how it is named, what belongs in it and what does not. Use when finishing a chunk of work that will be resumed later, when splitting work across parallel sessions, or when a plan needs to be reviewed before implementation.
---

# Handoff

A handoff exists so that the next session does not re-derive what this one already established.
It fails in three ways, and only one of them is about the writing.

---

## Where it goes

**`<repository>/.claude/plans/`.** In the repository, committed, next to the code it describes.

Not in a scratch directory. Not in a temporary folder. Not at whatever path a tool proposed.

> A plan was written to a machine-generated path outside the project, with a random name, and
> then offered for review. The reply was: *"asking me to approve a plan that's who-knows-where"*
> — and the objection was right. A plan the reader cannot open is not a plan.

If a tool writes the plan somewhere else first, **copy it into the repository before asking
anyone to read it**, and give that path in the message.

## How it is named

`<YYYY-MM-DD>-<what-it-is>.md` — dated, and readable by someone who has not met it.

`2026-09-25-billing-migration.md` is a name. `polymorphic-juggling-chipmunk.md` is an identifier
that tells the reader nothing, and it will be opened by nobody.

---

## What goes in it

**Context first, and it answers "why", not "what".** What problem this addresses, what prompted
it, what the intended outcome is. A plan whose reader does not know why it exists gets
second-guessed at every step.

Then, in this order:

1. **Decisions already taken**, in a table, with the reason in one line. This is the part that
   saves the most time, because it is the part that otherwise gets re-litigated.
2. **The recommended approach only.** Not the alternatives you rejected — one line naming what
   you rejected and why is enough. A plan that presents three options presents none.
3. **The critical files**, by path. For a change that repeats across many files, describe the
   pattern once and name three representatives; do not enumerate forty.
4. **Existing code to reuse**, with paths. The most common waste is rebuilding something that
   was two directories away.
5. **How to verify it end to end** — the actual commands, and what a failure looks like.
6. **What is not settled**, honestly, with what it depends on.

## What stays out

- **The story of the research.** What you tried, what you believed, the false leads. It belongs
  in the session's own notes. It is the single largest source of plan bloat, and it goes stale
  faster than anything else in the file.
- **Numbers that drift.** "756 people" becomes wrong the same week and is then worse than no
  number: it looks precise. Write what is invariant; count at read time.
- **Timestamps hung on claims.** *"…as of the 14th"* dates your last look, not the fact.

---

## Resuming from one

- **Execute it, do not re-survey.** A settled plan gets built. Re-mapping the ground it already
  covered is the most expensive way to look diligent.
- **Read it in its order.** Something added at the end as "less urgent" comes after the plan, not
  instead of it.
- **Separate what is waiting on a person.** A handoff that mixes "to build" and "waiting on an
  answer" stalls on the first blocked item. Two lists.

---

## Before handing it over

Say where it is. In full, on its own line, so it can be opened in one gesture:

```
<repository>/.claude/plans/2026-09-25-billing-migration.md
```

And if the work is not finished: say what is done, what is not, and what you would do next — in
that order. **A handoff that only describes the destination leaves the next session to work out
where it currently stands**, which is exactly the cost it was written to avoid.
