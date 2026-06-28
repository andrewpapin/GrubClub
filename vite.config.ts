import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

// Bumped manually for breaking/major UI changes; the trailing number is the
// most recently merged PR, picked up automatically from git history below.
const APP_VERSION_BASE = '1.1'

function getAppVersion(): string {
  try {
    const log = execSync('git log -50 --pretty=%s', { encoding: 'utf-8' })
    const match = log.match(/#(\d+)/)
    return `${APP_VERSION_BASE}.${match ? match[1] : '0'}`
  } catch {
    return `${APP_VERSION_BASE}.0`
  }
}

// Native (Capacitor) builds set CAPACITOR_BUILD=true. They differ from the web
// (GitHub Pages) build in two ways: assets are served from a local origin
// inside the native shell, so the base must be relative ('./') rather than the
// Pages subpath ('/Gravy/'); and the PWA service worker is omitted, since a
// Capacitor shell already serves the bundle locally and a registered SW under
// the capacitor:// origin only fights that. See CAPACITOR.md.
const isNativeBuild = process.env.CAPACITOR_BUILD === 'true'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: isNativeBuild ? './' : command === 'build' ? '/Gravy/' : '/',
  define: {
    __APP_VERSION__: JSON.stringify(getAppVersion()),
  },
  // Native builds drop the PWA plugin, which provides `virtual:pwa-register/react`;
  // alias that import to an inert stub so UpdatePrompt still bundles. (No effect
  // on web builds, where the plugin supplies the real virtual module.)
  resolve: isNativeBuild
    ? {
        alias: {
          'virtual:pwa-register/react': fileURLToPath(
            new URL('./src/pwaRegisterStub.ts', import.meta.url),
          ),
        },
      }
    : undefined,
  plugins: [
    react(),
    ...(isNativeBuild
      ? []
      : [
          VitePWA({
            registerType: 'prompt',
            includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png'],
            manifest: {
              name: 'Gravy',
              short_name: 'Gravy',
              description: 'A family chore & reward tracker',
              theme_color: '#F7EDE2',
              background_color: '#F7EDE2',
              display: 'standalone',
              icons: [
                { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
                { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
                { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
                { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
              ],
            },
            workbox: {
              cleanupOutdatedCaches: true,
            },
          }),
        ]),
  ],
}))
