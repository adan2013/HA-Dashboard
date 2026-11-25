import Tile from '../basic/Tile'
import { useServiceValue } from '../../api/hooks'
import TileValueBody from './TileValueBody'

type ServiceValueTileProps = {
  title: string
  subtitle?: string
  serviceName: string
  helperName: string
  formatValue?: (value: number | string) => string
}

const ServiceValueTile = ({
  title,
  subtitle,
  serviceName,
  helperName,
  formatValue = String
}: ServiceValueTileProps) => {
  const { value, error, isLoading, isUnavailable } = useServiceValue<
    number | string
  >(serviceName, helperName)
  let statusSubtitle = subtitle
  if (error)
    statusSubtitle = value === null ? 'Unavailable' : 'Last update failed'

  return (
    <Tile
      title={title}
      subtitle={statusSubtitle}
      isLoading={isLoading}
      isUnavailable={isUnavailable}
      customBody={
        <TileValueBody>{value === null ? '—' : formatValue(value)}</TileValueBody>
      }
    />
  )
}

export default ServiceValueTile
