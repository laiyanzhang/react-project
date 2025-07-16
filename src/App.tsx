import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './router/index';
import './App.css'
import { MessageContext } from '@contexts/MessageContext';

if (import.meta.env.DEV) {
  import('./api/mock')
}

const router = createBrowserRouter(routes)

const App = () => {
  const [messageApi, contextHolder] = message.useMessage()
  return (  
    <MessageContext value={messageApi}>
      {contextHolder}
      <RouterProvider router={router} />
    </MessageContext>
  )
}

export default App
