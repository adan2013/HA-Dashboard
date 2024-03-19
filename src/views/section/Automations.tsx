import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService'
import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import ToggleHelperTile from '../../components/entityTiles/helpers/ToggleHelperTile'
import DateCountdownHelperTile from '../../components/entityTiles/helpers/DateCountdownHelperTile'
import SwitchTile from '../../components/entityTiles/switch/SwitchTile'
import {
  EnergyConsumptionChartTile,
  PowerChartTile
} from '../../components/entityTiles/switch/PlugTile'
import { TemperatureChartTile } from '../../components/entityTiles/climate/ClimateTile'
import StateDropdownHelperTile from '../../components/entityTiles/helpers/StateDropdownHelperTile'
import NumericValueTile from '../../components/entityTiles/general/NumericValueTile'

const Automations = () => (
  <TileSection>
    <TileGroup name="Bathroom">
      <PowerChartTile
        title="Washing machine power consumption"
        entityId="sensor.washingmachineplug_power"
      />
      <SwitchTile
        title="WM plug"
        entityId="switch.washingmachineplug"
        confirmationRequired
      />
      <StateDropdownHelperTile
        title="WM status"
        entityId="input_select.washingmachinestate"
        icon={<LocalLaundryServiceIcon />}
        customStateParams={[
          {
            state: 'LOADED',
            iconClassnames: 'text-orange-400'
          },
          {
            state: 'WORKING',
            iconClassnames: 'text-sky-400'
          }
        ]}
        holdAction={{
          state: 'EMPTY',
          confirmationRequired: true,
          message:
            'Are you sure you want to reset the state of the washing machine?'
        }}
      />
      <EnergyConsumptionChartTile
        title="WM energy consumption"
        entityId="sensor.washingmachineplug_energy"
      />
      <TemperatureChartTile
        title="WM plug temperature"
        entityId="sensor.washingmachineplug_device_temperature"
        customProps={{
          hideChart: true,
          disableModalHistory: true,
          showDecimals: 0,
          customTileProps: {
            size: 'standard'
          }
        }}
      />
    </TileGroup>
    <TileGroup name="Kitchen">
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
        warningThreshold={10}
        criticalThreshold={3}
      />
      <DateCountdownHelperTile
        title="Water mineralization filter"
        entityId="input_datetime.kitchenfinalfilterservice"
        interval={365}
        warningThreshold={10}
        criticalThreshold={3}
      />
      <DateCountdownHelperTile
        title="Water membrane filter"
        entityId="input_datetime.kitchenmembranefilterservice"
        interval={485}
        warningThreshold={10}
        criticalThreshold={3}
      />
    </TileGroup>
  </TileSection>
)

export default Automations
