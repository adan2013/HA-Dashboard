import { fireEvent, render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import NotificationCard from '../NotificationCard'
import notificationExamples from '../notificationExamples'
import { notificationLayoutExamples } from '../../../views/NotificationDiagnostics'

describe('NotificationCard', () => {
  it.each(notificationLayoutExamples)(
    'keeps the complete long title and a working dismiss button: $id',
    notification => {
      const onDismiss = jest.fn()
      render(
        <BrowserRouter>
          <NotificationCard notification={notification} onDismiss={onDismiss} />
        </BrowserRouter>
      )
      expect(
        screen.getByRole('heading', { name: notification.title })
      ).toHaveTextContent(notification.title)
      fireEvent.click(
        screen.getByRole('button', { name: `Dismiss ${notification.title}` })
      )
      expect(onDismiss).toHaveBeenCalledTimes(1)
    }
  )

  it('renders a fallback icon for older backend messages without icon metadata', () => {
    render(
      <BrowserRouter>
        <NotificationCard
          notification={{ ...notificationExamples.test1, icon: undefined }}
        />
      </BrowserRouter>
    )
    expect(screen.getByTestId('NotificationsNoneOutlinedIcon')).toBeVisible()
  })
})
