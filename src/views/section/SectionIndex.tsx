import { useParams } from 'react-router-dom'
import Lights from './Lights'

const SectionIndex = () => {
  const { sectionId } = useParams()

  switch (sectionId) {
    case 'lights':
      return <Lights />
    default:
      return <>SECTION: {sectionId}</>
  }
}

export default SectionIndex
