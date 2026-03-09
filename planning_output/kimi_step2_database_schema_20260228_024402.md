# GLOHIB.AI - STEP 2: DATABASE SCHEMA
**Generated:** 2026-02-28 02:44:02

---

```yaml
id: step_2_database_schema_setup
name: GLOHIB.AI – Step 2: Database Schema Setup
phase: build
priority: 1
estimate: 30 min
context: |
  From the Glohib.ai architecture we need a PostgreSQL 15+ database with
  pgvector 0.5+ that supports 512-dimensional embeddings, partitioned
  assessments, and role-based access for students, employers, mentors and
  institutions.  The schema must be 100 % migratable and reproducible
  across dev/staging/prod.

tasks:

# 0. Ensure pgvector is available on the host
- id: t0
  name: install pgvector extension (host level)
  action: shell_command
  cmd: |
    sudo apt-get update -qq && \
    sudo apt-get install -y postgresql-15-pgvector && \
    sudo systemctl restart postgresql

# 1. Extensions
- id: t1
  name: 001_create_extensions.sql
  action: create_file
  path: migrations/001_create_extensions.sql
  content: |
    -- 001_create_extensions.sql
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pg_trgm";
    CREATE EXTENSION IF NOT EXISTS "btree_gist";
    CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA public;
    -- Verify vector dimension limit
    SELECT extversion FROM pg_extension WHERE extname='vector';

# 2. Enums
- id: t2
  name: 002_create_enums.sql
  action: create_file
  path: migrations/002_create_enums.sql
  content: |
    -- 002_create_enums.sql
    DO $$ BEGIN
        CREATE TYPE employer_tier AS ENUM ('bronze','silver','gold','platinum');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
        CREATE TYPE institution_type AS ENUM ('university','college','ngo','think_tank','gov');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
        CREATE TYPE assessment_stage AS ENUM ('screening','technical','cultural','final');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

# 3. Tables
- id: t3
  name: 003_create_tables.sql
  action: create_file
  path: migrations/003_create_tables.sql
  content: |
    -- 003_create_tables.sql
    -- stakeholders
    CREATE TABLE IF NOT EXISTS students (
        id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        email         citext NOT NULL UNIQUE,
        password_hash text   NOT NULL,
        profile_vector vector(512),
        created_at    timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS employers (
        id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        name              text NOT NULL,
        tier              employer_tier NOT NULL DEFAULT 'bronze',
        api_key           uuid NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
        verified_domains  text[] NOT NULL DEFAULT '{}',
        created_at        timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS mentors (
        id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        student_id     uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        expertise_tags text[] NOT NULL DEFAULT '{}',
        timezone       text,
        rating         numeric(2,1) CHECK (rating BETWEEN 0 AND 5),
        created_at     timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS institutions (
        id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        type             institution_type NOT NULL,
        name             text NOT NULL,
        verified_domains text[] NOT NULL DEFAULT '{}',
        created_at       timestamptz NOT NULL DEFAULT now()
    );

    -- core
    CREATE TABLE IF NOT EXISTS internships (
        id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        employer_id uuid NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
        metadata    jsonb NOT NULL DEFAULT '{}',
        vector      vector(512),
        active      boolean NOT NULL DEFAULT true,
        expires_at  timestamptz,
        created_at  timestamptz NOT NULL DEFAULT now(),
        CHECK (expires_at IS NULL OR expires_at > created_at)
    );

    -- partitioned master table
    CREATE TABLE IF NOT EXISTS assessments (
        id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        student_id  uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        stage       assessment_stage NOT NULL,
        answers     jsonb NOT NULL DEFAULT '{}',
        scores      jsonb NOT NULL DEFAULT '{}',
        pass        boolean,
        ai_explain  text,
        created_at  timestamptz NOT NULL DEFAULT now()
    ) PARTITION BY RANGE (date_trunc('month', created_at));

    -- monthly partitions for 2 years ahead
    DO $$
    DECLARE
        start_date date := date_trunc('month', CURRENT_DATE);
        end_date   date := start_date + interval '24 months';
        month_ts   timestamptz;
    BEGIN
        FOR month_ts IN
            SELECT generate_series(start_date, end_date, interval '1 month')
        LOOP
            EXECUTE format(
                $$ CREATE TABLE IF NOT EXISTS assessments_y%m PARTITION OF assessments
                     FOR VALUES FROM (%L) TO (%L) $$,
                to_char(month_ts, 'YYYY_MM'),
                month_ts,
                month_ts + interval '1 month'
            );
        END LOOP;
    END $$;

    CREATE TABLE IF NOT EXISTS video_submissions (
        id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        assessment_id  uuid NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
        object_path    text NOT NULL,
        transcription  text,
        ai_grade       jsonb NOT NULL DEFAULT '{}',
        duration_sec   int CHECK (duration_sec > 0),
        created_at     timestamptz NOT NULL DEFAULT now()
    );

# 4. Indexes
- id: t4
  name: 004_create_indexes.sql
  action: create_file
  path: migrations/004_create_indexes.sql
  content: |
    -- 004_create_indexes.sql
    -- students
    CREATE INDEX IF NOT EXISTS idx_students_email ON students USING btree (email);
    CREATE INDEX IF NOT EXISTS idx_students_profile_vector ON students USING ivfflat (profile_vector vector_cosine_ops);

    -- employers
    CREATE INDEX IF NOT EXISTS idx_employers_tier ON employers USING btree (tier);
    CREATE INDEX IF NOT EXISTS idx_employers_api_key ON employers USING btree (api_key);

    -- mentors
    CREATE INDEX IF NOT EXISTS idx_mentors_student_id ON mentors USING btree (student_id);
    CREATE INDEX IF NOT EXISTS idx_mentors_expert ON mentors USING gin (expertise_tags);

    -- institutions
    CREATE INDEX IF NOT EXISTS idx_institutions_type ON institutions USING btree (type);

    -- internships
    CREATE INDEX IF NOT EXISTS idx_internships_employer_id ON internships USING btree (employer_id);
    CREATE INDEX IF NOT EXISTS idx_internships_active ON internships USING btree (active) WHERE active;
    CREATE INDEX IF NOT EXISTS idx_internships_expires_at ON internships USING btree (expires_at) WHERE active;
    CREATE INDEX IF NOT EXISTS idx_internships_vector ON internships USING ivfflat (vector vector_cosine_ops);

    -- assessments
    CREATE INDEX IF NOT EXISTS idx_assessments_student_id ON assessments USING btree (student_id);
    CREATE INDEX IF NOT EXISTS idx_assessments_stage ON assessments USING btree (stage);
    CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments USING btree (created_at);

    -- video_submissions
    CREATE INDEX IF NOT EXISTS idx_video_submissions_assessment_id ON video_submissions USING btree (assessment_id);

# 5. Triggers
- id: t5
  name: 005_create_triggers.sql
  action: create_file
  path: migrations/005_create_triggers.sql
  content: |
    -- 005_create_triggers.sql
    -- Auto-lowercase emails
    CREATE OR REPLACE FUNCTION trg_lower_email()
    RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN
        NEW.email := lower(NEW.email);
        RETURN NEW;
    END $$;

    DROP TRIGGER IF EXISTS trg_students_lower_email ON students;
    CREATE TRIGGER trg_students_lower_email
        BEFORE INSERT OR UPDATE OF email ON students
        FOR EACH ROW EXECUTE FUNCTION trg_lower_email();

    -- Updated_at columns (optional but good practice)
    CREATE OR REPLACE FUNCTION trg_set_updated_at()
    RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN
        IF TG_OP = 'UPDATE' THEN
            NEW.created_at := OLD.created_at; -- keep original
        END IF;
        RETURN NEW;
    END $$;

    DROP TRIGGER IF EXISTS trg_internships_updated ON internships;
    CREATE TRIGGER trg_internships_updated
        BEFORE UPDATE ON internships
        FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

# 6. Seed data
- id: t6
  name: 006_seed_data.sql
  action: create_file
  path: migrations/006_seed_data.sql
  content: |
    -- 006_seed_data.sql
    INSERT INTO employers (id, name, tier, verified_domains) VALUES
        ('550e8400-e29b-41d4-a716-446655440001', 'WHO',              'platinum', '{who.int}'),
        ('550e8400-e29b-41d4-a716-446655440002', 'UNICEF',           'gold',     '{unicef.org}'),
        ('550e8400-e29b-41d4-a716-446655440003', 'Médecins Sans Frontières', 'gold', '{msf.org}'),
        ('550e8400-e29b-41d4-a716-446655440004', 'PATH',             'silver',   '{path.org}'),
        ('550e8400-e29b-41d4-a716-446655440005', 'GAVI',             'platinum', '{gavi.org}')
    ON CONFLICT DO NOTHING;

    INSERT INTO institutions (id, type, name, verified_domains) VALUES
        ('660e8400-e29b-41d4-a716-446655440101', 'university', 'University of Global Health', '{ugh.edu}'),
        ('660e8400-e29b-41d4-a716-446655440102', 'ngo',        'Health Alliance International', '{hai.org}'),
        ('660e8400-e29b-41d4-a716-446655440103', 'think_tank', 'Center for Health Policy', '{chp.org}')
    ON CONFLICT DO NOTHING;

# 7. Verification queries
- id: t7
  name: 007_verify_schema.sql
  action: create_file
  path: migrations/007_verify_schema.sql
  content: |
    -- 007_verify_schema.sql
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

# 8. Roll-up migration runner
- id: t8
  name: run_all_migrations.sh
  action: create_file
  path: run_all_migrations.sh
  mode: "0755"
  content: |
    #!/usr/bin/env bash
    set -euo pipefail
    DB=${1:-glohib}
    for f in migrations/*.sql; do
        echo "==> $f"
        psql -v ON_ERROR_STOP=1 -d "$DB" -f "$f"
    done
    echo "✅ All migrations applied to $DB"

deliverables:
  - migrations/001_create_extensions.sql
  - migrations/002_create_enums.sql
  - migrations/003_create_tables.sql
  - migrations/004_create_indexes.sql
  - migrations/005_create_triggers.sql
  - migrations/006_seed_data.sql
  - migrations/007_verify_schema.sql
  - run_all_migrations.sh

verification_checklist:
  - pgvector extension installed and active
  - All enums created
  - All tables and partitions exist
  - Foreign keys valid (no dangling refs)
  - Indexes present and usable
  - Sample employers/institutions inserted
  - Verification query returns clean report

execution_commands: |
  # one-time host dependency
  sudo apt-get install -y postgresql-15-pgvector
  # run migrations
  ./run_all_migrations.sh glohib
  # verify
  psql -d glohib -f migrations/007_verify_schema.sql

next_step: step_3_vector_etl_setup
```

---

**Token Usage:** {'prompt_tokens': 555, 'completion_tokens': 2882, 'total_tokens': 3437}
