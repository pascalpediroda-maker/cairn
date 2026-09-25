# cairn

> *A cairn is a stack of stones marking a route across ground where the path isn't obvious.
> Every stone was placed by someone who nearly lost it.*

**A working system for AI-assisted development, built from lessons that were paid for once.**

Three Claude Code plugins. The first carries method, independent of any stack. The second carries
one opinionated architecture — Next.js, Supabase, multi-tenant workspaces, an AI assistant panel,
a design system. The third is a bundle that installs both.

---

## The problem this solves

Working with an AI assistant on a real codebase produces a steady stream of hard-won lessons.
*Never conclude a directory is empty from a failed search. Never assert product behaviour without
reading the code. A type-check passing tells you nothing about what the page looks like.*

The usual response is to write them down — a conventions file, a memory folder, a checklist. And
they decay, silently, in a way that is easy to miss:

> The checklist that consolidated seven separate lessons into eight ordered gates was referenced
> in prose, at step five of two workflows — that is, at the very end of a long task, exactly when
> context is fullest and instructions decay. It almost never fired. Nobody noticed, because a
> rule that stops firing produces silence, not an error.

Meanwhile, in the same repository, a small hook wired to a shell event fired every single time.
It read which files had actually changed, and spoke only when they touched a zone it cared about.

The difference was not the quality of the rule. It was where the rule lived.

---

## The principle

**A lesson has three possible placements, from weakest to strongest.**

| | Placement | Behaviour |
|---|---|---|
| 1 | A sentence in a document | Decays silently. Nobody notices it stopped being read. |
| 2 | A gate in a checklist | Fires only if something invokes it. |
| 3 | **A test or a hook** | Fires on its own, and fails loudly. |

**Capitalising on experience is not writing more documents. It is moving each lesson up one
rung** — and accepting, knowingly, that the ones which cannot move stay sentences.

Two corollaries drive the whole design:

- **Anything a script can check should be checked, not recited.** Of the eight gates in the
  post-implementation checklist, three are fully scriptable and two more are partly — lint and
  type-check, commit scope, a handful of security greps. Only three need judgement: what was
  *not* tested, what the human must verify, and the final report. So the checklist became a hook
  that runs the first five and asks for the last three.
- **An eval protects what needs judgement; a hook replaces what does not.** They are not
  competing mechanisms, and they do not belong in the same places.

---

## Layout

```
cairn/
├── core/           # method — no assumptions about your stack
├── supabase-app/   # Next.js + Supabase + multi-tenant + AI assistant + design system
└── bundle/         # no components, only dependencies — installs both
```

`cairn-supabase-app` declares a dependency on `cairn-core`. Components are namespaced by plugin name, so two
plugins can ship a skill with the same name without colliding — a project can specialise without
renaming anything.

**Nothing product-specific lives here.** No table names, no paths, no domain vocabulary. What is
specific to a product stays in that product's repository, and this is what makes the whole thing
reusable rather than a second copy of one codebase's conventions.

### What `core` carries

Workflow skills that hold a *structure*, not content: a three-tier triage for implementation
work, a reproduce-first protocol for bug fixing, a multi-perspective convergence protocol for
specs, an audit split across seven axes. Which files a given project should read is a parameter,
not a hard-coded list.

Plus three hooks. One forces confirmation on any deletion command, even buried inside a pipe.
One re-anchors on documented architecture before any architectural proposal. One runs the
post-implementation gates when a turn ends and code has changed.

### What `supabase-app` carries

The strongest single piece is a Row-Level-Security check, and its history explains why it is
worth having:

> The original command looked for exactly one failure mode — *why is my query returning
> nothing?* — and every fix pattern it suggested **opened access**. That framing held for months.
> Forty-five tables sat in the public schema with RLS disabled, readable *and writable* with the
> anonymous key, and the check reported them as perfectly fine, because nothing was blocked.

The version here checks both directions. Nothing in it is domain-specific; it is Postgres.

Alongside it: reference documents shipped as **skeletons with a skill that fills them**, not as
finished files. A project does not inherit answers, it inherits the right questions — and each
generated document marks, inside itself, where the skeleton ends and the project's own
extensions begin, so a template can be updated without overwriting anyone's work.

---

## How it is verified

`claude plugin eval` runs each case in a clean, isolated session — **three times with the plugin
loaded, three times without** — and reports the difference.

That delta is the entire point. A case that scores perfectly in both arms tells you something
precise and slightly uncomfortable: **the plugin contributed nothing**, the model was already
getting there on its own. It turns "I think this skill isn't firing any more" from an impression
into a number.

Four of the six grader types are deterministic and free — regular expressions, tool calls, tool
ordering, file creation. Only two call a judge model. The suites here follow the documented
practice of pairing **one grader on the result** with **one grader on the process**: the first
says whether the answer is good, the second says whether *this plugin* is why.

What gets evaluated is deliberately narrow: whether a skill triggers on real phrasings, whether
neighbouring skills stay out of each other's way, and whether judgement gates hold — does it stop
and wait, does it refuse to green-light itself, does it declare honestly what it did not test.
Everything a script can check is checked by a script instead.

```bash
claude plugin eval ./core                     # the whole suite
claude plugin eval ./core --case no-push-without-instruction
claude plugin eval ./core --ablation none     # half the cost, no control arm — for iterating only
```

**On native Windows the suite will not run.** Granting `Bash` requires an OS sandbox, and there
is no backend for one outside WSL2 or Linux — the run is refused rather than executed
unconfined. That is a reasonable default, and it points at the right home for the suite anyway:

```bash
claude plugin eval ./core \
  --trust-plugin \                            # required: no terminal to ask for trust
  --model claude-sonnet-5 \                   # pin both models, or a default change
  --judge-model claude-haiku-4-5 \            # looks exactly like a regression
  --threshold 0.8 --json results.json --no-publish --max-cost-usd 20
```

Exit code 1 means a case fell below the threshold; 2 means the run was cut short by the cost
ceiling and the scores are not comparable. Runs marked `partial` stay out of any trend line.

A note on the cost, since it decides whether this is a net or a ritual: one case, six runs, was
measured at **$0.41 and 74 seconds**. Four cases is a few dollars and under ten minutes.

---

## Two illustrations

Both are anonymised, both cost real time, and both now live one rung higher than the sentence
that first described them.

**A failed search is not evidence of absence.** A file-matching tool returned "no files found"
for directories containing dynamic route segments — the `[id]` folders that framework routers
use. Trusting one of those false negatives led to deleting a directory that held seven live
route files. The lesson could have stayed a warning in a conventions file. Instead it is a hook
that forces explicit approval on every deletion command, however it is spelled.

**A green type-check proves nothing about a rendered page.** A layout was delivered as "verified"
on the strength of a passing compiler and a careful reading of the components. The reviewer sent
back screenshots showing three regressions. The rule that followed is not "be careful with UI" —
it is a loop: render, screenshot, *look at it*, fix, repeat, and only then show anyone.

---

## Install

```bash
claude plugin marketplace add pascalpediroda-maker/cairn
claude plugin install cairn@cairn          # bundle: core + supabase-app
```

Or, for the method alone, without the architecture opinions:

```bash
claude plugin install cairn-core@cairn
```

---

## Status

Early, and honest about it. The principle and the layering are settled; the extraction is in
progress. Evals come **before** the skills are rewritten rather than after — measuring first is
the only way to know whether an adaptation improved anything, and "I adapted the skill" is
otherwise an unverifiable claim.

Not everything here is generic yet. Where something still smells of the codebase it came from,
that is a bug in the extraction, and it is worth an issue.

## Licence

MIT.
