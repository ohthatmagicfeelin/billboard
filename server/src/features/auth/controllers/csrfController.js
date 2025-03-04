import config from '../../../config/env.js';

export const getCsrfToken = (req, res) => {
    const token = req.csrfToken();
    req.session.csrfToken = token;
    res.json({ csrfToken: token });
}; 