import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function seedUsers() {
    console.log('Seeding users...');
    try {
        const hashedPassword = await bcrypt.hash('Pass!111', 10);
        const user = await prisma.user.upsert({
            where: { email: 'o@h.com' },
            update: {},
            create: {
                email: 'o@h.com',
                password: hashedPassword,
                emailVerified: true,
                settings: {
                    create: {
                        theme: 'system',
                        emailNotifications: true,
                        pushNotifications: true
                    }
                }
            }
        });
        console.log('Test user created:', user.email);
    } catch (error) {
        console.error('Error creating test user:', error);
    }
} 