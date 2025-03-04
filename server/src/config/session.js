import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import prisma from '../db/client.js';
import config from './env.js';

// Initialize store
const store = new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000,
    dbRecordIdIsSessionId: true,
    ttl: 24 * 60 * 60 * 1000,
    sessionModelName: "Session",
    enableConcurrentSetInvocations: true,
    expiresField: 'expiresAt'
});

// Verify store is ready
await store.connect?.();

const cookieSettings = {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: config.NODE_ENV === 'production' ? config.APP_ROUTE : '/'
};

export const sessionConfig = {
    store,
    secret: config.SESSION_SECRET,
    name: config.APP_ROUTE.slice(1) + '.sessionId',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: cookieSettings,
    proxy: config.NODE_ENV === 'production',
    unset: 'keep'
};

// Export session middleware
export const sessionMiddleware = session(sessionConfig);