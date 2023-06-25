import { Section } from './configTypes'

const lights: Section = {
  groups: [
    {
      name: 'Living room',
      tiles: [
        {
          name: 'Lamp'
        },
        {
          name: 'Table light',
          size: 'horizontal'
        },
        {
          name: 'Door lamp',
          size: 'big'
        },
        {
          name: 'TV light'
        },
        {
          name: 'Bed light'
        }
      ]
    }
  ]
}

export default lights
