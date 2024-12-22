import { createHashRouter, RouterProvider, RouteObject } from 'react-router';
import Layout from '../components/Layout';
import ErrorBoundary from '../components/ErrorBoundary';
import Login from '../pages/Login';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
    ],
  },
];
const router = createHashRouter(routes);

export default function MyRouterProvider() {
  return <RouterProvider router={router}></RouterProvider>;
}
