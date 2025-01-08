import { defineConfig } from 'vite';

export default defineConfig(async () => {
  const { default: react } = await import('@vitejs/plugin-react');
  const { default: tsconfigPaths } = await import('vite-tsconfig-paths');

  return {
    plugins: [react(), tsconfigPaths()],
    server: {
      open: true,
    },
  };
});
