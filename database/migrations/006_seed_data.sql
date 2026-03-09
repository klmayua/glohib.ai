-- 006_seed_data.sql
-- Glohib.ai Sample Data

-- ================================================================================
-- EMPLOYERS (Target: WHO, UNICEF, MSF, PATH, GAVI)
-- ================================================================================
INSERT INTO employers (id, name, tier, verified_domains) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'WHO',              'platinum', '{who.int}'),
    ('550e8400-e29b-41d4-a716-446655440002', 'UNICEF',           'gold',     '{unicef.org}'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Médecins Sans Frontières', 'gold', '{msf.org}'),
    ('550e8400-e29b-41d4-a716-446655440004', 'PATH',             'silver',   '{path.org}'),
    ('550e8400-e29b-41d4-a716-446655440005', 'GAVI',             'platinum', '{gavi.org}')
ON CONFLICT DO NOTHING;

-- ================================================================================
-- INSTITUTIONS
-- ================================================================================
INSERT INTO institutions (id, type, name, verified_domains) VALUES
    ('660e8400-e29b-41d4-a716-446655440101', 'university', 'University of Global Health', '{ugh.edu}'),
    ('660e8400-e29b-41d4-a716-446655440102', 'ngo',        'Health Alliance International', '{hai.org}'),
    ('660e8400-e29b-41d4-a716-446655440103', 'think_tank', 'Center for Health Policy', '{chp.org}')
ON CONFLICT DO NOTHING;
