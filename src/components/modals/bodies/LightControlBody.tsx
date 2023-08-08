import { useEffect, useState } from 'react'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import Brightness6Icon from '@mui/icons-material/Brightness6'
import Brightness5Icon from '@mui/icons-material/Brightness5'
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
import { PresetButton } from '../../entityTiles/lights/PresetButton'
import { LightSlider } from '../../entityTiles/lights/LightSlider'

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

  const updateBrightness = () => {
    if (isUnavailable) return
    if (brightness > 0) {
      ha.callService(entityState.id, 'light', 'turn_on', { brightness })
    } else {
      ha.callService(entityState.id, 'light', 'turn_off')
    }
  }

  const updateColorTemp = () => {
    if (isUnavailable) return
    ha.callService(entityState.id, 'light', 'turn_on', {
      kelvin: colorTemp
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
        {colorTempAvailable && (
          <LightSlider
            title="Color temperature"
            value={colorTemp}
            min={colorTempRange[0]}
            max={colorTempRange[1]}
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
              icon={<AcUnitIcon />}
              id={entityState?.id}
              colorTemp={colorTempRange[0]}
            />
            <PresetButton
              icon={<Brightness6Icon />}
              id={entityState?.id}
              colorTemp={(colorTempRange[0] + colorTempRange[1]) / 2}
            />
            <PresetButton
              icon={<Brightness5Icon />}
              id={entityState?.id}
              colorTemp={colorTempRange[1]}
            />
          </>
        )}
      </div>
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
