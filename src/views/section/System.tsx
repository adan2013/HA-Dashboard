import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import PlaceholderTile from '../../PlaceholderTile'
import { SignalTile } from '../../components/specialTiles/ZigbeeTiles'

const System = () => (
  <TileSection>
    <TileGroup name="Status">
      <SignalTile />
      <PlaceholderTile title="Zigbee network map" size="standard" />
      <PlaceholderTile title="ESPhome devices" size="standard" />
      <PlaceholderTile title="HA services" size="standard" />
      <PlaceholderTile title="Batteries" size="big" />
    </TileGroup>
    <TileGroup name="Backups">
      <PlaceholderTile title="Backup service status" size="big" />
      <PlaceholderTile title="Trigger manual backup" size="standard" />
      <PlaceholderTile title="History of backups" size="standard" />
    </TileGroup>
    <TileGroup name="NAS server">
      <PlaceholderTile title="DSM update" size="standard" />
      <PlaceholderTile title="Plugins update" size="standard" />
      <PlaceholderTile title="Occupied disk space" size="horizontal" />
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
