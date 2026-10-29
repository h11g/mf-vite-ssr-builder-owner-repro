import { defineConfig } from 'vite';
import { federation } from '@module-federation/vite';

const mf = federation({
  name: 'panel_app',
  filename: 'remoteEntry.js',
  exposes: { './panel': './src/panel.js' },
  // The remote is never loaded; it only makes this container a host as well.
  remotes: { other: 'other@http://localhost:4174/remoteEntry.js' },
  shared: {},
  dts: false,
});

// Diagnostic only: give each environment its own SSR entry plugin instance.
if (process.env.SSR_ENTRY_PER_ENVIRONMENT) {
  for (const plugin of mf) {
    if (plugin.name === 'mf:ssr-remote-entry') plugin.sharedDuringBuild = false;
  }
}

export default defineConfig({
  // sharedConfigBuild defaults to false: Vite evaluates this file again for each environment.
  builder: process.env.SHARED_CONFIG_BUILD ? { sharedConfigBuild: true } : {},
  environments: {
    client: {
      build: { outDir: 'dist/client' },
    },
    ssr: {
      build: { outDir: 'dist/server', rollupOptions: { input: 'src/server.js' } },
    },
  },
  plugins: [mf],
});
