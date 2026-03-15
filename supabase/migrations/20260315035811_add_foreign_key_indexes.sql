/*
  # Add indexes for unindexed foreign keys

  ## Purpose
  Foreign key columns without indexes cause full table scans on cascading deletes
  and joins. This migration adds covering indexes for all four unindexed FK columns
  flagged by the security advisor.

  ## Changes
  - `assessments.org_id` → new index `assessments_org_id_idx`
  - `ethics_messages.org_id` → new index `ethics_messages_org_id_idx`
  - `roadmap_items.assessment_id` → new index `roadmap_items_assessment_id_idx`
  - `roadmap_items.org_id` → new index `roadmap_items_org_id_idx`
*/

CREATE INDEX IF NOT EXISTS assessments_org_id_idx
  ON public.assessments (org_id);

CREATE INDEX IF NOT EXISTS ethics_messages_org_id_idx
  ON public.ethics_messages (org_id);

CREATE INDEX IF NOT EXISTS roadmap_items_assessment_id_idx
  ON public.roadmap_items (assessment_id);

CREATE INDEX IF NOT EXISTS roadmap_items_org_id_idx
  ON public.roadmap_items (org_id);
