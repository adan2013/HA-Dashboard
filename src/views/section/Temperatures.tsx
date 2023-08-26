import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import PlaceholderTile from '../../PlaceholderTile'
import {
  HumidityChartTile,
  TemperatureChartTile
} from '../../components/entityTiles/climate/ClimateTile'

const Temperatures = () => (
  <TileSection>
    <TileGroup name="Temperature">
      <TemperatureChartTile
        title="Living room"
        entityName="livingRoomTempSensor temperature"
      />
      <TemperatureChartTile
        title="Daniel"
        entityName="danielTempSensor temperature"
      />
      <TemperatureChartTile
        title="Ania"
        entityName="aniaTempSensor temperature"
      />
    </TileGroup>
    <TileGroup name="Humidity">
      <HumidityChartTile
        title="Living room"
        entityName="livingRoomTempSensor humidity"
      />
      <HumidityChartTile
        title="Daniel"
        entityName="danielTempSensor humidity"
      />
      <HumidityChartTile title="Ania" entityName="aniaTempSensor humidity" />
    </TileGroup>
    <TileGroup name="Server rack">
      <PlaceholderTile title="Temperature" size="horizontal" />
      <PlaceholderTile title="Humidity" size="horizontal" />
      <TemperatureChartTile
        title="NAS temperature"
        entityName="SynologyNAS Temperature"
        customProps={{
          hideChart: true
        }}
      />
    </TileGroup>
  </TileSection>
)

export default Temperatures
