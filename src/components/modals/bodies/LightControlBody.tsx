import { useModalContext } from '../ModalContext'
import {
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalTitle
} from '../ModalElements'
import { LightControlModalParams } from '../utils'
import { useHomeAssistantEntity } from '../../../api/hooks'
import { useHomeAssistant } from '../../../contexts/HomeAssistantContext'

const LightControlBody = () => {
  const modal = useModalContext()
  const ha = useHomeAssistant()
  const params = modal.state.params as LightControlModalParams
  const { entityState, isUnavailable } = useHomeAssistantEntity(
    params.entityName
  )
  const isTurnedOn = entityState?.state === 'on'

  const toggleLight = () => {
    if (isUnavailable) return
    const action = isTurnedOn ? 'turn_off' : 'turn_on'
    ha.callService(entityState.id, 'light', action)
  }

  return (
    <ModalBody>
      <ModalTitle>{params.title}</ModalTitle>
      <div className="text-center">control bars</div>
      <ModalFooter>
        <ModalButton
          name={isTurnedOn ? 'Turn off' : 'Turn on'}
          onClick={toggleLight}
        />
        <ModalButton name="Close" onClick={() => modal.closeModal()} />
      </ModalFooter>
    </ModalBody>
  )
}

export default LightControlBody
