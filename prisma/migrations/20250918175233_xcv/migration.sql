-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "jobType" TEXT NOT NULL DEFAULT 'FULL_TIME',
    "salaryType" TEXT NOT NULL DEFAULT 'ANNUAL',
    "salary" INTEGER NOT NULL,
    "salaryRange" TEXT,
    "vacancies" INTEGER NOT NULL DEFAULT 1,
    "experience" TEXT NOT NULL DEFAULT 'ENTRY_LEVEL',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employerId" INTEGER NOT NULL,
    CONSTRAINT "Job_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Job" ("createdAt", "description", "employerId", "experience", "id", "jobType", "location", "salary", "salaryRange", "salaryType", "slug", "title", "vacancies") SELECT "createdAt", "description", "employerId", "experience", "id", "jobType", "location", "salary", "salaryRange", "salaryType", "slug", "title", "vacancies" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
CREATE UNIQUE INDEX "Job_slug_key" ON "Job"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
