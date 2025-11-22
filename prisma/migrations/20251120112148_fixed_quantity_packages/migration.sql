/*
  Warnings:

  - You are about to drop the column `maxQuantity` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `minQuantity` on the `Package` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `Package` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Package" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1000,
    "serviceId" TEXT NOT NULL,
    CONSTRAINT "Package_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Package" ("description", "id", "name", "price", "serviceId", "quantity") SELECT "description", "id", "name", "price", "serviceId", "minQuantity" FROM "Package";
DROP TABLE "Package";
ALTER TABLE "new_Package" RENAME TO "Package";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
