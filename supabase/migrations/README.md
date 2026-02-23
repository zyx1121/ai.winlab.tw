# Supabase migrations

Run these in order in the Supabase SQL Editor (Dashboard → SQL Editor), or use the Supabase CLI.

Order:

1. `20250211000001_profiles.sql`
2. `20250211000002_teams.sql`
3. `20250211000003_organization_members.sql`
4. `20250211000004_alter_results_competitions.sql`
5. `20250211000005_rls_results_competitions.sql`

After running, set the first admin user manually:

```sql
update public.profiles set role = 'admin' where id = '<your-user-uuid>';
```
