import clsx from 'clsx'
import { createPortal } from 'react-dom'
import isIOS from '../../utils/platform'

export type RemoteCategory = {
  id: string
  label: string
}

type RemoteCategorySwitcherProps = {
  categories: RemoteCategory[]
  selectedId: string
  onSelect: (id: string) => void
}

const RemoteCategorySwitcher = ({
  categories,
  selectedId,
  onSelect
}: RemoteCategorySwitcherProps) => {
  const shouldUseGlassEffect = isIOS()

  // The route transition transforms the page content, which would turn
  // `position: fixed` into positioning relative to the animated container.
  const switcher = createPortal(
    <div
      className={clsx(
        'mobile-layout text-white',
        shouldUseGlassEffect ? 'mobile-layout-ios' : 'mobile-layout-android'
      )}
    >
      <nav
        aria-label="Remote control categories"
        data-testid="remote-category-switcher"
        className={clsx(
          'floating-category-switcher-offset mobile-navigation category-switcher-shadow fixed z-20 border',
          shouldUseGlassEffect
            ? 'mobile-navigation-glass rounded-full p-1'
            : 'rounded-2xl p-1'
        )}
      >
        <div className="flex flex-row">
          {categories.map(({ id, label }) => {
            const isSelected = id === selectedId
            return (
              <button
                key={id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(id)}
                className={clsx(
                  'press-feedback flex-1 touch-manipulation select-none text-sm transition-colors duration-300',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
                  shouldUseGlassEffect ? 'h-9 rounded-full' : 'h-10 rounded-xl',
                  isSelected
                    ? 'bg-blue-800 font-bold shadow-sm'
                    : 'text-gray-300'
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
      </nav>
    </div>,
    document.body
  )

  return (
    <>
      <div aria-hidden="true" className="h-14" />
      {switcher}
    </>
  )
}

export default RemoteCategorySwitcher
