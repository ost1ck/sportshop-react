import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq) => {
            console.log('Proxying request:', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes) => {
            console.log('Proxy response:', proxyRes.statusCode);
          });
        },
      },
    },
  },
});