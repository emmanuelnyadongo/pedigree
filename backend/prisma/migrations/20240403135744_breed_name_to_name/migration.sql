/*
  Warnings:

  - You are about to drop the column `breed_name` on the `Breed` table. All the data in the column will be lost.
  - Added the required column `name` to the `Breed` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Breed" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "animal_id" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "daily_feed" REAL NOT NULL,
    "daily_water" REAL NOT NULL,
    "min_temp" REAL NOT NULL,
    "max_temp" REAL NOT NULL,
    "annual_fertility_rate" REAL NOT NULL,
    CONSTRAINT "Breed_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "Animal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Breed_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Breed" ("animal_id", "annual_fertility_rate", "daily_feed", "daily_water", "id", "max_temp", "min_temp", "supplier_id") SELECT "animal_id", "annual_fertility_rate", "daily_feed", "daily_water", "id", "max_temp", "min_temp", "supplier_id" FROM "Breed";
DROP TABLE "Breed";
ALTER TABLE "new_Breed" RENAME TO "Breed";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
