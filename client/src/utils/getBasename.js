// src/utils/getBasename.js

export function getBasename(env, basename) {
  return env === 'production' ? basename : undefined;
}