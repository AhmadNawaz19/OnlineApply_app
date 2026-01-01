import React from 'react'
import './style.css'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../../Firebase/Firebase'
import { useForm } from 'react-hook-form'

const Admin = () => {

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  const login = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (err) {
      console.log(err)
    }
  }

  const logout = async () => {
    await signOut(auth);
  }

  return (
    <div className='adminMain'>
      <div className='adminform'>
        <form onSubmit={handleSubmit((data) => login(data))}>
          <input
            id='email'
            type="email"
            placeholder='Email'
            {...register('email', { required: 'the email is required' })}
          />
          <label htmlFor="email" style={{ color: 'red' }}>{errors.email?.message}</label>
          <input
            id='password'
            type="password"
            placeholder='Password'
            {...register('password', {
              required: "the password is required",
              validate: (value) => value.length === 13 && value.includes('.') || 'enter valid password'
            })}
          /> {errors.password?.message && (<label style={{ color: 'red' }} htmlFor="password">{errors.password?.message}</label>)}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner" /> Loading...
              </>
            ) : (
              "Submit"
            )}
          </button>
          <button onClick={() => logout()}>logout</button>
        </form>
      </div>
    </div>
  )
}

export default Admin