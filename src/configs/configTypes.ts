export type Section = {
  groups: SectionGroup[]
}

export type SectionGroup = {
  name: string
  tiles: Tile[]
}

export type Tile = {
  name: string
  size?: TileSize
}

export type TileSize = 'standard' | 'horizontal' | 'big'
