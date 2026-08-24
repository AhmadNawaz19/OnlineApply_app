import React, { useState, useEffect } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { database } from "../../Firebase/Firebase";

const Course = () => {
  const [courses, setCourses] = useState(() => {
    const catchedData = localStorage.getItem('course_data')
    return catchedData ? JSON.parse(catchedData) : []
  });
  const [loading, setLoading] = useState(() => {
    return !localStorage.getItem('course_data')
  });

  useEffect(() => {
    const coursesRef = ref(database, "courses");

    const unsubscribe = onValue(
      coursesRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const courseList = Object.entries(data).map(([key, val]) => ({
            dbKey: key,
            ...val,
          }));
          localStorage.setItem('course_data', JSON.stringify(courseList));
          setCourses(courseList);
        } else {
          localStorage.removeItem('course_data');
          setCourses([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching courses from Firebase:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div id="courses" style={{ textAlign: "center", padding: "40px 0" }}>
        <p>Loading courses...</p>
      </div>
    );
  }

  return (
    <div id="courses">
      {courses.length > 0 ? (
        <div className="courses-grid">
          {courses.map((course, idx) => {
            const isExpired = course.applyLastDate
              ? new Date(course.applyLastDate).setHours(23, 59, 59, 999) < new Date().getTime()
              : false;

            const isPending = course.status === "pending";

            return (
              <div key={course.dbKey || course.id || idx} className="course-card">
                <div className="card-header">
                  {course.badge && (
                    <span className="course-badge">{course.badge}</span>
                  )}
                  <h3>{course.title}</h3>
                  <div className="meta-info">
                    <span>⏱ {course.duration}</span>
                    <span>Monthly Fees: Rs {course.fees}</span>
                    <span>📍 {course.mode}</span>
                    {course.totalSeats && <span>🪑 Seats Available: {course.totalSeats}</span>}
                  </div>
                </div>

                <div className="skills-tags">
                  {Array.isArray(course.skills) ? (
                    course.skills.map((skill, index) => (
                      <span key={index} className="tag">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="tag">{course.skills}</span>
                  )}
                </div>

                {/* Last Date to Apply displayed in red */}
                {course.applyLastDate && (
                  <div
                    className="apply-deadline"
                    style={{
                      margin: "12px 0 6px 0",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      color: "#dc2626",
                    }}
                  >
                    <span>📅 Last Date to Apply: </span>
                    <span style={{ fontWeight: "700" }}>
                      {new Date(course.applyLastDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}

                <div className="card-footer">
                  {isPending ? (
                    <button
                      className="serviceBtn"
                      disabled
                      style={{
                        width: "100%",
                        backgroundColor: "rgba(255, 0, 0, 0.212)",
                        color: "#dc2626",
                        cursor: "not-allowed",
                      }}
                    >
                      Pending
                    </button>
                  ) : isExpired ? (
                    <button
                      className="serviceBtn"
                      disabled
                      style={{
                        width: "100%",
                        backgroundColor: "#94a3b8",
                        color: "#ffffff",
                        cursor: "not-allowed",
                      }}
                    >
                      Closed
                    </button>
                  ) : (
                    <Link to={course.link || "/apply"} className="serviceBtn">
                      Apply Now
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <p>No courses available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default Course;