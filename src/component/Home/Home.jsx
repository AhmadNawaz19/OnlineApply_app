import React from 'react'
import './style.css'

const Home = () => {
  return (
    <div className='HomeMain'>

      {/* from here is the welcom message container */}
      <div className='welcomMsg'>
        <div className='msg'>
          <h1>Welcom to Nawaz</h1>
          <h2>Technical</h2>
          <p>
            Nawaz Technical is a learning platform that provides free courses for students and beginners.
            The main goal of Nawaz Technical is to make quality education accessible to everyone.
            It offers free courses in Python and web development.
            The courses are designed with simple explanations and practical examples.
            Students can learn step by step without any prior experience.
            Nawaz Technical focuses on skill-based learning and real projects.
            It helps learners build a strong foundation in programming.
            The platform supports students in growing their technical confidence.
            Nawaz Technical aims to prepare learners for real-world opportunities in the tech field.

          </p>
        </div>
      </div>

    </div>
  )
}

export default Home