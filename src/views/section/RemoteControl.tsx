import { ReactNode, useState } from 'react'
import ChairOutlinedIcon from '@mui/icons-material/ChairOutlined'
import LightOutlinedIcon from '@mui/icons-material/LightOutlined'
import TvOutlinedIcon from '@mui/icons-material/TvOutlined'
import TableRestaurantOutlinedIcon from '@mui/icons-material/TableRestaurantOutlined'
import DoorSlidingOutlinedIcon from '@mui/icons-material/DoorSlidingOutlined'
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined'
import WbTwilightIcon from '@mui/icons-material/WbTwilight'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import BedtimeOutlinedIcon from '@mui/icons-material/BedtimeOutlined'
import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import RemoteCategorySwitcher, {
  RemoteCategory
} from '../../components/layout/RemoteCategorySwitcher'
import RemoteControlTile, {
  Button
} from '../../components/specialTiles/RemoteControlTile'
import AirConditionerTile from '../../components/specialTiles/AirConditionerTile'
import PhilipsTvRemoteTile from '../../components/specialTiles/irRemote/PhilipsTvRemoteTile'
import JblSoundbarRemoteTile from '../../components/specialTiles/irRemote/JblSoundbarRemoteTile'
import HtpcRemoteTile from '../../components/specialTiles/irRemote/HtpcRemoteTile'
import SwitchGroupTile from '../../components/entityTiles/switch/SwitchGroupTile'
import { SupportedActions } from '../../hooks/useRemoteControl'
import { useLayoutContext } from '../../contexts/OutletContext'

export const REMOTE_CATEGORY_STORAGE_KEY = 'remoteControlCategory'

const aqaraOppleActions: SupportedActions = {
  double: true,
  triple: true,
  hold: true
}

const tuyaActions: SupportedActions = {
  double: true,
  triple: false,
  hold: true
}

const turnOffButton: Button = {
  icon: <PowerSettingsNewOutlinedIcon />,
  label: 'Turn off',
  iconOnly: true
}

type RemoteCategoryContent = RemoteCategory & {
  tiles: ReactNode
}

const categories: RemoteCategoryContent[] = [
  {
    id: 'lights',
    label: 'Lights',
    tiles: (
      <RemoteControlTile
        title="Living room"
        entityId="sensor.livingroomremote_action"
        supportedActions={aqaraOppleActions}
        buttons={[
          { icon: <ChairOutlinedIcon />, label: 'Back section' },
          { icon: <LightOutlinedIcon />, label: 'Full main light' },
          { icon: <TvOutlinedIcon />, label: 'TV light' },
          { icon: <TableRestaurantOutlinedIcon />, label: 'Table light' },
          { icon: <DoorSlidingOutlinedIcon />, label: 'Cabinet light' },
          turnOffButton
        ]}
      />
    )
  },
  {
    id: 'ac',
    label: 'AC',
    tiles: (
      <>
        <AirConditionerTile
          title="Gree air conditioner"
          entityId="climate.airconditioner"
        />
        <SwitchGroupTile
          title="Air conditioner options"
          switches={[
            { title: 'X-Fan', entityId: 'switch.airconditioner_xfan' },
            {
              title: 'Panel light',
              entityId: 'switch.airconditioner_panel_light'
            },
            {
              title: 'Health mode',
              entityId: 'switch.airconditioner_health_mode'
            }
          ]}
        />
      </>
    )
  },
  {
    id: 'remotes',
    label: 'Remotes',
    tiles: (
      <>
        <PhilipsTvRemoteTile title="Philips TV" />
        <HtpcRemoteTile title="VHS HTPC" />
        <JblSoundbarRemoteTile title="JBL Soundbar" />
      </>
    )
  },
  {
    id: 'other',
    label: 'Other',
    tiles: (
      <>
        <RemoteControlTile
          title="Daniel's bed remote"
          entityId="sensor.danielbedremote_action"
          supportedActions={tuyaActions}
          buttons={[
            {
              icon: <MenuBookOutlinedIcon />,
              label: 'Reading mode',
              sub: '2×: Minimal mode'
            },
            {
              icon: <WbSunnyOutlinedIcon />,
              label: 'Daily mode',
              sub: '2×: Max light'
            },
            {
              ...turnOffButton,
              label: '2×: All rooms',
              sub: 'Hold: Turn off all',
              iconOnly: false
            },
            {
              icon: <WbTwilightIcon />,
              label: 'Shelves: 40%',
              sub: '2×: 70% · Hold: Off'
            }
          ]}
        />
        <RemoteControlTile
          title="Kitchen"
          entityId="sensor.kitchenremote_action"
          supportedActions={aqaraOppleActions}
          buttons={[
            { icon: <ArrowBackOutlinedIcon />, label: 'Right side' },
            { icon: <ArrowForwardOutlinedIcon />, label: 'Left side' },
            turnOffButton,
            {
              icon: <BedtimeOutlinedIcon />,
              label: 'Light sensor',
              sub: 'Hold: Auto on/off'
            }
          ]}
        />
      </>
    )
  }
]

const readStoredCategory = () => {
  try {
    const stored = window.localStorage.getItem(REMOTE_CATEGORY_STORAGE_KEY)
    return categories.some(({ id }) => id === stored)
      ? (stored as string)
      : categories[0].id
  } catch {
    return categories[0].id
  }
}

const RemoteControl = () => {
  const layout = useLayoutContext()
  const [selectedId, setSelectedId] = useState(readStoredCategory)

  const onSelect = (id: string) => {
    setSelectedId(id)
    try {
      window.localStorage.setItem(REMOTE_CATEGORY_STORAGE_KEY, id)
    } catch {
      // The selection still works for this visit without storage access.
    }
  }

  if (layout?.isMobile) {
    const selected =
      categories.find(({ id }) => id === selectedId) ?? categories[0]
    return (
      <>
        <TileSection>
          <TileGroup key={selected.id}>{selected.tiles}</TileGroup>
        </TileSection>
        <RemoteCategorySwitcher
          categories={categories}
          selectedId={selected.id}
          onSelect={onSelect}
        />
      </>
    )
  }

  return (
    <TileSection>
      {categories.map(({ id, label, tiles }) => (
        <TileGroup key={id} name={label}>
          {tiles}
        </TileGroup>
      ))}
    </TileSection>
  )
}

export default RemoteControl
