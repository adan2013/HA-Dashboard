import ReplayIcon from '@mui/icons-material/Replay'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
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
import { getHomeAssistantHost } from '../../utils/viteUtils'
import ServiceStatusTile from '../../components/devTiles/ServiceStatusTile'
import ExternalPageTile from '../../components/specialTiles/ExternalPageTile'

const System = () => (
  <TileSection>
    <TileGroup name="Status">
      <SignalTile />
      <ServiceStatusTile />
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
      <ExternalPageTile
        title="Open Synology dashboard"
        url="http://192.168.1.3:5000"
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
      <ExternalPageTile
        title="Go to HA Dashboard"
        url={`http://${getHomeAssistantHost()}`}
      />
    </TileGroup>
    <TileGroup name="Server">
      <ExternalPageTile
        title="Open Proxmox dashboard"
        url="http://192.168.1.10:8006"
      />
      <ExternalPageTile
        title="Open Portainer dashboard"
        url="http://192.168.1.11:9000"
      />
    </TileGroup>
  </TileSection>
)

export default System
