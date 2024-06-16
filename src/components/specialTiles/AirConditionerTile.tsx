import clsx from 'clsx'
import { ReactElement } from 'react'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import HdrAutoIcon from '@mui/icons-material/HdrAuto'
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import AirIcon from '@mui/icons-material/Air'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import AutoModeIcon from '@mui/icons-material/AutoMode'
import Tile, { TileProps } from '../basic/Tile'
import { useHomeAssistantEntity } from '../../api/hooks'
import { useHomeAssistant } from '../../contexts/HomeAssistantContext'
import useClickHoldLogic from '../../hooks/useClickHoldLogic'

type AcStatusProps = {
  items: {
    id: string
    name: string
    value: string
  }[]
}

const AcStatus = ({ items }: AcStatusProps) => (
  <div className="grid h-28 auto-rows-fr grid-cols-3 gap-2">
    {items.map(({ id, name, value }) => (
      <div
        key={id}
        className="flex flex-col items-center justify-center text-white"
      >
        <div className="text-xs">{name}</div>
        <div className="text-2xl" data-testid={`status-${id}`}>
          {value}
        </div>
      </div>
    ))}
  </div>
)

type AcButtonProps = {
  icon: ReactElement
  text?: string
  id?: string
  onClick?: () => void
}

const AcButton = ({ icon, text, id, onClick }: AcButtonProps) => {
  const events = useClickHoldLogic(onClick, undefined)
  return (
    <div
      className={clsx(
        'flex cursor-pointer flex-col items-center justify-center rounded-md border-2',
        'select-none border-gray-400 bg-transparent text-white',
        'transition-colors hover:border-white hover:bg-white hover:text-black'
      )}
      data-testid={id ? `btn-${id}` : undefined}
      {...events}
    >
      <div>{icon}</div>
      <div className="mt-1 text-xs">{text}</div>
    </div>
  )
}

type AirConditionerTileProps = {
  title: string
  entityId: string
}

const transformModeType = (mode: string) => {
  switch (mode) {
    case null:
    case undefined:
    case '':
    case 'unknown':
    case 'unavailable':
      return '--'
    case 'fan_only':
      return 'Fan'
    default:
      return mode.charAt(0).toUpperCase() + mode.slice(1)
  }
}

const transformFanMode = (mode: string, fanModes: string[]) => {
  if (!!mode && !!fanModes) {
    const fanSpeedSteps = fanModes.filter(fm => fm !== 'auto')
    const selectedFanSpeed = fanSpeedSteps.findIndex(fm => fm === mode)
    return selectedFanSpeed === -1
      ? 'Auto'
      : `${selectedFanSpeed + 1} / ${fanSpeedSteps.length}`
  }
  return '--'
}

const AirConditionerTile = ({ title, entityId }: AirConditionerTileProps) => {
  const { entityState, isUnavailable } = useHomeAssistantEntity(entityId)
  const ha = useHomeAssistant()

  const mode = isUnavailable ? '--' : entityState?.state
  const currentTemp = Math.round(
    entityState?.attributes?.current_temperature || 0
  )
  const fanMode = isUnavailable ? '--' : entityState?.attributes?.fan_mode
  const temp = Math.round(entityState?.attributes?.temperature || 0)

  const transformedMode = transformModeType(mode)
  const transformedFanMode = transformFanMode(
    fanMode,
    entityState?.attributes?.fan_modes
  )
  const transformedCurrentTemp = isUnavailable ? '--' : `${currentTemp}°`
  const transformedTemp = isUnavailable ? '--' : `${temp}°`

  const changeTemp = (step: number) => {
    const newTemp = temp + step
    ha.callService(entityId, 'climate', 'set_temperature', {
      temperature: newTemp
    })
  }

  const changeFanMode = (newFanMode: string) => {
    ha.callService(entityId, 'climate', 'set_fan_mode', {
      fan_mode: newFanMode
    })
  }

  const changeFanSpeed = (step: number) => {
    const fanSpeedSteps = entityState?.attributes?.fan_modes
    const selectedFanSpeed = fanSpeedSteps.findIndex(fm => fm === fanMode)
    if (selectedFanSpeed === -1) {
      changeFanMode('auto')
    } else {
      let newFanSpeedIndex = selectedFanSpeed + step
      if (newFanSpeedIndex < 0) {
        newFanSpeedIndex = fanSpeedSteps.length - 1
      } else if (newFanSpeedIndex >= fanSpeedSteps.length) {
        newFanSpeedIndex = 0
      }
      const newFanMode = fanSpeedSteps[newFanSpeedIndex]
      changeFanMode(newFanMode)
    }
  }

  const changeMode = (newMode: string) => {
    ha.callService(entityId, 'climate', 'set_hvac_mode', {
      hvac_mode: newMode
    })
  }

  const tileData: TileProps = {
    title,
    size: 'big',
    customBody: (
      <div className="absolute bottom-0 left-0 flex h-72 w-full flex-col justify-end p-2">
        <AcStatus
          items={[
            { id: 'mode', name: 'Mode', value: transformedMode },
            {
              id: 'current-temp',
              name: 'Current temp',
              value: transformedCurrentTemp
            },
            { id: 'fan', name: 'Fan', value: transformedFanMode }
          ]}
        />
        <div className={clsx('mb-2 grid h-32 auto-rows-fr grid-cols-3 gap-2')}>
          <AcButton
            icon={<RemoveIcon />}
            id="temp-down"
            onClick={() => changeTemp(-1)}
          />
          <div
            className="flex items-center justify-center text-3xl text-white"
            data-testid="status-target-temp"
          >
            {transformedTemp}
          </div>
          <AcButton
            icon={<AddIcon />}
            id="temp-up"
            onClick={() => changeTemp(1)}
          />
          <AcButton
            icon={<HdrAutoIcon />}
            id="fan-auto"
            onClick={() => changeFanMode('auto')}
          />
          <AcButton
            icon={<ArrowCircleDownIcon />}
            id="fan-down"
            onClick={() => changeFanSpeed(-1)}
          />
          <AcButton
            icon={<ArrowCircleUpIcon />}
            id="fan-up"
            onClick={() => changeFanSpeed(1)}
          />
        </div>
        <div className={clsx('grid h-20 auto-rows-fr grid-cols-4 gap-2')}>
          <AcButton
            icon={<PowerSettingsNewIcon />}
            text="Off"
            id="off-mode"
            onClick={() => changeMode('off')}
          />
          <AcButton
            icon={<AirIcon />}
            text="Fan"
            id="fan-mode"
            onClick={() => changeMode('fan_only')}
          />
          <AcButton
            icon={<AcUnitIcon />}
            text="Cool"
            id="cool-mode"
            onClick={() => changeMode('cool')}
          />
          <AcButton
            icon={<AutoModeIcon />}
            text="Auto"
            id="auto-mode"
            onClick={() => changeMode('auto')}
          />
        </div>
      </div>
    )
  }
  return <Tile {...tileData} />
}

export default AirConditionerTile
