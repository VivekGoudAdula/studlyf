/// <reference types="vite/client" />

// Detect environment using Vite's built-in variables
export const API_BASE_URL = import.meta.env.PROD
    ? 'https://studlyff.onrender.com'
    : 'http://localhost:8000';

console.log('App is running in:', import.meta.env.MODE, 'Targeting API:', API_BASE_URL);
