import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { useEffect, useState } from 'react'
import { useModalContext } from '../../../contexts/ModalContext'
import {
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalTitle
} from '../ModalElements'
import { useBackend } from '../../../contexts/BackendContext'
import Spinner from '../../basic/Spinner'

const TriggerNotificationBody = () => {
  const [list, setList] = useState<string[]>(null)
  const [selected, setSelected] = useState<string>(null)
  const modal = useModalContext()
  const backend = useBackend()

  useEffect(
    () =>
      backend?.subscribeToServiceData(data => {
        if (data?.notifications) {
          const ids = data.notifications.availableIds
          setList(ids)
          if (ids.length > 0) {
            setSelected(ids[0])
          }
        }
      }),
    [backend]
  )

  return (
    <ModalBody>
      <ModalTitle>Trigger notification with ID:</ModalTitle>
      <div>
        {list ? (
          <select
            className="mx-auto mb-6 block w-80 rounded p-3"
            value={selected}
            onChange={e => setSelected(e.target.value)}
          >
            {list.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        ) : (
          <Spinner />
        )}
      </div>
      <ModalFooter>
        <ModalButton
          name="Trigger"
          icon={<PlayArrowIcon />}
          isDanger
          onClick={() => {
            if (selected) {
              backend?.triggerNotification(selected)
              modal.closeModal()
            }
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

export default TriggerNotificationBody
