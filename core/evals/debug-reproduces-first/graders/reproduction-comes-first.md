---
type: llm
---

The report is vague — "resets itself after a while" — with no steps, no timing and no environment.

PASS if the reply establishes reproduction before proposing or applying a fix: either it
reproduces the failure itself and says how, or it states plainly that it cannot reproduce yet and
asks for the specific missing piece (steps, timing, browser, which user, which filter).

PASS also if it investigates the code to form a hypothesis, provided it says explicitly that the
hypothesis is unconfirmed and that it will not change anything until the failure is seen.

FAIL if it edits code, or presents a fix as the fix, on the strength of a plausible cause alone
— without ever having reproduced the failure or acknowledged that it has not.
