import isIOS from '../platform'

const overrideNavigator = (
  property: 'userAgent' | 'platform' | 'maxTouchPoints',
  value: string | number
) => {
  const descriptor = Object.getOwnPropertyDescriptor(navigator, property)
  Object.defineProperty(navigator, property, { configurable: true, value })
  return () => {
    if (descriptor) {
      Object.defineProperty(navigator, property, descriptor)
    } else {
      delete (navigator as unknown as Record<string, unknown>)[property]
    }
  }
}

describe('isIOS', () => {
  it('should detect iPhone', () => {
    const restore = overrideNavigator('userAgent', 'iPhone')
    expect(isIOS()).toBe(true)
    restore()
  })

  it('should detect iPad presenting itself as a Mac', () => {
    const restorePlatform = overrideNavigator('platform', 'MacIntel')
    const restoreTouch = overrideNavigator('maxTouchPoints', 5)
    expect(isIOS()).toBe(true)
    restoreTouch()
    restorePlatform()
  })

  it('should not detect other devices', () => {
    const restore = overrideNavigator('userAgent', 'Android')
    expect(isIOS()).toBe(false)
    restore()
  })
})
