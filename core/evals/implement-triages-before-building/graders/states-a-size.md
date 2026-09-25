---
type: llm
---

The request adds a table, an API route and a UI change — three layers, so it is a FEATURE under
the skill's own triage, never TRIVIAL.

PASS if the reply names a size for the work (trivial / small / feature, or an explicit equivalent
wording) AND gives a reason for that size, AND that size is the largest one — anything involving
a new table and a new route cannot be classified as the smallest tier.

FAIL if it starts writing the table, the route or the component without ever stating how big it
judges the work to be, or if it calls a schema change trivial.
