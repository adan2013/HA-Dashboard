import { useModalContext } from '../ModalContext'
import {
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalTitle
} from '../ModalElements'
import { HistoryChartModalParams } from '../utils'
import { useHomeAssistantEntity } from '../../../api/hooks'

const HistoryChartBody = () => {
  const modal = useModalContext()
  const params = modal.state.params as HistoryChartModalParams
  const { entityState, isUnavailable } = useHomeAssistantEntity(
    params.entityName
  )
  return (
    <ModalBody>
      <ModalTitle>{params.title}</ModalTitle>
      <div className="text-center">CHART</div>
      <ModalFooter>
        <ModalButton
          name="Zoom out"
          onClick={() => {
            console.log('zoom out') // TODO console log
          }}
        />
        <ModalButton
          name="Zoom in"
          onClick={() => {
            console.log('zoom in') // TODO console log
          }}
        />
        <ModalButton
          name="Refresh"
          onClick={() => {
            console.log('refresh') // TODO console log
          }}
        />
        <ModalButton name="Close" onClick={() => modal.closeModal()} />
      </ModalFooter>
    </ModalBody>
  )
}

export default HistoryChartBody
