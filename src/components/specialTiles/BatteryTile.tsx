import { Fragment, ReactElement } from 'react'
import Battery1BarIcon from '@mui/icons-material/Battery1Bar'
import Tile, { TileProps } from '../basic/Tile'
import { useHomeAssistantBatteries } from '../../api/hooks'
import { BatteryState } from '../../utils/batteryUtils'
import { useModalContext } from '../../contexts/ModalContext'

const COUNT_OF_TILE_ENTITIES = 5
export const BATTERY_WARNING_THRESHOLD = 40

const ListSeparator = () => (
  <div className="mx-2 h-[1px] bg-gray-200 opacity-50" />
)

const getListOfEntities = (
  list: BatteryState[],
  valueRenderer: (entity: BatteryState) => ReactElement
): ReactElement => {
  if (!list) return undefined
  const topList = list.slice(0, COUNT_OF_TILE_ENTITIES)
  const moreCount = list.length - topList.length
  return (
    <div className="absolute bottom-0 left-0 flex h-60 w-full flex-col justify-end">
      {topList.map((entity, idx) => (
        <Fragment key={entity.friendlyName}>
          {idx < topList.length && <ListSeparator />}
          <div
            className="relative mx-2 py-2"
            data-testid={`${entity.friendlyName}-${idx}`}
          >
            {entity.friendlyName}
            <div className="absolute right-0 top-0 py-2">
              {valueRenderer(entity)}
            </div>
          </div>
        </Fragment>
      ))}
      {moreCount > 0 && (
        <>
          <ListSeparator />
          <div className="relative mx-2 py-2 text-center text-sm">
            See more ({moreCount})
          </div>
        </>
      )}
    </div>
  )
}

export const BatteryTile = () => {
  const entities = useHomeAssistantBatteries()
  const modal = useModalContext()
  const tileProps: TileProps = {
    title: 'Batteries',
    size: 'big',
    customBody: getListOfEntities(entities, ({ level, friendlyName }) => (
      <>
        {level !== undefined && level < BATTERY_WARNING_THRESHOLD && (
          <Battery1BarIcon
            className="mx-1 mt-[-4px] rotate-90 text-red-500"
            data-testid={`${friendlyName}-low-battery`}
          />
        )}
        {level !== undefined ? `${level}%` : '-'}
      </>
    )),
    onClick: () => modal.openModal('batteryList')
  }
  return <Tile {...tileProps} />
}
