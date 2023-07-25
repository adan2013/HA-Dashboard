import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import PlaceholderTile from '../../PlaceholderTile'
import {
  HumidityChartTile,
  TemperatureChartTile
} from '../../components/entityTiles/climate/ClimateTile'

const Temperatures = () => (
  <TileSection>
    <TileGroup name="Living room">
      <TemperatureChartTile
        title="Temperature"
        entityName="livingRoomTempSensor temperature"
      />
      <HumidityChartTile
        title="Humidity"
        entityName="livingRoomTempSensor humidity"
      />
    </TileGroup>
    <TileGroup name="Daniel">
      <TemperatureChartTile
        title="Temperature"
        entityName="danielTempSensor temperature"
      />
      <HumidityChartTile
        title="Humidity"
        entityName="danielTempSensor humidity"
      />
    </TileGroup>
    <TileGroup name="Ania">
      <TemperatureChartTile
        title="Temperature"
        entityName="aniaTempSensor temperature"
      />
      <HumidityChartTile
        title="Humidity"
        entityName="aniaTempSensor humidity"
      />
      <PlaceholderTile title="Air humidifier" size="standard" />
      <PlaceholderTile title="Automatic moisturizing" size="standard" />
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
