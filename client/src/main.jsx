import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './tailwind.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import userSlice from './store/UserSlice.jsx'
import { Provider } from 'react-redux'
import 'primereact/resources/themes/saga-orange/theme.css'; // או כל נושא אחר
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


const myStore = configureStore({
  reducer:{
    userSlice
  }})


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Provider store={myStore}>
    <App />
  </Provider>
  </BrowserRouter>
)
