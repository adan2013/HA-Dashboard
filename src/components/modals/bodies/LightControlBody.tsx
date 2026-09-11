import { useEffect, useState } from 'react'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import Brightness6Icon from '@mui/icons-material/Brightness6'
import Brightness5Icon from '@mui/icons-material/Brightness5'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import { useModalContext } from '../../../contexts/ModalContext'
import {
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalTitle
} from '../ModalElements'
import { LightControlModalParams } from '../../../contexts/modalUtils'
import { useHomeAssistantEntity } from '../../../api/hooks'
import { useBackend } from '../../../contexts/BackendContext'
import { PresetButton } from '../../entityTiles/lights/PresetButton'
import { LightSlider } from '../../entityTiles/lights/LightSlider'
import {
  getHue,
  hsToHex,
  supportsColor
} from '../../entityTiles/lights/lightUtils'

const LightControlBody = () => {
  const [brightness, setBrightness] = useState<number>(0)
  const [colorTemp, setColorTemp] = useState<number>(0)
  const [hue, setHue] = useState<number>(0)
  const modal = useModalContext()
  const backend = useBackend()
  const params = modal.state.params as LightControlModalParams
  const { entityState, isUnavailable } = useHomeAssistantEntity(params.entityId)
  const minColorTemp = entityState?.attributes?.min_color_temp_kelvin
  const maxColorTemp = entityState?.attributes?.max_color_temp_kelvin
  const colorTempRangeExists = minColorTemp && maxColorTemp
  const isTurnedOn = entityState?.state === 'on'
  const colorTempAvailable =
    !params.lockColorTemperature && colorTempRangeExists
  const colorAvailable = supportsColor(entityState?.attributes)

  let status = 'Off'
  if (isUnavailable) {
    status = 'Unavailable'
  } else if (isTurnedOn) {
    const brightnessPercentage = Math.ceil((brightness / 255) * 100)
    status = `${brightnessPercentage}%`
    if (colorTempAvailable) {
      status += ` | ${colorTemp}K`
    }
    if (colorAvailable) status += ` | ${hsToHex(hue)}`
  }

  useEffect(() => {
    setBrightness(entityState?.attributes?.brightness || 0)
    setColorTemp(entityState?.attributes?.color_temp_kelvin || null)
    setHue(getHue(entityState?.attributes))
  }, [entityState])

  const toggleLight = () => {
    if (isUnavailable) return
    const action = isTurnedOn ? 'turn_off' : 'turn_on'
    backend.callService(entityState.id, 'light', action)
  }

  const updateBrightness = () => {
    if (isUnavailable) return
    if (brightness > 0) {
      backend.callService(entityState.id, 'light', 'turn_on', { brightness })
    } else {
      backend.callService(entityState.id, 'light', 'turn_off')
    }
  }

  const updateColorTemp = () => {
    if (isUnavailable) return
    backend.callService(entityState.id, 'light', 'turn_on', {
      color_temp_kelvin: colorTemp
    })
  }

  const updateColor = () => {
    if (isUnavailable) return
    backend.callService(entityState.id, 'light', 'turn_on', {
      hs_color: [hue, 100]
    })
  }

  return (
    <ModalBody>
      <ModalTitle>{params.title}</ModalTitle>
      <div className="mx-auto flex max-w-md flex-col gap-6">
        <LightSlider
          title="Brightness"
          value={brightness}
          min={0}
          max={255}
          onChange={setBrightness}
          onConfirm={updateBrightness}
        />
        {colorAvailable && (
          <LightSlider
            title="Color"
            value={hue}
            min={0}
            max={360}
            onChange={setHue}
            onConfirm={updateColor}
            variant="spectrum"
          />
        )}
        {colorTempAvailable && (
          <LightSlider
            title="Color temperature"
            value={colorTemp}
            min={minColorTemp}
            max={maxColorTemp}
            onChange={setColorTemp}
            onConfirm={updateColorTemp}
          />
        )}
      </div>
      <div className="mb-2 mt-5 text-center text-sm">{status}</div>
      <div className="my-5 flex flex-row justify-center gap-4">
        <PresetButton
          icon={<LightbulbOutlinedIcon />}
          id={entityState?.id}
          brightness={0}
        />
        <PresetButton
          icon={<LightbulbIcon />}
          id={entityState?.id}
          brightness={255}
        />
        {colorTempAvailable && (
          <>
            <div className="w-[1px] bg-amber-50 opacity-60" />
            <PresetButton
              icon={<Brightness5Icon />}
              id={entityState?.id}
              colorTemp={minColorTemp}
            />
            <PresetButton
              icon={<Brightness6Icon />}
              id={entityState?.id}
              colorTemp={(minColorTemp + maxColorTemp) / 2}
            />
            <PresetButton
              icon={<AcUnitIcon />}
              id={entityState?.id}
              colorTemp={maxColorTemp}
            />
          </>
        )}
      </div>
      <ModalFooter>
        <ModalButton
          name={isTurnedOn ? 'Turn off' : 'Turn on'}
          icon={isTurnedOn ? <ToggleOnIcon /> : <ToggleOffOutlinedIcon />}
          onClick={toggleLight}
        />
        <ModalButton
          name="Close"
          icon={<CloseOutlinedIcon />}
          onClick={() => modal.closeModal()}
        />
      </ModalFooter>
    </ModalBody>
  )
}

export default LightControlBody
