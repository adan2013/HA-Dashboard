import { fireEvent, screen, waitFor } from '@testing-library/react'
import TimeRangeScheduleBody from '../TimeRangeScheduleBody'
import { TimeRangeScheduleModalParams } from '../../../../contexts/modalUtils'
import { renderModalBody } from '../../../../utils/testUtils'

const renderScheduleBody = (
  params: Partial<TimeRangeScheduleModalParams> = {}
) => {
  const completeParams: TimeRangeScheduleModalParams = {
    title: 'Circuit schedule',
    currentValue: '23:59-00:02',
    onConfirm: jest.fn().mockResolvedValue(undefined),
    ...params
  }
  return {
    ...renderModalBody(
      <TimeRangeScheduleBody />,
      'timeRangeSchedule',
      completeParams
    ),
    params: completeParams
  }
}

describe('TimeRangeScheduleBody', () => {
  it('renders the snapshot and disables an unchanged submission', () => {
    renderScheduleBody()
    expect(screen.getByText('Circuit schedule')).toBeInTheDocument()
    expect(screen.getByLabelText('Start time')).toHaveTextContent('23:59')
    expect(screen.getByLabelText('End time')).toHaveTextContent('00:02')
    expect(screen.getByTestId('modal-button-Save')).toBeDisabled()
  })

  it('wraps fields independently without carrying minutes into hours', () => {
    renderScheduleBody()
    fireEvent.click(
      screen.getByRole('button', { name: 'Increase start minutes by 1' })
    )
    expect(screen.getByLabelText('Start time')).toHaveTextContent('23:00')

    fireEvent.click(screen.getByRole('button', { name: 'Increase start hour' }))
    expect(screen.getByLabelText('Start time')).toHaveTextContent('00:00')

    fireEvent.click(
      screen.getByRole('button', { name: 'Decrease end minutes by 5' })
    )
    expect(screen.getByLabelText('End time')).toHaveTextContent('00:57')
  })

  it('rejects equal start and end times', () => {
    renderScheduleBody({ currentValue: '09:00-10:00' })
    fireEvent.click(screen.getByRole('button', { name: 'Decrease end hour' }))

    expect(
      screen.getByText('Start and end time must be different')
    ).toBeInTheDocument()
    expect(screen.getByTestId('modal-button-Save')).toBeDisabled()
  })

  it('submits once and closes after service success', async () => {
    const { params, closeModalMock } = renderScheduleBody()
    fireEvent.click(
      screen.getByRole('button', { name: 'Increase start minutes by 1' })
    )
    fireEvent.click(screen.getByTestId('modal-button-Save'))

    await waitFor(() =>
      expect(params.onConfirm).toHaveBeenCalledWith('23:00-00:02')
    )
    expect(closeModalMock).toHaveBeenCalledTimes(1)
  })

  it('keeps the modal open and reports a service failure', async () => {
    const { closeModalMock } = renderScheduleBody({
      onConfirm: jest.fn().mockRejectedValue(new Error('failure'))
    })
    fireEvent.click(
      screen.getByRole('button', { name: 'Increase start minutes by 1' })
    )
    fireEvent.click(screen.getByTestId('modal-button-Save'))

    expect(await screen.findByText('Could not update schedule')).toBeVisible()
    expect(closeModalMock).not.toHaveBeenCalled()
  })
})
