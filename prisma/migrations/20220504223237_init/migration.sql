-- CreateTable
CREATE TABLE "Guild" (
    "id" BIGINT NOT NULL
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" BIGINT NOT NULL,
    "guildId" BIGINT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "deleted" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "Channel_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Guild_id_key" ON "Guild"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_id_key" ON "Channel"("id");
