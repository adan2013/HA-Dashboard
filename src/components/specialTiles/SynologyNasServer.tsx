import CheckIcon from '@mui/icons-material/Check'
import UpdateIcon from '@mui/icons-material/Update'
import StorageIcon from '@mui/icons-material/Storage'
import DiscFullIcon from '@mui/icons-material/DiscFull'
import { useHomeAssistantEntity } from '../../api/hooks'
import Tile, { TileProps } from '../basic/Tile'
import ChartHistoryTile from '../charts/ChartHistoryTile'
import StateDropdownHelperTile from '../entityTiles/helpers/StateDropdownHelperTile'
import { TemperatureChartTile } from '../entityTiles/climate/ClimateTile'

export interface SynologyDsmAttributes {
  installed_version: string
  latest_version: string
}

export const SynologyDsmUpdate = () => {
  const { entityState, isUnavailable } = useHomeAssistantEntity(
    'update.synologynas_dsm_update'
  )
  const data = entityState?.attributes as unknown as SynologyDsmAttributes
  const upToDate = data?.installed_version === data?.latest_version

  const tileProps: TileProps = {
    title: 'Synology DSM',
    subtitle: upToDate ? 'Up to date' : 'Update available',
    icon: upToDate ? <CheckIcon /> : <UpdateIcon />,
    iconClassnames: upToDate ? undefined : 'text-yellow-600',
    isUnavailable
  }
  return <Tile {...tileProps} />
}

export interface SynologySecurityStatusAttributes {
  malware: string
  network: string
  securitySetting: string
  systemCheck: string
  update: string
  userInfo: string
}

export const SynologySecurityStatus = () => {
  const { entityState, isUnavailable } = useHomeAssistantEntity(
    'binary_sensor.synologynas_security_status'
  )

  const isSafe = entityState?.state === 'off'
  const data =
    entityState?.attributes as unknown as SynologySecurityStatusAttributes
  const unSafeStatuses = []

  const verifyStatus = <K extends keyof SynologySecurityStatusAttributes>(
    status: K
  ) => {
    if (data && data[status] !== 'safe') {
      unSafeStatuses.push(status)
    }
  }
  verifyStatus('malware')
  verifyStatus('network')
  verifyStatus('securitySetting')
  verifyStatus('systemCheck')
  verifyStatus('update')
  verifyStatus('userInfo')

  const tileProps: TileProps = {
    title: 'Security status',
    subtitle: isSafe ? 'Safe' : `Unsafe: ${unSafeStatuses.join(', ')}`,
    icon: isSafe ? <CheckIcon /> : <UpdateIcon />,
    iconClassnames: isSafe ? undefined : 'text-yellow-600',
    isUnavailable
  }
  return <Tile {...tileProps} />
}

export const SynologyVolumeStatus = () => (
  <StateDropdownHelperTile
    title="Volume status"
    entityId="sensor.synologynas_volume_1_status"
    icon={<DiscFullIcon />}
    iconClassnames="text-red-600"
    customStateParams={[
      {
        state: 'normal',
        icon: <StorageIcon />,
        iconClassnames: 'text-white'
      }
    ]}
  />
)

export const OccupiedDiskSpace = () => (
  <ChartHistoryTile
    title="Occupied disk space"
    entityId="sensor.synologynas_volume_1_volume_used"
    unit="%"
    showDecimals={1}
    hideMinMax
    hideChart
    disableModalHistory
    customTileProps={{
      size: 'standard'
    }}
  />
)

export const VolumeTemperature = () => (
  <TemperatureChartTile
    title="Volume disk AVG temp"
    entityId="sensor.synologynas_volume_1_average_disk_temp"
    customProps={{
      hideChart: true,
      hideMinMax: true,
      customTileProps: {
        size: 'standard'
      }
    }}
  />
)

export const NasTemperature = () => (
  <TemperatureChartTile
    title="NAS system temperature"
    entityId="sensor.synologynas_temperature"
    customProps={{
      hideChart: true,
      hideMinMax: true,
      customTileProps: {
        size: 'standard'
      }
    }}
  />
)
