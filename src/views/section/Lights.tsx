import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined'
import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import LightTile from '../../components/entityTiles/lights/LightTile'
import PlaceholderTile from '../../PlaceholderTile'
import ToggleHelperTile from '../../components/entityTiles/helpers/ToggleHelperTile'
import CallRemoteControlTile from '../../components/entityTiles/services/CallRemoteControlTile'
import SwitchTile from '../../components/entityTiles/switch/SwitchTile'

const Lights = () => (
  <TileSection>
    <TileGroup name="Living room">
      <LightTile
        title="TV light"
        entityId="light.tvlight"
        lightType="ceiling"
        lockColorTemperature
      />
      <LightTile
        title="Table light"
        entityId="light.tablelight"
        lightType="ceiling"
        lockColorTemperature
      />
      <LightTile
        title="Front ceiling section"
        entityId="light.livingroomfrontlight"
        lightType="ceiling"
        lockColorTemperature
      />
      <LightTile
        title="Back ceiling section"
        entityId="light.livingroombacklight"
        lightType="ceiling"
        lockColorTemperature
      />
      <PlaceholderTile title="Cabinet lights" size="standard" />
      <CallRemoteControlTile
        title="Turn off all lights"
        icon={<PowerSettingsNewOutlinedIcon />}
        rcName="livingRoom"
        button="button_6_single"
      />
    </TileGroup>
    <TileGroup name="Kitchen">
      <ToggleHelperTile
        title="Left side lamp"
        entityId="input_boolean.kitchenleftlighton"
        onColor="text-yellow-500"
        onIcon={<LightbulbIcon />}
        offIcon={<LightbulbOutlinedIcon />}
      />
      <ToggleHelperTile
        title="Right side lamp"
        entityId="input_boolean.kitchenrightlighton"
        onColor="text-yellow-500"
        onIcon={<LightbulbIcon />}
        offIcon={<LightbulbOutlinedIcon />}
      />
      <ToggleHelperTile
        title="Movement detection"
        entityId="input_boolean.kitchenautolights"
      />
      <ToggleHelperTile
        title="Light detection"
        entityId="input_boolean.kitchenignoresunposition"
        reverseState
      />
      <CallRemoteControlTile
        title="Turn off all lights"
        icon={<PowerSettingsNewOutlinedIcon />}
        rcName="kitchen"
        button="button_3_single"
      />
    </TileGroup>
    <TileGroup name="Others">
      <LightTile
        title="Bathroom light"
        entityId="light.bathroomlight"
        lightType="ceiling"
      />
      <LightTile
        title="WC light"
        entityId="light.wclight"
        lightType="ceiling"
      />
      <SwitchTile title="Balcony light plug" entityId="switch.balconylight" />
      <ToggleHelperTile
        title="Balcony light auto switch"
        entityId="input_boolean.balconylightautoswitch"
        metadataRenderer={() => ['16-22']}
      />
    </TileGroup>
  </TileSection>
)

export default Lights
