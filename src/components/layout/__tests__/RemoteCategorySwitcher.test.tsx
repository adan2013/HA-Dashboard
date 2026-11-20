import { fireEvent, render, screen } from '@testing-library/react'
import RemoteCategorySwitcher from '../RemoteCategorySwitcher'

const categories = [
  { id: 'a', label: 'Alpha' },
  { id: 'b', label: 'Beta' }
]

describe('RemoteCategorySwitcher', () => {
  it('should mark the selected category and report selection', () => {
    const onSelect = jest.fn()
    render(
      <RemoteCategorySwitcher
        categories={categories}
        selectedId="a"
        onSelect={onSelect}
      />
    )
    expect(screen.getByRole('button', { name: 'Alpha' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByRole('button', { name: 'Beta' })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
    fireEvent.click(screen.getByRole('button', { name: 'Beta' }))
    expect(onSelect).toHaveBeenCalledWith('b')
  })

  it('should render outside the animated page content', () => {
    const { container } = render(
      <RemoteCategorySwitcher
        categories={categories}
        selectedId="a"
        onSelect={jest.fn()}
      />
    )
    const switcher = screen.getByTestId('remote-category-switcher')
    expect(container).not.toContainElement(switcher)
    expect(switcher).toHaveClass('floating-category-switcher-offset', 'fixed')
  })

  it('should use the Android navigation style by default', () => {
    render(
      <RemoteCategorySwitcher
        categories={categories}
        selectedId="a"
        onSelect={jest.fn()}
      />
    )
    const switcher = screen.getByTestId('remote-category-switcher')
    expect(switcher).toHaveClass('rounded-2xl')
    expect(switcher).not.toHaveClass('mobile-navigation-glass')
    expect(switcher.parentElement).toHaveClass('mobile-layout-android')
  })

  it('should use the glass style on iOS', () => {
    const descriptor = Object.getOwnPropertyDescriptor(navigator, 'userAgent')
    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      value: 'iPhone'
    })
    try {
      render(
        <RemoteCategorySwitcher
          categories={categories}
          selectedId="a"
          onSelect={jest.fn()}
        />
      )
      const switcher = screen.getByTestId('remote-category-switcher')
      expect(switcher).toHaveClass('mobile-navigation-glass', 'rounded-full')
      expect(switcher.parentElement).toHaveClass('mobile-layout-ios')
    } finally {
      if (descriptor) {
        Object.defineProperty(navigator, 'userAgent', descriptor)
      } else {
        delete (navigator as { userAgent?: string }).userAgent
      }
    }
  })
})
