import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'
import { useEffect, useState } from 'react'
import { useBackend } from '../contexts/BackendContext'
import { NotificationsServiceData } from '../api/backend/notificationTypes'

const Notifications = () => {
  const [state, setState] = useState<NotificationsServiceData>(null)
  const backend = useBackend()

  useEffect(
    () =>
      backend?.subscribeToServiceData(data => {
        if (data?.notifications) {
          setState(data.notifications)
        }
      }),
    [backend]
  )

  if (!state || state.active.length === 0) {
    return (
      <div className="text-md mt-20 text-center font-extrabold text-gray-500">
        <div className="mb-2">
          <CheckBoxOutlinedIcon className="!text-8xl" />
        </div>
        NO ACTIVE NOTIFICATIONS
      </div>
    )
  }

  return (
    <div className="text-md m-5">{JSON.stringify(state.active, null, 2)}</div>
  )
}

export default Notifications
