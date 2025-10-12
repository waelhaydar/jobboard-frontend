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
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employerId" INTEGER NOT NULL,
    "hiringFrom" TEXT,
    "basicMonthlySalaryUSD" INTEGER,
    "transportation" BOOLEAN NOT NULL DEFAULT false,
    "accommodation" BOOLEAN NOT NULL DEFAULT false,
    "freeMeals" BOOLEAN NOT NULL DEFAULT false,
    "bonuses" BOOLEAN NOT NULL DEFAULT false,
    "companyCar" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Job_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Job" ("accommodation", "basicMonthlySalaryUSD", "bonuses", "companyCar", "createdAt", "description", "employerId", "experience", "freeMeals", "hiringFrom", "id", "jobType", "location", "salary", "salaryRange", "salaryType", "slug", "title", "transportation", "vacancies") SELECT "accommodation", "basicMonthlySalaryUSD", "bonuses", "companyCar", "createdAt", "description", "employerId", "experience", "freeMeals", "hiringFrom", "id", "jobType", "location", "salary", "salaryRange", "salaryType", "slug", "title", "transportation", "vacancies" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
CREATE UNIQUE INDEX "Job_slug_key" ON "Job"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
