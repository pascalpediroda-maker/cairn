---
name: spec
description: >
  Create, challenge, or evolve a spec through a structured multi-perspective debate instead of a
  single viewpoint. Claude acts as Facilitator and coordinates five perspectives — product,
  go-to-market, experience, technical, and voice-of-customer — that each form an independent
  opinion, debate, and converge through a bounded protocol. Use whenever the user wants to work on
  a spec, a feature definition, or a functional design — even without saying "spec" explicitly.
  Also triggers on a design question that spans several dimensions (technical + UX + business), or
  a structuring decision that needs trade-offs weighed across perspectives: "challenge this", "are
  we missing something", "let's think through X", "what are the consequences of Y", "help this
  converge".
---

# Skill: Spec

## Why this skill exists

Good specs don't come from a single perspective. A feature that looks obvious from a product angle
can be a technical nightmare. An elegant architecture can produce a mediocre experience. A sharp
go-to-market pitch can promise something impossible to build. And without real customer data, the
whole thing is built on assumptions.

This skill has **Claude itself** orchestrate a team of five perspectives that each read the
relevant material, form an independent opinion, debate through Claude, and converge on solid
recommendations — grounded in real voice-of-customer data, not invented quotes.

## Architectural principle — Claude = Facilitator

A facilitator that is itself one of the perspectives (say, the product owner framing the debate)
carries a structural bias toward its own concerns. A neutral facilitator gives a go-to-market "wow
factor" argument exactly as much weight as a product "completeness" argument — and lets the
product perspective be a genuine advocate for its own position without a conflict of interest.

If the project ships a dedicated facilitator agent (e.g. `spec-facilitator`), spawn it and let it
run the protocol below, coordinating its own teammates. That agent's own instructions are the
operational guide (the 4-phase protocol, neutrality rules, convergence rules); this skill is what
tells you *when* to reach for it and what the deliverable needs to contain.

## The five perspectives

| Perspective | Covers | Typical teammate name |
|---|---|---|
| **Product** | Functional completeness, personas, prioritization | `pm` |
| **Go-to-market** | Value proposition, positioning, wow factor | `gtm` |
| **Experience** | Flows, friction, cognitive load, UI patterns | `ux` |
| **Technical** | Architecture, feasibility, technical risk | `tech` |
| **Voice of customer** | Real quotes, user signals, personas grounded in data | `voc` |

## Workflow — the 4-phase protocol

### Phase 0 — Framing (Claude)

1. Read the relevant code/design material and any existing spec on the topic — quickly, not
   exhaustively; the perspectives will read it themselves.
2. Write a **Brief**: the precise question, known constraints, relevant context, the angles to
   explore.
3. If the topic itself is too vague to brief → ask ONE clarifying question before spawning anyone.

### Phase 1 — Discovery in parallel

Spawn the five perspectives **in a single message** with the shared Brief. Each one reads
independently and forms its own argued position.

### Phase 2 — Debate (Claude arbitrates)

Receive the five positions, identify the **divergences**:
- Where do product and technical disagree?
- Where do experience and go-to-market diverge?
- What does voice-of-customer data contradict?

Send **1-2 targeted follow-ups** to the perspectives involved to dig into the hot points. **Max 2
rounds of debate** — converge fast, don't let it drift.

### Phase 3 — Convergence (Claude delivers)

Synthesize into a structured deliverable. Every decision gets classified:
- **DECIDED**: consensus (or unanimity) across the five.
- **DECIDED-WITH-DISSENT**: the retained decision, plus the dissenting argument (1-2 perspectives)
  written out honestly.
- **ESCALATED**: an irreducible disagreement — hand it to the human owner to arbitrate, framed as
  a clean trade-off with a recommendation.

A reasonable shape for the deliverable:
- **Question & constraints** — what's being decided, and what's already fixed.
- **Current state** — what exists today (code, data, known blind spots).
- **Options considered** — argued by each perspective.
- **Decision** — classified as above, one line per decision point.
- **Implications** — technical, experience, and go-to-market consequences of what was decided.
- **Validation** — how you'll know it worked, what to check after shipping.
- **Next steps** — a sequence the project's implementation workflow can pick up directly.

### Phase 4 — Present the result

Present the synthesis. Surface every ESCALATED point clearly — those are the ones that need a
decision before moving on.

## Modes of use

### Mode 1: Create a spec from scratch
Frame, five perspectives explore, debate, converge. Deliverable ready to publish wherever the
project keeps its specs.

### Mode 2: Challenge an existing spec
Read the existing spec, distribute it to the five perspectives. Each one stress-tests it.
Deliverable = an argued, multi-perspective list of corrections/improvements.

### Mode 3: A structuring design question
E.g. "should this component own its own state or the parent's?" Open the question, let the
perspectives debate. Deliverable = an argued recommendation with a trade-off analysis.

## The voice-of-customer perspective — the one perspective with real data

It draws on whatever the project actually has: an issue tracker, a feedback tool, survey
responses, support tickets, session recordings, analytics — whatever is real and accessible, never
invented. It produces:
- Which personas/segments are affected, and how much.
- **Real quotes**, never invented ones.
- Quantitative signals (counts, not vibes).
- Patterns observed, clearly labeled as inference when they are.
- Contradictions with what the other perspectives proposed.
- Personas/segments **not** represented in the data.

**Golden rule**: if there's no data on a topic, it says "no signal covers this topic." It never
speculates to fill the gap.

## Principles
- **Read the material before reasoning** — every perspective, every time.
- **Make every perspective speak** — that's the facilitator's job, not optional.
- **Converge and recommend** — a spec that lists options without a decision isn't done.
- **Watch for blind spots** — usually product's and the facilitator's job together.
- **Watch for over-specification** — if the task list balloons or the team invents systems nobody
  asked for, flag it and simplify.
- **Treat challenges as another round of exploration**, not as a verdict to defend against.
