-- Finalized SQL Migration Script for SDP Suite Online
-- Run this in your Supabase SQL Editor to ensure schema integrity.

-- 1. Create Granular Tables with Unique Constraints
-- Unique constraints on (group_id, row_key) are MANDATORY for upsert to work.

CREATE TABLE IF NOT EXISTS pestel_rows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id TEXT NOT NULL,
    row_key TEXT NOT NULL,
    content JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, row_key)
);

CREATE TABLE IF NOT EXISTS vrio_rows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id TEXT NOT NULL,
    row_key TEXT NOT NULL,
    content JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, row_key)
);

CREATE TABLE IF NOT EXISTS tows_rows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id TEXT NOT NULL,
    row_key TEXT NOT NULL,
    content JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, row_key)
);

CREATE TABLE IF NOT EXISTS porter_rows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id TEXT NOT NULL,
    row_key TEXT NOT NULL,
    content JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, row_key)
);

CREATE TABLE IF NOT EXISTS mckinsey_rows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id TEXT NOT NULL,
    content JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id)
);

CREATE TABLE IF NOT EXISTS meta_data (
    group_id TEXT PRIMARY KEY,
    content JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_pestel_group ON pestel_rows(group_id);
CREATE INDEX IF NOT EXISTS idx_vrio_group ON vrio_rows(group_id);
CREATE INDEX IF NOT EXISTS idx_tows_group ON tows_rows(group_id);
CREATE INDEX IF NOT EXISTS idx_porter_group ON porter_rows(group_id);
CREATE INDEX IF NOT EXISTS idx_mckinsey_group ON mckinsey_rows(group_id);

-- 2. Optional: Enable RLS (Security)
-- For development simplicity, you might keep these open or set them to 'true'
ALTER TABLE pestel_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE vrio_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE tows_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE porter_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE mckinsey_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_data ENABLE ROW LEVEL SECURITY;

-- Allow all access for now (update this for production security)
CREATE POLICY "Public Access" ON pestel_rows FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON vrio_rows FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON tows_rows FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON porter_rows FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON mckinsey_rows FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON meta_data FOR ALL USING (true) WITH CHECK (true);
