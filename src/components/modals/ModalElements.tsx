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
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onResize = () => {
      setIsMobile(divRef.current?.offsetWidth < 250)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [divRef])

  return (
    <div
      ref={divRef}
      className={clsx(
        'flex-center flex-1 border-r-2 border-t-2 border-gray-600 bg-gray-800 py-4 transition-colors last:border-r-0',
        isDanger && 'bg-red-900 hover:bg-red-700',
        isDisabled ? 'text-gray-600' : 'cursor-pointer hover:bg-gray-600'
      )}
      onClick={isDisabled ? undefined : onClick}
      data-testid={`modal-button-${name}`}
    >
      {isMobile ? icon : name}
    </div>
  )
}
