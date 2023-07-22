import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import PlaceholderTile from '../../PlaceholderTile'

const RemoteControl = () => (
  <TileSection>
    <TileGroup name="Living room">
      <PlaceholderTile title="Living room remote" size="big" />
    </TileGroup>
    <TileGroup name="Kitchen">
      <PlaceholderTile title="Kitchen room remote" size="big" />
    </TileGroup>
    <TileGroup name="Daniel">
      <PlaceholderTile title="Daniel remote" size="big" />
    </TileGroup>
  </TileSection>
)

export default RemoteControl
