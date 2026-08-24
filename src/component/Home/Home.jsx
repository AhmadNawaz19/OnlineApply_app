import React from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import { useState} from 'react'
import Footer from '../Footer/Footer.jsx'

const Home = () => {
   const [openIndex, setOpenIndex] = useState(null);
  const highlights = [
    {
      id: 1,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      title: "In-Person & Small Batches",
      description: "Learn directly in classroom sessions with limited students per batch to ensure personalized attention and mentorship."
    },
    {
      id: 2,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      ),
      title: "100% Practical Training",
      description: "Skip pure theory. Build real-world web applications and Python scripts from day one to build a strong portfolio."
    },
    {
      id: 3,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
          <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
        </svg>
      ),
      title: "Beginner Friendly",
      description: "No prior coding experience required. Our curriculum starts from absolute basics and smoothly advances to complex concepts."
    },
    {
      id: 4,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      ),
      title: "Career & Project Support",
      description: "Get guidance on resume building, interview preparation, and showcase-ready projects to jumpstart your career."
    }
  ];
  const courses = [
    {
      id: 1,
      badge: "Most Popular",
      title: "Software Engineering Courses",
      mode: "In-Person",
      description: "Master modern Software Engineering from scratch.",
      skills: ["HTML5", "CSS3", "JavaScript", "React.js", "Node.js", "Express.js", "MySQL", 'Git', 'GitHub', 'Firebase', 'Cloudinary', "Python", "OOP", "Odoo", "OWL Framework", "C++"],
      link: "/course"
    }
  ];
  const steps = [
    {
      step: "01",
      title: "Apply & Enroll",
      description: "Choose your preferred course (Web Development or Python) and submit your online application to secure a seat."
    },
    {
      step: "02",
      title: "Attend Classes",
      description: "Participate in interactive, in-person lectures led by experienced instructors with small batch sizes."
    },
    {
      step: "03",
      title: "Build Projects",
      description: "Apply your knowledge immediately by working on real-world practical projects to build a strong portfolio."
    },
    
  ];

  const faqs = [
    {
      question: "Do I need any prior programming or technical background?",
      answer: "No, prior coding experience is not required. Our courses are designed specifically for complete beginners and build up fundamental concepts step-by-step."
    },
    {
      question: "Are the classes held online or in-person?",
      answer: "Classes are held in-person at our institute campus to ensure hands-on guidance, instant bug fixing, and dedicated instructor support."
    },
    {
      question: "What is the class schedule and batch timing?",
      answer: "We offer flexible weekday evening (1:00 PM - 5:00 PM)  batches."
    },
    {
      question: "How do I apply and register for a batch?",
      answer: "Click the 'Apply' button on any course card or navigate to our application page, fill in your details, and our admissions team will contact you directly."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <div className='HomeMain'>

      {/* from here is the welcom message container */}
      <div className='welcomMsg'>
        <div className='msg'>
          <h1>WELCOME TO NAWAZ</h1>
          <h2>TECHNICAL</h2>
          <p>
            Nawaz Technical is an in-person institute providing beginner-friendly courses in Python and web development. Our main goal is to make high-quality tech education accessible to everyone. Through simple explanations and practical hands-on training, we help learners build a strong programming foundation.

          </p>
          <Link className='serviceBtn' to='/course'>Explore Courses</Link>
        </div>

        <div id="img">
            <img src="cod.jpg" alt="Coding student practicing software engineering" />
        </div>
      </div>

      <div id='services'>
        <div className="container">
        <div className="section-header">
          <span className="badge">Why Choose Us</span>
          <h2>Why Study at Nawaz Technical?</h2>
          <p>
            We provide structured, practical education designed to take you from a complete beginner to a job-ready developer.
          </p>
        </div>

        <div className="highlights-grid">
          {highlights.map((item) => (
            <div key={item.id} className="highlight-card">
              <div className="icon-wrapper">
                {item.icon}
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
        </div>
      </div>

      <section id="courses">
      <div className="container">
        <div className="section-header">
          <span className="badge">Featured Programs</span>
          <h2>Explore Our Courses</h2>
        </div>

        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="card-header">
                <span className="course-badge">{course.badge}</span>
                <h3>{course.title}</h3>
                <div className="meta-info">
                  <span>📍 {course.mode}</span>
                </div>
              </div>

              <p className="description">{course.description}</p>

              <div className="skills-tags">
                {course.skills.map((skill, index) => (
                  <span key={index} className="tag">{skill}</span>
                ))}
              </div>

              <div className="card-footer">
                <Link to={course.link} className="serviceBtn">
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      </section>

      <section id="about">
      <div className="container">
        <div className="about-wrapper">
          <div className="about-content">
            <span className="badge">About Nawaz Technical</span>
            <h2>Empowering the Next Generation of Tech Talent</h2>
            <p className="description">
              Nawaz Technical is an in-person institute providing beginner-friendly courses in Python and web development. Our main goal is to make high-quality tech education accessible to everyone. Through simple explanations and practical hands-on training, we help learners build a strong programming foundation. Ultimately, we prepare students to confidently seize real-world opportunities in the technology industry.
            </p>

            <div className="stats-grid">
              <div className="stat-item">
                <h3>100%</h3>
                <p>Practical Learning</p>
              </div>
              <div className="stat-item">
                <h3>Small</h3>
                <p>Batch Sizes</p>
              </div>
              <div className="stat-item">
                <h3>Direct</h3>
                <p>Instructor Support</p>
              </div>
            </div>

            <div className="about-cta">
              <Link to="/aboutUs" className="serviceBtn">
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
      </section>

      <section id="how-it-works">
      <div className="container">
        <div className="section-header">
          <span className="badge">Simple Process</span>
          <h2>Your Journey to Becoming a Developer</h2>
          <p>
            We make starting your tech career straightforward with a structured 4-step path.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((item) => (
            <div key={item.step} className="step-card">
              <div className="step-number">{item.step}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
      </section>

      <section id="faq">
        <div className="container">
          <div className="section-header">
            <span className="badge">Got Questions?</span>
            <h2>Frequently Asked Questions</h2>
            <p>
              Find answers to common questions about our courses, schedule, and learning process.
            </p>
          </div>

          <div className="faq-accordion">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${openIndex === index ? 'active' : ''}`}
              >
                <button 
                  className="faq-question" 
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
                </button>
                {openIndex === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="cta">
        <div className="container">
          <div className="cta-wrapper">
            <span className="badge">Start Learning</span>
            <h2>Ready to Launch Your Tech Career?</h2>
            <p>
              Join Nawaz Technical today and acquire practical coding skills through hands-on, in-person training.
            </p>
            <div className="cta-actions">
              <Link to="/course" className="serviceBtn primaryBtn">
                Register Now
              </Link>
            
            </div>
          </div>
        </div>
      </section>

    <Footer/>

    </div>
  )
}

export default Home