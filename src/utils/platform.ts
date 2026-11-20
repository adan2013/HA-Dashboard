const isIOS = () => {
  if (typeof navigator === 'undefined') return false

  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

export default isIOS
