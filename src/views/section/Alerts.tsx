import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import PlaceholderTile from '../../PlaceholderTile'
import { BatteryTile } from '../../components/specialTiles/ZigbeeTiles'

const Alerts = () => (
  <TileSection>
    <TileGroup name="Devices">
      <BatteryTile />
    </TileGroup>
    <TileGroup name="Security">
      <PlaceholderTile title="Filter water leak" size="standard" />
      <PlaceholderTile title="Washing machine water leak" size="standard" />
      <PlaceholderTile title="Bathroom water leak" size="standard" />
      <PlaceholderTile title="Door deadbolt" size="standard" />
    </TileGroup>
    <TileGroup name="Sensors">
      <PlaceholderTile title="Sensor health monitoring" size="standard" />
      <PlaceholderTile title="Water leak alarm" size="standard" />
      <PlaceholderTile title="Auto turn off washing machine" size="standard" />
      <PlaceholderTile title="Door deadbolt alarm" size="standard" />
      <PlaceholderTile title="Kitchen water filter service" size="standard" />
    </TileGroup>
    <TileGroup name="System">
      <PlaceholderTile title="HA backup watchdog" size="standard" />
      <PlaceholderTile title="Device battery level watchdog" size="standard" />
      <PlaceholderTile title="HA service watchdog" size="standard" />
    </TileGroup>
  </TileSection>
)

export default Alerts
