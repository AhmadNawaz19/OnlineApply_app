import React, { useState, useEffect } from "react";
import "./style.css";
import { useForm } from "react-hook-form";
import { database } from "../../Firebase/Firebase";
import { ref, set, push, get } from "firebase/database";
import { Helmet } from "react-helmet-async";

const Apply = () => {
  const [success, setSuccess] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  // Fetch published courses from Firebase
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesRef = ref(database, "courses");
        const snapshot = await get(coursesRef);

        if (snapshot.exists()) {
          const coursesData = snapshot.val();
          const publishedCourses = Object.keys(coursesData)
            .map((key) => ({ id: key, ...coursesData[key] }))
            .filter((course) => course.status === "published");

          setCourses(publishedCourses);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  const storeUser = async (data) => {
    try {
      const applicationsRef = ref(database, "applications");

      await set(push(applicationsRef), {
        Name: data.fullname,
        FatherName: data.fathername,
        Phone: data.phone,
        CNIC: data.cnic,
        Address: data.address,
        Grade: data.grade,
        Course: data.course,
        createdAt: new Date().toISOString(),
      });

      setSuccess(true);
      reset();

      setTimeout(() => {
        setSuccess(false);
      }, 2500);
    } catch (err) {
      console.error("Error storing application:", err);
    }
  };

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
    <div className="applyMain">
      {success && (
        <div className="success">
          <h2>Apply Successfully</h2>
          <span>✔</span>
        </div>
      )}

      <h1>Registration Form</h1>

      <div id="correctdetails">
        <span>
          <u>NOTE</u>
        </span>
        <p>
          Submit correct details. We will use these details to contact you.
        </p>
      </div>

      <form onSubmit={handleSubmit(storeUser)} id="form">
        <div className="form-grid">
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullname">Full Name *</label>
            <input
              id="fullname"
              type="text"
              placeholder="e.g. John Doe"
              className={errors.fullname ? "is-invalid" : ""}
              {...register("fullname", {
                required: "Full Name is required",
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "Only letters are allowed",
                },
              })}
              onKeyDown={(e) => {
                if (!/^[A-Za-z\s]$/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
                  e.preventDefault();
                }
              }}
            />
            {errors.fullname && <p className="error-msg">{errors.fullname.message}</p>}
          </div>

          {/* Father Name */}
          <div className="form-group">
            <label htmlFor="fathername">Father Name *</label>
            <input
              id="fathername"
              type="text"
              placeholder="e.g. Richard Doe"
              className={errors.fathername ? "is-invalid" : ""}
              {...register("fathername", {
                required: "Father Name is required",
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "Only letters are allowed",
                },
              })}
              onKeyDown={(e) => {
                if (!/^[A-Za-z\s]$/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
                  e.preventDefault();
                }
              }}
            />
            {errors.fathername && <p className="error-msg">{errors.fathername.message}</p>}
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              id="phone"
              type="text"
              placeholder="03001234567"
              className={errors.phone ? "is-invalid" : ""}
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Only digits are allowed",
                },
                minLength: {
                  value: 11,
                  message: "Minimum 11 digits required",
                },
                maxLength: {
                  value: 15,
                  message: "Maximum 15 digits allowed",
                },
              })}
              onKeyDown={(e) => {
                if (!/^[0-9]$/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
                  e.preventDefault();
                }
              }}
            />
            {errors.phone && <p className="error-msg">{errors.phone.message}</p>}
          </div>

          {/* CNIC */}
          <div className="form-group">
            <label htmlFor="cnic">CNIC / B-Form *</label>
            <input
              id="cnic"
              type="text"
              placeholder="1111111111111"
              className={errors.cnic ? "is-invalid" : ""}
              {...register("cnic", {
                required: "CNIC is required",
                pattern: {
                  value: /^[0-9-]+$/,
                  message: "Only digits and hyphens allowed",
                },
                minLength: {
                  value: 13,
                  message: "Minimum 13 digits required",
                },
                maxLength: {
                  value: 15,
                  message: "Maximum 15 digits allowed",
                },
              })}
            />
            {errors.cnic && <p className="error-msg">{errors.cnic.message}</p>}
          </div>

          {/* Address */}
          <div className="form-group">
            <label htmlFor="address">Address / Location *</label>
            <select
              id="address"
              className={errors.address ? "is-invalid" : ""}
              {...register("address", { required: "Please select an address" })}
            >
              <option value="">Select Address</option>
              <option value="bannu">Bannu</option>
              <option value="township">Township</option>
              <option value="domail">Domail</option>
            </select>
            {errors.address && <p className="error-msg">{errors.address.message}</p>}
          </div>

          {/* Grade / Education Level */}
          <div className="form-group">
            <label htmlFor="grade">Education Level *</label>
            <select
              id="grade"
              className={errors.grade ? "is-invalid" : ""}
              {...register("grade", { required: "Please select your education level" })}
            >
              <option value="">Select Education Level</option>
              <option value="matric">Matric</option>
              <option value="fsc">FSc</option>
              <option value="bs">BS</option>
            </select>
            {errors.grade && <p className="error-msg">{errors.grade.message}</p>}
          </div>

          {/* Published Courses */}
          <div className="form-group full-width">
            <label htmlFor="course">Select Course *</label>
            <select
              id="course"
              className={errors.course ? "is-invalid" : ""}
              disabled={loadingCourses}
              {...register("course", { required: "Please select a course" })}
            >
              <option value="">
                {loadingCourses ? "Loading published courses..." : "Select Course"}
              </option>
              {courses.map((c) => (
                <option key={c.id} value={c.title || c.name || c.id}>
                  {c.title || c.name}
                </option>
              ))}
            </select>
            {errors.course && <p className="error-msg">{errors.course.message}</p>}
          </div>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="spinner" /> Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </button>
      </form>
    </div>
    </>
  );
};

export default Apply;