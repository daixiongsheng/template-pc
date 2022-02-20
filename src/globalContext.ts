import { resources } from './i18n'
import { createContext } from 'react'
import { UserInfo } from './typings/global'

export type GlobalContext = {
  user: UserInfo
  lng: keyof typeof resources
  dispatch: <P extends keyof GlobalContext>(
    path: P,
    value: GlobalContext[P]
  ) => void
  loadUserInfo: () => Promise<UserInfo>
  changeLanguage: (v: keyof typeof resources) => void
}

export const globalContext = createContext<GlobalContext>({} as GlobalContext)
