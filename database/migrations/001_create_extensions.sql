-- 001_create_extensions.sql
-- Glohib.ai Database Extensions
-- Requires PostgreSQL 15+ with pgvector 0.5+

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gist";
CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA public;

-- Verify vector dimension limit
SELECT extversion FROM pg_extension WHERE extname='vector';
