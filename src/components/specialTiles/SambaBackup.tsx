import BackupIcon from '@mui/icons-material/Backup'
import CheckIcon from '@mui/icons-material/Check'
import CloudSyncIcon from '@mui/icons-material/CloudSync'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import { cloneElement, ReactElement } from 'react'
import SdStorageIcon from '@mui/icons-material/SdStorage'
import CloudIcon from '@mui/icons-material/Cloud'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred'
import StateDropdownHelperTile from '../entityTiles/helpers/StateDropdownHelperTile'
import CallServiceTile from '../entityTiles/services/CallServiceTile'
import { useHomeAssistantEntity } from '../../api/hooks'
import Tile, { TileProps } from '../basic/Tile'

export const SambaBackupStatus = () => (
  <StateDropdownHelperTile
    title="Backup service"
    entityId="sensor.samba_backup"
    icon={<QuestionMarkIcon />}
    customStateParams={[
      {
        state: 'IDLE',
        name: 'Standby',
        icon: <CheckIcon />,
        iconClassnames: 'text-green-500'
      },
      {
        state: 'RUNNING',
        name: 'Running',
        icon: <CloudSyncIcon />,
        iconClassnames: 'animate-pulse text-orange-500'
      },
      {
        state: 'SUCCEEDED',
        name: 'Completed',
        icon: <CloudSyncIcon />,
        iconClassnames: 'animate-pulse text-green-500'
      },
      {
        state: 'FAILED',
        name: 'FAILURE',
        icon: <WarningAmberIcon />,
        iconClassnames: 'text-red-600'
      }
    ]}
  />
)

export const CallManualBackup = () => (
  <CallServiceTile
    title="Trigger manual backup"
    icon={<BackupIcon />}
    domain="hassio"
    service="addon_stdin"
    payload={{
      addon: '15d21743_samba_backup',
      input: 'trigger'
    }}
  />
)

export interface SambaBackupAttributes {
  backups_local: string
  backups_remote: string
  total_backups_succeeded: string
  total_backups_failed: string
  last_backup: string
}

type StatisticProps = {
  title: string
  value: string
  icon: ReactElement
}

const Statistic = ({ title, value, icon }: StatisticProps) => (
  <div className="flex-center h-24 w-[50%] text-center">
    <div>
      <div className="text-3xl">
        {cloneElement(icon, {
          className: '!text-md mr-2 mt-[-4px]'
        })}
        <span data-testid={`${title}-value`}>{value}</span>
      </div>
      <div className="text-sm text-gray-300">{title}</div>
    </div>
  </div>
)

export const BackupStats = () => {
  const { entityState, isUnavailable } = useHomeAssistantEntity(
    'sensor.samba_backup'
  )
  const data = entityState?.attributes as unknown as SambaBackupAttributes

  const body = (
    <div className="absolute bottom-2 left-1 w-full">
      <div className="mb-8 flex flex-row flex-wrap">
        <Statistic
          title="Stored locally"
          value={data?.backups_local}
          icon={<SdStorageIcon />}
        />
        <Statistic
          title="Stored remotely"
          value={data?.backups_remote}
          icon={<CloudIcon />}
        />
        <Statistic
          title="Successful"
          value={data?.total_backups_succeeded}
          icon={<CheckCircleOutlineIcon />}
        />
        <Statistic
          title="Failed"
          value={data?.total_backups_failed}
          icon={<ReportGmailerrorredIcon />}
        />
      </div>
      <div className="text-center text-sm">
        Last backup: {data?.last_backup}
      </div>
    </div>
  )

  const tileProps: TileProps = {
    title: 'Backup stats',
    size: 'big',
    isUnavailable,
    customBody: body
  }
  return <Tile {...tileProps} />
}
