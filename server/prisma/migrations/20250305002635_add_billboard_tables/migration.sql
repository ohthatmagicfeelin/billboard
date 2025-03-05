-- CreateTable
CREATE TABLE "billboard_charts" (
    "id" SERIAL NOT NULL,
    "chart_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "billboard_charts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billboard_entries" (
    "id" SERIAL NOT NULL,
    "chart_id" INTEGER NOT NULL,
    "song" VARCHAR(255) NOT NULL,
    "artist" VARCHAR(255) NOT NULL,
    "this_week" INTEGER NOT NULL,
    "last_week" INTEGER,
    "peak_position" INTEGER NOT NULL,
    "weeks_on_chart" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "billboard_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "billboard_charts_chart_date_key" ON "billboard_charts"("chart_date");

-- CreateIndex
CREATE INDEX "billboard_charts_chart_date_idx" ON "billboard_charts"("chart_date");

-- CreateIndex
CREATE INDEX "billboard_entries_song_artist_idx" ON "billboard_entries"("song", "artist");

-- CreateIndex
CREATE UNIQUE INDEX "billboard_entries_chart_id_this_week_key" ON "billboard_entries"("chart_id", "this_week");

-- AddForeignKey
ALTER TABLE "billboard_entries" ADD CONSTRAINT "billboard_entries_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "billboard_charts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
