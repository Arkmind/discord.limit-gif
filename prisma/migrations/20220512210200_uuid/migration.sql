/*
  Warnings:

  - A unique constraint covering the columns `[roleId,userId]` on the table `RoleOverUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "roleUserId" ON "RoleOverUser"("roleId", "userId");
