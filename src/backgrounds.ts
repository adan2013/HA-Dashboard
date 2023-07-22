export type Background = {
  id: number
  name: string
  type: 'color' | 'gradient' | 'image'
  value: string
  textColor: string
  attribution?: string
}

export const backgrounds: Background[] = [
  {
    id: 1,
    name: 'Blue',
    type: 'color',
    value: 'bg-gray-800',
    textColor: 'text-white'
  },
  {
    id: 2,
    name: 'Black',
    type: 'color',
    value: 'bg-black',
    textColor: 'text-white'
  },
  {
    id: 3,
    name: 'Blue waves',
    type: 'image',
    value: 'bg-blue-waves.jpg',
    attribution: 'Image by starline from Freepik',
    textColor: 'text-black'
  },
  {
    id: 4,
    name: 'Blue gradient',
    type: 'gradient',
    value: 'bg-gradient-to-br from-cyan-500 to-blue-500',
    textColor: 'text-black'
  }
]
