import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useModalContext } from '../../contexts/ModalContext'
import Tile from '../basic/Tile'

const ServiceStatusTile = () => {
  const modal = useModalContext()

  return (
    <Tile
      title="Backend service status"
      icon={<InfoOutlinedIcon />}
      onClick={() => modal.openModal('serviceStatus')}
    />
  )
}

export default ServiceStatusTile
