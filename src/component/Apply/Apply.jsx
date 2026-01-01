import React, { useState } from 'react'
import './style.css'
import { useForm } from 'react-hook-form'
import { auth, database } from '../../Firebase/Firebase'
import { ref, set } from 'firebase/database'

const Apply = () => {

  const [success, setSuccess] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    mode: "onChange"
  })

  const storeUser = async (data) => {
    try {
      await set(ref(database, data.phone), {
        Name: data.fullname,
        Address: data.address,
        Grade: data.grade,
        Course: data.course
      })
      console.log('the data store..')
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='applyMain'>
      {
        success ? (
          <div className='success'>successsfully Apply</div>
        ) : null
      }
      <form onSubmit={handleSubmit(data => storeUser(data))} id='form'>

        <input
          id='name'
          placeholder="Full Name"
          {...register("fullname", {
            required: "only letter allowed",
            pattern: {
              value: /^[A-Za-z\s]+$/,
              message: "Only letters allowed"
            }
          })}
          onKeyDown={(e) => {
            if (!/^[A-Za-z\s]$/.test(e.key) && e.key !== "Backspace") {
              e.preventDefault();
            }
          }}
          onPaste={(e) => {
            e.preventDefault();
            const text = e.clipboardData.getData("text");
            e.target.value += text.replace(/[^A-Za-z\s]/g, "");
          }}
        /><label htmlFor="name">{errors.fullname?.message}</label>

        <input
          id='phon'
          type="text"
          placeholder="Phone Number"
          {...register("phone", {
            required: "Phone number is required",
            pattern: {
              value: /^[0-9]+$/,
              message: "Only digits allowed"
            },
            validate: (value) => value.length == 11 || 'enter valid number..',
            minLength: {
              value: 11,
              message: "Minimum 11 digits"
            },
            maxLength: {
              value: 11,
              message: "Maximum 11 digits"
            }
          })}
          onKeyDown={(e) => {
            if (!/^[0-9]$/.test(e.key) && e.key !== "Backspace") {
              e.preventDefault();
            }
          }}
        /><label htmlFor="phon">{errors.phone?.message}</label>

        <select
          id='address'
          {...register("address", { required: "Select address" })}
        >
          <option value="">Select Address</option>
          <option value="bannu">Bannu</option>
          <option value="township">Township</option>
          <option value="domail">Domail</option>
        </select><label htmlFor="address">{errors.address?.message}</label>


        <select
          id='grade'
          {...register("grade", { required: "Select grade" })}
        >
          <option value="">Select Grade</option>
          <option value="matric">Matric</option>
          <option value="fsc">FSc</option>
          <option value="bs">BS</option>
        </select><label htmlFor="grade">{errors.grade?.message}</label>

        <select
          id='course'
          {...register("course", { required: "Select course" })}
        >
          <option value="">Select Course</option>
          <option value="python">Python</option>
        </select><label htmlFor="course">{errors.course?.message}</label>

        <br /><br />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="spinner" /> Loading...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  )
}

export default Apply