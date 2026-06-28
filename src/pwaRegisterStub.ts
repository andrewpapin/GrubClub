// Native (Capacitor) build stub for `virtual:pwa-register/react`.
//
// Native builds drop the vite-plugin-pwa plugin (see vite.config.ts —
// CAPACITOR_BUILD), so the `virtual:pwa-register/react` module it normally
// provides doesn't exist. vite.config.ts aliases that import to this file for
// native builds, keeping `UpdatePrompt` importable while making it inert: a
// Capacitor shell has no service worker to register, and app updates go through
// the store / native OTA channel instead. Type-checking still resolves the
// import against the real plugin types (tsc doesn't follow the vite alias), so
// this only needs to satisfy the bundler.
type SWState = [boolean, (value: boolean) => void]

export function useRegisterSW() {
  return {
    needRefresh: [false, () => {}] as SWState,
    offlineReady: [false, () => {}] as SWState,
    updateServiceWorker: async () => {},
  }
}
