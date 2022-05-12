-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Channel" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "deleted" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "Channel_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Channel" ("createdAt", "deleted", "guildId", "id", "name", "type") SELECT "createdAt", "deleted", "guildId", "id", "name", "type" FROM "Channel";
DROP TABLE "Channel";
ALTER TABLE "new_Channel" RENAME TO "Channel";
CREATE UNIQUE INDEX "Channel_id_key" ON "Channel"("id");
CREATE TABLE "new_Guild" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Guild" ("id", "name") SELECT "id", "name" FROM "Guild";
DROP TABLE "Guild";
ALTER TABLE "new_Guild" RENAME TO "Guild";
CREATE UNIQUE INDEX "Guild_id_key" ON "Guild"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
