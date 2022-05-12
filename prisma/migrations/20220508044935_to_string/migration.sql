/*
  Warnings:

  - You are about to drop the column `toString` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `toString` on the `User` table. All the data in the column will be lost.
  - Added the required column `mentionable` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Channel" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "deleted" BOOLEAN NOT NULL,
    "mentionable" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "Channel_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Channel" ("createdAt", "deleted", "guildId", "id", "name", "type") SELECT "createdAt", "deleted", "guildId", "id", "name", "type" FROM "Channel";
DROP TABLE "Channel";
ALTER TABLE "new_Channel" RENAME TO "Channel";
CREATE UNIQUE INDEX "Channel_id_key" ON "Channel"("id");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL,
    "avatar" TEXT,
    "username" TEXT,
    "discriminator" TEXT,
    "mentionable" TEXT
);
INSERT INTO "new_User" ("avatar", "discriminator", "id", "username") SELECT "avatar", "discriminator", "id", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
