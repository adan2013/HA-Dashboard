import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import ToggleHelperTile from '../../components/entityTiles/helpers/ToggleHelperTile'
import DateCountdownHelperTile from '../../components/entityTiles/helpers/DateCountdownHelperTile'
import SwitchTile from '../../components/entityTiles/switch/SwitchTile'
import { PowerChartTile } from '../../components/entityTiles/switch/PlugTile'
import NumericValueTile from '../../components/entityTiles/general/NumericValueTile'
import EnergyMonitorTile from '../../components/entityTiles/switch/EnergyMonitorTile'

const Automations = () => (
  <TileSection>
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
    <TileGroup name="Kitchen">
      <PowerChartTile
        title="A/C power consumption"
        entityId="sensor.airconditionerbreaker_power"
      />
      <EnergyMonitorTile
        deviceName="greeAirConditioner"
        title="A/C energy monitor"
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
    </TileGroup>
    <TileGroup name="Deadlines">
      <DateCountdownHelperTile
        title="Water filter"
        entityId="input_datetime.kitchenfilterservice"
        interval={120}
        warningThreshold={14}
        criticalThreshold={7}
      />
      <DateCountdownHelperTile
        title="Water mineralization filter"
        entityId="input_datetime.kitchenfinalfilterservice"
        interval={365}
        warningThreshold={14}
        criticalThreshold={7}
      />
      <DateCountdownHelperTile
        title="Water membrane filter"
        entityId="input_datetime.kitchenmembranefilterservice"
        interval={485}
        warningThreshold={14}
        criticalThreshold={7}
      />
      <DateCountdownHelperTile
        title="Car insurance"
        entityId="input_datetime.carinsurance"
        interval={365}
        warningThreshold={30}
        criticalThreshold={14}
      />
      <DateCountdownHelperTile
        title="Car technical inspection"
        entityId="input_datetime.cartechnicalinspection"
        interval={365}
        warningThreshold={30}
        criticalThreshold={14}
      />
      <DateCountdownHelperTile
        title="Coffee machine cleaning"
        entityId="input_datetime.coffeemachinecleaning"
        interval={14}
        warningThreshold={3}
        criticalThreshold={1}
      />
    </TileGroup>
  </TileSection>
)

export default Automations
