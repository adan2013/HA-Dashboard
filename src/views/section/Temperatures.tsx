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
        entityName="livingRoomTempSensor Temperature"
      />
      <TemperatureChartTile
        title="Daniel"
        entityName="danielTempSensor Temperature"
      />
      <TemperatureChartTile
        title="Ania"
        entityName="aniaTempSensor Temperature"
      />
    </TileGroup>
    <TileGroup name="Humidity">
      <HumidityChartTile
        title="Living room"
        entityName="livingRoomTempSensor Humidity"
      />
      <HumidityChartTile
        title="Daniel"
        entityName="danielTempSensor Humidity"
      />
      <HumidityChartTile title="Ania" entityName="aniaTempSensor Humidity" />
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
