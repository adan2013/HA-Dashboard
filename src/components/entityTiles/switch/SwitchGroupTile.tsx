import clsx from 'clsx'
import { ReactElement, useCallback, useLayoutEffect, useState } from 'react'
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined'
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined'
import Tile, { TileProps } from '../../basic/Tile'
import {
  HomeAssistantEntityData,
  useHomeAssistantEntity
} from '../../../api/hooks'
import { useBackend } from '../../../contexts/BackendContext'

export type SwitchGroupItem = {
  title: string
  entityId: string
}

type SwitchEntityProps = {
  entityId: string
  onData: (entityId: string, data: HomeAssistantEntityData) => void
}

// Subscriptions live outside the Tile body: the body unmounts while the
// section shows skeletons, which must not reset the reported loading state.
const SwitchEntity = ({ entityId, onData }: SwitchEntityProps) => {
  const data = useHomeAssistantEntity(entityId)
  const { entityState, isLoading, isUnavailable } = data

  useLayoutEffect(() => {
    onData(entityId, { entityState, isLoading, isUnavailable })
  }, [entityId, entityState, isLoading, isUnavailable, onData])

  return null
}

type SwitchRowProps = {
  title: string
  data?: HomeAssistantEntityData
  onIcon: ReactElement
  offIcon: ReactElement
}

const SwitchRow = ({ title, data, onIcon, offIcon }: SwitchRowProps) => {
  const backend = useBackend()
  const isUnavailable = !data || data.isUnavailable
  const isActive = data?.entityState?.state === 'on'

  const onClick = () => {
    if (isUnavailable) return
    backend.callService(
      data.entityState.id,
      'switch',
      isActive ? 'turn_off' : 'turn_on'
    )
  }

  return (
    <button
      type="button"
      aria-label={title}
      aria-pressed={isActive}
      disabled={isUnavailable}
      onClick={onClick}
      className={clsx(
        'press-feedback flex min-w-0 cursor-pointer touch-manipulation select-none flex-col items-center justify-center gap-1 rounded-md px-1',
        'bg-transparent text-center text-white transition-colors hover:bg-white/10',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
        'disabled:cursor-not-allowed disabled:opacity-50'
      )}
    >
      <span
        className={clsx(
          'flex [&>svg]:!text-[2.5rem]',
          isActive && 'text-green-500'
        )}
      >
        {isActive ? onIcon : offIcon}
      </span>
      <span
        className={clsx(
          'w-full truncate text-sm',
          !isActive && 'text-gray-300'
        )}
      >
        {title}
      </span>
    </button>
  )
}

type SwitchGroupTileProps = {
  title: string
  switches: SwitchGroupItem[]
  onIcon?: ReactElement
  offIcon?: ReactElement
}

const SwitchGroupTile = ({
  title,
  switches,
  onIcon = <ToggleOnOutlinedIcon />,
  offIcon = <ToggleOffOutlinedIcon />
}: SwitchGroupTileProps) => {
  const [entities, setEntities] = useState<
    Record<string, HomeAssistantEntityData>
  >({})

  const onData = useCallback(
    (entityId: string, data: HomeAssistantEntityData) =>
      setEntities(current => ({ ...current, [entityId]: data })),
    []
  )

  const tileData: TileProps = {
    title,
    size: 'horizontal',
    hideHeader: true,
    requiresHomeAssistant: true,
    isLoading: switches.some(
      ({ entityId }) => !entities[entityId] || entities[entityId].isLoading
    ),
    customBody: (
      <div
        className="grid h-full auto-cols-fr grid-flow-col gap-1.5 p-2"
        aria-label={title}
        role="group"
      >
        {switches.map(item => (
          <SwitchRow
            key={item.entityId}
            title={item.title}
            data={entities[item.entityId]}
            onIcon={onIcon}
            offIcon={offIcon}
          />
        ))}
      </div>
    )
  }

  return (
    <>
      {switches.map(({ entityId }) => (
        <SwitchEntity key={entityId} entityId={entityId} onData={onData} />
      ))}
      <Tile {...tileData} />
    </>
  )
}

export default SwitchGroupTile
