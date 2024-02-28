import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const defaultConfig = {
  plugins: [react()],
};

export default defineConfig(() => {
  return {
    ...defaultConfig,
    server: {
      proxy: {
        '/v1': {
          target: 'http://localhost',
        },
      },
    },
  };
});
