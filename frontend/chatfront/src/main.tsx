
import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import {  AuthContextProvider} from "./context/AuthContext"

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> 
    <AuthContextProvider> 
    <App />
    </AuthContextProvider>
  
    </BrowserRouter>

  </React.StrictMode>,
)
