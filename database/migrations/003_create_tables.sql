-- 003_create_tables.sql
-- Glohib.ai Core Tables

-- ================================================================================
-- STAKEHOLDER TABLES
-- ================================================================================

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

-- ================================================================================
-- CORE TABLES
-- ================================================================================

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

-- Partitioned assessments table (by month)
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

-- Create monthly partitions for 2 years ahead
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
