import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
  server: {
    port: 8080,
    host: '0.0.0.0',
  },
});
