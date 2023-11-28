export {}

declare global {
  interface Window {
    onScreenOn: () => void
    onScreenOff: () => void
    fully: any
  }
}
