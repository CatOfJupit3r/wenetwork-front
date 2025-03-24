export const VITE_APP_BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL;
if (!VITE_APP_BACKEND_URL) {
    throw new Error('VITE_APP_BACKEND_URL is not set');
}