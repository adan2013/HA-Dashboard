import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import {
  HumidityChartTile,
  TemperatureChartTile
} from '../../components/entityTiles/climate/ClimateTile'

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
    <TileGroup name="Server rack">
      <TemperatureChartTile
        title="Rack temperature"
        entityId="sensor.dash_node_server_rack_temperature"
      />
      <HumidityChartTile
        title="Rack humidity"
        entityId="sensor.dash_node_server_rack_humidity"
      />
      <TemperatureChartTile
        title="NAS temperature"
        entityId="sensor.synologynas_temperature"
        customProps={{
          hideChart: true
        }}
      />
    </TileGroup>
  </TileSection>
)

export default Temperatures
