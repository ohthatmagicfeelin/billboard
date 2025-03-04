const config = {
  NODE_ENV: import.meta.env.VITE_NODE_ENV,
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
  PORT: import.meta.env.VITE_PORT,
  LASTFM_API_KEY: import.meta.env.VITE_LASTFM_API_KEY,

  BASENAME: import.meta.env.VITE_APP_ROUTE,
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,

};

export default config;