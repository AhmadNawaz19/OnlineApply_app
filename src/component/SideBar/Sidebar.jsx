import React, { useEffect, useState } from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import { auth } from '../../Firebase/Firebase'
import { onAuthStateChanged } from 'firebase/auth'

const Sidebar = () => {

  const [admin, setAdmin] = useState(false)
  const [menuToggle, setMenuToggle] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if(user){
        setAdmin(true)
      }else{
        setAdmin(false)
      }
    })
  }, [admin])

  return (
      <div className='service'>
        <img src="logo.png" alt="" />
        <Link className='serviceBtn' to='/'><i class="fa-solid fa-house"></i><span>HOME</span></Link>
        <Link className='serviceBtn' to='/course'><i class="fa-solid fa-book"></i><span>COURSE</span></Link>
        <Link className='serviceBtn' to='/aboutUs'><i class="fa-solid fa-circle-info"></i><span>ABOUT US</span></Link>
        {auth.currentUser ? <Link className='serviceBtn hideServiceBtn' to='/applications'><i class="fa-solid fa-user-graduate"></i><span>APPLICATIONS</span></Link> : null}
        {auth.currentUser?.email === 'nawaztechnical@gmail.com' && (
          <Link className="serviceBtn hideServiceBtn" to="/course_manager">
            <i class="fa-solid fa-gear"></i><span>COURSE SETTING</span>
          </Link>
        )}
        {auth.currentUser && (
          <i class="fa-solid fa-bars" onClick={() => setMenuToggle(prev => !prev)}></i>
        )}
        {auth.currentUser && menuToggle && (
          <div className="menu">
             {auth.currentUser ? <Link className='serviceBtn hideServiceBtn' to='/applications'><span>APPLICATIONS</span></Link> : null}

             {auth.currentUser?.email === 'nawaztechnical@gmail.com' && (
                <Link className="serviceBtn hideServiceBtn" to="/course_manager">
                  <span>COURSE SETTING</span>
                </Link>
              )}

              {auth.currentUser && (
                <Link className="serviceBtn hideServiceBtn" to="/login">
                  <span>LOGIN</span>
                </Link>
              )}
         </div>
        )}
        {auth.currentUser && (
          <Link className="serviceBtn hideServiceBtn loginBtn" to="/login">
            <i class="fa-solid fa-user-plus"></i><span>LOGIN</span>
          </Link>
        )}

         
      </div>
  )
}

export default Sidebar