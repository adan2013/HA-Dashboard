import { Fragment, ReactElement } from 'react'
import Battery1BarIcon from '@mui/icons-material/Battery1Bar'
import WifiIcon from '@mui/icons-material/Wifi'
import Tile, { TileProps } from '../basic/Tile'
import { useHomeAssistantZigbeeEntities } from '../../api/hooks'
import { ZigbeeEntityState } from '../../api/utils'
import { useModalContext } from '../../contexts/ModalContext'
import { ZigbeeNetworkModalParams } from '../../contexts/modalUtils'

const COUNT_OF_TILE_ENTITIES = 5
export const BATTERY_WARNING_THRESHOLD = 30
export const SIGNAL_WARNING_THRESHOLD = 30

const ListSeparator = () => (
  <div className="mx-2 h-[1px] bg-gray-200 opacity-50" />
)

const getListOfEntities = (
  list: ZigbeeEntityState[],
  valueRenderer: (entity: ZigbeeEntityState) => ReactElement
): ReactElement => {
  if (!list) return undefined
  const topList = list.slice(0, COUNT_OF_TILE_ENTITIES)
  const moreCount = list.length - topList.length
  return (
    <div className="absolute bottom-0 left-0 flex h-60 w-full flex-col justify-end">
      {topList.map((entity, idx) => (
        <Fragment key={entity.friendlyName}>
          {idx < topList.length && <ListSeparator />}
          <div className="relative mx-2 py-2">
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
  const entities = useHomeAssistantZigbeeEntities('battery')
  const modal = useModalContext()
  const tileProps: TileProps = {
    title: 'Batteries',
    size: 'big',
    customBody: getListOfEntities(entities, ({ battery }) => (
      <>
        {battery < BATTERY_WARNING_THRESHOLD && (
          <Battery1BarIcon className="mx-1 mt-[-4px] rotate-90 text-red-500" />
        )}
        {battery}%
      </>
    )),
    onClick: () => {
      const params: ZigbeeNetworkModalParams = {
        tab: 'battery'
      }
      modal.openModal('zigbeeNetwork', params)
    }
  }
  return <Tile {...tileProps} />
}

export const SignalTile = () => {
  const entities = useHomeAssistantZigbeeEntities('signal')
  const modal = useModalContext()
  const tileProps: TileProps = {
    title: 'ZigBee signals',
    size: 'big',
    customBody: getListOfEntities(entities, ({ signal }) => (
      <>
        {signal < SIGNAL_WARNING_THRESHOLD && (
          <WifiIcon className="mx-1 mt-[-6px] text-red-500" />
        )}
        {signal} LQ
      </>
    )),
    onClick: () => {
      const params: ZigbeeNetworkModalParams = {
        tab: 'signal'
      }
      modal.openModal('zigbeeNetwork', params)
    }
  }
  return <Tile {...tileProps} />
}
