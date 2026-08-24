import React, { useState, useEffect } from 'react'
import './style.css'
import { 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword, 
  getAuth, 
  onAuthStateChanged 
} from 'firebase/auth'
import { initializeApp, getApps } from 'firebase/app'
import { ref, set, remove, onValue } from 'firebase/database'
import { auth, database } from '../../Firebase/Firebase'
import { useForm } from 'react-hook-form'

// Helper for secondary Firebase app instance
const getSecondaryAuth = () => {
  const secondaryAppName = 'SecondaryAdminApp'
  const existingApp = getApps().find(app => app.name === secondaryAppName)
  
  if (existingApp) {
    return getAuth(existingApp)
  }
  
  const secondaryApp = initializeApp(auth.app.options, secondaryAppName)
  return getAuth(secondaryApp)
}

const Admin = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [showAddUser, setShowAddUser] = useState(false)
  const [createUserStatus, setCreateUserStatus] = useState({ loading: false, error: '', success: '' })
  const [registeredUsers, setRegisteredUsers] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  const AUTHORIZED_ADMIN = 'nawaztechnical@gmail.com'

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
    return () => unsubscribeAuth()
  }, [])

  // Fetch all registered users from Realtime Database when authorized admin is logged in
  useEffect(() => {
    if (currentUser && currentUser.email === AUTHORIZED_ADMIN) {
      const usersRef = ref(database, 'users')
      const unsubscribeDb = onValue(usersRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val()
          const userList = Object.entries(data).map(([uid, val]) => ({
            uid,
            ...val,
          }))
          setRegisteredUsers(userList)
        } else {
          setRegisteredUsers([])
        }
      })

      return () => unsubscribeDb()
    }
  }, [currentUser])

  // React Hook Form setups
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    reset: resetLoginForm,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting }
  } = useForm()

  const {
    register: registerNewUser,
    handleSubmit: handleSubmitNewUser,
    reset: resetNewUserForm,
    formState: { errors: newUserErrors, isSubmitting: isNewUserSubmitting }
  } = useForm()

  const login = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)
      resetLoginForm()
      setErrorMessage(null)
    } catch (error) {

      // Target specific Firebase error codes
      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          setErrorMessage("Invalid email or password. Please try again.");
          break;
        case "auth/invalid-email":
          setErrorMessage("Please enter a valid email address.");
          break;
        case "auth/too-many-requests":
          setErrorMessage("Access disabled due to many failed attempts. Try again later.");
          break;
        default:
          setErrorMessage("Failed to login. Please check your credentials.");
          break;
      }
    }
  }

  const logout = async () => {
    try {
      if(!auth.currentUser){
        alert('No current user login...')
      }else{
        let isLogOut = confirm("Are you sure want to logout..")
        if(isLogOut){
          await signOut(auth)
          setShowAddUser(false)
        }
      }
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const handleCreateUser = async (data) => {
    setCreateUserStatus({ loading: true, error: '', success: '' })
    try {
      const secondaryAuth = getSecondaryAuth()
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth, 
        data.newUserEmail, 
        data.newUserPassword
      )
      
      const newUid = userCredential.user.uid

      // Store ONLY clean metadata (no password) in Realtime Database under /users
      await set(ref(database, `users/${newUid}`), {
        email: data.newUserEmail,
        createdAt: new Date().toISOString(),
        role: 'user'
      })

      setCreateUserStatus({
        loading: false,
        error: '',
        success: `User ${data.newUserEmail} created successfully!`
      })
      
      resetNewUserForm()
    } catch (err) {
      setCreateUserStatus({
        loading: false,
        error: err.message || 'Failed to create user',
        success: ''
      })
    }
  }

  // Delete user ONLY from Realtime Database (leaves Firebase Auth user active)
  const handleDeleteUser = async (uid, email) => {
    const isConfirmed = window.confirm(`Are you sure you want to remove ${email} from the user list?`)
    if (!isConfirmed) return

    try {
      await remove(ref(database, `users/${uid}`))
    } catch (err) {
      alert(`Failed to delete user record: ${err.message}`)
    }
  }

  return (
    <div className='adminMain'>
      
      <div className='adminform'>
        {
        errorMessage && (
          <h1 style={{fontSize:"2vw"}}>{errorMessage}</h1>
        )
      }
        {/* Main Admin Login Form */}
        <form onSubmit={handleSubmitLogin((data) => login(data))}>
          <input
            id='email'
            type="email"
            placeholder='Email'
            {...registerLogin('email', { required: 'The email is required' })}
          />
          {loginErrors.email && (
            <label htmlFor="email" className="error-label">{loginErrors.email.message}</label>
          )}

          <input
            id='password'
            type="password"
            placeholder='Password'
            {...registerLogin('password', {
              required: "The password is required",
            })}
          />
          {loginErrors.password && (
            <label htmlFor="password" className="error-label">{loginErrors.password.message}</label>
          )}

          <button type="submit" disabled={isLoginSubmitting}>
            {isLoginSubmitting ? (
              <>
                <span className="spinner" /> Loading...
              </>
            ) : (
              "Login"
            )}
          </button>

          <button type="button" className="logout-btn" onClick={logout}>
            Logout
          </button>
        </form>

        {/* Render "Add User" & "Registered Users List" ONLY for authorized admin */}
        {currentUser && currentUser.email === AUTHORIZED_ADMIN && (
          <>
            <div className="divider" />

            {!showAddUser ? (
              <button
                type="button"
                className="add-user-trigger"
                onClick={() => setShowAddUser(true)}
              >
                + Add Another User
              </button>
            ) : (
              <div className="add-user-section">
                <h4>Add New User</h4>
                
                {createUserStatus.success && (
                  <p className="status-msg success">{createUserStatus.success}</p>
                )}
                {createUserStatus.error && (
                  <p className="status-msg error">{createUserStatus.error}</p>
                )}

                <form onSubmit={handleSubmitNewUser(handleCreateUser)}>
                  <input
                    type="email"
                    placeholder="New User Email"
                    {...registerNewUser('newUserEmail', { required: 'Email is required' })}
                  />
                  {newUserErrors.newUserEmail && (
                    <label className="error-label">{newUserErrors.newUserEmail.message}</label>
                  )}

                  <input
                    type="password"
                    placeholder="New User Password"
                    {...registerNewUser('newUserPassword', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                  />
                  {newUserErrors.newUserPassword && (
                    <label className="error-label">{newUserErrors.newUserPassword.message}</label>
                  )}

                  <button type="submit" className="add-user-trigger" disabled={isNewUserSubmitting}>
                    {isNewUserSubmitting ? (
                      <>
                        <span className="spinner" /> Creating...
                      </>
                    ) : (
                      "Create User"
                    )}
                  </button>

                  <button
                    type="button"
                    className="logout-btn"
                    onClick={() => {
                      setShowAddUser(false)
                      setCreateUserStatus({ loading: false, error: '', success: '' })
                    }}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            )}

            {/* List of Created Users */}
            <div className="user-list-container">
              <h3>Registered Users</h3>
              {registeredUsers.length > 0 ? (
                <table className="admin-users-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Email</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredUsers.map((user, index) => (
                      <tr key={user.uid}>
                        <td>{index + 1}</td>
                        <td>{user.email}</td>
                        <td>
                          <button
                            type="button"
                            className="delete-user-btn"
                            onClick={() => handleDeleteUser(user.uid, user.email)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-users-text">No registered users found in database.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Admin