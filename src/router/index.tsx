// src/routes/index.js
import { lazy } from 'react';
import { loaderGenderOptions } from './loader';

const Home = lazy(() => import('@views/home/index'));
const Demo = lazy(() => import('@views/demo/index'));
const List = lazy(() => import('@views/list/index'));
const Ref = lazy(() => import('@views/ref/index'));
const Default = lazy(() => import('@views/Default'))
const ErrorPage = lazy(() => import('@views/ErrorPage'))

const routes = [
  {
    path: '/',
    element: <Home />,
    name: 'Home',
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Default />,
      },
      {
        path: 'demo/*',
        element: <Demo />,
        name: '表格',
        icon: <MailOutlined />,
        loader: loaderGenderOptions
      },
      {
        path: 'list',
        element: <List />,
        icon: <MailOutlined />,
        name: '列表'
      },
      {
        path: 'ref',
        element: <Ref />,
        icon: <MailOutlined />,
        name: 'Ref'
      }
    ]
  },
];

export default routes;