import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get, set } from "firebase/database";
import "./style.css";

const AboutUs = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [mapUrl, setMapUrl] = useState(
    "https://maps.google.com/maps?q=University%20of%20Science%20and%20Technology%20Bannu&t=&z=15&ie=UTF8&iwloc=&output=embed"
  );

  const [isEditingMap, setIsEditingMap] = useState(false);
  const [tempUrl, setTempUrl] = useState(mapUrl);

  const db = getDatabase();
  const mapRef = ref(db, "settings/mapConfig");

  // 1. Check Auth & Load Map URL from Realtime DB on Mount
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === "nawaztechnical@gmail.com") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    const fetchMapUrl = async () => {
      try {
        const snapshot = await get(mapRef);
        if (snapshot.exists() && snapshot.val().url) {
          setMapUrl(snapshot.val().url);
          setTempUrl(snapshot.val().url);
        }
      } catch (error) {
        console.error("Error loading map URL from Realtime Database:", error);
      }
    };

    fetchMapUrl();

    return () => unsubscribe();
  }, [mapRef]);

  // 2. Persist Updated Map URL to Realtime DB
  const handleMapSave = async () => {
    try {
      await set(mapRef, { url: tempUrl });
      setMapUrl(tempUrl);
      setIsEditingMap(false);
      alert("Map URL updated successfully...");
    } catch (error) {
      console.error("Error saving map URL:", error);
      alert("Failed to save map URL.");
    }
  };

  const Details = [
    {
      id: "intro",
      title: "INTRODUCTION",
      description: `
        My name is Ahmad Nawaz. I am a software engineer
        with strong experience in both front-end and back-end technologies.
        I work with modern tools like HTML, CSS, JavaScript, React.js,
        Next.js, Node.js, Express.js, Python, XML, OWL, Postgres, MySQL to
        build complete web and Odoo applications.
      `,
    },
    {
      id: "skills",
      title: "SKILLS",
      description: `
        HTML, CSS, JavaScript, React.js, Next.js, Node.js, Express.js, Python, XML, OWL, Postgres, MySQL, Firebase, Cloudinary, Git, Github, CI/CD, Deployment, REST API, OAuth 2.0.
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

  return (
    <div className="aboutMain">
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

      <div id="rightMain">
        {Details.map((details) => (
          <React.Fragment key={details.id}>
            <h2 className="title">{details.title}</h2>
            <div className="description">
              {details.description && <p>{details.description}</p>}

              {/* Render Contact Details */}
              {details.phone && (
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

              {/* Render Google Map Embed & Admin Edit Form */}
              {details.id === "location" && (
                <div className="mapContainer">
                  {isAdmin && (
                    <div style={{ marginBottom: "12px" }}>
                      {!isEditingMap ? (
                        <button
                          onClick={() => setIsEditingMap(true)}
                          style={{
                            padding: "6px 12px",
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
                          }}
                        >
                          <input
                            type="text"
                            value={tempUrl}
                            onChange={(e) => setTempUrl(e.target.value)}
                            placeholder="Enter new Map Embed URL..."
                            style={{
                              flex: 1,
                              padding: "6px",
                              borderRadius: "4px",
                              border: "1px solid #ccc",
                            }}
                          />
                          <button onClick={handleMapSave}>Save</button>
                          <button onClick={() => setIsEditingMap(false)}>
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Dynamic map iframe */}
                  {details.mapUrl && (
                    <iframe
                      title="Institute Location"
                      src={details.mapUrl}
                      width="100%"
                      height="250"
                      style={{
                        border: 0,
                        borderRadius: "8px",
                        marginTop: "10px",
                      }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
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