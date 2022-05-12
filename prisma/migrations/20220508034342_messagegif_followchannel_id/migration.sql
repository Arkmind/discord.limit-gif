/*
  Warnings:

  - You are about to drop the column `followChannelId` on the `MessageGif` table. All the data in the column will be lost.
  - Added the required column `followChannelChannelId` to the `MessageGif` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MessageGif" (
    "id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "followChannelChannelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "MessageGif_followChannelChannelId_fkey" FOREIGN KEY ("followChannelChannelId") REFERENCES "FollowChannel" ("channelId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MessageGif_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MessageGif" ("createdAt", "id", "message", "userId") SELECT "createdAt", "id", "message", "userId" FROM "MessageGif";
DROP TABLE "MessageGif";
ALTER TABLE "new_MessageGif" RENAME TO "MessageGif";
CREATE UNIQUE INDEX "MessageGif_id_key" ON "MessageGif"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
