import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import CallServiceTile from '../CallServiceTile'

const callService = jest.fn()
const openModalMock = jest.fn()

jest.mock('../../../../contexts/HomeAssistantContext', () => ({
  useHomeAssistant: jest.fn(() => ({
    callService
  }))
}))

jest.mock('../../../../contexts/ModalContext', () => ({
  useModalContext: () => ({
    openModal: openModalMock
  })
}))

describe('CallServiceTile', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  it('should display all the information and call service with timeout', async () => {
    render(
      <CallServiceTile
        title="title"
        domain="myDomain"
        service="myService"
        payload={{
          myPayload: 'myPayload'
        }}
        icon={<div data-testid="myIcon" />}
      />
    )
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByTestId('myIcon')).toBeInTheDocument()
    expect(callService).not.toHaveBeenCalled()

    fireEvent.mouseDown(screen.getByText('title'))
    fireEvent.mouseUp(screen.getByText('title'))
    await waitFor(() =>
      expect(callService).toHaveBeenCalledWith(
        undefined,
        'myDomain',
        'myService',
        {
          myPayload: 'myPayload'
        }
      )
    )
    expect(callService).toHaveBeenCalledTimes(1)

    expect(screen.getByTestId('CachedOutlinedIcon')).toBeInTheDocument()
    expect(screen.getByTestId('CachedOutlinedIcon')).toHaveClass(
      'animate-spin opacity-30'
    )

    fireEvent.mouseDown(screen.getByText('title'))
    fireEvent.mouseUp(screen.getByText('title'))
    jest.advanceTimersByTime(500)
    expect(callService).toHaveBeenCalledTimes(1)
  })

  it('should use confirmation modal before calling the service', async () => {
    render(
      <CallServiceTile
        title="title"
        domain="myDomain"
        service="myService"
        confirmationRequired
      />
    )
    expect(screen.getByText('title')).toBeInTheDocument()
    fireEvent.mouseDown(screen.getByText('title'))
    fireEvent.mouseUp(screen.getByText('title'))
    await waitFor(() => expect(openModalMock).toHaveBeenCalledTimes(1))
    expect(callService).not.toHaveBeenCalled()
  })
})
