import { readFileSync } from 'fs'
import { resolve } from 'path'
import { act, fireEvent, render, screen } from '@testing-library/react'
import Modal from 'react-modal'
import Tile from '../../components/basic/Tile'
import { ModalContextProvider, useModalContext } from '../ModalContext'

const HoldTile = () => {
  const { openModal } = useModalContext()
  return (
    <Tile
      title="Light"
      onHold={() =>
        openModal('confirmation', {
          message: 'Hold opened the modal',
          onConfirm: jest.fn()
        })
      }
    />
  )
}

it('shows the modal after a hold even before the next animation frame', () => {
  jest.useFakeTimers()
  const frame = jest.spyOn(window, 'requestAnimationFrame').mockReturnValue(1)
  const pointerEvent = Object.getOwnPropertyDescriptor(window, 'PointerEvent')
  Object.defineProperty(window, 'PointerEvent', {
    configurable: true,
    value: MouseEvent
  })
  // Use the real overlay styles: the normal Jest CSS mock hides opacity bugs.
  const style = document.createElement('style')
  const css = readFileSync(resolve(__dirname, '../../index.css'), 'utf8')
  style.textContent =
    css.match(/\.ReactModal__Overlay[^{}]*\{[^}]*\}/g)?.join('\n') || ''
  document.head.appendChild(style)
  const root = document.createElement('div')
  document.body.appendChild(root)
  Modal.setAppElement(root)
  const view = render(
    <ModalContextProvider>
      <HoldTile />
    </ModalContextProvider>,
    { container: root }
  )

  try {
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Light' }), {
      button: 0,
      clientX: 20,
      clientY: 20
    })
    act(() => jest.advanceTimersByTime(1000))
    expect(frame).toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toBeVisible()
  } finally {
    view.unmount()
    root.remove()
    style.remove()
    frame.mockRestore()
    if (pointerEvent)
      Object.defineProperty(window, 'PointerEvent', pointerEvent)
    else Reflect.deleteProperty(window, 'PointerEvent')
    jest.useRealTimers()
  }
})
