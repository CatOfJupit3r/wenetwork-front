export const VITE_APP_BACKEND_URL: string = import.meta.env.VITE_APP_BACKEND_URL;
console.log(import.meta.env);
if (!VITE_APP_BACKEND_URL) {
    throw new Error('VITE_APP_BACKEND_URL is not set');
}