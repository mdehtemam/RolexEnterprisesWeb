-- ============================================================================
-- VERIFICATION SCRIPT - Simple version
-- ============================================================================

-- Check 1: List all tables
SELECT 'All Tables Created:' as check;
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check 2: Count tables
SELECT 'Total Tables:' as check, COUNT(*) as count
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- Check 3: List indexes
SELECT 'Indexes Created:' as check;
SELECT indexname FROM pg_indexes
WHERE schemaname = 'public' AND indexname LIKE 'idx_%'
ORDER BY indexname;

-- Check 4: Verify storage bucket
SELECT 'Storage Bucket:' as check;
SELECT id, name, public FROM storage.buckets WHERE id = 'product-images';

-- Final result
SELECT '✅ DATABASE SETUP COMPLETE!' as status;
