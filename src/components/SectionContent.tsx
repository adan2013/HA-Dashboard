import { ReactNode } from 'react'

type SectionContentProps = {
  children: ReactNode
}

const SectionContent = ({ children }: SectionContentProps) => (
  <div className="flex flex-col gap-12 lg:h-[calc(100vh-12rem)] lg:flex-row lg:overflow-y-hidden lg:overflow-x-scroll lg:px-5">
    {children}
  </div>
)

export default SectionContent
