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
    <div
      className="flex-center aspect-square w-12 cursor-pointer rounded-full border-2 border-white p-1 hover:bg-gray-600"
      onClick={onClick}
    >
      {cloneElement(icon, { className: '!text-2xl' })}
    </div>
  )
}
