-- 002_create_enums.sql
-- Glohib.ai Database Enumerations

DO $$ BEGIN
    CREATE TYPE employer_tier AS ENUM ('bronze','silver','gold','platinum');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE institution_type AS ENUM ('university','college','ngo','think_tank','gov');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE assessment_stage AS ENUM ('screening','technical','cultural','final');
EXCEPTION WHEN duplicate_object THEN null; END $$;
