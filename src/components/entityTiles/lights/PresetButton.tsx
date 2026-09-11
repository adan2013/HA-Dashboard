import { cloneElement, ReactElement } from 'react'
import { useBackend } from '../../../contexts/BackendContext'

export type PresetButtonProps = {
  icon: ReactElement
  id: string
  brightness?: number
  colorTemp?: number
}

export const PresetButton = ({
  icon,
  id,
  brightness,
  colorTemp
}: PresetButtonProps) => {
  const backend = useBackend()

  const onClick = () => {
    backend.callService(id, 'light', 'turn_on', {
      brightness,
      color_temp_kelvin: colorTemp
    })
  }

  return (
    <button
      type="button"
      aria-label="Apply light preset"
      className="press-feedback flex-center aspect-square w-12 rounded-full border-2 border-white p-1 hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      onClick={onClick}
    >
      {cloneElement(icon, { className: '!text-2xl' })}
    </button>
  )
}
