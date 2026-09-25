---
name: strategy
description: >
  Evaluate a market opportunity or a product/business strategy, and turn it into an actionable
  one-pager. Chains four lenses: Opportunity (Desirability × Defensibility × Viability) →
  Diagnosis (Rumelt) → Cascade (Playing-to-Win) → Defensibility (7 Powers). Fits two contexts:
  deciding on your own product's next move (new vertical, positioning, a build/no-build call) and
  advisory or due-diligence work (assessing a third party's strategy, prepping a strategic review,
  stress-testing someone else's vision). Trigger: "assess this opportunity", "is this a good
  strategy", "where do we play / how do we win", "what's our moat / our defensibility", "challenge
  this vision", "prep the strategy for X", "TAM / wedge", "/strategy".
---

# strategy — assess an opportunity or a strategy, properly

A strategy toolbox. Four canonical lenses, wired together, that produce **one one-pager**. Don't
run all four by rote — route by the question being asked (see Step 0).

## What this produces
One one-pager: **Posture → Opportunity (GO/NO-GO) → Diagnosis + crux → Cascade + must-be-true →
7 Powers + risk → decision**. No fluff, facts required, unknowns named as unknowns.

---

## Step 0 — Framing, posture, routing (always)

1. **Subject**: what exactly is being evaluated (the whole product, a feature, a new vertical, a
   competitor, a third party's asset)?
2. **Posture**, by maturity:
   - **Design** (idea / pre-traction) → you're *making* the choices. 7 Powers is a compass ("which
     Power am I architecting toward?"), not an audit.
   - **Assessment** (product-market fit → scale → mature/late-stage) → you're *auditing* what
     exists and (re)building its defensibility.
   - Anti-theater rule: **match the tool to the evidence you have.** Don't run a heavyweight
     7 Powers pass on a product with no traction yet.
3. **Routing**:
   - Question is **"is this opportunity worth pursuing?"** (new market, expansion) → start at
     Step 1 (the Opportunity gate), then 2-3-4 if it's a GO.
   - Question is **"does this strategy / this asset hold up?"** (challenging a stated vision, due
     diligence) → you can skip Step 1 and start at the Diagnosis (Step 2).

---

## Step 1 — Opportunity: Desirability × Defensibility × Viability (GO/NO-GO gate)
An opportunity only holds if **all three** hold. If any one collapses → NO-GO or re-scope.

**1a. Desirability — JTBD + opportunity score (ODI)**
List the user's "jobs to be done". For each: `Opportunity = Importance + max(0, Importance −
Satisfaction)`.
→ A job that's important **and underserved** is white space. A job that's important and **already
well served** is table stakes, not an opportunity.
Output: a table of Job | Importance | Satisfaction | Opportunity, and **the wedge** (the most
underserved job).

**1b. Defensibility — 5 Forces + which 7 Power it would build**
Is the wedge *defensible*? Barriers to entry, substitutes, buyer/supplier power. And above all:
**which of the 7 Powers** does this wedge let you build (often Cornered Resource or Process
Power)? If it enables none of them → red ocean, be wary.

**1c. Viability — size, willingness to pay, structure**
TAM/SAM (⚠️ size **per geography** if the market is national or regulated), who pays / how much /
how often, market fragmentation.

**Gate**: a one-sentence **GO / NO-GO / RE-SCOPE** verdict, plus the wedge chosen.

---

## Step 2 — Diagnosis (Rumelt)
The kernel is **Diagnosis → Guiding policy → Coherent actions**. Without all three, it's a wish.

- **Diagnosis**: name the **real obstacle** (2-3 sentences, uncomfortable truths included).
- **Bad-strategy detector**: is there fluff? are we avoiding naming the obstacle? are we confusing
  goals with strategy? is there a list of 15 priorities (= 0 priorities)?
- **Crux**: the single hardest element everything else depends on.

---

## Step 3 — Cascade (Playing-to-Win)
Five choices that **reinforce each other**:
1. **Winning aspiration** (concrete, measurable success)
2. **Where to play** (segments / geography / products / channels — **exclude** explicitly;
   "everyone" is not a strategy)
3. **How to win** (the advantage: cost or differentiation; *the reason the customer chooses you*,
   not a feature list)
4. **Capabilities** (3-5 mutually reinforcing capabilities)
5. **Management systems** (what builds and sustains those capabilities)

→ **Coherence test** (do the 5 align?), **key tension** (what's being bet on), and
**must-be-true** (2-3 conditions per choice = the strategic risks to watch / to interrogate).

---

## Step 4 — Defensibility (7 Powers)
For each of the 7, a table with **Present (Y/N) | Strength (None→Weak→Medium→Strong) | Durability
(Fragile→Medium→Durable)**:
1. **Scale Economies** — unit costs ↓ with volume
2. **Network Economies** — value ↑ with the number of users (rare in data SaaS — often the gap to
   fill)
3. **Counter-Positioning** — a model the incumbent *won't* copy (it would cannibalize itself);
   **the only attacker's Power**
4. **Switching Costs** — leaving costs/hurts the customer
5. **Branding** — people pay/trust based on what the brand signifies
6. **Cornered Resource** — you *own* an exclusive asset (data, patent, talent, rights)
7. **Process Power** — you *do* something in a proprietary, tacit, accumulated way that's hard to
   copy

Each Power = **Benefit** (≈ USP) **+ Barrier** (≈ moat). Output: the real Power(s) in play, the one
worth **building**, the **combinations** that reinforce each other, and the **counter-positioning
risk** (who could do this to us?).
Reminder: **Cornered Resource = you own** (stock); **Process Power = you do** (flow).

---

## Output — the one-pager
```
SUBJECT — [name]          POSTURE — [Design | Assessment]

OPPORTUNITY (if applicable)
  Wedge: ...
  Desirability: ...  Defensibility: ...  Viability: ...
  → GO / NO-GO / RE-SCOPE

DIAGNOSIS (Rumelt)
  Real obstacle: ...
  Bad-strategy tells: ...
  CRUX: ...

CASCADE (Playing-to-Win)
  Aspiration / Where to play / How to win / Capabilities / Mgmt systems
  Key tension: ...
  Must-be-true (= risks / open questions): ...

DEFENSIBILITY (7 Powers)
  [7-row table]  →  Real Power: ...  Power to build: ...  Counter-positioning risk: ...

DECISION / NEXT STEP: one sentence.
```

---

## Guardrails
- **No fluff.** Every claim is either a fact or a named unknown. Never let jargon paper over an
  empty spot.
- **Demand the facts**: if a number is missing (TAM, revenue split, satisfaction), say so and mark
  it "to confirm" — don't invent it.
- **15 priorities = 0.** Force the choice and the exclusion.
- **Match the tool to the evidence**: be honest about Design vs Assessment posture.
- **The crux first.** If you can't name the single hardest element, the diagnosis isn't done.
- Deliver in whatever language the audience needs — don't default to a language nobody asked for.
