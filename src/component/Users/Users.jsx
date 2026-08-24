import React, { useEffect, useState } from "react";
import "./style.css";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { get, ref, remove } from "firebase/database";
import { database, auth } from "../../Firebase/Firebase";
import { onAuthStateChanged } from "firebase/auth";

const Users = () => {
  const [users, setUser] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [data, setData] = useState(false);

  const [filterDropDown, setFilterDropDown] = useState(false);
  const [settingDropDown, setSettingDropDown] = useState(false);
  const [fieldDropDown, setFieldDropDown] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Dynamic Courses State
  const [publishedCourses, setPublishedCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [cnicField, setCNICfield] = useState(() => {
    return localStorage.getItem("cnicField") === "true";
  });
  const [phoneField, setPhonefield] = useState(() => {
    return localStorage.getItem("phoneField") === "true";
  });
  const [fatherNameField, setFatherNameField] = useState(() => {
    return localStorage.getItem("fatherNameField") === "true";
  });

  const [loading, setLoading] = useState(true);

  // Fetch applications
  const getAllUser = async () => {
    try {
      const snapshot = await get(ref(database, "applications"));
      if (!snapshot.exists() || snapshot.val() === null) {
        setData(false);
        setUser([]);
      } else {
        const userList = Object.entries(snapshot.val()).map(([id, val]) => ({
          id: id,
          ...val,
        }));
        setUser(userList);
        setData(true);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch published courses for the filter dropdown
  const getPublishedCourses = async () => {
    try {
      const snapshot = await get(ref(database, "courses"));
      if (snapshot.exists()) {
        const coursesData = snapshot.val();
        const filtered = Object.keys(coursesData)
          .map((key) => ({ id: key, ...coursesData[key] }))
          .filter((course) => course.status === "published");

        setPublishedCourses(filtered);
      } else {
        setPublishedCourses([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || !user.email) {
        setAdmin(false);
        setLoading(false);
      } else {
        setAdmin(user.email);
        getAllUser();
        getPublishedCourses();
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("cnicField", cnicField);
    localStorage.setItem("phoneField", phoneField);
    localStorage.setItem("fatherNameField", fatherNameField);
  }, [cnicField, phoneField, fatherNameField]);

  // Delete ALL Records
  const deleteAllStudents = async () => {
    try {
      const isConfirmed = window.confirm(
        "Are you sure you want to delete ALL student records?"
      );

      if (isConfirmed) {
        await remove(ref(database, "applications"));
        setUser([]);
        setData(false);
      }
    } catch (error) {
      console.error("Error deleting all students:", error);
    }
  };

  // Delete Selected Course Records ONLY
  const deleteCourseStudents = async () => {
    if (!selectedCourse) return;

    const count = courseFiltered.length;
    if (count === 0) {
      alert(`No records found for ${selectedCourse}.`);
      return;
    }

    const isConfirmed = window.confirm(
      `Are you sure you want to delete ALL ${count} student(s) enrolled in "${selectedCourse}"?`
    );

    if (isConfirmed) {
      try {
        // Delete each record belonging to the selected course
        const deletePromises = courseFiltered.map((student) =>
          remove(ref(database, `applications/${student.id}`))
        );

        await Promise.all(deletePromises);

        // Update local state without needing a full refetch
        const remainingUsers = users.filter(
          (student) =>
            student.Course?.toLowerCase() !== selectedCourse.toLowerCase()
        );

        setUser(remainingUsers);
        if (remainingUsers.length === 0) {
          setData(false);
        }

        alert(`Successfully deleted ${count} student(s) from ${selectedCourse}.`);
      } catch (error) {
        console.error("Error deleting course students:", error);
        alert("Failed to delete records. Check console for details.");
      }
    }
  };

  const filterToggle = () => setFilterDropDown((prev) => !prev);
  const settingToggle = () => setSettingDropDown((prev) => !prev);
  const fieldToggle = () => setFieldDropDown((prev) => !prev);

  // Dynamic Filtering Logic
  const courseFiltered = selectedCourse
    ? users.filter(
        (student) =>
          student.Course?.toLowerCase() === selectedCourse.toLowerCase()
      )
    : users;

  const displayStudents =
    searchTerm.trim() !== ""
      ? courseFiltered.filter((student) =>
          student.Name?.toLowerCase().includes(searchTerm.toLowerCase().trim())
        )
      : courseFiltered;

 const Downloadxlx = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Students List");

  // ----------------------------------------------------
  // 1. READ COURSES FROM LOCALSTORAGE CACHE
  // ----------------------------------------------------
  let cachedCourses = [];
  try {
    const rawCache = localStorage.getItem("course_data");
    if (rawCache) {
      cachedCourses = JSON.parse(rawCache);
    }
  } catch (error) {
    console.error("Error parsing course_data from localStorage cache:", error);
  }

  // Helper function to find course duration in cached data
  const getCourseMonths = (courseTitle) => {
    if (!courseTitle || !Array.isArray(cachedCourses)) return 0;

    const matchedCourse = cachedCourses.find(
      (c) => c.title?.trim().toLowerCase() === courseTitle?.trim().toLowerCase()
    );

    if (matchedCourse && matchedCourse.duration) {
      const match = matchedCourse.duration.toString().match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    }
    return 0;
  };

  // Determine max months needed across displayed applications
  let maxMonths = 0;
  displayStudents.forEach((val) => {
    const months = getCourseMonths(val.Course);
    if (months > maxMonths) maxMonths = months;
  });

  // Base columns
  const baseColumns = [
    { header: "NO", key: "no", width: 8 },
    { header: "FullName", key: "name", width: 22 },
    { header: "Father Name", key: "fatherName", width: 22 },
    { header: "CNIC", key: "cnic", width: 22 },
    { header: "Phone Number", key: "phone", width: 18 },
    { header: "Address", key: "address", width: 30 },
    { header: "Education Level", key: "grade", width: 20 },
    { header: "Course", key: "course", width: 20 },
  ];

  // Dynamically add Month 1, Month 2... columns based on cache
  const monthColumns = Array.from({ length: maxMonths }, (_, i) => ({
    header: `Month ${i + 1}`,
    key: `month_${i + 1}`,
    width: 14,
  }));

  const allColumns = [...baseColumns, ...monthColumns];
  worksheet.columns = allColumns;

  // ----------------------------------------------------
  // 2. CAPTION ROW (COURSE TITLE)
  // ----------------------------------------------------
  const courseTitleText = `STUDENTS LIST - ${selectedCourse ? selectedCourse.toUpperCase() : "ALL COURSES"}`;

  const titleRow = worksheet.getRow(1);
  titleRow.height = 35;
  titleRow.getCell(1).value = courseTitleText;

  const lastColLetter = worksheet.getColumn(allColumns.length).letter;
  worksheet.mergeCells(`A1:${lastColLetter}1`);

  const titleCell = titleRow.getCell(1);
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "111827" },
  };
  titleCell.font = {
    name: "Arial",
    size: 14,
    bold: true,
    color: { argb: "FFFFFF" },
  };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };

  worksheet.addRow([]); // Empty spacing row

  // ----------------------------------------------------
  // 3. TABLE HEADER ROW
  // ----------------------------------------------------
  const headerRow = worksheet.addRow(allColumns.map((col) => col.header));
  headerRow.height = 28;

  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "1F2937" },
    };
    cell.font = {
      name: "Arial",
      size: 11,
      bold: true,
      color: { argb: "FFFFFF" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      bottom: { style: "medium", color: { argb: "000000" } },
    };
  });

  // ----------------------------------------------------
  // 4. DATA ROWS
  // ----------------------------------------------------
  displayStudents.forEach((val, idx) => {
    const studentMonths = getCourseMonths(val.Course);

    const rowData = {
      no: idx + 1,
      name: val.Name || "N/A",
      fatherName: val.FatherName || "N/A",
      phone: val.Phone || "N/A",
      cnic: val.CNIC || "N/A",
      address: val.Address || "N/A",
      grade: val.Grade || "N/A",
      course: val.Course || "N/A",
    };

    // Fill month columns based on student's cached course duration
    for (let i = 1; i <= maxMonths; i++) {
      if (i <= studentMonths) {
        rowData[`month_${i}`] = ""; // Ready for manual entry
      } else {
        rowData[`month_${i}`] = "-"; // Unused month slot for shorter courses
      }
    }

    const row = worksheet.addRow(rowData);
    row.height = 22;
    const rowBgColor = idx % 2 === 0 ? "F9FAFB" : "FFFFFF";

    row.eachCell((cell, colNumber) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: rowBgColor },
      };
      cell.font = { name: "Arial", size: 10 };
      cell.alignment = {
        vertical: "middle",
        horizontal: colNumber === 1 || colNumber > baseColumns.length ? "center" : "left",
      };
      cell.border = {
        top: { style: "thin", color: { argb: "E5E7EB" } },
        bottom: { style: "thin", color: { argb: "E5E7EB" } },
        left: { style: "thin", color: { argb: "E5E7EB" } },
        right: { style: "thin", color: { argb: "E5E7EB" } },
      };
    });
  });

  // ----------------------------------------------------
  // 5. FILE DOWNLOAD
  // ----------------------------------------------------
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `Students_List_${selectedCourse || "All"}.xlsx`);
};

  if (loading) {
    return (
      <div className="userMain">
        <h1 style={{ color: "black", textAlign: "center", marginTop: "50px" }}>
          Loading...
        </h1>
      </div>
    );
  }

  return (
    <div className="userMain">
      {admin ? (
        <>
        <div id="filter">
        {/* Search Input */}
        <div id="search">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Dropdown */}
        <div id="filtBYcourse">
          <button onClick={filterToggle}>
            <i className="fa-solid fa-sliders"></i>
            <span>{selectedCourse || "Total"} Students</span>
            <span>{displayStudents.length}</span>
          </button>

          {filterDropDown && (
            <div id="course">
              <label>
                <input
                  type="radio"
                  value=""
                  name="course"
                  checked={selectedCourse === ""}
                  onChange={() => setSelectedCourse("")}
                />
                All
              </label>

              {loadingCourses ? (
                <p style={{ fontSize: "12px", color: "#666" }}>Loading...</p>
              ) : (
                publishedCourses.map((c) => {
                  const courseVal = c.title || c.name || "";
                  return (
                    <>
                      <br />
                      <label key={c.id}>
                        <input
                          type="radio"
                          value={courseVal}
                          name="course"
                          checked={
                            selectedCourse.toLowerCase() === courseVal.toLowerCase()
                          }
                          onChange={(e) => setSelectedCourse(e.target.value)}
                          />
                        {courseVal}
                      </label>
                    </>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Download Button */}
        <div id="download">
          <button onClick={Downloadxlx}>
            <i
              className="fa-solid fa-file-excel"
              style={{ marginRight: "8px" }}
            ></i>
            Download Excel
          </button>
        </div>

        {/* Settings Button */}
        <div id="settings">
          <button onClick={settingToggle}>
            <i className="fa-solid fa-gear"></i>
          </button>
          {settingDropDown && (
            <div id="settingDropDown">
              <div id="download">
                <button id="downloadfile" onClick={Downloadxlx}>
                  <i
                    className="fa-solid fa-file-excel"
                    style={{ marginRight: "8px" }}
                  ></i>
                  Download Excel
                </button>
              </div>

              {/* Delete ONLY Selected Course Students */}
              {admin === "nawaztechnical@gmail.com" && selectedCourse && (
                <button id="deleteCourse" onClick={deleteCourseStudents}>
                  <i className="fa-solid fa-trash-can"></i>
                  Delete {selectedCourse} Rec ({courseFiltered.length})
                </button>
              )}

              {/* Delete All Students */}
              {admin === "nawaztechnical@gmail.com" && (
                <button id="delete" onClick={deleteAllStudents}>
                  <i className="fa-solid fa-trash-can"></i>Delete All Rec
                </button>
              )}
            </div>
          )}
        </div>
        </div>

        <div className="users">
          <div id="fieldContainer">
            <i className="fa-regular fa-square-plus" onClick={fieldToggle}></i>
            {fieldDropDown && (
              <div id="fieldDropDown">
                <label>
                  <input
                    type="checkbox"
                    checked={cnicField}
                    onChange={(e) => setCNICfield(e.target.checked)}
                  />
                  <span> CNIC</span>
                </label>
                <br />
                <label>
                  <input
                    type="checkbox"
                    checked={phoneField}
                    onChange={(e) => setPhonefield(e.target.checked)}
                  />
                  <span> Phone</span>
                </label>
                <br />
                <label>
                  <input
                    type="checkbox"
                    checked={fatherNameField}
                    onChange={(e) => setFatherNameField(e.target.checked)}
                  />
                  <span> Father Name</span>
                </label>
              </div>
            )}
          </div>

          {data && displayStudents.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th className="no">NO</th>
                  <th className="fullname">FullName</th>
                  {fatherNameField && <th className="fathername">Father Name</th>}
                  {cnicField && <th className="cnic">CNIC</th>}
                  {phoneField && <th className="phone">Phone Number</th>}
                  <th className="address">Address</th>
                  <th className="education">EducationLevel</th>
                  <th className="course">Course</th>
                </tr>
              </thead>
              <tbody>
                {displayStudents.map((val, idx) => (
                  <tr key={val.id || idx}>
                    <td className="no">{idx + 1}</td>
                    <td className="fullname">{val.Name}</td>
                    {fatherNameField && (
                      <td className="fathername">{val.FatherName}</td>
                    )}
                    {cnicField && <td className="cnic">{val.CNIC}</td>}
                    {phoneField && <td className="phone">{val.Phone}</td>}
                    <td className="address">{val.Address}</td>
                    <td className="education">{val.Grade}</td>
                    <td className="course">{val.Course}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <h1 style={{ color: "white", textAlign: "center" }}>
              Currently no User Found..
            </h1>
          )}
        </div>
      </>
      ) : (
    <h1
      style={{
        color: "black",
        fontSize: "6vw",
        textAlign: "center",
        marginTop: "50px",
      }}
    >
      404 Not Found
    </h1>
  )}
    </div>
  ) 
};

export default Users;