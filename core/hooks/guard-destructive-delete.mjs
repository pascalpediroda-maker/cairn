// PreToolUse guard — file deletions must be approved explicitly, every time.
//
// Inspects the FULL shell command, so `cd x && rm ...`, pipes and `xargs rm` are
// caught — not just a leading-token prefix rule. Covers bash and PowerShell. When a
// deletion verb is present it returns permissionDecision "ask", which forces an
// approval prompt even under acceptEdits or a matching allow rule. Anything else:
// stay silent, so normal flow is untouched.
//
// WHY THIS EXISTS. A file-matching tool returned "no files found" for a directory
// whose path contained a dynamic route segment — the `[id]` folders that framework
// routers use. The negative was believed, `rm -rf` followed, and seven live route
// files went with it. Recovered from git; the trust was not.
//
// The discipline comes first: never conclude "empty" from one tool's negative.
// This hook is the net under the discipline, not a replacement for it.

let data = '';
process.stdin.on('data', (c) => { data += c; });
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(data || '{}');
    const cmd = String(input?.tool_input?.command ?? '');

    // A deletion verb as its own command-segment token: at string start or right
    // after a separator/space, followed by a space, a slash, or end of string.
    // bash: rm, rmdir, git rm — PowerShell: Remove-Item and its aliases ri/rd/del/erase.
    const DELETE = /(^|[\s;&|(){}<>`])(remove-item|rmdir|erase|rm|rd|del|ri)([\s/]|$)/i;

    if (DELETE.test(cmd)) {
      process.stdout.write(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: 'ask',
          permissionDecisionReason:
            'Destructive file-deletion command. Approve each deletion explicitly — '
            + 'no silent rm / Remove-Item.',
        },
      }));
    }
  } catch {
    // Parse error → do nothing. Never block a command that is not a deletion.
  }
});
