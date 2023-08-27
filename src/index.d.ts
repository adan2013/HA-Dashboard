export {}

declare global {
  interface Window {
    onFullyScreenOn: () => void
    onFullyScreenOff: () => void
    fully: any
  }
}
