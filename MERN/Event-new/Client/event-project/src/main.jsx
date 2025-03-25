import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import SearchProvider from './context/SearchContext.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <SearchProvider>
    <App />
    <ToastContainer autoClose={2000} closeOnClick/>
    </SearchProvider>
  </StrictMode>,
)
