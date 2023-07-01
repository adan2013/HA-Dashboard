import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import Tile from '../../components/Tile'
import LightTile from '../../components/entityTiles/LightTile'

const Light = () => (
  <TileSection>
    <TileGroup name="Living room">
      <LightTile
        title="Table light"
        entityName="tableLight"
        lightType="ceiling"
      />
      <LightTile
        title="Front ambient light"
        entityName="kitchen-node Ambient front"
        lightType="ceiling"
      />
      <LightTile
        title="Back ambient light"
        entityName="kitchen-node Ambient back"
        lightType="ceiling"
      />
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

export default Light
