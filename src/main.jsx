import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

import { AppKitProvider } from './config/reown.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppKitProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppKitProvider>
  </React.StrictMode>,
)
