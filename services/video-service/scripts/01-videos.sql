CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY,
  applicant_id UUID NOT NULL,
  job_id UUID NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size BIGINT NOT NULL,
  status TEXT NOT NULL,
  metadata JSONB,
  transcript_text TEXT,
  transcript_vtt TEXT,
  grade_clarity SMALLINT,
  grade_content SMALLINT,
  grade_presence SMALLINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_videos_applicant ON videos(applicant_id);
CREATE INDEX idx_videos_job ON videos(job_id);
