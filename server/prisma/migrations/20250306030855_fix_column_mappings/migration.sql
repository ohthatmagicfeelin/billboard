/*
  Warnings:

  - You are about to drop the column `billboardName` on the `artists` table. All the data in the column will be lost.
  - You are about to drop the column `spotifyId` on the `artists` table. All the data in the column will be lost.
  - You are about to drop the column `spotifyName` on the `artists` table. All the data in the column will be lost.
  - You are about to drop the column `billboardName` on the `tracks` table. All the data in the column will be lost.
  - You are about to drop the column `spotifyId` on the `tracks` table. All the data in the column will be lost.
  - You are about to drop the column `spotifyName` on the `tracks` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[billboard_name]` on the table `artists` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[spotify_id]` on the table `artists` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[spotify_id]` on the table `tracks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[billboard_name,artist_id]` on the table `tracks` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `billboard_name` to the `artists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billboard_name` to the `tracks` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "artists_billboardName_idx";

-- DropIndex
DROP INDEX "artists_billboardName_key";

-- DropIndex
DROP INDEX "artists_spotifyId_idx";

-- DropIndex
DROP INDEX "artists_spotifyId_key";

-- DropIndex
DROP INDEX "tracks_billboardName_artist_id_key";

-- DropIndex
DROP INDEX "tracks_billboardName_idx";

-- DropIndex
DROP INDEX "tracks_spotifyId_idx";

-- DropIndex
DROP INDEX "tracks_spotifyId_key";

-- AlterTable
ALTER TABLE "artists" DROP COLUMN "billboardName",
DROP COLUMN "spotifyId",
DROP COLUMN "spotifyName",
ADD COLUMN     "billboard_name" TEXT NOT NULL,
ADD COLUMN     "spotify_id" TEXT,
ADD COLUMN     "spotify_name" TEXT;

-- AlterTable
ALTER TABLE "tracks" DROP COLUMN "billboardName",
DROP COLUMN "spotifyId",
DROP COLUMN "spotifyName",
ADD COLUMN     "billboard_name" TEXT NOT NULL,
ADD COLUMN     "spotify_id" TEXT,
ADD COLUMN     "spotify_name" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "artists_billboard_name_key" ON "artists"("billboard_name");

-- CreateIndex
CREATE UNIQUE INDEX "artists_spotify_id_key" ON "artists"("spotify_id");

-- CreateIndex
CREATE INDEX "artists_billboard_name_idx" ON "artists"("billboard_name");

-- CreateIndex
CREATE INDEX "artists_spotify_id_idx" ON "artists"("spotify_id");

-- CreateIndex
CREATE UNIQUE INDEX "tracks_spotify_id_key" ON "tracks"("spotify_id");

-- CreateIndex
CREATE INDEX "tracks_billboard_name_idx" ON "tracks"("billboard_name");

-- CreateIndex
CREATE INDEX "tracks_spotify_id_idx" ON "tracks"("spotify_id");

-- CreateIndex
CREATE UNIQUE INDEX "tracks_billboard_name_artist_id_key" ON "tracks"("billboard_name", "artist_id");
