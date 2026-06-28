import type { CapacitorConfig } from '@capacitor/cli'

// Capacitor wraps the built web app (Vite output in `dist/`) in a thin native
// shell. `webDir` must point at the production build; run `npm run cap:sync`
// (which does a native-mode `vite build` first, see vite.config.ts /
// CAPACITOR_BUILD) before opening or building a native project so the shell
// serves the latest assets. See CAPACITOR.md for the full workflow.
const config: CapacitorConfig = {
  appId: 'com.gravy.app',
  appName: 'Gravy',
  webDir: 'dist',
}

export default config
