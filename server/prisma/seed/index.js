import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { cleanDatabase } from './utils/cleanDatabase.js';
import { seedBillboardData } from './seeders/billboardSeeder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
    await cleanDatabase();
    
    console.log('Starting seed...');
    
    // Read billboard data
    const billboardData = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, '../../data/billboard.json'),
            'utf8'
        )
    );

    // Seed billboard data
    await seedBillboardData(billboardData);
    
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
