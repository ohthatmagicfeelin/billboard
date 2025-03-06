import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedBillboardData(billboardData) {
    const chunkSize = 100;
    let totalCharts = 0;
    let totalEntries = 0;
    let uniqueArtists = new Set();
    let uniqueTracks = new Set();
    
    for (let i = 0; i < billboardData.length; i += chunkSize) {
        const chunk = billboardData.slice(i, i + chunkSize);
        console.log(`Processing charts ${i + 1} to ${i + chunk.length} of ${billboardData.length}`);
        
        // Process each chart sequentially to avoid race conditions
        for (const chart of chunk) {
            try {
                const chartEntry = await prisma.billboardChart.create({
                    data: {
                        chartDate: new Date(chart.date)
                    }
                });
                totalCharts++;

                // Process each song in the chart
                for (const song of chart.data) {
                    uniqueArtists.add(song.artist);
                    uniqueTracks.add(`${song.artist}-${song.song}`);

                    // First find the artist without creating
                    let artist = await prisma.artist.findUnique({
                        where: { billboardName: song.artist }
                    });

                    // If artist doesn't exist, create it
                    if (!artist) {
                        artist = await prisma.artist.create({
                            data: { billboardName: song.artist }
                        });
                    }

                    // First find the track without creating
                    let track = await prisma.track.findUnique({
                        where: {
                            billboardName_artistId: {
                                billboardName: song.song,
                                artistId: artist.id
                            }
                        }
                    });

                    // If track doesn't exist, create it
                    if (!track) {
                        track = await prisma.track.create({
                            data: {
                                billboardName: song.song,
                                artistId: artist.id
                            }
                        });
                    }

                    // Create billboard entry
                    await prisma.billboardEntry.create({
                        data: {
                            chartId: chartEntry.id,
                            trackId: track.id,
                            artistId: artist.id,
                            thisWeek: song.this_week,
                            lastWeek: song.last_week,
                            peakPosition: song.peak_position,
                            weeksOnChart: song.weeks_on_chart
                        }
                    });
                    totalEntries++;
                }
                
                console.log(`Created chart for ${chart.date}`);
            } catch (error) {
                console.error(`Error processing chart ${chart.date}:`, error);
            }
        }
    }
    
    console.log('\nSeeding Summary:');
    console.log(`Total Charts Created: ${totalCharts}`);
    console.log(`Total Unique Artists: ${uniqueArtists.size}`);
    console.log(`Total Unique Tracks: ${uniqueTracks.size}`);
    console.log(`Total Billboard Entries: ${totalEntries}`);
} 