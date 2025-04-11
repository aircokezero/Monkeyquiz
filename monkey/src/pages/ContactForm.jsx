import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import './ContactForm.css';

const ContactForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  // Initialize EmailJS once when component mounts
  useEffect(() => {
    // Replace with your actual public key
    emailjs.init("wWJl496kFH1DB9fxF");
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: 'info', message: 'Sending your message...' });
    
    try {
      // Send the email using EmailJS
      const response = await emailjs.send(
        'service_ub042gn', // Replace with your actual service ID
        'template_y34q0vb', // Replace with your actual template ID
        {
          from_name: formData.name,
          reply_to: formData.email,
          message: formData.message
        }
      );
      
      console.log('SUCCESS!', response.status, response.text);
      
      // Success message
      setSubmitStatus({ 
        type: 'success', 
        message: 'Message sent successfully! We\'ll get back to you soon.' 
      });
      
      // Reset the form
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
      
    } catch (error) {
      // Error handling
      console.error('FAILED...', error);
      
      let errorMessage = 'Something went wrong! Please try again later.';
      
      // More specific error messages based on common issues
      if (error.text && error.text.includes('Invalid public key')) {
        errorMessage = 'Configuration error: Invalid EmailJS public key.';
      } else if (error.text && error.text.includes('service_')) {
        errorMessage = 'Configuration error: Invalid EmailJS service ID.';
      } else if (error.text && error.text.includes('template_')) {
        errorMessage = 'Configuration error: Invalid EmailJS template ID.';
      }
      
      setSubmitStatus({ type: 'error', message: errorMessage });
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="contact-container">
      {/* Decorative elements */}
      <div className="decoration circle1"></div>
      <div className="decoration circle2"></div>
      <div className="decoration plus"></div>
      
      <div className="container" id="con">
        <div className="header" id="head">
          <div className="nav-item"></div>
          <div className="nav-item"></div>
          <div className="nav-item"></div>
          <div className="nav-item"></div>
        </div>
        
        <form id="contactForm" onSubmit={handleSubmit}>
          <div className="contact-content">
            <div className="form-section">
              <h1>Contact us</h1>
              
              {submitStatus && (
                <div className={`status-message ${submitStatus.type}`}>
                  {submitStatus.message}
                </div>
              )}
              
              <div className="input-group">
                <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8bacc7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="User icon">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input 
                  type="text" 
                  placeholder="Name" 
                  id="myname" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="input-group">
                <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8bacc7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Email icon">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input 
                  type="email" 
                  placeholder="Email" 
                  id="myemail" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="input-group">
                <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8bacc7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Message icon">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <textarea 
                  placeholder="Message" 
                  id="mymessage" 
                  name="message" 
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <button id="btt" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
            
            <div className="image-section">
              {/* You can add an image here if desired */}
              <div className="contact-illustration">
                <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#9a36dd" />
                      <stop offset="100%" stopColor="#5a348c" />
                    </linearGradient>
                  </defs>
                  <circle cx="250" cy="250" r="200" fill="url(#gradient)" opacity="0.1" />
                  <path d="M100,250 Q250,100 400,250 Q250,400 100,250 Z" fill="url(#gradient)" opacity="0.2" />
                  <circle cx="250" cy="250" r="120" fill="url(#gradient)" opacity="0.3" />
                </svg>
              </div>
            </div>
          </div>
        </form>
        <button className="button back" onClick={() => navigate("/Testpage")}>
          ⬅ Back to Main Page
        </button>
      </div>
    </div>
  );
};

export default ContactForm;