-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Record" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "cover" TEXT
);
INSERT INTO "new_Record" ("artist", "cover", "genre", "id", "label", "rating", "title", "year") SELECT "artist", "cover", "genre", "id", "label", "rating", "title", "year" FROM "Record";
DROP TABLE "Record";
ALTER TABLE "new_Record" RENAME TO "Record";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
