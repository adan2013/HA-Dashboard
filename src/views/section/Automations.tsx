import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import NightsStayIcon from '@mui/icons-material/NightsStay'
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

const Automations = () => (
  <TileSection>
    <TileGroup name="Kitchen">
      <DateCountdownHelperTile
        title="Water filter"
        entityId="input_datetime.kitchenfilterservice"
        interval={120}
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
      <DateCountdownHelperTile
        title="Water mineralization filter"
        entityId="input_datetime.kitchenfinalfilterservice"
        interval={365}
        warningThreshold={10}
        criticalThreshold={3}
      />
      <ToggleHelperTile
        title="Motion sensor"
        entityId="binary_sensor.kitchen_node_motion_in_kitchen"
        onIcon={<VisibilityIcon />}
        offIcon={<VisibilityOffIcon />}
        stateNames={['clear', 'detected']}
        readonly
      />
      <ToggleHelperTile
        title="Light sensor"
        entityId="binary_sensor.kitchen_node_bright_in_kitchen"
        onIcon={<WbSunnyIcon />}
        offIcon={<NightsStayIcon />}
        onColor="text-yellow-500"
        stateNames={['dark', 'bright']}
        readonly
      />
    </TileGroup>
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
        customProps={{
          hideMinMax: true,
          hideChart: true,
          disableModalHistory: true,
          customTileProps: {
            size: 'standard'
          }
        }}
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
  </TileSection>
)

export default Automations
