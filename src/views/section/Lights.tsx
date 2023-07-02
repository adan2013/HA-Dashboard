import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import Tile from '../../components/Tile'
import LightTile from '../../components/entityTiles/LightTile'
import PlaceholderTile from '../../PlaceholderTile'

const Lights = () => (
  <TileSection>
    <TileGroup name="Living room">
      <PlaceholderTile title="Ambient light" size="big" />
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
      <LightTile
        title="Left side lamp"
        entityName="kitchen-node Left kitchen"
      />
      <LightTile
        title="Right side lamp"
        entityName="kitchen-node Right kitchen"
      />
      <PlaceholderTile title="Movement detection" size="standard" />
      <PlaceholderTile title="Light detection" size="standard" />
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
    <TileGroup name="Test 1">
      <Tile
        title="Lamp"
        subtitle="Off"
        icon={<LightbulbOutlinedIcon />}
        onClick={() => console.log('click')}
        isTurnedOff
      />
      <Tile
        title="Temperature"
        metadata={['MAX 26.4', 'MIN 24.3']}
        size="horizontal"
        value={{ main: '25', decimal: '.4', unit: '°C' }}
        onClick={() => console.log('click')}
      />
      <Tile
        title="Humidity"
        metadata={['MAX 64', 'MIN 45']}
        size="horizontal"
        value={{ main: '55', unit: '%' }}
        onClick={() => console.log('click')}
      />
      <Tile title="Table light" size="horizontal" />
      <Tile title="Door lamp" size="big" />
      <Tile title="Table light" size="horizontal" />
      <Tile title="Door lamp" size="big" />
      <Tile title="Table light" size="horizontal" />
      <Tile title="Table light" size="horizontal" />
      <Tile title="Table light" size="horizontal" />
      <Tile title="Table light" />
      <Tile title="Door lamp" size="big" />
      <Tile title="Door lamp" size="big" />
      <Tile
        title="TV light"
        subtitle="On"
        metadata={['55%']}
        icon={<LightbulbIcon />}
        iconClassnames="text-yellow-500"
        onClick={() => console.log('click')}
      />
    </TileGroup>

    <TileGroup name="Test 2">
      <Tile
        title="Lamp"
        subtitle="Off"
        icon={<LightbulbOutlinedIcon />}
        onClick={() => console.log('click')}
        isTurnedOff
      />
      <Tile
        title="Temperature"
        metadata={['MAX 26.4', 'MIN 24.3']}
        size="horizontal"
        value={{ main: '25', decimal: '.4', unit: '°C' }}
        onClick={() => console.log('click')}
      />
      <Tile
        title="Humidity"
        metadata={['MAX 64', 'MIN 45']}
        size="horizontal"
        value={{ main: '55', unit: '%' }}
        onClick={() => console.log('click')}
      />
      <Tile title="Table light" size="horizontal" />
      <Tile title="Door lamp" size="big" />
      <Tile
        title="TV light"
        subtitle="On"
        metadata={['55%']}
        icon={<LightbulbIcon />}
        iconClassnames="text-yellow-500"
        onClick={() => console.log('click')}
      />
    </TileGroup>

    <TileGroup name="Test 3">
      <Tile
        title="Lamp"
        subtitle="Off"
        icon={<LightbulbOutlinedIcon />}
        onClick={() => console.log('click')}
        isTurnedOff
      />
      <Tile
        title="Temperature"
        metadata={['MAX 26.4', 'MIN 24.3']}
        size="horizontal"
        value={{ main: '25', decimal: '.4', unit: '°C' }}
        onClick={() => console.log('click')}
      />
      <Tile
        title="Humidity"
        metadata={['MAX 64', 'MIN 45']}
        size="horizontal"
        value={{ main: '55', unit: '%' }}
        onClick={() => console.log('click')}
      />
      <Tile title="Table light" size="horizontal" />
      <Tile title="Door lamp" size="big" />
      <Tile
        title="TV light"
        subtitle="On"
        metadata={['55%']}
        icon={<LightbulbIcon />}
        iconClassnames="text-yellow-500"
        onClick={() => console.log('click')}
      />
    </TileGroup>
  </TileSection>
)

export default Lights
