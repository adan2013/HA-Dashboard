import { render } from '@testing-library/react'
import { ReactElement } from 'react'
import { HomeAssistantEntityData } from '../api/hooks'
import { modalContext, ModalContextType } from '../contexts/ModalContext'
import { ModalParams, ModalType } from '../contexts/modalUtils'

export const holdTest = (ms: number) =>
  new Promise(r => {
    setTimeout(r, ms)
  })

export const defineWindowWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: width,
    writable: true
  })
}

export const generateEntityHistory = (values: number[]) => [
  values.map(value => ({
    entity_id: 'entityId',
    state: value.toString(),
    attributes: {},
    last_changed: '2023-09-04T14:09:44.397128+00:00',
    last_updated: '2023-09-04T14:09:44.397128+00:00'
  }))
]

export const getMockedEntityState = (
  name: string,
  state: string,
  attributes: object = {}
): HomeAssistantEntityData => ({
  entityState: {
    id: `${name}_id`,
    state,
    lastChanged: '1234',
    lastUpdated: '5678',
    attributes: {
      friendly_name: name,
      ...attributes
    }
  },
  isUnavailable: false
})

export const renderModalBody = (
  bodyComponent: ReactElement,
  modalType: ModalType,
  params?: ModalParams
) => {
  const openModalMock = jest.fn()
  const closeModalMock = jest.fn()
  const contextState: ModalContextType = {
    state: {
      isOpen: true,
      modalType,
      params
    },
    openModal: openModalMock,
    closeModal: closeModalMock
  }
  const renderMethod = render(
    <modalContext.Provider value={contextState}>
      {bodyComponent}
    </modalContext.Provider>
  )
  return {
    renderMethod,
    openModalMock,
    closeModalMock
  }
}
