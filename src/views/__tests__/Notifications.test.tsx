import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Notifications from '../Notifications'
import { NotificationPayload } from '../../api/backend/notificationTypes'

const mockNotification = (
  id: string,
  custom: Partial<NotificationPayload> = {}
): NotificationPayload => ({
  id,
  title: `${id}_title`,
  description: `${id}_description`,
  extraInfo: `${id}_extraInfo`,
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
    expect(screen.getByText('test1_description')).toBeVisible()
    expect(screen.getByText('test1_extraInfo')).toBeVisible()
    expect(screen.getByText('12:00 05-05-2023')).toBeVisible()
    expect(screen.queryByTestId('action-test1')).not.toBeInTheDocument()
    expect(screen.getByTestId('notification-close-button-test1')).toBeVisible()
    expect(
      screen
        .getByTestId('notification-light-border-test1')
        .getAttribute('class')
    ).toContain('border-red-600')
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
