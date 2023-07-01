import { useGlobalContext } from '../../contexts/GlobalContext'

const NotificationDot = () => {
  const context = useGlobalContext()

  if (context?.notifications.length > 0) {
    return (
      <div className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-600" />
    )
  }
  return null
}

export default NotificationDot
