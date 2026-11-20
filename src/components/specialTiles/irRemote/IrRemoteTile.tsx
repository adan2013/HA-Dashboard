import clsx from 'clsx'
import { ReactElement } from 'react'
import Tile, { TileProps } from '../../basic/Tile'
import useIrRemote from '../../../hooks/useIrRemote'

export type IrRemoteButton = {
  id: string
  label: string
  code: string
  content: ReactElement | string
  sub?: string
}

export type IrRemoteItem = {
  placement: string
  buttons: IrRemoteButton[]
  direction?: 'row' | 'col'
}

const buttonClassName = clsx(
  'press-feedback flex min-h-0 min-w-0 cursor-pointer touch-manipulation select-none items-center justify-center',
  'bg-transparent text-center text-white transition-colors hover:bg-white hover:text-black',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white'
)

const outlineClassName = 'rounded-md border-2 border-gray-400'

type RemoteButtonProps = {
  button: IrRemoteButton
  isSending: boolean
  onPress: (button: IrRemoteButton) => void
  className?: string
}

const RemoteButton = ({
  button,
  isSending,
  onPress,
  className
}: RemoteButtonProps) => (
  <button
    type="button"
    aria-label={button.sub ? `${button.label} ${button.sub}` : button.label}
    aria-busy={isSending}
    className={clsx(buttonClassName, isSending && 'animate-pulse', className)}
    onClick={() => onPress(button)}
  >
    <div className="flex flex-col items-center">
      {typeof button.content === 'string' ? (
        <div className="text-sm font-bold">{button.content}</div>
      ) : (
        button.content
      )}
      {button.sub && (
        <div className="text-[10px] leading-none">{button.sub}</div>
      )}
    </div>
  </button>
)

type IrRemoteTileProps = {
  title: string
  gridClassName: string
  items: IrRemoteItem[]
}

const IrRemoteTile = ({ title, gridClassName, items }: IrRemoteTileProps) => {
  const { send, sendingButtonId } = useIrRemote()
  const onPress = (button: IrRemoteButton) => {
    send(button.id, button.code)
  }

  const renderItem = ({
    placement,
    buttons,
    direction = 'row'
  }: IrRemoteItem) => {
    if (buttons.length === 1) {
      const [button] = buttons
      return (
        <RemoteButton
          key={button.id}
          button={button}
          isSending={sendingButtonId === button.id}
          onPress={onPress}
          className={clsx(
            outlineClassName,
            'hover:border-white focus-visible:border-white',
            placement
          )}
        />
      )
    }
    return (
      <div
        key={buttons.map(({ id }) => id).join('-')}
        role="group"
        className={clsx(
          'flex divide-gray-400 overflow-hidden transition-colors',
          'focus-within:divide-white focus-within:border-white hover:divide-white hover:border-white',
          outlineClassName,
          direction === 'row' ? 'flex-row divide-x-2' : 'flex-col divide-y-2',
          placement
        )}
      >
        {buttons.map(button => (
          <RemoteButton
            key={button.id}
            button={button}
            isSending={sendingButtonId === button.id}
            onPress={onPress}
            className="flex-1"
          />
        ))}
      </div>
    )
  }

  const tileData: TileProps = {
    title,
    size: 'big',
    requiresHomeAssistant: true,
    customBody: (
      <div className="h-full w-full px-2 pb-2 pt-1 [container-type:size]">
        <div className={clsx('grid h-full gap-1.5', gridClassName)}>
          {items.map(renderItem)}
        </div>
      </div>
    )
  }
  return <Tile {...tileData} />
}

export default IrRemoteTile
