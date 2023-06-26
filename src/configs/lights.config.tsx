import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import { Section } from './configTypes'

const lights: Section = {
  groups: [
    {
      name: 'Living room',
      tiles: [
        {
          title: 'Lamp',
          subtitle: 'Off',
          icon: <LightbulbOutlinedIcon />,
          onClick: () => console.log('click'),
          turnedOff: true
        },
        {
          title: 'Temperature',
          metadata: ['MAX 26.4', 'MIN 24.3'],
          size: 'horizontal',
          value: {
            main: '25',
            decimal: '.4',
            unit: '°C'
          },
          onClick: () => console.log('click')
        },
        {
          title: 'Humidity',
          metadata: ['MAX 64', 'MIN 45'],
          size: 'horizontal',
          value: {
            main: '55',
            unit: '%'
          },
          onClick: () => console.log('click')
        },
        {
          title: 'Table light',
          size: 'horizontal'
        },
        {
          title: 'Door lamp',
          size: 'big'
        },
        {
          title: 'TV light',
          subtitle: 'On',
          metadata: ['55%'],
          value: {
            main: '55',
            decimal: '.4',
            unit: '%'
          },
          icon: <LightbulbIcon />,
          iconClassnames: 'text-yellow-500',
          onClick: () => console.log('click')
        },
        {
          title: 'Bed light'
        }
      ]
    }
  ]
}

export default lights
