import React from 'react';
import { BrowserRouter, Routes } from 'react-router-dom';
import routes from './routes';
import { globalContext, GlobalContext } from './globalContext';
import { useSetState } from 'ahooks';
import { getCurrentUserInfo } from './api/user';

export type AppProps = {};

const App: React.FC<AppProps> = () => {
  const { Provider } = globalContext;
  const [value, setState] = useSetState<GlobalContext>({} as GlobalContext);
  const dispatch: GlobalContext['dispatch'] = (path, value) => {
    setState((prev) => ({
      ...prev,
      [path]: value,
    }));
  };
  const loadUserInfo: GlobalContext['loadUserInfo'] = async () => {
    const user = await getCurrentUserInfo();
    setState({ user });
    return user;
  };

  return (
    <Provider value={{ loadUserInfo, dispatch, ...value }}>
      <BrowserRouter>
        <Routes>{routes}</Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
