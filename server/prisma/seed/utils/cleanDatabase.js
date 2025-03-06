import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function cleanDatabase() {
    console.log('Cleaning database...');
    
    // Delete all records from tables in the correct order
    await prisma.billboardEntry.deleteMany({});
    await prisma.billboardChart.deleteMany({});
    await prisma.track.deleteMany({});
    await prisma.artist.deleteMany({});
    await prisma.emailVerificationToken.deleteMany({});
    await prisma.passwordResetToken.deleteMany({});
    await prisma.feedback.deleteMany({});
    await prisma.userSettings.deleteMany({});
    await prisma.subscription.deleteMany({});
    await prisma.auditLog.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.user.deleteMany({});
    
    console.log('Database cleaned');
} 