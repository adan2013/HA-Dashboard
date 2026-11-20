import { ReactNode, useState } from 'react'
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined'
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined'
import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import RemoteCategorySwitcher, {
  RemoteCategory
} from '../../components/layout/RemoteCategorySwitcher'
import RemoteControlTile from '../../components/specialTiles/RemoteControlTile'
import AirConditionerTile from '../../components/specialTiles/AirConditionerTile'
import PhilipsTvRemoteTile from '../../components/specialTiles/irRemote/PhilipsTvRemoteTile'
import JblSoundbarRemoteTile from '../../components/specialTiles/irRemote/JblSoundbarRemoteTile'
import HtpcRemoteTile from '../../components/specialTiles/irRemote/HtpcRemoteTile'
import SwitchTile, {
  SwitchTileProps
} from '../../components/entityTiles/switch/SwitchTile'
import { SupportedActions } from '../../hooks/useRemoteControl'
import { useLayoutContext } from '../../contexts/OutletContext'

export const REMOTE_CATEGORY_STORAGE_KEY = 'remoteControlCategory'

const acSwitchIcons: Partial<SwitchTileProps> = {
  onIcon: <ToggleOnOutlinedIcon />,
  offIcon: <ToggleOffOutlinedIcon />
}

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
          'Back section',
          'Full main light',
          'TV light',
          'Table light',
          'Cabinet light',
          'Turn off'
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
        <SwitchTile
          title="X-Fan"
          entityId="switch.airconditioner_xfan"
          {...acSwitchIcons}
        />
        <SwitchTile
          title="Panel light"
          entityId="switch.airconditioner_panel_light"
          {...acSwitchIcons}
        />
        <SwitchTile
          title="Health mode"
          entityId="switch.airconditioner_health_mode"
          {...acSwitchIcons}
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
            ['Reading mode', 'Minimal mode'],
            ['Ambient mode', 'Max light'],
            'Turn off',
            ['Double: All rooms', '(HOLD) Turn off all']
          ]}
        />
        <RemoteControlTile
          title="Kitchen"
          entityId="sensor.kitchenremote_action"
          supportedActions={aqaraOppleActions}
          buttons={[
            'Right side',
            'Left side',
            'Turn off',
            ['Light sensor', 'on/off auto (hold)']
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
