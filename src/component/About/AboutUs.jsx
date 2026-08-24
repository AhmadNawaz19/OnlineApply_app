import React from "react";
import "./style.css";

const AboutUs = () => {
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
      // Set your institute address or Google Maps place query here
      mapUrl: "https://maps.google.com/maps?q=University%20of%20Science%20and%20Technology%20Bannu&t=&z=15&ie=UTF8&iwloc=&output=embed",
    },
  ];

  return (
    <div className="aboutMain">
      <div id="leftMain">
        <div className="img">
          <img src="pic2.jpeg" alt="Ahmad Nawaz Profile" />
        </div>
        <div id="other">
          <a href="https://www.linkedin.com/in/ahmad-nawaz-7985a4363/" target="_blank" rel="noreferrer">
            <img src="linkedin.png" alt="LinkedIn Profile" />
          </a>
          <a href="https://github.com/AhmadNawaz19" target="_blank" rel="noreferrer">
            <img src="github.png" alt="GitHub Profile" />
          </a>
          <a href="https://www.hackerrank.com/profile/AhmadNawaz" target="_blank" rel="noreferrer">
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
                    <a href={details.website} target="_blank" rel="noreferrer">
                      {details.website}
                    </a>
                  </p>
                </>
              )}

              {/* Render Google Map Embed */}
              {details.mapUrl && (
                <div className="mapContainer">
                  <iframe
                    title="Institute Location"
                    src={details.mapUrl}
                    width="100%"
                    height="250"
                    style={{ border: 0, borderRadius: "8px", marginTop: "10px" }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
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