export type Theme = {
  name: string
  primary: string
  secondary: string
}

export type ActiveTheme = 'Blue' | 'Gray'

export const themes: Theme[] = [
  {
    name: 'Blue',
    primary: 'bg-blue-900',
    secondary: 'bg-blue-600'
  },
  {
    name: 'Gray',
    primary: 'bg-gray-900',
    secondary: 'bg-gray-600'
  }
]
