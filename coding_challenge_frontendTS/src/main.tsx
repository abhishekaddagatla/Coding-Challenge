import ReactDOM from 'react-dom/client'
import App from './routes/App.tsx'
import Login from './routes/Login.tsx'
import { SessionProvider } from './SessionContext.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  { path: '/main', element: <App /> },
  { path: '/', element: <Login /> },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(

  <SessionProvider>
    <RouterProvider router={router} />
  </SessionProvider>

  ,
)
