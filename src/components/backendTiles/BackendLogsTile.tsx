import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined'
import { useModalContext } from '../../contexts/ModalContext'
import Tile from '../basic/Tile'

const BackendLogsTile = () => {
  const modal = useModalContext()

  return (
    <Tile
      title="Backend logs"
      icon={<TerminalOutlinedIcon />}
      onClick={() => modal.openModal('backendLogs')}
    />
  )
}

export default BackendLogsTile
