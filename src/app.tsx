import React, { useEffect } from 'react'
import { useLocation, useRoutes } from 'react-router-dom'
import routes from './routes'
import { globalContext, GlobalContext } from './globalContext'
import { useSetState, useTitle } from 'ahooks'
import { getCurrentUserInfo } from './api/user'
import { useTranslation } from 'react-i18next'
import { t } from 'i18next'

const App: React.FC = () => {
  const { Provider } = globalContext
  const { i18n } = useTranslation()
  const [value, setState] = useSetState<GlobalContext>({
    lng: 'zh_CN',
  } as GlobalContext)
  const dispatch: GlobalContext['dispatch'] = (path, value) => {
    setState((prev) => ({
      ...prev,
      [path]: value,
    }))
  }
  const loadUserInfo: GlobalContext['loadUserInfo'] = async () => {
    const user = await getCurrentUserInfo()
    if (user) {
      setState({ user })
    }
    return user
  }
  const changeLanguage: GlobalContext['changeLanguage'] = (lng) => {
    i18n.changeLanguage(lng)
    setState({
      lng,
    })
  }

  useEffect(() => {
    const fn = (lng: Parameters<GlobalContext['changeLanguage']>[0]) => {
      setState({
        lng,
      })
    }
    i18n.on('languageChanged', fn)
    return () => i18n.off('languageChanged', fn)
  }, [setState])
  const l = useLocation()
  useTitle(t(l.pathname.split('/').filter(Boolean).join('_'), { ns: 'menu' }))
  const route = useRoutes(routes, l.pathname)
  return (
    <Provider value={{ changeLanguage, loadUserInfo, dispatch, ...value }}>
      {route}
    </Provider>
  )
}

export default App
