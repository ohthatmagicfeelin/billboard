/*
  Warnings:

  - You are about to drop the column `artist` on the `billboard_entries` table. All the data in the column will be lost.
  - You are about to drop the column `song` on the `billboard_entries` table. All the data in the column will be lost.
  - Added the required column `artist_id` to the `billboard_entries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `track_id` to the `billboard_entries` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "billboard_entries_song_artist_idx";

-- AlterTable
ALTER TABLE "billboard_entries" DROP COLUMN "artist",
DROP COLUMN "song",
ADD COLUMN     "artist_id" INTEGER NOT NULL,
ADD COLUMN     "track_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "artists" (
    "id" SERIAL NOT NULL,
    "billboardName" TEXT NOT NULL,
    "spotifyName" TEXT,
    "spotifyId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracks" (
    "id" SERIAL NOT NULL,
    "billboardName" TEXT NOT NULL,
    "spotifyName" TEXT,
    "spotifyId" TEXT,
    "artist_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "artists_billboardName_key" ON "artists"("billboardName");

-- CreateIndex
CREATE UNIQUE INDEX "artists_spotifyId_key" ON "artists"("spotifyId");

-- CreateIndex
CREATE INDEX "artists_billboardName_idx" ON "artists"("billboardName");

-- CreateIndex
CREATE INDEX "artists_spotifyId_idx" ON "artists"("spotifyId");

-- CreateIndex
CREATE UNIQUE INDEX "tracks_spotifyId_key" ON "tracks"("spotifyId");

-- CreateIndex
CREATE INDEX "tracks_billboardName_idx" ON "tracks"("billboardName");

-- CreateIndex
CREATE INDEX "tracks_spotifyId_idx" ON "tracks"("spotifyId");

-- CreateIndex
CREATE UNIQUE INDEX "tracks_billboardName_artist_id_key" ON "tracks"("billboardName", "artist_id");

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billboard_entries" ADD CONSTRAINT "billboard_entries_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billboard_entries" ADD CONSTRAINT "billboard_entries_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
