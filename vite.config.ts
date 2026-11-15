import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { cloudflareTunnelPlugin } from './vite-plugin-cloudflared.ts';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    cloudflareTunnelPlugin(),
  ],
  server: {
    host: true, // доступно по локальной сети
    port: 5173,
  },
});
