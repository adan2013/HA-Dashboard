import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import RemoteControlTile from '../../components/specialTiles/RemoteControlTile'
import AirConditionerTile from '../../components/specialTiles/AirConditionerTile'

const RemoteControl = () => (
  <TileSection>
    <TileGroup name="">
      <RemoteControlTile
        title="Living room"
        entityId="sensor.livingroomremote_action"
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
      <RemoteControlTile
        title="Kitchen"
        entityId="sensor.kitchenremote_action"
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
