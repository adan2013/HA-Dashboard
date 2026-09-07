import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import clsx from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BackendLogEntry, BackendLogLevel } from '../../../api/utils'
import { useBackend } from '../../../contexts/BackendContext'
import { useModalContext } from '../../../contexts/ModalContext'
import Spinner from '../../basic/Spinner'
import {
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalTitle
} from '../ModalElements'

const levelColor = (level: BackendLogLevel) =>
  clsx({
    'text-blue-300': level === 'info',
    'text-yellow-300': level === 'warn',
    'text-red-400': level === 'error',
    'font-bold text-red-500': level === 'fatal'
  })

const formatDetails = (details: unknown) =>
  typeof details === 'string' ? details : JSON.stringify(details, null, 2)

const BackendLogsBody = () => {
  const backend = useBackend()
  const modal = useModalContext()
  const scrollContainer = useRef<HTMLDivElement>(null)
  const [entries, setEntries] = useState<BackendLogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadLogs = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      setEntries(await backend.getBackendLogs())
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to load backend logs'
      )
    } finally {
      setIsLoading(false)
    }
  }, [backend])

  useEffect(() => {
    loadLogs()
  }, [loadLogs])

  useEffect(() => {
    if (!isLoading && scrollContainer.current) {
      scrollContainer.current.scrollTop = scrollContainer.current.scrollHeight
    }
  }, [entries, isLoading])

  return (
    <ModalBody>
      <ModalTitle>Backend logs</ModalTitle>
      {error && (
        <div role="alert" className="mx-4 mb-3 rounded bg-red-900 p-3">
          {error}
        </div>
      )}
      {isLoading && entries.length === 0 ? (
        <Spinner />
      ) : (
        <div
          ref={scrollContainer}
          data-testid="backend-logs-container"
          className="mx-4 h-[500px] max-h-[calc(100vh-250px)] overflow-auto rounded bg-gray-950 p-3 font-mono text-sm"
        >
          {entries.length === 0 ? (
            <div className="text-center text-gray-400">No logs available</div>
          ) : (
            entries.map(entry => (
              <article
                key={`${entry.time}-${entry.level}-${entry.scope}-${entry.message}`}
                className="border-b border-gray-700 py-2 last:border-0"
              >
                <div className="break-words">
                  <time className="text-gray-400">
                    {new Date(entry.time).toLocaleString()}
                  </time>{' '}
                  <span className={levelColor(entry.level)}>
                    {entry.level.toUpperCase()}
                  </span>{' '}
                  <span className="text-purple-300">[{entry.scope}]</span>{' '}
                  <span>{entry.message}</span>
                  {entry.truncated && (
                    <span className="ml-2 text-yellow-300">[truncated]</span>
                  )}
                </div>
                {entry.details !== undefined && (
                  <details className="mt-1 text-gray-300">
                    <summary className="cursor-pointer select-none">
                      Details
                    </summary>
                    <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-words pl-4">
                      {formatDetails(entry.details)}
                    </pre>
                  </details>
                )}
              </article>
            ))
          )}
        </div>
      )}
      <ModalFooter>
        <ModalButton
          name="Refresh"
          icon={<CachedOutlinedIcon />}
          onClick={loadLogs}
          isDisabled={isLoading}
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

export default BackendLogsBody
