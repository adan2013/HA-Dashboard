import { fireEvent, render, screen } from '@testing-library/react'
import { LightSlider, LightSliderProps } from '../LightSlider'

const renderSlider = (props: Partial<LightSliderProps> = {}) => {
  const onChangeMock = jest.fn()
  const onConfirmMock = jest.fn()
  const renderer = render(
    <LightSlider
      title="title"
      value={70}
      min={50}
      max={150}
      onChange={onChangeMock}
      onConfirm={onConfirmMock}
      {...props}
    />
  )
  return {
    renderer,
    onChangeMock,
    onConfirmMock
  }
}

const interactionTestCases = [
  [50, 0],
  [50, 50],
  [100, 150],
  [125, 200],
  [150, 250],
  [150, 300]
]

describe('LightSlider', () => {
  beforeAll(() => {
    window.HTMLElement.prototype.getBoundingClientRect = () =>
      ({
        left: 50,
        right: 250,
        top: 50,
        bottom: 70,
        width: 200,
        height: 20
      } as DOMRect)
  })

  describe('value rendering', () => {
    it.each([
      [20, 50, 150],
      [100, 50, 70],
      [0, 70, 150],
      [100, 50, 60],
      [0, 80, 150],
      [16, 46.7, 193.12]
    ])(
      'should render the slider with correct title and %i% of value (range %i-%i)',
      (percent, min, max) => {
        renderSlider({
          min,
          max
        })
        expect(screen.getByText('title')).toBeInTheDocument()
        expect(screen.getByTestId('slider-title')).toBeInTheDocument()
        expect(screen.getByTestId('value-slider-title')).toHaveStyle(
          `width: ${percent}%`
        )
      }
    )
  })

  describe('mouse onChange interaction', () => {
    it.each(interactionTestCases)(
      'should call onChange with %i value when clientX=%i',
      (value, clientX) => {
        const { onChangeMock } = renderSlider()
        const slider = screen.getByTestId('slider-title')
        fireEvent.mouseDown(slider, {
          clientX,
          buttons: 1
        })
        fireEvent.mouseUp(slider, {
          clientX,
          buttons: 1
        })
        expect(onChangeMock).toHaveBeenCalledWith(value)
      }
    )
  })

  describe('touch onChange interaction', () => {
    it.each(interactionTestCases)(
      'should call onChange with %i value when clientX=%i',
      (value, clientX) => {
        const { onChangeMock } = renderSlider()
        const slider = screen.getByTestId('slider-title')
        fireEvent.touchStart(slider, {
          touches: [{ clientX }]
        })
        fireEvent.touchEnd(slider, {
          touches: [{ clientX }]
        })
        expect(onChangeMock).toHaveBeenCalledWith(value)
      }
    )
  })

  describe('onConfirm - end of interaction', () => {
    it('should call onConfirm on mouseLeave event', () => {
      const { onChangeMock, onConfirmMock } = renderSlider()
      const slider = screen.getByTestId('slider-title')
      fireEvent.mouseLeave(slider, {
        clientX: 500,
        buttons: 1
      })
      expect(onChangeMock).not.toHaveBeenCalled()
      expect(onConfirmMock).toHaveBeenCalledTimes(1)
    })

    it('should call onConfirm at the end of mouse interaction', () => {
      const { onChangeMock, onConfirmMock } = renderSlider()
      const slider = screen.getByTestId('slider-title')
      fireEvent.mouseDown(slider, {
        clientX: 100,
        buttons: 1
      })
      expect(onChangeMock).toHaveBeenCalled()
      expect(onConfirmMock).not.toHaveBeenCalled()
      fireEvent.mouseMove(slider, {
        clientX: 100,
        buttons: 1
      })
      expect(onChangeMock).toHaveBeenCalledTimes(2)
      expect(onConfirmMock).not.toHaveBeenCalled()
      fireEvent.mouseUp(slider, {
        clientX: 100,
        buttons: 1
      })
      expect(onChangeMock).toHaveBeenCalledTimes(2)
      expect(onConfirmMock).toHaveBeenCalledTimes(1)
    })

    it('should call onConfirm at the end of touch interaction', () => {
      const { onChangeMock, onConfirmMock } = renderSlider()
      const slider = screen.getByTestId('slider-title')
      fireEvent.touchStart(slider, {
        touches: [{ clientX: 100 }]
      })
      expect(onChangeMock).toHaveBeenCalled()
      expect(onConfirmMock).not.toHaveBeenCalled()
      fireEvent.touchMove(slider, {
        touches: [{ clientX: 100 }]
      })
      expect(onChangeMock).toHaveBeenCalledTimes(2)
      expect(onConfirmMock).not.toHaveBeenCalled()
      fireEvent.touchEnd(slider, {
        touches: [{ clientX: 100 }]
      })
      expect(onChangeMock).toHaveBeenCalledTimes(2)
      expect(onConfirmMock).toHaveBeenCalledTimes(1)
    })
  })
})
