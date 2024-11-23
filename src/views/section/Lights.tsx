import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined'
import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import LightTile from '../../components/entityTiles/lights/LightTile'
import ToggleHelperTile from '../../components/entityTiles/helpers/ToggleHelperTile'
import CallRemoteControlTile from '../../components/entityTiles/services/CallRemoteControlTile'

const Lights = () => (
  <TileSection>
    <TileGroup name="Living room">
      <LightTile
        title="Back ceiling section"
        entityId="light.livingroombacklight"
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
        title="Cabinet lights"
        entityId="light.cabinetlight"
        lightType="bulb"
      />
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
      <CallRemoteControlTile
        title="Turn off all lights"
        icon={<PowerSettingsNewOutlinedIcon />}
        entityId="sensor.livingroomremote_action"
        buttonNumber={6}
        buttonAction="single"
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
        entityId="sensor.kitchenremote_action"
        buttonNumber={3}
        buttonAction="single"
      />
    </TileGroup>
    <TileGroup name="Others">
      <LightTile title="Daniel`s bed lamp" entityId="light.danielbedlamp" />
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
    </TileGroup>
  </TileSection>
)

export default Lights
