-- Glohib.ai - PostgreSQL initialization script
-- This script runs on first container startup

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

-- Create schemas
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS users;
CREATE SCHEMA IF NOT EXISTS ai;
CREATE SCHEMA IF NOT EXISTS video;

-- Create application role
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'glohib_app') THEN
        CREATE ROLE glohib_app WITH LOGIN PASSWORD 'changeme';
    END IF;
END
$$;

GRANT ALL PRIVILEGES ON DATABASE glohib_db TO glohib_app;
GRANT ALL ON SCHEMA auth TO glohib_app;
GRANT ALL ON SCHEMA users TO glohib_app;
GRANT ALL ON SCHEMA ai TO glohib_app;
GRANT ALL ON SCHEMA video TO glohib_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO glohib_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO glohib_app;
