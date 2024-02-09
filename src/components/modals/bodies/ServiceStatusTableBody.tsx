import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { useEffect, useState } from 'react'
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import clsx from 'clsx'
import { useModalContext } from '../../../contexts/ModalContext'
import { ModalBody, ModalButton, ModalFooter } from '../ModalElements'
import {
  ServiceManagerStatus,
  ServiceStatus,
  Status,
  StatusColor
} from '../../../api/backend/backendTypes'
import { useBackend } from '../../../contexts/BackendContext'
import Spinner from '../../basic/Spinner'

const getStatusColor = (statusType: StatusColor): string => {
  switch (statusType) {
    case 'green':
      return 'bg-green-500'
    case 'yellow':
      return 'bg-yellow-500'
    case 'red':
      return 'bg-red-500'
    case 'blue':
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
}

const ServiceStatusTableBody = () => {
  const [state, setState] = useState<ServiceManagerStatus>(null)
  const modal = useModalContext()
  const backend = useBackend()

  useEffect(() => {
    const unsubscribe = backend?.subscribeToStatusData(setState)
    if (!state) {
      backend?.requestServiceStatus()
    }
    return unsubscribe
  }, [backend, state])

  const getServiceRow = (serviceName: string, service: ServiceStatus) => (
    <tr key={serviceName} className="hover:bg-gray-700">
      <td className="p-2 text-center hover:cursor-pointer">
        {service.status.enabled ? (
          <div onClick={() => backend?.switchService(serviceName, false)}>
            <PowerSettingsNewIcon className="!text-3xl text-green-500" />
          </div>
        ) : (
          <div onClick={() => backend?.switchService(serviceName, true)}>
            <PowerSettingsNewIcon className="!text-3xl text-red-500" />
          </div>
        )}
      </td>
      <td className="p-2 text-left">{serviceName}</td>
      <td className="min-w-[300px] p-2 text-left text-sm">
        <div
          className={clsx(
            'mr-2 inline-block h-3 w-3 rounded-full',
            getStatusColor(service.status.color)
          )}
        />
        {service.status.message}
      </td>
    </tr>
  )

  const getHelperRow = (helperName: string, status: Status) => (
    <tr key={helperName} className="hover:bg-gray-700">
      <td />
      <td className="p-2 pl-4 text-left">{`→ ${helperName}`}</td>
      <td className="p-2 text-left text-sm">
        <div
          className={clsx(
            'mr-2 inline-block h-3 w-3 rounded-full',
            getStatusColor(status.color)
          )}
        />
        {status.message}
      </td>
    </tr>
  )

  return (
    <ModalBody>
      {state ? (
        <>
          <div className="mt-3 px-2 text-center">
            Current time: {state.currentTime}
            <br />
            Started at: {state.startTime} ({state.daysRunning} days)
            <br />
            Entities count: {state.syncedEntitiesCount}
          </div>
          <div className="mx-4 text-center">
            <div className="my-4 h-[450px] max-h-[calc(100vh-250px)] overflow-scroll">
              <table className="w-full">
                <thead className="border-b-[1px] border-white">
                  <tr>
                    <th className="p-2" />
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(state.services).map(serviceName => {
                    const service = state.services[serviceName]
                    return (
                      <>
                        {getServiceRow(serviceName, service)}
                        {Object.keys(service.helpers).map(helperName => {
                          const helperStatus = service.helpers[helperName]
                          return getHelperRow(helperName, helperStatus)
                        })}
                      </>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <Spinner />
      )}
      <ModalFooter>
        <ModalButton
          name="Refresh"
          icon={<CachedOutlinedIcon />}
          onClick={() => backend?.requestServiceStatus()}
        />
        <ModalButton
          name="Close"
          icon={<CloseOutlinedIcon />}
          onClick={() => modal.closeModal()}
        />
      </ModalFooter>
    </ModalBody>
  )
}

export default ServiceStatusTableBody
