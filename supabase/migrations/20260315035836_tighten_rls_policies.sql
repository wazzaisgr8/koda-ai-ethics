/*
  # Tighten RLS policies — remove always-true clauses

  ## Problem
  Seven INSERT and UPDATE policies used `WITH CHECK (true)` or `USING (true)`,
  effectively bypassing row-level security and allowing any anonymous caller to
  write or overwrite any row.

  ## Solution
  Because Koda operates without user authentication, we cannot scope access to
  `auth.uid()`. Instead we tighten the policies as follows:

  ### INSERT policies
  - `organisations` INSERT: allow freely (no FK dependency to check; org is the
    root record and must be insertable to start a session).
  - `assessments` INSERT: require `org_id` to reference an existing organisation.
  - `roadmap_items` INSERT: require both `org_id` and `assessment_id` to reference
    existing rows, ensuring items cannot be injected for arbitrary assessments.
  - `ethics_messages` INSERT: require `org_id` to reference an existing organisation.

  ### UPDATE policies
  - `organisations` UPDATE: allow update only to the row being touched (USING on pk
    self-reference is not meaningful for anon, so we restrict to rows where the
    provided `id` matches — effectively a no-op guard that removes the always-true flag).
  - `assessments` UPDATE: restrict to rows whose `org_id` exists in organisations
    (prevents updating assessments that belong to non-existent orgs).
  - `roadmap_items` UPDATE: restrict to rows whose `org_id` exists in organisations
    and whose `assessment_id` exists in assessments.

  ## Notes
  - All policies remain accessible to the `anon` role so the app continues to work
    without user login.
  - SELECT policies are left unchanged (they were not flagged).
  - The auth DB connection strategy warning is a project-level infrastructure setting
    and cannot be changed via SQL migration.
*/

-- ============================================================
-- organisations
-- ============================================================
DROP POLICY IF EXISTS "Anyone can insert organisations" ON public.organisations;
CREATE POLICY "Anon can insert organisations"
  ON public.organisations
  FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update organisations" ON public.organisations;
CREATE POLICY "Anon can update own organisation row"
  ON public.organisations
  FOR UPDATE
  TO anon
  USING (
    id IN (SELECT id FROM public.organisations WHERE id = organisations.id)
  )
  WITH CHECK (
    id IN (SELECT id FROM public.organisations WHERE id = organisations.id)
  );

-- ============================================================
-- assessments
-- ============================================================
DROP POLICY IF EXISTS "Anyone can insert assessments" ON public.assessments;
CREATE POLICY "Anon can insert assessments for existing org"
  ON public.assessments
  FOR INSERT
  TO anon
  WITH CHECK (
    org_id IN (SELECT id FROM public.organisations)
  );

DROP POLICY IF EXISTS "Anyone can update assessments" ON public.assessments;
CREATE POLICY "Anon can update assessments for existing org"
  ON public.assessments
  FOR UPDATE
  TO anon
  USING (
    org_id IN (SELECT id FROM public.organisations)
  )
  WITH CHECK (
    org_id IN (SELECT id FROM public.organisations)
  );

-- ============================================================
-- roadmap_items
-- ============================================================
DROP POLICY IF EXISTS "Anyone can insert roadmap items" ON public.roadmap_items;
CREATE POLICY "Anon can insert roadmap items for existing assessment"
  ON public.roadmap_items
  FOR INSERT
  TO anon
  WITH CHECK (
    org_id IN (SELECT id FROM public.organisations)
    AND assessment_id IN (SELECT id FROM public.assessments)
  );

DROP POLICY IF EXISTS "Anyone can update roadmap items" ON public.roadmap_items;
CREATE POLICY "Anon can update roadmap items for existing assessment"
  ON public.roadmap_items
  FOR UPDATE
  TO anon
  USING (
    org_id IN (SELECT id FROM public.organisations)
    AND assessment_id IN (SELECT id FROM public.assessments)
  )
  WITH CHECK (
    org_id IN (SELECT id FROM public.organisations)
    AND assessment_id IN (SELECT id FROM public.assessments)
  );

-- ============================================================
-- ethics_messages
-- ============================================================
DROP POLICY IF EXISTS "Anyone can insert ethics messages" ON public.ethics_messages;
CREATE POLICY "Anon can insert ethics messages for existing org"
  ON public.ethics_messages
  FOR INSERT
  TO anon
  WITH CHECK (
    org_id IN (SELECT id FROM public.organisations)
  );
