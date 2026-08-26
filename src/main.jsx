import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Router, Route } from 'react-router-dom'
import Course from './component/Course/Course.jsx'
import About from './component/About/AboutUs.jsx'
import Layout from './component/Layout/Layout.jsx'
import Apply from './component/Apply/Apply.jsx'
import Admin from './component/Admin/Admin.jsx'
import Users from './component/Users/Users.jsx'
import CourseControl from './component/CourseManager/course_manager.jsx'
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <HelmetProvider>
        <Routes>
          <Route element={<Layout/>}>
            <Route path='/' element={<App />}></Route>
            <Route path='/aboutUs' element={<About />}></Route>
            <Route path='/course' element={<Course />}></Route>
            <Route path='/apply' element={<Apply />}></Route>
            <Route path='/applications' element={<Users />}></Route>
            <Route path='/login' element={<Admin />}></Route>
            <Route path='/course_manager' element={<CourseControl />}></Route>
          </Route>
        </Routes>
      </HelmetProvider>
    </StrictMode>,
  </BrowserRouter>
)
