import clsx from 'clsx'
import { useLocation, Link, Outlet } from 'react-router-dom'
import { cloneElement } from 'react'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import { pageMetadata, sectionTiles } from './menus'
import { OutletContextType } from '../contexts/OutletContext'
import NotificationDot from '../components/layout/NotificationDot'

type DesktopLayoutProps = {
  contentKey?: number
}

type SectionLinksProps = {
  compact?: boolean
  currentPath: string
  hidden: boolean
}

const SectionLinks = ({
  compact = false,
  currentPath,
  hidden
}: SectionLinksProps) => (
  <div
    className={clsx(
      'mx-auto flex h-full flex-row justify-between gap-5',
      compact ? 'max-w-lg p-3' : 'max-w-6xl p-5'
    )}
  >
    {sectionTiles.map(tile => (
      <Link
        key={tile.name}
        to={tile.path}
        aria-label={tile.name}
        tabIndex={hidden ? -1 : undefined}
        className="press-feedback block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <div>
          <div
            className={clsx(
              'relative flex aspect-square items-center justify-center rounded-lg border-4 border-transparent transition-colors duration-200 hover:border-white',
              tile.background,
              tile.path === currentPath && 'border-white',
              compact ? 'w-14' : 'w-36'
            )}
          >
            <div className={clsx('aspect-square', tile.iconColor)}>
              {cloneElement(tile.icon, {
                className: clsx(
                  compact ? '!text-[2rem]' : '!text-[7rem]',
                  tile.iconClass
                )
              })}
            </div>
          </div>
          {!compact && <div className="mt-2 text-center">{tile.name}</div>}
        </div>
      </Link>
    ))}
  </div>
)

const DesktopLayout = ({ contentKey }: DesktopLayoutProps) => {
  const location = useLocation()
  const pageTitle = pageMetadata.find(
    page => page.path === location.pathname
  )?.title
  const context: OutletContextType = {
    isMobile: false
  }
  const collapsed = location.pathname !== '/'
  const onNotificationView = location.pathname === '/notifications'

  return (
    <div className="text-white">
      <div
        className={clsx(
          'min-h-screen overflow-hidden p-4 lg:p-0 lg:pb-24',
          'bg-black text-white'
        )}
      >
        <div
          key={location.pathname}
          className="route-transition"
          data-testid="route-content"
        >
          <div key={contentKey ?? 0} data-testid="refreshed-route-content">
            {pageTitle && collapsed && (
              <div className="my-6 text-3xl font-bold lg:pl-5">{pageTitle}</div>
            )}
            <Outlet context={context} />
          </div>
        </div>
      </div>
      <div
        data-testid="desktop-navigation-panel"
        className={clsx(
          'fixed bottom-0 z-20 h-56 w-full transform-gpu border-t-2 border-blue-600 bg-gray-900 transition-transform duration-300 ease-out motion-reduce:transition-none',
          collapsed ? 'translate-y-36' : 'translate-y-0'
        )}
      >
        <nav
          aria-label="Expanded section navigation"
          aria-hidden={collapsed}
          data-testid="desktop-navigation-expanded"
          className={clsx(
            'absolute inset-0 transition-opacity duration-200 ease-out motion-reduce:transition-none',
            collapsed ? 'pointer-events-none opacity-0' : 'opacity-100'
          )}
        >
          <SectionLinks currentPath={location.pathname} hidden={collapsed} />
        </nav>
        <nav
          aria-label="Compact section navigation"
          aria-hidden={!collapsed}
          data-testid="desktop-navigation-compact"
          className={clsx(
            'absolute inset-x-0 top-0 h-20 transition-opacity duration-200 ease-out motion-reduce:transition-none',
            collapsed ? 'opacity-100' : 'pointer-events-none opacity-0'
          )}
        >
          <div
            className="absolute inset-y-0 left-5 flex items-center text-gray-300"
            data-testid="back-button"
          >
            <Link
              to="/"
              aria-label="Back to dashboard"
              tabIndex={collapsed ? undefined : -1}
              className="press-feedback flex h-12 w-12 items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ArrowBackOutlinedIcon className="!text-4xl" />
            </Link>
          </div>
          <SectionLinks
            compact
            currentPath={location.pathname}
            hidden={!collapsed}
          />
          {!onNotificationView && (
            <div
              className="absolute inset-y-0 right-5 flex items-center text-gray-300"
              data-testid="notification-button"
            >
              <Link
                to="/notifications"
                aria-label="Notifications"
                tabIndex={collapsed ? undefined : -1}
                className="press-feedback relative flex h-12 w-12 items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <NotificationDot />
                <NotificationsNoneOutlinedIcon className="!text-4xl" />
              </Link>
            </div>
          )}
        </nav>
      </div>
    </div>
  )
}

export default DesktopLayout
