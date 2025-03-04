import config from './env.js';

const corsOptions = {
    origin: config.NODE_ENV === 'production' 
      ? config.FRONTEND_URL 
      : ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'Cookie'],
    exposedHeaders: ['X-CSRF-Token', 'Set-Cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 204
  };

export default corsOptions;