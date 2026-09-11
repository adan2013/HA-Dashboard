import { ReactElement, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

type ModalBodyProps = {
  children: ReactElement | ReactElement[]
}

type ModalTitleProps = {
  children: string
}

type FooterProps = {
  children: ReactElement | ReactElement[]
}

type ButtonProps = {
  name: string
  icon: ReactElement
  onClick: () => void
  isDanger?: boolean
  isDisabled?: boolean
}

export const ModalBody = ({ children }: ModalBodyProps) => (
  <div className="w-full bg-gray-800 pb-16 text-white">{children}</div>
)

export const ModalTitle = ({ children }: ModalTitleProps) => (
  <div className="py-6 text-center text-xl font-bold">{children}</div>
)

export const ModalFooter = ({ children }: FooterProps) => (
  <div className="absolute bottom-0 left-0 right-0 flex flex-row">
    {children}
  </div>
)

export const ModalButton = ({
  name,
  icon,
  onClick,
  isDanger,
  isDisabled
}: ButtonProps) => {
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onResize = () => {
      setIsMobile(buttonRef.current?.offsetWidth < 250)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <button
      type="button"
      ref={buttonRef}
      disabled={isDisabled}
      className={clsx(
        'flex-center min-h-14 flex-1 border-r-2 border-t-2 border-gray-600 bg-gray-800 py-4 transition-colors last:border-r-0',
        isDanger && 'bg-red-900 hover:bg-red-700',
        isDisabled
          ? 'cursor-not-allowed text-gray-600'
          : 'press-feedback hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white'
      )}
      onClick={onClick}
      data-testid={`modal-button-${name}`}
    >
      {isMobile ? icon : name}
    </button>
  )
}
