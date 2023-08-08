import { ReactElement } from 'react'
import clsx from 'clsx'

type ModalBodyProps = {
  children: ReactElement | ReactElement[]
}

type ModalTitleProps = {
  children: string
}

type FooterProps = {
  children: ReactElement[]
}

type ButtonProps = {
  name: string
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
  onClick,
  isDanger,
  isDisabled
}: ButtonProps) => (
  <div
    className={clsx(
      'flex-center flex-1 border-r-2 border-t-2 border-gray-600 bg-gray-800 py-4 transition-colors last:border-r-0',
      isDanger && 'bg-red-900 hover:bg-red-700',
      isDisabled ? 'text-gray-600' : 'cursor-pointer hover:bg-gray-600'
    )}
    onClick={isDisabled ? undefined : onClick}
  >
    {name}
  </div>
)
