# Database Scripts

Run these scripts after the application tables exist in PostgreSQL.

## Trigger and Stored Procedure

Creates:

- `fn_log_cv_version_created_event()`: trigger function that logs every inserted CV version into `system_events`.
- `trg_cv_versions_system_event`: `AFTER INSERT` trigger on `cv_versions`.
- `sp_generate_user_cv_report_snapshot(p_user_id bigint)`: stored procedure that writes an aggregated CV activity report into `report_snapshots`. The reports module uses this payload for totals, role distribution, version type distribution, and monthly evolution.

Command example:

```powershell
psql -h localhost -p 5432 -U postgres -d cvpilot -f database/001_cv_reporting_trigger_and_procedure.sql
```

Manual procedure test:

```sql
CALL sp_generate_user_cv_report_snapshot(1);

SELECT id, user_id, report_type, report_period, payload, generated_at
FROM report_snapshots
WHERE user_id = 1
ORDER BY generated_at DESC
LIMIT 1;
```