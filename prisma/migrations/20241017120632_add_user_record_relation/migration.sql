/*
  Warnings:

  - Added the required column `userId` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
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
    "cover" TEXT,
    "rating" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Record_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Record" ("artist", "cover", "genre", "id", "label", "rating", "title", "year") SELECT "artist", "cover", "genre", "id", "label", "rating", "title", "year" FROM "Record";
DROP TABLE "Record";
ALTER TABLE "new_Record" RENAME TO "Record";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
