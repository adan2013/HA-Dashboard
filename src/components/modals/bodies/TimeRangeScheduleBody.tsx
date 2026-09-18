import { useState } from 'react'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { useModalContext } from '../../../contexts/ModalContext'
import { TimeRangeScheduleModalParams } from '../../../contexts/modalUtils'
import {
  DEFAULT_TIME_RANGE,
  formatTime,
  formatTimeRange,
  parseTimeRange,
  shiftTime,
  TimeOfDay
} from '../../../utils/timeRangeUtils'
import {
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalTitle
} from '../ModalElements'

type TimeControlProps = {
  label: string
  value: TimeOfDay
  onChange: (value: TimeOfDay) => void
}

type StepButtonProps = {
  label: string
  accessibleLabel: string
  onClick: () => void
}

const StepButton = ({ label, accessibleLabel, onClick }: StepButtonProps) => (
  <button
    type="button"
    aria-label={accessibleLabel}
    className="press-feedback min-h-[64px] rounded-lg bg-gray-700 px-2 text-lg font-semibold transition-colors hover:bg-gray-600"
    onClick={onClick}
  >
    {label}
  </button>
)

const TimeControl = ({ label, value, onChange }: TimeControlProps) => {
  const update = (unit: 'hour' | 'minute', amount: number) =>
    onChange(shiftTime(value, unit, amount))

  return (
    <section className="rounded-lg bg-gray-900 px-4 py-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold">{label}</h3>
        <output
          aria-label={`${label} time`}
          className="font-mono text-3xl font-bold"
        >
          {formatTime(value)}
        </output>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_2px_2fr]">
        <div>
          <div className="mb-2 text-center text-sm text-gray-400">Hours</div>
          <div className="grid grid-cols-2 gap-2">
            <StepButton
              label="−1"
              accessibleLabel={`Decrease ${label.toLowerCase()} hour`}
              onClick={() => update('hour', -1)}
            />
            <StepButton
              label="+1"
              accessibleLabel={`Increase ${label.toLowerCase()} hour`}
              onClick={() => update('hour', 1)}
            />
          </div>
        </div>
        <div
          aria-hidden="true"
          className="h-[2px] w-full rounded-full bg-gray-700 sm:h-auto sm:w-auto"
        />
        <div>
          <div className="mb-2 text-center text-sm text-gray-400">Minutes</div>
          <div className="grid grid-cols-4 gap-2">
            {[-5, -1, 1, 5].map(amount => (
              <StepButton
                key={amount}
                label={amount > 0 ? `+${amount}` : `${amount}`}
                accessibleLabel={`${
                  amount > 0 ? 'Increase' : 'Decrease'
                } ${label.toLowerCase()} minutes by ${Math.abs(amount)}`}
                onClick={() => update('minute', amount)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const TimeRangeScheduleBody = () => {
  const modal = useModalContext()
  const params = modal.state.params as TimeRangeScheduleModalParams
  const initialRange =
    parseTimeRange(params.currentValue) || parseTimeRange(DEFAULT_TIME_RANGE)
  const [start, setStart] = useState(initialRange.start)
  const [end, setEnd] = useState(initialRange.end)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>()
  const selectedValue = formatTimeRange({ start, end })
  const isUnchanged = selectedValue === formatTimeRange(initialRange)
  const isEqual = formatTime(start) === formatTime(end)

  const confirm = async () => {
    if (isSubmitting || isUnchanged || isEqual) return
    setIsSubmitting(true)
    setError(undefined)
    try {
      await params.onConfirm(selectedValue)
      modal.closeModal()
    } catch {
      setError('Could not update schedule')
      setIsSubmitting(false)
    }
  }

  return (
    <ModalBody>
      <ModalTitle>{params.title}</ModalTitle>
      <div className="flex flex-col gap-4 px-6 pb-8">
        <TimeControl label="Start" value={start} onChange={setStart} />
        <TimeControl label="End" value={end} onChange={setEnd} />
        {isEqual && (
          <div className="text-center text-red-400" role="alert">
            Start and end time must be different
          </div>
        )}
        {error && (
          <div className="text-center text-red-400" role="alert">
            {error}
          </div>
        )}
      </div>
      <ModalFooter>
        <ModalButton
          name={isSubmitting ? 'Saving…' : 'Save'}
          icon={<CheckOutlinedIcon />}
          isDisabled={isSubmitting || isUnchanged || isEqual}
          onClick={confirm}
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

export default TimeRangeScheduleBody
