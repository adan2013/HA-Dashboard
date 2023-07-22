import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import NightsStayIcon from '@mui/icons-material/NightsStay'
import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import PlaceholderTile from '../../PlaceholderTile'
import ToggleHelperTile from '../../components/entityTiles/toggleHelper/ToggleHelperTile'
import DateCountdownHelperTile from '../../components/entityTiles/toggleHelper/DateCountdownHelperTile'

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
      <PlaceholderTile
        title="Washing machine power consumption"
        size="horizontal"
      />
      <PlaceholderTile title="Washing machine plug" size="standard" />
      <PlaceholderTile title="Washing machine status" size="standard" />
    </TileGroup>
    <TileGroup name="Daniel">
      <PlaceholderTile title="Sunrise" size="horizontal" />
      <PlaceholderTile title="Auto blind" size="standard" />
      <PlaceholderTile title="PC plug" size="standard" />
    </TileGroup>
  </TileSection>
)

export default Automations
