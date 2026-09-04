import clsx from 'clsx'
import { useLocation, Link, Outlet } from 'react-router-dom'
import { mobileMenu, pageMetadata } from './menus'
import { OutletContextType } from '../contexts/OutletContext'
import NotificationDot from '../components/layout/NotificationDot'

const isIOS = () => {
  if (typeof navigator === 'undefined') return false

  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

type MobileLayoutProps = {
  contentKey?: number
}

const MobileLayout = ({ contentKey }: MobileLayoutProps) => {
  const location = useLocation()
  const pageTitle = pageMetadata.find(
    page => page.path === location.pathname
  )?.title
  const context: OutletContextType = {
    isMobile: true
  }
  const anythingIsSelected = mobileMenu.some(
    ({ path }) => path === location.pathname
  )
  const shouldUseGlassEffect = isIOS()

  return (
    <div className="text-white">
      <div
        className={clsx(
          'pb-mobile-navigation min-h-screen overflow-x-hidden p-4',
          'bg-black text-white'
        )}
      >
        {pageTitle && (
          <div className="my-4 text-3xl font-bold">{pageTitle}</div>
        )}
        <Outlet key={contentKey} context={context} />
      </div>
      <nav
        aria-label="Mobile navigation"
        data-testid="mobile-navigation"
        className={clsx(
          'floating-navigation-offset mobile-navigation fixed z-20 rounded-2xl border shadow-2xl',
          shouldUseGlassEffect
            ? 'mobile-navigation-glass rounded-full p-1.5'
            : 'p-1'
        )}
      >
        <div
          className={clsx(
            'flex flex-row',
            shouldUseGlassEffect ? 'h-12' : 'h-16'
          )}
        >
          {mobileMenu.map(({ name, path, icon, notificationDot }) => {
            const isHighlighted =
              location.pathname === path ||
              (path === '/' && !anythingIsSelected)
            return (
              <div
                key={name}
                className={clsx(
                  'h-full w-1/4 transition-colors duration-300',
                  shouldUseGlassEffect ? 'rounded-full' : 'rounded-xl p-1',
                  isHighlighted && 'bg-blue-800 shadow-sm'
                )}
                data-testid={`section-${name}${
                  isHighlighted ? '-highlighted' : ''
                }`}
              >
                <Link to={path} className="block h-full">
                  <div
                    className={clsx(
                      'flex h-full cursor-pointer flex-col items-center justify-center',
                      shouldUseGlassEffect ? 'rounded-full' : 'rounded-lg'
                    )}
                  >
                    <div className="relative px-1">
                      {notificationDot && <NotificationDot />}
                      {icon}
                    </div>
                    <div
                      className={clsx(
                        'pt-2 text-xs',
                        shouldUseGlassEffect && 'sr-only'
                      )}
                    >
                      {name}
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export default MobileLayout
