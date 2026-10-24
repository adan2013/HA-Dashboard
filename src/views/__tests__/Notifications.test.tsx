import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Notifications from '../Notifications'
import { NotificationPayload } from '../../api/backend/notificationTypes'

const mockNotification = (
  id: 'test1' | 'test2' | 'test3',
  custom: Partial<Omit<NotificationPayload, 'id' | 'payload'>> = {}
): NotificationPayload => ({
  id,
  title: `${id}_title`,
  priorityOrder: 'medium',
  light: 'red',
  canBeDismissed: true,
  ignoreDND: true,
  createdAt: '2023-05-05T12:00:00Z',
  ...custom
})

const renderView = (
  isWidget: boolean,
  dndIsOn: boolean,
  notifications: NotificationPayload[]
) =>
  render(
    <BrowserRouter>
      <Notifications
        isWidget={isWidget}
        initialData={{
          active: notifications,
          availableIds: [],
          dndMode: dndIsOn
        }}
      />
    </BrowserRouter>
  )

describe('Notifications', () => {
  it('should display empty list of notifications', () => {
    renderView(false, false, [])
    expect(screen.getByText('NO ACTIVE NOTIFICATIONS')).toBeVisible()
  })

  it('should display list of active notifications', () => {
    renderView(true, false, [mockNotification('test1')])
    expect(screen.getByText('test1_title')).toBeVisible()
    expect(screen.getByText('12:00 05-05-2023')).toBeVisible()
    expect(screen.queryByTestId('action-test1')).not.toBeInTheDocument()
    expect(screen.getByTestId('notification-close-button-test1')).toBeVisible()
    expect(
      screen
        .getByTestId('notification-light-border-test1')
        .getAttribute('class')
    ).toContain('border-red-600')
  })

  it.each([true, false])(
    'renders structured details in widget mode: %s',
    isWidget => {
      renderView(isWidget, false, [
        {
          ...mockNotification('test1'),
          id: 'deadlineWarning',
          payload: {
            deadlines: [
              { label: 'Replace filter', daysLeft: 3 },
              { label: 'Water plants', daysLeft: -2 }
            ]
          }
        }
      ])
      expect(screen.getAllByRole('listitem')).toHaveLength(2)
      expect(screen.getByText('Replace filter')).toBeVisible()
      expect(screen.getByText('Water plants')).toBeVisible()
    }
  )

  it('should not animate active notifications inside the dashboard widget', () => {
    const { container } = renderView(true, false, [mockNotification('test1')])

    expect(container.querySelector('.content-reveal')).not.toBeInTheDocument()
  })

  it('should display the header only in widget mode', () => {
    renderView(true, false, [
      mockNotification('test1'),
      mockNotification('test2')
    ])
    expect(screen.getByText('2 ACTIVE NOTIFICATIONS')).toBeVisible()
    expect(screen.getByText('OPEN FULL VIEW')).toBeVisible()
  })

  it('should display DND message in widget mode', () => {
    renderView(true, true, [mockNotification('test1')])
    expect(screen.getByText('DND MODE IS ACTIVE')).toBeVisible()
  })

  it('should display DND message in full mode', () => {
    renderView(false, true, [mockNotification('test1')])
    expect(screen.getByText('DND MODE IS ACTIVE')).toBeVisible()
  })

  it('should hide DND message in widget mode', () => {
    renderView(true, false, [mockNotification('test1')])
    expect(screen.queryByText('DND MODE IS ACTIVE')).not.toBeInTheDocument()
  })

  it('should hide DND message in full mode', () => {
    renderView(false, false, [mockNotification('test1')])
    expect(screen.queryByText('DND MODE IS ACTIVE')).not.toBeInTheDocument()
  })

  it('should use transparent border if notification does not have any light indication', () => {
    renderView(true, false, [mockNotification('test1', { light: undefined })])
    expect(
      screen
        .getByTestId('notification-light-border-test1')
        .getAttribute('class')
    ).toContain('border-transparent')
  })

  it('should hide X button if notification can not be closed', () => {
    renderView(true, false, [
      mockNotification('test1', { canBeDismissed: false })
    ])
    expect(
      screen.queryByTestId('notification-close-button-test1')
    ).not.toBeInTheDocument()
  })

  it('should render action button for notification test3', () => {
    renderView(true, false, [mockNotification('test3')])
    expect(screen.getByTestId('action-test3')).toBeInTheDocument()
    expect(screen.getByText('EXAMPLE ACTION')).toBeVisible()
  })
})
