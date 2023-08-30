import ReplayIcon from '@mui/icons-material/Replay'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import LogoutIcon from '@mui/icons-material/Logout'
import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import PlaceholderTile from '../../PlaceholderTile'
import { SignalTile } from '../../components/specialTiles/ZigbeeTiles'
import {
  CallManualBackup,
  BackupStats,
  SambaBackupStatus
} from '../../components/specialTiles/SambaBackup'
import {
  NasTemperature,
  OccupiedDiskSpace,
  SynologyDsmUpdate,
  SynologySecurityStatus,
  SynologyVolumeStatus,
  VolumeTemperature
} from '../../components/specialTiles/SynologyNasServer'
import CallServiceTile from '../../components/entityTiles/services/CallServiceTile'
import Tile from '../../components/basic/Tile'
import { getHomeAssistantHost } from '../../utils/viteUtils'

const System = () => (
  <TileSection>
    <TileGroup name="Status">
      <SignalTile />
      <PlaceholderTile title="ESPhome devices" size="standard" />
      <PlaceholderTile title="HA services" size="standard" />
    </TileGroup>
    <TileGroup name="Backups">
      <SambaBackupStatus />
      <CallManualBackup />
      <BackupStats />
    </TileGroup>
    <TileGroup name="NAS server">
      <SynologyDsmUpdate />
      <SynologySecurityStatus />
      <SynologyVolumeStatus />
      <OccupiedDiskSpace />
      <VolumeTemperature />
      <NasTemperature />
      <CallServiceTile
        title="Reboot NAS"
        domain="synology_dsm"
        service="reboot"
        icon={<ReplayIcon />}
        confirmationRequired
      />
      <CallServiceTile
        title="Shutdown NAS"
        domain="synology_dsm"
        service="shutdown"
        icon={<PowerSettingsNewIcon />}
        confirmationRequired
      />
    </TileGroup>
    <TileGroup name="Home Assistant">
      <CallServiceTile
        title="Reboot HA"
        domain="hassio"
        service="host_reboot"
        icon={<ReplayIcon />}
        confirmationRequired
      />
      <CallServiceTile
        title="Shutdown HA"
        domain="hassio"
        service="host_shutdown"
        icon={<PowerSettingsNewIcon />}
        confirmationRequired
      />
      <Tile
        title="Go to HA Dashboard"
        icon={<LogoutIcon />}
        onClick={() => window.open(`http://${getHomeAssistantHost()}`, '_self')}
      />
    </TileGroup>
    <TileGroup name="Server">
      <Tile
        title="Open Proxmox dashboard"
        icon={<LogoutIcon />}
        onClick={() => window.open(`http://192.168.1.10:8006`, '_self')}
      />
      <Tile
        title="Open Portainer dashboard"
        icon={<LogoutIcon />}
        onClick={() => window.open(`http://192.168.1.11:9000`, '_self')}
      />
    </TileGroup>
  </TileSection>
)

export default System
