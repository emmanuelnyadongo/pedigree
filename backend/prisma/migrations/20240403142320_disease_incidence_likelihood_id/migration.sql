/*
  Warnings:

  - You are about to drop the column `diseases_incidence_likelihood_id` on the `BreedDisease` table. All the data in the column will be lost.
  - Added the required column `disease_incidence_likelihood_id` to the `BreedDisease` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BreedDisease" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "breed_id" TEXT NOT NULL,
    "disease_id" TEXT NOT NULL,
    "disease_incidence_likelihood_id" TEXT NOT NULL,
    "treatment" TEXT NOT NULL,
    "precautions" TEXT NOT NULL,
    CONSTRAINT "BreedDisease_breed_id_fkey" FOREIGN KEY ("breed_id") REFERENCES "Breed" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BreedDisease_disease_id_fkey" FOREIGN KEY ("disease_id") REFERENCES "Disease" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BreedDisease_disease_incidence_likelihood_id_fkey" FOREIGN KEY ("disease_incidence_likelihood_id") REFERENCES "Likelihood" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BreedDisease" ("breed_id", "disease_id", "id", "precautions", "treatment") SELECT "breed_id", "disease_id", "id", "precautions", "treatment" FROM "BreedDisease";
DROP TABLE "BreedDisease";
ALTER TABLE "new_BreedDisease" RENAME TO "BreedDisease";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
