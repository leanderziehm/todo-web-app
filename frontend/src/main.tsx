import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './AppRoutes.tsx'
import './index.css'
import NavBar from './components/NavBar.tsx'



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <NavBar/>
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>
)
