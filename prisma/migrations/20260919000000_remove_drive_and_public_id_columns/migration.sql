-- Drop columns from Group table first (lower dependency)
ALTER TABLE "Group" DROP COLUMN IF EXISTS "coverImagePublicId";

-- Drop columns from Note table
ALTER TABLE "Note" DROP COLUMN IF EXISTS "fullFilePublicId";
ALTER TABLE "Note" DROP COLUMN IF EXISTS "fullFileBytes";
ALTER TABLE "Note" DROP COLUMN IF EXISTS "pdfSource";
ALTER TABLE "Note" DROP COLUMN IF EXISTS "drivePdfUrl";
ALTER TABLE "Note" DROP COLUMN IF EXISTS "previewFilePublicId";
ALTER TABLE "Note" DROP COLUMN IF EXISTS "previewFileBytes";
ALTER TABLE "Note" DROP COLUMN IF EXISTS "coverImagePublicId";

-- Drop the PdfSource enum type (no longer referenced)
DROP TYPE IF EXISTS "PdfSource";
