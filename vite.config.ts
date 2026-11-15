import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { cloudflareTunnelPlugin } from './vite-plugin-cloudflared.ts';

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/tabelium/' : '/',
  plugins: [
    react(),
    tailwindcss(),
    cloudflareTunnelPlugin(),
  ],
  server: {
    host: true, // доступно по локальной сети
    port: 5180, // отдельный порт, чтобы не конфликтовать с coursing-stats (5173)
    allowedHosts: true, // разрешает доступ через *.trycloudflare.com
  },
});
