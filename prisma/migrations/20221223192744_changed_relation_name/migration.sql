/*
  Warnings:

  - You are about to drop the column `followingId` on the `Follower` table. All the data in the column will be lost.
  - Added the required column `followedById` to the `Follower` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Follower" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "followedById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Follower_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Follower_followedById_fkey" FOREIGN KEY ("followedById") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Follower" ("createdAt", "userId") SELECT "createdAt", "userId" FROM "Follower";
DROP TABLE "Follower";
ALTER TABLE "new_Follower" RENAME TO "Follower";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
