import './App.css'
import './index.css'
import { Route, Routes } from 'react-router-dom'
import React, { Suspense } from 'react';
import AppBar from './components/appBar';
import Students from './components/students';

const LazyMenu= React.lazy(() => import('./components/menu'))
const LazyLogin= React.lazy(() => import('./components/login'))

function App() {

  return (
    <>
    <AppBar/>
    <Students/>
    <Routes>
      <Route path='/' element={<Suspense fallback={"loading.."}><LazyLogin /></Suspense>} />  
      <Route path='/menu' element={<Suspense fallback={"loading.."}><LazyMenu /></Suspense>} />  
    </Routes>
    </>
  )
}

export default App
