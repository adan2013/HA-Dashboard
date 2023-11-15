import clsx from 'clsx'
import Tile from '../../basic/Tile'
import { useModalContext } from '../../../contexts/ModalContext'
import { WeatherModalParams } from '../../../contexts/modalUtils'

type WidgetProps = {
  disableInteractions?: boolean
}

export const ResponsiveWidgetElement = ({
  disableInteractions
}: WidgetProps) => (
  <div className="relative h-full w-full overflow-hidden rounded-lg">
    <iframe
      className={clsx(
        'absolute left-0 top-0 h-full w-full',
        disableInteractions && 'pointer-events-none'
      )}
      title="rain-radar"
      src="https://embed.windy.com/embed2.html?lat=51.494&lon=19.167&detailLat=52.249&detailLon=21.002&width=330&height=330&zoom=5&level=surface&overlay=rain&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1"
    />
  </div>
)

type TileProps = {
  disableInteractions?: boolean
  openModalOnClick?: boolean
}

const RainRadarTile = ({
  disableInteractions,
  openModalOnClick
}: TileProps) => {
  const modal = useModalContext()

  const openModal = () =>
    modal.openModal('weather', {
      content: 'rain'
    } as WeatherModalParams)

  return (
    <Tile
      title="Rain radar"
      size="big"
      onClick={openModalOnClick ? openModal : undefined}
      customBody={
        <div className="flex h-full w-full justify-center p-2">
          <ResponsiveWidgetElement disableInteractions={disableInteractions} />
        </div>
      }
    />
  )
}

export default RainRadarTile
