import csrf from 'csurf';

export const csrfProtection = csrf({
    cookie: false,
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
});

export const handleCsrfError = (err, req, res, next) => {
    
    if (err.code === 'EBADCSRFTOKEN') {
        console.log("CSRF ERROR", err.code)
        return res.status(403).json({
            error: 'Invalid CSRF token',
            code: 'INVALID_CSRF'
        });
    }
    
    if (err.message === 'misconfigured csrf') {
        console.log("CSRF CONFIG ERROR", err.code)
        return res.status(500).json({
            error: 'CSRF configuration error',
            code: 'CSRF_CONFIG_ERROR'
        });
    }

    next(err);
}; 