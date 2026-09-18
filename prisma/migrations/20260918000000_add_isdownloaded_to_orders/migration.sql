-- Add isDownloaded column to Order table
ALTER TABLE "Order" ADD COLUMN "isDownloaded" BOOLEAN NOT NULL DEFAULT false;

-- Update Counter table to support new format
-- (Counter already exists, no changes needed for this migration)
