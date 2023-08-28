import CheckIcon from '@mui/icons-material/Check'
import clsx from 'clsx'
import TileSection from '../components/layout/TileSection'
import TileGroup from '../components/layout/TileGroup'
import { themes } from '../themes'
import Tile from '../components/Tile'
import { useGlobalContext } from '../contexts/GlobalContext'
import { Background, backgrounds } from '../backgrounds'
import { getPackageVersion } from '../api/utils'

const getSubtitle = (bg: Background) => {
  switch (bg.type) {
    case 'color':
      return 'Solid color'
    case 'gradient':
      return 'Gradient'
    case 'image':
      return bg.attribution
    default:
      return undefined
  }
}

const BackgroundPreview = ({ bg }: { bg: Background }) => (
  <div
    className={clsx(
      'absolute bottom-3 left-3 aspect-video w-28 rounded',
      bg.type === 'color' && bg.value,
      bg.type === 'gradient' && bg.value,
      bg.type === 'image' && `bg-cover`
    )}
    style={
      bg.type === 'image'
        ? { backgroundImage: `url('/backgrounds/${bg.value}')` }
        : {}
    }
  />
)

const Customization = () => {
  const context = useGlobalContext()

  const changeSettings = (settings: Partial<typeof context.settings>) => {
    context.updateSettings(settings)
  }

  return (
    <TileSection waitForHomeAssistantSync={false}>
      <TileGroup name="Theme">
        {themes.map(({ id, name, primary, text }) => (
          <Tile
            key={id}
            title={name}
            textColor={text}
            tileColor={primary}
            icon={context.settings.theme === id ? <CheckIcon /> : undefined}
            onClick={() => changeSettings({ theme: id })}
          />
        ))}
      </TileGroup>
      <TileGroup name="Background">
        {backgrounds.map(bg => (
          <Tile
            key={bg.id}
            title={bg.name}
            subtitle={getSubtitle(bg)}
            icon={
              context.settings.background === bg.id ? <CheckIcon /> : undefined
            }
            onClick={() => changeSettings({ background: bg.id })}
            size="horizontal"
            customBody={<BackgroundPreview bg={bg} />}
          />
        ))}
      </TileGroup>
      <TileGroup name="Sound">
        <Tile
          title="Sounds on"
          icon={context.settings.sound ? <CheckIcon /> : undefined}
          onClick={() => changeSettings({ sound: true })}
        />
        <Tile
          title="Sounds off"
          icon={context.settings.sound ? undefined : <CheckIcon />}
          onClick={() => changeSettings({ sound: false })}
        />
      </TileGroup>
      <TileGroup name="Dev">
        <Tile
          title="Version"
          customBody={
            <div className="absolute bottom-1 right-2 text-4xl">
              {getPackageVersion()}
            </div>
          }
        />
        <Tile
          title="Fully Kiosk API"
          value={Object.hasOwn(window, 'fully') ? 'Yes' : 'No'}
        />
      </TileGroup>
    </TileSection>
  )
}

export default Customization
