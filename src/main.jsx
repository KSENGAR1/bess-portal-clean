import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CurrencyProvider } from './context/CurrencyContext.jsx'
import { NotificationProvider } from './context/NotificationStore.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CurrencyProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </CurrencyProvider>
  </React.StrictMode>,
)
