import React, { Suspense } from 'react'
import { Navigate, RouteObject } from 'react-router-dom'

import Loading from './components/Loading'

function load(component): React.ReactElement {
  const OtherComponent = React.lazy(component)
  const Node = () => (
    <Suspense fallback={<Loading />}>
      <OtherComponent />
    </Suspense>
  )
  return React.createElement(Node)
}

export const adminRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    element: load(() => import('./pages/dashboard')),
    children: [
      {
        path: 'all',
        element: load(() => import('./pages/dashboard')),
        children: [],
      },
    ],
  },
  {
    path: 'statute',
    children: [
      {
        path: 'statute_add',
        element: load(() => import('./pages/statute_add')),
        children: [],
      },
    ],
  },
  {
    path: 'clause',
    children: [
      {
        path: 'clause_add',
        element: load(() => import('./pages/clause_add')),
        children: [],
      },
    ],
  },
]

export const routes: RouteObject[] = [
  {
    path: '*',
    element: <Navigate to="/" />,
  },
  {
    path: '/',
    element: load(() => import('./pages/home')),
  },
  {
    path: '/admin',
    element: <Navigate to="/admin/dashboard" />,
  },
  {
    path: '/admin',
    element: load(() => import('./components/Dashboard')),
    children: adminRoutes,
  },
  {
    path: '/login',
    element: load(() => import('./pages/login')),
  },
  {
    path: '/about',
    element: load(() => import('./pages/about')),
  },
]

export default routes
