const LOCAL_STORAGE_KEY = 'customizationConfig'

export type CustomizationConfig = {
  theme: number
  background: number
  sound: boolean
}

export const defaultSettings: CustomizationConfig = {
  theme: 1,
  background: 1,
  sound: false
}

export const readCustomizationConfig = (): CustomizationConfig => {
  const customizationConfig = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (customizationConfig) {
    return JSON.parse(customizationConfig)
  }
  return defaultSettings
}

export const saveCustomizationConfig = (config: CustomizationConfig) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config))
}
