CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE internships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id UUID NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(200),
  remote BOOLEAN DEFAULT false,
  paid BOOLEAN DEFAULT false,
  duration VARCHAR(100),
  skills TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  vector vector(512),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  internship_id UUID NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(internship_id, student_id)
);

CREATE INDEX idx_internships_employer_id ON internships(employer_id);
CREATE INDEX idx_internships_created_at ON internships(created_at DESC);
CREATE INDEX idx_internships_vector ON internships USING ivfflat (vector vector_cosine_ops);
CREATE INDEX idx_internships_skills ON internships USING gin (skills);
CREATE INDEX idx_internships_tags ON internships USING gin (tags);
CREATE INDEX idx_internships_remote ON internships(remote);
CREATE INDEX idx_internships_paid ON internships(paid);
CREATE INDEX idx_applications_internship_id ON applications(internship_id);
CREATE INDEX idx_applications_student_id ON applications(student_id);
CREATE INDEX idx_applications_status ON applications(status);
