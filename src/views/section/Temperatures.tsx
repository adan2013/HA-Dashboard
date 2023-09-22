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
      <TemperatureChartTile
        title="Rack temperature"
        entityName="dash-node Server Rack Temperature"
      />
      <HumidityChartTile
        title="Rack humidity"
        entityName="dash-node Server Rack Humidity"
      />
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
