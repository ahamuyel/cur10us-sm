-- CreateEnum
CREATE TYPE "SchoolStatus" AS ENUM ('pendente', 'aprovada', 'ativa', 'suspensa', 'rejeitada');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('pendente', 'em_analise', 'aprovada', 'matriculada', 'rejeitada');

-- Recreate the Role enum with new values using the rename-swap pattern
-- 1. Drop the column default (it references the old enum type)
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;

-- 2. Rename old enum
ALTER TYPE "Role" RENAME TO "Role_old";

-- 3. Create new enum with all values
CREATE TYPE "Role" AS ENUM ('super_admin', 'school_admin', 'teacher', 'student', 'parent');

-- 4. Convert User.role column: admin → school_admin
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role" USING (
    CASE "role"::text
        WHEN 'admin' THEN 'school_admin'::"Role"
        ELSE "role"::text::"Role"
    END
);

-- 5. Restore default
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'student'::"Role";

-- 6. Drop old enum
DROP TYPE "Role_old";

-- CreateTable School
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "cnpj" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "logo" TEXT,
    "status" "SchoolStatus" NOT NULL DEFAULT 'pendente',
    "rejectReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "School_slug_key" ON "School"("slug");
CREATE UNIQUE INDEX "School_email_key" ON "School"("email");

-- Create a default school for existing data
INSERT INTO "School" ("id", "name", "slug", "email", "phone", "address", "city", "state", "status", "updatedAt")
VALUES ('demo-escola-id', 'Escola Demo', 'demo-escola', 'contato@demo-escola.com', '11999999999', 'Rua Principal, 100', 'São Paulo', 'SP', 'ativa', NOW());

-- AlterTable User: add isActive and schoolId columns
ALTER TABLE "User" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "schoolId" TEXT;

-- Activate all existing users and assign to demo school
UPDATE "User" SET "isActive" = true;
UPDATE "User" SET "schoolId" = 'demo-escola-id' WHERE "role" != 'super_admin';

-- AlterTable Teacher: add schoolId as nullable first, populate, then make required
ALTER TABLE "Teacher" ADD COLUMN "schoolId" TEXT;
UPDATE "Teacher" SET "schoolId" = 'demo-escola-id';
ALTER TABLE "Teacher" ALTER COLUMN "schoolId" SET NOT NULL;

-- AlterTable Student: add schoolId as nullable first, populate, then make required
ALTER TABLE "Student" ADD COLUMN "schoolId" TEXT;
UPDATE "Student" SET "schoolId" = 'demo-escola-id';
ALTER TABLE "Student" ALTER COLUMN "schoolId" SET NOT NULL;

-- AlterTable Parent: add schoolId as nullable first, populate, then make required
ALTER TABLE "Parent" ADD COLUMN "schoolId" TEXT;
UPDATE "Parent" SET "schoolId" = 'demo-escola-id';
ALTER TABLE "Parent" ALTER COLUMN "schoolId" SET NOT NULL;

-- CreateTable Application
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "message" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'pendente',
    "rejectReason" TEXT,
    "trackingToken" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_trackingToken_key" ON "Application"("trackingToken");
CREATE UNIQUE INDEX "Application_userId_key" ON "Application"("userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Student" ADD CONSTRAINT "Student_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Application" ADD CONSTRAINT "Application_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
