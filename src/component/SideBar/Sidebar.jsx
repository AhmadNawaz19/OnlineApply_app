import React, { useEffect, useState } from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import { auth } from '../../Firebase/Firebase'
import { onAuthStateChanged } from 'firebase/auth'

const Sidebar = () => {

  const [admin, setAdmin] = useState(false)

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
        <Link className='serviceBtn' to='/'>Home</Link>
        <Link className='serviceBtn' to='/aboutUs'>About Us</Link>
        <Link className='serviceBtn' to='/course'>Course</Link>
        {auth.currentUser ? <Link className='serviceBtn' to='/users'>Users</Link> : null}
      </div>
  )
}

export default Sidebar