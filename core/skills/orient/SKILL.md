---
name: orient
description: Read this before working on an area of the codebase you have not just read, and at the start of a session. It says where a project's knowledge lives, in what order to read it, how much to load, and what must never be trusted from memory. Use it when you are about to assert how something works, propose an architecture, or pick up a thread from a previous session.
---

# Orient

A session's context is not memory. It decays, it gets compacted, and it decays **silently** —
nothing tells you that the thing you are confidently recalling was read four hours ago and has
changed since.

So: **re-anchor, do not recall.** This skill says where to re-anchor and in what order.

---

## Four destinations, and everything has exactly one

A project accumulates four kinds of knowledge, and they fail differently when they are mixed.
Keeping them apart is what makes any of them findable later.

| Destination | What goes there | Failure if you put the wrong thing in it |
|---|---|---|
| **`CLAUDE.md`** at the repo root | what is true across the whole project and must be read every session: conventions, hard rules, the shape of the thing | it grows until nobody reads it, and then none of it applies |
| **`.claude/memory/`** | stable facts about a subsystem or a domain, one file per subject, indexed | unindexed files exist but are never routed to, so they may as well not |
| **`.claude/plans/`** | traces of a session: plans, handoffs, working notes. Dated, named for what they contain | treated as durable facts, they contradict the code six weeks later |
| **the session's own memory** | preferences, corrections, lessons from an incident | product facts put here are invisible to everyone else |

**The index is not optional.** `.claude/memory/MEMORY.md` carries one line per file and nothing
else — never content. A memory folder without a current index is a folder whose files are found
by luck.

> Check this early and check it cheaply: list the files in `.claude/memory/`, compare with the
> index, and report anything unlisted. In one real repository, eight files existed that the index
> did not know about — they had been written, and then were never routed to again.

---

## The reading order

**Memory first. The code confirms.** Not the other way round, and not one instead of the other.

1. **`CLAUDE.md`** — always, and first.
2. **The index**, then only the memory files the current task actually touches.
3. **The code**, to confirm what you just read.
4. **The plans folder**, if you are resuming something rather than starting it.

Reading the code first works, but it costs several times more context and it teaches you *what*
without *why* — so you re-derive decisions that were already made and paid for.

---

## Load the minimum, and put a ceiling on it

Loading everything at the start is the most common way to have no room left when it matters.

- **Always**: `CLAUDE.md` and the memory index.
- **Then only what the zone requires.** Touching the database means the database reference;
  touching the interface means the design system; touching deployment means the deployment
  reference. Nothing else.
- **Cap it.** Five reference files before starting is a lot. If you need more than that, the task
  is not scoped yet — scope it first.

---

## What must never be asserted from memory

**Claim nothing beyond the work actually done.** This is the most expensive rule to break,
because a conclusion drawn from partial work closes doors that were open, and the next session
inherits the wall.

- **Say what you read, not what you infer from it.** *"Checked files A through D, no match"* is a
  fact. *"It is not there"* is not.
- **Say by which method a negative was obtained.** A partial scan and a full read are different
  claims, and the words for them already exist — use them in summaries, not only in notes.
- **A conclusion needs full coverage.** Until the window has been read entirely, it stays open,
  and nothing gets built on it — least of all a plan that sends the work elsewhere.
- **A single reading settles nothing.** Not for a name, not for a behaviour.
- **Cite `file:line` for any "here is how it works".** If you cannot cite it, verify it.

And the one that applies to your own turn rather than to the code: **an announced action happens
in the same turn.** Saying *"I will update X"* and then answering something else is the same
failure, pointed at yourself.

---

## Naming, so that the next session finds it

| Pattern | For |
|---|---|
| `<project>-archi-<subsystem>.md` | how one subsystem is built |
| `reference_<topic>.md` | a domain, a convention, a catalogue, a set of traps |
| `<date>-<subject>.md` in `plans/` | a plan or a handoff — **dated and readable**, never a generated random name |

A plan written to a scratch path with a machine-generated name is a plan nobody will open again.
Put it in the repository, name it for what it is, and give the path when you hand it over.

---

## Writing back

The corollary of all this: **when a finding changes something, write it where it will be
re-read** — not where it was convenient to write it.

- A fact about a subsystem goes to its memory file, and its one line goes to the index.
- A lesson from an incident goes wherever it will fire again. Prefer, in this order: a test, a
  hook, a gate in a skill, a sentence in a document. **A sentence is the weakest placement, and
  it is the default one — resist it.**
- **A phrase that has become false gets rewritten, not annotated.** *"…as of last March"* teaches
  nobody anything and makes the reader stumble. Git already records when it changed.
- After a finding, look for what it makes false elsewhere: the absolutes. *"the only"*, *"the
  last"*, *"all we have"*, *"it exists solely through"*.
