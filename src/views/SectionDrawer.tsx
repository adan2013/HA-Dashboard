import { useParams } from 'react-router-dom'
import TileGroups from '../components/TileGroups'
import lightsConfig from '../configs/lights.config'

const SectionDrawer = () => {
  const { sectionId } = useParams()

  switch (sectionId) {
    case 'lights':
      return <TileGroups config={lightsConfig} />
    default:
      return <>SECTION: {sectionId}</>
  }
}

export default SectionDrawer
