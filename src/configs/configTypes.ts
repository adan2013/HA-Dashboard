import { ReactElement } from 'react'

export type TileSize = 'standard' | 'horizontal' | 'big'

export type TileValue = {
  main: string | number
  decimal?: string | number
  unit?: string
}

export type TileMetadata = {
  title: string
  subtitle?: string
  metadata?: string[]
  value?: string | number | TileValue
  tileColor?: string
  iconClassnames?: string
  icon?: ReactElement
  size?: TileSize
  turnedOff?: boolean
  disabled?: boolean
  onClick?: () => void
  customBody?: ReactElement
}

export type SectionGroup = {
  name: string
  tiles: TileMetadata[]
}

export type Section = {
  groups: SectionGroup[]
}
