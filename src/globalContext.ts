import { createContext } from 'react';
import { User } from './typings/global';

export type GlobalContext = {
  user: User;
  dispatch<P extends keyof GlobalContext>(
    path: P,
    value: GlobalContext[P],
  ): void;
  loadUserInfo: () => Promise<User>;
};

export const globalContext = createContext<GlobalContext>(
  null as GlobalContext,
);
