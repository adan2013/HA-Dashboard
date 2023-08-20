import CheckIcon from '@mui/icons-material/Check'
import UpdateIcon from '@mui/icons-material/Update'
import { useHomeAssistantEntity } from '../../api/hooks'
import Tile, { TileProps } from '../Tile'
import ChartHistoryTile from '../charts/ChartHistoryTile'

interface SynologyDsmAttributes {
  installed_version: string
  latest_version: string
}

export const SynologyDsmUpdate = () => {
  const { entityState, isUnavailable } = useHomeAssistantEntity(
    'SynologyNAS DSM update'
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

interface SynologySecurityStatusAttributes {
  malware: string
  network: string
  securitySetting: string
  systemCheck: string
  update: string
  userInfo: string
}

export const SynologySecurityStatus = () => {
  const { entityState, isUnavailable } = useHomeAssistantEntity(
    'SynologyNAS Security status'
  )

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

  const isSafe = unSafeStatuses.length === 0

  const tileProps: TileProps = {
    title: 'Security status',
    subtitle: isSafe ? 'Safe' : `Unsafe: ${unSafeStatuses.join(', ')}`,
    icon: isSafe ? <CheckIcon /> : <UpdateIcon />,
    iconClassnames: isSafe ? undefined : 'text-yellow-600',
    isUnavailable
  }
  return <Tile {...tileProps} />
}

export const OccupiedDiskSpace = () => (
  <ChartHistoryTile
    title="Occupied disk space"
    entityName="SynologyNAS (Volume 1) Volume used"
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
