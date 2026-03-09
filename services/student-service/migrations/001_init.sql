CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  date_of_birth DATE,
  gender VARCHAR(20),
  nationality VARCHAR(100),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  profile_picture_url TEXT,
  bio TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT true,
  profile_complete FLOAT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  proficiency INT NOT NULL CHECK (proficiency BETWEEN 1 AND 5),
  category VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  institution VARCHAR(200) NOT NULL,
  degree VARCHAR(100) NOT NULL,
  field_of_study VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  gpa FLOAT CHECK (gpa BETWEEN 0 AND 4),
  description TEXT,
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  company VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profile_vectors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  vector vector(512) NOT NULL,
  vector_type VARCHAR(50) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  internship_id UUID NOT NULL,
  company_id UUID NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  cover_letter TEXT,
  resume_url TEXT NOT NULL,
  transcript_url TEXT,
  portfolio_url TEXT,
  expected_salary FLOAT,
  available_from DATE,
  available_to DATE,
  notes TEXT,
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  interview_at TIMESTAMPTZ,
  decision_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_deleted_at ON students(deleted_at);
CREATE INDEX idx_skills_student_id ON skills(student_id);
CREATE INDEX idx_education_student_id ON education(student_id);
CREATE INDEX idx_experience_student_id ON experience(student_id);
CREATE INDEX idx_profile_vectors_student_id ON profile_vectors(student_id);
CREATE INDEX idx_profile_vectors_type ON profile_vectors(vector_type);
CREATE INDEX idx_profile_vectors_vector ON profile_vectors USING ivfflat (vector vector_cosine_ops);
CREATE INDEX idx_applications_student_id ON applications(student_id);
CREATE INDEX idx_applications_internship_id ON applications(internship_id);
CREATE INDEX idx_applications_status ON applications(status);
