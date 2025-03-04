// src/config/env.js
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Only load dotenv in development
if (process.env.NODE_ENV !== 'production') {
    const dotenv = await import('dotenv');
    dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

export default {
    NODE_ENV: process.env.NODE_ENV,
    DEBUG: process.env.DEBUG === 'true',
    PORT: process.env.PORT,
    FRONTEND_URL: process.env.FRONTEND_URL,
    BACKEND_URL: process.env.BACKEND_URL,
    APP_ROUTE: process.env.APP_ROUTE,

    // Postgres
    PG_USER: process.env.PG_USER,
    PG_PASSWORD: process.env.PG_PASSWORD,
    PG_HOST: process.env.PG_HOST,
    PG_PORT: process.env.PG_PORT,
    PG_DATABASE: process.env.PG_DATABASE,

    // Prisma
    DATABASE_URL: `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`,

    // Stripe
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,

    // Session
    SESSION_SECRET: process.env.SESSION_SECRET,

    // JWT
    JWT_SECRET: process.env.JWT_SECRET,

    // Email configuration
    EMAIL_DEBUG: process.env.EMAIL_DEBUG === 'true',
    EMAIL_SMTP_HOST: process.env.EMAIL_SMTP_HOST,
    EMAIL_SMTP_PORT: process.env.EMAIL_SMTP_PORT,
    EMAIL_SMTP_USER: process.env.EMAIL_SMTP_USER,
    EMAIL_SMTP_PASS: process.env.EMAIL_SMTP_PASS,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,

    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID
};