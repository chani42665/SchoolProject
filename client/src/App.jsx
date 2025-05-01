import './App.css'
import 'primereact/resources/themes/saga-orange/theme.css'; // או כל נושא אחר
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './tailwind.css'
import './index.css'
import { Route, Routes } from 'react-router-dom'
import React, { Suspense } from 'react';
import AppBar from './components/appBar';
// import Students from './components/students';



const LazyMenu = React.lazy(() => import('./components/menu'))
const LazyLogin = React.lazy(() => import('./components/login'));
const LazyStudents = React.lazy(() => import('./components/students')); // טעינה עצלנית של הסטודנטים
const LazyTeachers = React.lazy(() => import('./components/teachers')); // טעינה עצלנית של הסטודנטים
const LazyGradeSheet = React.lazy(() => import('./components/gradeSheet')); // טעינה עצלנית של הסטודנטים

function App() {
  return (
    <>
      <AppBar />
      <Routes>
        {/* דף הלוגין */}
        <Route path="/" element={<Suspense fallback={"loading..."}><LazyLogin /></Suspense>} />
        
        {/* דף המניו */}
        <Route path="/menu" element={<Suspense fallback={"loading..."}><LazyMenu /></Suspense>}/>
          {/* דף הסטודנטים תחת המניו */}
          <Route path="students" element={<Suspense fallback={"loading..."}><LazyStudents /></Suspense>} />
          <Route path="gradeSheet/:student" element={<Suspense fallback={"loading..."}><LazyGradeSheet /></Suspense>} />

      </Routes>
    </>
  );
}

export default App;

