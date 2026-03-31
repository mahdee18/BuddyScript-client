import { createBrowserRouter } from 'react-router-dom';

// Pages
import Login from '../pages/Login/Login.jsx';
import Register from '../pages/Register/Register.jsx';
import Feed from '../pages/Feed/Feed.jsx';

// Protected Route
import ProtectedRoute from './ProtectedRoute.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login/>,
  },
  {
    path: '/login',
    element: <Login/>,
  },
  {
    path: '/register',
    element: <Register/>,
  },
  // {
  //   path: '/feed',
  //   element: <Feed/>,
  // },
  {
    path: '/feed',
    element: (
      <ProtectedRoute>
        <Feed/>
      </ProtectedRoute>
    ),
  },
]);

export default router;