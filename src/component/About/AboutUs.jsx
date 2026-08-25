import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue, set } from "firebase/database";
import "./style.css";

const DEFAULT_MAP_URL =
  "https://maps.google.com/maps?q=University%20of%20Science%20and%20Technology%20Bannu&t=&z=15&ie=UTF8&iwloc=&output=embed";

const AboutUs = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const [mapUrl, setMapUrl] = useState(DEFAULT_MAP_URL);

  const [isEditingMap, setIsEditingMap] = useState(false);

  const [tempUrl, setTempUrl] = useState(DEFAULT_MAP_URL);

  // ==========================================
  // CHECK ADMIN + LISTEN TO MAP URL IN REALTIME
  // ==========================================
  useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();

    const mapRef = ref(db, "settings/mapConfig");

    // Check if user is admin
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user && user.email === "nawaztechnical@gmail.com") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    // Listen to Firebase Realtime Database
    const unsubscribeMap = onValue(
      mapRef,
      (snapshot) => {
        const data = snapshot.val();

        console.log("Map data from Firebase:", data);

        if (data && data.url) {
          setMapUrl(data.url);
          setTempUrl(data.url);
        }
      },
      (error) => {
        console.error(
          "Error loading map URL from Firebase:",
          error
        );
      }
    );

    // Cleanup
    return () => {
      unsubscribeAuth();
      unsubscribeMap();
    };
  }, []);

  // ==========================================
  // SAVE NEW MAP URL
  // ==========================================
  const handleMapSave = async () => {
    try {
      const db = getDatabase();
      const mapRef = ref(db, "settings/mapConfig");

      if (!tempUrl.trim()) {
        alert("Please enter a valid map URL.");
        return;
      }

      await set(mapRef, {
        url: tempUrl.trim(),
      });

      setMapUrl(tempUrl.trim());
      setIsEditingMap(false);

      alert("Map URL updated successfully.");
    } catch (error) {
      console.error(
        "Error saving map URL:",
        error
      );

      alert("Failed to save map URL.");
    }
  };

  // ==========================================
  // CANCEL MAP EDITING
  // ==========================================
  const handleCancel = () => {
    setTempUrl(mapUrl);
    setIsEditingMap(false);
  };

  // ==========================================
  // PORTFOLIO DETAILS
  // ==========================================
  const Details = [
    {
      id: "intro",
      title: "INTRODUCTION",
      description: `
My name is Ahmad Nawaz. I am a software engineer
with strong experience in both front-end and back-end technologies.
I work with modern tools like HTML, CSS, JavaScript, React.js,
Next.js, Node.js, Express.js, Python, XML, OWL, PostgreSQL, and MySQL
to build complete web and Odoo applications.
      `,
    },
    {
      id: "skills",
      title: "SKILLS",
      description: `
HTML, CSS, JavaScript, React.js, Next.js, Node.js,
Express.js, Python, XML, OWL, PostgreSQL, MySQL,
Firebase, Cloudinary, Git, GitHub, CI/CD, Deployment,
REST API, and OAuth 2.0.
      `,
    },
    {
      id: "education",
      title: "EDUCATION",
      description:
        "University of Science and Technology Bannu | BS Computer Science",
    },
    {
      id: "contact",
      title: "CONTACT",
      phone: "+92 3301659292",
      email: "ahmadnawaz.codes@gmail.com",
      website: "https://ahmadnawaz19.vercel.app",
    },
    {
      id: "location",
      title: "INSTITUTE LOCATION",
      mapUrl: mapUrl,
    },
  ];

  // ==========================================
  // COMPONENT UI
  // ==========================================
  return (
    <div className="aboutMain">
      {/* LEFT SIDE */}
      <div id="leftMain">
        <div className="img">
          <img
            src="pic2.jpeg"
            alt="Ahmad Nawaz Profile"
          />
        </div>

        <div id="other">
          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/ahmad-nawaz-7985a4363/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="linkedin.png"
              alt="LinkedIn Profile"
            />
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/AhmadNawaz19"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="github.png"
              alt="GitHub Profile"
            />
          </a>

          {/* HackerRank */}
          <a
            href="https://www.hackerrank.com/profile/AhmadNawaz"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="hacker.png"
              alt="HackerRank Profile"
            />
          </a>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div id="rightMain">
        {Details.map((details) => (
          <React.Fragment key={details.id}>
            <h2 className="title">
              {details.title}
            </h2>

            <div className="description">
              {/* Description */}
              {details.description && (
                <p>
                  {details.description}
                </p>
              )}

              {/* CONTACT SECTION */}
              {details.id === "contact" && (
                <>
                  <p>
                    Phone:{" "}
                    <a href={`tel:${details.phone}`}>
                      {details.phone}
                    </a>
                  </p>

                  <p>
                    Email:{" "}
                    <a
                      href={`mailto:${details.email}`}
                    >
                      {details.email}
                    </a>
                  </p>

                  <p>
                    Website:{" "}
                    <a
                      href={details.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {details.website}
                    </a>
                  </p>
                </>
              )}

              {/* LOCATION SECTION */}
              {details.id === "location" && (
                <div className="mapContainer">
                  {/* ADMIN MAP EDIT */}
                  {isAdmin && (
                    <div
                      style={{
                        marginBottom: "12px",
                      }}
                    >
                      {!isEditingMap ? (
                        <button
                          onClick={() =>
                            setIsEditingMap(true)
                          }
                          style={{
                            padding: "8px 12px",
                            cursor: "pointer",
                            borderRadius: "4px",
                          }}
                        >
                          Update Map URL
                        </button>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            marginTop: "8px",
                            flexWrap: "wrap",
                          }}
                        >
                          <input
                            type="text"
                            value={tempUrl}
                            onChange={(e) =>
                              setTempUrl(e.target.value)
                            }
                            placeholder="Enter new Map Embed URL..."
                            style={{
                              flex: 1,
                              minWidth: "200px",
                              padding: "8px",
                              borderRadius: "4px",
                              border:
                                "1px solid #ccc",
                            }}
                          />

                          <button
                            onClick={handleMapSave}
                            style={{
                              padding: "8px 12px",
                              cursor: "pointer",
                            }}
                          >
                            Save
                          </button>

                          <button
                            onClick={handleCancel}
                            style={{
                              padding: "8px 12px",
                              cursor: "pointer",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* GOOGLE MAP */}
                  {details.mapUrl && (
                    <iframe
                      key={details.mapUrl}
                      title="Institute Location"
                      src={details.mapUrl}
                      width="100%"
                      height="250"
                      style={{
                        border: 0,
                        borderRadius: "8px",
                        marginTop: "10px",
                      }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  )}
                </div>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;