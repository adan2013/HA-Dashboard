import { useParams } from 'react-router-dom'
import Lights from './Lights'
import Temperatures from './Temperatures'
import Automations from './Automations'
import Messages from './Messages'
import System from './System'
import RemoteControl from './RemoteControl'

const SectionIndex = () => {
  const { sectionId } = useParams()

  switch (sectionId) {
    case 'lights':
      return <Lights />
    case 'temperatures':
      return <Temperatures />
    case 'automations':
      return <Automations />
    case 'messages':
      return <Messages />
    case 'system':
      return <System />
    case 'remote-control':
      return <RemoteControl />
    default:
      return <>SECTION: {sectionId}</>
  }
}

export default SectionIndex
