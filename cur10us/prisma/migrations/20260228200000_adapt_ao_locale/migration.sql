-- Adapt schema for Angolan Portuguese (pt-AO)
ALTER TABLE "School" RENAME COLUMN "cnpj" TO "nif";
ALTER TABLE "School" RENAME COLUMN "state" TO "provincia";
ALTER TABLE "Student" RENAME COLUMN "serie" TO "classe";
