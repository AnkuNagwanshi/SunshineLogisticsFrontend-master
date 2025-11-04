import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext.tsx'
import { Provider } from 'react-redux'
import store from "./redux/store/store.ts";

import App from './App.tsx'
import './index.css'
// import { OrderProvider } from './context/OrderContext.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter> {/* Add this wrapper */}
        <AuthProvider>
          {/* <OrderProvider> */}

          <App />

          {/* </OrderProvider> */}
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
