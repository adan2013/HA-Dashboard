import NotificationAddIcon from '@mui/icons-material/NotificationAdd'
import Tile from '../basic/Tile'
import { useModalContext } from '../../contexts/ModalContext'

const TriggerNotificationTile = () => {
  const modal = useModalContext()

  return (
    <Tile
      title="Trigger notification"
      icon={<NotificationAddIcon />}
      onClick={() => modal.openModal('triggerNotification')}
    />
  )
}

export default TriggerNotificationTile
