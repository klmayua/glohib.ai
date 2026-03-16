-- 003_create_tables.sql
-- Glohib.ai Core Tables

-- ================================================================================
-- AUTH & USER TABLES
-- ================================================================================

CREATE TABLE IF NOT EXISTS users (
    id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email         citext NOT NULL UNIQUE,
    password_hash text   NOT NULL,
    roles         text[] NOT NULL DEFAULT '{student}',
    provider      text   NOT NULL DEFAULT 'local',
    provider_id   text,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS api_keys (
    id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    key_hash      text NOT NULL UNIQUE,
    created_at    timestamptz NOT NULL DEFAULT now()
);

-- ================================================================================
-- STAKEHOLDER TABLES
-- ================================================================================

CREATE TABLE IF NOT EXISTS students (
    id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id       uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    email         citext NOT NULL UNIQUE,
    first_name    text,
    last_name     text,
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
    title       text NOT NULL,
    description text,
    metadata    jsonb NOT NULL DEFAULT '{}',
    vector      vector(512),
    active      boolean NOT NULL DEFAULT true,
    expires_at  timestamptz,
    created_at  timestamptz NOT NULL DEFAULT now(),
    CHECK (expires_at IS NULL OR expires_at > created_at)
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
    id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id    uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    name          text NOT NULL,
    proficiency   int CHECK (proficiency BETWEEN 1 AND 5),
    category      text,
    created_at    timestamptz NOT NULL DEFAULT now()
);

-- Student vectors table
CREATE TABLE IF NOT EXISTS student_vectors (
    id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id    uuid NOT NULL UNIQUE REFERENCES students(id) ON DELETE CASCADE,
    embedding     vector(512),
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Assessments table (simplified - no partitioning for now)
CREATE TABLE IF NOT EXISTS assessments (
    id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id  uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    stage       assessment_stage NOT NULL,
    answers     jsonb NOT NULL DEFAULT '{}',
    scores      jsonb NOT NULL DEFAULT '{}',
    pass        boolean,
    ai_explain  text,
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS video_submissions (
    id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id  uuid NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    object_path    text NOT NULL,
    transcription  text,
    ai_grade       jsonb NOT NULL DEFAULT '{}',
    duration_sec   int CHECK (duration_sec > 0),
    created_at     timestamptz NOT NULL DEFAULT now()
);
