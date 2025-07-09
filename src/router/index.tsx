// src/routes/index.js
import { lazy } from 'react';

const Home = lazy(() => import('../views/home/index'));
const Demo = lazy(() => import('../views/demo/index'));
const Test = lazy(() => import('../views/test/index'));

const routes = [
  {
    path: '/',
    element: <Home />,
    name: 'Home',
    children: [
      {
        path: 'demo',
        element: <Demo />,
        name: 'Demo'
      },
      {
        path: 'test',
        element: <Test />,
        name: 'Test'
      },
    ]
  },
];

export default routes;