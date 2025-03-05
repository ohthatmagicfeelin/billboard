import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed...');
    
    // Read the billboard.json file
    const billboardData = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, '../data/billboard.json'),
            'utf8'
        )
    );

    // Process in chunks to avoid memory issues
    const chunkSize = 100; // Process 100 charts at a time
    
    for (let i = 0; i < billboardData.length; i += chunkSize) {
        const chunk = billboardData.slice(i, i + chunkSize);
        
        console.log(`Processing charts ${i + 1} to ${i + chunk.length} of ${billboardData.length}`);
        
        // Process each chart in the chunk
        await Promise.all(chunk.map(async (chart) => {
            try {
                // Create the chart entry
                const chartEntry = await prisma.billboardChart.create({
                    data: {
                        chartDate: new Date(chart.date),
                        entries: {
                            create: chart.data.map(song => ({
                                song: song.song,
                                artist: song.artist,
                                thisWeek: song.this_week,
                                lastWeek: song.last_week,
                                peakPosition: song.peak_position,
                                weeksOnChart: song.weeks_on_chart
                            }))
                        }
                    }
                });
                
                console.log(`Created chart for ${chart.date}`);
            } catch (error) {
                console.error(`Error processing chart ${chart.date}:`, error);
            }
        }));
    }
    
    console.log('Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 