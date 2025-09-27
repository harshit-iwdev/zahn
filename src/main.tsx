import './config/env'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import ReduxProvider from './redux/reduxProvider'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './redux/store'
import '../styles/globals.css'
import { ToastContainer } from 'react-toastify'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ReduxProvider store={store}>
        <PersistGate  loading={null} persistor={persistor}>
          <App />
          <ToastContainer />
        </PersistGate>
      </ReduxProvider>
    </BrowserRouter>
  </React.StrictMode>
)
