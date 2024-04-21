import clsx from 'clsx'
import Tile, { TileProps } from '../basic/Tile'
import useAqaraOppleLogic from '../../hooks/useAqaraOppleLogic'

export type Button = string | [string, string]

type SwitchButtonProps = {
  button: Button
  entityId: string
  num: number
}

const SwitchButton = ({ button, entityId, num }: SwitchButtonProps) => {
  const interactionEvents = useAqaraOppleLogic(entityId, num)

  let main: string
  let sub: string
  if (Array.isArray(button)) {
    ;[main, sub] = button
  } else {
    main = button
  }
  return (
    <div
      className={clsx(
        'flex cursor-pointer items-center justify-center rounded-md border-2',
        'select-none border-gray-400 bg-transparent text-white',
        'transition-colors hover:border-white hover:bg-white hover:text-black'
      )}
      {...interactionEvents}
    >
      <div>
        <div>{main}</div>
        {sub && <div className="text-center text-[10px]">{sub}</div>}
      </div>
    </div>
  )
}

type SwitcherProps = {
  entityId: string
  buttons: Button[]
}

const Switcher = ({ entityId, buttons }: SwitcherProps) => (
  <div className="absolute bottom-0 left-0 h-64 w-full p-2">
    <div className={clsx('grid h-full auto-rows-fr grid-cols-2 gap-2')}>
      {buttons.map((btn, idx) => {
        if (!btn) {
          // eslint-disable-next-line react/no-array-index-key
          return <div key={`disabled-btn-${idx}`} />
        }
        const key = Array.isArray(btn) ? btn[0] : btn
        return (
          <SwitchButton
            key={key}
            entityId={entityId}
            num={idx + 1}
            button={btn}
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
}

const RemoteControlTile = ({
  title,
  entityId,
  buttons
}: RemoteControlTileProps) => {
  const tileData: TileProps = {
    title,
    size: 'big',
    customBody: <Switcher entityId={entityId} buttons={buttons} />
  }
  return <Tile {...tileData} />
}

export default RemoteControlTile
