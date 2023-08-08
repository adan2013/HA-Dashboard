import { useEffect, useRef, useState } from 'react'
import { useModalContext } from '../ModalContext'
import {
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalTitle
} from '../ModalElements'
import { LightControlModalParams } from '../utils'
import { useHomeAssistantEntity } from '../../../api/hooks'
import { useHomeAssistant } from '../../../contexts/HomeAssistantContext'

type SliderProps = {
  title: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  onConfirm: () => void
}

const Slider = ({
  title,
  value,
  min,
  max,
  onChange,
  onConfirm
}: SliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const percentage = value ? ((value - min) / (max - min)) * 100 : 0

  const onMove = e => {
    if (e.buttons) {
      const startPoint = containerRef.current.getBoundingClientRect().left
      const endPoint = containerRef.current.getBoundingClientRect().right
      const newPercentage = Math.ceil(
        ((e.clientX - startPoint) / (endPoint - startPoint)) * 100
      )
      onChange(Math.ceil((newPercentage / 100) * (max - min) + min))
    }
  }

  const events = {
    onMouseMove: onMove,
    onMouseDown: onMove,
    onMouseUp: onConfirm
  }

  return (
    <div className="my-1">
      <div className="my-2 text-center">{title}</div>
      <div
        className="h-14 w-full cursor-pointer overflow-hidden rounded-lg bg-black"
        ref={containerRef}
        {...events}
      >
        <div
          className="h-full bg-yellow-400"
          style={{ width: `${percentage}%` }}
          {...events}
        />
      </div>
    </div>
  )
}

const LightControlBody = () => {
  const [brightness, setBrightness] = useState<number>(0)
  const [colorTemp, setColorTemp] = useState<number>(0)
  const [colorTempRange, setColorTempRange] = useState<[number, number]>(null)
  const modal = useModalContext()
  const ha = useHomeAssistant()
  const params = modal.state.params as LightControlModalParams
  const { entityState, isUnavailable } = useHomeAssistantEntity(
    params.entityName
  )
  const isTurnedOn = entityState?.state === 'on'
  const colorTempAvailable = !params.lockColorTemperature && colorTempRange

  let status = 'Off'
  if (isUnavailable) {
    status = 'Unavailable'
  } else if (isTurnedOn) {
    const brightnessPercentage = Math.ceil((brightness / 255) * 100)
    status = `${brightnessPercentage}%`
    if (colorTempAvailable) {
      status += ` | ${colorTemp}K`
    }
  }

  useEffect(() => {
    setBrightness(entityState?.attributes?.brightness || 0)
    const minColorTemp = entityState?.attributes?.min_color_temp_kelvin
    const maxColorTemp = entityState?.attributes?.max_color_temp_kelvin
    if (minColorTemp && maxColorTemp) {
      setColorTempRange([minColorTemp, maxColorTemp])
      setColorTemp(entityState?.attributes?.color_temp_kelvin)
    } else {
      setColorTempRange(null)
    }
  }, [entityState])

  const toggleLight = () => {
    if (isUnavailable) return
    const action = isTurnedOn ? 'turn_off' : 'turn_on'
    ha.callService(entityState.id, 'light', action)
  }

  const setLight = (payload: object) => {
    if (isUnavailable) return
    if (brightness > 0) {
      ha.callService(entityState.id, 'light', 'turn_on', payload)
    } else {
      ha.callService(entityState.id, 'light', 'turn_off')
    }
  }

  return (
    <ModalBody>
      <ModalTitle>{params.title}</ModalTitle>
      <div className="mx-auto flex max-w-md flex-col gap-6">
        <Slider
          title="Brightness"
          value={brightness}
          min={0}
          max={255}
          onChange={setBrightness}
          onConfirm={() => setLight({ brightness })}
        />
        {colorTempAvailable && (
          <Slider
            title="Color temperature"
            value={colorTemp}
            min={colorTempRange[0]}
            max={colorTempRange[1]}
            onChange={setColorTemp}
            onConfirm={() => setLight({ kelvin: colorTemp })}
          />
        )}
      </div>
      <div className="mb-2 mt-5 text-center text-sm">{status}</div>
      <ModalFooter>
        <ModalButton
          name={isTurnedOn ? 'Turn off' : 'Turn on'}
          onClick={toggleLight}
        />
        <ModalButton name="Close" onClick={() => modal.closeModal()} />
      </ModalFooter>
    </ModalBody>
  )
}

export default LightControlBody
