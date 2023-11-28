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
        entityName="tvLight"
        lightType="ceiling"
        lockColorTemperature
      />
      <LightTile
        title="Table light"
        entityName="tableLight"
        lightType="ceiling"
        lockColorTemperature
      />
      <LightTile
        title="Front ceiling section"
        entityName="livingRoomFrontLight"
        lightType="ceiling"
        lockColorTemperature
      />
      <LightTile
        title="Back ceiling section"
        entityName="livingRoomBackLight"
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
        entityName="kitchenLeftLightOn"
        onColor="text-yellow-500"
        onIcon={<LightbulbIcon />}
        offIcon={<LightbulbOutlinedIcon />}
      />
      <ToggleHelperTile
        title="Right side lamp"
        entityName="kitchenRightLightOn"
        onColor="text-yellow-500"
        onIcon={<LightbulbIcon />}
        offIcon={<LightbulbOutlinedIcon />}
      />
      <ToggleHelperTile
        title="Movement detection"
        entityName="kitchenAutoLights"
      />
      <ToggleHelperTile
        title="Light detection"
        entityName="kitchenIgnoreSunPosition"
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
        entityName="bathroomLight"
        lightType="ceiling"
      />
      <LightTile title="WC light" entityName="wcLight" lightType="ceiling" />
      <SwitchTile title="Balcony light plug" entityName="balconyLight" />
      <ToggleHelperTile
        title="Balcony light auto switch"
        entityName="balconyLightAutoSwitch"
        metadataRenderer={() => ['16-22']}
      />
    </TileGroup>
  </TileSection>
)

export default Lights
