-- 007_verify_schema.sql
-- Glohib.ai Schema Verification Queries

\echo '=== Extensions ==='
SELECT extname, extversion FROM pg_extension WHERE extname IN ('uuid-ossp','vector');

\echo '=== Enums ==='
SELECT typname, enumlabel FROM pg_enum ORDER BY 1,2;

\echo '=== Tables & row counts ==='
SELECT schemaname, tablename, n_tup_ins
  FROM pg_stat_user_tables
 WHERE tablename IN ('students','employers','mentors','institutions','internships','assessments','video_submissions')
 ORDER BY 1,2;

\echo '=== Partitions ==='
SELECT inhrelid::regclass FROM pg_inherits WHERE inhparent='assessments'::regclass ORDER BY 1;

\echo '=== Indexes on internships.vector ==='
SELECT indexname, indexdef FROM pg_indexes WHERE tablename='internships' AND indexdef LIKE '%vector%';

\echo '=== Sample employer ==='
SELECT id, name, tier FROM employers LIMIT 1;
