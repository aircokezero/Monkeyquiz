import React, { useState, useEffect } from "react";
import "./monkeyquiz-css.css";
import logo from "./monkeyquiz.jpg";
import heroImage from "./quiz_hero.avif";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from "react-router-dom";


const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shadow, setShadow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShadow(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header style={{ boxShadow: shadow ? "0 4px 20px rgba(0, 0, 0, 0.2)" : "none" }}>
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="MonkeyQuiz Logo" />
            <h1>MonkeyQuiz</h1>
          </Link>
        </div>
        <nav id="n">
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            <i className="fas fa-bars"></i>
          </button>
          <ul className={menuOpen ? "show" : ""} >
            <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

const Hero = () => {
  return (
    <section className="hero">
      <img src={heroImage} alt="Monkey" className="monkey-image" />
      <h2 className="chal">Challenge Your Knowledge with Fun Quizzes</h2>
      <p >MonkeyQuiz makes learning fun with interactive quizzes.</p>
      <Link to="/signup">
        <button className="cta-button">Get Started</button>
      </Link>
    </section>
  );
};

const Features = () => {
  return (
    <section className="features">
      <h2>Why Choose MonkeyQuiz?</h2>
      <div className="features-grid">
        <FeatureCard icon="fas fa-brain" title="Engaging Learning" description="Turn boring facts into exciting challenges." />
        <FeatureCard icon="fas fa-users" title="Social Experience" description="Compete with friends and see global rankings." />
        <FeatureCard icon="fas fa-paint-brush" title="Customizable" description="Create your own quizzes with ease." />
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-card">
    <div className="feature-icon"><i className={icon}></i></div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-column">
          <h3>MonkeyQuiz</h3>
          <p>Making learning fun with quizzes.</p>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Home page component
const HomeContent = () => {
  return (
    <>
      <Hero />
      <Features />
    </>
  );
};


const Home = () => {
  return (
    <div className="app-container">
        <Header />
        <HomeContent />
        <Footer />
    </div>
  );
};

export default Home;