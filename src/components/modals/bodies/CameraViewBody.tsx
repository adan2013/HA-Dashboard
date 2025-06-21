import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { useModalContext } from '../../../contexts/ModalContext'
import { ModalBody, ModalButton, ModalFooter } from '../ModalElements'
import { CameraViewModalParams } from '../../../contexts/modalUtils'
import { useHomeAssistantEntity } from '../../../api/hooks'

const parseDate = (date: string) => {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return null
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
}

const CameraViewBody = () => {
  const modal = useModalContext()
  const params = modal.state.params as CameraViewModalParams
  const { isUnavailable, entityState } = useHomeAssistantEntity(params.entityId)

  return (
    <ModalBody>
      <div className="mx-4 h-[550px] max-h-[calc(100vh-170px)] overflow-y-auto text-center">
        {isUnavailable ? (
          <div className="mx-auto mt-8">Camera is unavailable</div>
        ) : (
          <>
            <div className="p-3">{parseDate(entityState?.state)}</div>
            <img
              src={`${params.imageHost}${entityState.attributes.entity_picture}`}
              alt="Camera view"
              data-testid="camera-view"
              className="mx-auto"
            />
          </>
        )}
      </div>
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

export default CameraViewBody
