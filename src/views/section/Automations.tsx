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
        entityName="kitchenFilterService"
        interval={120}
        warningThreshold={21}
        criticalThreshold={7}
      />
      <DateCountdownHelperTile
        title="Water membrane filter"
        entityName="kitchenMembraneFilterService"
        interval={365}
        warningThreshold={21}
        criticalThreshold={7}
      />
      <ToggleHelperTile
        title="Motion sensor"
        entityName="kitchen-node Motion in kitchen"
        onIcon={<VisibilityIcon />}
        offIcon={<VisibilityOffIcon />}
        stateNames={['clear', 'detected']}
        readonly
      />
      <ToggleHelperTile
        title="Light sensor"
        entityName="kitchen-node Bright in kitchen"
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
        entityName="washingMachinePlug power"
      />
      <SwitchTile
        title="WM plug"
        entityName="washingMachinePlug"
        confirmationRequired
      />
      <StateDropdownHelperTile
        title="WM status"
        entityName="washingMachineState"
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
        entityName="washingMachinePlug energy"
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
        entityName="washingMachinePlug device temperature"
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
