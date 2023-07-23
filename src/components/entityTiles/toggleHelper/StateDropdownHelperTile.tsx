import { ReactElement } from 'react'
import Tile, { TileProps } from '../../Tile'
import { useHomeAssistantEntity } from '../../../api/hooks'

type CustomStateParams = {
  state: string
  name?: string
  icon?: ReactElement
  iconClassnames?: string
}

type StateDropdownHelperTileProps = {
  title: string
  entityName: string
  icon?: ReactElement
  customStateParams?: CustomStateParams[]
  customTileProps?: Partial<TileProps>
}

const StateDropdownHelperTile = ({
  title,
  entityName,
  icon,
  customStateParams,
  customTileProps
}: StateDropdownHelperTileProps) => {
  const { entityState, isUnavailable } = useHomeAssistantEntity(entityName)
  // TODO implement click and hold events + modal confirmation

  const customParams = customStateParams.find(
    s => s.state === entityState?.state
  )

  const tileData: TileProps = {
    title,
    subtitle: customParams?.name || entityState?.state?.toLowerCase(),
    icon: customParams?.icon || icon,
    iconClassnames: customParams?.iconClassnames,
    isUnavailable,
    ...customTileProps
  }
  return <Tile {...tileData} />
}

StateDropdownHelperTile.defaultProps = {
  customStateParams: []
}

export default StateDropdownHelperTile
