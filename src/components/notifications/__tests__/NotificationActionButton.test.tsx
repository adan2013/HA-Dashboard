import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import NotificationActionButton from '../NotificationActionButton'
import { ModalContextProvider } from '../../../contexts/ModalContext'

const callService = jest.fn()

jest.mock('../../../contexts/BackendContext', () => ({
  useBackend: () => ({ callService })
}))

const renderButton = (id: string) =>
  render(
    <BrowserRouter>
      <ModalContextProvider>
        <>
          <NotificationActionButton id={id} />
          <ToastContainer />
        </>
      </ModalContextProvider>
    </BrowserRouter>
  )

describe('NotificationActionButton', () => {
  beforeEach(() => {
    callService.mockReset().mockResolvedValue(undefined)
  })
  it('should not render if action is not found', () => {
    renderButton('test1')
    expect(screen.queryByTestId('action-test1')).not.toBeInTheDocument()
  })

  it('should render action button, open modal and show toast message', async () => {
    renderButton('test3')
    expect(screen.getByTestId('action-test3')).toBeInTheDocument()
    expect(screen.getByText('EXAMPLE ACTION')).toBeVisible()
    fireEvent.click(screen.getByText('EXAMPLE ACTION'))
    expect(screen.getByText('CUSTOM_CONFIRMATION_MESSAGE')).toBeVisible()
    fireEvent.click(screen.getByTestId('modal-button-Confirm'))
    await waitFor(() => {
      expect(screen.getByText('Example action executed!')).toBeVisible()
    })
  })
  it('requires confirmation before disabling water leak alerts', async () => {
    renderButton('waterLeak')
    fireEvent.click(screen.getByRole('button', { name: 'DISABLE ALERTS' }))
    expect(
      screen.getByText(/leaves water leak monitoring disabled/)
    ).toBeVisible()
    expect(callService).not.toHaveBeenCalled()
    fireEvent.click(screen.getByTestId('modal-button-Confirm'))
    expect(callService).toHaveBeenCalledWith(
      'input_boolean.alertwaterleak',
      'input_boolean',
      'turn_off'
    )
    await waitFor(() =>
      expect(screen.getByText('Water leak alerts disabled.')).toBeVisible()
    )
  })

  it('does not disable alerts when confirmation is cancelled', () => {
    renderButton('waterLeak')
    fireEvent.click(screen.getByRole('button', { name: 'DISABLE ALERTS' }))
    fireEvent.click(screen.getByTestId('modal-button-Cancel'))
    expect(callService).not.toHaveBeenCalled()
  })

  it('reports a failed service call', async () => {
    callService.mockRejectedValue(new Error('Home Assistant is not connected'))
    renderButton('waterLeak')
    fireEvent.click(screen.getByRole('button', { name: 'DISABLE ALERTS' }))
    fireEvent.click(screen.getByTestId('modal-button-Confirm'))
    await waitFor(() =>
      expect(screen.getByText('Home Assistant is not connected')).toBeVisible()
    )
    expect(
      screen.queryByText('Water leak alerts disabled.')
    ).not.toBeInTheDocument()
  })
})
