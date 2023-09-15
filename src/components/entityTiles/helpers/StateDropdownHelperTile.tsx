import { ReactElement } from 'react'
import { toast } from 'react-toastify'
import Tile, { TileProps } from '../../basic/Tile'
import { useHomeAssistantEntity } from '../../../api/hooks'
import { useHomeAssistant } from '../../../contexts/HomeAssistantContext'
import { ConfirmationModalParams } from '../../../contexts/modalUtils'
import { useModalContext } from '../../../contexts/ModalContext'

type CustomStateParams = {
  state: string
  name?: string
  icon?: ReactElement
  iconClassnames?: string
}

type StateChangeOption = {
  state: string
  confirmationRequired?: boolean
  message?: string
  isDanger?: boolean
}

export type StateDropdownHelperTileProps = {
  title: string
  entityName: string
  icon?: ReactElement
  iconClassnames?: string
  customStateParams?: CustomStateParams[]
  customTileProps?: Partial<TileProps>
  clickAction?: StateChangeOption
  holdAction?: StateChangeOption
}

const StateDropdownHelperTile = ({
  title,
  entityName,
  icon,
  iconClassnames,
  customStateParams,
  customTileProps,
  clickAction,
  holdAction
}: StateDropdownHelperTileProps) => {
  const { entityState, isUnavailable } = useHomeAssistantEntity(entityName)
  const ha = useHomeAssistant()
  const modal = useModalContext()

  const changeState = (value: string) => {
    ha.callService(entityState.id, 'input_select', 'select_option', {
      option: value
    })
    toast.success('The state has been changed')
  }

  const onAction = (action: StateChangeOption) => {
    if (isUnavailable) return
    if (action.confirmationRequired) {
      const params: ConfirmationModalParams = {
        isDanger: action.isDanger,
        message:
          action.message ||
          `Are you sure you want to change the state to ${action.state}?`,
        onConfirm: () => changeState(action.state)
      }
      modal.openModal('confirmation', params)
    } else {
      changeState(action.state)
    }
  }

  const customParams = customStateParams.find(
    s => s.state === entityState?.state
  )

  const tileData: TileProps = {
    title,
    subtitle: customParams?.name || entityState?.state?.toLowerCase(),
    icon: customParams?.icon || icon,
    iconClassnames: customParams?.iconClassnames || iconClassnames,
    onClick: clickAction ? () => onAction(clickAction) : undefined,
    onHold: holdAction ? () => onAction(holdAction) : undefined,
    isUnavailable,
    ...customTileProps
  }
  return <Tile {...tileData} />
}

StateDropdownHelperTile.defaultProps = {
  customStateParams: []
}

export default StateDropdownHelperTile
