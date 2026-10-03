import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { useHomeAssistantEntity } from '../../../api/hooks'
import { useBackend } from '../../../contexts/BackendContext'
import { useModalContext } from '../../../contexts/ModalContext'
import { RadiatorControlModalParams } from '../../../contexts/modalUtils'
import {
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalTitle
} from '../ModalElements'
import {
  formatRadiatorMode,
  formatTemperature,
  getModeService,
  getTemperatureRange,
  getTemperatureStep,
  RadiatorMode,
  readRadiatorAction,
  readRadiatorMode,
  readTemperature,
  temperaturePercentage
} from '../../entityTiles/climate/radiatorUtils'

const DEBOUNCE_MS = 700

const RadiatorControlBody = () => {
  const modal = useModalContext()
  const params = modal.state.params as RadiatorControlModalParams
  const backend = useBackend()
  const climate = useHomeAssistantEntity(params.entityId)
  const battery = useHomeAssistantEntity(params.batteryEntityId)
  const remoteTarget = readTemperature(
    climate.entityState?.attributes?.temperature
  )
  const [target, setTarget] = useState<number | null>(remoteTarget)
  const pendingTarget = useRef<number | null>(null)
  const debounceTimer = useRef<number | null>(null)
  const serviceRef = useRef({ backend, entityId: params.entityId })
  serviceRef.current = { backend, entityId: params.entityId }
  const { min, max } = getTemperatureRange(climate.entityState)
  const step = getTemperatureStep(climate.entityState)
  const current = climate.isUnavailable
    ? null
    : readTemperature(climate.entityState?.attributes?.current_temperature)
  const batteryLevel = battery.isUnavailable
    ? readTemperature(
        climate.entityState?.attributes?.battery_level ??
          climate.entityState?.attributes?.battery
      )
    : readTemperature(battery.entityState?.state)
  const mode = readRadiatorMode(climate.entityState)
  const heating = readRadiatorAction(climate.entityState) === 'Heating'

  const sendPendingTarget = () => {
    if (debounceTimer.current !== null) {
      window.clearTimeout(debounceTimer.current)
      debounceTimer.current = null
    }
    if (pendingTarget.current === null) return
    const temperature = pendingTarget.current
    pendingTarget.current = null
    backend.callService(params.entityId, 'climate', 'set_temperature', {
      temperature
    })
  }

  useEffect(() => {
    if (pendingTarget.current === null) setTarget(remoteTarget)
  }, [remoteTarget])

  useEffect(
    () => () => {
      if (debounceTimer.current !== null)
        window.clearTimeout(debounceTimer.current)
      if (pendingTarget.current !== null) {
        serviceRef.current.backend.callService(
          serviceRef.current.entityId,
          'climate',
          'set_temperature',
          {
            temperature: pendingTarget.current
          }
        )
        pendingTarget.current = null
      }
    },
    []
  )

  const changeTarget = (direction: -1 | 1) => {
    if (climate.isUnavailable || target === null) return
    const next = Number(
      Math.min(max, Math.max(min, target + direction * step)).toFixed(2)
    )
    if (next === target) return
    setTarget(next)
    pendingTarget.current = next
    if (debounceTimer.current !== null)
      window.clearTimeout(debounceTimer.current)
    debounceTimer.current = window.setTimeout(sendPendingTarget, DEBOUNCE_MS)
  }

  const changeMode = (nextMode: RadiatorMode) => {
    if (climate.isUnavailable || nextMode === mode) return
    sendPendingTarget()
    const { service, data } = getModeService(climate.entityState, nextMode)
    backend.callService(params.entityId, 'climate', service, data)
  }

  const close = () => {
    sendPendingTarget()
    modal.closeModal()
  }

  return (
    <ModalBody>
      <ModalTitle>{params.title}</ModalTitle>
      <div className="mx-auto flex max-w-md flex-col gap-6 px-5 pb-6">
        <div>
          <div
            className="relative h-8 overflow-hidden rounded-lg bg-gray-950"
            role="progressbar"
            aria-label="Internal temperature"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={current ?? undefined}
            data-testid="radiator-temperature-progress"
          >
            <div
              className={clsx(
                'h-full',
                heating ? 'bg-orange-500' : 'bg-blue-500'
              )}
              style={{ width: `${temperaturePercentage(current, min, max)}%` }}
              data-testid="radiator-temperature-fill"
            />
            {target !== null && (
              <div
                className="absolute top-0 h-full w-1 -translate-x-1/2 bg-white shadow-[0_0_5px_1px_rgba(0,0,0,0.8)]"
                style={{ left: `${temperaturePercentage(target, min, max)}%` }}
                data-testid="radiator-target-marker"
              />
            )}
          </div>
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 sm:gap-8">
          <button
            type="button"
            aria-label="Decrease target temperature"
            className="press-feedback flex h-20 items-center justify-center rounded-lg border-2 border-gray-500 text-4xl hover:border-white hover:bg-gray-700 disabled:opacity-40"
            onClick={() => changeTarget(-1)}
            disabled={climate.isUnavailable || target === null || target <= min}
          >
            <RemoveIcon fontSize="large" />
          </button>
          <div className="min-w-[5rem] text-center text-2xl" aria-live="polite">
            {formatTemperature(target)}
          </div>
          <button
            type="button"
            aria-label="Increase target temperature"
            className="press-feedback flex h-20 items-center justify-center rounded-lg border-2 border-gray-500 text-4xl hover:border-white hover:bg-gray-700 disabled:opacity-40"
            onClick={() => changeTarget(1)}
            disabled={climate.isUnavailable || target === null || target >= max}
          >
            <AddIcon fontSize="large" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['off', 'manual', 'auto'] as RadiatorMode[]).map(option => (
            <button
              key={option}
              type="button"
              className={clsx(
                'press-feedback min-h-12 rounded-lg border-2 px-4 py-2 text-base transition-colors hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
                mode === option
                  ? 'border-white bg-white text-gray-900'
                  : 'border-gray-500 bg-gray-800 text-white'
              )}
              aria-pressed={mode === option}
              disabled={climate.isUnavailable}
              onClick={() => changeMode(option)}
            >
              {formatRadiatorMode(option)}
            </button>
          ))}
        </div>
        <div className="flex justify-between border-t border-gray-600 pt-4 text-sm text-gray-300">
          <span>Internal {formatTemperature(current)}</span>
          <span>
            Battery{' '}
            {batteryLevel === null ? '--' : `${Math.round(batteryLevel)}%`}
          </span>
        </div>
      </div>
      <ModalFooter>
        <ModalButton
          name="Close"
          icon={<CloseOutlinedIcon />}
          onClick={close}
        />
      </ModalFooter>
    </ModalBody>
  )
}

export default RadiatorControlBody
