import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined'
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined'
import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import RemoteControlTile from '../../components/specialTiles/RemoteControlTile'
import AirConditionerTile from '../../components/specialTiles/AirConditionerTile'
import SwitchTile, {
  SwitchTileProps
} from '../../components/entityTiles/switch/SwitchTile'
import { SupportedActions } from '../../hooks/useRemoteControl'

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

const RemoteControl = () => (
  <TileSection>
    <TileGroup name="">
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
      <RemoteControlTile
        title="Daniel's bed remote"
        entityId="sensor.danielbedremote_action"
        supportedActions={tuyaActions}
        buttons={[
          ['Reading mode', 'Minimal mode'],
          ['Ambient mode', 'Max light'],
          'Turn off'
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
    </TileGroup>
  </TileSection>
)

export default RemoteControl
