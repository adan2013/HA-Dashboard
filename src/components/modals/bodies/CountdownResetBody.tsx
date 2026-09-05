import { useState } from 'react'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { useModalContext } from '../../../contexts/ModalContext'
import { CountdownResetModalParams } from '../../../contexts/modalUtils'
import {
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalTitle
} from '../ModalElements'

const MAX_DATE_OFFSET = 14

type DateControlButtonProps = {
  label: string
  isDisabled: boolean
  onClick: () => void
}

const DateControlButton = ({
  label,
  isDisabled,
  onClick
}: DateControlButtonProps) => (
  <button
    type="button"
    className="press-feedback min-h-[64px] rounded-lg bg-gray-700 px-2 text-lg font-semibold transition-colors hover:bg-gray-600 disabled:cursor-default disabled:text-gray-500 disabled:hover:bg-gray-700"
    disabled={isDisabled}
    onClick={onClick}
  >
    {label}
  </button>
)

const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const parseDate = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null

  const [, year, month, day] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  return formatDate(date) === value ? date : null
}

const addDays = (value: string, days: number) => {
  const date = parseDate(value)
  if (!date) return null
  date.setDate(date.getDate() + days)
  return formatDate(date)
}

const getDateBounds = () => {
  const today = new Date()
  const minimumDate = new Date(today)
  const maximumDate = new Date(today)
  minimumDate.setDate(today.getDate() - MAX_DATE_OFFSET)
  maximumDate.setDate(today.getDate() + MAX_DATE_OFFSET)
  return {
    initial: formatDate(today),
    minimum: formatDate(minimumDate),
    maximum: formatDate(maximumDate)
  }
}

const CountdownResetBody = () => {
  const modal = useModalContext()
  const params = modal.state.params as CountdownResetModalParams
  const [dateBounds] = useState(getDateBounds)
  const [selectedDate, setSelectedDate] = useState(dateBounds.initial)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const countdownStatus =
    params.daysLeft < 0
      ? `${Math.abs(params.daysLeft)} days after deadline`
      : `${params.daysLeft} days left`

  const isDateValid =
    parseDate(selectedDate) !== null &&
    selectedDate >= dateBounds.minimum &&
    selectedDate <= dateBounds.maximum

  const canShiftDate = (days: number) => {
    const shiftedDate = addDays(selectedDate, days)
    return (
      shiftedDate !== null &&
      shiftedDate >= dateBounds.minimum &&
      shiftedDate <= dateBounds.maximum
    )
  }

  const shiftDate = (days: number) => {
    const shiftedDate = addDays(selectedDate, days)
    if (shiftedDate && canShiftDate(days)) setSelectedDate(shiftedDate)
  }

  const confirmReset = async () => {
    if (!isDateValid || isSubmitting) return
    setIsSubmitting(true)
    try {
      await params.onConfirm(selectedDate)
      modal.closeModal()
    } catch {
      setIsSubmitting(false)
    }
  }

  return (
    <ModalBody>
      <ModalTitle>Reset countdown</ModalTitle>
      <div className="px-6 pb-8 text-center">
        <div className="mb-6 flex flex-col gap-2 rounded-lg bg-gray-900 px-5 py-4 text-left sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="text-lg font-semibold">{params.title}</div>
          <div className="text-left sm:text-right">
            <div className="text-sm text-gray-400">
              Current: {params.currentValue}
            </div>
            <div className="font-semibold">{countdownStatus}</div>
          </div>
        </div>
        <div className="mb-6 grid grid-cols-5 gap-2">
          {[-7, -1].map(days => (
            <DateControlButton
              key={days}
              label={`${days}`}
              isDisabled={!canShiftDate(days)}
              onClick={() => shiftDate(days)}
            />
          ))}
          <DateControlButton
            label="Today"
            isDisabled={selectedDate === dateBounds.initial}
            onClick={() => setSelectedDate(dateBounds.initial)}
          />
          {[1, 7].map(days => (
            <DateControlButton
              key={days}
              label={`+${days}`}
              isDisabled={!canShiftDate(days)}
              onClick={() => shiftDate(days)}
            />
          ))}
        </div>
        <label
          className="flex flex-col items-center gap-2"
          htmlFor="reset-date"
        >
          <span>Reset date</span>
          <input
            id="reset-date"
            type="date"
            className="min-h-[64px] w-full max-w-sm cursor-pointer rounded-lg bg-gray-700 px-5 text-center text-xl text-white"
            min={dateBounds.minimum}
            max={dateBounds.maximum}
            value={selectedDate}
            onChange={event => setSelectedDate(event.target.value)}
          />
        </label>
      </div>
      <ModalFooter>
        <ModalButton
          name={isSubmitting ? 'Resetting…' : 'Confirm reset'}
          icon={<CheckOutlinedIcon />}
          isDanger
          isDisabled={!isDateValid || isSubmitting}
          onClick={confirmReset}
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

export default CountdownResetBody
