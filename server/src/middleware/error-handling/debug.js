export const debugMiddleware = (req, res, next) => {
    // Log incoming request details
    console.log('\n=== Request Debug Info ===');
    console.log('URL:', req.url);
    console.log('Method:', req.method);
    console.log('Session ID:', req.session?.id);
    console.log('Session Data:', req.session);
    
    // Log response header setting
    const originalSetHeader = res.setHeader;
    res.setHeader = function(name, value) {
        console.log(`Setting Header - ${name}:`, value);
        return originalSetHeader.apply(this, arguments);
    };
    
    next();
};

// Add this middleware right after session middleware in index.js
