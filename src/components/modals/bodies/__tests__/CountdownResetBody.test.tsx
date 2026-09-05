import { fireEvent, screen, waitFor } from '@testing-library/react'
import CountdownResetBody from '../CountdownResetBody'
import { CountdownResetModalParams } from '../../../../contexts/modalUtils'
import { renderModalBody } from '../../../../utils/testUtils'

const renderCountdownResetBody = (
  params: Partial<CountdownResetModalParams> = {}
) => {
  const completeParams: CountdownResetModalParams = {
    title: 'Car insurance',
    currentValue: '2023-03-01',
    daysLeft: 320,
    onConfirm: jest.fn().mockResolvedValue(undefined),
    ...params
  }
  return {
    ...renderModalBody(
      <CountdownResetBody />,
      'countdownReset',
      completeParams
    ),
    params: completeParams
  }
}

describe('CountdownResetBody', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date(2023, 3, 15, 12))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should start with today and render the countdown title', () => {
    renderCountdownResetBody()
    expect(screen.getByText('Reset countdown')).toBeInTheDocument()
    expect(screen.getByText('Car insurance')).toBeInTheDocument()
    expect(screen.getByText('Current: 2023-03-01')).toBeInTheDocument()
    expect(screen.getByText('320 days left')).toBeInTheDocument()
    expect(screen.getByLabelText('Reset date')).toHaveValue('2023-04-15')
    expect(screen.getByRole('button', { name: 'Today' })).toBeDisabled()
  })

  it('should render the number of days after the deadline', () => {
    renderCountdownResetBody({ daysLeft: -3 })
    expect(screen.getByText('3 days after deadline')).toBeInTheDocument()
  })

  it('should add and subtract days from the current selection', () => {
    renderCountdownResetBody()
    fireEvent.click(screen.getByRole('button', { name: '+7' }))
    fireEvent.click(screen.getByRole('button', { name: '+1' }))
    expect(screen.getByLabelText('Reset date')).toHaveValue('2023-04-23')
    fireEvent.click(screen.getByRole('button', { name: '-1' }))
    expect(screen.getByLabelText('Reset date')).toHaveValue('2023-04-22')
  })

  it('should return to today and disable the today button', () => {
    renderCountdownResetBody()
    fireEvent.click(screen.getByRole('button', { name: '+7' }))
    const todayButton = screen.getByRole('button', { name: 'Today' })

    expect(todayButton).toBeEnabled()
    fireEvent.click(todayButton)
    expect(screen.getByLabelText('Reset date')).toHaveValue('2023-04-15')
    expect(todayButton).toBeDisabled()
  })

  it('should disable a complete step when it would exceed the date range', () => {
    renderCountdownResetBody()
    fireEvent.change(screen.getByLabelText('Reset date'), {
      target: { value: '2023-04-25' }
    })
    expect(screen.getByRole('button', { name: '+7' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '+1' })).toBeEnabled()
  })

  it('should reject an empty or out-of-range date', () => {
    renderCountdownResetBody()
    const dateInput = screen.getByLabelText('Reset date')
    const confirmButton = screen.getByTestId('modal-button-Confirm reset')

    fireEvent.change(dateInput, { target: { value: '' } })
    expect(confirmButton).toHaveClass('text-gray-600')
    fireEvent.click(confirmButton)

    fireEvent.change(dateInput, { target: { value: '2023-05-01' } })
    expect(confirmButton).toHaveClass('text-gray-600')
  })

  it('should submit the selected date and close after success', async () => {
    const { params, closeModalMock } = renderCountdownResetBody()
    fireEvent.change(screen.getByLabelText('Reset date'), {
      target: { value: '2023-04-20' }
    })
    fireEvent.click(screen.getByTestId('modal-button-Confirm reset'))

    await waitFor(() =>
      expect(params.onConfirm).toHaveBeenCalledWith('2023-04-20')
    )
    expect(closeModalMock).toHaveBeenCalled()
  })

  it('should prevent duplicate submissions but still allow closing', async () => {
    let resolveRequest: () => void
    const onConfirm = jest.fn(
      () =>
        new Promise<void>(resolve => {
          resolveRequest = resolve
        })
    )
    const { closeModalMock } = renderCountdownResetBody({ onConfirm })

    fireEvent.click(screen.getByTestId('modal-button-Confirm reset'))
    fireEvent.click(screen.getByTestId('modal-button-Resetting…'))
    fireEvent.click(screen.getByTestId('modal-button-Close'))

    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(closeModalMock).toHaveBeenCalledTimes(1)
    resolveRequest()
  })

  it('should keep the modal open when reset fails', async () => {
    const { closeModalMock } = renderCountdownResetBody({
      onConfirm: jest.fn().mockRejectedValue(new Error('failure'))
    })
    fireEvent.click(screen.getByTestId('modal-button-Confirm reset'))

    await waitFor(() =>
      expect(
        screen.getByTestId('modal-button-Confirm reset')
      ).toBeInTheDocument()
    )
    expect(closeModalMock).not.toHaveBeenCalled()
  })
})
