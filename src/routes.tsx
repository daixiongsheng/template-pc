import React, { Suspense } from 'react';
import { Navigate, Outlet, Route } from 'react-router-dom';

export const LoadingComponent = () => {
  return <div>loading</div>;
};

function load(component): React.FC {
  const OtherComponent = React.lazy(component);

  return () => (
    <Suspense fallback={<LoadingComponent />}>
      <OtherComponent />
    </Suspense>
  );
}

export type RouteInfo = {
  path: string;
  component: React.FC;
  meta?: any;
  children?: RouteInfo[];
};

const adminRoutes: RouteInfo[] = [
  {
    path: 'dashboard',
    component: load(() => import('./pages/dashboard')),
    meta: {
      title: '看板',
    },
    children: [
      {
        path: 'dashboard',
        component: load(() => import('./pages/dashboard')),
        meta: {
          title: '看板',
        },
        children: [],
      },
    ],
  },
];

const routes: RouteInfo[] = [
  {
    path: '*',
    component: () => <Navigate to="/" />,
  },
  {
    path: '/',
    component: load(() => import('./pages/home')),
  },
  {
    path: '/admin',
    component: () => <Navigate to="/admin/dashboard" />,
  },
  {
    path: '/admin',
    component: load(() => import('./components/Dashboard')),
    children: adminRoutes,
  },
  {
    path: '/login',
    component: load(() => import('./pages/login')),
  },
  {
    path: 'about',
    component: load(() => import('./pages/about')),
  },
];

export function renderRoutes(children: RouteInfo[] = []): React.ReactNode {
  return children.map((route) => {
    if (Array.isArray(route.children) && route.children.length > 0) {
      return (
        <Route key={route.path} path={route.path} element={<route.component />}>
          {renderRoutes(route.children)}
        </Route>
      );
    }
    return (
      <Route key={route.path} path={route.path} element={<route.component />} />
    );
  });
}

export default renderRoutes(routes);
