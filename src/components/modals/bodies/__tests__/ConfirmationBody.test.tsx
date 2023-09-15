import { fireEvent, screen } from '@testing-library/react'
import ConfirmationBody from '../ConfirmationBody'
import { ConfirmationModalParams } from '../../../../contexts/modalUtils'
import { renderModalBody } from '../../../../utils/testUtils'

const renderConfirmationBody = (params: ConfirmationModalParams) =>
  renderModalBody(<ConfirmationBody />, 'confirmation', params)

describe('ConfirmationBody', () => {
  it('should render default message and no-danger button', () => {
    renderConfirmationBody({
      onConfirm: jest.fn()
    })
    expect(
      screen.getByText('Are you sure you want to continue?')
    ).toBeInTheDocument()
    expect(screen.getByTestId('modal-button-Confirm')).toBeInTheDocument()
    expect(screen.getByTestId('modal-button-Confirm')).toHaveClass(
      'bg-gray-800'
    )
    expect(screen.getByTestId('modal-button-Cancel')).toBeInTheDocument()
  })

  it('should render custom message and danger button', () => {
    renderConfirmationBody({
      message: 'custom-confirmation-message',
      isDanger: true,
      onConfirm: jest.fn()
    })
    expect(screen.getByText('custom-confirmation-message')).toBeInTheDocument()
    expect(screen.getByTestId('modal-button-Confirm')).toBeInTheDocument()
    expect(screen.getByTestId('modal-button-Confirm')).toHaveClass('bg-red-900')
    expect(screen.getByTestId('modal-button-Cancel')).toBeInTheDocument()
  })

  it('should close modal after choosing cancel button', () => {
    const confirmCallbackMock = jest.fn()
    const { closeModalMock } = renderConfirmationBody({
      onConfirm: confirmCallbackMock
    })
    fireEvent.click(screen.getByTestId('modal-button-Cancel'))
    expect(closeModalMock).toHaveBeenCalled()
    expect(confirmCallbackMock).not.toHaveBeenCalled()
  })

  it('should call onConfirm function and close modal', () => {
    const confirmCallbackMock = jest.fn()
    const { closeModalMock } = renderConfirmationBody({
      onConfirm: confirmCallbackMock
    })
    fireEvent.click(screen.getByTestId('modal-button-Confirm'))
    expect(closeModalMock).toHaveBeenCalled()
    expect(confirmCallbackMock).toHaveBeenCalled()
  })
})
