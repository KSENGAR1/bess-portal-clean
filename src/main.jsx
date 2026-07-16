import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CurrencyProvider } from './context/CurrencyContext.jsx'
import { NotificationProvider } from './context/NotificationStore.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <CurrencyProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </CurrencyProvider>
    </LanguageProvider>
  </React.StrictMode>,
)
