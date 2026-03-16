# 10 - Data Models and Storage

**Forensic Scan Date:** 2026-03-11
**Project:** GlohibAI

---

## Database Overview

**Primary Database:** PostgreSQL 16 + pgvector
**Cache:** Redis 7
**Object Storage:** MinIO
**Vector DB:** Qdrant (configured, unused)

---

## PostgreSQL Schema

### Core Tables

#### users (Identity Service)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) NOT NULL,
    google_id VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### api_keys (Identity Service)
```sql
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    key_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### student_profiles (Student Service)
```sql
CREATE TABLE student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    full_name VARCHAR(255),
    bio TEXT,
    location VARCHAR(255),
    availability BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### skills (Student Service)
```sql
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id),
    name VARCHAR(255) NOT NULL,
    level VARCHAR(50),
    years_experience INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### education (Student Service)
```sql
CREATE TABLE education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id),
    institution VARCHAR(255),
    degree VARCHAR(255),
    field_of_study VARCHAR(255),
    start_date DATE,
    end_date DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### experience (Student Service)
```sql
CREATE TABLE experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id),
    company VARCHAR(255),
    position VARCHAR(255),
    start_date DATE,
    end_date DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### internships (Internship Service)
```sql
CREATE TABLE internships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employer_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    requirements TEXT[],
    location VARCHAR(255),
    remote BOOLEAN DEFAULT false,
    stipend DECIMAL(10,2),
    duration_months INTEGER,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### internship_vectors (Internship Service)
```sql
CREATE TABLE internship_vectors (
    internship_id UUID PRIMARY KEY REFERENCES internships(id),
    embedding VECTOR(384),
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### applications (Internship Service)
```sql
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    internship_id UUID REFERENCES internships(id),
    student_id UUID REFERENCES student_profiles(id),
    status VARCHAR(50) DEFAULT 'pending',
    cover_letter TEXT,
    submitted_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP,
    UNIQUE(internship_id, student_id)
);
```

#### assessments (Assessment Service)
```sql
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    title VARCHAR(255),
    stage INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'pending',
    score DECIMAL(5,2),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### videos (Video Service)
```sql
CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    title VARCHAR(255),
    minio_key VARCHAR(255),
    duration_seconds INTEGER,
    transcription TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Database Extensions

| Extension | Purpose | Status |
|-----------|---------|--------|
| pgvector | Vector similarity search | ✅ Enabled |
| uuid-ossp | UUID generation | ✅ Enabled |
| pgcrypto | Cryptographic functions | ✅ Enabled |
| citext | Case-insensitive text | ✅ Enabled |

---

## Indexes

### Standard Indexes

| Table | Column(s) | Type | Purpose |
|-------|-----------|------|---------|
| users | email | B-tree | Login lookup |
| users | google_id | B-tree | OAuth lookup |
| student_profiles | user_id | B-tree | Profile lookup |
| skills | student_id | B-tree | Skills query |
| internships | status | B-tree | Active listings |
| applications | student_id | B-tree | User applications |
| applications | internship_id | B-tree | Internship applicants |

### Vector Indexes

| Table | Column | Index Type | Status |
|-------|--------|------------|--------|
| internship_vectors | embedding | HNSW (recommended) | ⚠️ Not created |
| student_vectors | embedding | HNSW (recommended) | ⚠️ Not created |

---

## Redis Usage

### Cache Keys

| Pattern | Purpose | TTL |
|---------|---------|-----|
| session:{user_id} | User sessions | 24h |
| token:blacklist:{jti} | Revoked tokens | Until expiry |
| profile:{student_id} | Profile cache | 1h |
| internship:{id} | Internship cache | 30m |
| recommendations:{user_id} | Recommendation cache | 1h |
| upload:{id} | TUS upload state | 24h |

### Behavioral Tracking

| Key | Purpose | Type |
|-----|---------|------|
| behavior:{student_id} | User activity | Sorted Set |
| views:{internship_id} | View counts | String |
| clicks:{student_id} | Click tracking | List |

---

## MinIO Storage

### Buckets

| Bucket | Purpose | Access |
|--------|---------|--------|
| glohib (default) | General storage | Private |
| videos | Video files | Private |
| transcripts | Transcription files | Private |
| assets | Static assets | Public |

### Object Key Patterns

```
videos/{user_id}/{video_id}/{timestamp}.mp4
transcripts/{user_id}/{video_id}/{timestamp}.txt
assets/{category}/{filename}
```

---

## Data Models (TypeScript)

### User Models

```typescript
interface User {
  id: string;
  email: string;
  role: 'student' | 'employer' | 'admin';
  googleId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UserProfile {
  id: string;
  userId: string;
  fullName?: string;
  bio?: string;
  location?: string;
  availability: boolean;
}
```

### Student Models

```typescript
interface StudentProfile {
  id: string;
  userId: string;
  fullName?: string;
  bio?: string;
  location?: string;
  skills: Skill[];
  education: Education[];
  experience: Experience[];
}

interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  yearsExperience: number;
}
```

### Internship Models

```typescript
interface Internship {
  id: string;
  employerId: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  remote: boolean;
  stipend?: number;
  durationMonths: number;
  status: 'draft' | 'active' | 'closed';
}

interface Application {
  id: string;
  internshipId: string;
  studentId: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  coverLetter?: string;
  submittedAt: Date;
}
```

---

## Data Access Patterns

### ORM Usage

| Service | ORM | Status |
|---------|-----|--------|
| Identity | GORM | ✅ |
| Student | GORM | ✅ |
| Internship | GORM | ✅ |
| Assessment | GORM | ✅ |
| Recommendation | SQLAlchemy | ✅ |
| Scoring | SQLAlchemy | ✅ |
| Video | Custom SQL | ✅ |

### Query Patterns

```python
# Recommendation Service - Vector Search
SELECT internship_id, 1 - (embedding <=> :vec) AS similarity
FROM internship_vectors
ORDER BY embedding <=> :vec
LIMIT 10;

# Scoring Service - Feature Extraction
SELECT s.*, e.institution, ex.company
FROM student_profiles s
LEFT JOIN education e ON s.id = e.student_id
LEFT JOIN experience ex ON s.id = ex.student_id
WHERE s.id = :student_id;
```

---

## Data Storage Score: 75/100

| Dimension | Score | Notes |
|-----------|-------|-------|
| Schema Design | 80/100 | Well normalized |
| Indexing | 70/100 | Basic indexes, missing vector indexes |
| Caching | 75/100 | Redis used appropriately |
| Object Storage | 80/100 | MinIO configured well |
| Data Integrity | 75/100 | Foreign keys present |
| Performance | 70/100 | Could optimize more |

---

## Recommendations

### Immediate

1. **Create Vector Indexes**
   ```sql
   CREATE INDEX ON internship_vectors USING hnsw (embedding vector_cosine_ops);
   ```

2. **Add Missing Indexes**
   ```sql
   CREATE INDEX idx_applications_status ON applications(status);
   CREATE INDEX idx_internships_location ON internships(location);
   ```

### Short Term

1. **Add Database Migrations**
   - Version control all schema changes
   - Add rollback scripts

2. **Implement Connection Pooling**
   - Tune pool size per service
   - Add connection monitoring

### Long Term

1. **Database Separation**
   - Plan migration to DB-per-service
   - Add read replicas

2. **Backup Strategy**
   - Automated daily backups
   - Point-in-time recovery

---

*Report Generated: 2026-03-11*
*Forensic Scan Version: 2.0*
