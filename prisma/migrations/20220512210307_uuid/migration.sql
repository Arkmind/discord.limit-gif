-- RedefineIndex
DROP INDEX "roleUserId";
CREATE UNIQUE INDEX "RoleOverUser_roleId_userId_key" ON "RoleOverUser"("roleId", "userId");
