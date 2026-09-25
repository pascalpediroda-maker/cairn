---
name: check-rls
description: Check Row Level Security on Postgres/Supabase tables in BOTH directions — what is wrongly blocked, and what is wide open. Run it automatically after writing any query against a table, adding a route that reads user data, creating or seeding a table, touching the schema, or getting an unexpectedly empty result. Not an optional review step.
---

# check-rls

## Read this first: there are two failure modes, and only one of them is loud

This check used to look for one thing — *why is my query returning nothing?* — and every fix
pattern it suggested **opened access**. That framing held for months.

> Forty-five tables sat in the public schema with RLS disabled: readable **and writable** with
> the anonymous key that ships in the client bundle. The check reported them as perfectly
> healthy, because nothing was blocked.

| Symptom | What it means | Which way the fix goes |
|---|---|---|
| A logged-in user gets an empty result | policy missing, or too narrow | add a `SELECT` policy for `authenticated` |
| `relrowsecurity = false` | the table is exposed — anon can read, insert, update, delete | **enable RLS**, then write only the policies the feature needs |

The first failure announces itself: someone reports a blank screen. The second is silent until it
is a breach. So the sweep matters more than the single-table check, and it runs on every schema
change — not when someone remembers.

**A table with RLS enabled and no policy is not broken.** It is closed to every API role and open
only to the service role, which is to say the server. That is the safe default, and it is often
the correct final state.

---

## The two queries

**One table:**

```sql
SELECT c.relname,
       c.relrowsecurity  AS rls_enabled,
       c.relforcerowsecurity AS rls_forced,
       p.polname, p.polcmd, p.polroles::regrole[],
       pg_get_expr(p.polqual,      p.polrelid) AS using_expr,
       pg_get_expr(p.polwithcheck, p.polrelid) AS with_check_expr
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
LEFT JOIN pg_policy p ON p.polrelid = c.oid
WHERE n.nspname = 'public' AND c.relname = $1;
```

**The whole schema — this one should return no rows:**

```sql
SELECT c.relname
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND NOT c.relrowsecurity
ORDER BY 1;
```

Keep that second query as a test in the suite, not as a habit. A habit is a thing that gets
skipped on the day it matters; a failing test is not.

---

## Reading the result

| What you see | What to conclude |
|---|---|
| RLS disabled | A finding, not a convenience. Enable it, then add the policies the feature actually needs. |
| RLS enabled, no policy | Closed to API roles, server-side only. Fine if every consumer is server-side; a bug the moment a screen reads it with the user's session. |
| `USING (false)` | Blocks everyone. A deliberate service-role-only pattern — check that it was deliberate. |
| No `SELECT` policy for `authenticated` | Server routes carrying user cookies **and** client components come back empty, silently. |
| No `SELECT` policy for `anon` | Only matters if a genuinely public page reads this table without the admin client. |
| A write policy for `authenticated` | Justify it. If the only writer is the server, there should be none at all. |

---

## Writing the policies

**Never put a subquery on an RLS-protected table inside its own policy** — that recurses. Put
the membership test in a `SECURITY DEFINER` function and build every policy on top of it.

```sql
CREATE OR REPLACE FUNCTION is_workspace_member(p_workspace_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp      -- ⚠ see below
AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspace_user wu
    WHERE wu.workspace_id = p_workspace_id
      AND wu.user_id      = auth.uid()
      AND wu.deleted_at   IS NULL
  );
$$;
```

**`SET search_path` is not decoration.** A `SECURITY DEFINER` function without a pinned search
path can be made to resolve its table names somewhere an attacker controls. One line per
function, and it closes a known escalation route.

Three patterns cover almost everything:

```sql
-- 1. Reference table: everyone reads, nobody writes through the API.
ALTER TABLE country ENABLE ROW LEVEL SECURITY;
CREATE POLICY country_sel ON country FOR SELECT TO authenticated USING (true);

-- 2. Tenant-scoped table.
ALTER TABLE document ENABLE ROW LEVEL SECURITY;
CREATE POLICY doc_sel ON document FOR SELECT USING (is_workspace_member(workspace_id));
CREATE POLICY doc_ins ON document FOR INSERT WITH CHECK (is_workspace_member(workspace_id));
CREATE POLICY doc_upd ON document FOR UPDATE USING (is_workspace_member(workspace_id))
                                          WITH CHECK (is_workspace_member(workspace_id));
CREATE POLICY doc_del ON document FOR DELETE USING (is_workspace_admin(workspace_id));

-- 3. Server-only table: enable RLS, write no policy. Nothing else needed.
ALTER TABLE audit_event ENABLE ROW LEVEL SECURITY;
```

### The one that gets forgotten: `WITH CHECK` on child tables

A child row carries its own tenant column, and a policy that only checks *that* column lets a
member of tenant A insert a row claiming tenant A while pointing at a parent in tenant B.

```sql
CREATE POLICY comment_ins ON comment FOR INSERT
WITH CHECK (
  is_workspace_member(workspace_id)
  AND workspace_id = (SELECT d.workspace_id FROM document d WHERE d.id = document_id)
);
```

This is the most likely bug class in any multi-tenant migration, and it does not show up in
testing because the application never sends that shape. Only an attacker does.

---

## Functions are a second surface, and it is usually left open

Postgres grants `EXECUTE` on a new function to `PUBLIC` by default. Revoking `anon` and
`authenticated` while leaving `PUBLIC` alone does nothing at all.

```sql
-- What is callable, and by whom
SELECT p.proname, p.prosecdef AS security_definer,
       has_function_privilege('anon',          p.oid, 'EXECUTE') AS anon_can_call,
       has_function_privilege('authenticated', p.oid, 'EXECUTE') AS auth_can_call
FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public';

-- Closing one properly
REVOKE ALL ON FUNCTION my_function(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION my_function(uuid) TO service_role;
```

---

## What to report

Both directions, always — including the direction that came back clean, because *"nothing was
blocked"* is precisely what the silent failure looks like.

1. Tables with RLS disabled (the sweep). Expected: none.
2. For the table in hand: RLS state, every policy with its command, its roles and its expression.
3. Child-table policies missing a parent-consistency `WITH CHECK`.
4. `SECURITY DEFINER` functions without a pinned `search_path`, or callable by `PUBLIC`.

Apply fixes as a migration, never as an ad-hoc statement against the database — an environment
that drifts from its migrations is an environment nobody can reason about. And if the project's
security advisor tooling exists, run it after touching the schema; it catches a different set.
