import { Fragment, ReactElement } from 'react'
import Battery1BarIcon from '@mui/icons-material/Battery1Bar'
import Tile, { TileProps } from '../Tile'
import { useHomeAssistantBatteryEntities } from '../../api/hooks'

export type BatteryState = {
  friendlyName: string
  value: number
}

const ListSeparator = () => (
  <div className="mx-2 h-[1px] bg-gray-200 opacity-50" />
)

const getListOfBatteryStates = (list: BatteryState[]): ReactElement => {
  if (!list) return undefined
  const top5 = list.slice(0, 5)
  const moreCount = list.length - top5.length
  return (
    <div className="absolute bottom-0 left-0 h-60 w-full">
      {top5.map(({ friendlyName, value }, idx) => (
        <Fragment key={friendlyName}>
          {idx < top5.length && <ListSeparator />}
          <div className="relative mx-2 py-2">
            {friendlyName}
            <div className="absolute right-0 top-0 py-2">
              {value < 30 && (
                <Battery1BarIcon className="mx-1 mt-[-4px] rotate-90 text-red-500" />
              )}
              {value}%
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
  const batteryEntities = useHomeAssistantBatteryEntities()

  const tileProps: TileProps = {
    title: 'Batteries',
    size: 'big',
    customBody: getListOfBatteryStates(batteryEntities)
  }
  return <Tile {...tileProps} />
}
