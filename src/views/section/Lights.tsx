import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import SectionContent from '../../components/SectionContent'
import TileGroup from '../../components/TileGroup'
import Tile from '../../components/Tile'

const Light = () => (
  <SectionContent>
    <TileGroup name="Living room">
      <Tile
        title="Lamp"
        subtitle="Off"
        icon={<LightbulbOutlinedIcon />}
        onClick={() => console.log('click')}
        turnedOff
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

    <TileGroup name="Kitchen">
      <Tile
        title="Lamp"
        subtitle="Off"
        icon={<LightbulbOutlinedIcon />}
        onClick={() => console.log('click')}
        turnedOff
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

    <TileGroup name="Bathroom">
      <Tile
        title="Lamp"
        subtitle="Off"
        icon={<LightbulbOutlinedIcon />}
        onClick={() => console.log('click')}
        turnedOff
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
  </SectionContent>
)

export default Light
