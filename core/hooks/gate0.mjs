// PreToolUse hook on the Skill tool — re-anchor before designing.
//
// When a skill is invoked in which architecture or product decisions get made, inject
// a short discipline reminder next to the tool result, so the model re-reads the
// documented architecture instead of proposing from what it remembers of the thread.
//
// WHY THIS EXISTS. A session proposed an architecture built entirely on in-thread
// priors, several compactions deep, contradicting an architecture that was written
// down in the repository. Nothing was wrong with the written architecture; it just
// had not been re-read. Context is not memory — it decays, and it decays silently.
//
// Contract: PreToolUse receives the tool call as JSON on stdin. Returning
// { hookSpecificOutput: { hookEventName, additionalContext } } injects additionalContext
// alongside the tool result, where the model will see it.

import { readFileSync, appendFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

let input = {};
try { input = JSON.parse(readFileSync(0, 'utf8')); } catch { /* no stdin → no-op */ }

const ti = input?.tool_input ?? {};
const skill = String(ti.skill ?? ti.name ?? ti.skill_name ?? ti.command ?? '').toLowerCase();

// Skills where a design decision is about to be made. Substring match, so a plugin
// prefix (`cairn-core:dev`) still matches. Extend per project by editing this list.
const GATED = ['dev', 'archi', 'schema', 'migration', 'audit', 'prd', 'opportunity'];
const gated = GATED.some((s) => skill && skill.includes(s));

// Observable trace: PreToolUse injects silently, so without a log there is no way to
// tell the hook fired at all. Writes to CLAUDE_PLUGIN_DATA, which survives plugin
// updates — CLAUDE_PLUGIN_ROOT does not, and a log written there disappears on upgrade.
try {
  const dir = process.env.CLAUDE_PLUGIN_DATA;
  if (dir) {
    mkdirSync(dir, { recursive: true });
    appendFileSync(
      join(dir, 'gate0.log'),
      `${new Date().toISOString()} tool=${input?.tool_name ?? '?'} skill="${skill}" gated=${gated}\n`,
    );
  }
} catch { /* logging is best-effort and must never block the tool call */ }

if (gated) {
  const reminder = [
    'GATE 0 — before proposing an architecture or asserting how something behaves.',
    'Each new sub-task reopens this gate, including late in a compacted session.',
    '',
    '1. RE-READ the documented architecture and conventions. Thread context is not a',
    '   substitute: re-anchor, do not recall.',
    '2. CITE file:line for every "here is how it works" claim. If you cannot cite it,',
    '   verify it — do not assert it.',
    '3. CLAIM NOTHING BEYOND THE WORK ACTUALLY DONE. "Checked files A through D, no',
    '   match" is a fact. "It is not there" is not. Say by which method a negative',
    '   was obtained; a partial sweep and a full read are different claims.',
    '4. FIX THE CAUSE, NOT THE SYMPTOM. If the proposed fix is a time window, a',
    '   heuristic comparison, a swallowed catch, or "we handle it case by case",',
    '   the cause has not been found yet.',
    '5. DECIDE. A technical trade-off is yours to make and justify, not to hand back',
    '   as an open question.',
  ].join('\n');

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PreToolUse', additionalContext: reminder },
  }));
}

process.exit(0);
