CREATE TABLE assessments (
    id UUID PRIMARY KEY,
    candidate_id UUID NOT NULL,
    job_id UUID NOT NULL,
    state TEXT NOT NULL,
    overall_score REAL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ
);

CREATE TABLE stages (
    id UUID PRIMARY KEY,
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    score REAL DEFAULT 0,
    pass BOOLEAN DEFAULT false,
    feedback TEXT,
    answers JSONB,
    started_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_stages_assessment ON stages(assessment_id);
