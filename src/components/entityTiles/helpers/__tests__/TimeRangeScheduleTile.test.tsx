import { fireEvent, render, screen } from '@testing-library/react'
import { toast } from 'react-toastify'
import { useHomeAssistantEntity } from '../../../../api/hooks'
import TimeRangeScheduleTile from '../TimeRangeScheduleTile'
import { getMockedEntityState } from '../../../../utils/testUtils'

const openModalMock = jest.fn()
const callServiceMock = jest.fn()

jest.mock('../../../../contexts/ModalContext', () => ({
  useModalContext: () => ({
    openModal: openModalMock
  })
}))

jest.mock('../../../../contexts/BackendContext', () => ({
  useBackend: () => ({
    callService: callServiceMock
  })
}))

jest.mock('../../../../api/hooks', () => ({
  useHomeAssistantEntity: jest.fn()
}))

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn()
  }
}))

const useHomeAssistantEntityMock = useHomeAssistantEntity as jest.Mock

describe('TimeRangeScheduleTile', () => {
  beforeEach(() => {
    openModalMock.mockReset()
    callServiceMock.mockReset()
    jest.mocked(toast.success).mockReset()
    useHomeAssistantEntityMock.mockReturnValue(
      getMockedEntityState('input_text.schedule', '16:00-22:00')
    )
  })

  it('shows the subscribed range and opens an editor snapshot', () => {
    render(
      <TimeRangeScheduleTile
        title="Circuit schedule"
        entityId="input_text.schedule"
      />
    )

    expect(screen.getByText('16:00')).toBeInTheDocument()
    expect(screen.getByText('22:00')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Circuit schedule' }))
    expect(openModalMock).toHaveBeenCalledWith(
      'timeRangeSchedule',
      expect.objectContaining({
        title: 'Circuit schedule',
        currentValue: '16:00-22:00'
      })
    )
  })

  it('shows an error and uses the repair default for malformed data', () => {
    useHomeAssistantEntityMock.mockReturnValue(
      getMockedEntityState('input_text.schedule', 'broken')
    )
    render(
      <TimeRangeScheduleTile
        title="Circuit schedule"
        entityId="input_text.schedule"
      />
    )

    expect(screen.getByText('Invalid')).toBeInTheDocument()
    expect(screen.getByText('schedule')).toBeInTheDocument()
    expect(screen.getByTestId('tile-background')).toHaveClass('bg-red-500')
    fireEvent.click(screen.getByRole('button', { name: 'Circuit schedule' }))
    expect(openModalMock).toHaveBeenCalledWith(
      'timeRangeSchedule',
      expect.objectContaining({ currentValue: '09:00-15:00' })
    )
  })

  it('writes the helper through the existing service call', async () => {
    callServiceMock.mockResolvedValue(undefined)
    render(
      <TimeRangeScheduleTile
        title="DND schedule"
        entityId="input_text.schedule"
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'DND schedule' }))
    const [, params] = openModalMock.mock.calls[0]

    await params.onConfirm('22:30-07:15')
    expect(callServiceMock).toHaveBeenCalledWith(
      'input_text.schedule',
      'input_text',
      'set_value',
      { value: '22:30-07:15' }
    )
    expect(toast.success).toHaveBeenCalledWith('The schedule has been updated')
  })
})
