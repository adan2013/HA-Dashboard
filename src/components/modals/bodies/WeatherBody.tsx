import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { useModalContext } from '../../../contexts/ModalContext'
import { ModalBody, ModalButton, ModalFooter } from '../ModalElements'
import { WeatherModalParams } from '../../../contexts/modalUtils'
import { ResponsiveWidgetElement } from '../../weather/full/RainRadarTile'

const WeatherBody = () => {
  const modal = useModalContext()
  const params = modal.state.params as WeatherModalParams

  const renderContent = () => {
    switch (params.content) {
      case 'rain':
        return <ResponsiveWidgetElement />
      default:
        return null
    }
  }

  return (
    <ModalBody>
      <div className="h-[calc(100vh-170px)] p-2">{renderContent()}</div>
      <ModalFooter>
        <ModalButton
          name="Close"
          icon={<CloseOutlinedIcon />}
          onClick={() => modal.closeModal()}
        />
      </ModalFooter>
    </ModalBody>
  )
}

export default WeatherBody
