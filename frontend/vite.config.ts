import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            // Proxy requests to the /api path to your backend server
            '/api': {
                target: 'http://localhost:3000', // Replace with your backend server URL
                changeOrigin: true,
                secure: false,
            },
        },
    },
})
