export type HapticFeedback = 'tap' | 'hold'

const DURATION: Record<HapticFeedback, number> = {
  tap: 15,
  hold: 35
}

export const triggerHapticFeedback = (feedback: HapticFeedback) => {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return

  try {
    navigator.vibrate(DURATION[feedback])
  } catch {
    // Haptics are optional and must never interrupt the requested action.
  }
}
