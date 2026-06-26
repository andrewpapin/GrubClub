import type { CapacitorConfig } from '@capacitor/cli';

// IMPORTANT: `appId` is your app's permanent bundle identifier in the App Store.
// Change `com.example.gravy` to your own reverse-domain id (e.g. com.papin.gravy)
// BEFORE running `npx cap add ios` — it's baked into the native project and is
// painful to change afterward.
const config: CapacitorConfig = {
  appId: 'com.example.gravy',
  appName: 'Gravy',
  // Vite outputs the web build here; `npm run build:native` produces a
  // root-relative ('/') bundle with the PWA service worker disabled.
  webDir: 'dist',
};

export default config;
