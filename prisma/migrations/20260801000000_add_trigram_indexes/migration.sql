-- Enable pg_trgm extension for trigram-based text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- GIN indexes for fast LIKE '%term%' (contains) searches
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_name_de_trgm ON "Product" USING gin("nameDe" gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_description_de_trgm ON "Product" USING gin("descriptionDe" gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_brand_trgm ON "Product" USING gin(brand gin_trgm_ops);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_category_name_de_trgm ON "Category" USING gin("nameDe" gin_trgm_ops);
