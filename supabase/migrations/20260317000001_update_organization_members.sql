-- 1. Add new columns (all nullable TEXT)
ALTER TABLE organization_members
  ADD COLUMN school TEXT,
  ADD COLUMN research_areas TEXT,
  ADD COLUMN email TEXT,
  ADD COLUMN website TEXT,
  ADD COLUMN member_role TEXT;

-- 2. Create new enum type
CREATE TYPE organization_member_category_new
  AS ENUM ('core', 'legal_entity', 'industry');

-- 3. Migrate all existing rows to 'core'
ALTER TABLE organization_members
  ALTER COLUMN category DROP DEFAULT,
  ALTER COLUMN category TYPE organization_member_category_new
    USING 'core'::organization_member_category_new;

-- 4. Swap enum type
DROP TYPE organization_member_category;
ALTER TYPE organization_member_category_new RENAME TO organization_member_category;
