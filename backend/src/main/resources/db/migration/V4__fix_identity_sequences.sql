-- V4__fix_identity_sequences.sql
-- Restart identity sequences for all tables seeded with explicit IDs to avoid primary key collisions

ALTER TABLE users ALTER COLUMN id RESTART WITH 100;
ALTER TABLE customers ALTER COLUMN id RESTART WITH 100;
ALTER TABLE sites ALTER COLUMN id RESTART WITH 100;
ALTER TABLE work_orders ALTER COLUMN id RESTART WITH 100;
ALTER TABLE work_order_status_history ALTER COLUMN id RESTART WITH 100;
ALTER TABLE parts ALTER COLUMN id RESTART WITH 100;
ALTER TABLE part_usages ALTER COLUMN id RESTART WITH 100;
ALTER TABLE time_logs ALTER COLUMN id RESTART WITH 100;
