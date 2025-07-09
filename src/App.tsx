import { BrowserRouter, useRoutes } from 'react-router-dom';
import { Suspense } from 'react';
import routes from './router/index';
import './App.css'
import { MessageContext } from '@context/MessageContext';

if (import.meta.env.DEV) {
  import('./api/mock')
}

const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
}

const App = () => {
  const [messageApi, contextHolder] = message.useMessage()
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <MessageContext value={messageApi}>
          {contextHolder}
          <AppRoutes />
        </MessageContext>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
