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
      <PlaceholderTile title="Occupied disk space" size="standard" />
      <PlaceholderTile title="Volumen status" size="standard" />
      <PlaceholderTile title="Shutdown NAS" size="standard" />
    </TileGroup>
    <TileGroup name="Home Assistant">
      <PlaceholderTile title="Restart HA" size="standard" />
      <PlaceholderTile title="Shutdown HA" size="standard" />
      <PlaceholderTile title="Go to HA Dashboard" size="standard" />
    </TileGroup>
  </TileSection>
)

export default System
