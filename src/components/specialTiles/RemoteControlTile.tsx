import clsx from 'clsx'
import Tile, { TileProps } from '../Tile'

type Button = string | [string, string]

type SwitchButtonProps = {
  button: Button
}

const SwitchButton = ({ button }: SwitchButtonProps) => {
  let main = ''
  let sub = ''
  if (Array.isArray(button)) {
    ;[main, sub] = button
  } else {
    main = button
  }
  return (
    <div
      className={clsx(
        'flex cursor-pointer items-center justify-center rounded-md border-2',
        'border-gray-400 bg-transparent text-white',
        'transition-colors hover:border-white hover:bg-white hover:text-black'
      )}
    >
      <div>
        <div>{main}</div>
        {sub && <div className="text-center text-[10px]">{sub}</div>}
      </div>
    </div>
  )
}

type SwitcherProps = {
  buttons: Button[]
}

const Switcher = ({ buttons }: SwitcherProps) => (
  <div className="absolute bottom-0 left-0 h-64 w-full p-2">
    <div className={clsx('grid h-full auto-rows-fr grid-cols-2 gap-2')}>
      {buttons.map((btn, idx) => {
        if (!btn) {
          // eslint-disable-next-line react/no-array-index-key
          return <div key={`disabled-btn-${idx}`} />
        }
        const key = Array.isArray(btn) ? btn[0] : btn
        return <SwitchButton button={btn} key={key} />
      })}
    </div>
  </div>
)

type RemoteControlTileProps = {
  title: string
  buttons: Button[]
}

const RemoteControlTile = ({ title, buttons }: RemoteControlTileProps) => {
  const tileData: TileProps = {
    title,
    size: 'big',
    customBody: <Switcher buttons={buttons} />
  }
  return <Tile {...tileData} />
}

export default RemoteControlTile
