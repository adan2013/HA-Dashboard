import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined'
import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import LightTile from '../../components/entityTiles/lights/LightTile'
import PlaceholderTile from '../../PlaceholderTile'
import ToggleHelperTile from '../../components/entityTiles/toggleHelper/ToggleHelperTile'
import CallRemoteControlTile from '../../components/entityTiles/services/CallRemoteControlTile'
import LightSceneSwitcher from '../../components/entityTiles/lights/LightSceneSwitcher'

const Lights = () => (
  <TileSection>
    <TileGroup name="Living room">
      <LightSceneSwitcher
        title="Ambient light scenes"
        options={[
          { msg: 'daily', name: 'Daily' },
          { msg: 'photography', name: 'Photography' },
          { msg: 'ambient', name: 'Ambient' },
          { msg: 'cinema', name: 'Cinema' },
          { msg: 'off', name: 'Off', extended: true }
        ]}
      />
      <LightSceneSwitcher
        title="Table light scenes"
        options={[
          { msg: 'daily', name: 'Daily' },
          { msg: 'max', name: 'Max' },
          { msg: 'off', name: 'Off' }
        ]}
      />
      <LightSceneSwitcher
        title="TV light scenes"
        options={[
          { msg: 'max', name: 'Max' },
          { msg: 'ambient', name: 'Ambient' },
          { msg: 'off', name: 'Off' }
        ]}
      />
      <LightTile
        title="TV light"
        entityName="tvLight"
        lightType="ceiling"
        // lockColorTemperature TODO restore
      />
      <LightTile
        title="Table light"
        entityName="tableLight"
        lightType="ceiling"
        lockColorTemperature
      />
      <LightTile
        title="Front ambient section"
        entityName="kitchen-node Ambient front"
        lightType="ceiling"
      />
      <LightTile
        title="Back ambient section"
        entityName="kitchen-node Ambient back"
        lightType="ceiling"
      />
      <PlaceholderTile title="Cabinet lights" size="standard" />
      <PlaceholderTile title="Auto cabinet light control" size="standard" />
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
    </TileGroup>
  </TileSection>
)

export default Lights
