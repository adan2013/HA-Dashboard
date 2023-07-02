import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import LightTile from '../../components/entityTiles/LightTile'
import PlaceholderTile from '../../PlaceholderTile'
import ToggleHelperTile from '../../components/entityTiles/ToggleHelperTile'

const Lights = () => (
  <TileSection>
    <TileGroup name="Living room">
      <PlaceholderTile title="Ambient light scenes" size="big" />
      <PlaceholderTile title="Table light scenes" size="horizontal" />
      <PlaceholderTile title="TV light scenes" size="horizontal" />
      <PlaceholderTile title="TV light" size="standard" />
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
      <PlaceholderTile title="Turn off all lights" size="standard" />
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
      <PlaceholderTile title="Turn off all lights" size="standard" />
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
