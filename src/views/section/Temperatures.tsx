import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import {
  HumidityChartTile,
  TemperatureChartTile
} from '../../components/entityTiles/climate/ClimateTile'
import PlaceholderTile from '../../PlaceholderTile'

const Temperatures = () => (
  <TileSection>
    <TileGroup name="Temperature">
      <TemperatureChartTile
        title="Living room"
        entityId="sensor.livingroomtempsensor_temperature"
      />
      <TemperatureChartTile
        title="Daniel"
        entityId="sensor.danieltempsensor_temperature"
      />
      <TemperatureChartTile
        title="Ania"
        entityId="sensor.aniatempsensor_temperature"
      />
    </TileGroup>
    <TileGroup name="Thermostat">
      <PlaceholderTile title="Living room" size="horizontal" />
      <PlaceholderTile title="Daniel" size="horizontal" />
      <PlaceholderTile title="Ania" size="horizontal" />
    </TileGroup>
    <TileGroup name="Humidity">
      <HumidityChartTile
        title="Living room"
        entityId="sensor.livingroomtempsensor_humidity"
      />
      <HumidityChartTile
        title="Daniel"
        entityId="sensor.danieltempsensor_humidity"
      />
      <HumidityChartTile
        title="Ania"
        entityId="sensor.aniatempsensor_humidity"
      />
    </TileGroup>
  </TileSection>
)

export default Temperatures
