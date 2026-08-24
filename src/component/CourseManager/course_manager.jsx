import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { ref, onValue, push, set, update, remove } from 'firebase/database'
import { auth, database } from '../../Firebase/Firebase'
import { useForm } from 'react-hook-form'
import './style.css'

const AUTHORIZED_ADMIN = 'nawaztechnical@gmail.com'

const CourseControl = () => {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [courses, setCourses] = useState([])
  const [editingCourse, setEditingCourse] = useState(null)
  const [statusMsg, setStatusMsg] = useState({ error: '', success: '' })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      badge: 'Most Popular',
      title: '',
      duration: '',
      mode: 'In-Person',
      status: 'published', // 'published' or 'pending'
      fees: '',
      totalSeats: '', // Added total seats state
      skills: '',
      applyLastDate: '', // Apply deadline field
      link: '/apply'
    }
  })

  // 1. Verify Authentication & Admin Status
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setAuthLoading(false)

      if (!user || user.email !== AUTHORIZED_ADMIN) {
        navigate('/admin')
      }
    })
    return () => unsubscribeAuth()
  }, [navigate])

  // 2. Fetch Courses from Realtime Database
  useEffect(() => {
    if (currentUser && currentUser.email === AUTHORIZED_ADMIN) {
      const coursesRef = ref(database, 'courses')
      const unsubscribeDb = onValue(coursesRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val()
          const list = Object.entries(data).map(([dbKey, val]) => ({
            dbKey,
            ...val
          }))
          setCourses(list)
        } else {
          setCourses([])
        }
      })
      return () => unsubscribeDb()
    }
  }, [currentUser])

  // 3. Handle Create / Update Form Submission
  const onSubmitCourse = async (data) => {
    setStatusMsg({ error: '', success: '' })

    const formattedSkills = typeof data.skills === 'string'
      ? data.skills.split(',').map(s => s.trim()).filter(Boolean)
      : data.skills

    const coursePayload = {
      badge: data.badge,
      title: data.title,
      duration: data.duration,
      mode: data.mode,
      status: data.status,
      fees: Number(data.fees),
      totalSeats: data.totalSeats ? Number(data.totalSeats) : null,
      skills: formattedSkills,
      applyLastDate: data.applyLastDate || '',
      link: data.link || '/apply'
    }

    try {
      if (editingCourse) {
        await update(ref(database, `courses/${editingCourse.dbKey}`), coursePayload)
        setStatusMsg({ error: '', success: 'Course updated successfully!' })
        setEditingCourse(null)
      } else {
        const newCourseRef = push(ref(database, 'courses'))
        await set(newCourseRef, {
          ...coursePayload,
          id: newCourseRef.key
        })
        setStatusMsg({ error: '', success: 'Course created successfully!' })
      }
      resetForm()
    } catch (err) {
      setStatusMsg({ error: err.message || 'Failed to save course', success: '' })
    }
  }

  // Toggle course status between Published and Pending
  const handleToggleStatus = async (course) => {
    const newStatus = course.status === 'published' ? 'pending' : 'published'
    try {
      await update(ref(database, `courses/${course.dbKey}`), { status: newStatus })
      setStatusMsg({
        error: '',
        success: `Course status changed to "${newStatus === 'published' ? 'Published' : 'Pending'}"`
      })
    } catch (err) {
      alert(`Failed to update status: ${err.message}`)
    }
  }

  // Populate form for editing
  const handleEdit = (course) => {
    setEditingCourse(course)
    setValue('badge', course.badge || '')
    setValue('title', course.title || '')
    setValue('duration', course.duration || '')
    setValue('mode', course.mode || 'In-Person')
    setValue('status', course.status || 'published')
    setValue('fees', course.fees || '')
    setValue('totalSeats', course.totalSeats || '')
    setValue('skills', Array.isArray(course.skills) ? course.skills.join(', ') : '')
    setValue('applyLastDate', course.applyLastDate || '')
    setValue('link', course.link || '/apply')
  }

  // Delete Course
  const handleDelete = async (dbKey, title) => {
    if (!window.confirm(`Delete course "${title}" permanently?`)) return

    try {
      await remove(ref(database, `courses/${dbKey}`))
      if (editingCourse?.dbKey === dbKey) resetForm()
    } catch (err) {
      alert(`Delete failed: ${err.message}`)
    }
  }

  const resetForm = () => {
    setEditingCourse(null)
    reset({
      badge: 'Most Popular',
      title: '',
      duration: '',
      mode: 'In-Person',
      status: 'published',
      fees: '',
      totalSeats: '',
      skills: '',
      applyLastDate: '',
      link: '/apply'
    })
  }

  if (authLoading) {
    return <div className="loading-screen">Authenticating Admin...</div>
  }

  if (!currentUser || currentUser.email !== AUTHORIZED_ADMIN) {
    return null
  }

  return (
    <div className="course-page-wrapper">
      <header className="page-header">
        <h1>Course Management Dashboard</h1>
      </header>

      {statusMsg.success && <p className="status-msg success">{statusMsg.success}</p>}
      {statusMsg.error && <p className="status-msg error">{statusMsg.error}</p>}

      {/* Form Section */}
      <section className="card-box">
        <h3>{editingCourse ? `Editing: ${editingCourse.title}` : 'Add New Course'}</h3>
        <form onSubmit={handleSubmit(onSubmitCourse)}>
          <div className="grid-2col">
            <div>
              <label>Title*</label>
              <input type="text" placeholder="e.g Web Development" {...register('title', { required: 'Required' })} />
              {errors.title && <span className="err-text">{errors.title.message}</span>}
            </div>

            <div>
              <label>Badge</label>
              <input type="text" placeholder="Most Popular" {...register('badge')} />
            </div>

            <div>
              <label>Duration*</label>
              <input type="text" placeholder="3 Months" {...register('duration', { required: 'Required' })} />
              {errors.duration && <span className="err-text">{errors.duration.message}</span>}
            </div>

            <div>
              <label>Mode*</label>
              <select {...register('mode')}>
                <option value="In-Person">In-Person</option>
                <option value="Online">Online</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label>Status*</label>
              <select {...register('status')}>
                <option value="published">Published</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div>
              <label>Fees*</label>
              <input type="number" placeholder="2000" {...register('fees', { required: 'Required' })} />
              {errors.fees && <span className="err-text">{errors.fees.message}</span>}
            </div>

            <div>
              <label>Total Available Seats</label>
              <input type="number" placeholder="30" {...register('totalSeats')} />
            </div>

            <div>
              <label>Last Date to Apply</label>
              <input type="date" {...register('applyLastDate')} />
            </div>

            <div>
              <label>Apply Link</label>
              <input type="text" placeholder="/apply" {...register('link')} />
            </div>
          </div>

          <div className="full-width">
            <label>Skills (Comma-separated)*</label>
            <input type="text" placeholder="e.g HTML5, CSS3, JavaScript" {...register('skills', { required: 'Required' })} />
            {errors.skills && <span className="err-text">{errors.skills.message}</span>}
          </div>

          <div className="btn-group">
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
            </button>
            {editingCourse && (
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Table Section */}
      <section className="card-box">
        <h3>Existing Courses ({courses.length})</h3>
        {courses.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Badge</th>
                <th>Skills</th>
                <th>Duration</th>
                <th>Mode</th>
                <th>Fees</th>
                <th>Seats</th>
                <th>Apply Last Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, idx) => {
                const isPending = course.status === 'pending'
                return (
                  <tr key={course.dbKey}>
                    <td>{idx + 1}</td>
                    <td><strong>{course.title}</strong></td>
                    <td><span className="badge-tag">{course.badge || 'N/A'}</span></td>
                    <td>
                      {Array.isArray(course.skills) ? course.skills.join(', ') : course.skills}
                    </td>
                    <td>{course.duration}</td>
                    <td>{course.mode}</td>
                    <td>{course.fees}</td>
                    <td>{course.totalSeats ? `${course.totalSeats} Seats` : 'N/A'}</td>
                    <td>{course.applyLastDate || 'N/A'}</td>

                    {/* Status Column */}
                    <td>
                      <button
                        type="button"
                        className={`btn-status ${isPending ? 'status-pending' : 'status-published'}`}
                        onClick={() => handleToggleStatus(course)}
                      >
                        {isPending ? 'Pending' : 'Published'}
                      </button>
                    </td>

                    {/* Actions Column */}
                    <td>
                      <button className="btn-edit" onClick={() => handleEdit(course)}><i className="fa-regular fa-pen-to-square"></i></button>
                      <button className="btn-delete" onClick={() => handleDelete(course.dbKey, course.title)}><i className="fa-solid fa-trash-can"></i></button>
                    </td>

                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <p>No courses found in database.</p>
        )}
      </section>
    </div>
  )
}

export default CourseControl