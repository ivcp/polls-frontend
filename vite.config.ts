import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const defaultConfig = {
  plugins: [react()],
};

export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    const isDev = mode === 'development';
    return {
      ...defaultConfig,
      server: {
        proxy: {
          '/v1': {
            target: isDev ? 'http://localhost' : 'http://3.75.231.58',
          },
        },
      },
    };
  } else return defaultConfig;
});
