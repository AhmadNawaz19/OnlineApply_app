import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../SideBar/Sidebar'
import './style.css'

const Layout = () => {
    return (
        <div className='leyoutMain'>
            <Sidebar />
            <div className='Outlet'>
                <Outlet />
            </div>
        </div>
    )
}

export default Layout
