export type Theme = {
  id: number
  name: string
  text: string
  primary: string
  secondary: string
  border: string
}

export const themes: Theme[] = [
  {
    id: 1,
    name: 'Blue',
    text: 'text-white',
    primary: 'bg-blue-900',
    secondary: 'bg-blue-600',
    border: 'border-blue-600'
  },
  {
    id: 2,
    name: 'Dark gray',
    text: 'text-white',
    primary: 'bg-gray-900',
    secondary: 'bg-gray-600',
    border: 'border-gray-600'
  },
  {
    id: 3,
    name: 'White smoke',
    text: 'text-black',
    primary: 'bg-gray-300',
    secondary: 'bg-gray-600',
    border: 'border-gray-600'
  },
  {
    id: 4,
    name: 'Red',
    text: 'text-white',
    primary: 'bg-red-800',
    secondary: 'bg-red-500',
    border: 'border-red-500'
  }
]
