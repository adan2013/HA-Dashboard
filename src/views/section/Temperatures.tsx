import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import PlaceholderTile from '../../PlaceholderTile'

const Temperatures = () => (
  <TileSection>
    <TileGroup name="Living room">
      <PlaceholderTile title="Temperature" size="horizontal" />
      <PlaceholderTile title="Humidity" size="horizontal" />
    </TileGroup>
    <TileGroup name="Daniel">
      <PlaceholderTile title="Temperature" size="horizontal" />
      <PlaceholderTile title="Humidity" size="horizontal" />
    </TileGroup>
    <TileGroup name="Ania">
      <PlaceholderTile title="Temperature" size="horizontal" />
      <PlaceholderTile title="Humidity" size="horizontal" />
      <PlaceholderTile title="Air humidifier" size="standard" />
      <PlaceholderTile title="Automatic moisturizing" size="standard" />
    </TileGroup>
    <TileGroup name="Server rack">
      <PlaceholderTile title="Temperature" size="horizontal" />
      <PlaceholderTile title="Humidity" size="horizontal" />
      <PlaceholderTile title="NAS temperature" size="horizontal" />
    </TileGroup>
  </TileSection>
)

export default Temperatures
