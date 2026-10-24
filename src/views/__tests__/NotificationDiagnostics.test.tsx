import { fireEvent, render, screen, within } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import NotificationDiagnostics, {
  notificationLayoutExamples
} from '../NotificationDiagnostics'
import notificationExamples from '../../components/notifications/notificationExamples'

const mockCallService = jest.fn()
const mockDismiss = jest.fn()
jest.mock('../../contexts/BackendContext', () => ({
  useBackend: () => ({
    callService: mockCallService,
    dismissNotification: mockDismiss
  })
}))

const renderGallery = () =>
  render(
    <BrowserRouter>
      <NotificationDiagnostics />
    </BrowserRouter>
  )

describe('NotificationDiagnostics', () => {
  it('shows every configured notification with its real title and icon', () => {
    renderGallery()
    Object.values(notificationExamples).forEach(notification => {
      const card = screen.getAllByTestId(
        `notification-light-border-${notification.id}`
      )[0]
      expect(
        within(card).getByRole('heading', { name: notification.title })
      ).toBeVisible()
      expect(
        within(within(card).getByRole('heading')).getByTestId(
          `${notification.icon}Icon`
        )
      ).toBeInTheDocument()
    })
  })

  it('disables all actions and dismiss buttons without contacting the backend', () => {
    renderGallery()
    screen.getAllByRole('button').forEach(button => {
      expect(button).toBeDisabled()
      fireEvent.click(button)
    })
    expect(mockCallService).not.toHaveBeenCalled()
    expect(mockDismiss).not.toHaveBeenCalled()
  })

  it('includes long prose and unbroken titles with dismiss controls for narrow layout checks', () => {
    renderGallery()
    fireEvent.click(
      screen.getByRole('checkbox', { name: 'Narrow preview (360 px)' })
    )
    expect(screen.getByRole('checkbox')).toBeChecked()
    notificationLayoutExamples.forEach(notification => {
      const card = screen.getByRole('article', { name: notification.title })
      expect(
        within(card).getByRole('heading', { name: notification.title })
      ).toBeVisible()
      expect(
        within(card).getByRole('button', {
          name: `Dismiss ${notification.title}`
        })
      ).toBeVisible()
    })
  })

  it('shows preparing and printing variants without auto off text when disabled', () => {
    renderGallery()
    const printerCards = screen.getAllByRole('article', {
      name: '3D printer'
    })
    expect(printerCards).toHaveLength(3)
    expect(within(printerCards[0]).getByText('Auto off enabled')).toBeVisible()
    expect(
      within(printerCards[1]).getByText('Preparing to print…')
    ).toBeVisible()
    printerCards
      .slice(1)
      .forEach(card =>
        expect(
          within(card).queryByText('Auto off enabled')
        ).not.toBeInTheDocument()
      )
  })
})
