import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import RemoteControlTile from '../../components/specialTiles/RemoteControlTile'

const RemoteControl = () => (
  <TileSection>
    <TileGroup name="">
      <RemoteControlTile
        title="Living room"
        rcName="livingRoom"
        buttons={[
          ['Back ambient', 'Min / Normal'],
          ['Full ambient', 'Normal / Max'],
          'TV light',
          ['Table light', 'Normal / Max'],
          undefined,
          'Turn off'
        ]}
      />
      <RemoteControlTile
        title="Kitchen"
        rcName="kitchen"
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
