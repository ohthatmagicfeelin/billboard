import api from '@/api/api.js'; 
let csrfToken = null;
let csrfPromise = null;

const fetchCsrfToken = async () => {
    if (csrfToken) return csrfToken;
    
    if (!csrfPromise) {
        csrfPromise = api.get(`/api/csrf-token`)
        .then(response => {
            csrfToken = response.data.csrfToken;
            return csrfToken;
        })
        .catch(error => {
            console.error('CSRF token fetch error:', error);
            throw error;
        })
        .finally(() => {
            csrfPromise = null;
        });
    }
    
    return csrfPromise;
};

export const resetCsrfToken = () => {
    csrfToken = null;
    csrfPromise = null;
};

export default fetchCsrfToken; 