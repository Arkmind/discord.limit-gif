/*
  Warnings:

  - Added the required column `followChannelId` to the `MessageGif` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MessageGif" (
    "id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "followChannelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "MessageGif_followChannelId_fkey" FOREIGN KEY ("followChannelId") REFERENCES "FollowChannel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MessageGif_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MessageGif" ("createdAt", "id", "message", "userId") SELECT "createdAt", "id", "message", "userId" FROM "MessageGif";
DROP TABLE "MessageGif";
ALTER TABLE "new_MessageGif" RENAME TO "MessageGif";
CREATE UNIQUE INDEX "MessageGif_id_key" ON "MessageGif"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
