import clsx from 'clsx'
import { ReactElement } from 'react'
import Tile, { TileProps } from '../basic/Tile'
import useRemoteControl, {
  SupportedActions
} from '../../hooks/useRemoteControl'

export type Button = {
  icon: ReactElement
  label: string
  sub?: string
  iconOnly?: boolean
}

type SwitchButtonProps = {
  button: Button
  entityId: string
  num: number
  supportedActions: SupportedActions
}

const SwitchButton = ({
  button,
  entityId,
  num,
  supportedActions
}: SwitchButtonProps) => {
  const interactionEvents = useRemoteControl(entityId, num, supportedActions)
  const { icon, label, sub, iconOnly } = button

  return (
    <button
      type="button"
      aria-label={sub ? `${label} ${sub}` : label}
      className={clsx(
        'press-feedback flex min-h-0 min-w-0 cursor-pointer touch-manipulation items-center justify-center rounded-md border-2',
        'select-none border-gray-400 bg-transparent text-center text-white',
        'transition-colors hover:border-white hover:bg-white hover:text-black',
        'focus-visible:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
        '[container-type:size] [&_svg]:!text-[clamp(1.5rem,40cqmin,2.75rem)]'
      )}
      {...interactionEvents}
    >
      <div className="flex flex-col items-center gap-0.5 px-1">
        {icon}
        {!iconOnly && (
          <div className="text-[11px] font-bold leading-tight">{label}</div>
        )}
        {sub && <div className="text-[10px] leading-tight">{sub}</div>}
      </div>
    </button>
  )
}

type SwitcherProps = {
  entityId: string
  buttons: Button[]
  supportedActions: SupportedActions
}

const Switcher = ({ entityId, buttons, supportedActions }: SwitcherProps) => (
  <div className="h-full w-full px-2 pb-2 pt-1">
    <div className={clsx('grid h-full auto-rows-fr grid-cols-2 gap-2')}>
      {buttons.map((btn, idx) => {
        if (!btn) {
          // eslint-disable-next-line react/no-array-index-key
          return <div key={`disabled-btn-${idx}`} />
        }
        return (
          <SwitchButton
            key={btn.label}
            entityId={entityId}
            num={idx + 1}
            button={btn}
            supportedActions={supportedActions}
          />
        )
      })}
    </div>
  </div>
)

type RemoteControlTileProps = {
  title: string
  entityId: string
  buttons: Button[]
  supportedActions: SupportedActions
}

const RemoteControlTile = ({
  title,
  entityId,
  buttons,
  supportedActions
}: RemoteControlTileProps) => {
  const tileData: TileProps = {
    title,
    size: 'big',
    requiresHomeAssistant: true,
    customBody: (
      <Switcher
        entityId={entityId}
        buttons={buttons}
        supportedActions={supportedActions}
      />
    )
  }
  return <Tile {...tileData} />
}

export default RemoteControlTile
