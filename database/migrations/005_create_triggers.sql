-- 005_create_triggers.sql
-- Glohib.ai Database Triggers

-- ================================================================================
-- Auto-lowercase emails
-- ================================================================================
CREATE OR REPLACE FUNCTION trg_lower_email()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    NEW.email := lower(NEW.email);
    RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_students_lower_email ON students;
CREATE TRIGGER trg_students_lower_email
    BEFORE INSERT OR UPDATE OF email ON students
    FOR EACH ROW EXECUTE FUNCTION trg_lower_email();

-- ================================================================================
-- Updated_at columns (optional but good practice)
-- ================================================================================
CREATE OR REPLACE FUNCTION trg_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        NEW.created_at := OLD.created_at; -- keep original
    END IF;
    RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_internships_updated ON internships;
CREATE TRIGGER trg_internships_updated
    BEFORE UPDATE ON internships
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();
