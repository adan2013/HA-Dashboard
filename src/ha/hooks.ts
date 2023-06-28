import { useEffect, useState } from 'react'
import { ConnectionStatus, EntityState } from './utils'
import { useHomeAssistant } from '../contexts/HomeAssistantContext'

const NOTIFICATION_ENTITY_ID = 'textfield.notification'

export const useHomeAssistantStatus = (): ConnectionStatus => {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected')
  const ha = useHomeAssistant()

  useEffect(
    () => ha.subscribeToStatus((_, newStatus) => setStatus(newStatus)),
    [ha]
  )

  return status
}

export const useHomeAssistantEntity = (id: string): EntityState => {
  const [state, setState] = useState<EntityState>(null)
  const ha = useHomeAssistant()

  useEffect(() => ha.subscribeToEntity(id, setState), [id, ha])

  return state
}

// TODO use custom type with formatted data and notification count
export const useHomeAssistantNotifications = (): EntityState =>
  useHomeAssistantEntity(NOTIFICATION_ENTITY_ID)
