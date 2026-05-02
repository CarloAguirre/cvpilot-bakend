

CREATE OR REPLACE FUNCTION fn_log_cv_version_created_event()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_id bigint;
BEGIN
  SELECT c.user_id
  INTO v_user_id
  FROM cvs c
  WHERE c.id = NEW.cv_id;

  IF v_user_id IS NULL THEN
    RETURN NEW;
  END IF;

  INSERT INTO system_events (
    user_id,
    cv_id,
    cv_version_id,
    event_type,
    event_detail,
    created_at
  )
  VALUES (
    v_user_id,
    NEW.cv_id,
    NEW.id,
    'cv_version_created',
    format(
      'CV version %s created as %s by %s',
      NEW.version_number,
      NEW.version_type,
      NEW.created_by_process
    ),
    now()
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_cv_versions_system_event ON cv_versions;

CREATE TRIGGER trg_cv_versions_system_event
AFTER INSERT ON cv_versions
FOR EACH ROW
EXECUTE FUNCTION fn_log_cv_version_created_event();

CREATE OR REPLACE PROCEDURE sp_generate_user_cv_report_snapshot(
  IN p_user_id bigint
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_payload jsonb;
BEGIN
  WITH user_cvs AS (
    SELECT
      c.id,
      c.target_role,
      c.is_archived,
      c.created_at,
      c.updated_at
    FROM cvs c
    WHERE c.user_id = p_user_id
      AND c.deleted_at IS NULL
  ),
  version_rows AS (
    SELECT
      v.id,
      v.cv_id,
      v.target_role,
      v.version_type,
      v.created_by_process,
      v.created_at,
      v.updated_at
    FROM cv_versions v
    INNER JOIN user_cvs c ON c.id = v.cv_id
  ),
  totals AS (
    SELECT
      (SELECT count(*)::int FROM user_cvs) AS total_cvs,
      (SELECT count(*)::int FROM user_cvs WHERE is_archived = false) AS active_cvs,
      (SELECT count(*)::int FROM user_cvs WHERE is_archived = true) AS archived_cvs,
      count(v.id)::int AS total_versions,
      count(v.id) FILTER (WHERE v.version_type = 'created')::int AS created_versions,
      count(v.id) FILTER (WHERE v.version_type = 'improved')::int AS improved_versions,
      count(v.id) FILTER (WHERE v.version_type = 'manual_edit')::int AS manual_edit_versions,
      count(v.id) FILTER (WHERE v.created_by_process = 'ai')::int AS ai_generated_versions,
      count(v.id) FILTER (WHERE v.created_by_process = 'manual')::int AS manual_versions,
      max(
        greatest(
          coalesce(c.updated_at, c.created_at),
          coalesce(v.updated_at, v.created_at, c.updated_at, c.created_at)
        )
      ) AS last_activity_at
    FROM user_cvs c
    LEFT JOIN version_rows v ON v.cv_id = c.id
  ),
  top_roles AS (
    SELECT coalesce(
      jsonb_agg(
        jsonb_build_object(
          'targetRole', ranked.target_role,
          'totalVersions', ranked.total_versions
        )
        ORDER BY ranked.total_versions DESC, ranked.target_role ASC
      ),
      '[]'::jsonb
    ) AS roles
    FROM (
      SELECT
        v.target_role,
        count(*)::int AS total_versions
      FROM version_rows v
      GROUP BY v.target_role
      ORDER BY total_versions DESC, v.target_role ASC
      LIMIT 5
    ) ranked
  ),
  versions_by_type AS (
    SELECT coalesce(
      jsonb_agg(
        jsonb_build_object(
          'versionType', ranked.version_type,
          'totalVersions', ranked.total_versions
        )
        ORDER BY ranked.total_versions DESC, ranked.version_type ASC
      ),
      '[]'::jsonb
    ) AS version_types
    FROM (
      SELECT
        v.version_type,
        count(*)::int AS total_versions
      FROM version_rows v
      GROUP BY v.version_type
      ORDER BY total_versions DESC, v.version_type ASC
    ) ranked
  ),
  monthly_versions AS (
    SELECT coalesce(
      jsonb_agg(
        jsonb_build_object(
          'reportYear', ranked.report_year,
          'reportMonth', ranked.report_month,
          'totalVersions', ranked.total_versions
        )
        ORDER BY ranked.report_year ASC, ranked.report_month ASC
      ),
      '[]'::jsonb
    ) AS months
    FROM (
      SELECT
        EXTRACT(YEAR FROM v.created_at)::int AS report_year,
        EXTRACT(MONTH FROM v.created_at)::int AS report_month,
        count(*)::int AS total_versions
      FROM version_rows v
      GROUP BY EXTRACT(YEAR FROM v.created_at), EXTRACT(MONTH FROM v.created_at)
      ORDER BY report_year ASC, report_month ASC
    ) ranked
  )
  SELECT jsonb_build_object(
    'totalCvs', totals.total_cvs,
    'activeCvs', totals.active_cvs,
    'archivedCvs', totals.archived_cvs,
    'totalVersions', totals.total_versions,
    'createdVersions', totals.created_versions,
    'improvedVersions', totals.improved_versions,
    'manualEditVersions', totals.manual_edit_versions,
    'aiGeneratedVersions', totals.ai_generated_versions,
    'manualVersions', totals.manual_versions,
    'lastActivityAt', totals.last_activity_at,
    'topTargetRoles', top_roles.roles,
    'versionsByType', versions_by_type.version_types,
    'monthlyVersions', monthly_versions.months
  )
  INTO v_payload
  FROM totals
  CROSS JOIN top_roles
  CROSS JOIN versions_by_type
  CROSS JOIN monthly_versions;

  INSERT INTO report_snapshots (
    user_id,
    report_type,
    report_period,
    payload,
    generated_at
  )
  VALUES (
    p_user_id,
    'cv_activity_summary',
    to_char(now(), 'YYYY-MM'),
    coalesce(v_payload, '{}'::jsonb),
    now()
  );
END;
$$;