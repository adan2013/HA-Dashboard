import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import PlaceholderTile from '../../PlaceholderTile'

const Automations = () => (
  <TileSection>
    <TileGroup name="Kitchen">
      <PlaceholderTile title="Water filter" size="horizontal" />
      <PlaceholderTile title="Water membrane filter" size="horizontal" />
      <PlaceholderTile title="Motion sensor" size="standard" />
      <PlaceholderTile title="Light sensor" size="standard" />
    </TileGroup>
    <TileGroup name="Bathroom">
      <PlaceholderTile
        title="Washing machine power consumption"
        size="horizontal"
      />
      <PlaceholderTile title="Washing machine plug" size="standard" />
      <PlaceholderTile title="Washing machine status" size="standard" />
    </TileGroup>
    <TileGroup name="Daniel">
      <PlaceholderTile title="Sunrise" size="horizontal" />
      <PlaceholderTile title="Auto blind" size="standard" />
      <PlaceholderTile title="PC plug" size="standard" />
    </TileGroup>
  </TileSection>
)

export default Automations
