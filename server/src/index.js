// server/src/index.js
import express from "express";
import cors from "cors";
import config from './config/env.js';
import routes from './common/routes/routes.js';
import { errorHandler } from './middleware/error-handling/errorHandler.js';
import { sanitizeInputs } from './middleware/validation/sanitizeInput.js';
import { sessionMiddleware } from './config/session.js';
import { startJobs } from './jobs/index.js';
import { handleCsrfError } from './middleware/security/csrf.js';
import { debugMiddleware } from './middleware/error-handling/debug.js';
import corsOptions from './config/cors.js';

const app = express();

// middleware
if (config.NODE_ENV === 'production') {
    app.set('trust proxy', 1); // Trust proxy - important for secure cookies behind a proxy
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Security Middleware
app.use(cors(corsOptions));
app.use(sanitizeInputs); // Apply global sanitization middleware


// Session handling
app.use(sessionMiddleware);
// app.use(debugMiddleware); 


// request logging
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
});


app.use('/', routes);


// Error handling middleware (should be last)
app.use(handleCsrfError);
app.use(errorHandler);

app.listen(config.PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${config.PORT}`);
    startJobs();
});