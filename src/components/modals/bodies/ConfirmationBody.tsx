import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import { useModalContext } from '../ModalContext'
import {
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalTitle
} from '../ModalElements'
import { ConfirmationModalParams } from '../utils'

const ConfirmationBody = () => {
  const modal = useModalContext()
  const params = modal.state.params as ConfirmationModalParams
  return (
    <ModalBody>
      <ModalTitle>Confirm the operation</ModalTitle>
      <div className="text-center">
        {params.message || 'Are you sure you want to continue?'}
      </div>
      <ModalFooter>
        <ModalButton
          name="Confirm"
          icon={<CheckOutlinedIcon />}
          isDanger={params.isDanger}
          onClick={() => {
            params.onConfirm()
            modal.closeModal()
          }}
        />
        <ModalButton
          name="Cancel"
          icon={<CloseOutlinedIcon />}
          onClick={() => modal.closeModal()}
        />
      </ModalFooter>
    </ModalBody>
  )
}

export default ConfirmationBody
