import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import ToggleHelperTile from '../../components/entityTiles/helpers/ToggleHelperTile'
import SwitchTile from '../../components/entityTiles/switch/SwitchTile'
import { PowerChartTile } from '../../components/entityTiles/switch/PlugTile'
import NumericValueTile from '../../components/entityTiles/general/NumericValueTile'
import EnergyMonitorTile from '../../components/entityTiles/switch/EnergyMonitorTile'
import BambuLabPrinterTile from '../../components/specialTiles/BambuLabPrinterTile'
import PlaceholderTile from '../../PlaceholderTile'

const Automations = () => (
  <TileSection>
    <TileGroup name="Living room">
      <PowerChartTile
        title="A/C power consumption"
        entityId="sensor.airconditionerbreaker_power"
      />
      <EnergyMonitorTile
        deviceName="greeAirConditioner"
        title="A/C energy monitor"
      />
    </TileGroup>
    <TileGroup name="Kitchen">
      <PowerChartTile
        title="3D printer power consumption"
        entityId="sensor.bambulabprinterplug_power"
      />
      <EnergyMonitorTile
        deviceName="bambuLabPrinter"
        title="3D printer energy monitor"
      />
      <ToggleHelperTile
        title="Motion sensor"
        entityId="binary_sensor.kitchenmotionsensor_occupancy"
        onIcon={<VisibilityIcon />}
        offIcon={<VisibilityOffIcon />}
        stateNames={['clear', 'detected']}
        readonly
      />
      <NumericValueTile
        title="Light sensor"
        entityId="sensor.kitchenmotionsensor_illuminance_lux"
        unit="lux"
      />
      <BambuLabPrinterTile
        title="Bambu Lab P1S"
        mainEntityId="p1s_01p00a453001011"
      />
      <SwitchTile
        title="Printer plug"
        entityId="switch.bambulabprinterplug"
        confirmationRequired
      />
      <PlaceholderTile title="Auto power off" size="standard" />
      <PlaceholderTile title="Pause current task" size="standard" />
      <PlaceholderTile title="Chamber light" size="standard" />
      <PlaceholderTile title="Camera view" size="standard" />
    </TileGroup>
    <TileGroup name="Bathroom">
      <PowerChartTile
        title="Washing machine power consumption"
        entityId="sensor.washingmachineplug_power"
      />
      <EnergyMonitorTile
        deviceName="washingMachine"
        title="WM energy monitor"
      />
      <SwitchTile
        title="WM plug"
        entityId="switch.washingmachineplug"
        confirmationRequired
      />
    </TileGroup>
  </TileSection>
)

export default Automations
