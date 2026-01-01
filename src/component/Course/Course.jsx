import React from 'react'
import './style.css'
import { Link } from 'react-router-dom'

const Course = () => {
  return (
    <div className='courseMain'>
      <div className='course'>
        <div className='img'><img src="py.webp" alt="" /></div>
        <div className='detail'>
          <h3>Details</h3>
          <p>in this course we will learn advance python. such as procedural, functional, and object oriented programming.
            the course duration 2 months.
          </p>
        </div>
        <Link id='coursebtn' to={'/apply'}>Apply Now</Link>
      </div>

      <div className='course'>
        <div className='img'> <img src="wb.jpeg" alt="" /></div>
        <div className='detail'>
          <h3>Details</h3>
          <p>
            in this course we will learn from basic to advance web development. such HTML, CSS and JavaScript.
            the course duration also three months.
          </p>
        </div>
        <Link id='coursebtn'>Comoing soon</Link>
      </div>
    </div>
  )
}

export default Course