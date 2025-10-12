-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Job" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "hiringFrom" TEXT,
    "basicMonthlySalaryUSD" REAL,
    "transportation" BOOLEAN NOT NULL DEFAULT false,
    "accommodation" BOOLEAN NOT NULL DEFAULT false,
    "freeMeals" BOOLEAN NOT NULL DEFAULT false,
    "bonuses" BOOLEAN NOT NULL DEFAULT false,
    "companyCar" BOOLEAN NOT NULL DEFAULT false,
    "approved" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employerId" INTEGER NOT NULL,
    CONSTRAINT "Job_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Job" ("accommodation", "approved", "basicMonthlySalaryUSD", "bonuses", "companyCar", "createdAt", "description", "employerId", "freeMeals", "hiringFrom", "id", "location", "slug", "title", "transportation") SELECT "accommodation", "approved", "basicMonthlySalaryUSD", "bonuses", "companyCar", "createdAt", "description", "employerId", "freeMeals", "hiringFrom", "id", "location", "slug", "title", "transportation" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
CREATE UNIQUE INDEX "Job_slug_key" ON "Job"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
