-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NewsItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "category" TEXT,
    "expiresAt" DATETIME,
    "targetAudience" TEXT NOT NULL DEFAULT 'ALL',
    "displayPosition" TEXT NOT NULL DEFAULT 'BANNER',
    "imageUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_NewsItem" ("active", "category", "content", "createdAt", "displayPosition", "expiresAt", "id", "imageUrl", "priority", "targetAudience", "title", "updatedAt") SELECT "active", "category", "content", "createdAt", "displayPosition", "expiresAt", "id", "imageUrl", "priority", "targetAudience", "title", "updatedAt" FROM "NewsItem";
DROP TABLE "NewsItem";
ALTER TABLE "new_NewsItem" RENAME TO "NewsItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
