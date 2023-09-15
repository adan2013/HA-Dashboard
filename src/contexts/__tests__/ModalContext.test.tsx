import { act, renderHook } from '@testing-library/react'
import { ModalContextProvider, useModalContext } from '../ModalContext'
import { ConfirmationModalParams } from '../modalUtils'

const renderModalHook = () => {
  const wrapper = ({ children }) => (
    <ModalContextProvider>{children}</ModalContextProvider>
  )
  return renderHook(() => useModalContext(), { wrapper })
}

describe('ModalContext', () => {
  it('should hide modal by default', () => {
    const hook = renderModalHook()
    expect(hook.result.current.state).toEqual({
      isOpen: false,
      modalType: null,
      params: null
    })
  })

  it('should open and close confirmation modal', () => {
    const confirmationMock = jest.fn()
    const modalParams: ConfirmationModalParams = {
      message: 'confirmation-message',
      isDanger: true,
      onConfirm: confirmationMock
    }
    const hook = renderModalHook()
    act(() => {
      hook.result.current.openModal('confirmation', modalParams)
    })
    expect(hook.result.current.state).toEqual({
      isOpen: true,
      modalType: 'confirmation',
      params: modalParams
    })
    act(() => {
      hook.result.current.closeModal()
    })
    expect(hook.result.current.state.isOpen).toBeFalsy()
  })
})
