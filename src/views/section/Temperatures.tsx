import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import PlaceholderTile from '../../PlaceholderTile'
import ClimateValueTile from '../../components/entityTiles/climate/ClimateValueTile'

const Temperatures = () => (
  <TileSection>
    <TileGroup name="Living room">
      <ClimateValueTile
        title="Temperature"
        entityName="livingRoomTempSensor temperature"
        valueType="temperature"
      />
      <ClimateValueTile
        title="Humidity"
        entityName="livingRoomTempSensor humidity"
        valueType="humidity"
      />
    </TileGroup>
    <TileGroup name="Daniel">
      <ClimateValueTile
        title="Temperature"
        entityName="danielTempSensor temperature"
        valueType="temperature"
      />
      <ClimateValueTile
        title="Humidity"
        entityName="danielTempSensor humidity"
        valueType="humidity"
      />
    </TileGroup>
    <TileGroup name="Ania">
      <ClimateValueTile
        title="Temperature"
        entityName="aniaTempSensor temperature"
        valueType="temperature"
      />
      <ClimateValueTile
        title="Humidity"
        entityName="aniaTempSensor humidity"
        valueType="humidity"
      />
      <PlaceholderTile title="Air humidifier" size="standard" />
      <PlaceholderTile title="Automatic moisturizing" size="standard" />
    </TileGroup>
    <TileGroup name="Server rack">
      <PlaceholderTile title="Temperature" size="horizontal" />
      <PlaceholderTile title="Humidity" size="horizontal" />
      <ClimateValueTile
        title="NAS temperature"
        entityName="SynologyNAS Temperature"
        valueType="temperature"
      />
    </TileGroup>
  </TileSection>
)

export default Temperatures
