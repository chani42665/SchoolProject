import './App.css'
import 'primereact/resources/themes/saga-orange/theme.css'; // או כל נושא אחר
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './tailwind.css'
import './index.css'
import { Route, Routes } from 'react-router-dom'
import React, { lazy, Suspense, useEffect } from 'react';
import AppBar from './components/appBar';
import { useDispatch } from 'react-redux';
import { setUser } from './store/UserSlice';



const LazyMenu = lazy(() => import('./components/menu'))
const LazyLogin = lazy(() => import('./components/login'));
const LazyStudents = lazy(() => import('./components/students')); // טעינה עצלנית של הסטודנטים
const LazyTeachers = lazy(() => import('./components/teachers')); // טעינה עצלנית של הסטודנטים
const LazyGradeSheet = lazy(() => import('./components/gradeSheet')); // טעינה עצלנית של הסטודנטים
const LazyClasses = lazy(() => import('./components/classes'));

function App() {

  const dispatch = useDispatch();
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      dispatch(setUser(JSON.parse(savedUser)));
    }
  }, []);

  return (
    <>
      <AppBar />
      <Routes>
        <Route path="/" element={<Suspense fallback={"loading..."}><LazyLogin /></Suspense>} />        
        <Route path="/menu" element={<Suspense fallback={"loading..."}><LazyMenu /></Suspense>}/>
        <Route path="students" element={<Suspense fallback={"loading..."}><LazyStudents /></Suspense>} />
        <Route path="teachers" element={<Suspense fallback={"loading..."}><LazyTeachers /></Suspense>} />
        <Route path="gradeSheet/:studentId" element={<Suspense fallback={"loading..."}><LazyGradeSheet /></Suspense>} />
        <Route path="classes" element={<Suspense fallback={"loading..."}><LazyClasses /></Suspense>} />
      </Routes>
    </>
  );
}

export default App;

