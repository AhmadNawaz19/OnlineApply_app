import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue, set } from "firebase/database";
import { auth, database } from "../../Firebase/Firebase"; // CHANGE PATH IF NEEDED
import "./style.css";

const DEFAULT_MAP_URL =
  "https://maps.google.com/maps?q=University%20of%20Science%20and%20Technology%20Bannu&t=&z=15&ie=UTF8&iwloc=&output=embed";

const AboutUs = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [mapUrl, setMapUrl] = useState(DEFAULT_MAP_URL);
  const [tempUrl, setTempUrl] = useState(DEFAULT_MAP_URL);
  const [isEditingMap, setIsEditingMap] = useState(false);
  const [loadingMap, setLoadingMap] = useState(true);
  const [saving, setSaving] = useState(false);

  // ============================
  // CHECK AUTH + LOAD MAP
  // ============================
  useEffect(() => {
    const mapRef = ref(database, "settings/mapConfig");

    // Check current Firebase user
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      const isCurrentUserAdmin =
        user?.email?.toLowerCase() === "nawaztechnical@gmail.com";

      setIsAdmin(isCurrentUserAdmin);
    });

    // Listen for map changes in Realtime Database
    const unsubscribeMap = onValue(
      mapRef,
      (snapshot) => {
        const data = snapshot.val();

        if (data?.url) {
          setMapUrl(data.url);
          setTempUrl(data.url);
        } else {
          setMapUrl(DEFAULT_MAP_URL);
          setTempUrl(DEFAULT_MAP_URL);
        }

        setLoadingMap(false);
      },
      (error) => {
        console.error("Firebase read error:", error.code, error.message);

        setLoadingMap(false);
      },
    );

    return () => {
      unsubscribeAuth();
      unsubscribeMap();
    };
  }, []);

  // ============================
  // SAVE MAP URL
  // ============================
  const handleMapSave = async () => {
    const newUrl = tempUrl.trim();

    if (!newUrl) {
      alert("Please enter a map URL.");
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      alert("You are not logged in.");
      return;
    }

    if (user.email?.toLowerCase() !== "nawaztechnical@gmail.com") {
      alert("You do not have permission to update the map.");
      return;
    }

    try {
      setSaving(true);

      const mapRef = ref(database, "settings/mapConfig");

      await set(mapRef, {
        url: newUrl,
      });

      // onValue will also update these automatically
      setMapUrl(newUrl);
      setTempUrl(newUrl);
      setIsEditingMap(false);

      alert("Map URL updated successfully.");
    } catch (error) {
      console.error("Firebase save error:", error.code, error.message);

      alert(`Failed to save map: ${error.code || ""} ${error.message || ""}`);
    } finally {
      setSaving(false);
    }
  };

  // ============================
  // CANCEL EDITING
  // ============================
  const handleCancel = () => {
    setTempUrl(mapUrl);
    setIsEditingMap(false);
  };

  // ============================
  // DETAILS
  // ============================
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
    },
  ];

  return (
    <div className="aboutMain">
      {/* LEFT SECTION */}
      <div id="leftMain">
        <div className="img">
          <img src="pic2.jpeg" alt="Ahmad Nawaz Profile" />
        </div>

        <div id="other">
          <a
            href="https://www.linkedin.com/in/ahmad-nawaz-7985a4363/"
            target="_blank"
            rel="noreferrer"
          >
            <img src="linkedin.png" alt="LinkedIn Profile" />
          </a>

          <a
            href="https://github.com/AhmadNawaz19"
            target="_blank"
            rel="noreferrer"
          >
            <img src="github.png" alt="GitHub Profile" />
          </a>

          <a
            href="https://www.hackerrank.com/profile/AhmadNawaz"
            target="_blank"
            rel="noreferrer"
          >
            <img src="hacker.png" alt="HackerRank Profile" />
          </a>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div id="rightMain">
        {Details.map((details) => (
          <React.Fragment key={details.id}>
            <h2 className="title">{details.title}</h2>

            <div className="description">
              {/* NORMAL DESCRIPTION */}
              {details.description && <p>{details.description}</p>}

              {/* CONTACT */}
              {details.id === "contact" && (
                <>
                  <p>
                    Phone: <a href={`tel:${details.phone}`}>{details.phone}</a>
                  </p>

                  <p>
                    Email:{" "}
                    <a href={`mailto:${details.email}`}>{details.email}</a>
                  </p>

                  <p>
                    Website:{" "}
                    <a href={details.website} target="_blank" rel="noreferrer">
                      {details.website}
                    </a>
                  </p>
                </>
              )}

              {/* MAP SECTION */}
              {details.id === "location" && (
                <div className="mapContainer">
                  {/* ADMIN CONTROLS */}
                  {isAdmin && (
                    <div
                      style={{
                        marginBottom: "12px",
                      }}
                    >
                      {!isEditingMap ? (
                        <button
                          type="button"
                          onClick={() => setIsEditingMap(true)}
                        >
                          Update Map URL
                        </button>
                      ) : (
                        <div className="mapEditContainer">
                          <input
                            type="url"
                            value={tempUrl}
                            onChange={(e) => setTempUrl(e.target.value)}
                            placeholder="Paste Google Maps embed URL"
                            style={{
                              width: "100%",
                              padding: "10px",
                              marginBottom: "8px",
                            }}
                          />

                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              flexWrap: "wrap",
                            }}
                          >
                            <button
                              type="button"
                              onClick={handleMapSave}
                              disabled={saving}
                            >
                              {saving ? "Saving..." : "Save"}
                            </button>

                            <button
                              type="button"
                              onClick={handleCancel}
                              disabled={saving}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* MAP LOADING */}
                  {loadingMap && <p>Loading map...</p>}

                  {/* GOOGLE MAP */}
                  {!loadingMap && mapUrl && (
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mapImageLink"
                    >
                      <img
                        src="/map.jpg"
                        alt="Open institute location in Google Maps"
                        className="mapImage"
                      />

                      <div className="mapOverlay">
                        <span>📍 View Location on Google Maps</span>
                      </div>
                    </a>
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
