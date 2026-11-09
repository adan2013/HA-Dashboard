import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useBackend } from '../../../contexts/BackendContext'
import { useHomeAssistantEntity } from '../../../api/hooks'
import {
  useModalContext,
  useModalDismiss
} from '../../../contexts/ModalContext'
import { RadiatorControlModalParams } from '../../../contexts/modalUtils'
import {
  canMoveSchedulePoint,
  dayLabel,
  initialSchedule,
  newSchedulePoint,
  ScheduleDay,
  SchedulePoint,
  serializeSchedule
} from '../../../utils/radiatorSchedule'
import {
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalTitle
} from '../ModalElements'
import ScheduleChart from './radiatorSchedule/ScheduleChart'
import useWeeklySchedules from './radiatorSchedule/useWeeklySchedules'

const controlButtonClass =
  'press-feedback min-h-12 rounded-lg border-2 px-4 py-2 text-base transition-colors enabled:hover:border-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'
const buttonClass = clsx(
  controlButtonClass,
  'border-gray-500 bg-gray-800 text-white enabled:hover:bg-gray-700'
)
const arrowButtonClass = clsx(
  buttonClass,
  'flex h-14 min-w-[64px] items-center justify-center'
)

type StepControlProps = {
  label: string
  value: string
  increase: () => void
  decrease: () => void
  canIncrease: boolean
  canDecrease: boolean
}

const StepControl = ({
  label,
  value,
  increase,
  decrease,
  canIncrease,
  canDecrease
}: StepControlProps) => (
  <div className="flex flex-col items-stretch gap-2 rounded-lg bg-gray-900 p-3 text-center lg:grid lg:grid-cols-[1fr_auto] lg:items-center">
    <div className="text-sm text-gray-400 lg:col-start-1 lg:row-start-1 lg:text-left">
      {label}
    </div>
    <button
      type="button"
      className={clsx(arrowButtonClass, 'lg:col-start-2 lg:row-start-1')}
      aria-label={`Increase ${label.toLowerCase()}`}
      onClick={increase}
      disabled={!canIncrease}
    >
      <KeyboardArrowUpIcon className="!text-[28px]" />
    </button>
    <output
      aria-label={label}
      className="py-1 font-mono text-2xl font-semibold sm:text-3xl lg:col-start-1 lg:row-start-2 lg:text-left"
    >
      {value}
    </output>
    <button
      type="button"
      className={clsx(arrowButtonClass, 'lg:col-start-2 lg:row-start-2')}
      aria-label={`Decrease ${label.toLowerCase()}`}
      onClick={decrease}
      disabled={!canDecrease}
    >
      <KeyboardArrowDownIcon className="!text-[28px]" />
    </button>
  </div>
)

const RadiatorScheduleBody = () => {
  const modal = useModalContext()
  const params = modal.state.params as RadiatorControlModalParams
  const backend = useBackend()
  const climate = useHomeAssistantEntity(params.entityId)
  const schedules = useWeeklySchedules(params.scheduleEntityPrefix)
  const [editingDay, setEditingDay] = useState<ScheduleDay>()
  const [draft, setDraft] = useState<SchedulePoint[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [cloneDay, setCloneDay] = useState<ScheduleDay>()
  const [clonePoints, setClonePoints] = useState<SchedulePoint[]>([])
  const [targets, setTargets] = useState<ScheduleDay[]>([])
  const [copied, setCopied] = useState<ScheduleDay[]>([])
  const [pending, setPending] = useState(false)
  const busy = useRef(false)
  const [error, setError] = useState<string>()
  const [notice, setNotice] = useState<string>()
  const contentRef = useRef<HTMLDivElement>(null)
  const current = schedules.find(schedule => schedule.day === editingDay)
  const active = draft[activeIndex]
  const addition = newSchedulePoint(draft, activeIndex)

  useEffect(() => {
    // The button opening a nested view is unmounted. Keep keyboard focus in
    // react-modal so Escape continues to reach its dismissal handler.
    contentRef.current?.focus({ preventScroll: true })
    if (contentRef.current) contentRef.current.scrollTop = 0
  }, [editingDay, cloneDay])

  const backToWeek = () => {
    if (busy.current) return
    setEditingDay(undefined)
    setCloneDay(undefined)
    setError(undefined)
  }

  useModalDismiss(() => {
    if (busy.current) return
    if (editingDay || cloneDay) backToWeek()
    else modal.closeModal()
  })

  const editDay = (day: ScheduleDay) => {
    const schedule = schedules.find(entry => entry.day === day)
    if (schedule.error) return
    setDraft(initialSchedule(schedule.points))
    setActiveIndex(0)
    setEditingDay(day)
    setError(undefined)
    setNotice(undefined)
  }

  const startClone = (day: ScheduleDay) => {
    const schedule = schedules.find(entry => entry.day === day)
    if (schedule.error || !schedule.points.length) return
    setClonePoints(initialSchedule(schedule.points))
    setCloneDay(day)
    setTargets([])
    setCopied([])
    setError(undefined)
    setNotice(undefined)
  }

  const changeTime = (amount: number) => {
    const minutes = active.minutes + amount
    if (busy.current || !canMoveSchedulePoint(draft, activeIndex, minutes))
      return
    setDraft(
      draft.map((point, index) =>
        index === activeIndex ? { ...point, minutes } : point
      )
    )
  }

  const changeTemperature = (amount: number) => {
    const temperature = active.temperature + amount
    if (busy.current || temperature < 4 || temperature > 35) return
    setDraft(
      draft.map((point, index) =>
        index === activeIndex ? { ...point, temperature } : point
      )
    )
  }

  const saveDay = async () => {
    if (busy.current || current?.error) return
    busy.current = true
    setPending(true)
    setError(undefined)
    const value = serializeSchedule(draft)
    try {
      await backend.callService(current.entityId, 'text', 'set_value', {
        value
      })
      current.markSaved(value)
      setNotice(`${dayLabel(editingDay)} saved.`)
      setEditingDay(undefined)
    } catch {
      setError(
        'Could not save schedule. Your changes are still here. Try again.'
      )
    } finally {
      busy.current = false
      setPending(false)
    }
  }

  const copyDays = async () => {
    if (busy.current || !targets.length) return
    const destinations = schedules.filter(schedule =>
      targets.includes(schedule.day)
    )
    if (destinations.some(schedule => schedule.error)) return
    busy.current = true
    setPending(true)
    setError(undefined)
    const value = serializeSchedule(clonePoints)
    const results = await Promise.allSettled(
      destinations.map(async destination => {
        await backend.callService(destination.entityId, 'text', 'set_value', {
          value
        })
        destination.markSaved(value)
      })
    )
    const succeeded = destinations
      .filter((_, index) => results[index].status === 'fulfilled')
      .map(entry => entry.day)
    const failed = destinations
      .filter((_, index) => results[index].status === 'rejected')
      .map(entry => entry.day)
    setCopied([...copied, ...succeeded])
    setTargets(failed)
    busy.current = false
    setPending(false)
    if (failed.length) {
      setError(
        `Could not copy to ${failed
          .map(dayLabel)
          .join(', ')}. Retry to save only these days.`
      )
    } else {
      setNotice(
        `Copied ${dayLabel(cloneDay)} to ${[...copied, ...succeeded]
          .map(dayLabel)
          .join(', ')}.`
      )
      setCloneDay(undefined)
    }
  }

  const cloneStatus = (day: ScheduleDay, scheduleError?: string) => {
    if (day === cloneDay) return 'Source'
    if (copied.includes(day)) return 'Saved'
    if (scheduleError) return scheduleError
    return targets.includes(day) ? 'Selected' : ''
  }

  let title = `${params.title} · Weekly schedule`
  if (editingDay) title = `${params.title} · ${dayLabel(editingDay)}`
  if (cloneDay) title = `Clone ${dayLabel(cloneDay)}`

  return (
    <ModalBody>
      <ModalTitle>{title}</ModalTitle>
      <div
        ref={contentRef}
        tabIndex={-1}
        className={clsx(
          'max-h-[calc(88dvh-9rem)] overflow-y-auto px-4 pb-6 outline-none sm:px-6',
          editingDay &&
            'lg:flex lg:h-[min(650px,calc(100dvh-180px))] lg:max-h-none lg:flex-col lg:overflow-visible'
        )}
      >
        {editingDay && (
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 lg:min-h-0 lg:flex-1 lg:gap-3">
            <div className="h-[240px] shrink-0 lg:h-auto lg:min-h-0 lg:flex-1">
              <ScheduleChart
                points={draft}
                label={dayLabel(editingDay)}
                activeIndex={activeIndex}
                onSelect={setActiveIndex}
                disabled={pending}
                fitContainer
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                className={arrowButtonClass}
                aria-label="Previous point"
                disabled={pending || activeIndex === 0}
                onClick={() => setActiveIndex(activeIndex - 1)}
              >
                <ChevronLeftIcon className="!text-[28px]" />
              </button>
              <div className="text-center" aria-live="polite">
                <span className="font-semibold">
                  Point {activeIndex + 1} of {draft.length}
                </span>
              </div>
              <button
                type="button"
                className={arrowButtonClass}
                aria-label="Next point"
                disabled={pending || activeIndex === draft.length - 1}
                onClick={() => setActiveIndex(activeIndex + 1)}
              >
                <ChevronRightIcon className="!text-[28px]" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <StepControl
                label="Hours"
                value={String(Math.floor(active.minutes / 60)).padStart(2, '0')}
                increase={() => changeTime(60)}
                decrease={() => changeTime(-60)}
                canIncrease={
                  !pending &&
                  canMoveSchedulePoint(draft, activeIndex, active.minutes + 60)
                }
                canDecrease={
                  !pending &&
                  canMoveSchedulePoint(draft, activeIndex, active.minutes - 60)
                }
              />
              <StepControl
                label="Minutes"
                value={String(active.minutes % 60).padStart(2, '0')}
                increase={() => changeTime(5)}
                decrease={() => changeTime(-5)}
                canIncrease={
                  !pending &&
                  canMoveSchedulePoint(draft, activeIndex, active.minutes + 5)
                }
                canDecrease={
                  !pending &&
                  canMoveSchedulePoint(draft, activeIndex, active.minutes - 5)
                }
              />
              <StepControl
                label="Temperature"
                value={`${active.temperature.toFixed(1)}°`}
                increase={() => changeTemperature(0.5)}
                decrease={() => changeTemperature(-0.5)}
                canIncrease={!pending && active.temperature < 35}
                canDecrease={!pending && active.temperature > 4}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                className={clsx(
                  buttonClass,
                  'inline-flex items-center justify-center gap-2'
                )}
                disabled={pending || !addition}
                onClick={() => {
                  if (!addition) return
                  setDraft([
                    ...draft.slice(0, activeIndex + 1),
                    addition,
                    ...draft.slice(activeIndex + 1)
                  ])
                  setActiveIndex(activeIndex + 1)
                }}
              >
                <AddIcon fontSize="small" />
                Add point
              </button>
              <button
                type="button"
                className={clsx(
                  buttonClass,
                  'inline-flex items-center justify-center gap-2'
                )}
                disabled={pending || activeIndex === 0}
                onClick={() => {
                  setDraft(draft.filter((_, index) => index !== activeIndex))
                  setActiveIndex(activeIndex - 1)
                }}
              >
                <RemoveIcon fontSize="small" />
                Remove point
              </button>
            </div>
            {current.error && (
              <p role="alert" className="text-center text-red-300">
                {current.error}. Saving is disabled until the schedule is
                available.
              </p>
            )}
          </div>
        )}
        {cloneDay && (
          <div className="flex flex-col gap-4">
            <div className="mx-auto w-full max-w-xl">
              <ScheduleChart points={clonePoints} label={dayLabel(cloneDay)} />
            </div>
            <p className="text-center text-gray-300">
              Select the days to replace with {dayLabel(cloneDay)}’s schedule.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {schedules.map(schedule => (
                <button
                  key={schedule.day}
                  type="button"
                  aria-pressed={targets.includes(schedule.day)}
                  className={clsx(
                    controlButtonClass,
                    'flex min-h-[80px] flex-col items-center justify-center',
                    targets.includes(schedule.day)
                      ? 'border-white bg-white text-gray-900'
                      : 'border-gray-500 bg-gray-800 text-white enabled:hover:bg-gray-700'
                  )}
                  disabled={
                    pending ||
                    schedule.day === cloneDay ||
                    !!schedule.error ||
                    copied.includes(schedule.day)
                  }
                  onClick={() =>
                    setTargets(
                      targets.includes(schedule.day)
                        ? targets.filter(day => day !== schedule.day)
                        : [...targets, schedule.day]
                    )
                  }
                >
                  <span>{dayLabel(schedule.day)}</span>
                  <span
                    className={clsx(
                      'mt-1 text-xs',
                      targets.includes(schedule.day)
                        ? 'text-gray-600'
                        : 'text-gray-400'
                    )}
                  >
                    {cloneStatus(schedule.day, schedule.error)}
                  </span>
                </button>
              ))}
            </div>
            {copied.length > 0 && (
              <p role="status" className="text-center text-emerald-300">
                Saved: {copied.map(dayLabel).join(', ')}.
              </p>
            )}
          </div>
        )}
        {!editingDay && !cloneDay && (
          <div className="flex flex-col gap-4">
            {climate.entityState?.state !== 'auto' && (
              <p className="text-center text-sm text-amber-200">
                Schedule inactive. Select Auto on the thermostat to use it.
              </p>
            )}
            {notice && (
              <p role="status" className="text-center text-emerald-300">
                {notice}
              </p>
            )}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {schedules.map(schedule => (
                <section
                  key={schedule.day}
                  className="overflow-hidden rounded-lg border-2 border-gray-600 bg-gray-900"
                >
                  <button
                    type="button"
                    aria-label={`Edit ${dayLabel(schedule.day)}`}
                    disabled={!!schedule.error}
                    onClick={() => editDay(schedule.day)}
                    className="press-feedback block w-full p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white enabled:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <h3 className="mb-3 font-semibold">
                      {dayLabel(schedule.day)}
                    </h3>
                    {schedule.error && (
                      <p className="flex min-h-[120px] items-center justify-center text-sm text-gray-400">
                        {schedule.error}
                      </p>
                    )}
                    {!schedule.error && !!schedule.points.length && (
                      <ScheduleChart
                        points={schedule.points}
                        label={dayLabel(schedule.day)}
                        compact
                      />
                    )}
                    {!schedule.error && !schedule.points.length && (
                      <p className="flex min-h-[120px] items-center justify-center text-sm text-gray-400">
                        No schedule · Define day
                      </p>
                    )}
                  </button>
                  <button
                    type="button"
                    aria-label={`Clone ${dayLabel(schedule.day)}`}
                    disabled={!!schedule.error || !schedule.points?.length}
                    onClick={() => startClone(schedule.day)}
                    className="press-feedback min-h-12 flex w-full items-center justify-center gap-2 border-t-2 border-gray-600 bg-gray-800 py-3 text-base text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white enabled:hover:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-600"
                  >
                    <ContentCopyIcon fontSize="small" />
                    Clone
                  </button>
                </section>
              ))}
            </div>
          </div>
        )}
        {error && (
          <p role="alert" className="mt-4 text-center text-red-300">
            {error}
          </p>
        )}
        {pending && (
          <p role="status" className="mt-4 text-center text-gray-300">
            Saving… Please wait.
          </p>
        )}
      </div>
      {editingDay && (
        <ModalFooter>
          <ModalButton
            name={pending ? 'Saving…' : 'Save'}
            icon={<CheckIcon />}
            isDisabled={pending || !!current.error}
            onClick={saveDay}
          />
          <ModalButton
            name="Discard"
            icon={<DeleteOutlineIcon />}
            isDanger
            isDisabled={pending}
            onClick={backToWeek}
          />
        </ModalFooter>
      )}
      {cloneDay && (
        <ModalFooter>
          <ModalButton
            name={pending ? 'Copying…' : 'Copy to selected days'}
            icon={<ContentCopyIcon />}
            isDisabled={
              pending ||
              !targets.length ||
              schedules.some(
                schedule => targets.includes(schedule.day) && !!schedule.error
              )
            }
            onClick={copyDays}
          />
          <ModalButton
            name="Cancel"
            icon={<CloseIcon />}
            isDisabled={pending}
            onClick={backToWeek}
          />
        </ModalFooter>
      )}
      {!editingDay && !cloneDay && (
        <ModalFooter>
          <ModalButton
            name="Back to thermostat"
            icon={<ArrowBackIcon />}
            onClick={() => modal.openModal('radiatorControl', params)}
          />
          <ModalButton
            name="Close"
            icon={<CloseIcon />}
            onClick={modal.closeModal}
          />
        </ModalFooter>
      )}
    </ModalBody>
  )
}

export default RadiatorScheduleBody
