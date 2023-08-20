import ReplayIcon from '@mui/icons-material/Replay'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
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
  OccupiedDiskSpace,
  SynologyDsmUpdate,
  SynologySecurityStatus
} from '../../components/specialTiles/SynologyNasServer'
import CallServiceTile from '../../components/entityTiles/services/CallServiceTile'

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
      <OccupiedDiskSpace />
      <PlaceholderTile title="Volumen status" size="standard" />
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
      <PlaceholderTile title="Restart HA" size="standard" />
      <PlaceholderTile title="Shutdown HA" size="standard" />
      <PlaceholderTile title="Go to HA Dashboard" size="standard" />
    </TileGroup>
  </TileSection>
)

export default System
