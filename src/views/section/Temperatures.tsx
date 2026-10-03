import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import {
  HumidityChartTile,
  TemperatureChartTile
} from '../../components/entityTiles/climate/ClimateTile'
import RadiatorTile from '../../components/entityTiles/climate/RadiatorTile'

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
      <RadiatorTile
        title="Living Room"
        entityId="climate.livingroomradiatorvalve"
        batteryEntityId="sensor.livingroomradiatorvalve_battery"
      />
      <RadiatorTile
        title="Daniel"
        entityId="climate.danielradiatorvalve"
        batteryEntityId="sensor.danielradiatorvalve_battery"
      />
      <RadiatorTile
        title="Ania"
        entityId="climate.aniaradiatorvalve"
        batteryEntityId="sensor.aniaradiatorvalve_battery"
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
  </TileSection>
)

export default Temperatures
