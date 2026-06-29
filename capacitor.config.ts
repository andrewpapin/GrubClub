import type { CapacitorConfig } from '@capacitor/cli';

// Capacitor wrap of the existing Vite/React build (Epic 10 packaging spike).
// `webDir` points at the bundle produced by `npm run build:native`, which forces
// a root-relative base path (see vite.config.ts) so assets resolve inside the
// native WebView. Generate the native projects with `npx cap add ios` /
// `npx cap add android`, then `npm run cap:sync` to copy a fresh build in.
const config: CapacitorConfig = {
  appId: 'com.gravyapp.app',
  appName: 'Gravy',
  webDir: 'dist',
};

export default config;
