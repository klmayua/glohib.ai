-- 004_create_indexes.sql
-- Glohib.ai Database Indexes

-- ================================================================================
-- STUDENTS
-- ================================================================================
CREATE INDEX IF NOT EXISTS idx_students_email ON students USING btree (email);
CREATE INDEX IF NOT EXISTS idx_students_profile_vector ON students USING ivfflat (profile_vector vector_cosine_ops);

-- ================================================================================
-- EMPLOYERS
-- ================================================================================
CREATE INDEX IF NOT EXISTS idx_employers_tier ON employers USING btree (tier);
CREATE INDEX IF NOT EXISTS idx_employers_api_key ON employers USING btree (api_key);

-- ================================================================================
-- MENTORS
-- ================================================================================
CREATE INDEX IF NOT EXISTS idx_mentors_student_id ON mentors USING btree (student_id);
CREATE INDEX IF NOT EXISTS idx_mentors_expert ON mentors USING gin (expertise_tags);

-- ================================================================================
-- INSTITUTIONS
-- ================================================================================
CREATE INDEX IF NOT EXISTS idx_institutions_type ON institutions USING btree (type);

-- ================================================================================
-- INTERNSHIPS
-- ================================================================================
CREATE INDEX IF NOT EXISTS idx_internships_employer_id ON internships USING btree (employer_id);
CREATE INDEX IF NOT EXISTS idx_internships_active ON internships USING btree (active) WHERE active;
CREATE INDEX IF NOT EXISTS idx_internships_expires_at ON internships USING btree (expires_at) WHERE active;
CREATE INDEX IF NOT EXISTS idx_internships_vector ON internships USING ivfflat (vector vector_cosine_ops);

-- ================================================================================
-- ASSESSMENTS
-- ================================================================================
CREATE INDEX IF NOT EXISTS idx_assessments_student_id ON assessments USING btree (student_id);
CREATE INDEX IF NOT EXISTS idx_assessments_stage ON assessments USING btree (stage);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments USING btree (created_at);

-- ================================================================================
-- VIDEO SUBMISSIONS
-- ================================================================================
CREATE INDEX IF NOT EXISTS idx_video_submissions_assessment_id ON video_submissions USING btree (assessment_id);
