/*
  Warnings:

  - The primary key for the `Job` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `accommodation` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `approved` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `basicMonthlySalaryUSD` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `bonuses` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `companyCar` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `freeMeals` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `hiringFrom` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `transportation` on the `Job` table. All the data in the column will be lost.
  - Added the required column `salary` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Made the column `location` on table `Job` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "candidateId" INTEGER,
    "employerId" INTEGER NOT NULL,
    "jobId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "resumePath" TEXT NOT NULL,
    "extractedText" TEXT,
    "extractedName" TEXT,
    "extractedEmail" TEXT,
    "extractedPhone" TEXT,
    "extractedSkills" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Application_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Application_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("candidateId", "createdAt", "employerId", "extractedEmail", "extractedName", "extractedPhone", "extractedSkills", "extractedText", "id", "jobId", "resumePath", "status") SELECT "candidateId", "createdAt", "employerId", "extractedEmail", "extractedName", "extractedPhone", "extractedSkills", "extractedText", "id", "jobId", "resumePath", "status" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE TABLE "new_Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT '',
    "jobType" TEXT NOT NULL DEFAULT 'FULL_TIME',
    "salaryType" TEXT NOT NULL DEFAULT 'ANNUAL',
    "salary" INTEGER NOT NULL DEFAULT 0,
    "salaryRange" TEXT,
    "vacancies" INTEGER NOT NULL DEFAULT 1,
    "experience" TEXT NOT NULL DEFAULT 'ENTRY_LEVEL',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employerId" INTEGER NOT NULL,
    CONSTRAINT "Job_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Job" ("createdAt", "description", "employerId", "id", "location", "slug", "title", "salary") SELECT "createdAt", "description", "employerId", "id", COALESCE("location", ''), "slug", "title", 0 FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
CREATE UNIQUE INDEX "Job_slug_key" ON "Job"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
