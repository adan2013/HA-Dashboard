import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import NotificationActionButton from '../NotificationActionButton'
import { ModalContextProvider } from '../../../contexts/ModalContext'

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
})
